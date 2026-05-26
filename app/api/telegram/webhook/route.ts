import { eq } from "drizzle-orm";
import { db, leads, leadEvents } from "@/lib/db";
import type { Lead } from "@/lib/db/schema";
import { handleTelegramUpdate, type WebhookDeps, type TelegramUpdate } from "@/lib/telegram/webhook";
import { editLeadMessage, answerCallback } from "@/lib/telegram/edit-message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

const deps: WebhookDeps = {
  async findLead(id) {
    const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return (rows[0] as Lead | undefined) ?? null;
  },
  async updateLeadStatus(id, newStatus, actor) {
    await db
      .update(leads)
      .set({
        status: newStatus,
        lastStatusChangeAt: new Date(),
        lastChangedBy: actor,
      })
      .where(eq(leads.id, id));
  },
  async insertEvent(row) {
    await db.insert(leadEvents).values(row);
  },
  editMessage: editLeadMessage,
  answerCb: answerCallback,
  chatId: process.env.TELEGRAM_CHAT_ID ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
};

export async function POST(req: Request): Promise<Response> {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) {
    console.error("TELEGRAM_WEBHOOK_SECRET not configured");
    return new Response("not configured", { status: 503 });
  }
  const received = req.headers.get("x-telegram-bot-api-secret-token");
  if (!received || !timingSafeEqual(received, expected)) {
    return new Response("unauthorized", { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  try {
    await handleTelegramUpdate(update, deps);
  } catch (err) {
    console.error("webhook handler error", err);
  }

  return Response.json({ ok: true });
}
