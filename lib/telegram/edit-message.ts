import type { InlineKeyboardMarkup } from "./buttons";

const TELEGRAM_API = "https://api.telegram.org";

async function tgFetch(method: string, body: unknown): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("Telegram token missing — skipping", method);
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`Telegram ${method} failed`, res.status, text);
    }
  } catch (err) {
    console.error(`Telegram ${method} error`, err);
  } finally {
    clearTimeout(timeout);
  }
}

export interface EditLeadMessageArgs {
  chatId: string;
  messageId: string;
  text: string;
  keyboard: InlineKeyboardMarkup;
}

export async function editLeadMessage(args: EditLeadMessageArgs): Promise<void> {
  await tgFetch("editMessageText", {
    chat_id: args.chatId,
    message_id: args.messageId,
    text: args.text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: args.keyboard,
  });
}

export interface AnswerCallbackArgs {
  callbackQueryId: string;
  text?: string;
  showAlert?: boolean;
}

export async function answerCallback(args: AnswerCallbackArgs): Promise<void> {
  const body: Record<string, unknown> = { callback_query_id: args.callbackQueryId };
  if (args.text !== undefined) body.text = args.text;
  if (args.showAlert !== undefined) body.show_alert = args.showAlert;
  await tgFetch("answerCallbackQuery", body);
}
