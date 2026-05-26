import { type LandingDict } from "@/lib/landing/i18n";

export function WhyBirliy({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            {t.benefitsTitle}
          </p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.benefitsTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-14 border-t border-mist pt-16 md:grid-cols-2">
          {t.benefits.map(([title, body]) => (
            <div key={title} className="max-w-md">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tightish text-ink-900">
                {title}
              </h3>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
