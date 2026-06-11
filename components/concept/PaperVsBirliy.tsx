"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { money, type Locale } from "./demoData";

// Split-screen "same debt notebook, two outcomes". The left half is a school
// squared notebook (qarz daftari) that writes itself row by row: open debts,
// a repaid one the owner is not sure about, an amount added later, and a
// name that has been forgotten entirely. The right half shows the same debts
// landing in BirLiy with chips, timestamps and a running total that forgets
// nothing.

type DebtKind = "open" | "paid" | "added" | "forgotten";
type Debt = {
  id: string;
  ru: string;
  uz: string;
  amount: number;
  base?: number;
  extra?: number;
  kind: DebtKind;
  dayRu: string;
  dayUz: string;
  time: string;
};

const DEBTS: Debt[] = [
  { id: "karim",   ru: "Карим ака",    uz: "Karim aka",    amount: 50_000, kind: "open",      dayRu: "пн",  dayUz: "du",  time: "11:38" },
  { id: "dilnoza", ru: "Дилноза опа",  uz: "Dilnoza opa",  amount: 32_000, kind: "paid",      dayRu: "вт",  dayUz: "se",  time: "16:20" },
  { id: "alisher", ru: "Алишер",       uz: "Alisher",      amount: 43_000, base: 25_000, extra: 18_000, kind: "added", dayRu: "ср", dayUz: "cho", time: "18:44" },
  { id: "rustam",  ru: "Рустам",       uz: "Rustam",       amount: 40_000, kind: "forgotten", dayRu: "чт",  dayUz: "pa",  time: "14:05" },
];

// Outstanding debt only; the repaid one is excluded, like in the app.
const OPEN_TOTAL = DEBTS.filter((d) => d.kind !== "paid").reduce((s, d) => s + d.amount, 0);

const STR = {
  ru: {
    paperBadge: "Тетрадь",
    appBadge: "BirLiy",
    paperTitle: "Долговая тетрадь",
    appTitle: "Долги",
    total: "Итого",
    paperTotal: "≈ ???",
    paperOops: "кто вернул?!",
    paidDoubt: "вернула?..",
    forgotName: "кто это?..",
    debtBtn: "+ Продать в долг",
    btnHint: "в одно нажатие",
    qarzTotal: "Всего в долг",
    appDone: "Ничего не забывается",
    chipPaid: "оплачено",
    chipReminder: "напоминание отправлено",
    chipTwice: "2 раза",
    chipForgot: "в тетради: ???",
    caption: "Те же долги. Тетрадь забывает, BirLiy помнит.",
  },
  uz: {
    paperBadge: "Daftar",
    appBadge: "BirLiy",
    paperTitle: "Qarz daftari",
    appTitle: "Qarzlar",
    total: "Jami",
    paperTotal: "≈ ???",
    paperOops: "kim to'ladi?!",
    paidDoubt: "to'laganmi?..",
    forgotName: "kim edi?..",
    debtBtn: "+ Qarzga sotish",
    btnHint: "bir bosishda",
    qarzTotal: "Jami qarz",
    appDone: "Hech narsa unutilmaydi",
    chipPaid: "to'landi",
    chipReminder: "eslatma yuborildi",
    chipTwice: "2 marta",
    chipForgot: "daftarda: ???",
    caption: "O'sha qarzlar. Daftar unutadi, BirLiy eslaydi.",
  },
} as const;

// Timeline: step 1..N reveals debt i on both sides; step N+1 reveals totals;
// then hold and loop. Reduced motion renders the final state statically.
const STEP_MS = 1500;
const HOLD_STEPS = 3;

const fmt = (n: number) => n.toLocaleString("ru-RU");

export function PaperVsBirliy({ locale = "uz" }: { locale?: Locale }) {
  const reduce = useReducedMotion() ?? false;
  const t = STR[locale];
  const totalSteps = DEBTS.length + 1;
  const [step, setStep] = useState(reduce ? totalSteps : 0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;
    let inView = false;
    let timer: number | undefined;
    const tick = () => {
      if (!inView) return;
      setStep((s) => (s >= totalSteps + HOLD_STEPS ? 0 : s + 1));
      timer = window.setTimeout(tick, STEP_MS);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && timer === undefined) timer = window.setTimeout(tick, 400);
        if (!inView && timer !== undefined) {
          window.clearTimeout(timer);
          timer = undefined;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [reduce, totalSteps]);

  const name = (d: Debt) => (locale === "ru" ? d.ru : d.uz);
  const day  = (d: Debt) => (locale === "ru" ? d.dayRu : d.dayUz);
  const shown = Math.min(step, DEBTS.length);
  const totalsOn = step > DEBTS.length;
  const runningOpen = DEBTS.slice(0, shown).filter((d) => d.kind !== "paid").reduce((s, d) => s + d.amount, 0);
  const writingIndex = !reduce && step >= 1 && step <= DEBTS.length ? shown - 1 : -1;

  const penDot = (
    <span aria-hidden className="absolute bottom-[7px] right-0 h-[5px] w-[5px] rounded-full bg-[#1f3d8c]" />
  );

  const chipClass = (kind: DebtKind): string => {
    if (kind === "paid")     return "bg-green-500/20 text-green-300";
    if (kind === "added")    return "bg-white/[0.1] text-white/70";
    // open and forgotten both use amber
    return "bg-amber-400/15 text-amber-300";
  };

  const chipText = (kind: DebtKind): string => {
    if (kind === "paid")      return t.chipPaid;
    if (kind === "added")     return t.chipTwice;
    if (kind === "forgotten") return t.chipForgot;
    return t.chipReminder;
  };

  return (
    <div ref={rootRef}>
      <div className="grid overflow-hidden rounded-2xl border border-[#d9e2db] shadow-[0_24px_70px_-50px_rgba(11,24,38,0.5)] md:grid-cols-2">
        {/* LEFT: squared-notebook daftar, handwritten */}
        <div className="relative min-h-[21rem] overflow-hidden bg-[#f8f2e0] p-5 sm:p-6">
          {/* squared (kletka) grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(to_bottom,transparent,transparent_14px,rgba(96,130,182,0.20)_14px,rgba(96,130,182,0.20)_15px),repeating-linear-gradient(to_right,transparent,transparent_14px,rgba(96,130,182,0.15)_14px,rgba(96,130,182,0.15)_15px)]"
          />
          {/* red margin line */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-9 w-px bg-[#d98b8b]/80" />
          {/* tea-glass stain */}
          <div aria-hidden className="pointer-events-none absolute right-10 top-6 h-16 w-16 rounded-full border-[6px] border-[#a5803a]/15 blur-[0.5px]" />
          {/* folded corner */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 [background:linear-gradient(to_top_right,#ebe1c4_50%,transparent_50%)] drop-shadow-[2px_-2px_2px_rgba(90,70,30,0.18)]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-[#2a3550]/85 px-2.5 py-1 text-[11px] font-bold text-[#f3ecd9]">
            {t.paperBadge}
          </span>
          <div className="relative mt-9 pl-4 [font-family:var(--font-hand)]">
            <p className="text-xl font-semibold text-[#1f3d8c] underline decoration-from-font">{t.paperTitle}</p>
            <ul className="mt-2">
              {DEBTS.map((d, i) => {
                const visible = i < shown;
                const writing = i === writingIndex;
                const tilt = i % 2 ? "-rotate-[0.6deg]" : "rotate-[0.45deg]";

                if (d.kind === "forgotten") {
                  return (
                    <li
                      key={d.id}
                      className={`flex h-[30px] items-baseline justify-between gap-4 text-[19px] leading-[30px] text-[#1f3d8c] ${tilt}`}
                    >
                      <span
                        className="inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width] duration-1000 ease-linear"
                        style={{ maxWidth: visible ? "100%" : "0%" }}
                      >
                        <span className="text-[#c0392b] blur-[0.5px]">{t.forgotName}</span>
                      </span>
                      <span
                        className="relative inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width] delay-300 duration-700 ease-linear"
                        style={{ maxWidth: visible ? "100%" : "0%" }}
                      >
                        {fmt(d.amount)}
                        {writing ? penDot : null}
                      </span>
                    </li>
                  );
                }

                if (d.kind === "added") {
                  return (
                    <li
                      key={d.id}
                      className={`flex h-[30px] items-baseline justify-between gap-4 text-[19px] leading-[30px] text-[#1f3d8c] ${tilt}`}
                    >
                      <span
                        className="inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width] duration-1000 ease-linear"
                        style={{ maxWidth: visible ? "100%" : "0%" }}
                      >
                        {name(d)}
                      </span>
                      <span
                        className="relative inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width] delay-300 duration-700 ease-linear"
                        style={{ maxWidth: visible ? "100%" : "0%" }}
                      >
                        {fmt(d.base ?? d.amount)}
                        {" "}
                        <span
                          className={`font-semibold transition-opacity duration-300 delay-1000 ${visible ? "opacity-100" : "opacity-0"}`}
                        >
                          +{fmt(d.extra ?? 0)}
                        </span>
                        {writing ? penDot : null}
                      </span>
                    </li>
                  );
                }

                // open and paid
                return (
                  <li
                    key={d.id}
                    className={`flex h-[30px] items-baseline justify-between gap-4 text-[19px] leading-[30px] text-[#1f3d8c] ${tilt}`}
                  >
                    <span
                      className="inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width] duration-1000 ease-linear"
                      style={{ maxWidth: visible ? "100%" : "0%" }}
                    >
                      {name(d)}
                    </span>
                    <span
                      className="relative inline-block overflow-hidden whitespace-nowrap align-bottom transition-[max-width] delay-300 duration-700 ease-linear"
                      style={{ maxWidth: visible ? "100%" : "0%" }}
                    >
                      {fmt(d.amount)}
                      {d.kind === "paid" ? (
                        <span
                          className={`text-[15px] text-[#c0392b] transition-opacity duration-500 delay-500 ${totalsOn ? "opacity-100" : "opacity-0"}`}
                        >
                          {" "}{t.paidDoubt}
                        </span>
                      ) : null}
                      {writing ? penDot : null}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p
              className={`mt-4 text-[22px] font-semibold text-[#c0392b] transition-opacity duration-700 ${totalsOn ? "-rotate-[0.8deg] opacity-100" : "opacity-0"}`}
            >
              {t.total}: {t.paperTotal}
            </p>
            <p
              className={`text-[17px] font-semibold text-[#c0392b]/90 underline decoration-wavy decoration-from-font transition-opacity delay-700 duration-700 ${totalsOn ? "rotate-[0.6deg] opacity-100" : "opacity-0"}`}
            >
              {t.paperOops}
            </p>
          </div>
        </div>

        {/* RIGHT: the same debts in BirLiy */}
        <div className="relative flex min-h-[21rem] flex-col bg-gradient-to-br from-[#0b1826] to-[#13324a] p-5 text-white sm:p-6">
          <span className="absolute right-4 top-4 rounded-full bg-green-700 px-2.5 py-1 text-[11px] font-bold text-white">
            {t.appBadge}
          </span>
          <p className="text-xs font-extrabold uppercase tracking-normal text-green-300">{t.appTitle}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className={`inline-flex items-center rounded-md bg-green-600 px-2.5 py-1.5 text-[12px] font-extrabold text-white transition-transform duration-300 ${step >= 1 ? "scale-100" : "scale-90"}`}
            >
              {t.debtBtn}
            </span>
            <span className="text-[10px] font-semibold text-white/45">{t.btnHint}</span>
          </div>
          <ul className="mt-2.5 grid gap-1.5">
            {DEBTS.map((d, i) => {
              const visible = i < shown;
              return (
                <li
                  key={d.id}
                  className={`flex items-center justify-between gap-3 rounded-md px-3 py-1.5 text-sm font-bold transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${d.kind === "paid" ? "bg-green-500/10" : "bg-white/[0.07]"}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-white/85">{name(d)}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${chipClass(d.kind)}`}>{chipText(d.kind)}</span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-2">
                    <span className="hidden text-[10px] font-semibold text-white/40 sm:inline">{day(d)} {d.time}</span>
                    <span className={`tabular-nums ${d.kind === "paid" ? "text-white/45 line-through" : "text-white"}`}>{fmt(d.amount)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto pt-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white/55">{t.qarzTotal}</p>
                <p className="text-3xl font-extrabold tabular-nums">{money(totalsOn ? OPEN_TOTAL : runningOpen, locale)}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-[11px] font-bold text-green-300 transition-opacity duration-500 ${totalsOn ? "opacity-100" : "opacity-0"}`}
              >
                <Check size={13} strokeWidth={3} /> {t.appDone}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-ink-500">{t.caption}</p>
    </div>
  );
}
