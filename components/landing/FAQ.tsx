"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LandingDict } from "@/lib/landing/i18n";

export function FAQ({ t }: { t: LandingDict }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            10 / {t.faqTitle}
          </p>
          <h2 className="mt-5 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.faqTitle}
          </h2>
        </div>

        <div className="mt-16 border-t border-mist">
          {t.faq.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-mist">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-semibold leading-snug tracking-tightish text-ink-900 sm:text-xl">
                    {q}
                  </span>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    className={cn(
                      "mt-1 shrink-0 text-ink-500 transition-transform duration-320 ease-birliy",
                      isOpen && "rotate-180 text-ink-900",
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="max-w-2xl pb-6 pr-10 text-[17px] leading-[1.55] text-ink-700">
                    {a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
