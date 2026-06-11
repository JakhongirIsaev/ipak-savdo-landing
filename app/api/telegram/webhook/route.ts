import { eq } from "drizzle-orm";
import { db, leads, leadEvents, botSessions } from "@/lib/db";
import type { Lead, BotSession } from "@/lib/db/schema";
import { handleTelegramUpdate, type WebhookDeps, type TelegramUpdate } from "@/lib/telegram/webhook";
import { editLeadMessage, answerCallback } from "@/lib/telegram/edit-message";
import { notifyNewLead } from "@/lib/telegram/notify";
import type { AnketaDeps, AnketaLead, BotSessionState } from "@/lib/telegram/anketa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function toSessionState(row: BotSession): BotSessionState {
  return {
    telegramUserId: row.telegramUserId,
    chatId: row.chatId,
    step: row.step,
    name: row.name,
    phone: row.phone,
    businessType: row.businessType,
    city: row.city,
    patentFileId: row.patentFileId,
    passportFileId: row.passportFileId,
  };
}

const TELEGRAM_API = "https://api.telegram.org";

async function sendTelegramMessage(chatId: string, text: string, replyKeyboard?: string[][]): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("Telegram token missing — skipping sendMessage");
    return;
  }
  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (replyKeyboard) {
    body.reply_markup = { keyboard: replyKeyboard, resize_keyboard: true, one_time_keyboard: true };
  } else {
    body.reply_markup = { remove_keyboard: true };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Telegram sendMessage failed", res.status, text);
    }
  } catch (err) {
    console.error("Telegram sendMessage error", err);
  } finally {
    clearTimeout(timeout);
  }
}

const anketaDeps: AnketaDeps = {
  async getSession(userId) {
    const rows = await db.select().from(botSessions).where(eq(botSessions.telegramUserId, userId)).limit(1);
    const row = rows[0] as BotSession | undefined;
    return row ? toSessionState(row) : null;
  },
  async saveSession(s) {
    await db
      .insert(botSessions)
      .values({
        telegramUserId: s.telegramUserId,
        chatId: s.chatId,
        step: s.step,
        name: s.name,
        phone: s.phone,
        businessType: s.businessType,
        city: s.city,
        patentFileId: s.patentFileId,
        passportFileId: s.passportFileId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: botSessions.telegramUserId,
        set: {
          chatId: s.chatId,
          step: s.step,
          name: s.name,
          phone: s.phone,
          businessType: s.businessType,
          city: s.city,
          patentFileId: s.patentFileId,
          passportFileId: s.passportFileId,
          updatedAt: new Date(),
        },
      });
  },
  async clearSession(userId) {
    await db.delete(botSessions).where(eq(botSessions.telegramUserId, userId));
  },
  async createLead(data: AnketaLead) {
    const [inserted] = await db
      .insert(leads)
      .values({
        businessName: data.name,
        businessType: data.businessType,
        ownerName: data.name,
        ownerContact: data.phone,
        needsEquipment: false,
        city: data.city,
        patentFileId: data.patentFileId,
        passportFileId: data.passportFileId,
        shopPhotoFileId: data.shopPhotoFileId,
        source: data.source,
        language: data.language,
      })
      .returning();

    await db.insert(leadEvents).values({
      leadId: inserted.id,
      fromStatus: null,
      toStatus: "new",
      actor: "system",
    });

    return inserted.id;
  },
  async notifyLead(leadId) {
    const rows = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    const lead = rows[0] as Lead | undefined;
    if (!lead) return;
    const { messageId } = await notifyNewLead(lead);
    if (messageId) {
      await db.update(leads).set({ telegramMessageId: messageId }).where(eq(leads.id, leadId));
    }
  },
  sendMessage: sendTelegramMessage,
};

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
  anketa: anketaDeps,
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
