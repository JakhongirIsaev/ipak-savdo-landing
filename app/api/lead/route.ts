import { db, leads, leadEvents } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { Lead, NewLead } from "@/lib/db/schema";
import { leadInputSchema, type LeadInput } from "@/lib/validators/lead";
import { validateLeadFile, sniffImageType } from "@/lib/validators/lead-files";
import { leadRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/http/get-ip";
import { notifyNewLead, notifyDocsUndelivered } from "@/lib/telegram/notify";
import { sendLeadDocsAlbum } from "@/lib/telegram/send-docs";
import { uploadLeadDoc, type LeadDocKind } from "@/lib/supabase/storage";
import { forwardLeadToMaster } from "@/lib/master/forward-lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baseValues(data: LeadInput, req: Request, ip: string | null): NewLead {
  return {
    businessName: data.business_name ?? "",
    businessType: data.business_type,
    businessTypeOther: data.business_type_other ?? null,
    ownerName: data.owner_name,
    ownerContact: data.owner_contact,
    needsEquipment: data.needs_equipment,
    comment: data.comment ?? null,
    source: data.source ?? "direct",
    utmSource: data.utm_source ?? null,
    utmMedium: data.utm_medium ?? null,
    utmCampaign: data.utm_campaign ?? null,
    referrer: req.headers.get("referer"),
    userAgent: req.headers.get("user-agent"),
    ip,
    language: data.language,
  };
}

async function insertLead(values: NewLead): Promise<Lead> {
  const [inserted] = await db.insert(leads).values(values).returning();
  await db.insert(leadEvents).values({
    leadId: inserted.id,
    fromStatus: null,
    toStatus: "new",
    actor: "system",
  });
  return inserted;
}

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);

  if (!leadRateLimiter.check(ip)) {
    return Response.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  // Lead intake is multipart-only. The public form always submits the contact
  // fields as multipart/form-data (with the three documents attached only when
  // the owner chooses to add them on the optional second step). Rejecting any
  // other content type closes the path where a plain JSON POST could forge a
  // lead. No production caller needs JSON intake. If an internal JSON caller is
  // ever required, gate it behind explicit auth rather than reopening this
  // public path.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return Response.json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }
  return handleMultipart(req, ip);
}

// ─── Multipart path (optional patent / passport / shop documents) ───
//
// Documents are OPTIONAL (BR-04): the FIRST lead is captured with contact info
// only, so an owner is never blocked from reaching us. Any documents that ARE
// attached must still be valid images (size + MIME + magic-byte sniff); they are
// just no longer required. The form's optional second step (and the Telegram
// fallback) collect documents after the contact-only lead is already saved.
const DOC_FIELDS: { field: string; kind: LeadDocKind; label: string }[] = [
  { field: "patent", kind: "patent", label: "📄 Патент" },
  { field: "passport", kind: "passport", label: "🪪 Паспорт директора/владельца" },
  { field: "shop", kind: "shop", label: "🏪 Фото магазина" },
];

// A form file part is "present" when it is a File with bytes. An empty file part
// (size 0) is what browsers send for an untouched <input type=file>, so it is
// treated as "not provided" rather than an invalid upload.
function hasFile(v: FormDataEntryValue | null): v is File {
  return v instanceof File && v.size > 0;
}

function fieldStr(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}
function fieldNullable(v: FormDataEntryValue | null): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

async function handleMultipart(req: Request, ip: string | null): Promise<Response> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const hp = form.get("_hp");
  if (typeof hp === "string" && hp.length > 0) {
    return Response.json({ ok: true, id: 0 });
  }

  const language = fieldStr(form.get("language"));
  // business_type is OPTIONAL in the public form (BR-04 friction cut): the lead
  // is captured from name + phone + city alone. An absent/empty type is folded
  // to "other" (a value that already exists everywhere: admin labels, Telegram
  // formatting, filters) with a locale-aware "not specified" label, so the stored
  // enum stays valid and the manager can ask the type later. No schema/migration
  // change. A type the owner DID pick (including a real "other") is untouched.
  const rawType = fieldStr(form.get("business_type"));
  const typeSpecified = rawType.length > 0;
  const businessType = typeSpecified ? rawType : "other";
  const notSpecifiedLabel = language === "uz" ? "Belgilanmagan" : "Не указан";
  const businessTypeOther = !typeSpecified
    ? notSpecifiedLabel
    : rawType === "other"
      ? fieldNullable(form.get("business_type_other"))
      : null;
  const raw = {
    business_name: fieldNullable(form.get("business_name")),
    business_type: businessType,
    business_type_other: businessTypeOther,
    owner_name: fieldStr(form.get("owner_name")),
    owner_contact: fieldStr(form.get("owner_contact")),
    needs_equipment: form.get("needs_equipment") === "on" || form.get("needs_equipment") === "true",
    comment: fieldNullable(form.get("comment")),
    source: fieldNullable(form.get("source")) ?? undefined,
    utm_source: fieldNullable(form.get("utm_source")),
    utm_medium: fieldNullable(form.get("utm_medium")),
    utm_campaign: fieldNullable(form.get("utm_campaign")),
    language,
  };

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Documents are optional. Skip any field with no file; validate only the ones
  // the owner actually attached (size + MIME + magic-byte sniff, unchanged). A
  // contact-only submission produces an empty `docs` array and a valid lead.
  const docs: { kind: LeadDocKind; label: string; file: File }[] = [];
  for (const d of DOC_FIELDS) {
    const entry = form.get(d.field);
    if (!hasFile(entry)) continue;
    const result = validateLeadFile(entry);
    if (!result.ok) {
      return Response.json({ ok: false, error: "file", reason: result.reason, field: d.field }, { status: 400 });
    }
    // The declared MIME passed; now confirm the bytes match (anti-spoofing).
    if (!(await sniffImageType(result.file))) {
      return Response.json({ ok: false, error: "file", reason: "type", field: d.field }, { status: 400 });
    }
    docs.push({ kind: d.kind, label: d.label, file: result.file });
  }

  try {
    const lead = await insertLead(baseValues(parsed.data, req, ip));

    // 0) forward to the BirLiy master leads admin (single source of truth).
    // Best-effort: the lead is already saved locally, so a master outage never
    // breaks intake — but failures are logged (not swallowed) so the sync can't
    // silently stop the way it did before this was wired up.
    await forwardLeadToMaster(lead);

    // 1) text card first (lead has no file_ids yet → card only, no duplicate album)
    const { messageId } = await notifyNewLead(lead);

    // 2) durable private backup (best effort; no-op if Supabase not configured)
    const storagePaths: Record<LeadDocKind, string | null> = { patent: null, passport: null, shop: null };
    await Promise.all(
      docs.map(async (d) => {
        storagePaths[d.kind] = await uploadLeadDoc(lead.id, d.kind, d.file);
      }),
    );

    // 3) one album to the BirLiy Leads group, capture Telegram file_ids.
    // Skip entirely for a contact-only lead (no docs → no album). file_ids are
    // mapped back to their document kind (not array position), so a partial set
    // of attached docs still lands in the right columns.
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const fileIdByKind: Partial<Record<LeadDocKind, string>> = {};
    if (token && chatId && docs.length > 0) {
      const fileIds = await sendLeadDocsAlbum(token, chatId, lead, docs.map((d) => ({ file: d.file, label: d.label })));
      docs.forEach((d, i) => {
        if (fileIds[i]) fileIdByKind[d.kind] = fileIds[i] as string;
      });
      // Album failed entirely → the card arrived without photos. Surface the gap
      // in the group instead of leaving it silent (files are still saved).
      if (fileIds.every((id) => !id)) {
        await notifyDocsUndelivered(lead);
      }
    }

    // 4) persist references (only what we actually got)
    const patch: Partial<NewLead> = {};
    if (messageId) patch.telegramMessageId = messageId;
    if (fileIdByKind.patent) patch.patentFileId = fileIdByKind.patent;
    if (fileIdByKind.passport) patch.passportFileId = fileIdByKind.passport;
    if (fileIdByKind.shop) patch.shopPhotoFileId = fileIdByKind.shop;
    if (storagePaths.patent) patch.patentStoragePath = storagePaths.patent;
    if (storagePaths.passport) patch.passportStoragePath = storagePaths.passport;
    if (storagePaths.shop) patch.shopStoragePath = storagePaths.shop;
    if (Object.keys(patch).length > 0) {
      await db.update(leads).set(patch).where(eq(leads.id, lead.id));
    }

    return Response.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("Lead (multipart) insert failed", err, {
      business_type: parsed.data.business_type,
      language: parsed.data.language,
    });
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }
}
