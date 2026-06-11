import { type LandingDict } from "@/lib/landing/i18n";
import { SectionHead, PrimaryCTA, PhotoFrame } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface HowItWorksProps {
  id: string;
  t: LandingDict["howItWorks"];
  ctaLabel: string;
}

export function HowItWorks({ id, t, ctaLabel }: HowItWorksProps) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={t.eyebrow} title={t.headline} intro={t.intro} maxTitle="20ch" />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal as="div">
            <PhotoFrame
              src="/photos/pay-counter.jpg"
              alt="Оплата по телефону на кассе BirLiy"
              imgClassName="aspect-[4/3]"
              blockSide="bl"
            />
          </Reveal>

          <ol className="space-y-6">
            {t.steps.map((step, i) => (
              <Reveal as="li" key={step.num} delay={i * 80} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 font-display text-sm font-bold tabular-nums text-green-800">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tightish text-ink-900">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-700">{step.caption}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <PrimaryCTA href="#lead" className="mt-14">
          {ctaLabel}
        </PrimaryCTA>
      </div>
    </section>
  );
}
