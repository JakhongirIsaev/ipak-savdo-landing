import type { ReactNode } from "react";
import { desc, sql } from "drizzle-orm";
import { Download, Search, Phone, RotateCcw } from "lucide-react";
import { db, leads } from "@/lib/db";
import { businessTypes, leadStatuses } from "@/lib/db/schema";
import { buildWhereClause, parseLeadFilters, PAGE_SIZE } from "@/lib/admin/filters";
import { STATUS_META } from "@/lib/admin/status-meta";
import {
  businessTypeLabel,
  sourceLabel,
  formatLeadDate,
  telHref,
  isPhone,
  pluralRu,
} from "@/lib/admin/format";
import { StatusDropdown } from "./[id]/status-dropdown";
import { StatusPill } from "../_components/StatusPill";

export const dynamic = "force-dynamic";

const INPUT =
  "w-full rounded-lg border border-mist bg-paper px-3 py-2 text-sm text-ink-900 transition-colors duration-200 ease-birliy focus:border-ink-500 focus:outline-none focus:ring-4 focus:ring-[#03B73D]/15";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500">{label}</span>
      {children}
    </label>
  );
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") params.set(k, v);
  }
  const filters = parseLeadFilters(params);
  const where = buildWhereClause(filters);

  const [rows, countRows] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE_SIZE)
      .offset((filters.page - 1) * PAGE_SIZE),
    db.select({ n: sql<number>`count(*)::int` }).from(leads).where(where),
  ]);

  const total = countRows[0]?.n ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const exportParams = new URLSearchParams(params);
  exportParams.delete("page");
  const exportUrl = `/admin/leads/export.csv?${exportParams.toString()}`;

  const pageHref = (page: number) =>
    `?${new URLSearchParams({ ...searchParamsToObj(searchParams), page: String(page) }).toString()}`;

  const hasFilters = Boolean(
    filters.from ||
      filters.to ||
      filters.source ||
      filters.businessType ||
      filters.equipment !== null ||
      filters.status ||
      filters.q,
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tightish text-ink-900">Заявки</h1>
          <p className="mt-1 text-sm text-ink-500">
            {hasFilters ? "Найдено" : "Всего"}: {total} {pluralRu(total, "заявка", "заявки", "заявок")}
          </p>
        </div>
        <a
          href={exportUrl}
          className="inline-flex items-center gap-2 rounded-full border border-mist bg-white px-4 py-2 text-sm font-medium text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500"
        >
          <Download size={16} strokeWidth={1.75} />
          Скачать CSV
        </a>
      </div>

      {/* Filters */}
      <form method="get" className="mb-6 rounded-xl border border-mist bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Field label="Поиск по названию или владельцу">
              <div className="relative">
                <Search
                  size={16}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
                />
                <input
                  name="q"
                  defaultValue={filters.q ?? ""}
                  placeholder="Например: Магазин Анвар"
                  className={`${INPUT} pl-9`}
                />
              </div>
            </Field>
          </div>

          <Field label="Статус">
            <select name="status" defaultValue={filters.status ?? ""} className={INPUT}>
              <option value="">Все статусы</option>
              {leadStatuses.map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].emoji} {STATUS_META[s].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Тип бизнеса">
            <select name="type" defaultValue={filters.businessType ?? ""} className={INPUT}>
              <option value="">Все типы</option>
              {businessTypes.map((t) => (
                <option key={t} value={t}>
                  {businessTypeLabel(t)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="С даты">
            <input
              name="from"
              type="date"
              defaultValue={(searchParams.from as string) ?? ""}
              className={INPUT}
            />
          </Field>

          <Field label="По дату">
            <input name="to" type="date" defaultValue={(searchParams.to as string) ?? ""} className={INPUT} />
          </Field>

          <Field label="Источник">
            <input
              name="source"
              defaultValue={filters.source ?? ""}
              placeholder="сайт, telegram_bot…"
              className={INPUT}
            />
          </Field>

          <Field label="Нужно оборудование">
            <select
              name="equipment"
              defaultValue={filters.equipment === null ? "any" : filters.equipment ? "yes" : "no"}
              className={INPUT}
            >
              <option value="any">Не важно</option>
              <option value="yes">Нужно</option>
              <option value="no">Не нужно</option>
            </select>
          </Field>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800"
            >
              Показать
            </button>
            {hasFilters && (
              <a
                href="/admin/leads"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-mist bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:border-ink-500 hover:text-ink-900"
              >
                <RotateCcw size={15} strokeWidth={1.75} />
                Сбросить
              </a>
            )}
          </div>
        </div>
      </form>

      {/* Empty state */}
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-mist bg-white p-12 text-center">
          <div className="text-base font-semibold text-ink-900">Заявок не найдено</div>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">
            {hasFilters
              ? "Под выбранные фильтры ничего нет. Попробуйте изменить или сбросить их."
              : "Новые заявки с сайта и Telegram-бота появятся здесь автоматически."}
          </p>
          {hasFilters && (
            <a
              href="/admin/leads"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800"
            >
              <RotateCcw size={15} strokeWidth={1.75} />
              Сбросить фильтры
            </a>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-mist bg-white shadow-[0_1px_2px_rgba(11,24,38,0.04)] md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist bg-paper text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                  <th className="px-4 py-3">Бизнес</th>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3">Контакт</th>
                  <th className="px-4 py-3">Поступила</th>
                  <th className="px-4 py-3">Источник</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-mist last:border-0 hover:bg-paper">
                    <td className="px-4 py-3.5 align-top">
                      <a
                        href={`/admin/leads/${r.id}`}
                        className="font-semibold text-ink-900 transition-colors duration-200 ease-birliy hover:text-green-700"
                      >
                        {r.businessName}
                      </a>
                      <div className="mt-0.5 text-xs text-ink-500">№ {r.id}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top text-ink-700">
                      {businessTypeLabel(r.businessType, r.businessTypeOther)}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="text-ink-900">{r.ownerName}</div>
                      {isPhone(r.ownerContact) ? (
                        <a
                          href={`tel:${telHref(r.ownerContact)}`}
                          className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-500 transition-colors duration-200 ease-birliy hover:text-green-700"
                        >
                          <Phone size={12} strokeWidth={1.75} />
                          {r.ownerContact}
                        </a>
                      ) : (
                        <div className="mt-0.5 text-xs text-ink-500">{r.ownerContact}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-top text-ink-700">
                      {formatLeadDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 align-top text-ink-700">{sourceLabel(r.source)}</td>
                    <td className="px-4 py-3.5 align-top">
                      <StatusDropdown leadId={r.id} currentStatus={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-mist bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a href={`/admin/leads/${r.id}`} className="font-semibold text-ink-900">
                      {r.businessName}
                    </a>
                    <div className="mt-0.5 text-xs text-ink-500">
                      № {r.id} · {businessTypeLabel(r.businessType, r.businessTypeOther)}
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink-700">{r.ownerName}</span>
                  <span className="shrink-0 text-xs text-ink-500">{formatLeadDate(r.createdAt)}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {isPhone(r.ownerContact) && (
                    <a
                      href={`tel:${telHref(r.ownerContact)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500"
                    >
                      <Phone size={13} strokeWidth={1.75} />
                      Позвонить
                    </a>
                  )}
                  <div className="ml-auto">
                    <StatusDropdown leadId={r.id} currentStatus={r.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-between gap-3 text-sm">
              {filters.page > 1 ? (
                <a
                  href={pageHref(filters.page - 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-4 py-2 font-medium text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500"
                >
                  ← Назад
                </a>
              ) : (
                <span />
              )}
              <span className="text-ink-500">
                Страница {filters.page} из {totalPages}
              </span>
              {filters.page < totalPages ? (
                <a
                  href={pageHref(filters.page + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-4 py-2 font-medium text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500"
                >
                  Вперёд →
                </a>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </>
  );
}

function searchParamsToObj(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}
