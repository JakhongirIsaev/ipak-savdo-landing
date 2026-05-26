"use client";

import LeadFormStandalone from "@/components/LeadForm";
import { type LandingDict } from "@/lib/landing/i18n";
import { useAttribution } from "@/lib/use-attribution";
import type { Locale } from "@/components/landing/_shared";

interface LeadSectionProps {
  t: LandingDict;
  locale: Locale;
  attribution: ReturnType<typeof useAttribution>;
}

export function LeadSection({ t, locale, attribution }: LeadSectionProps) {
  return (
    <section id="lead" className="border-t border-mist bg-paper py-24 lg:py-32">
      <div className="section-shell grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            {t.formTitle}
          </p>
          <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.formTitle}
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.55] text-ink-700">{t.formIntro}</p>
        </div>

        <div className="lg:col-span-7">
          <LeadFormStandalone t={t} locale={locale} attribution={attribution} />
        </div>
      </div>
    </section>
  );
}
