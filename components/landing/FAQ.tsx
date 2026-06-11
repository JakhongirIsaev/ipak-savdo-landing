"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LandingDict } from "@/lib/landing/i18n";
import { SectionHead } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

export function FAQ({ t }: { t: LandingDict }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={`09 / ${t.faqTitle}`} title={t.faqTitle} maxTitle="16ch" />

        <Reveal as="div" className="mt-14 border-t border-mist">
          {t.faq.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-mist">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
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
                <div id={`faq-panel-${i}`} role="region" hidden={!isOpen}>
                  <p className="max-w-2xl pb-6 pr-10 text-[17px] leading-[1.55] text-ink-700">
                    {a}
                  </p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
