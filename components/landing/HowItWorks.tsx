interface Step { num: string; label: string; caption: string }
interface HowItWorksT {
  eyebrow: string;
  headline: string;
  intro: string;
  steps: readonly Step[];
}
interface HowItWorksProps { id: string; t: HowItWorksT }

const STEP_IMAGES = [
  "/product/16-kassa-empty.png",
  "/product/17-kassa-item-added.png",
  "/product/18-payment-screen.png",
  "/product/19-payment-cash.png",
  "/product/20-payment-success.png",
  "/product/06-telegram-receipt-mockup.svg",
];

export function HowItWorks({ id, t }: HowItWorksProps) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.55] text-ink-700">{t.intro}</p>
        </div>

        <ol className="mt-16 grid gap-8 border-t border-mist pt-16 md:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, i) => (
            <li key={step.num} className="step">
              <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
                <img src={STEP_IMAGES[i]} alt={step.label} className="block w-full" loading="lazy" />
              </div>
              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{step.num}</span>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tightish text-ink-900">{step.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{step.caption}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
