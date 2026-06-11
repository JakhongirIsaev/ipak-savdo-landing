import type { Lead } from "@/lib/db/schema";
import { formatLeadMessage, formatLeadPhotoCaption } from "./format";
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

    await sendLeadPhotos(token, chatId, lead);

    return { messageId: typeof id === "number" ? String(id) : null };
  } catch (err) {
    console.error("Telegram sendMessage error", err);
    return { messageId: null };
  } finally {
    clearTimeout(timeout);
  }
}

interface LeadPhoto {
  fileId: string;
  label: string;
}

function leadPhotos(lead: Lead): LeadPhoto[] {
  const out: LeadPhoto[] = [];
  if (lead.patentFileId) out.push({ fileId: lead.patentFileId, label: "📄 Патент" });
  if (lead.passportFileId) out.push({ fileId: lead.passportFileId, label: "🪪 Паспорт директора/владельца" });
  if (lead.shopPhotoFileId) out.push({ fileId: lead.shopPhotoFileId, label: "🏪 Фото магазина" });
  return out;
}

async function sendPhoto(token: string, chatId: string, fileId: string, caption: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, photo: fileId, caption, parse_mode: "HTML" }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendPhoto failed", res.status, body);
    }
  } catch (err) {
    console.error("Telegram sendPhoto error", err);
  } finally {
    clearTimeout(timeout);
  }
}

interface MediaGroupItem {
  type: "photo";
  media: string;
  caption: string;
  parse_mode: "HTML";
}

async function sendMediaGroup(token: string, chatId: string, media: MediaGroupItem[]): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, media }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendMediaGroup failed", res.status, body);
    }
  } catch (err) {
    console.error("Telegram sendMediaGroup error", err);
  } finally {
    clearTimeout(timeout);
  }
}

// Bundle the lead documents (patent / passport / shop) into ONE album so they
// arrive as a single "file" carrying the shop+owner info as the first caption,
// instead of three loose photo messages.
async function sendLeadPhotos(token: string, chatId: string, lead: Lead): Promise<void> {
  const photos = leadPhotos(lead);
  if (photos.length === 0) return;

  const info = formatLeadPhotoCaption(lead);

  if (photos.length === 1) {
    const only = photos[0];
    await sendPhoto(token, chatId, only.fileId, `${info}\n\n${only.label}`);
    return;
  }

  const media: MediaGroupItem[] = photos.map((p, i) => ({
    type: "photo",
    media: p.fileId,
    caption: i === 0 ? `${info}\n\n${p.label}` : p.label,
    parse_mode: "HTML",
  }));

  await sendMediaGroup(token, chatId, media);
}

// Posted to the group when a lead's document album fails to deliver, so the
// card isn't silently missing its photos. The files are still saved (DB + any
// Supabase backup); this only restores in-chat visibility of the gap. Plain
// text (no parse_mode) so a lead id/URL can never break the message.
export async function notifyDocsUndelivered(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const link = `${siteUrl}/admin/leads`;
  const text = `⚠️ Документы по заявке #${lead.id} не доставились в чат (патент / паспорт / фото магазина). Файлы сохранены — откройте карточку в админке: ${link}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram docs-undelivered notice failed", res.status, body);
    }
  } catch (err) {
    console.error("Telegram docs-undelivered notice error", err);
  } finally {
    clearTimeout(timeout);
  }
}
