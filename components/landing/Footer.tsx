"use client";

import { type LandingDict } from "@/lib/landing/i18n";
import type { Locale } from "@/components/landing/_shared";
import { LangPill } from "@/components/landing/LangPill";

interface FooterProps {
  t: LandingDict;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
}

export function Footer({ t, locale, switchLocale }: FooterProps) {
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
