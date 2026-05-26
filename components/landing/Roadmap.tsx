import { type LandingDict } from "@/lib/landing/i18n";

export function Roadmap({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            04 / {t.roadmapTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.roadmapTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-ink-900/10 pt-12 md:grid-cols-3 md:gap-8">
          {t.roadmap.map(([label, body], i) => (
            <div key={label} className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                {label}
              </div>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-900">{body}</p>
              {i < t.roadmap.length - 1 && (
                <div className="absolute right-0 top-2 hidden h-px w-12 -translate-y-1/2 bg-ink-900/15 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
