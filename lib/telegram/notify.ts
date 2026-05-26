import type { Lead } from "@/lib/db/schema";
import { formatLeadMessage } from "./format";

export async function notifyNewLead(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  if (!token || !chatId) {
    console.error("Telegram env vars missing — notification skipped for lead", lead.id);
    return;
  }

  const text = formatLeadMessage(lead, siteUrl);
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
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendMessage failed", res.status, body);
    }
  } catch (err) {
    console.error("Telegram sendMessage error", err);
  } finally {
    clearTimeout(timeout);
  }
}
