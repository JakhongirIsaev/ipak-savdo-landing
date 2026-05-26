"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ScanLine,
  Package,
  QrCode,
  WifiOff,
  BarChart3,
  Tablet,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LeadFormStandalone from "@/components/LeadForm";
import { useAttribution } from "@/lib/use-attribution";
import { dicts, type LandingDict } from "@/lib/landing/i18n";

type Locale = "ru" | "uz";

/* ────────────────────────────────────────────────────────────
   Motion: BirLiy curve. Settle, don't bounce.
   ──────────────────────────────────────────────────────────── */

const EASE = [0.2, 0.8, 0.2, 1] as const;
const settle = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const attribution = useAttribution();
  const t = dicts[locale];

  useEffect(() => {
    const saved = localStorage.getItem("birliy-locale") as Locale | null;
    if (saved === "ru" || saved === "uz") setLocale(saved);
  }, []);

  const switchLocale = useCallback((loc: Locale) => {
    setLocale(loc);
    localStorage.setItem("birliy-locale", loc);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navTargets = ["capabilities", "equipment", "faq"];

  return (
    <main className="min-h-screen bg-paper text-ink-900 antialiased">
      <Header t={t} locale={locale} switchLocale={switchLocale} scrollTo={scrollTo} navTargets={navTargets} />
      <Hero t={t} />
      <Capabilities t={t} />
      <VoiceInsert t={t} />
      <ProductMoment t={t} />
      <WhyBirliy t={t} />
      <Equipment t={t} />
      <Roadmap t={t} />
      <LeadSection t={t} locale={locale} attribution={attribution} />
      <FAQ t={t} />
      <Footer t={t} locale={locale} switchLocale={switchLocale} />
      <Cookie t={t} />
    </main>
  );
}

/* ────────────────────────────────────────────────────────────
   Header — sticky, minimal, ~72px
   ──────────────────────────────────────────────────────────── */

interface HeaderProps {
  t: LandingDict;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
  scrollTo: (id: string) => void;
  navTargets: readonly string[];
}

function Header({ t, locale, switchLocale, scrollTo, navTargets }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/85 backdrop-blur">
      <div className="section-shell flex h-[72px] items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="BirLiy"
          className="shrink-0"
        >
          <img src="/birliy-wordmark.svg" alt="BirLiy" className="h-7 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {t.nav.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() => scrollTo(navTargets[i])}
              className="text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangPill locale={locale} switchLocale={switchLocale} />
          <button
            type="button"
            onClick={() => scrollTo("lead")}
            className="hidden items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-700 sm:inline-flex"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </header>
  );
}

function LangPill({ locale, switchLocale }: { locale: Locale; switchLocale: (loc: Locale) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-mist bg-paper p-0.5 text-xs font-medium">
      {(["ru", "uz"] as const).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors duration-200 ease-birliy",
            locale === loc ? "bg-ink-900 text-paper" : "text-ink-500 hover:text-ink-900",
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero — 7/12 + 5/12, single orchestrated settle-in
   ──────────────────────────────────────────────────────────── */

function Hero({ t }: { t: LandingDict }) {
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
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-700"
            >
              {t.cta}
              <ArrowRight size={16} strokeWidth={1.75} />
            </a>
            <a
              href="https://t.me/birliy_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.telegram}
              <ArrowRight size={14} strokeWidth={1.75} className="opacity-60" />
            </a>
          </motion.div>

          <motion.p
            {...settle(0.32)}
            className="mt-8 text-sm leading-relaxed text-ink-500"
          >
            {t.trust}
          </motion.p>
        </div>

        <motion.div {...settle(0.32)} className="lg:col-span-5">
          <HeroStatCard t={t} />
        </motion.div>
      </div>
    </section>
  );
}

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

/* ────────────────────────────────────────────────────────────
   Capabilities — 3 columns, no card backgrounds
   ──────────────────────────────────────────────────────────── */

function Capabilities({ t }: { t: LandingDict }) {
  // pick top 3 + offline as a 4th caption-line
  const cap = [
    { icon: ScanLine, title: t.features[0][0], body: t.features[0][1] },
    { icon: Package, title: t.features[1][0], body: t.features[1][1] },
    { icon: QrCode, title: t.features[2][0], body: t.features[2][1] },
  ];

  return (
    <section id="capabilities" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            01 / {t.featuresTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.featuresTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-mist pt-16 md:grid-cols-3 md:gap-10">
          {cap.map(({ icon: Icon, title, body }) => (
            <div key={title} className="max-w-sm">
              <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tightish text-ink-900">
                {title}
              </h3>
              <p className="mt-3 text-[17px] leading-[1.55] text-ink-700">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-start gap-3 border-t border-mist pt-8 text-sm text-ink-500">
          <WifiOff size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <p className="max-w-2xl leading-relaxed">
            {t.offlineBadge}. {t.offlineText}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Voice insert — the quiet centerpiece
   ──────────────────────────────────────────────────────────── */

function VoiceInsert({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-32 lg:py-40">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-tightish text-ink-900 sm:text-[40px]">
            {t.voiceTitle}
          </h2>
          <p className="mt-8 max-w-[62ch] text-[22px] font-light leading-[1.55] text-ink-700">
            {t.voiceBody}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Product moment — one large screenshot, minimal caption
   ──────────────────────────────────────────────────────────── */

function ProductMoment({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
          <img
            src="/app-screenshot.jpg"
            alt="BirLiy — рабочая поверхность"
            className="block w-full"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-500">{t.productCaption}</p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Why BirLiy — 2x2 type-only
   ──────────────────────────────────────────────────────────── */

function WhyBirliy({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            02 / {t.benefitsTitle}
          </p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.benefitsTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-14 border-t border-mist pt-16 md:grid-cols-2">
          {t.benefits.map(([title, body]) => (
            <div key={title} className="max-w-md">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tightish text-ink-900">
                {title}
              </h3>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Equipment — 2 columns, type + check lists
   ──────────────────────────────────────────────────────────── */

function Equipment({ t }: { t: LandingDict }) {
  return (
    <section id="equipment" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            03 / {t.equipmentTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.equipmentTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-16 gap-y-14 border-t border-mist pt-16 md:grid-cols-2">
          <EquipmentColumn
            icon={Tablet}
            title={t.equipFullTitle}
            desc={t.equipFullDesc}
            items={t.equipFullItems}
          />
          <EquipmentColumn
            icon={Smartphone}
            title={t.equipLiteTitle}
            desc={t.equipLiteDesc}
            items={t.equipLiteItems}
          />
        </div>
      </div>
    </section>
  );
}

interface EquipmentColumnProps {
  icon: typeof Tablet;
  title: string;
  desc: string;
  items: readonly string[];
}

function EquipmentColumn({ icon: Icon, title, desc, items }: EquipmentColumnProps) {
  return (
    <div>
      <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tightish text-ink-900">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-[17px] leading-[1.55] text-ink-700">{desc}</p>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-ink-700">
            <Check size={16} strokeWidth={1.5} className="shrink-0 text-ink-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Roadmap — minimal 3-step horizontal sequence
   ──────────────────────────────────────────────────────────── */

function Roadmap({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            04 / {t.roadmapTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.roadmapTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-ink-900/10 pt-12 md:grid-cols-3 md:gap-8">
          {t.roadmap.map(([label, body], i) => (
            <div key={label} className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                {label}
              </div>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-900">{body}</p>
              {i < t.roadmap.length - 1 && (
                <div className="absolute right-0 top-2 hidden h-px w-12 -translate-y-1/2 bg-ink-900/15 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Lead form section
   ──────────────────────────────────────────────────────────── */

interface LeadSectionProps {
  t: LandingDict;
  locale: Locale;
  attribution: ReturnType<typeof useAttribution>;
}

function LeadSection({ t, locale, attribution }: LeadSectionProps) {
  return (
    <section id="lead" className="border-t border-mist bg-paper py-24 lg:py-32">
      <div className="section-shell grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            05 / {t.formTitle}
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

/* ────────────────────────────────────────────────────────────
   FAQ — minimal collapsible list, hairlines only
   ──────────────────────────────────────────────────────────── */

function FAQ({ t }: { t: LandingDict }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            06 / {t.faqTitle}
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

/* ────────────────────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────────────────────── */

interface FooterProps {
  t: LandingDict;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
}

function Footer({ t, locale, switchLocale }: FooterProps) {
  return (
    <footer className="border-t border-mist py-16">
      <div className="section-shell">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
          <div>
            <img src="/birliy-wordmark.svg" alt="BirLiy" className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-base leading-relaxed text-ink-700">{t.footerTagline}</p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <LangPill locale={locale} switchLocale={switchLocale} />
            <a
              href="https://t.me/birliy_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.telegram}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-mist pt-6 text-xs leading-relaxed text-ink-500">
          {t.footerSmall}
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   Cookie banner
   ──────────────────────────────────────────────────────────── */

function Cookie({ t }: { t: LandingDict }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(localStorage.getItem("birliy-cookie-ok") !== "true");
  }, []);
  if (!show) return null;

  const accept = () => {
    localStorage.setItem("birliy-cookie-ok", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-2xl border border-mist bg-white p-5 shadow-[0_8px_32px_rgba(11,24,38,0.08)] md:bottom-6 md:left-auto md:right-6 md:max-w-md">
      <p className="text-sm leading-relaxed text-ink-700">{t.cookie}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors duration-200 ease-birliy hover:bg-ink-700"
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
        >
          {t.later}
        </button>
      </div>
    </div>
  );
}
