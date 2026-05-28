import { ArrowRight } from "lucide-react";

interface Step { num: string; label: string; caption: string }
interface HowItWorksT {
  eyebrow: string;
  headline: string;
  intro: string;
  steps: readonly Step[];
}
interface HowItWorksProps { id: string; t: HowItWorksT; ctaLabel: string }

interface StepImage { src: string; w: number; h: number }
const STEP_IMAGES: readonly StepImage[] = [
  { src: "/product/16-kassa-empty.png", w: 1037, h: 597 },
  { src: "/product/17-kassa-item-added.png", w: 1037, h: 597 },
  { src: "/product/18-payment-screen.png", w: 1037, h: 597 },
  { src: "/product/19-payment-cash.png", w: 1037, h: 597 },
  { src: "/product/20-payment-success.png", w: 1037, h: 597 },
  { src: "/product/06-telegram-receipt-mockup.svg", w: 360, h: 540 },
];

export function HowItWorks({ id, t, ctaLabel }: HowItWorksProps) {
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
                <img
                  src={STEP_IMAGES[i].src}
                  width={STEP_IMAGES[i].w}
                  height={STEP_IMAGES[i].h}
                  alt={step.label}
                  className="block h-auto w-full"
                  loading="lazy"
                />
              </div>
              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{step.num}</span>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tightish text-ink-900">{step.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{step.caption}</p>
              </div>
            </li>
          ))}
        </ol>

        <a
          href="#lead"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800"
        >
          {ctaLabel}
          <ArrowRight size={16} strokeWidth={1.75} />
        </a>
      </div>
    </section>
  );
}
