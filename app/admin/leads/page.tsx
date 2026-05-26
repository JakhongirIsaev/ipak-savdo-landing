import { db, leads } from "@/lib/db";
import { desc } from "drizzle-orm";
import { buildWhereClause, parseLeadFilters, PAGE_SIZE } from "@/lib/admin/filters";

export const dynamic = "force-dynamic";

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

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt))
    .limit(PAGE_SIZE)
    .offset((filters.page - 1) * PAGE_SIZE);

  const exportParams = new URLSearchParams(params);
  exportParams.delete("page");
  const exportUrl = `/admin/leads/export.csv?${exportParams.toString()}`;

  return (
    <main className="mx-auto max-w-7xl p-6 font-mono text-sm">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Ipak Savdo · Leads</h1>
        <a
          href={exportUrl}
          className="rounded-md bg-[#02691A] px-4 py-2 font-semibold text-white"
        >
          Экспорт CSV
        </a>
      </header>

      <form className="mb-4 flex flex-wrap gap-2 text-xs" method="get">
        <input name="from" type="date" defaultValue={searchParams.from as string} className="rounded border px-2 py-1" />
        <input name="to" type="date" defaultValue={searchParams.to as string} className="rounded border px-2 py-1" />
        <input name="source" placeholder="source" defaultValue={searchParams.source as string} className="rounded border px-2 py-1" />
        <select name="type" defaultValue={searchParams.type as string ?? ""} className="rounded border px-2 py-1">
          <option value="">все типы</option>
          <option value="shop">shop</option>
          <option value="cafe">cafe</option>
          <option value="restaurant">restaurant</option>
          <option value="market">market</option>
          <option value="beauty">beauty</option>
          <option value="service">service</option>
          <option value="other">other</option>
        </select>
        <select name="equipment" defaultValue={searchParams.equipment as string ?? "any"} className="rounded border px-2 py-1">
          <option value="any">оборудование: любое</option>
          <option value="yes">да</option>
          <option value="no">нет</option>
        </select>
        <input name="q" placeholder="поиск" defaultValue={searchParams.q as string} className="rounded border px-2 py-1" />
        <button type="submit" className="rounded bg-slate-800 px-3 py-1 text-white">применить</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Дата</th>
              <th className="border px-2 py-1">Бизнес</th>
              <th className="border px-2 py-1">Тип</th>
              <th className="border px-2 py-1">Владелец</th>
              <th className="border px-2 py-1">Контакт</th>
              <th className="border px-2 py-1">Обор.</th>
              <th className="border px-2 py-1">Источник</th>
              <th className="border px-2 py-1">UTM</th>
              <th className="border px-2 py-1">Lang</th>
              <th className="border px-2 py-1">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="even:bg-slate-50">
                <td className="border px-2 py-1">{r.id}</td>
                <td className="border px-2 py-1 whitespace-nowrap">{r.createdAt.toISOString()}</td>
                <td className="border px-2 py-1">{r.businessName}</td>
                <td className="border px-2 py-1">{r.businessType === "other" ? r.businessTypeOther : r.businessType}</td>
                <td className="border px-2 py-1">{r.ownerName}</td>
                <td className="border px-2 py-1">{r.ownerContact}</td>
                <td className="border px-2 py-1 text-center">{r.needsEquipment ? "✓" : ""}</td>
                <td className="border px-2 py-1">{r.source}</td>
                <td className="border px-2 py-1 text-xs text-slate-500">
                  {[r.utmSource, r.utmMedium, r.utmCampaign].filter(Boolean).join(" / ")}
                </td>
                <td className="border px-2 py-1">{r.language}</td>
                <td className="border px-2 py-1 max-w-xs truncate" title={r.comment ?? ""}>{r.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="mt-4 flex gap-2 text-xs">
        {filters.page > 1 && (
          <a href={`?${new URLSearchParams({ ...searchParamsToObj(searchParams), page: String(filters.page - 1) }).toString()}`} className="rounded border px-3 py-1">← Назад</a>
        )}
        <span className="px-3 py-1">Стр. {filters.page}</span>
        {rows.length === PAGE_SIZE && (
          <a href={`?${new URLSearchParams({ ...searchParamsToObj(searchParams), page: String(filters.page + 1) }).toString()}`} className="rounded border px-3 py-1">Вперёд →</a>
        )}
      </nav>
    </main>
  );
}

function searchParamsToObj(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}
