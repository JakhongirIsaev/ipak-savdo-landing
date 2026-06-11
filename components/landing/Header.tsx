"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LandingDict } from "@/lib/landing/i18n";
import type { Locale } from "@/components/landing/_shared";
import { LangPill } from "@/components/landing/LangPill";
import { TelegramIcon } from "@/components/landing/icons";

interface HeaderProps {
  t: LandingDict;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
  scrollTo: (id: string) => void;
  navTargets: readonly string[];
}

export function Header({ t, locale, switchLocale, scrollTo, navTargets }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tg = t.telegramChannel;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    setMenuOpen(false);
  };

  const go = (id: string) => {
    scrollTo(id);
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-mist bg-paper/85 backdrop-blur transition-shadow duration-200 ease-birliy",
        scrolled && "shadow-[0_8px_24px_-16px_rgba(11,24,38,0.18)]",
      )}
    >
      <div className="section-shell flex h-[72px] items-center justify-between gap-6">
        <button
          type="button"
          onClick={toTop}
          aria-label="BirLiy"
          className="flex min-h-11 shrink-0 items-center py-2"
        >
          <img src="/birliy-wordmark.png" width={1216} height={403} alt="" className="h-7 w-auto" />
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
          <a
            href={tg.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Telegram ${tg.handle}`}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-mist text-ink-700 transition-colors duration-200 ease-birliy hover:border-ink-500 hover:text-ink-900 md:inline-flex"
          >
            <TelegramIcon size={18} />
          </a>
          <LangPill locale={locale} switchLocale={switchLocale} />
          <button
            type="button"
            onClick={() => scrollTo("lead")}
            className="hidden items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800 md:inline-flex"
          >
            {t.cta}
          </button>
          <button
            type="button"
            onClick={() => scrollTo("lead")}
            className="inline-flex min-h-11 items-center rounded-full bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800 md:hidden"
          >
            {t.ctaShort}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-mist text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500 md:hidden"
          >
            {menuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className="border-t border-mist bg-paper md:hidden">
          <div className="section-shell flex flex-col gap-1 py-4">
            {t.nav.map((item, i) => (
              <button
                key={item}
                type="button"
                onClick={() => go(navTargets[i])}
                className="flex min-h-11 items-center py-1 text-left text-base font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
              >
                {item}
              </button>
            ))}
            <a
              href={tg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2 py-1 text-base font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              <TelegramIcon size={18} />
              {tg.handle}
            </a>
            <button
              type="button"
              onClick={() => go("lead")}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800"
            >
              {t.cta}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
