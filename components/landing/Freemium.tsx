import { Check } from "lucide-react";
import { SectionHead, PrimaryCTA } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface FreemiumBullet { title: string; caption: string }
interface FreemiumT {
  eyebrow: string;
  headline: string;
  body: string;
  priceAmount: string;
  priceUnit: string;
  priceNote: string;
  bullets: readonly FreemiumBullet[];
  cta: string;
}

export function Freemium({ id, t }: { id: string; t: FreemiumT }) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={t.eyebrow} title={t.headline} maxTitle="16ch" />

        <Reveal as="div" className="mt-14 overflow-hidden rounded-[2rem] border border-mist bg-white shadow-[0_24px_60px_-34px_rgba(11,24,38,0.28)]">
          <div className="grid lg:grid-cols-12">
            {/* price rail */}
            <div className="flex flex-col justify-center gap-3 bg-green-700 p-8 text-white lg:col-span-4 lg:p-10">
              <div className="font-display text-[52px] font-bold leading-none tracking-tightish tabular-nums">
                {t.priceAmount}
              </div>
              <div className="font-display text-xl font-semibold tracking-tightish">
                {t.priceUnit}
              </div>
              <div className="mt-1 text-sm text-green-100">{t.priceNote}</div>
            </div>

            {/* details */}
            <div className="p-8 lg:col-span-8 lg:p-10">
              <p className="max-w-[58ch] text-[17px] leading-[1.6] text-ink-700">{t.body}</p>
              <ul className="mt-7 space-y-4">
                {t.bullets.map((b) => (
                  <li key={b.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Check size={14} strokeWidth={3} className="text-green-700" />
                    </span>
                    <span className="text-[15px] text-ink-700">
                      <span className="font-display font-semibold tracking-tightish text-ink-900">
                        {b.title}.
                      </span>{" "}
                      {b.caption}
                    </span>
                  </li>
                ))}
              </ul>
              <PrimaryCTA href="#lead" className="mt-8">
                {t.cta}
              </PrimaryCTA>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
