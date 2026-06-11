import { Check, Store, Smartphone } from "lucide-react";
import { type LandingDict } from "@/lib/landing/i18n";
import { SectionHead } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface EquipmentColumnProps {
  icon: typeof Store;
  title: string;
  desc: string;
  items: readonly string[];
  delay?: number;
}

function EquipmentColumn({ icon: Icon, title, desc, items, delay = 0 }: EquipmentColumnProps) {
  return (
    <Reveal
      as="div"
      delay={delay}
      className="rounded-3xl border border-mist bg-white p-8 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-shadow duration-200 ease-birliy hover:shadow-[0_20px_44px_-24px_rgba(11,24,38,0.22)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
        <Icon size={22} strokeWidth={1.75} className="text-green-700" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tightish text-ink-900">{title}</h3>
      <p className="mt-3 max-w-md text-[16px] leading-[1.55] text-ink-700">{desc}</p>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-ink-700">
            <Check size={16} strokeWidth={2.5} className="shrink-0 text-green-700" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function Equipment({ t }: { t: LandingDict }) {
  return (
    <section id="equipment" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={`06 / ${t.equipmentTitle}`} title={t.equipmentTitle} maxTitle="20ch" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <EquipmentColumn
            icon={Store}
            title={t.equipFullTitle}
            desc={t.equipFullDesc}
            items={t.equipFullItems}
          />
          <EquipmentColumn
            icon={Smartphone}
            title={t.equipLiteTitle}
            desc={t.equipLiteDesc}
            items={t.equipLiteItems}
            delay={90}
          />
        </div>
      </div>
    </section>
  );
}
