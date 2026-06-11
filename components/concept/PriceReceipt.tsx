"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Printer } from "lucide-react";
import { type Locale } from "./demoData";

const STR = {
  ru: {
    header: "BIRLIY · ЧЕК №0001",
    included: [
      ["Подписка (1 мес)", "49 000"],
      ["Касса", "включено"],
      ["Склад и остатки", "включено"],
      ["Долговая тетрадь", "включено"],
      ["Отчёты", "включено"],
    ] as [string, string][],
    zeros: [
      ["Оборудование", "0"],
      ["Установка", "0"],
      ["Обучение", "0"],
    ] as [string, string][],
    day: [
      ["За один день", "1 633"],
      ["Пиала чая", "~3 000"],
    ] as [string, string][],
    total: "ИТОГО: спокойствие",
    foot: "первые 6 месяцев · birliy.uz",
    again: "Напечатать ещё раз",
  },
  uz: {
    header: "BIRLIY · CHEK №0001",
    included: [
      ["Obuna (1 oy)", "49 000"],
      ["Kassa", "kiritilgan"],
      ["Ombor va qoldiqlar", "kiritilgan"],
      ["Qarz daftari", "kiritilgan"],
      ["Hisobotlar", "kiritilgan"],
    ] as [string, string][],
    zeros: [
      ["Uskuna", "0"],
      ["O'rnatish", "0"],
      ["O'rgatish", "0"],
    ] as [string, string][],
    day: [
      ["Bir kun uchun", "1 633"],
      ["Bir piyola choy", "~3 000"],
    ] as [string, string][],
    total: "JAMI: xotirjamlik",
    foot: "birinchi 6 oy · birliy.uz",
    again: "Yana chop etish",
  },
} as const;

const STEP_MS = 380;
// rows: 1 header + 5 included + 3 zeros + 2 day + 1 total + 1 foot = 13
const TOTAL_ROWS = 13;

// Colors for amount cells
function amountClass(amount: string): string {
  if (amount === "включено" || amount === "kiritilgan") return "text-[#1d7f3f] shrink-0 whitespace-nowrap tabular-nums";
  if (amount === "0") return "text-[#1d7f3f] shrink-0 whitespace-nowrap tabular-nums";
  return "text-[#1c2a24] shrink-0 whitespace-nowrap tabular-nums";
}

export function PriceReceipt({ locale = "uz" }: { locale?: Locale }) {
  const reduce = useReducedMotion() ?? false;
  const t = STR[locale];
  const [shown, setShown] = useState(reduce ? TOTAL_ROWS : 0);
  const [runId, setRunId] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Replay-on-re-entry + reprint mechanic
  useEffect(() => {
    if (reduce) return;
    const el = rootRef.current;
    if (!el) return;
    let inView = false;
    let timer: number | undefined;
    let count = 0;

    // Scheduling lives outside the state updater so StrictMode's double
    // updater invocation in dev can't multiply timers.
    const tick = () => {
      if (!inView) return;
      count += 1;
      setShown(Math.min(count, TOTAL_ROWS));
      if (count < TOTAL_ROWS) timer = window.setTimeout(tick, STEP_MS);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (timer !== undefined) {
          window.clearTimeout(timer);
          timer = undefined;
        }
        if (inView) {
          count = 0;
          setShown(0);
          timer = window.setTimeout(tick, 300);
        } else {
          setShown(0);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, runId]);

  const reprint = () => {
    setShown(0);
    setRunId((id) => id + 1);
  };

  const done = shown >= TOTAL_ROWS;

  // Build rows array
  const allRows: { key: string; content: React.ReactNode }[] = [];

  // row 0: header
  allRows.push({
    key: "header",
    content: (
      <p className="text-center font-bold tracking-wider">{t.header}</p>
    ),
  });

  // rows 1-5: included (with dashed divider before first)
  for (let i = 0; i < t.included.length; i++) {
    const [label, amount] = t.included[i];
    allRows.push({
      key: `included-${i}`,
      content: (
        <div
          className={`flex justify-between gap-2 ${i === 0 ? "mt-1 border-t border-dashed border-[#9aa9a0] pt-1" : ""}`}
        >
          <span className="min-w-0 flex-1">{label}</span>
          <span className={amountClass(amount)}>{amount}</span>
        </div>
      ),
    });
  }

  // rows 6-8: zeros (with dashed divider before first)
  for (let i = 0; i < t.zeros.length; i++) {
    const [label, amount] = t.zeros[i];
    allRows.push({
      key: `zero-${i}`,
      content: (
        <div
          className={`flex justify-between gap-2 ${i === 0 ? "mt-1 border-t border-dashed border-[#9aa9a0] pt-1" : ""}`}
        >
          <span className="min-w-0 flex-1">{label}</span>
          <span className={amountClass(amount)}>{amount}</span>
        </div>
      ),
    });
  }

  // rows 9-10: day (with dashed divider before first)
  for (let i = 0; i < t.day.length; i++) {
    const [label, amount] = t.day[i];
    allRows.push({
      key: `day-${i}`,
      content: (
        <div
          className={`flex justify-between gap-2 ${i === 0 ? "mt-1 border-t border-dashed border-[#9aa9a0] pt-1" : ""}`}
        >
          <span className="min-w-0 flex-1">{label}</span>
          <span className={amountClass(amount)}>{amount}</span>
        </div>
      ),
    });
  }

  // row 11: total (with dashed divider)
  allRows.push({
    key: "total",
    content: (
      <p className="mt-2 border-t border-dashed border-[#9aa9a0] pt-2 text-center text-[14px] font-extrabold">
        {t.total}
      </p>
    ),
  });

  // row 12: foot + barcode
  allRows.push({
    key: "foot",
    content: (
      <>
        <p className="mt-1 text-center text-[10px] text-[#7b8a81]">{t.foot}</p>
        <div
          aria-hidden
          className="mx-auto mt-2 h-6 w-32 [background:repeating-linear-gradient(90deg,#1c2a24_0_2px,transparent_2px_5px)]"
        />
      </>
    ),
  });

  return (
    <div ref={rootRef} className="mt-8 select-none" aria-hidden="false">
      {/* Printer slot */}
      <div className="mx-auto h-3 w-56 rounded-full bg-black/60 shadow-inner" />

      {/* Receipt wrapper */}
      <div
        className="mx-auto -mt-1 w-72 sm:w-80 transition-transform duration-300 ease-out"
        style={{
          transform: reduce
            ? "rotate(-1deg)"
            : done
            ? "rotate(-1.8deg) translateY(4px)"
            : "rotate(-1deg)",
        }}
      >
        {/* White receipt body */}
        <div className="bg-white px-4 pb-4 pt-3 font-mono text-[12px] leading-5 text-[#1c2a24] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
          {allRows.map(({ key, content }, i) => (
            <div
              key={key}
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: i < shown ? "2.5rem" : "0",
                opacity: i < shown ? 1 : 0,
              }}
            >
              {content}
            </div>
          ))}
        </div>
        {/* Zigzag torn edge */}
        <div
          aria-hidden
          className="h-2 w-full"
          style={{
            background:
              "linear-gradient(-45deg, transparent 8px, #fff 0) 0 0 / 16px 16px, linear-gradient(45deg, transparent 8px, #fff 0) 8px 0 / 16px 16px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>

      {/* Print again button - only shown when done, hidden during animation */}
      {!reduce && done && (
        <button
          type="button"
          onClick={reprint}
          className="mx-auto mt-4 flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <Printer size={14} /> {t.again}
        </button>
      )}
    </div>
  );
}
