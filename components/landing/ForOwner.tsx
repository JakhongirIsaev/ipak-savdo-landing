import { CheckCircle2 } from "lucide-react";
import reportsImg from "@/public/product/10-reports.png";

interface OwnerT {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: readonly string[];
}

export function ForOwner({ id, t }: { id: string; t: OwnerT }) {
  return (
    <section id={id} className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{t.eyebrow}</p>
          <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.55] text-ink-700">{t.body}</p>
          <ul className="mt-8 space-y-4">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-ink-700">
                <CheckCircle2 size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
            <img
              src={reportsImg.src}
              width={1037}
              height={597}
              alt="Отчёты BirLiy"
              className="block h-auto w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
