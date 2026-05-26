import type { LeadStatus } from "@/lib/db/schema";

export interface StatusMeta {
  emoji: string;
  label: string;
  labelEn: string;
  dotClass: string;
  ringClass: string;
}

export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: {
    emoji: "🆕",
    label: "Новый",
    labelEn: "NEW",
    dotClass: "bg-ink-500",
    ringClass: "ring-ink-500",
  },
  contacted: {
    emoji: "📞",
    label: "В работе",
    labelEn: "CONTACTED",
    dotClass: "bg-info",
    ringClass: "ring-info",
  },
  demo: {
    emoji: "📅",
    label: "Демо",
    labelEn: "DEMO",
    dotClass: "bg-warn",
    ringClass: "ring-warn",
  },
  won: {
    emoji: "🏆",
    label: "Выигран",
    labelEn: "WON",
    dotClass: "bg-green-500",
    ringClass: "ring-green-500",
  },
  lost: {
    emoji: "❌",
    label: "Проигран",
    labelEn: "LOST",
    dotClass: "bg-stop",
    ringClass: "ring-stop",
  },
};

const FALLBACK: StatusMeta = {
  emoji: "•",
  label: "—",
  labelEn: "?",
  dotClass: "bg-mist",
  ringClass: "ring-mist",
};

export function statusMeta(status: LeadStatus | string | null | undefined): StatusMeta {
  if (!status) return FALLBACK;
  return (STATUS_META as Record<string, StatusMeta>)[status] ?? FALLBACK;
}
