"use client";

import LeadFormStandalone from "@/components/LeadForm";
import { type LandingDict } from "@/lib/landing/i18n";
import { useAttribution } from "@/lib/use-attribution";
import type { Locale } from "@/components/landing/_shared";
import { EyebrowPill } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface LeadSectionProps {
  t: LandingDict;
  locale: Locale;
  attribution: ReturnType<typeof useAttribution>;
}

export function LeadSection({ t, locale, attribution }: LeadSectionProps) {
  return (
    <section id="lead" className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell grid gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal as="div" className="lg:col-span-5">
          <EyebrowPill>{t.heroChips[0]}</EyebrowPill>
          <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl font-bold leading-[1.06] tracking-tightish text-ink-900 sm:text-5xl">
            {t.formTitle}
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.6] text-ink-700">{t.formIntro}</p>
        </Reveal>

        <Reveal as="div" delay={120} className="lg:col-span-7">
          <LeadFormStandalone t={t} locale={locale} attribution={attribution} />
        </Reveal>
      </div>
    </section>
  );
}
