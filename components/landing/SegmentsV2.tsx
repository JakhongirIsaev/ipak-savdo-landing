import { Store, ShoppingCart, Coffee, Pill, Wrench } from "lucide-react";
import { SectionHead } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface SegCard { title: string; body: string }
interface SegmentsV2T {
  eyebrow: string;
  headline: string;
  cards: readonly SegCard[];
}

const SEG_ICONS = [Store, ShoppingCart, Coffee, Pill, Wrench];

export function SegmentsV2({ id, t }: { id: string; t: SegmentsV2T }) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={t.eyebrow} title={t.headline} maxTitle="24ch" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((card, i) => {
            const Icon = SEG_ICONS[i] ?? Store;
            return (
              <Reveal
                as="li"
                key={card.title}
                delay={i * 70}
                className="rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-shadow duration-200 ease-birliy hover:shadow-[0_20px_44px_-24px_rgba(11,24,38,0.22)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                  <Icon size={22} strokeWidth={1.75} className="text-green-700" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tightish text-ink-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{card.body}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
