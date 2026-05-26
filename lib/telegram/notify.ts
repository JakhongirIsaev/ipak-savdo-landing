import type { Lead } from "@/lib/db/schema";
import { formatLeadMessage } from "./format";
import { buildLeadKeyboard } from "./buttons";

export interface NotifyResult {
  messageId: string | null;
}

export async function notifyNewLead(lead: Lead): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  if (!token || !chatId) {
    console.error("Telegram env vars missing — notification skipped for lead", lead.id);
    return { messageId: null };
  }

  const text = formatLeadMessage(lead, siteUrl);
  const keyboard = buildLeadKeyboard(lead.id, lead.status);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text,
        reply_markup: keyboard,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendMessage failed", res.status, body);
      return { messageId: null };
    }
    const json = (await res.json().catch(() => null)) as { ok?: boolean; result?: { message_id?: number } } | null;
    const id = json?.result?.message_id;
    return { messageId: typeof id === "number" ? String(id) : null };
  } catch (err) {
    console.error("Telegram sendMessage error", err);
    return { messageId: null };
  } finally {
    clearTimeout(timeout);
  }
}
