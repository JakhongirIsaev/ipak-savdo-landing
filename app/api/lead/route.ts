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

  // Lead intake is multipart-only. The public form (and the legacy form) always
  // submit the three mandatory documents as multipart/form-data; rejecting any
  // other content type closes the path where a plain JSON POST could create a
  // document-free lead. No production caller needs JSON intake. If an internal
  // JSON caller is ever required, gate it behind explicit auth rather than
  // reopening this public path.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return Response.json({ ok: false, error: "unsupported_media_type" }, { status: 415 });
  }
  return handleMultipart(req, ip);
}

// ─── Multipart path (with patent / passport / shop documents) ───
const DOC_FIELDS: { field: string; kind: LeadDocKind; label: string }[] = [
  { field: "patent", kind: "patent", label: "📄 Патент" },
  { field: "passport", kind: "passport", label: "🪪 Паспорт директора/владельца" },
  { field: "shop", kind: "shop", label: "🏪 Фото магазина" },
];

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

  const businessType = fieldStr(form.get("business_type"));
  const raw = {
    business_name: fieldNullable(form.get("business_name")),
    business_type: businessType,
    business_type_other: businessType === "other" ? fieldNullable(form.get("business_type_other")) : null,
    owner_name: fieldStr(form.get("owner_name")),
    owner_contact: fieldStr(form.get("owner_contact")),
    needs_equipment: form.get("needs_equipment") === "on" || form.get("needs_equipment") === "true",
    comment: fieldNullable(form.get("comment")),
    source: fieldNullable(form.get("source")) ?? undefined,
    utm_source: fieldNullable(form.get("utm_source")),
    utm_medium: fieldNullable(form.get("utm_medium")),
    utm_campaign: fieldNullable(form.get("utm_campaign")),
    language: fieldStr(form.get("language")),
  };

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const docs: { kind: LeadDocKind; label: string; file: File }[] = [];
  for (const d of DOC_FIELDS) {
    const entry = form.get(d.field);
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

    // 1) text card first (lead has no file_ids yet → card only, no duplicate album)
    const { messageId } = await notifyNewLead(lead);

    // 2) durable private backup (best effort; no-op if Supabase not configured)
    const storagePaths: Record<LeadDocKind, string | null> = { patent: null, passport: null, shop: null };
    await Promise.all(
      docs.map(async (d) => {
        storagePaths[d.kind] = await uploadLeadDoc(lead.id, d.kind, d.file);
      }),
    );

    // 3) one album to the BirLiy Leads group, capture Telegram file_ids
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    let fileIds: (string | null)[] = docs.map(() => null);
    if (token && chatId) {
      fileIds = await sendLeadDocsAlbum(token, chatId, lead, docs.map((d) => ({ file: d.file, label: d.label })));
      // Album failed entirely → the card arrived without photos. Surface the gap
      // in the group instead of leaving it silent (files are still saved).
      if (docs.length > 0 && fileIds.every((id) => !id)) {
        await notifyDocsUndelivered(lead);
      }
    }

    // 4) persist references (only what we actually got)
    const patch: Partial<NewLead> = {};
    if (messageId) patch.telegramMessageId = messageId;
    if (fileIds[0]) patch.patentFileId = fileIds[0];
    if (fileIds[1]) patch.passportFileId = fileIds[1];
    if (fileIds[2]) patch.shopPhotoFileId = fileIds[2];
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
