import { type LandingDict } from "@/lib/landing/i18n";

export function ProductMoment({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
          <img
            src="/app-screenshot.jpg"
            alt="BirLiy — рабочая поверхность"
            className="block w-full"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-500">{t.productCaption}</p>
      </div>
    </section>
  );
}
