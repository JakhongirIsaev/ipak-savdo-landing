"use client";

import { useEffect, useRef, useState } from "react";

// Parses the integer out of values like "49 000", "9 000+", "1", "4".
function parseValue(value: string): { target: number; suffix: string } {
  const digits = value.replace(/[^\d]/g, "");
  const target = digits.length > 0 ? parseInt(digits, 10) : 0;
  // Everything after the last digit is treated as a trailing suffix (e.g. "+").
  const lastDigit = value.search(/\d(?=\D*$)/);
  const suffix = lastDigit === -1 ? "" : value.slice(lastDigit + 1);
  return { target, suffix };
}

// Space-thousands separator to match the source formatting ("49 000").
function format(n: number, suffix: string): string {
  return n.toLocaleString("en-US").replace(/,/g, " ") + suffix;
}

export function CountUp({ value, className }: { value: string; className?: string }): JSX.Element {
  const { target, suffix } = parseValue(value);
  // SSR + first paint render the final formatted value to avoid hydration mismatch.
  const [display, setDisplay] = useState<string>(() => format(target, suffix));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip tiny counters (e.g. "1", "4"): animating 0->N over ~1s is imperceptible
    // and reads as inconsistent next to "49 000"; render them final immediately.
    if (reduce || target < 10) return;

    let raf = 0;
    let started = false;

    const run = () => {
      started = true;
      const duration = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(Math.round(target * eased), suffix));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        }
      };
      setDisplay(format(0, suffix));
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, suffix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
