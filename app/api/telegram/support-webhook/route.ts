import { eq } from "drizzle-orm";
import { db, leads, leadEvents, supportSessions } from "@/lib/db";
import type { Lead, SupportSession } from "@/lib/db/schema";
import { notifyNewLead } from "@/lib/telegram/notify";
import {
  handleSupportMessage,
  type SupportDeps,
  type SupportLead,
  type SupportSessionState,
  type SupportMessage,
} from "@/lib/telegram/support";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SupportUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number; type?: string };
    text?: string;
    from?: { id: number };
  };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function toSessionState(row: SupportSession): SupportSessionState {
  return {
    telegramUserId: row.telegramUserId,
    chatId: row.chatId,
    step: row.step,
    language: row.language,
    name: row.name,
    phone: row.phone,
    question: row.question,
  };
}

const TELEGRAM_API = "https://api.telegram.org";

async function sendTelegramMessage(chatId: string, text: string, keyboard?: unknown): Promise<void> {
  const token = process.env.TELEGRAM_SUPPORT_BOT_TOKEN;
  if (!token) {
    console.error("TELEGRAM_SUPPORT_BOT_TOKEN missing — skipping sendMessage");
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, reply_markup: keyboard ?? { remove_keyboard: true } }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Support sendMessage failed", res.status, body);
    }
  } catch (err) {
    console.error("Support sendMessage error", err);
  } finally {
    clearTimeout(timeout);
  }
}

const supportDeps: SupportDeps = {
  async getSession(userId) {
    const rows = await db
      .select()
      .from(supportSessions)
      .where(eq(supportSessions.telegramUserId, userId))
      .limit(1);
    const row = rows[0] as SupportSession | undefined;
    return row ? toSessionState(row) : null;
  },
  async saveSession(s) {
    await db
      .insert(supportSessions)
      .values({
        telegramUserId: s.telegramUserId,
        chatId: s.chatId,
        step: s.step,
        language: s.language,
        name: s.name,
        phone: s.phone,
        question: s.question,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: supportSessions.telegramUserId,
        set: {
          chatId: s.chatId,
          step: s.step,
          language: s.language,
          name: s.name,
          phone: s.phone,
          question: s.question,
          updatedAt: new Date(),
        },
      });
  },
  async clearSession(userId) {
    await db.delete(supportSessions).where(eq(supportSessions.telegramUserId, userId));
  },
  async createLead(data: SupportLead) {
    const [inserted] = await db
      .insert(leads)
      .values({
        businessName: data.name,
        businessType: "other",
        ownerName: data.name,
        ownerContact: data.phone,
        needsEquipment: false,
        comment: data.question,
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

export async function POST(req: Request): Promise<Response> {
  const expected = process.env.TELEGRAM_SUPPORT_WEBHOOK_SECRET;
  if (!expected) {
    console.error("TELEGRAM_SUPPORT_WEBHOOK_SECRET not configured");
    return new Response("not configured", { status: 503 });
  }
  const received = req.headers.get("x-telegram-bot-api-secret-token");
  if (!received || !timingSafeEqual(received, expected)) {
    return new Response("unauthorized", { status: 401 });
  }

  let update: SupportUpdate;
  try {
    update = (await req.json()) as SupportUpdate;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  try {
    const msg = update.message;
    if (msg) {
      const isPrivate = msg.chat.type === "private" || msg.chat.id > 0;
      if (isPrivate) {
        const supportMsg: SupportMessage = {
          from: msg.from ? { id: msg.from.id } : undefined,
          chat: { id: msg.chat.id, type: msg.chat.type },
          text: msg.text,
        };
        await handleSupportMessage(supportMsg, supportDeps);
      }
    }
  } catch (err) {
    console.error("support webhook handler error", err);
  }

  return Response.json({ ok: true });
}
