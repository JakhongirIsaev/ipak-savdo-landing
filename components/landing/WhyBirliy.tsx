import { Check } from "lucide-react";
import { type LandingDict } from "@/lib/landing/i18n";
import { Reveal } from "@/components/landing/Reveal";

export function WhyBirliy({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <Reveal as="h2" className="max-w-[18ch] text-balance font-display text-4xl font-bold leading-[1.06] tracking-tightish text-ink-900 sm:text-5xl">
          {t.benefitsTitle}
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {t.benefits.map(([title, body], i) => (
            <Reveal
              as="div"
              key={title}
              delay={i * 70}
              className="rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-shadow duration-200 ease-birliy hover:shadow-[0_20px_44px_-24px_rgba(11,24,38,0.22)]"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-50">
                  <Check size={18} strokeWidth={2.5} className="text-green-700" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold leading-tight tracking-tightish text-ink-900">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.55] text-ink-700">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
