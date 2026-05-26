"use client";

import type { LandingDict } from "@/lib/landing/i18n";
import type { Locale } from "./_shared";
import { LangPill } from "./LangPill";

export function Footer({
  t,
  locale,
  switchLocale,
}: {
  t: LandingDict;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
}) {
  const f = t.footerV2;
  return (
    <footer className="border-t border-mist py-16 lg:py-20">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-1">
            <img src="/birliy-wordmark.svg" alt="BirLiy" className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-700">{f.tagline}</p>
          </div>
          {f.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{col.title}</h3>
              {col.links.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <a
                        href={link.href}
                        className="text-sm text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a
                  href={`tel:${f.phone.replace(/[\s-]/g, "")}`}
                  className="mt-5 inline-block font-display text-base font-semibold tracking-tightish text-ink-900 transition-colors duration-200 ease-birliy hover:text-green-700"
                >
                  {f.phone}
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-mist pt-6 text-xs sm:flex-row sm:items-center">
          <span className="text-ink-500">{f.copyright}</span>
          <LangPill locale={locale} switchLocale={switchLocale} />
        </div>
      </div>
    </footer>
  );
}
