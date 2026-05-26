import { Check, Tablet, Smartphone } from "lucide-react";
import { type LandingDict } from "@/lib/landing/i18n";

interface EquipmentColumnProps {
  icon: typeof Tablet;
  title: string;
  desc: string;
  items: readonly string[];
}

function EquipmentColumn({ icon: Icon, title, desc, items }: EquipmentColumnProps) {
  return (
    <div>
      <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tightish text-ink-900">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-[17px] leading-[1.55] text-ink-700">{desc}</p>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-ink-700">
            <Check size={16} strokeWidth={1.5} className="shrink-0 text-ink-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Equipment({ t }: { t: LandingDict }) {
  return (
    <section id="equipment" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            03 / {t.equipmentTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.equipmentTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-16 gap-y-14 border-t border-mist pt-16 md:grid-cols-2">
          <EquipmentColumn
            icon={Tablet}
            title={t.equipFullTitle}
            desc={t.equipFullDesc}
            items={t.equipFullItems}
          />
          <EquipmentColumn
            icon={Smartphone}
            title={t.equipLiteTitle}
            desc={t.equipLiteDesc}
            items={t.equipLiteItems}
          />
        </div>
      </div>
    </section>
  );
}
