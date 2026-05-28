"use client";

import { type LandingDict } from "@/lib/landing/i18n";
import type { Locale } from "@/components/landing/_shared";
import { LangPill } from "@/components/landing/LangPill";

interface HeaderProps {
  t: LandingDict;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
  scrollTo: (id: string) => void;
  navTargets: readonly string[];
}

export function Header({ t, locale, switchLocale, scrollTo, navTargets }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/85 backdrop-blur">
      <div className="section-shell flex h-[72px] items-center justify-between gap-6">
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            })
          }
          aria-label="BirLiy"
          className="flex min-h-11 shrink-0 items-center py-2"
        >
          <img src="/birliy-wordmark.png" width={1269} height={425} alt="BirLiy" className="h-7 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {t.nav.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() => scrollTo(navTargets[i])}
              className="flex min-h-11 items-center py-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
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
            className="hidden items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800 sm:inline-flex"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </header>
  );
}
