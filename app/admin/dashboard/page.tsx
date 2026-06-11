import type { ReactNode } from "react";
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Inbox,
  Trophy,
  PhoneCall,
  Download,
  AlertTriangle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  getLeadCounts,
  getFunnel,
  getConversionRate,
  getMedianTimeToContactSec,
  getDailyLeadsBySource,
  getTopSourcesByWinRate,
  deltaPercent,
} from "@/lib/admin/kpi";
import { getStaleLeads } from "@/lib/admin/lead-insights";
import { statusMeta } from "@/lib/admin/status-meta";
import { StackedBars, Funnel } from "@/lib/admin/svg-chart";
import { sourceLabel, pluralRu } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

// Source colors in svg-chart map 1:1 to these brand tokens.
const SWATCH = ["bg-green-500", "bg-green-300", "bg-ink-700", "bg-ink-500", "bg-mist"];

function formatDelta(delta: number | null): { label: string; tone: "up" | "down" | "flat" | "na" } {
  if (delta === null) return { label: "", tone: "na" };
  if (delta > 0) return { label: `↑ ${delta}%`, tone: "up" };
  if (delta < 0) return { label: `↓ ${Math.abs(delta)}%`, tone: "down" };
  return { label: "без изменений", tone: "flat" };
}

function formatMedian(sec: number | null): string {
  if (sec === null) return "—";
  if (sec < 60) return `${sec} сек`;
  if (sec < 3600) return `${Math.round(sec / 60)} мин`;
  if (sec < 86400) return `${Math.round(sec / 3600)} ч`;
  return `${Math.round(sec / 86400)} дн`;
}

interface TileProps {
  icon: LucideIcon;
  eyebrow: string;
  value: string;
  delta?: { label: string; tone: string };
  caption?: string;
}

function Tile({ icon: Icon, eyebrow, value, delta, caption }: TileProps) {
  return (
    <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{eyebrow}</span>
        <Icon size={16} strokeWidth={1.5} className="text-ink-500" />
      </div>
      <div className="mt-3 font-display text-4xl font-bold tabular-nums tracking-tightish text-ink-900">{value}</div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs">
        {delta && delta.label && (
          <span className={delta.tone === "up" ? "font-medium text-green-700" : "text-ink-500"}>{delta.label}</span>
        )}
        {caption && <span className="text-ink-500">{caption}</span>}
      </div>
    </div>
  );
}

function ChartCard({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold tracking-tightish text-ink-900">{title}</h2>
      <p className="mb-3 mt-0.5 text-sm text-ink-500">{hint}</p>
      <div className="rounded-xl border border-mist bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">{children}</div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [counts, funnel, conv, medianSec, daily, topSources, stale] = await Promise.all([
    getLeadCounts(),
    getFunnel(),
    getConversionRate(),
    getMedianTimeToContactSec(),
    getDailyLeadsBySource(30),
    getTopSourcesByWinRate(5),
    getStaleLeads(8),
  ]);

  const todayDelta = formatDelta(deltaPercent(counts.today, counts.yesterday));
  const weekDelta = formatDelta(deltaPercent(counts.thisWeek, counts.lastWeek));
  const monthDelta = formatDelta(deltaPercent(counts.thisMonth, counts.lastMonth));

  const chartSources = Array.from(new Set(daily.map((d) => d.source)));

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900">Сводка</h1>
          <p className="mt-1 text-sm text-ink-500">Что происходит с заявками прямо сейчас</p>
        </div>
        <a
          href="/admin/leads/export.csv"
          className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-medium text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500"
        >
          <Download size={16} strokeWidth={1.75} />
          Скачать таблицу
        </a>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Tile icon={CalendarDays} eyebrow="Сегодня" value={String(counts.today)} delta={todayDelta} caption="новых заявок" />
        <Tile icon={CalendarRange} eyebrow="За неделю" value={String(counts.thisWeek)} delta={weekDelta} caption="к прошлой" />
        <Tile icon={CalendarClock} eyebrow="За месяц" value={String(counts.thisMonth)} delta={monthDelta} caption="к прошлому" />
        <Tile icon={Inbox} eyebrow="Всего" value={String(counts.total)} caption="за всё время" />
        <Tile icon={Trophy} eyebrow="Стали клиентами" value={conv === null ? "—" : `${conv}%`} caption="из всех заявок" />
        <Tile icon={PhoneCall} eyebrow="Время до звонка" value={formatMedian(medianSec)} caption="в среднем" />
      </section>

      {stale.length > 0 && (
        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tightish text-ink-900">
            <AlertTriangle size={18} strokeWidth={1.75} className="text-warn" />
            Требуют внимания
          </h2>
          <p className="mb-3 mt-0.5 text-sm text-ink-500">
            Новые без контакта больше суток или зависшие в работе больше недели
          </p>
          <div className="rounded-xl border border-mist bg-white shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
            {stale.map((l) => {
              const meta = statusMeta(l.status);
              const age =
                l.hoursStuck < 48
                  ? `${l.hoursStuck} ч`
                  : `${Math.floor(l.hoursStuck / 24)} ${pluralRu(Math.floor(l.hoursStuck / 24), "день", "дня", "дней")}`;
              return (
                <a
                  key={l.id}
                  href={`/admin/leads/${l.id}`}
                  className="flex items-center justify-between gap-3 border-b border-mist px-5 py-3 transition-colors duration-200 ease-birliy last:border-0 hover:bg-paper"
                >
                  <span className="min-w-0 truncate text-sm font-medium text-ink-900">
                    {meta.emoji} {l.ownerName}
                    {l.businessName ? <span className="text-ink-500"> · {l.businessName}</span> : null}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-sm text-ink-500">
                    {meta.label} · без движения {age}
                    <ArrowRight size={14} strokeWidth={1.75} />
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-12">
        <ChartCard title="Заявки за 30 дней" hint="Сколько приходит каждый день и из каких источников">
          <div className="overflow-x-auto">
            <StackedBars data={daily} width={1000} height={240} />
          </div>
          {chartSources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-mist pt-3">
              {chartSources.map((s, i) => (
                <span key={s} className="inline-flex items-center gap-1.5 text-xs text-ink-700">
                  <span className={`h-2.5 w-2.5 rounded-sm ${SWATCH[i] ?? "bg-ink-900"}`} aria-hidden="true" />
                  {sourceLabel(s)}
                </span>
              ))}
            </div>
          )}
        </ChartCard>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <ChartCard title="Воронка" hint="Путь заявки от новой до клиента">
          <Funnel data={funnel} width={480} />
        </ChartCard>

        <ChartCard title="Источники" hint="Откуда приходят заявки и сколько становятся клиентами">
          {topSources.length === 0 ? (
            <div className="py-6 text-center text-sm text-ink-500">Пока нет данных</div>
          ) : (
            <div>
              {topSources.map((s) => (
                <div
                  key={s.source}
                  className="flex items-center justify-between gap-3 border-b border-mist py-3 last:border-0"
                >
                  <span className="font-medium text-ink-900">{sourceLabel(s.source)}</span>
                  <span className="text-sm text-ink-500">
                    {s.total} {pluralRu(s.total, "заявка", "заявки", "заявок")} · {s.winRate}% клиентов
                  </span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </section>
    </>
  );
}
