import { BarChart3 } from "lucide-react";
import { serpApiConfigured, getLatestKeywordRanks } from "@/lib/admin/serp";
import { TRACKED_KEYWORDS } from "@/lib/seo/keywords";
import { SerpRefreshButton } from "./SerpRefreshButton";
import { SectionTitle, EmptyState } from "./ui";
import type { KeywordRankRow } from "@/lib/admin/serp";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPosition(pos: number | null): string {
  if (pos === null) return "вне топ-10";
  return String(pos);
}

function fmtChange(current: number | null, prev: number | null): { label: string; cls: string } {
  if (prev === null || current === null) return { label: "—", cls: "text-ink-400" };
  const delta = prev - current; // positive = improved (moved up)
  if (delta === 0) return { label: "—", cls: "text-ink-400" };
  if (delta > 0) return { label: `▲ ${delta}`, cls: "text-emerald-600 font-medium" };
  return { label: `▼ ${Math.abs(delta)}`, cls: "text-red-500 font-medium" };
}

function fmtCheckedAt(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 2) return "только что";
  if (diffMin < 60) return `${diffMin} мин назад`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} ч назад`;
  const diffD = Math.round(diffH / 24);
  return `${diffD} д назад`;
}

// ── Row component ─────────────────────────────────────────────────────────────

function RankRow({ row }: { row: KeywordRankRow }) {
  const change = fmtChange(row.position, row.prevPosition);
  const prevLabel =
    row.prevPosition === null ? "—" : String(row.prevPosition);

  return (
    <tr className="border-b border-mist last:border-0 hover:bg-slate-50/60">
      {/* Запрос */}
      <td className="py-2 pr-3 text-sm text-ink-800">{row.keyword}</td>
      {/* Язык */}
      <td className="py-2 pr-3 text-center text-xs text-ink-500">
        {row.locale === "uz" ? "UZ" : "RU"}
      </td>
      {/* Позиция */}
      <td className="py-2 pr-3 text-right tabular-nums text-sm font-semibold text-ink-900">
        {fmtPosition(row.position)}
      </td>
      {/* Было */}
      <td className="py-2 pr-3 text-right tabular-nums text-sm text-ink-400">
        {prevLabel}
      </td>
      {/* Изм. */}
      <td className={`py-2 pr-3 text-right tabular-nums text-sm ${change.cls}`}>
        {change.label}
      </td>
      {/* URL BirLiy */}
      <td className="py-2 pr-3 text-xs text-ink-500">
        {row.urlFound ? (
          <a
            href={row.urlFound}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate underline decoration-mist underline-offset-2 hover:text-ink-900"
          >
            {(() => {
              try {
                return new URL(row.urlFound).pathname || "/";
              } catch {
                return row.urlFound;
              }
            })()}
          </a>
        ) : (
          <span className="text-ink-300">не найден</span>
        )}
      </td>
      {/* Топ-5 конкурентов */}
      <td className="py-2 pr-3 text-xs text-ink-400">
        {row.competitors.length > 0 ? row.competitors.join(", ") : "—"}
      </td>
      {/* Проверено */}
      <td className="py-2 text-right text-xs text-ink-400 whitespace-nowrap">
        {fmtCheckedAt(row.checkedAt)}
      </td>
    </tr>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default async function KeywordRankSection() {
  const configured = serpApiConfigured();

  const rows = configured ? await getLatestKeywordRanks() : [];

  return (
    <section className="mb-12">
      <SectionTitle
        icon={BarChart3}
        title="Позиции по ключевым словам"
        action={<SerpRefreshButton />}
      />

      {!configured ? (
        <EmptyState>
          SerpApi не подключён. Добавьте{" "}
          <span className="font-mono text-xs">SERPAPI_API_KEY</span>, затем нажмите «Обновить
          позиции».
        </EmptyState>
      ) : rows.length === 0 ? (
        <EmptyState>
          Снимков ещё нет. Нажмите «Обновить позиции» (расходует кредиты SerpApi).
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-mist bg-white shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Запрос
                </th>
                <th className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Яз.
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Позиция
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Было
                </th>
                <th className="px-2 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Изм.
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                  URL BirLiy
                </th>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Топ-5 конкурентов
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Проверено
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {rows.map((row) => (
                <RankRow key={`${row.locale}::${row.keyword}`} row={row} />
              ))}
            </tbody>
          </table>
          <p className="border-t border-mist px-4 py-2 text-xs text-ink-400">
            Данные берутся из SerpApi (Google, Tashkent). Одно обновление расходует{" "}
            {TRACKED_KEYWORDS.length} кредитов SerpApi (по одному на запрос). Бесплатный план: 100 кредитов/мес.
          </p>
        </div>
      )}
    </section>
  );
}
