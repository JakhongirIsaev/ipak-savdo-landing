import { CheckCircle2 } from "lucide-react";
import { EyebrowPill, PhotoFrame } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface OwnerT {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: readonly string[];
}

export function ForOwner({ id, t }: { id: string; t: OwnerT }) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal as="div">
          <EyebrowPill>{t.eyebrow}</EyebrowPill>
          <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl font-bold leading-[1.06] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.6] text-ink-700">{t.body}</p>
          <ul className="mt-8 space-y-4">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-ink-700">
                <CheckCircle2 size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-green-700" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" delay={120}>
          <PhotoFrame
            src="/photos/owners-team.jpg"
            alt="Владельцы смотрят отчёты BirLiy с планшета"
            imgClassName="aspect-[4/3]"
            blockSide="br"
          />
        </Reveal>
      </div>
    </section>
  );
}
