interface PromiseItem { title: string; caption: string }
interface EarlyAccessT {
  eyebrow: string;
  headline: string;
  body: string;
  promises: readonly PromiseItem[];
}

export function EarlyAccess({ t }: { t: EarlyAccessT }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.55] text-ink-700">{t.body}</p>
        </div>
        <ol className="mt-16 grid gap-12 border-t border-mist pt-16 md:grid-cols-3 md:gap-8">
          {t.promises.map((p, i) => (
            <li key={p.title}>
              <span className="font-display text-3xl font-bold tracking-tightish text-ink-900 tabular-nums">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tightish text-ink-900">{p.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{p.caption}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
