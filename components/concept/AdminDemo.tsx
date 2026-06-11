"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BarChart3, LayoutDashboard, Package, Receipt, Search, Settings, Users } from "lucide-react";
import { BarChart, DemoShell, Kpi, Toggle, type NavItem } from "./DemoShell";
import { CHART, CHART_LABELS, EMPLOYEES, KPIS, money as moneyRaw, PRODUCTS, type Locale, type Period, type Product, SALES, TOP_SOLD } from "./demoData";

type Section = "dashboard" | "sales" | "goods" | "staff" | "reports" | "settings";
type MethodFilter = "all" | "cash" | "card" | "qr" | "debt";

const STR = {
  ru: {
    brand: "BirLiy · Админка",
    sub: "«Hilol» · 1 точка",
    owner: "Азиз Каримов",
    role: "Владелец",
    nav: { dashboard: "Дашборд", sales: "Продажи", goods: "Товары", staff: "Сотрудники", reports: "Отчёты", settings: "Настройки" },
    periods: { day: "День", week: "Неделя", month: "Месяц" },
    revenue: "Выручка",
    checks: "Чеков",
    avg: "Средний чек",
    returns: "Возвраты",
    dynamics: "Динамика выручки",
    topProducts: "Топ товаров",
    sold: "продано",
    allMethods: "Все",
    methods: { cash: "Наличные", card: "Карта", qr: "QR", debt: "Долг" },
    salesTitle: "Последние продажи",
    cols: { time: "Время", check: "Чек", sum: "Сумма", method: "Оплата", cashier: "Кассир" },
    searchPh: "Поиск товара...",
    inStock: "Остаток",
    price: "Цена",
    low: "Мало",
    staffTitle: "Сотрудники и смены",
    onShift: "На смене",
    offShift: "Не на смене",
    today: "сегодня",
    byCategory: "Выручка по категориям",
    settingsTitle: "Настройки бизнеса",
    storeName: "Название",
    points: "Точки продаж",
    toggles: { tg: "Уведомления в Telegram", multi: "Несколько точек", returns: "Разрешить возвраты кассиру", discount: "Скидки на кассе" },
  },
  uz: {
    brand: "BirLiy · Admin",
    sub: "«Hilol» · 1 nuqta",
    owner: "Aziz Karimov",
    role: "Egasi",
    nav: { dashboard: "Boshqaruv", sales: "Sotuvlar", goods: "Tovarlar", staff: "Xodimlar", reports: "Hisobotlar", settings: "Sozlamalar" },
    periods: { day: "Kun", week: "Hafta", month: "Oy" },
    revenue: "Tushum",
    checks: "Cheklar",
    avg: "O'rtacha chek",
    returns: "Qaytarishlar",
    dynamics: "Tushum dinamikasi",
    topProducts: "Top tovarlar",
    sold: "sotildi",
    allMethods: "Barchasi",
    methods: { cash: "Naqd", card: "Karta", qr: "QR", debt: "Qarz" },
    salesTitle: "So'nggi sotuvlar",
    cols: { time: "Vaqt", check: "Chek", sum: "Summa", method: "To'lov", cashier: "Kassir" },
    searchPh: "Tovar qidirish...",
    inStock: "Qoldiq",
    price: "Narx",
    low: "Kam",
    staffTitle: "Xodimlar va smenalar",
    onShift: "Smenada",
    offShift: "Smenada emas",
    today: "bugun",
    byCategory: "Kategoriya bo'yicha tushum",
    settingsTitle: "Biznes sozlamalari",
    storeName: "Nomi",
    points: "Sotuv nuqtalari",
    toggles: { tg: "Telegram bildirishnomalari", multi: "Bir nechta nuqta", returns: "Kassirga qaytarishga ruxsat", discount: "Kassada chegirmalar" },
  },
} as const;

export function AdminDemo({ locale = "ru" }: { locale?: Locale }) {
  const t = STR[locale];
  const reduce = useReducedMotion() ?? false;
  const name = (p: Product) => (locale === "ru" ? p.ru : p.uz);
  const cat = (p: Product) => (locale === "ru" ? p.catRu : p.catUz);
  const money = (n: number) => moneyRaw(n, locale);

  const [section, setSection] = useState<Section>("dashboard");
  const [period, setPeriod] = useState<Period>("week");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [query, setQuery] = useState("");
  const [toggles, setToggles] = useState({ tg: true, multi: false, returns: true, discount: false });

  const k = KPIS[period];

  // Live revenue: render the static period base on the server, then gently tick up after mount.
  const [liveRevenue, setLiveRevenue] = useState(k.revenue);

  useEffect(() => {
    setLiveRevenue(k.revenue);
    // Only the "day" figure is plausibly live; week/month totals stay static historicals.
    if (reduce || period !== "day") return;
    const id = window.setInterval(() => {
      setLiveRevenue((r) => r + 2000 + Math.floor(Math.random() * 9) * 1000);
    }, 3500);
    return () => window.clearInterval(id);
  }, [k.revenue, reduce, period]);
  const sales = SALES.filter((s) => methodFilter === "all" || s.method === methodFilter);
  const goodsList = PRODUCTS.filter((p) => query.trim() === "" || name(p).toLowerCase().includes(query.trim().toLowerCase()));

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    TOP_SOLD.forEach((row) => {
      const p = PRODUCTS.find((x) => x.id === row.id)!;
      const key = cat(p);
      map.set(key, (map.get(key) ?? 0) + p.price * row.qty);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
  const catMax = Math.max(...byCategory.map(([, v]) => v), 1);

  const nav: NavItem[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "sales", label: t.nav.sales, icon: Receipt },
    { id: "goods", label: t.nav.goods, icon: Package },
    { id: "staff", label: t.nav.staff, icon: Users },
    { id: "reports", label: t.nav.reports, icon: BarChart3 },
    { id: "settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <DemoShell
      logo={<span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-lg font-extrabold text-[#0b1826]">B</span>}
      title={t.brand}
      subtitle={t.sub}
      userName={t.owner}
      userRole={t.role}
      avatar={t.owner[0]}
      nav={nav}
      active={section}
      onNavigate={(id) => setSection(id as Section)}
    >
      {section === "dashboard" && (
        <div className="h-full overflow-y-auto p-4">
          <div className="flex gap-2">
            {(["day", "week", "month"] as Period[]).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)} className={`inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-extrabold transition ${period === p ? "bg-green-700 text-white" : "border border-[#d9e2db] bg-white text-ink-700 hover:bg-[#f1f4f1]"}`}>
                {t.periods[p]}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Kpi label={t.revenue} value={money(liveRevenue)} accent />
            <Kpi label={t.checks} value={`${k.checks}`} />
            <Kpi label={t.avg} value={money(k.avg)} />
            <Kpi label={t.returns} value={`${k.returns}`} />
          </div>
          <div className="mt-3 rounded-lg border border-[#e5ebe6] bg-white p-4">
            <p className="mb-3 text-sm font-extrabold">{t.dynamics}</p>
            <BarChart values={CHART[period]} labels={CHART_LABELS[locale][period]} />
          </div>
          <p className="mt-5 text-sm font-extrabold">{t.topProducts}</p>
          <ul className="mt-2 divide-y divide-[#eef2ee] overflow-hidden rounded-lg border border-[#e5ebe6]">
            {TOP_SOLD.map((row) => {
              const p = PRODUCTS.find((x) => x.id === row.id)!;
              return (
                <li key={row.id} className="flex items-center gap-3 bg-white px-3 py-2.5 text-sm">
                  <span className="font-extrabold">{name(p)}</span>
                  <span className="ml-auto text-xs font-semibold text-ink-500">{row.qty} {t.sold}</span>
                  <span className="font-extrabold text-green-700">{money(p.price * row.qty)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {section === "sales" && (
        <div className="flex h-full flex-col">
          <div className="shrink-0 p-4 pb-2">
            <p className="mb-2 text-sm font-extrabold">{t.salesTitle}</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "cash", "card", "qr", "debt"] as MethodFilter[]).map((m) => (
                <button key={m} type="button" onClick={() => setMethodFilter(m)} className={`inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-extrabold transition ${methodFilter === m ? "bg-green-700 text-white" : "border border-[#d9e2db] bg-white text-ink-700 hover:bg-[#f1f4f1]"}`}>
                  {m === "all" ? t.allMethods : t.methods[m]}
                </button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-t-lg bg-[#f1f4f1] px-3 py-2 text-[11px] font-extrabold uppercase tracking-normal text-ink-500">
              <span>{t.cols.time}</span>
              <span>{t.cols.method} · {t.cols.cashier}</span>
              <span className="text-right">{t.cols.sum}</span>
            </div>
            <ul className="divide-y divide-[#eef2ee] rounded-b-lg border border-t-0 border-[#e5ebe6]">
              {sales.map((s) => (
                <li key={s.no} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 bg-white px-3 py-2.5">
                  <span className="text-sm font-semibold text-ink-500">{s.time}</span>
                  <div className="min-w-0">
                    <span className="rounded-full bg-[#f1f4f1] px-2 py-0.5 text-xs font-extrabold text-ink-700">{t.methods[s.method]}</span>
                    <span className="ml-2 text-xs font-semibold text-ink-500">№{s.no} · {locale === "ru" ? s.cashierRu : s.cashierUz}</span>
                  </div>
                  <span className="text-right text-sm font-extrabold">{money(s.sum)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {section === "goods" && (
        <div className="flex h-full flex-col">
          <div className="shrink-0 p-4 pb-2">
            <div className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d9e2db] bg-white px-3">
              <Search size={18} className="text-ink-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh} aria-label={t.searchPh} className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none placeholder:text-ink-500" />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 rounded-t-lg bg-[#f1f4f1] px-3 py-2 text-[11px] font-extrabold uppercase tracking-normal text-ink-500">
              <span>{t.nav.goods}</span>
              <span className="text-right">{t.inStock}</span>
              <span className="text-right">{t.price}</span>
            </div>
            <ul className="divide-y divide-[#eef2ee] rounded-b-lg border border-t-0 border-[#e5ebe6]">
              {goodsList.map((p) => (
                <li key={p.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 bg-white px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{name(p)}</p>
                    <p className="text-xs font-semibold text-ink-500">{cat(p)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-right text-xs font-extrabold ${p.stock < 20 ? "bg-[#fdeceb] text-red-700" : "bg-[#eef6ef] text-green-700"}`}>
                    {p.stock} {p.stock < 20 ? t.low : ""}
                  </span>
                  <span className="text-right text-sm font-extrabold">{money(p.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {section === "staff" && (
        <div className="h-full overflow-y-auto p-4">
          <p className="text-sm font-extrabold">{t.staffTitle}</p>
          <div className="mt-2 grid gap-2">
            {EMPLOYEES.map((e) => {
              const empName = locale === "ru" ? e.nameRu : e.nameUz;
              return (
              <div key={e.nameRu} className="flex items-center gap-3 rounded-lg border border-[#e5ebe6] bg-white p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-green-50 text-sm font-extrabold text-green-700">{empName[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">{empName}</p>
                  <p className="text-xs font-semibold text-ink-500">{locale === "ru" ? e.roleRu : e.roleUz}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${e.onShift ? "bg-[#eef6ef] text-green-700" : "bg-[#f1f4f1] text-ink-500"}`}>{e.onShift ? t.onShift : t.offShift}</span>
                  <p className="mt-1 text-xs font-extrabold">{money(e.revenue)} <span className="font-semibold text-ink-500">{t.today}</span></p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {section === "reports" && (
        <div className="h-full overflow-y-auto p-4">
          <p className="text-sm font-extrabold">{t.byCategory}</p>
          <div className="mt-3 grid gap-3">
            {byCategory.map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-extrabold">{label}</span>
                  <span className="font-extrabold text-green-700">{money(value)}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eef2ee]">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${Math.round((value / catMax) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-[#e5ebe6] bg-white p-4">
            <p className="mb-3 text-sm font-extrabold">{t.dynamics}</p>
            <BarChart values={CHART.week} labels={CHART_LABELS[locale].week} />
          </div>
        </div>
      )}

      {section === "settings" && (
        <div className="h-full overflow-y-auto p-4">
          <p className="text-sm font-extrabold">{t.settingsTitle}</p>
          <div className="mt-3 grid gap-2">
            <Toggle label={t.toggles.tg} on={toggles.tg} onClick={() => setToggles((s) => ({ ...s, tg: !s.tg }))} />
            <Toggle label={t.toggles.multi} on={toggles.multi} onClick={() => setToggles((s) => ({ ...s, multi: !s.multi }))} />
            <Toggle label={t.toggles.returns} on={toggles.returns} onClick={() => setToggles((s) => ({ ...s, returns: !s.returns }))} />
            <Toggle label={t.toggles.discount} on={toggles.discount} onClick={() => setToggles((s) => ({ ...s, discount: !s.discount }))} />
          </div>
          <p className="mt-5 text-sm font-extrabold">{t.points}</p>
          <div className="mt-2 rounded-lg border border-[#e5ebe6] bg-white px-3 py-2.5 text-sm">
            <p className="font-extrabold">{locale === "ru" ? "Минимаркет «Hilol»" : "«Hilol» minimarketi"}</p>
            <p className="text-xs font-semibold text-ink-500">{locale === "ru" ? "Юнусабад, Ташкент · 2 кассира" : "Yunusobod, Toshkent · 2 kassir"}</p>
          </div>
        </div>
      )}
    </DemoShell>
  );
}
