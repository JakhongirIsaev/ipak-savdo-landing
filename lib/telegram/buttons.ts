import { leadStatuses, type LeadStatus } from "@/lib/db/schema";

export interface InlineButton {
  text: string;
  callback_data: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineButton[][];
}

const BUTTON_ORDER: ReadonlyArray<{ status: LeadStatus; label: string }> = [
  { status: "contacted", label: "✅ В работу" },
  { status: "demo",      label: "📅 Демо" },
  { status: "won",       label: "🏆 Выигран" },
  { status: "lost",      label: "❌ Проигран" },
];

export function buildLeadKeyboard(leadId: number, current: LeadStatus): InlineKeyboardMarkup {
  // One button per row (a column) so the full label is always readable in the
  // Telegram group — a single 4-button row truncates to "В ра…/Выиг…/Прои…".
  return {
    inline_keyboard: BUTTON_ORDER.map(({ status, label }) => [
      {
        text: status === current ? `· ${label} ·` : label,
        callback_data: `lead:${leadId}:${status}`,
      },
    ]),
  };
}

const LEAD_STATUS_SET: ReadonlySet<string> = new Set(leadStatuses);

export interface ParsedCallback {
  leadId: number;
  toStatus: LeadStatus;
}

export function parseCallbackData(data: string): ParsedCallback | null {
  if (!data || typeof data !== "string") return null;
  const parts = data.split(":");
  if (parts.length !== 3) return null;
  const [prefix, idStr, status] = parts;
  if (prefix !== "lead") return null;
  const leadId = parseInt(idStr, 10);
  if (!Number.isInteger(leadId) || leadId <= 0) return null;
  if (!LEAD_STATUS_SET.has(status)) return null;
  return { leadId, toStatus: status as LeadStatus };
}
