"use client";

import { ArrowRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { type LandingDict } from "@/lib/landing/i18n";
import { settle } from "@/components/landing/_shared";
import { TelegramIcon } from "@/components/landing/icons";

export function Hero({ t }: { t: LandingDict }) {
  const reduce = useReducedMotion() ?? false;
  const tg = t.telegramChannel;

  return (
    <section className="relative overflow-hidden">
      {/* premium ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-green-100/50 blur-3xl"
      />
      <div className="section-shell relative grid items-center gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-6">
          <motion.div
            {...settle(0, reduce)}
            className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-green-800"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {t.heroV2.trustLine}
          </motion.div>

          <motion.h1
            {...settle(0.08, reduce)}
            className="mt-6 max-w-[15ch] text-balance font-display text-5xl font-bold leading-[1.02] tracking-tightish text-ink-900 sm:text-6xl lg:text-[80px]"
          >
            {t.title}
          </motion.h1>

          <motion.p
            {...settle(0.16, reduce)}
            className="mt-6 max-w-[50ch] text-[19px] leading-relaxed text-ink-700 sm:text-[21px]"
          >
            {t.subtitle}
          </motion.p>

          <motion.ul
            {...settle(0.22, reduce)}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5"
          >
            {t.heroChips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 text-[15px] font-medium text-ink-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <Check size={13} strokeWidth={3} className="text-white" />
                </span>
                {chip}
              </li>
            ))}
          </motion.ul>

          <motion.div
            {...settle(0.28, reduce)}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#lead"
              className="group/cta inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-700 px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(3,183,61,0.55)] transition-colors duration-200 ease-birliy hover:bg-green-800 sm:w-auto"
            >
              {t.cta}
              <ArrowRight
                size={18}
                strokeWidth={2}
                className="transition-transform duration-200 ease-birliy group-hover/cta:translate-x-0.5"
              />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.heroV2.secondaryCta}
            </a>
          </motion.div>

          <motion.a
            {...settle(0.34, reduce)}
            href={tg.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 hidden min-h-11 items-center gap-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900 sm:inline-flex"
          >
            <TelegramIcon size={16} />
            {tg.handle} — {tg.eyebrow}
          </motion.a>
        </div>

        <motion.div {...settle(0.3, reduce)} className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[480px]">
            {/* green depth block */}
            <div
              aria-hidden
              className="absolute -bottom-5 -right-5 hidden h-full w-full rounded-[2rem] bg-green-500 sm:block"
            />
            <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-ink-900/10 shadow-[0_34px_80px_-34px_rgba(11,24,38,0.45)]">
              <img
                src="/photos/owner-tablet.jpg"
                alt="Владелец магазина управляет продажами в BirLiy с планшета"
                width={1200}
                height={1500}
                className="block aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* floating offer badge */}
            <motion.div
              {...settle(0.5, reduce)}
              className="absolute -left-3 top-6 rounded-2xl border border-mist bg-white/95 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(11,24,38,0.3)] backdrop-blur sm:-left-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                  <Check size={18} strokeWidth={2.5} className="text-green-700" />
                </span>
                <div>
                  <div className="font-display text-base font-bold tracking-tightish text-ink-900">
                    {t.heroChips[0]}
                  </div>
                  <div className="text-xs text-ink-500">{t.freemium.bullets[1].title}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
