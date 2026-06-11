import { type LandingDict } from "@/lib/landing/i18n";
import { Reveal } from "@/components/landing/Reveal";

export function VoiceInsert({ t }: { t: LandingDict }) {
  return (
    <section className="border-t border-mist bg-ink-900 py-28 lg:py-36">
      <div className="section-shell">
        <Reveal as="div" className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.12] tracking-tightish text-white sm:text-[44px]">
            {t.voiceTitle}
          </h2>
          <p className="mx-auto mt-7 max-w-[62ch] text-[19px] font-light leading-[1.6] text-white/70 sm:text-[22px]">
            {t.voiceBody}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
