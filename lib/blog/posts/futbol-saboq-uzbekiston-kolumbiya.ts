import type { BlogPost } from "../types";

const SRC_ESPN = "https://www.espn.com/soccer/match/_/gameId/760436/colombia-uzbekistan";
const SRC_FIFA =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/uzbekistan-colombia-match-report-highlights";

export const post: BlogPost = {
  slug: "futbol-saboq-uzbekiston-kolumbiya",
  category: "football",
  date: "2026-06-19",
  modified: "2026-06-19",
  image: {
    square: "https://birliy.uz/photos/blog/futbol-saboq-uzbekiston-kolumbiya-1x1.jpg",
    landscape: "https://birliy.uz/photos/blog/futbol-saboq-uzbekiston-kolumbiya-4x3.jpg",
    wide: "https://birliy.uz/photos/blog/futbol-saboq-uzbekiston-kolumbiya-16x9.jpg",
  },
  locales: {
    uz: {
      title: "O'zbekiston 1:3 Kolumbiya: katta sahnaga birinchi qadam eng muhimi",
      description:
        "O'zbekistonning ilk jahon chempionati o'yini do'kon egasi uchun saboq: kattaroq sahnaga birinchi qadam eng muhimi. Do'konni raqamlashtirish, ana o'sha yangi daraja.",
      keywords: [
        "O'zbekiston Kolumbiya",
        "O'zbekiston jahon chempionati",
        "futbol biznes saboq",
        "do'konni raqamlashtirish",
        "birinchi qadam",
        "do'kon nazorati",
        "BirLiy POS",
        "do'kon egasi uchun",
      ],
      intro: [
        "2026-yil 17-iyun kuni O'zbekiston Kolumbiyaga 1:3 hisobida yutqazdi, ammo bu O'zbekiston uchun tarixiy kun edi: jamoa ilk bor jahon chempionatida maydonga chiqdi va Mexiko shahridagi mashhur Asteka stadionida o'ynadi.",
        "Daniel Munyos 40-daqiqada Kolumbiyani oldinga chiqardi, Abbosbek Fayzullayev esa 60-daqiqada hisobni tengladi. So'ng Luis Dias 65-daqiqada va Yaminton Kampas qo'shimcha vaqtda (90+9) Kolumbiya foydasiga 3:1 ni ta'minladi. Natija mag'lubiyat bo'lsa-da, sahna eng baland edi.",
        "Bu sport tahlili yoki bashorat emas, balki do'kon egasi uchun amaliy saboq. Kattaroq sahnaga birinchi qadam, hatto darhol g'alaba kelmasa ham, eng muhimi.",
      ],
      sections: [
        {
          h2: "Birinchi qadam eng katta qadam",
          paragraphs: [
            "O'zbekiston ilk bor jahon chempionatiga chiqdi va bu o'zi tarixiy yutuq. Do'kon egasi uchun ham birinchi qadam, ya'ni do'konni birinchi marta raqamlashtirish, eng katta qadamdir.",
            "Darhol mukammal natija shart emas. Muhimi, endi siz yuqori darajada o'ynayapsiz va tez o'rganib, har kuni kuchayib borasiz.",
          ],
        },
        {
          h2: "Yuqori darajada o'ynash sizni o'stiradi",
          paragraphs: [
            "Asteka kabi sahnada o'ynash jamoaga katta tajriba beradi, kuchli raqib esa kelajakdagi o'sishni tezlashtiradi. Do'konda ham aniq sonlar bilan ishlash sizni kuchli darajaga olib chiqadi.",
            "Quchog'ingizdagi daftar emas, raqamli hisob sizni xatolardan o'rgatadi va keyingi qadamlarni aniqroq qiladi. Bu o'sishning eng tez yo'li.",
          ],
          list: [
            "Tushum va xarajat aniq ko'rinadi.",
            "Qoldiq har kuni nazoratda bo'ladi.",
            "Qarz kim va qancha ekani yoziladi.",
            "Egasi qarorlarni tezroq va aniqroq qabul qiladi.",
          ],
        },
        {
          h2: "Mag'lubiyat emas, tajriba muhim",
          paragraphs: [
            "Abbosbek Fayzullayevning goli ko'rsatdiki, O'zbekiston eng kuchli raqibga ham javob bera oladi. Do'konda ham birinchi raqamli oy mukammal bo'lmasligi mumkin, lekin har kuni tajriba ortadi.",
            "Har bir kun yangi ma'lumot beradi, har bir hisobot keyingi qarorni yaxshilaydi. Aynan shu jarayon sizni vaqt o'tib kuchli qiladi.",
          ],
        },
        {
          h2: "BirLiy bilan yuqori darajaga chiqing",
          paragraphs: [
            "BirLiy telefonda do'koningizni raqamli boshqaruvga olib chiqadi: kassa, ombor, QR to'lov va egasi hisobotlari bir tizimda. Jamoa birinchi qadamni qo'yishda yordam beradi.",
            "Siz darhol katta g'alaba qilmasligingiz mumkin, lekin endi kuchliroq darajada o'ynaysiz va tez o'rganasiz. Bu g'ururlanadigan boshlanish.",
          ],
        },
      ],
      faq: [
        {
          q: "Bu maqola sport bashoratimi?",
          a: "Yo'q. Bu o'yin natijasidan olingan amaliy biznes saboq, bashorat yoki stavka emas. Maqsad birinchi qadamning ahamiyatini ko'rsatish.",
        },
        {
          q: "Nega birinchi qadam shunchalik muhim?",
          a: "Chunki yuqori darajaga chiqish o'rganishni tezlashtiradi. Do'konni birinchi marta raqamlashtirish ham sizni kuchliroq darajaga olib chiqadi.",
        },
        {
          q: "Birinchi raqamli oy mukammal bo'lmasa-chi?",
          a: "Bu normal holat. Muhimi, endi aniq sonlar bilan ishlaysiz va har kungi tajriba sizni tez kuchaytiradi.",
        },
        {
          q: "BirLiy birinchi qadamda qanday yordam beradi?",
          a: "BirLiy do'konni telefonda raqamli boshqaruvga oladi va jamoa ulanish, dastlabki katalog hamda kassirni sozlashda yordam beradi.",
        },
      ],
      sources: [
        { label: "ESPN: o'yin sahifasi Kolumbiya - O'zbekiston", url: SRC_ESPN },
        { label: "FIFA: rasmiy o'yin hisoboti", url: SRC_FIFA },
      ],
      cta: {
        text: "Do'koningizni yuqori darajaga olib chiqing. BirLiy jamoasi birinchi qadamda yordam beradi.",
        button: "Ariza qoldirish",
      },
    },
    ru: {
      title: "Узбекистан 1:3 Колумбия: первый шаг на большую сцену важнее всего",
      description:
        "Дебютный матч Узбекистана на чемпионате мира как урок для владельца магазина: первый шаг на большую сцену важнее всего. Цифровизация магазина, вот этот новый уровень.",
      keywords: [
        "Узбекистан Колумбия",
        "Узбекистан чемпионат мира",
        "футбол урок для бизнеса",
        "цифровизация магазина",
        "первый шаг",
        "контроль магазина",
        "BirLiy POS",
        "для владельца магазина",
      ],
      intro: [
        "17 июня 2026 года Узбекистан уступил Колумбии 1:3, но это был исторический день: сборная впервые вышла на чемпионат мира и сыграла на знаменитом стадионе Ацтека в Мехико.",
        "Даниэль Муньос на 40-й минуте вывел Колумбию вперёд, а Аббосбек Файзуллаев на 60-й минуте сравнял счёт. Затем Луис Диас на 65-й минуте и Яминтон Кампас в добавленное время (90+9) сделали 3:1 в пользу Колумбии. Результат, поражение, но сцена была самой высокой.",
        "Это не спортивный прогноз и не ставки, а практический урок для владельца магазина. Первый шаг на большую сцену важнее всего, даже если победа не приходит сразу.",
      ],
      sections: [
        {
          h2: "Первый шаг, это самый большой шаг",
          paragraphs: [
            "Узбекистан впервые вышел на чемпионат мира, и это само по себе историческое достижение. Для владельца магазина первый шаг, то есть первая цифровизация магазина, тоже самый большой шаг.",
            "Идеальный результат сразу не обязателен. Важно, что теперь вы играете на высоком уровне, быстро учитесь и день за днём становитесь сильнее.",
          ],
        },
        {
          h2: "Игра на высоком уровне растит вас",
          paragraphs: [
            "Игра на сцене вроде Ацтеки даёт команде большой опыт, а сильный соперник ускоряет будущий рост. В магазине работа с точными цифрами тоже выводит вас на сильный уровень.",
            "Не тетрадь в руках, а цифровой учёт учит вас на ошибках и делает следующие шаги точнее. Это самый быстрый путь роста.",
          ],
          list: [
            "Выручка и расходы видны точно.",
            "Остатки под контролем каждый день.",
            "Записано, кто и сколько должен.",
            "Владелец принимает решения быстрее и точнее.",
          ],
        },
        {
          h2: "Важно не поражение, а опыт",
          paragraphs: [
            "Гол Аббосбека Файзуллаева показал, что Узбекистан может ответить даже сильнейшему сопернику. В магазине первый цифровой месяц тоже может быть неидеальным, но опыт растёт каждый день.",
            "Каждый день даёт новые данные, каждый отчёт улучшает следующее решение. Именно этот процесс со временем делает вас сильнее.",
          ],
        },
        {
          h2: "Выйдите на высокий уровень с BirLiy",
          paragraphs: [
            "BirLiy выводит ваш магазин на цифровое управление в телефоне: касса, склад, QR-оплата и отчёты владельца в одной системе. Команда помогает сделать первый шаг.",
            "Возможно, вы не одержите большую победу сразу, но теперь вы играете на более сильном уровне и быстро учитесь. Это начало, которым можно гордиться.",
          ],
        },
      ],
      faq: [
        {
          q: "Это спортивный прогноз?",
          a: "Нет. Это практический бизнес-урок из результата матча, а не прогноз или ставка. Цель, показать важность первого шага.",
        },
        {
          q: "Почему первый шаг так важен?",
          a: "Потому что выход на высокий уровень ускоряет обучение. Первая цифровизация магазина тоже выводит вас на более сильный уровень.",
        },
        {
          q: "А если первый цифровой месяц неидеален?",
          a: "Это нормально. Важно, что теперь вы работаете с точными цифрами, и ежедневный опыт быстро вас усиливает.",
        },
        {
          q: "Как BirLiy помогает на первом шаге?",
          a: "BirLiy выводит магазин на цифровое управление в телефоне, а команда помогает с подключением, первым каталогом и настройкой кассира.",
        },
      ],
      sources: [
        { label: "ESPN: страница матча Колумбия - Узбекистан", url: SRC_ESPN },
        { label: "FIFA: официальный отчёт о матче", url: SRC_FIFA },
      ],
      cta: {
        text: "Выведите магазин на высокий уровень. Команда BirLiy поможет сделать первый шаг.",
        button: "Оставить заявку",
      },
    },
    en: {
      title: "Uzbekistan 1-3 Colombia: the first step onto a bigger stage matters most",
      description:
        "Uzbekistan's debut World Cup match as a lesson for a shop owner: the first step onto a bigger stage matters most. Digitizing the shop is that new level.",
      keywords: [
        "Uzbekistan Colombia",
        "Uzbekistan World Cup",
        "football business lesson",
        "digitize the shop",
        "first step",
        "shop control",
        "BirLiy POS",
        "for shop owners",
      ],
      intro: [
        "On 17 June 2026 Uzbekistan lost 1-3 to Colombia, but it was a historic day: the team appeared at a World Cup for the first time and played at the famous Estadio Azteca in Mexico City.",
        "Daniel Munoz put Colombia ahead in the 40th minute, and Abbosbek Fayzullaev equalized in the 60th minute. Then Luis Diaz in the 65th minute and Jaminton Campaz in stoppage time (90+9) made it 3-1 for Colombia. The result was a defeat, but the stage was the highest.",
        "This is not sports analysis or betting, just a practical lesson for a shop owner. The first step onto a bigger stage matters most, even if the win does not come right away.",
      ],
      sections: [
        {
          h2: "The first step is the biggest step",
          paragraphs: [
            "Uzbekistan reached a World Cup for the first time, and that itself is a historic achievement. For a shop owner the first step, the first time you digitize the shop, is also the biggest step.",
            "A perfect result right away is not required. What matters is that you now play at a higher level, learn fast and grow stronger day by day.",
          ],
        },
        {
          h2: "Playing at a higher level grows you",
          paragraphs: [
            "Playing on a stage like the Azteca gives a team great experience, and a strong opponent speeds up future growth. In a shop, working with exact numbers also lifts you to a stronger level.",
            "Not a notebook in your hands but digital records teach you from mistakes and make the next steps sharper. This is the fastest path to growth.",
          ],
          list: [
            "Revenue and costs are seen precisely.",
            "Stock is under control every day.",
            "It is recorded who owes how much.",
            "The owner makes decisions faster and more precisely.",
          ],
        },
        {
          h2: "It is the experience, not the defeat, that matters",
          paragraphs: [
            "Abbosbek Fayzullaev's goal showed that Uzbekistan can answer even the strongest opponent. In a shop the first digital month may also be imperfect, but experience grows every day.",
            "Each day brings new data, each report improves the next decision. It is this process that makes you stronger over time.",
          ],
        },
        {
          h2: "Step up to a higher level with BirLiy",
          paragraphs: [
            "BirLiy lifts your shop to digital management on a phone: checkout, inventory, QR payments and owner reports in one system. The team helps you take the first step.",
            "You may not win big right away, but you now play at a stronger level and learn fast. This is a start to be proud of.",
          ],
        },
      ],
      faq: [
        {
          q: "Is this article a sports prediction?",
          a: "No. It is a practical business lesson drawn from a match result, not a prediction or a bet. The goal is to show how important the first step is.",
        },
        {
          q: "Why does the first step matter so much?",
          a: "Because stepping onto a higher level speeds up learning. Digitizing the shop for the first time also lifts you to a stronger level.",
        },
        {
          q: "What if the first digital month is not perfect?",
          a: "That is normal. What matters is that you now work with exact numbers, and daily experience strengthens you fast.",
        },
        {
          q: "How does BirLiy help with the first step?",
          a: "BirLiy lifts the shop to digital management on a phone, and the team helps with setup, the first catalog and cashier configuration.",
        },
      ],
      sources: [
        { label: "ESPN: match page Colombia vs Uzbekistan", url: SRC_ESPN },
        { label: "FIFA: official match report", url: SRC_FIFA },
      ],
      cta: {
        text: "Step your shop up to a higher level. The BirLiy team helps with the first step.",
        button: "Leave a request",
      },
    },
  },
};
