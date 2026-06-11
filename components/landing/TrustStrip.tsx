import { Check } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

interface TrustStripProps {
  t: { bank: string; catalogSize: string; pilot: string };
}

export function TrustStrip({ t }: TrustStripProps) {
  const items = [t.catalogSize, t.pilot, t.bank];
  return (
    <section className="border-y border-mist bg-white py-6">
      <Reveal as="div" className="section-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50">
              <Check size={14} strokeWidth={3} className="text-green-700" />
            </span>
            {item}
          </div>
        ))}
      </Reveal>
    </section>
  );
}
