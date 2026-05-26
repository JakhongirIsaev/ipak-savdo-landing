import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, leads, leadEvents } from "@/lib/db";
import { leadStatuses, type Lead } from "@/lib/db/schema";
import { buildLeadKeyboard } from "@/lib/telegram/buttons";
import { formatLeadMessage } from "@/lib/telegram/format";
import { editLeadMessage } from "@/lib/telegram/edit-message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  to_status: z.enum(leadStatuses),
});

const ADMIN_ACTOR = "admin@web";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }
  const toStatus = parsed.data.to_status;

  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  const lead = rows[0] as Lead | undefined;
  if (!lead) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (lead.status === toStatus) {
    return Response.json({ ok: true, id, unchanged: true });
  }

  await db
    .update(leads)
    .set({ status: toStatus, lastStatusChangeAt: new Date(), lastChangedBy: ADMIN_ACTOR })
    .where(eq(leads.id, id));

  await db.insert(leadEvents).values({
    leadId: id,
    fromStatus: lead.status,
    toStatus,
    actor: ADMIN_ACTOR,
  });

  if (lead.telegramMessageId) {
    const refreshed: Lead = {
      ...lead,
      status: toStatus,
      lastChangedBy: ADMIN_ACTOR,
      lastStatusChangeAt: new Date(),
    };
    await editLeadMessage({
      chatId: process.env.TELEGRAM_CHAT_ID ?? "",
      messageId: lead.telegramMessageId,
      text: formatLeadMessage(refreshed, process.env.NEXT_PUBLIC_SITE_URL ?? ""),
      keyboard: buildLeadKeyboard(id, toStatus),
    });
  }

  return Response.json({ ok: true, id, to_status: toStatus });
}
