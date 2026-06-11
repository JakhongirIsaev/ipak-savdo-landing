"use client";

import type { LandingDict } from "@/lib/landing/i18n";
import type { Locale } from "./_shared";
import { LangPill } from "./LangPill";
import { TelegramIcon } from "./icons";
import { Reveal } from "@/components/landing/Reveal";

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
        <Reveal as="div" className="grid gap-12 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-1">
            <img src="/birliy-wordmark.png" width={1216} height={403} alt="BirLiy" className="h-8 w-auto" />
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
                        className="inline-block py-1.5 text-sm text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 space-y-3">
                  <a
                    href={t.telegramChannel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
                  >
                    <TelegramIcon size={16} />
                    {t.telegramChannel.handle}
                  </a>
                  <a
                    href={`tel:${f.phone.replace(/[\s-]/g, "")}`}
                    className="block font-display text-base font-semibold tracking-tightish text-ink-900 transition-colors duration-200 ease-birliy hover:text-green-700"
                  >
                    {f.phone}
                  </a>
                  <a
                    href={t.support.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
                  >
                    <TelegramIcon size={16} />
                    {t.support.label}
                  </a>
                </div>
              )}
            </div>
          ))}
        </Reveal>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-mist pt-6 text-xs sm:flex-row sm:items-center">
          <span className="text-ink-500">{f.copyright}</span>
          <LangPill locale={locale} switchLocale={switchLocale} />
        </div>
      </div>
    </footer>
  );
}
