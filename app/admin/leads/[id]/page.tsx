import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, leads, leadEvents } from "@/lib/db";
import type { Lead, LeadEvent } from "@/lib/db/schema";
import { STATUS_META } from "@/lib/admin/status-meta";
import { StatusDropdown } from "./status-dropdown";

export const dynamic = "force-dynamic";

function formatTashkent(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  }).format(d);
}

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

  return (
    <main className="mx-auto max-w-3xl p-8 font-sans">
      <a href="/admin/leads" className="text-sm text-ink-500 hover:text-ink-900">← К списку</a>

      <header className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Заявка #{lead.id}</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">{lead.businessName}</h1>
          <p className="mt-1 text-sm text-ink-500">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${meta.dotClass}`}></span>
            {meta.emoji} {meta.label}
            {lead.lastChangedBy && lead.lastStatusChangeAt && (
              <span className="ml-2 text-ink-500">· {lead.lastChangedBy} · {formatTashkent(lead.lastStatusChangeAt)}</span>
            )}
          </p>
        </div>
        <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-mist bg-paper p-5 text-sm sm:grid-cols-2">
        <Detail label="Тип бизнеса" value={lead.businessType === "other" ? lead.businessTypeOther ?? "—" : lead.businessType} />
        <Detail label="Владелец" value={lead.ownerName} />
        <Detail label="Контакт" value={lead.ownerContact} />
        <Detail label="Оборудование" value={lead.needsEquipment ? "Да" : "Нет"} />
        <Detail label="Язык" value={lead.language} />
        <Detail label="Источник" value={lead.source} />
        <Detail label="UTM" value={[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"} />
        <Detail label="Referrer" value={lead.referrer ?? "—"} />
        <Detail label="IP" value={lead.ip ?? "—"} />
        <Detail label="Создано" value={formatTashkent(lead.createdAt)} />
        <Detail label="Telegram msg" value={lead.telegramMessageId ?? "—"} />
        {lead.comment && (
          <div className="sm:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Комментарий</div>
            <div className="mt-1 text-ink-900">«{lead.comment}»</div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink-900">Timeline</h2>
        <ol className="space-y-2 text-sm">
          {events.map((e) => {
            const fromMeta = e.fromStatus ? STATUS_META[e.fromStatus] : null;
            const toMeta = STATUS_META[e.toStatus];
            return (
              <li key={e.id} className="flex items-baseline gap-3 border-l-2 border-mist pl-4">
                <span className="font-mono text-xs text-ink-500">{formatTashkent(e.createdAt)}</span>
                <span className="text-ink-900">
                  {e.actor}:
                  {fromMeta ? ` ${fromMeta.emoji} ${fromMeta.label} → ` : " создан → "}
                  {toMeta.emoji} {toMeta.label}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 text-ink-900">{value}</div>
    </div>
  );
}
