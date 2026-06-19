import type { BlogPost } from "../types";

const SRC_ESPN = "https://www.espn.com/soccer/report/_/gameId/760435";
const SRC_FIFA =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/portugal-congo-dr-highlights-match-report";

export const post: BlogPost = {
  slug: "futbol-saboq-portugaliya-kongo",
  category: "football",
  date: "2026-06-19",
  modified: "2026-06-19",
  image: {
    square: "https://birliy.uz/photos/blog/futbol-saboq-portugaliya-kongo-1x1.jpg",
    landscape: "https://birliy.uz/photos/blog/futbol-saboq-portugaliya-kongo-4x3.jpg",
    wide: "https://birliy.uz/photos/blog/futbol-saboq-portugaliya-kongo-16x9.jpg",
  },
  locales: {
    uz: {
      title: "Portugaliya 1:1 Kongo: katta nom yetmaydi, kunlik nazorat yutadi",
      description:
        "Portugaliya, Kongo o'yini do'kon egasi uchun saboq: mashhur nom va gavjum joy ham kunlik intizomsiz pul yo'qotadi. Qoldiq, tushum va qarzni har kuni nazorat qiling.",
      keywords: [
        "Portugaliya Kongo",
        "futbol biznes saboq",
        "do'kon nazorati",
        "kunlik hisob",
        "qoldiq nazorati",
        "qarz nazorati",
        "BirLiy POS",
        "do'kon egasi uchun",
      ],
      intro: [
        "2026-yil 17-iyun kuni Portugaliya va Kongo Demokratik Respublikasi 1:1 hisobida durang o'ynadi. Joao Neves 6-daqiqada boshi bilan Portugaliyani oldinga chiqardi, Yoane Vissa esa birinchi taym qo'shimcha vaqtida (45+5) hisobni tenglashtirib, Kongo uchun jahon chempionatlari tarixidagi birinchi golni kiritdi.",
        "Portugaliya ko'p hujum qildi, to'pni ko'proq nazorat qildi, Ronaldu esa 68 va 73-daqiqalarda ikkita aniq imkoniyatni boy berdi. Mashhur nom va kuchli tarkib bo'lsa ham, g'alaba kelmadi.",
        "Bu sport tahlili yoki bashorat emas, balki do'kon egasi uchun amaliy saboq. Nom va shuhrat o'zi pul keltirmaydi, har kunlik nazorat keltiradi.",
      ],
      sections: [
        {
          h2: "Mashhur nom natijani kafolatlamaydi",
          paragraphs: [
            "Portugaliya kuchli jamoa, lekin maydonda ism emas, aniq harakatlar yutadi. Do'konda ham xuddi shunday: gavjum ko'cha yoki tanilgan nuqta bo'lishingiz mumkin, ammo bu o'z-o'zidan foyda demang emas.",
            "Ko'p egalar joy yaxshi, mijoz ko'p, demak hammasi joyida deb o'ylaydi. Aslida pul sotuv va xarajat orasidagi har kunlik nazoratda yo'qoladi yoki saqlanadi.",
          ],
        },
        {
          h2: "Boy berilgan imkoniyat - bu yo'qotilgan pul",
          paragraphs: [
            "Ronaldu ikki marta aniq holatdan foydalana olmadi. Do'konda boy berilgan imkoniyat boshqacha ko'rinadi: hisoblanmagan tovar, yozilmagan qarz, tekshirilmagan smena.",
            "Har bir e'tibordan chetda qolgan mayda narsa, maydonda boy berilgan zarba kabi, oxirida natijani o'zgartiradi. Shuning uchun har kuni qoldiq, tushum va qarzni ko'rib chiqish kerak.",
          ],
          list: [
            "Bugungi tushum qancha bo'ldi.",
            "Qaysi tovar kam qoldi yoki tugadi.",
            "Kim qarzga oldi va qancha qaytarishi kerak.",
            "Kassir smenasida nima qaytarildi yoki o'chirildi.",
          ],
        },
        {
          h2: "Intizom - bu har kungi takror",
          paragraphs: [
            "Bitta yaxshi o'yin yetarli emas, jamoa har o'yinda intizomni saqlashi kerak. Do'kon ham bitta yaxshi kun emas, har kungi takror bilan o'sadi.",
            "Egasi har kuni bir necha daqiqada bugungi sonlarni ko'rsa, muammoni kech emas, o'sha kuni ko'radi. Aynan shu odat katta nomdan ham ko'proq pul saqlaydi.",
          ],
        },
        {
          h2: "BirLiy egaga kunlik nazoratni beradi",
          paragraphs: [
            "BirLiy telefonda ishlaydi va egasiga kassada turmasdan tushum, qoldiq va qarzni ko'rsatadi. Kassir savdoni kiritadi, egasi esa har kuni aniq sonlarni o'z telefonidan ko'radi.",
            "Shu tarzda do'kon faqat joy yoki nomga emas, har kungi intizomga tayanadi. Bu mashhurlikdan barqarorroq tayanchdir.",
          ],
        },
      ],
      faq: [
        {
          q: "Bu maqola sport bashoratimi?",
          a: "Yo'q. Bu o'yin natijasidan olingan amaliy biznes saboq, bashorat yoki stavka emas. Maqsad do'kon egasiga kunlik nazorat muhimligini ko'rsatish.",
        },
        {
          q: "Nega mashhur joy ham pul yo'qotadi?",
          a: "Chunki foyda joy yoki nomda emas, sotuv, xarajat va qarzni har kungi nazoratida saqlanadi. Nazorat bo'lmasa, gavjum nuqta ham pulni sezdirmay yo'qotadi.",
        },
        {
          q: "Kunlik nazorat amalda nimani anglatadi?",
          a: "Har kuni tushum, qoldiq va qarzni ko'rib chiqishni. BirLiyda bu egaga telefon orqali bir necha daqiqada ko'rinadi.",
        },
        {
          q: "BirLiy buni qanday osonlashtiradi?",
          a: "Kassir savdoni kiritadi, BirLiy esa egaga kunlik tushum, qoldiq va qarz hisobotini telefonda beradi, shuning uchun nazorat odatga aylanadi.",
        },
      ],
      sources: [
        { label: "ESPN: o'yin hisoboti Portugaliya - Kongo DR", url: SRC_ESPN },
        { label: "FIFA: rasmiy o'yin hisoboti", url: SRC_FIFA },
      ],
      cta: {
        text: "Do'koningizni nom emas, kunlik nazoratga tayang. BirLiy jamoasi ulanish va sozlashda yordam beradi.",
        button: "Ariza qoldirish",
      },
    },
    ru: {
      title: "Португалия 1:1 Конго: громкого имени мало, побеждает ежедневный контроль",
      description:
        "Матч Португалия, Конго как урок для владельца магазина: даже известное имя и людное место теряют деньги без дисциплины. Каждый день контролируйте остатки, выручку и долги.",
      keywords: [
        "Португалия Конго",
        "футбол урок для бизнеса",
        "контроль магазина",
        "ежедневный учет",
        "контроль остатков",
        "контроль долгов",
        "BirLiy POS",
        "для владельца магазина",
      ],
      intro: [
        "17 июня 2026 года Португалия и ДР Конго сыграли вничью 1:1. Жоау Невеш на 6-й минуте вывел Португалию вперёд ударом головой, а Йоан Висса в добавленное время первого тайма (45+5) сравнял счёт, забив первый в истории гол сборной Конго на чемпионатах мира.",
        "Португалия больше атаковала и владела мячом, а Роналду на 68-й и 73-й минутах не реализовал два явных момента. Несмотря на громкое имя и сильный состав, победа не пришла.",
        "Это не спортивный прогноз и не ставки, а практический урок для владельца магазина. Имя само по себе не приносит денег, их приносит ежедневный контроль.",
      ],
      sections: [
        {
          h2: "Громкое имя не гарантирует результат",
          paragraphs: [
            "Португалия сильная команда, но на поле побеждает не имя, а конкретные действия. В магазине так же: вы можете быть на людной улице или в известной точке, но это само по себе не означает прибыль.",
            "Многие владельцы думают: место хорошее, покупателей много, значит всё в порядке. На деле деньги теряются или сохраняются в ежедневном контроле между продажами и расходами.",
          ],
        },
        {
          h2: "Упущенный момент, это потерянные деньги",
          paragraphs: [
            "Роналду дважды не использовал явные моменты. В магазине упущенный момент выглядит иначе: непосчитанный товар, незаписанный долг, непроверенная смена.",
            "Каждая мелочь, оставшаяся без внимания, как упущенный удар на поле, в итоге меняет результат. Поэтому каждый день нужно смотреть остатки, выручку и долги.",
          ],
          list: [
            "Сколько составила сегодняшняя выручка.",
            "Какой товар заканчивается или закончился.",
            "Кто взял в долг и сколько должен вернуть.",
            "Что было возвращено или удалено в смене кассира.",
          ],
        },
        {
          h2: "Дисциплина, это ежедневное повторение",
          paragraphs: [
            "Одного хорошего матча мало, команда должна держать дисциплину в каждой игре. Магазин тоже растёт не одним хорошим днём, а ежедневным повторением.",
            "Если владелец каждый день за несколько минут смотрит сегодняшние цифры, он видит проблему в тот же день, а не поздно. Именно эта привычка сохраняет больше денег, чем громкое имя.",
          ],
        },
        {
          h2: "BirLiy даёт владельцу ежедневный контроль",
          paragraphs: [
            "BirLiy работает на телефоне и показывает владельцу выручку, остатки и долги, не стоя у кассы. Кассир проводит продажи, а владелец каждый день видит точные цифры со своего телефона.",
            "Так магазин опирается не только на место или имя, а на ежедневную дисциплину. Это более надёжная опора, чем известность.",
          ],
        },
      ],
      faq: [
        {
          q: "Это спортивный прогноз?",
          a: "Нет. Это практический бизнес-урок из результата матча, а не прогноз или ставка. Цель, показать владельцу магазина важность ежедневного контроля.",
        },
        {
          q: "Почему даже известное место теряет деньги?",
          a: "Потому что прибыль не в месте или имени, а в ежедневном контроле продаж, расходов и долгов. Без контроля даже людная точка незаметно теряет деньги.",
        },
        {
          q: "Что значит ежедневный контроль на практике?",
          a: "Каждый день смотреть выручку, остатки и долги. В BirLiy это видно владельцу через телефон за несколько минут.",
        },
        {
          q: "Как BirLiy это упрощает?",
          a: "Кассир проводит продажи, а BirLiy даёт владельцу отчёт по дневной выручке, остаткам и долгам на телефоне, поэтому контроль становится привычкой.",
        },
      ],
      sources: [
        { label: "ESPN: отчёт о матче Португалия - ДР Конго", url: SRC_ESPN },
        { label: "FIFA: официальный отчёт о матче", url: SRC_FIFA },
      ],
      cta: {
        text: "Опирайтесь не на имя, а на ежедневный контроль магазина. Команда BirLiy поможет с подключением и настройкой.",
        button: "Оставить заявку",
      },
    },
    en: {
      title: "Portugal 1-1 DR Congo: a big name is not enough, daily control wins",
      description:
        "The Portugal vs DR Congo match as a lesson for a shop owner: even a famous name and a busy location lose money without daily discipline. Control stock, revenue and debts every day.",
      keywords: [
        "Portugal DR Congo",
        "football business lesson",
        "shop control",
        "daily bookkeeping",
        "stock control",
        "debt control",
        "BirLiy POS",
        "for shop owners",
      ],
      intro: [
        "On 17 June 2026 Portugal and DR Congo drew 1-1. Joao Neves headed Portugal ahead in the 6th minute, and Yoane Wissa equalized in first-half stoppage time (45+5), scoring DR Congo's first-ever World Cup goal.",
        "Portugal attacked more and dominated possession, while Ronaldo missed two clear chances in the 68th and 73rd minutes. Despite a big name and a strong squad, the win never came.",
        "This is not sports analysis or betting, just a practical lesson for a shop owner. A name alone does not bring money, daily control does.",
      ],
      sections: [
        {
          h2: "A famous name does not guarantee the result",
          paragraphs: [
            "Portugal is a strong team, but on the pitch it is actions, not names, that win. A shop is the same: you may sit on a busy street or be a well-known spot, but that alone is not profit.",
            "Many owners think the location is good and customers are plenty, so everything is fine. In reality money is lost or kept in the daily control between sales and costs.",
          ],
        },
        {
          h2: "A missed chance is lost money",
          paragraphs: [
            "Ronaldo failed to convert two clear chances. In a shop a missed chance looks different: an uncounted item, an unrecorded debt, an unchecked shift.",
            "Every small thing left unattended, like a missed shot on the pitch, changes the result in the end. That is why you should review stock, revenue and debts every day.",
          ],
          list: [
            "How much today's revenue was.",
            "Which product is running low or has run out.",
            "Who took credit and how much they owe.",
            "What was returned or deleted in the cashier's shift.",
          ],
        },
        {
          h2: "Discipline is daily repetition",
          paragraphs: [
            "One good match is not enough, a team must hold discipline in every game. A shop also grows not on one good day but on daily repetition.",
            "If the owner spends a few minutes each day on today's numbers, problems show up that same day, not late. This habit keeps more money than a big name does.",
          ],
        },
        {
          h2: "BirLiy gives the owner daily control",
          paragraphs: [
            "BirLiy runs on a phone and shows the owner revenue, stock and debts without standing at the till. The cashier records sales while the owner sees exact numbers every day from a phone.",
            "This way the shop relies not only on location or name, but on daily discipline. That is a more reliable foundation than fame.",
          ],
        },
      ],
      faq: [
        {
          q: "Is this article a sports prediction?",
          a: "No. It is a practical business lesson drawn from a match result, not a prediction or a bet. The goal is to show a shop owner why daily control matters.",
        },
        {
          q: "Why does even a famous location lose money?",
          a: "Because profit is not in the place or the name, but in the daily control of sales, costs and debts. Without control even a busy spot quietly loses money.",
        },
        {
          q: "What does daily control mean in practice?",
          a: "Reviewing revenue, stock and debts every day. In BirLiy the owner sees this on a phone in a few minutes.",
        },
        {
          q: "How does BirLiy make this easier?",
          a: "The cashier records sales while BirLiy gives the owner a daily revenue, stock and debt report on a phone, so control becomes a habit.",
        },
      ],
      sources: [
        { label: "ESPN: match report Portugal vs DR Congo", url: SRC_ESPN },
        { label: "FIFA: official match report", url: SRC_FIFA },
      ],
      cta: {
        text: "Rely on daily control, not a name. The BirLiy team helps with setup and configuration.",
        button: "Leave a request",
      },
    },
  },
};
