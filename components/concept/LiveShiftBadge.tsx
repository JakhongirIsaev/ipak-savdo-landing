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
    <div className="absolute -right-3 -top-4 w-[190px] rounded-xl border border-white/14 bg-[#0b1826]/92 p-3.5 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/70" />}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-normal text-white/55">{status}</span>
      </div>
      <p className="mt-2 text-[11px] font-semibold text-white/55">{label}</p>
      <p className="mt-0.5 flex items-baseline gap-1">
        <span className="text-xl font-extrabold tabular-nums text-white">{format(n)}</span>
        <span className="text-xs font-semibold text-white/55">{suffix}</span>
      </p>
      <p className="mt-1 text-xs font-semibold text-green-300">{delta}</p>
    </div>
  );
}
