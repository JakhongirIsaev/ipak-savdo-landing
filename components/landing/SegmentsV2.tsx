import { Store, ShoppingCart, Coffee, Pill, Wrench } from "lucide-react";

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
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[22ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
        </div>
        <ul className="mt-16 grid gap-8 border-t border-mist pt-16 sm:grid-cols-2 lg:grid-cols-5">
          {t.cards.map((card, i) => {
            const Icon = SEG_ICONS[i] ?? Store;
            return (
              <li key={card.title} className="rounded-2xl border border-mist bg-paper p-6">
                <Icon size={22} strokeWidth={1.5} className="text-ink-900" />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tightish text-ink-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{card.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
