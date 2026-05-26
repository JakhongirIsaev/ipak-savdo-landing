import {
  getLeadCounts,
  getFunnel,
  getConversionRate,
  getMedianTimeToContactSec,
  getDailyLeadsBySource,
  getTopSourcesByWinRate,
  deltaPercent,
} from "@/lib/admin/kpi";
import { StackedBars, Funnel } from "@/lib/admin/svg-chart";

export const dynamic = "force-dynamic";

function formatDelta(delta: number | null): { label: string; tone: "up" | "down" | "flat" | "na" } {
  if (delta === null) return { label: "—", tone: "na" };
  if (delta > 0) return { label: `↑ ${delta}%`, tone: "up" };
  if (delta < 0) return { label: `↓ ${Math.abs(delta)}%`, tone: "down" };
  return { label: "0%", tone: "flat" };
}

function formatMedianHours(sec: number | null): string {
  if (sec === null) return "—";
  if (sec < 60) return `${sec}с`;
  if (sec < 3600) return `${Math.round(sec / 60)}м`;
  if (sec < 86400) return `${Math.round(sec / 3600)}ч`;
  return `${Math.round(sec / 86400)}д`;
}

interface TileProps {
  eyebrow: string;
  value: string;
  delta?: { label: string; tone: string };
  caption?: string;
}

function Tile({ eyebrow, value, delta, caption }: TileProps) {
  return (
    <div className="rounded-lg border border-mist bg-paper p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{eyebrow}</div>
      <div className="mt-3 font-display text-4xl font-bold text-ink-900">{value}</div>
      {delta && (
        <div className={`mt-1 text-xs ${delta.tone === "up" ? "text-green-700" : "text-ink-500"}`}>
          {delta.label}
        </div>
      )}
      {caption && <div className="mt-1 text-xs text-ink-500">{caption}</div>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [counts, funnel, conv, medianSec, daily, topSources] = await Promise.all([
    getLeadCounts(),
    getFunnel(),
    getConversionRate(),
    getMedianTimeToContactSec(),
    getDailyLeadsBySource(30),
    getTopSourcesByWinRate(5),
  ]);

  const todayDelta = formatDelta(deltaPercent(counts.today, counts.yesterday));
  const weekDelta = formatDelta(deltaPercent(counts.thisWeek, counts.lastWeek));
  const monthDelta = formatDelta(deltaPercent(counts.thisMonth, counts.lastMonth));

  return (
    <main className="mx-auto max-w-7xl p-8 font-sans">
      <header className="mb-8 flex flex-wrap items-baseline gap-4">
        <h1 className="font-display text-3xl font-bold text-ink-900">Dashboard</h1>
        <nav className="text-sm text-ink-500">
          <a href="/admin/leads" className="hover:text-ink-900">Leads</a>
          <span className="mx-2">·</span>
          <a href="/admin/leads/export.csv" className="hover:text-ink-900">Export CSV</a>
        </nav>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Tile eyebrow="Сегодня"   value={String(counts.today)}    delta={todayDelta} caption="от вчера" />
        <Tile eyebrow="Неделя"    value={String(counts.thisWeek)} delta={weekDelta}  caption="от пр. недели" />
        <Tile eyebrow="Месяц"     value={String(counts.thisMonth)} delta={monthDelta} caption="от пр. месяца" />
        <Tile eyebrow="Всего"     value={String(counts.total)} />
        <Tile eyebrow="Конверсия" value={conv === null ? "—" : `${conv}%`} caption="new → won" />
        <Tile eyebrow="Медиана"   value={formatMedianHours(medianSec)} caption="до контакта" />
      </section>

      <section className="mt-12">
        <h2 className="mb-1 font-display text-xl font-semibold text-ink-900">Лиды за 30 дней</h2>
        <p className="mb-4 text-sm text-ink-500">по источникам (stacked)</p>
        <div className="rounded-lg border border-mist bg-paper p-4">
          <StackedBars data={daily} width={1000} height={240} />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-ink-900">Воронка</h2>
          <p className="mb-4 text-sm text-ink-500">по статусам, относительно new</p>
          <div className="rounded-lg border border-mist bg-paper p-4">
            <Funnel data={funnel} width={480} />
          </div>
        </div>
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-ink-900">Топ источников</h2>
          <p className="mb-4 text-sm text-ink-500">по объёму и win-rate</p>
          <div className="rounded-lg border border-mist bg-paper p-4 text-sm">
            {topSources.length === 0 && <div className="text-ink-500">Нет данных</div>}
            {topSources.map((s) => (
              <div key={s.source} className="flex items-baseline justify-between border-b border-mist py-2 last:border-b-0">
                <span className="font-medium text-ink-900">{s.source}</span>
                <span className="text-ink-500">{s.total} лидов · {s.winRate}% won</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
