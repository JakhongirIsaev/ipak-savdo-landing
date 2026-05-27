import { db, leads, leadEvents } from "@/lib/db";
import { eq } from "drizzle-orm";
import { leadInputSchema } from "@/lib/validators/lead";
import { leadRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/http/get-ip";
import { notifyNewLead } from "@/lib/telegram/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);

  if (!leadRateLimiter.check(ip)) {
    return Response.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (typeof raw === "object" && raw !== null && "_hp" in raw && typeof (raw as { _hp: unknown })._hp === "string" && (raw as { _hp: string })._hp.length > 0) {
    return Response.json({ ok: true, id: 0 });
  }

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const [inserted] = await db
      .insert(leads)
      .values({
        businessName: data.business_name,
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
      })
      .returning();

    // Initial audit-log row
    await db.insert(leadEvents).values({
      leadId: inserted.id,
      fromStatus: null,
      toStatus: "new",
      actor: "system",
    });

    // Notify + capture message_id
    const { messageId } = await notifyNewLead(inserted);
    if (messageId) {
      await db
        .update(leads)
        .set({ telegramMessageId: messageId })
        .where(eq(leads.id, inserted.id));
    }

    return Response.json({ ok: true, id: inserted.id });
  } catch (err) {
    console.error("Lead insert failed", err, {
      business_type: data.business_type,
      language: data.language,
    });
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }
}
