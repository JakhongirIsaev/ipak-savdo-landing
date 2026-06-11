import { SectionHead } from "@/components/landing/ui";
import { Reveal } from "@/components/landing/Reveal";

interface PromiseItem { title: string; caption: string }
interface EarlyAccessT {
  eyebrow: string;
  headline: string;
  body: string;
  promises: readonly PromiseItem[];
}

export function EarlyAccess({ t }: { t: EarlyAccessT }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <SectionHead eyebrow={t.eyebrow} title={t.headline} intro={t.body} maxTitle="20ch" />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {t.promises.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 80}
              className="rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-shadow duration-200 ease-birliy hover:shadow-[0_20px_44px_-24px_rgba(11,24,38,0.22)]"
            >
              <span className="font-display text-3xl font-bold tracking-tightish tabular-nums text-green-700">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tightish text-ink-900">
                {p.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-700">{p.caption}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
