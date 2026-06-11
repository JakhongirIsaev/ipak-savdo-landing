"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.2, 0.8, 0.2, 1] as const;

// PLACEHOLDER testimonials: replace with REAL pilot quotes before production.
// Until then the section is framed as illustrative (see `note` + present-tense
// title), so nothing fabricated is presented as a real customer claim. Do NOT
// remove the note or switch to a past-tense "they chose us" claim until real,
// attributable quotes are in place.
const DATA = {
  ru: {
    eyebrow: "Истории",
    title: "Как это выглядит у владельцев",
    note: "Иллюстративные примеры. Реальные отзывы пилотных магазинов появятся здесь.",
    cards: [
      { initials: "Д", name: "Дилшод", where: "минимаркет, Чиланзар", quote: "Вечером больше не пересчитываю кассу вручную. Итоги дня уже в телефоне." },
      { initials: "Г", name: "Гулнора", where: "кафе, Себзор", quote: "Кассир освоил за полчаса. QR-чек уходит покупателю сам, очередь идёт быстрее." },
      { initials: "Ш", name: "Шерзод", where: "аптека, Юнусабад", quote: "Вижу остатки и выручку, даже когда не на точке. Звонить кассиру больше не нужно." },
    ],
  },
  uz: {
    eyebrow: "Hikoyalar",
    title: "Egalar buni qanday ko'radi",
    note: "Namunaviy misollar. Pilot do'konlarning haqiqiy fikrlari shu yerda bo'ladi.",
    cards: [
      { initials: "D", name: "Dilshod", where: "minimarket, Chilonzor", quote: "Endi kechqurun kassani qo'lda sanamayman. Kun yakuni telefonimda." },
      { initials: "G", name: "Gulnora", where: "kafe, Sebzor", quote: "Kassir yarim soatda o'rgandi. QR-chek xaridorga o'zi ketadi, navbat tezroq." },
      { initials: "Sh", name: "Sherzod", where: "dorixona, Yunusobod", quote: "Nuqtada bo'lmasam ham qoldiq va tushumni ko'raman. Kassirga qo'ng'iroq shart emas." },
    ],
  },
} as const;

// Stable initials-avatar tints from existing tokens, no fabricated photos.
const AVATAR_TINTS = ["bg-green-50 text-green-700", "bg-[#eef2ee] text-ink-700", "bg-green-100 text-green-800"] as const;

export function Testimonials({ locale }: { locale: "ru" | "uz" }): JSX.Element {
  const t = DATA[locale];
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="testimonials" className="border-t border-[#d9e2db] bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t.eyebrow}
          </p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-4xl lg:text-5xl">{t.title}</h2>
          <p className="mt-3 text-sm font-medium text-ink-500">{t.note}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.cards.map((card, index) => (
            <motion.figure
              key={card.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: EASE, delay: index * 0.06 }}
              className="flex h-full flex-col rounded-lg border border-[#d9e2db] bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
            >
              <blockquote className="flex-1 text-[15px] font-medium leading-7 text-ink-700">“{card.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-[#eef2ee] pt-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold ${AVATAR_TINTS[index % AVATAR_TINTS.length]}`}>
                  {card.initials}
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-ink-900">{card.name}</span>
                  <span className="block text-xs font-medium text-ink-500">{card.where}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
