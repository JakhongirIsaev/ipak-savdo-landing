import { type LandingDict } from "@/lib/landing/i18n";

export function VoiceInsert({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-32 lg:py-40">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-tightish text-ink-900 sm:text-[40px]">
            {t.voiceTitle}
          </h2>
          <p className="mt-8 max-w-[62ch] text-[22px] font-light leading-[1.55] text-ink-700">
            {t.voiceBody}
          </p>
        </div>
      </div>
    </section>
  );
}
