"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { type LandingDict } from "@/lib/landing/i18n";
import { settle } from "@/components/landing/_shared";

function HeroStatCard({ t }: { t: LandingDict }) {
  return (
    <div className="rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {t.heroOnline}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          live
        </div>
      </div>

      <div className="mt-7">
        <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
          {t.heroRevenue}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-5xl font-bold tracking-tightish text-ink-900 tabular-nums">
            {t.heroRevenueVal}
          </span>
          <span className="text-base font-medium text-ink-500">{t.heroCurrency}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-mist pt-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {t.heroAvgCheck}
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tightish text-ink-900 tabular-nums">
            {t.heroAvgCheckVal}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {t.heroSales}
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tightish text-ink-900 tabular-nums">
            {t.heroSalesVal}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-mist pt-5 text-sm">
        <div className="text-ink-500">{t.heroLast}</div>
        <div className="font-medium text-ink-700 tabular-nums">{t.heroTotalVal}</div>
      </div>
    </div>
  );
}

export function Hero({ t }: { t: LandingDict }) {
  return (
    <section className="relative">
      <div className="section-shell grid items-center gap-16 py-24 lg:grid-cols-12 lg:gap-12 lg:py-32">
        <div className="lg:col-span-7">
          <motion.p
            {...settle(0)}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500"
          >
            {t.ecosystemBadge}
          </motion.p>

          <motion.h1
            {...settle(0.08)}
            className="mt-6 max-w-[15ch] text-balance font-display text-5xl font-bold leading-[1.04] tracking-tightish text-ink-900 sm:text-6xl lg:text-[80px]"
          >
            {t.title}
          </motion.h1>

          <motion.p
            {...settle(0.16)}
            className="mt-7 max-w-[58ch] text-[19px] font-light leading-relaxed text-ink-700 sm:text-[22px]"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            {...settle(0.24)}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#lead"
              className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800"
            >
              {t.cta}
              <ArrowRight size={16} strokeWidth={1.75} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.heroV2.secondaryCta}
              <ArrowRight size={14} strokeWidth={1.75} className="opacity-60" />
            </a>
          </motion.div>

          <motion.p
            {...settle(0.32)}
            className="mt-8 text-sm leading-relaxed text-ink-500"
          >
            {t.heroV2.trustLine}
          </motion.p>
        </div>

        <motion.div {...settle(0.32)} className="lg:col-span-5">
          <HeroStatCard t={t} />
        </motion.div>
      </div>
    </section>
  );
}
