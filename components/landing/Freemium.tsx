interface FreemiumBullet { title: string; caption: string }
interface FreemiumT {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: readonly FreemiumBullet[];
  cta: string;
}

export function Freemium({ id, t }: { id: string; t: FreemiumT }) {
  return (
    <section id={id} className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-mist pt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[120px] font-bold leading-none tracking-tightish text-ink-900 tabular-nums">6</span>
              <span className="font-display text-xl font-semibold text-ink-700">
                месяцев<br />бесплатно
              </span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-[58ch] text-[17px] leading-[1.55] text-ink-700">{t.body}</p>
            <ul className="mt-8 divide-y divide-mist border-y border-mist">
              {t.bullets.map((b) => (
                <li key={b.title} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-display text-base font-semibold tracking-tightish text-ink-900">{b.title}</span>
                  <span className="max-w-md text-sm text-ink-700">{b.caption}</span>
                </li>
              ))}
            </ul>
            <a
              href="#lead"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
