"use client";

import { cn } from "@/lib/utils";
import type { Locale } from "@/components/landing/_shared";

interface LangPillProps {
  locale: Locale;
  switchLocale: (loc: Locale) => void;
}

export function LangPill({ locale, switchLocale }: LangPillProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-mist bg-paper p-0.5 text-xs font-medium">
      {(["ru", "uz"] as const).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-full px-3.5 py-2 transition-colors duration-200 ease-birliy",
            locale === loc ? "bg-ink-900 text-paper" : "text-ink-500 hover:text-ink-900",
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
