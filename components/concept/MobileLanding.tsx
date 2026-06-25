"use client";

/**
 * MobileLanding — a dedicated, BILLZ-style native mobile experience for BirLiy.
 *
 * This is NOT a shrunk desktop layout. It is a separate component rendered only
 * below the `lg` breakpoint (ConceptLanding wraps it in `lg:hidden` and wraps the
 * existing desktop tree in `hidden lg:block`). The structure mirrors BILLZ's
 * mobile landing: a slim sticky top bar, a centered big headline with one green
 * accent word, a short subtitle, an honest trust line, a 2-column grid of feature
 * cards with rounded colored icon badges, a "how it works" mini step list, an
 * early-access price card, an FAQ accordion, a lead section and a single
 * full-width sticky green pill CTA fixed at the bottom.
 *
 * All copy comes from the existing `copy[locale]` object passed down as `t`, so
 * RU/UZ parity and product claims stay identical to the desktop layout. No new
 * product claims, numbers, testimonials, competitor logos or bank names.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "./CountUp";
import { trackSiteEvent } from "@/lib/track/client";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ChevronDown,
  Clock3,
  Languages,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  Smartphone,
  Store,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

type Locale = "ru" | "uz";

// `t` is `copy[locale]` from ConceptLanding. Keep it loose-but-safe: this
// component only reads strings already proven to exist in both locales.
type Copy = {
  meta: {
    otherLang: string;
    primaryCta: string;
    mobileTitleLead: string;
    mobileTitleAccent: string;
    mobileSubtitle: string;
    telegram: string;
    trustStrip: readonly string[];
  };
  heroNumbers: readonly { value: string; suffix: string }[];
  modules: { eyebrow: string; title: string; items: readonly { title: string; payoff: string }[] };
  flow: { eyebrow: string; title: string; steps: readonly { title: string; text: string }[] };
  price: {
    eyebrow: string;
    amount: string;
    suffix: string;
    laterAmount: string;
    laterSuffix: string;
    scarcity: string;
    bullets: readonly string[];
    cta: string;
  };
  faq: { eyebrow: string; title: string; items: readonly (readonly [string, string])[] };
  mobileNav: { menuTitle: string; telegram: string; call: string; landmark: string; flow: string; product: string; price: string; apply: string };
  nav: readonly { label: string; href: string }[];
  footer: { telegramHref: string; phone: string; tagline: string; copyright: string };
};

// BILLZ-style colored icon badges. Green leads; a few restrained accent tints
// keep the grid lively without leaving the brand. Tints are soft bg + saturated
// icon, all chosen to read on white (the green stays primary, first + dominant).
const MODULE_BADGES: { icon: LucideIcon; badge: string; icon_color: string }[] = [
  { icon: Store, badge: "bg-green-50", icon_color: "text-green-700" },
  { icon: Boxes, badge: "bg-[#EAF1FF]", icon_color: "text-info" },
  { icon: Wallet, badge: "bg-green-50", icon_color: "text-green-700" },
  { icon: BarChart3, badge: "bg-[#FFF4E0]", icon_color: "text-[#B5751A]" },
  { icon: ShieldCheck, badge: "bg-[#F0ECFF]", icon_color: "text-[#6A4BD6]" },
  { icon: Smartphone, badge: "bg-green-50", icon_color: "text-green-700" },
];

export function MobileLanding({
  locale,
  t,
  openLead,
  leadSection,
}: {
  locale: Locale;
  t: Copy;
  openLead: (placement: string) => void;
  leadSection: React.ReactNode;
}) {
  const prefersReduce = useReducedMotion() ?? false;
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number>(0);
  const faqBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const otherHref = locale === "ru" ? "/" : "/ru";
  const otherLocale: Locale = locale === "ru" ? "uz" : "ru";
  const switchLangLabel =
    locale === "ru" ? "Tilni ruschaga almashtirish (RU)" : "Сменить язык на узбекский (UZ)";
  const telHref = `tel:${t.footer.phone.replace(/[^+\d]/g, "")}`;

  const toggleFaq = (index: number) => {
    const willOpen = faqOpen !== index;
    setFaqOpen(willOpen ? index : -1);
    if (willOpen) trackSiteEvent("faq_open", { question_id: index });
  };
  const onFaqKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number, total: number) => {
    let next = -1;
    if (e.key === "ArrowDown") next = (index + 1) % total;
    else if (e.key === "ArrowUp") next = (index - 1 + total) % total;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total - 1;
    if (next >= 0) {
      e.preventDefault();
      faqBtnRefs.current[next]?.focus();
    }
  };

  // Menu items reuse the desktop nav labels (real copy, both locales).
  const menuItems = [
    { href: "#m-flow", label: t.nav[0].label },
    { href: "#m-modules", label: t.nav[2].label },
    { href: "#m-price", label: t.nav[4].label },
    { href: "#m-faq", label: t.faq.eyebrow },
  ];

  const fade = (delay = 0) =>
    prefersReduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const, delay },
        };

  return (
    <div className="bg-white text-ink-900">
      {/* 1 — Slim sticky top bar: wordmark + lang switch + menu */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-mist bg-white/95 px-4 py-3 backdrop-blur">
        <a href="#m-top" className="inline-flex min-h-11 items-center" aria-label="BirLiy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/birliy-wordmark.png" alt="BirLiy" width={1072} height={360} className="h-8 w-auto" />
        </a>
        <div className="flex items-center gap-2">
          <a
            href={otherHref}
            onClick={() => trackSiteEvent("language_switch", { from_lang: locale, to_lang: otherLocale })}
            aria-label={switchLangLabel}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-mist bg-paper px-3 text-sm font-extrabold text-ink-900 transition-colors duration-200 ease-birliy hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <Languages size={16} aria-hidden />
            {t.meta.otherLang}
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="m-menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-mist bg-paper text-ink-900 transition-colors duration-200 ease-birliy hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav
          id="m-menu"
          aria-label={t.mobileNav.menuTitle}
          className="sticky top-[60px] z-30 border-b border-mist bg-white/98 px-4 py-4 shadow-[0_24px_55px_-38px_rgba(11,24,38,0.6)] backdrop-blur"
        >
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center rounded-2xl border border-mist bg-paper px-4 text-sm font-extrabold text-ink-900 transition-colors duration-200 ease-birliy hover:border-green-500/40 hover:bg-white"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <a
              href={t.footer.telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { setMenuOpen(false); trackSiteEvent("telegram_click", { cta_location: "mobile_menu" }); }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-mist bg-white px-3 text-sm font-extrabold text-ink-900"
            >
              <Send size={17} aria-hidden />
              {t.mobileNav.telegram}
            </a>
            <a
              href={telHref}
              onClick={() => { setMenuOpen(false); trackSiteEvent("phone_click", { cta_location: "mobile_menu" }); }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-mist bg-white px-3 text-sm font-extrabold text-ink-900"
            >
              <Phone size={17} aria-hidden />
              {t.mobileNav.call}
            </a>
          </div>
        </nav>
      )}

      {/* 2 — Hero: centered big Sora headline, one green word, subtitle, CTA, proof chips */}
      <section id="m-top" className="px-5 pb-8 pt-10 text-center">
        <motion.h1
          {...fade(0)}
          className="mx-auto max-w-[15ch] font-display text-[32px] font-extrabold leading-[1.1] tracking-tightish text-ink-900 min-[390px]:text-[34px]"
        >
          {t.meta.mobileTitleLead}{" "}
          <span className="text-green-500">{t.meta.mobileTitleAccent}</span>
        </motion.h1>
        <motion.p
          {...fade(0.08)}
          className="mx-auto mt-4 max-w-[34ch] text-base font-medium leading-7 text-ink-700"
        >
          {t.meta.mobileSubtitle}
        </motion.p>

        <motion.div {...fade(0.14)} className="mt-6">
          <button
            type="button"
            onClick={() => openLead("mobile_hero")}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 text-base font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.9)] transition duration-200 ease-birliy hover:bg-green-700 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          >
            {t.meta.primaryCta}
            <ArrowRight size={18} aria-hidden />
          </button>
        </motion.div>

        {/* 4 honest proof chips */}
        <motion.div {...fade(0.2)} className="mt-6 grid grid-cols-2 gap-3">
          {t.heroNumbers.map((stat) => (
            <div
              key={stat.suffix}
              className="rounded-2xl border border-mist bg-paper px-3 py-4 text-center"
            >
              <CountUp value={stat.value} className="block font-display text-[22px] font-extrabold leading-none text-ink-900" />
              <span className="mt-1.5 block text-[13px] font-bold leading-tight text-ink-500">{stat.suffix}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 3 — Honest trust line */}
      <section className="px-5 pb-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-mist bg-paper px-4 py-3">
          {t.meta.trustStrip.map((item, i) => {
            const TrustIcon = [ShieldCheck, Clock3, Smartphone][i] ?? ShieldCheck;
            return (
              <li key={item} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-700">
                <TrustIcon size={15} strokeWidth={2.25} className="text-green-500" aria-hidden />
                {item}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 4 — Feature card grid (2-col, BILLZ-style colored icon badges) */}
      <section id="m-modules" className="scroll-mt-20 px-5 pb-10">
        <p className="mb-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-normal text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
          {t.modules.eyebrow.replace(/^\d+\s*\/\s*/, "")}
        </p>
        <h2 className="mx-auto mb-6 max-w-[18ch] text-center font-display text-2xl font-extrabold leading-tight tracking-tightish text-ink-900">
          {t.modules.title}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {t.modules.items.map((item, i) => {
            const badge = MODULE_BADGES[i] ?? MODULE_BADGES[0];
            const Icon = badge.icon;
            return (
              <motion.div
                key={item.title}
                {...fade(0.04 * i)}
                className="flex flex-col rounded-2xl border border-mist bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
              >
                <span className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl ${badge.badge}`}>
                  <Icon size={22} strokeWidth={2.1} className={badge.icon_color} aria-hidden />
                </span>
                <h3 className="text-[15px] font-extrabold leading-snug text-ink-900">{item.title}</h3>
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-green-700">{item.payoff}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5 — "How it works" mini steps */}
      <section id="m-flow" className="scroll-mt-20 bg-paper px-5 py-10">
        <p className="mb-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-normal text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
          {t.flow.eyebrow.replace(/^\d+\s*\/\s*/, "")}
        </p>
        <h2 className="mx-auto mb-6 max-w-[20ch] text-center font-display text-2xl font-extrabold leading-tight tracking-tightish text-ink-900">
          {t.flow.title}
        </h2>
        <ol className="mx-auto grid max-w-md gap-3">
          {t.flow.steps.map((step, i) => (
            <motion.li
              key={step.title}
              {...fade(0.04 * i)}
              className="flex items-start gap-4 rounded-2xl border border-mist bg-white p-4"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-500 font-display text-base font-extrabold text-white" aria-hidden>
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[15px] font-extrabold leading-snug text-ink-900">{step.title}</h3>
                <p className="mt-1 text-[14px] font-medium leading-snug text-ink-700">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* 6 — Price card (early-access scarcity) */}
      <section id="m-price" className="scroll-mt-20 px-5 py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-green-500/30 bg-white p-6 shadow-[0_24px_60px_-44px_rgba(2,127,46,0.7)]">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
            {t.price.eyebrow}
          </p>
          <div className="mt-4 flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold leading-none tracking-tightish text-ink-900">
              {t.price.amount}
            </span>
            <span className="pb-1 text-sm font-bold text-ink-500">{t.price.suffix}</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-ink-500">
            <span className="text-ink-700 line-through">{t.price.laterAmount}</span>{" "}
            {t.price.laterSuffix}
          </p>
          <p className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-[13px] font-bold text-green-800">
            {t.price.scarcity}
          </p>
          <ul className="mt-5 grid gap-2.5">
            {t.price.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[14px] font-semibold leading-snug text-ink-700">
                <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-green-500" aria-hidden>
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.4}>
                    <path d="M2 6.5 4.6 9 10 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openLead("mobile_price")}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 text-base font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.9)] transition duration-200 ease-birliy hover:bg-green-700 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
          >
            {t.price.cta}
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      </section>

      {/* 7 — FAQ accordion */}
      <section id="m-faq" className="scroll-mt-20 bg-paper px-5 py-10">
        <p className="mb-1 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-normal text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
          {t.faq.eyebrow}
        </p>
        <h2 className="mx-auto mb-6 max-w-[20ch] text-center font-display text-2xl font-extrabold leading-tight tracking-tightish text-ink-900">
          {t.faq.title}
        </h2>
        <div className="mx-auto grid max-w-md gap-2.5">
          {t.faq.items.map(([q, a], i) => {
            const open = faqOpen === i;
            return (
              <div key={q} className="overflow-hidden rounded-2xl border border-mist bg-white">
                <h3>
                  <button
                    ref={(el) => { faqBtnRefs.current[i] = el; }}
                    type="button"
                    onClick={() => toggleFaq(i)}
                    onKeyDown={(e) => onFaqKeyDown(e, i, t.faq.items.length)}
                    aria-expanded={open}
                    aria-controls={`m-faq-panel-${i}`}
                    id={`m-faq-q-${i}`}
                    className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-extrabold leading-snug text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-700"
                  >
                    {q}
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-green-700 transition-transform duration-200 ease-birliy motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                {open && (
                  <div
                    id={`m-faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`m-faq-q-${i}`}
                    className="px-4 pb-4 text-[14px] font-medium leading-relaxed text-ink-700"
                  >
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 — Lead CTA section (reuses the shared LeadSection passed down) */}
      <section id="m-lead" className="px-5 py-10">{leadSection}</section>

      {/* Slim footer line (honest, no invented claims) */}
      <footer className="border-t border-mist bg-paper px-5 py-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/birliy-wordmark.png" alt="BirLiy" width={1072} height={360} className="mx-auto h-8 w-auto" />
        <p className="mx-auto mt-3 max-w-[26ch] text-sm font-bold text-ink-500">{t.footer.tagline}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <a
            href={t.footer.telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSiteEvent("telegram_click", { cta_location: "mobile_footer" })}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink-700 hover:text-green-700"
          >
            <Send size={16} className="text-green-700" aria-hidden />
            {t.mobileNav.telegram}
          </a>
          <a
            href={telHref}
            onClick={() => trackSiteEvent("phone_click", { cta_location: "mobile_footer" })}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink-700 hover:text-green-700"
          >
            <Phone size={16} className="text-green-700" aria-hidden />
            {t.footer.phone}
          </a>
        </div>
        <p className="mt-4 text-xs font-semibold text-ink-500">{t.footer.copyright}</p>
      </footer>

      {/* Single sticky full-width green pill CTA. Bottom padding on the page tail
          (pb in lead/footer) plus this fixed bar; spacer below keeps content from
          hiding behind it. */}
      <div aria-hidden className="h-[84px]" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/92 px-4 pt-2.5 pb-[calc(0.7rem+env(safe-area-inset-bottom))] backdrop-blur shadow-[0_-18px_50px_-34px_rgba(11,24,38,0.6)]">
        <button
          type="button"
          onClick={() => openLead("mobile_sticky")}
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 text-base font-extrabold text-white shadow-[0_14px_34px_-18px_rgba(3,183,61,0.95)] transition duration-200 ease-birliy hover:bg-green-700 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
        >
          {t.meta.primaryCta}
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
