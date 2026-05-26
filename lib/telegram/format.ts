import type { Lead, BusinessType } from "@/lib/db/schema";
import { escapeHtml } from "@/lib/html-escape";
import { STATUS_META } from "@/lib/admin/status-meta";

const businessTypeLabelsRu: Record<BusinessType, string> = {
  shop: "магазин",
  cafe: "кафе",
  restaurant: "ресторан",
  market: "рынок / точка",
  beauty: "салон красоты",
  service: "сервис",
  other: "другое",
};

function formatTashkentTimeShort(date: Date): string {
  const fmt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}.${get("month")} ${get("hour")}:${get("minute")}`;
}

function formatTashkentTime(date: Date): string {
  const fmt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}, ${get("hour")}:${get("minute")}`;
}

export function formatLeadMessage(lead: Lead, siteUrl: string): string {
  const typeLabel =
    lead.businessType === "other" && lead.businessTypeOther
      ? escapeHtml(lead.businessTypeOther)
      : businessTypeLabelsRu[lead.businessType];

  const meta = STATUS_META[lead.status] ?? STATUS_META.new;
  let statusLine = `${meta.emoji} <b>${meta.labelEn}</b>`;
  if (lead.lastChangedBy && lead.lastStatusChangeAt) {
    statusLine += ` · ${escapeHtml(lead.lastChangedBy)} · ${formatTashkentTimeShort(lead.lastStatusChangeAt)}`;
  }

  const lines: string[] = [
    statusLine,
    "",
    `🎯 <b>Новая заявка #${lead.id}</b>`,
    "",
    `🏪 <b>Бизнес:</b> ${escapeHtml(lead.businessName)} (${typeLabel})`,
    `👤 <b>Владелец:</b> ${escapeHtml(lead.ownerName)}`,
    `📞 <b>Контакт:</b> ${escapeHtml(lead.ownerContact)}`,
    `🛠 <b>Оборудование:</b> ${lead.needsEquipment ? "да" : "нет"}`,
  ];

  if (lead.comment && lead.comment.trim().length > 0) {
    lines.push(`💬 <b>Комментарий:</b> «${escapeHtml(lead.comment)}»`);
  }

  lines.push("");

  const sourceParts = [`📍 <b>Источник:</b> ${escapeHtml(lead.source)}`];
  if (lead.utmCampaign) sourceParts.push(`кампания: ${escapeHtml(lead.utmCampaign)}`);
  lines.push(sourceParts.join(" · "));

  lines.push(`🕒 ${formatTashkentTime(lead.createdAt)} (Asia/Tashkent)`);
  lines.push("");
  lines.push(`<a href="${siteUrl}/admin/leads?id=${lead.id}">👉 Открыть в админке</a>`);

  return lines.join("\n");
}
