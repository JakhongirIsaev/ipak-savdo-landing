import { ScanLine, Package, QrCode, WifiOff } from "lucide-react";
import { type LandingDict } from "@/lib/landing/i18n";

export function Capabilities({ t }: { t: LandingDict }) {
  // pick top 3 + offline as a 4th caption-line
  const cap = [
    { icon: ScanLine, title: t.features[0][0], body: t.features[0][1] },
    { icon: Package, title: t.features[1][0], body: t.features[1][1] },
    { icon: QrCode, title: t.features[2][0], body: t.features[2][1] },
  ];

  return (
    <section id="capabilities" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            01 / {t.featuresTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.featuresTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-mist pt-16 md:grid-cols-3 md:gap-10">
          {cap.map(({ icon: Icon, title, body }) => (
            <div key={title} className="max-w-sm">
              <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tightish text-ink-900">
                {title}
              </h3>
              <p className="mt-3 text-[17px] leading-[1.55] text-ink-700">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-start gap-3 border-t border-mist pt-8 text-sm text-ink-500">
          <WifiOff size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <p className="max-w-2xl leading-relaxed">
            {t.offlineBadge}. {t.offlineText}
          </p>
        </div>
      </div>
    </section>
  );
}
