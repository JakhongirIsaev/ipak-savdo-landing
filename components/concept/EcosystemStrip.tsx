import { ShieldCheck, Zap, Users } from "lucide-react";

const STR = {
  ru: {
    chips: ["Подключение за 1 день", "Данные под защитой", "Пилотные магазины подключаются"],
  },
  uz: {
    chips: ["1 kunda ulanish", "Ma'lumotlar himoyada", "Pilot do'konlar bilan"],
  },
} as const;

const CHIP_ICONS = [Zap, ShieldCheck, Users] as const;

export function EcosystemStrip({ locale }: { locale: "ru" | "uz" }): JSX.Element {
  const t = STR[locale];

  return (
    <div className="border-b border-[#d9e2db] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="flex items-center gap-2.5 text-sm font-semibold text-ink-700">
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
          <span className="font-extrabold text-ink-900">
            {locale === "ru" ? "Всё для магазина в одном приложении" : "Do'kon uchun hammasi bitta ilovada"}
          </span>
        </p>
        <ul className="flex flex-wrap items-center gap-2">
          {t.chips.map((chip, index) => {
            const Icon = CHIP_ICONS[index];
            return (
              <li
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-[#d9e2db] bg-[#fbfcfb] px-3.5 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-green-300 hover:bg-white"
              >
                <Icon size={14} strokeWidth={2} className="text-green-700" />
                {chip}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
