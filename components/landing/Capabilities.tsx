import { CreditCard, Wallet, Package, BarChart3, TrendingUp, Send } from "lucide-react";
import type { LandingDict } from "@/lib/landing/i18n";

const ICONS = [CreditCard, Wallet, Package, BarChart3, TrendingUp, Send];

export function Capabilities({ t }: { t: LandingDict }) {
  const cap = t.capabilities;
  return (
    <section id="capabilities" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{cap.eyebrow}</p>
          <h2 className="mt-5 max-w-[22ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {cap.headline}
          </h2>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-14 border-t border-mist pt-16 md:grid-cols-2 lg:grid-cols-3">
          {cap.cards.map((card, i) => {
            const Icon = ICONS[i] ?? CreditCard;
            return (
              <li key={card.title} className="max-w-sm">
                <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tightish text-ink-900">{card.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.55] text-ink-700">{card.body}</p>
                <p className="mt-3 text-sm italic text-ink-500">{card.metric}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
