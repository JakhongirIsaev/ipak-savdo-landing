import { Activity } from "lucide-react";
import { getYmStats, ymConfigured } from "@/lib/admin/ym";
import { StatCard, SectionTitle, ListCard, EmptyState, Card, fmt } from "./ui";
import { LineChart } from "./LineChart";

// Helper: convert seconds to "Xм Yс" (e.g. 75 → "1м 15с").
function fmtDuration(secs: number): string {
  const s = Math.round(secs);
  if (s <= 0) return "0с";
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m === 0) return `${rem}с`;
  return rem === 0 ? `${m}м` : `${m}м ${rem}с`;
}

// Helper: format bounce rate as percentage string ("42%").
function fmtBounce(rate: number): string {
  return `${Math.round(rate)}%`;
}

// Helper: format page depth to 1 decimal ("2.4").
function fmtDepth(depth: number): string {
  return depth.toFixed(1);
}

export default async function YandexMetrikaSection() {
  if (!ymConfigured()) {
    return (
      <section className="mb-12">
        <SectionTitle icon={Activity} title="Яндекс Метрика" />
        <EmptyState>
          Яндекс Метрика не подключена. Добавьте{" "}
          <span className="font-medium text-ink-700">YANDEX_METRIKA_OAUTH_TOKEN</span> и{" "}
          <span className="font-medium text-ink-700">YANDEX_METRIKA_COUNTER_ID</span> в Railway.
        </EmptyState>
      </section>
    );
  }

  const stats = await getYmStats(30);

  if (!stats) {
    return (
      <section className="mb-12">
        <SectionTitle icon={Activity} title="Яндекс Метрика" />
        <EmptyState>
          Не удалось получить данные Метрики. Проверьте токен и номер счётчика.
        </EmptyState>
      </section>
    );
  }

  const { timeSeries, sources, organic, landings, totals } = stats;

  return (
    <section className="mb-12">
      <SectionTitle icon={Activity} title="Яндекс Метрика" />

      {/* ── Overview stat cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={Activity}
          label="Визиты"
          value={fmt(totals.visits)}
          hint="за последние 30 дней"
        />
        <StatCard
          icon={Activity}
          label="Пользователи"
          value={fmt(totals.users)}
        />
        <StatCard
          icon={Activity}
          label="Отказы"
          value={fmtBounce(totals.bounceRate)}
          hint="% визитов с одной страницей"
        />
        <StatCard
          icon={Activity}
          label="Глубина"
          value={fmtDepth(totals.pageDepth)}
          hint="стр / визит"
        />
        <StatCard
          icon={Activity}
          label="Время на сайте"
          value={fmtDuration(totals.avgDuration)}
          hint="среднее время визита"
        />
      </div>

      {/* ── Day-by-day line chart ── */}
      <div className="mb-6">
        <Card title="Визиты и пользователи по дням">
          <LineChart
            series={[
              { label: "Визиты", points: timeSeries.visits, color: "#03B73D" },
              { label: "Пользователи", points: timeSeries.users, color: "#0b1826" },
            ]}
          />
        </Card>
      </div>

      {/* ── Sources + Organic side-by-side (or stacked on mobile) ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListCard
          title="Источники трафика"
          rows={sources.map((s) => ({
            label: s.label,
            value: fmt(s.visits),
          }))}
        />

        {/* Organic search summary card */}
        <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
          <div className="mb-3 text-sm font-semibold text-ink-900">Органический поиск</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Визиты</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-ink-900">
                {fmt(organic.visits)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Пользователи</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-ink-900">
                {fmt(organic.users)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Отказы</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-ink-900">
                {fmtBounce(organic.bounceRate)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Глубина</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-ink-900">
                {fmtDepth(organic.pageDepth)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Время</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-ink-900">
                {fmtDuration(organic.avgDuration)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top landing pages ── */}
      <ListCard
        title="Топ страниц входа"
        rows={landings.map((l) => ({
          label: l.path,
          value: fmt(l.visits),
        }))}
      />
    </section>
  );
}
