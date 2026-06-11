import type { ReactNode } from "react";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Check } from "lucide-react";
import { db, leads, leadEvents } from "@/lib/db";
import type { Lead, LeadEvent } from "@/lib/db/schema";
import { STATUS_META } from "@/lib/admin/status-meta";
import {
  businessTypeLabel,
  sourceLabel,
  languageLabel,
  formatLeadDate,
  formatLeadDateFull,
  telHref,
  isPhone,
} from "@/lib/admin/format";
import { StatusDropdown } from "./status-dropdown";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const leadRows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  const lead = leadRows[0] as Lead | undefined;
  if (!lead) notFound();

  const events = (await db
    .select()
    .from(leadEvents)
    .where(eq(leadEvents.leadId, id))
    .orderBy(desc(leadEvents.createdAt))) as LeadEvent[];

  const meta = STATUS_META[lead.status];

  const documents = [
    { label: "Патент", present: Boolean(lead.patentFileId || lead.patentStoragePath) },
    { label: "Паспорт", present: Boolean(lead.passportFileId || lead.passportStoragePath) },
    { label: "Фото магазина", present: Boolean(lead.shopPhotoFileId || lead.shopStoragePath) },
  ];
  const hasDocuments = documents.some((d) => d.present);

  const utm = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ");

  return (
    <div className="mx-auto max-w-3xl">
      <a
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors duration-200 ease-birliy hover:text-ink-900"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Все заявки
      </a>

      <header className="mb-8 mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Заявка № {lead.id}</div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tightish text-ink-900">{lead.businessName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-2.5 py-1 text-xs font-medium text-ink-700">
              <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
              {meta.label}
            </span>
            {lead.lastChangedBy && lead.lastStatusChangeAt && (
              <span>
                {lead.lastChangedBy} · {formatLeadDateFull(lead.lastStatusChangeAt)}
              </span>
            )}
          </div>
        </div>
        <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
      </header>

      <section className="mb-6 rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] sm:p-6">
        <h2 className="mb-4 font-display text-lg font-semibold tracking-tightish text-ink-900">Данные заявки</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <Detail label="Тип бизнеса" value={businessTypeLabel(lead.businessType, lead.businessTypeOther)} />
          <Detail label="Владелец" value={lead.ownerName} />
          <Detail label="Контакт">
            {isPhone(lead.ownerContact) ? (
              <a
                href={`tel:${telHref(lead.ownerContact)}`}
                className="inline-flex items-center gap-1.5 font-medium text-ink-900 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Phone size={14} strokeWidth={1.75} />
                {lead.ownerContact}
              </a>
            ) : (
              <span className="text-ink-900">{lead.ownerContact}</span>
            )}
          </Detail>
          <Detail label="Город" value={lead.city ?? "—"} />
          <Detail label="Нужно оборудование" value={lead.needsEquipment ? "Да" : "Нет"} />
          <Detail label="Язык заявки" value={languageLabel(lead.language)} />
          <Detail label="Источник" value={sourceLabel(lead.source)} />
          <Detail label="Поступила" value={formatLeadDateFull(lead.createdAt)} />
        </div>

        {lead.comment && (
          <div className="mt-5 border-t border-mist pt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Комментарий</div>
            <p className="mt-1.5 text-ink-900">«{lead.comment}»</p>
          </div>
        )}

        {hasDocuments && (
          <div className="mt-5 border-t border-mist pt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Документы</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {documents
                .filter((d) => d.present)
                .map((d) => (
                  <span
                    key={d.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-paper px-3 py-1.5 text-xs font-medium text-ink-700"
                  >
                    <Check size={14} strokeWidth={2} className="text-green-700" />
                    {d.label}
                  </span>
                ))}
            </div>
            <p className="mt-2 text-xs text-ink-500">Файлы пришли в Telegram команде вместе с заявкой.</p>
          </div>
        )}
      </section>

      {(utm || lead.referrer || lead.ip || lead.userAgent || lead.telegramMessageId) && (
        <details className="mb-6 rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
          <summary className="cursor-pointer text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900">
            Технические детали
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="UTM" value={utm || "—"} />
            <Detail label="Реферер" value={lead.referrer ?? "—"} />
            <Detail label="IP" value={lead.ip ?? "—"} />
            <Detail label="Telegram msg" value={lead.telegramMessageId ?? "—"} />
            {lead.userAgent && (
              <div className="sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">User-Agent</div>
                <div className="mt-1 break-all font-mono text-xs text-ink-700">{lead.userAgent}</div>
              </div>
            )}
          </div>
        </details>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold tracking-tightish text-ink-900">История</h2>
        <ol className="space-y-3">
          {events.map((e) => {
            const fromMeta = e.fromStatus ? STATUS_META[e.fromStatus] : null;
            const toMeta = STATUS_META[e.toStatus];
            return (
              <li key={e.id} className="flex flex-col gap-0.5 border-l-2 border-mist pl-4 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="shrink-0 text-xs tabular-nums text-ink-500">{formatLeadDate(e.createdAt)}</span>
                <span className="text-sm text-ink-900">
                  <span className="text-ink-500">{e.actor}:</span>{" "}
                  {fromMeta ? `${fromMeta.label} → ` : "создана → "}
                  {toMeta.label}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Detail({ label, value, children }: { label: string; value?: string; children?: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 text-ink-900">{children ?? value}</div>
    </div>
  );
}
