"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Calculator,
  Check,
  CreditCard,
  LogOut,
  Minus,
  Package,
  Pause,
  Play,
  Plus,
  QrCode,
  ScanLine,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Wallet,
} from "lucide-react";
import { BarChart, DemoShell, Kpi, Toggle, type NavItem } from "./DemoShell";
import { CHART, CHART_LABELS, EMPLOYEES, KPIS, money as moneyRaw, PRODUCTS, type Filter, type Locale, type Period, type Product, SALES, TOP_SOLD } from "./demoData";

type Section = "kassa" | "finance" | "goods" | "reports" | "control" | "settings" | "exit";
type Stage = "shop" | "pay" | "paid";
type Method = "cash" | "card" | "qr" | "debt";

const STR = {
  ru: {
    store: "Минимаркет «Hilol»",
    point: "Юнусабад, Ташкент",
    cashier: "Азиз Каримов",
    role: "Владелец",
    nav: { kassa: "Касса", finance: "Финансы", goods: "Товары", reports: "Отчёты", control: "Контроль", settings: "Настройки", exit: "Выход" },
    receipt: "Текущий чек",
    emptyTitle: "Корзина пуста.",
    emptyBody: "Добавьте товары из каталога справа.",
    searchPh: "Поиск по названию или штрихкоду...",
    chips: { top: "Топ", noshk: "Без ШК", all: "Все товары" },
    subtotal: "Подытог",
    total: "К оплате",
    clear: "Очистить",
    hold: "Отложить",
    held: "Открыть отложенные",
    pay: "К оплате",
    payTitle: "Выберите способ оплаты",
    methods: { cash: "Наличные", card: "Карта", qr: "QR", debt: "В долг" },
    paidTitle: "Оплачено",
    paidBody: "Электронный чек отправлен покупателю в Telegram.",
    newReceipt: "Новый чек",
    back: "Назад",
    shift: "Текущая смена",
    revenue: "Выручка",
    transactions: "Последние операции",
    inStock: "Остаток",
    price: "Цена",
    low: "Мало",
    ok: "Ок",
    periods: { day: "День", week: "Неделя", month: "Месяц" },
    checks: "Чеков",
    avg: "Средний чек",
    returns: "Возвраты",
    topProducts: "Топ товаров",
    sold: "продано",
    employees: "Сотрудники",
    onShift: "На смене",
    offShift: "Не на смене",
    auditTitle: "Журнал действий",
    audit: ["Открытие смены: 09:02", "Возврат №1039: 13:34", "Скидка 5% на чек №1041: 14:19", "Внесение наличных: 14:40"],
    settingsTitle: "Настройки точки",
    storeName: "Название магазина",
    toggles: { tg: "Чеки в Telegram", print: "Печать бумажного чека", sound: "Звук сканера", dark: "Тёмная тема" },
    exitTitle: "Смена закрыта",
    exitBody: "Вы вышли из кассы. Откройте смену, чтобы продолжить продажи.",
    openShift: "Открыть смену",
    pcs: "шт",
  },
  uz: {
    store: "«Hilol» minimarketi",
    point: "Yunusobod, Toshkent",
    cashier: "Aziz Karimov",
    role: "Egasi",
    nav: { kassa: "Kassa", finance: "Moliya", goods: "Tovarlar", reports: "Hisobotlar", control: "Nazorat", settings: "Sozlamalar", exit: "Chiqish" },
    receipt: "Joriy chek",
    emptyTitle: "Savat bo'sh.",
    emptyBody: "O'ngdagi katalogdan tovar qo'shing.",
    searchPh: "Nomi yoki shtrix-kod bo'yicha qidirish...",
    chips: { top: "Top", noshk: "ShKsiz", all: "Barcha tovarlar" },
    subtotal: "Oraliq",
    total: "To'lovga",
    clear: "Tozalash",
    hold: "Kechiktirish",
    held: "Kechiktirilganlar",
    pay: "To'lov",
    payTitle: "To'lov usulini tanlang",
    methods: { cash: "Naqd", card: "Karta", qr: "QR", debt: "Qarz" },
    paidTitle: "To'landi",
    paidBody: "Elektron chek xaridorga Telegram orqali yuborildi.",
    newReceipt: "Yangi chek",
    back: "Orqaga",
    shift: "Joriy smena",
    revenue: "Tushum",
    transactions: "So'nggi amallar",
    inStock: "Qoldiq",
    price: "Narx",
    low: "Kam",
    ok: "Ok",
    periods: { day: "Kun", week: "Hafta", month: "Oy" },
    checks: "Cheklar",
    avg: "O'rtacha chek",
    returns: "Qaytarishlar",
    topProducts: "Top tovarlar",
    sold: "sotildi",
    employees: "Xodimlar",
    onShift: "Smenada",
    offShift: "Smenada emas",
    auditTitle: "Amallar jurnali",
    audit: ["Smena ochilishi: 09:02", "Qaytarish №1039: 13:34", "5% chegirma №1041: 14:19", "Naqd kiritish: 14:40"],
    settingsTitle: "Nuqta sozlamalari",
    storeName: "Do'kon nomi",
    toggles: { tg: "Telegram cheklari", print: "Qog'oz chek chop etish", sound: "Skaner ovozi", dark: "Tungi rejim" },
    exitTitle: "Smena yopildi",
    exitBody: "Siz kassadan chiqdingiz. Sotuvni davom ettirish uchun smenani oching.",
    openShift: "Smenani ochish",
    pcs: "dona",
  },
} as const;

const FINANCE_BREAKDOWN: { method: Method; sum: number }[] = [
  { method: "cash", sum: 1200000 },
  { method: "card", sum: 1050000 },
  { method: "qr", sum: 900000 },
  { method: "debt", sum: 300000 },
];

const FINANCE_REVENUE = 3_450_000;

export function PosDemo({ locale = "ru" }: { locale?: Locale }) {
  const t = STR[locale];
  const reduce = useReducedMotion() ?? false;
  const name = (p: Product) => (locale === "ru" ? p.ru : p.uz);
  const cat = (p: Product) => (locale === "ru" ? p.catRu : p.catUz);
  const money = (n: number) => moneyRaw(n, locale);

  const [section, setSection] = useState<Section>("kassa");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [held, setHeld] = useState<Record<string, number> | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("top");
  const [stage, setStage] = useState<Stage>("shop");
  const [method, setMethod] = useState<Method | null>(null);
  const [goodsQuery, setGoodsQuery] = useState("");
  const [period, setPeriod] = useState<Period>("day");
  const [toggles, setToggles] = useState({ tg: true, print: false, sound: true, dark: false });
  const [storeName, setStoreName] = useState<string>(t.store);

  // Live revenue: render the static start value on the server, then gently tick up after mount.
  const [liveRevenue, setLiveRevenue] = useState(FINANCE_REVENUE);
  // The demo plays itself (a scripted sale) until the visitor takes over; the
  // first real click anywhere in the demo stops autoplay and hands over control.
  const [userTookOver, setUserTookOver] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setLiveRevenue((r) => r + 1000 + Math.floor(Math.random() * 9) * 500);
    }, 3500);
    return () => window.clearInterval(id);
  }, [reduce]);

  // Scripted self-running sale: rings up three items, pays by QR, then loops.
  // Runs only while >=40% on screen, off under reduced-motion, and yields the
  // moment the visitor clicks (handled by onClick on the demo root below).
  useEffect(() => {
    if (reduce || userTookOver) return;
    const el = rootRef.current;
    if (!el) return;
    let inView = false;
    let timer: number | undefined;
    let step = 0;
    let cancelled = false;
    const script: { run: () => void; wait: number }[] = [
      { run: () => { setSection("kassa"); setStage("shop"); setCart({}); }, wait: 700 },
      { run: () => add("water"), wait: 850 },
      { run: () => add("coffee"), wait: 850 },
      { run: () => add("choco"), wait: 1000 },
      { run: () => setStage("pay"), wait: 1200 },
      { run: () => { setMethod("qr"); setStage("paid"); }, wait: 2000 },
      { run: () => reset(), wait: 1500 },
    ];
    const tick = () => {
      if (cancelled || !inView) return;
      const current = script[step % script.length];
      current.run();
      step += 1;
      timer = window.setTimeout(tick, current.wait);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && timer === undefined && !cancelled) tick();
        else if (!inView && timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); if (timer) window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, userTookOver]);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const okFilter = filter === "all" ? true : p.tags.includes(filter);
      const okQuery = q === "" ? true : name(p).toLowerCase().includes(q);
      return okFilter && okQuery;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, locale]);

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const heldCount = held ? Object.values(held).reduce((s, n) => s + n, 0) : 0;

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const dec = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  const hold = () => {
    if (count === 0) return;
    setHeld(cart);
    setCart({});
  };
  const openHeld = () => {
    if (!held) return;
    setCart(held);
    setHeld(null);
  };
  const reset = () => {
    setCart({});
    setStage("shop");
    setMethod(null);
  };

  const nav: NavItem[] = [
    { id: "kassa", label: t.nav.kassa, icon: Calculator },
    { id: "finance", label: t.nav.finance, icon: Wallet },
    { id: "goods", label: t.nav.goods, icon: Package },
    { id: "reports", label: t.nav.reports, icon: BarChart3 },
    { id: "control", label: t.nav.control, icon: ShieldCheck },
    { id: "settings", label: t.nav.settings, icon: Settings },
    { id: "exit", label: t.nav.exit, icon: LogOut },
  ];

  const goodsList = PRODUCTS.filter((p) => goodsQuery.trim() === "" || name(p).toLowerCase().includes(goodsQuery.trim().toLowerCase()));
  const k = KPIS[period];

  return (
    <div ref={rootRef} onClick={() => { if (!userTookOver) setUserTookOver(true); }}>
    <DemoShell
      logo={<span className="grid h-10 w-10 place-items-center rounded-lg bg-green-700 text-lg font-extrabold text-white">B</span>}
      title={storeName}
      subtitle={t.point}
      userName={t.cashier}
      userRole={t.role}
      avatar={locale === "ru" ? "А" : "A"}
      nav={nav}
      active={section}
      onNavigate={(id) => setSection(id as Section)}
    >
      {section === "kassa" && (
        <div className="relative flex h-full flex-col-reverse md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)]">
          {/* Cart */}
          <section className="flex min-h-0 flex-col border-t border-[#e5ebe6] md:border-r md:border-t-0">
            <div className="flex items-center gap-2 px-4 py-3">
              <ShoppingCart size={18} className="text-green-700" />
              <p className="text-sm font-extrabold">{t.receipt}</p>
              {count > 0 && <span className="ml-auto rounded-full bg-green-700 px-2 py-0.5 text-xs font-extrabold text-white">{count}</span>}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                  <ShoppingCart size={40} className="text-[#cfdad4]" strokeWidth={1.5} />
                  <p className="mt-3 text-sm font-extrabold text-ink-700">{t.emptyTitle}</p>
                  <p className="mt-1 max-w-[22ch] text-xs font-semibold text-ink-500">{t.emptyBody}</p>
                </div>
              ) : (
                <ul className="grid gap-2 pb-2">
                  {lines.map((l) => (
                    <li key={l.product.id} className="flex items-center gap-3 rounded-lg border border-[#e5ebe6] bg-[#fbfcfb] p-2">
                      <span className="grid h-9 w-9 shrink-0 select-none place-items-center overflow-hidden rounded-md bg-green-50 text-lg">
                        {l.product.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.product.image} alt="" className="h-full w-full object-contain p-1" />
                        ) : (
                          l.product.emoji
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold">{name(l.product)}</p>
                        <p className="text-xs font-semibold text-ink-500">{money(l.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => dec(l.product.id)} aria-label="−" className="grid h-7 w-7 place-items-center rounded-md border border-[#d9e2db] text-ink-700 transition hover:bg-[#f1f4f1]">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-extrabold">{l.qty}</span>
                        <button type="button" onClick={() => add(l.product.id)} aria-label="+" className="grid h-7 w-7 place-items-center rounded-md border border-[#d9e2db] text-ink-700 transition hover:bg-[#f1f4f1]">
                          <Plus size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="shrink-0 border-t border-[#e5ebe6] px-4 py-3">
              <div className="flex items-center justify-between text-sm font-semibold text-ink-500">
                <span>{t.subtotal}:</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="mt-1 flex items-end justify-between">
                <span className="text-lg font-extrabold">{t.total}:</span>
                <span className="text-2xl font-extrabold text-green-700">{money(subtotal)}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setCart({})} disabled={count === 0} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d9e2db] text-sm font-extrabold text-ink-700 transition hover:bg-[#f1f4f1] disabled:opacity-45">
                  <Trash2 size={16} /> {t.clear}
                </button>
                <button type="button" onClick={hold} disabled={count === 0} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d9e2db] text-sm font-extrabold text-ink-700 transition hover:bg-[#f1f4f1] disabled:opacity-45">
                  <Pause size={16} /> {t.hold}
                </button>
              </div>
              <button type="button" onClick={openHeld} disabled={!held} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-extrabold text-ink-700 disabled:opacity-40">
                <Play size={14} /> {t.held}
                {heldCount > 0 && <span className="rounded-full bg-[#eef2ee] px-2 py-0.5">{heldCount}</span>}
              </button>
              <button type="button" onClick={() => count > 0 && setStage("pay")} disabled={count === 0} className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-700 text-base font-extrabold text-white shadow-[0_14px_30px_-18px_rgba(3,183,61,0.9)] transition hover:bg-green-700 disabled:bg-[#bfe6c9] disabled:shadow-none">
                {t.pay} {subtotal > 0 && <span>· {money(subtotal)}</span>}
              </button>
            </div>
          </section>

          {/* Catalog */}
          <section className="flex min-h-0 flex-col bg-[#f6f8f6]">
            <div className="shrink-0 space-y-3 p-4">
              <div className="flex items-center gap-2">
                <div className="flex min-h-11 flex-1 items-center gap-2 rounded-lg border border-[#d9e2db] bg-white px-3">
                  <Search size={18} className="text-ink-500" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh} aria-label={t.searchPh} className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none placeholder:text-ink-500" />
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d9e2db] bg-white text-ink-700">
                  <ScanLine size={18} />
                </span>
              </div>
              <div className="flex gap-2">
                {(["top", "noshk", "all"] as Filter[]).map((f) => (
                  <button key={f} type="button" onClick={() => setFilter(f)} className={`inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-extrabold transition ${filter === f ? "bg-green-700 text-white" : "border border-[#d9e2db] bg-white text-ink-700 hover:bg-[#f1f4f1]"}`}>
                    {t.chips[f]}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {products.map((p, i) => {
                  const inCart = cart[p.id] ?? 0;
                  const pulse = !userTookOver && !reduce && i === 0;
                  return (
                    <button key={p.id} type="button" onClick={() => add(p.id)} className="group relative flex flex-col rounded-lg border border-[#e5ebe6] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-green-500 hover:shadow-[0_10px_24px_-18px_rgba(11,24,38,0.5)]">
                      {pulse && (
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-green-500"
                          animate={{ opacity: [0.85, 0.25, 0.85] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      {inCart > 0 && <span className="absolute right-2 top-2 grid h-6 min-w-6 place-items-center rounded-full bg-green-700 px-1 text-xs font-extrabold text-white">{inCart}</span>}
                      <span className="mb-3 grid aspect-square w-full select-none place-items-center overflow-hidden rounded-md bg-[#f1f4f1] text-4xl">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" className="h-full w-full object-contain p-2.5" />
                        ) : (
                          p.emoji
                        )}
                      </span>
                      <span className="line-clamp-2 text-sm font-extrabold leading-tight">{name(p)}</span>
                      <span className="mt-1 text-sm font-extrabold text-green-700">{money(p.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {stage !== "shop" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b1826]/55 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                {stage === "pay" ? (
                  <>
                    <p className="text-xs font-extrabold uppercase tracking-normal text-ink-500">{t.total}</p>
                    <p className="mt-1 text-4xl font-extrabold text-green-700">{money(subtotal)}</p>
                    <p className="mt-5 text-sm font-extrabold">{t.payTitle}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {([{ id: "cash", icon: Wallet }, { id: "card", icon: CreditCard }, { id: "qr", icon: QrCode }, { id: "debt", icon: ShoppingCart }] as { id: Method; icon: typeof Wallet }[]).map((m) => {
                        const Icon = m.icon;
                        return (
                          <button key={m.id} type="button" onClick={() => { setMethod(m.id); setStage("paid"); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#d9e2db] text-sm font-extrabold text-ink-900 transition hover:border-green-500 hover:bg-green-50">
                            <Icon size={18} className="text-green-700" /> {t.methods[m.id]}
                          </button>
                        );
                      })}
                    </div>
                    <button type="button" onClick={() => setStage("shop")} className="mt-4 w-full rounded-lg py-2 text-sm font-extrabold text-ink-500 transition hover:text-ink-900">{t.back}</button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50 text-green-700">
                      <Check size={30} strokeWidth={2.5} />
                    </div>
                    <p className="mt-4 text-xl font-extrabold text-green-800">{t.paidTitle}</p>
                    <p className="mt-1 text-2xl font-extrabold">{money(subtotal)}</p>
                    <p className="mt-1 text-sm font-semibold text-ink-500">{method ? t.methods[method] : ""}</p>
                    <p className="mt-3 text-sm font-semibold text-ink-700">{t.paidBody}</p>
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut", delay: reduce ? 0 : 0.2 }}
                      className="mt-4 flex items-center gap-2.5 rounded-xl bg-[#eaf6fc] p-3 text-left"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#229ED9] text-white">
                        <Send size={15} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#0b1826]">BirLiy</p>
                        <p className="truncate text-xs font-semibold text-ink-700">{locale === "ru" ? "Чек №1042" : "Chek №1042"} · {money(subtotal)}</p>
                      </div>
                    </motion.div>
                    <button type="button" onClick={reset} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink-900 font-extrabold text-white transition hover:bg-ink-700">{t.newReceipt}</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {section === "finance" && (
        <div className="h-full overflow-y-auto p-4">
          <p className="text-xs font-extrabold uppercase tracking-normal text-ink-500">{t.nav.finance} · {t.shift}</p>
          <div className="mt-3 rounded-lg bg-[#0b1826] p-4 text-white">
            <p className="text-xs font-extrabold uppercase tracking-normal text-white/55">{t.revenue}</p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">{money(liveRevenue)}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {FINANCE_BREAKDOWN.map((b) => (
              <div key={b.method} className="rounded-lg border border-[#e5ebe6] bg-white p-3">
                <p className="text-[11px] font-extrabold uppercase tracking-normal text-ink-500">{t.methods[b.method]}</p>
                <p className="mt-1 text-lg font-extrabold">{money(b.sum)}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-extrabold">{t.transactions}</p>
          <ul className="mt-2 divide-y divide-[#eef2ee] overflow-hidden rounded-lg border border-[#e5ebe6]">
            {SALES.slice(0, 6).map((s) => (
              <li key={s.no} className="flex items-center justify-between gap-3 bg-white px-3 py-2.5 text-sm">
                <span className="font-semibold text-ink-500">{s.time}</span>
                <span className="rounded-full bg-[#f1f4f1] px-2 py-0.5 text-xs font-extrabold text-ink-700">{t.methods[s.method]}</span>
                <span className="ml-auto font-extrabold">{money(s.sum)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === "goods" && (
        <div className="flex h-full flex-col">
          <div className="shrink-0 p-4 pb-2">
            <div className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d9e2db] bg-white px-3">
              <Search size={18} className="text-ink-500" />
              <input value={goodsQuery} onChange={(e) => setGoodsQuery(e.target.value)} placeholder={t.searchPh} aria-label={t.searchPh} className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none placeholder:text-ink-500" />
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

      {section === "reports" && (
        <div className="h-full overflow-y-auto p-4">
          <div className="flex gap-2">
            {(["day", "week", "month"] as Period[]).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)} className={`inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-extrabold transition ${period === p ? "bg-green-700 text-white" : "border border-[#d9e2db] bg-white text-ink-700 hover:bg-[#f1f4f1]"}`}>
                {t.periods[p]}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Kpi label={t.revenue} value={money(k.revenue)} accent />
            <Kpi label={t.checks} value={`${k.checks}`} />
            <Kpi label={t.avg} value={money(k.avg)} />
            <Kpi label={t.returns} value={`${k.returns}`} />
          </div>
          <div className="mt-3 rounded-lg border border-[#e5ebe6] bg-white p-4">
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

      {section === "control" && (
        <div className="h-full overflow-y-auto p-4">
          <p className="text-sm font-extrabold">{t.employees}</p>
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
                  <span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${e.onShift ? "bg-[#eef6ef] text-green-700" : "bg-[#f1f4f1] text-ink-500"}`}>
                    {e.onShift ? t.onShift : t.offShift}
                  </span>
                  <p className="mt-1 text-xs font-extrabold">{money(e.revenue)}</p>
                </div>
              </div>
              );
            })}
          </div>
          <p className="mt-5 text-sm font-extrabold">{t.auditTitle}</p>
          <ul className="mt-2 divide-y divide-[#eef2ee] overflow-hidden rounded-lg border border-[#e5ebe6]">
            {t.audit.map((row) => (
              <li key={row} className="bg-white px-3 py-2.5 text-sm font-semibold text-ink-700">{row}</li>
            ))}
          </ul>
        </div>
      )}

      {section === "settings" && (
        <div className="h-full overflow-y-auto p-4">
          <p className="text-sm font-extrabold">{t.settingsTitle}</p>
          <label className="mt-3 block">
            <span className="text-xs font-extrabold uppercase tracking-normal text-ink-500">{t.storeName}</span>
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-[#d9e2db] bg-white px-3 text-sm font-semibold outline-none focus:border-green-500" />
          </label>
          <div className="mt-3 grid gap-2">
            <Toggle label={t.toggles.tg} on={toggles.tg} onClick={() => setToggles((s) => ({ ...s, tg: !s.tg }))} />
            <Toggle label={t.toggles.print} on={toggles.print} onClick={() => setToggles((s) => ({ ...s, print: !s.print }))} />
            <Toggle label={t.toggles.sound} on={toggles.sound} onClick={() => setToggles((s) => ({ ...s, sound: !s.sound }))} />
            <Toggle label={t.toggles.dark} on={toggles.dark} onClick={() => setToggles((s) => ({ ...s, dark: !s.dark }))} />
          </div>
        </div>
      )}

      {section === "exit" && (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#f1f4f1] text-ink-500">
            <LogOut size={26} />
          </span>
          <p className="mt-4 text-xl font-extrabold">{t.exitTitle}</p>
          <p className="mt-1 max-w-[30ch] text-sm font-semibold text-ink-500">{t.exitBody}</p>
          <button type="button" onClick={() => setSection("kassa")} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 font-extrabold text-white transition hover:bg-green-700">
            {t.openShift}
          </button>
        </div>
      )}
    </DemoShell>
    </div>
  );
}
