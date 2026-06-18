// Server component — no "use client", no chart library, no heavy deps.
// Renders the "Рост в поиске (Search Console)" admin dashboard section.

import { Search, TrendingUp, Eye, MousePointerClick } from "lucide-react";
import { gscConfigured, getSearchGrowth, gscServiceAccountEmail, gscSiteUrl } from "@/lib/admin/gsc";
import { StatCard, SectionTitle, ListCard, EmptyState, Card, fmt } from "./ui";
import { LineChart } from "./LineChart";

const RANGES = [7, 28, 90] as const;
type ValidRange = (typeof RANGES)[number];

function isValidRange(n: number): n is ValidRange {
  return (RANGES as readonly number[]).includes(n);
}

function RangePills({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1">
      {RANGES.map((r) => {
        const isActive = r === active;
        return (
          <a
            key={r}
            href={`/admin/analytics?gscRange=${r}`}
            className={[
              "rounded-full px-3 py-0.5 text-xs font-semibold transition-colors duration-150",
              isActive
                ? "bg-ink-900 text-white"
                : "bg-mist text-ink-700 hover:bg-ink-100",
            ].join(" ")}
          >
            {r} дн.
          </a>
        );
      })}
    </div>
  );
}

export default async function SearchGrowthSection({
  rangeDays = 28,
}: {
  rangeDays?: number;
}) {
  const days: number = isValidRange(rangeDays) ? rangeDays : 28;

  return (
    <section className="mb-12">
      <SectionTitle
        icon={Search}
        title="Рост в поиске (Search Console)"
        action={<RangePills active={days} />}
      />

      {!gscConfigured() ? (
        <EmptyState>
          Search Console не подключён. Задайте{" "}
          <span className="font-mono text-xs">GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:birliy.uz</span>{" "}
          и{" "}
          <span className="font-mono text-xs">GOOGLE_SEARCH_CONSOLE_CREDENTIALS_JSON</span>{" "}
          (или используйте уже настроенный{" "}
          <span className="font-mono text-xs">GA_CREDENTIALS_JSON</span>).
        </EmptyState>
      ) : (
        <SearchGrowthContent days={days} />
      )}
    </section>
  );
}

// Split into a separate async sub-component so the configured-check renders
// synchronously while data loading is isolated.
async function SearchGrowthContent({ days }: { days: number }) {
  const data = await getSearchGrowth(days);

  if (!data) {
    const saEmail = gscServiceAccountEmail();
    return (
      <EmptyState>
        Нет данных Search Console за период. Убедитесь, что сервис-аккаунт{" "}
        {saEmail && (
          <>
            <span className="font-mono text-xs">{saEmail}</span>{" "}
          </>
        )}
        добавлен с правом чтения в ресурс{" "}
        <span className="font-mono text-xs">{gscSiteUrl()}</span> (Search Console · Настройки · Пользователи).
      </EmptyState>
    );
  }

  const { daily, totals, queries, pages, range } = data;

  const impressionPoints = daily.map((d) => d.impressions);
  const clickPoints = daily.map((d) => d.clicks);
  const positionPoints = daily.map((d) => d.position);
  const ctrPoints = daily.map((d) => +(d.ctr * 100).toFixed(2));

  const fmtPos = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmtCtr = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
  const fmtPct = (n: number) =>
    (n * 100).toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";

  return (
    <div className="space-y-5">
      <p className="text-xs text-ink-500">
        {range.days} дней · данные Google с задержкой ~2 дня · {range.start} — {range.end}
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Показы"
          value={totals ? fmt(totals.impressions) : "—"}
          hint="раз сайт появился в поиске"
        />
        <StatCard
          icon={MousePointerClick}
          label="Клики"
          value={totals ? fmt(totals.clicks) : "—"}
          hint="переходов из Google"
        />
        <StatCard
          icon={TrendingUp}
          label="CTR %"
          value={totals ? fmtPct(totals.ctr) : "—"}
          hint="кликов от показов"
        />
        <StatCard
          icon={Search}
          label="Ср. позиция"
          value={totals ? fmtPos(totals.position) : "—"}
          hint="средняя позиция в выдаче"
        />
      </div>

      {/* Daily charts: impressions + clicks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Показы по дням">
          <LineChart
            series={[{ label: "Показы", points: impressionPoints, color: "#03B73D" }]}
            yFormat={fmt}
          />
        </Card>
        <Card title="Клики по дням">
          <LineChart
            series={[{ label: "Клики", points: clickPoints, color: "#0060FF" }]}
            yFormat={fmt}
          />
        </Card>
      </div>

      {/* Position chart — lower is better */}
      <Card title="Средняя позиция по дням">
        <p className="mb-2 text-xs text-ink-500">ниже = лучше</p>
        <LineChart
          series={[{ label: "Позиция", points: positionPoints, color: "#FF6900" }]}
          yFormat={fmtPos}
        />
      </Card>

      {/* CTR chart */}
      <Card title="CTR по дням">
        <LineChart
          series={[{ label: "CTR %", points: ctrPoints, color: "#9B59B6" }]}
          yFormat={fmtCtr}
        />
      </Card>

      {/* Top queries + pages */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListCard
          title="Топ запросов"
          rows={queries.map((q) => ({
            label: (
              <span>
                {q.key}{" "}
                <span className="text-xs text-ink-500">· {fmt(q.impressions)} пок.</span>
              </span>
            ),
            value: `${fmt(q.clicks)} кл.`,
          }))}
        />
        <ListCard
          title="Топ страниц"
          rows={pages.map((p) => ({
            label: (
              <span className="font-mono text-xs">{p.key}</span>
            ),
            value: `${fmt(p.clicks)} кл.`,
          }))}
        />
      </div>
    </div>
  );
}
