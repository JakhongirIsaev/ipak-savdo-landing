import { ArrowUpRight, Check } from "lucide-react";
import { type LandingDict } from "@/lib/landing/i18n";
import { TelegramIcon } from "@/components/landing/icons";
import { EyebrowPill } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

export function TelegramBand({ t }: { t: LandingDict["telegramChannel"] }) {
  return (
    <section id="telegram" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal as="div" className="lg:col-span-7">
          <EyebrowPill>{t.eyebrow}</EyebrowPill>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-4xl font-bold leading-[1.06] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-ink-700">{t.body}</p>

          <ul className="mt-8 space-y-3">
            {t.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-ink-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                  <Check size={14} strokeWidth={3} className="text-green-700" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <a
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-green-700 px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(3,183,61,0.55)] transition-colors duration-200 ease-birliy hover:bg-green-800"
          >
            <TelegramIcon size={18} />
            {t.cta}
          </a>
        </Reveal>

        <Reveal as="div" delay={120} className="lg:col-span-5">
          <div className="mx-auto max-w-sm rounded-3xl border border-mist bg-white p-6 shadow-[0_24px_60px_-34px_rgba(11,24,38,0.28)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-mist bg-paper">
                <img src="/birliy-symbol.svg" width={84} height={96} alt="" className="h-6 w-auto" />
              </span>
              <div className="min-w-0">
                <div className="font-display text-base font-semibold tracking-tightish text-ink-900">
                  BirLiy
                </div>
                <div className="flex items-center gap-1 text-sm text-ink-500">
                  <TelegramIcon size={13} />
                  {t.handle}
                </div>
              </div>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-paper transition-colors duration-200 ease-birliy hover:bg-ink-700"
              >
                {t.follow}
              </a>
            </div>

            <div className="mt-5 space-y-2.5 border-t border-mist pt-5">
              {t.points.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl rounded-bl-md border border-mist bg-paper px-4 py-3 text-[13px] leading-relaxed text-ink-700"
                >
                  {point}
                </div>
              ))}
            </div>

            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-1.5 border-t border-mist pt-4 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.cta}
              <ArrowUpRight size={15} strokeWidth={1.75} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
