import type { BusinessType, Language } from "@/lib/db/schema";

// Human-readable labels for the admin UI. Ordinary workers should never see
// raw enum values, ISO timestamps, or technical jargon in the main views.

const SOURCE_LABELS: Record<string, string> = {
  direct: "Сайт",
  website: "Сайт",
  landing: "Сайт",
  concept_preview: "Сайт (демо)",
  telegram_bot: "Telegram-бот",
  telegram: "Telegram",
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
};

export function sourceLabel(source: string | null | undefined): string {
  if (!source) return "—";
  if (SOURCE_LABELS[source]) return SOURCE_LABELS[source];
  return source.charAt(0).toUpperCase() + source.slice(1).replace(/_/g, " ");
}

const TYPE_LABELS: Record<BusinessType, string> = {
  shop: "Магазин",
  minimarket: "Минимаркет",
  cafe: "Кафе",
  restaurant: "Ресторан",
  market: "Рынок / точка",
  beauty: "Салон красоты",
  service: "Услуги",
  pharmacy: "Аптека",
  other: "Другое",
};

export function businessTypeLabel(
  type: BusinessType | string,
  other?: string | null,
): string {
  if (type === "other") return other && other.trim() ? other : "Другое";
  return TYPE_LABELS[type as BusinessType] ?? String(type);
}

export function languageLabel(lang: Language | string | null | undefined): string {
  if (lang === "ru") return "Русский";
  if (lang === "uz") return "Oʻzbek";
  return "—";
}

// Phone -> tel: href (keep leading +, digits only).
export function telHref(contact: string | null | undefined): string {
  if (!contact) return "";
  const cleaned = contact.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : cleaned;
}

// Looks like a phone number we can dial.
export function isPhone(contact: string | null | undefined): boolean {
  if (!contact) return false;
  const digits = contact.replace(/\D/g, "");
  return digits.length >= 7;
}

const TZ = "Asia/Tashkent";

function tzDateKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const TIME_FMT = new Intl.DateTimeFormat("ru-RU", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const DAY_MON_FMT = new Intl.DateTimeFormat("ru-RU", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
});

const FULL_FMT = new Intl.DateTimeFormat("ru-RU", {
  timeZone: TZ,
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// "Сегодня, 14:30" / "Вчера, 09:12" / "7 июн., 14:30"
export function formatLeadDate(d: Date, now: Date = new Date()): string {
  const key = tzDateKey(d);
  const todayKey = tzDateKey(now);
  const yesterdayKey = tzDateKey(new Date(now.getTime() - 86_400_000));
  const time = TIME_FMT.format(d);
  if (key === todayKey) return `Сегодня, ${time}`;
  if (key === yesterdayKey) return `Вчера, ${time}`;
  return `${DAY_MON_FMT.format(d)}, ${time}`;
}

// "7 июня 2026 г., 14:30"
export function formatLeadDateFull(d: Date): string {
  return FULL_FMT.format(d);
}

// Russian pluralization: pluralRu(2, "заявка", "заявки", "заявок")
export function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
