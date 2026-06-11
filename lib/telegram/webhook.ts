import type { Lead, LeadStatus } from "@/lib/db/schema";
import { parseCallbackData, buildLeadKeyboard, type InlineKeyboardMarkup } from "./buttons";
import { formatLeadMessage } from "./format";
import { handleAnketaMessage, type AnketaDeps } from "./anketa";

export interface WebhookDeps {
  findLead: (id: number) => Promise<Lead | null>;
  updateLeadStatus: (id: number, newStatus: LeadStatus, actor: string) => Promise<void>;
  insertEvent: (row: { leadId: number; fromStatus: LeadStatus | null; toStatus: LeadStatus; actor: string }) => Promise<void>;
  editMessage: (args: { chatId: string; messageId: string; text: string; keyboard: InlineKeyboardMarkup }) => Promise<void>;
  answerCb: (args: { callbackQueryId: string; text?: string; showAlert?: boolean }) => Promise<void>;
  chatId: string;
  siteUrl: string;
  anketa: AnketaDeps;
}

interface TelegramFrom {
  id: number;
  username?: string;
  first_name?: string;
}

interface CallbackQuery {
  id: string;
  from: TelegramFrom;
  data?: string;
  message?: { message_id: number; chat: { id: number } };
}

interface MessageUpdate {
  message_id: number;
  chat: { id: number; type?: string };
  text?: string;
  from?: TelegramFrom;
  photo?: { file_id: string; file_size?: number }[];
}

export interface TelegramUpdate {
  update_id: number;
  callback_query?: CallbackQuery;
  message?: MessageUpdate;
}

function actorFrom(from: TelegramFrom): string {
  if (from.username) return `@${from.username}`;
  return `@${from.id}`;
}

export async function handleTelegramUpdate(
  update: TelegramUpdate,
  deps: WebhookDeps,
): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query, deps);
    return;
  }

  if (update.message) {
    const msg = update.message;
    const isPrivate = msg.chat.type === "private" || msg.chat.id > 0;
    if (isPrivate) {
      await handleAnketaMessage(
        {
          from: msg.from ? { id: msg.from.id } : undefined,
          chat: { id: msg.chat.id, type: msg.chat.type },
          text: msg.text,
          photo: msg.photo,
        },
        deps.anketa,
      );
    }
    return;
  }
  return;
}

async function handleCallback(cb: CallbackQuery, deps: WebhookDeps): Promise<void> {
  if (!cb.data) {
    await deps.answerCb({ callbackQueryId: cb.id });
    return;
  }

  const parsed = parseCallbackData(cb.data);
  if (!parsed) {
    await deps.answerCb({ callbackQueryId: cb.id, text: "Некорректные данные", showAlert: false });
    return;
  }

  const lead = await deps.findLead(parsed.leadId);
  if (!lead) {
    await deps.answerCb({ callbackQueryId: cb.id, text: "Заявка не найдена", showAlert: false });
    return;
  }

  const actor = actorFrom(cb.from);

  if (lead.status === parsed.toStatus) {
    await deps.answerCb({ callbackQueryId: cb.id });
    return;
  }

  await deps.updateLeadStatus(lead.id, parsed.toStatus, actor);
  await deps.insertEvent({
    leadId: lead.id,
    fromStatus: lead.status,
    toStatus: parsed.toStatus,
    actor,
  });

  if (lead.telegramMessageId) {
    const refreshed: Lead = {
      ...lead,
      status: parsed.toStatus,
      lastChangedBy: actor,
      lastStatusChangeAt: new Date(),
    };
    await deps.editMessage({
      chatId: deps.chatId,
      messageId: lead.telegramMessageId,
      text: formatLeadMessage(refreshed, deps.siteUrl),
      keyboard: buildLeadKeyboard(lead.id, parsed.toStatus),
    });
  }

  await deps.answerCb({ callbackQueryId: cb.id });
}
