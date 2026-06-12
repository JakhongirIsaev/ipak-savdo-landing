"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

function parse(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length > 0 ? parseInt(digits, 10) : 0;
}
function format(n: number): string {
  return n.toLocaleString("en-US").replace(/,/g, " ");
}

// Compact "live shift" card pinned to the hero photo: a pulsing status dot plus a
// revenue figure that gently ticks up after mount, so the hero shows a sign of
// life above the fold. SSR renders the static start value (no hydration mismatch);
// reduced motion keeps the number and dot static.
export function LiveShiftBadge({
  locale,
  label,
  value,
  delta,
  status,
}: {
  locale: "ru" | "uz";
  label: string;
  value: string;
  delta: string;
  status: string;
}): JSX.Element {
  const reduce = useReducedMotion() ?? false;
  const [n, setN] = useState(() => parse(value));

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setN((v) => v + 1000 + Math.floor(Math.random() * 9) * 500);
    }, 3500);
    return () => window.clearInterval(id);
  }, [reduce]);

  const suffix = locale === "ru" ? "сум" : "so'm";

  return (
    <div className="absolute right-2 top-2 w-[160px] rounded-xl border border-white/14 bg-[#0b1826]/92 p-2.5 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur sm:-right-3 sm:-top-4 sm:w-[190px] sm:p-3.5">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/70" />}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-normal text-white/55 sm:text-[11px]">{status}</span>
      </div>
      <p className="mt-1.5 text-[10px] font-semibold text-white/55 sm:mt-2 sm:text-[11px]">{label}</p>
      <p className="mt-0.5 flex items-baseline gap-1">
        <span className="text-base font-extrabold tabular-nums text-white sm:text-xl">{format(n)}</span>
        <span className="text-[10px] font-semibold text-white/55 sm:text-xs">{suffix}</span>
      </p>
      <p className="mt-0.5 text-[10px] font-semibold text-green-300 sm:mt-1 sm:text-xs">{delta}</p>
    </div>
  );
}
