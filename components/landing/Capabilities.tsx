import { CreditCard, Wallet, Package, BarChart3, TrendingUp, Send } from "lucide-react";
import type { LandingDict } from "@/lib/landing/i18n";
import { SectionHead } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

const ICONS = [CreditCard, Wallet, Package, BarChart3, TrendingUp, Send];

export function Capabilities({ t }: { t: LandingDict }) {
  const cap = t.capabilities;
  return (
    <section id="capabilities" className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={cap.eyebrow} title={cap.headline} maxTitle="22ch" />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cap.cards.map((card, i) => {
            const Icon = ICONS[i] ?? CreditCard;
            return (
              <Reveal
                as="li"
                key={card.title}
                delay={i * 70}
                className="group rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-shadow duration-200 ease-birliy hover:shadow-[0_20px_44px_-24px_rgba(11,24,38,0.22)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                  <Icon size={22} strokeWidth={1.75} className="text-green-700" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tightish text-ink-900">
                  {card.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.55] text-ink-700">{card.body}</p>
                <p className="mt-4 border-t border-mist pt-3 text-sm font-medium text-green-800">
                  {card.metric}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
