import { EyebrowPill } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface PainProps {
  t: { eyebrow: string; headline: string; body: string };
}

export function Pain({ t }: PainProps) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <Reveal as="div" className="max-w-3xl">
          <EyebrowPill>{t.eyebrow}</EyebrowPill>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-4xl font-bold leading-[1.06] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-[58ch] text-[19px] leading-relaxed text-ink-700">{t.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
