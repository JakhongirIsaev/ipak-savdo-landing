import type { BlogPost } from "../types";
import { blogCover } from "../blog-image";

export const post: BlogPost = {
  slug: "ai-dan-foyda-malumotlar-va-nazorat",
  category: "ai-tech",
  date: "2026-06-19",
  modified: "2026-06-23",
  image: blogCover("ai-dan-foyda-malumotlar-va-nazorat"),
  locales: {
    uz: {
      title: "AI kichik biznesga foyda berishidan oldin: maʼlumot kerak",
      description:
        "AI do'kon savdosini daftardan o'qiy olmaydi. Avval sotuv, qoldiq va nasiyani telefonda yozib boring, o'zingiz va kelajak uchun. BirLiy boshlashda yordam beradi.",
      keywords: [
        "AI kichik biznes",
        "do'kon maʼlumotini raqamli qilish",
        "savdo va qoldiq hisobi telefonda",
        "nasiya hisobi dastur",
        "qarz daftar o'rniga ilova",
        "do'kon nazorati telefondan",
        "BirLiy kassa dasturi",
      ],
      intro: [
        "AI haqida ko'p gap eshityapsiz. Lekin oddiy haqiqat shu: AI sizning do'koningiz uchun hech narsa qila olmaydi, agar o'qiydigan maʼlumot bo'lmasa. Daftardagi qog'oz yozuvni dastur o'qiy olmaydi.",
        "Sotuv daftarda, qoldiq miyangizda, nasiya esa xotirada bo'lsa, har qanday tahlil uchun maʼlumotning o'zi yo'q. Birinchi qadam aqlli vositalar emas, oddiy yozuv: har bir sotuv, qoldiq va qarz biror joyda turishi kerak.",
        "Bu maqola AIni do'koningizga olib kelmaydi. U bittagina foydali narsani aytadi: avval asosiy raqamlarni telefonga ko'chiring. Buni qilsangiz, do'kon nazorati ham mustahkam, kelajakda biror vosita yordam bermoqchi bo'lsa, o'qiydigan maʼlumot ham tayyor.",
      ],
      sections: [
        {
          h2: "Nega AI daftardagi do'konga foyda bermaydi",
          paragraphs: [
            "Dastur faqat yozilgan, tartibli raqamni o'qiy oladi. Qog'oz daftardagi qo'lyozma, miyangizdagi qoldiq yoki eslab qoladigan nasiya, bularning hech biri dastur uchun maʼlumot emas. Demak istalgan aqlli vosita boshlanishidan oldin to'siqqa uchraydi.",
            "Shuning uchun do'kon egasi uchun birinchi va eng foydali qadam AI haqida o'ylash emas. Asosiy raqamlarni yozib boradigan joyga ega bo'lish: har bir sotuv tushgan paytda yozilsin, har bir qoldiq o'zgargan paytda yangilansin, har bir nasiya kim qancha qarzligi bilan turaversin.",
            "Bu murakkab ish emas. Bu shunchaki daftardagi hisobni telefonga ko'chirish. Lekin aynan shu qadam keyingi hamma narsani mumkin qiladi.",
          ],
        },
        {
          h2: "Avval nimani yozib borish kerak",
          paragraphs: [
            "Hammasini birdan emas. Do'kon nazorati uchun eng muhim to'rtta raqam bor, ular yozilsa, kun yakunida raqamlar o'zi to'g'ri keladi.",
            "Bu ro'yxat AI uchun emas, avvalo o'zingiz uchun. Lekin yon foyda shundaki, shu raqamlar yozilgani sayin, kelajakda biror tahlil uchun ham asos tayyor bo'ladi.",
          ],
          list: [
            "Sotuv: har bir sotuv tushgan paytda yozilsin, eslab qolishga hojat qolmasin.",
            "Qoldiq: tovar har sotuvdan keyin o'zi kamayib borsin.",
            "Nasiya: kim qancha qarz va qachon to'lashni va'da qilgani bitta ro'yxatda tursin.",
            "Naqd: kassa harakatlari kun oxirida bitta hisobotga jamlansin.",
          ],
        },
        {
          h2: "Daftardan farqi: yozuv yo'qolmaydi",
          paragraphs: [
            "Daftar yaxshi, yo'qolguncha. Sahifa yirtilsa yoki ho'l bo'lsa, kim qancha qarzligini isbotlash qiyin. Xaridor allaqachon to'laganini aytsa, qo'lingizda faqat dog' bosgan raqam qoladi.",
            "Telefonda yozilgan sotuv va nasiya yo'qolmaydi. Naqd, QR va qarz bitta hisobda turadi. Daftardan farqi shuki, yozuv yo'qolib ketmaydi, kechqurun uni boshqa joydagi raqam bilan solishtirish kerak bo'lmaydi.",
            "Bu hali AI emas. Bu shunchaki bir-biriga to'g'ri keladigan, qidirsa topiladigan yozuv.",
          ],
        },
        {
          h2: "BirLiy bu yerda qaerda turadi",
          paragraphs: [
            "BirLiy AI mahsuloti emas. U telefonda ishlaydigan kassa dasturi: sotuv, ombor, nasiya va kassa harakatlari bitta joyga yozilib boradi. Egasi bugungi tushum, kam qolgan tovar va kim smenada ekanini telefonidan ko'radi.",
            "Aynan shu yozuv keyinchalik biror tahlil yoki vosita uchun asos bo'ladi. Lekin uni daftardan voz kechganingiz uchun emas, do'kon nazorati shundan mustahkamroq bo'lgani uchun qiling.",
            "Hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz. O'zbekiston uchun yaratilgan.",
          ],
        },
      ],
      faq: [
        {
          q: "AI mening do'konimga hozir foyda beradimi?",
          a: "Yo'q, agar maʼlumot daftarda yoki xotirangizda bo'lsa. Dastur faqat yozilgan, tartibli raqamni o'qiy oladi. Avval sotuv, qoldiq va nasiyani telefonda yozib boring.",
        },
        {
          q: "Kichik do'kon birinchi navbatda nimani yozib borishi kerak?",
          a: "Sotuv, qoldiq, nasiya va naqd. Shu to'rt raqam yozilsa, do'kon nazorati ham mustahkam, kelajakdagi tahlil uchun asos ham tayyor bo'ladi.",
        },
        {
          q: "BirLiy AI yordamida ishlaydimi?",
          a: "Yo'q. BirLiy telefonda ishlaydigan kassa dasturi. U do'kon raqamlarini bitta joyga yozib boradi, AI vositasi emas.",
        },
        {
          q: "Daftar ham yozuv-ku, farqi nima?",
          a: "Telefondagi yozuv yo'qolmaydi va ho'l bo'lmaydi. Naqd, QR va qarz bitta hisobda turadi, kechqurun ularni alohida joylardan yig'ish kerak bo'lmaydi.",
        },
        {
          q: "Boshlash uchun nima kerak?",
          a: "Faqat telefon. Boshqa uskuna shart emas. Hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz.",
        },
      ],
      cta: { text: "Avval do'koningiz sotuvi va qoldig'ini telefonga ko'chiring. BirLiy jamoasi ulanishda yordam beradi.", button: "Ariza qoldirish" },
    },
    ru: {
      title: "Чтобы AI помог магазину, сначала нужны данные",
      description:
        "AI не прочитает продажи из тетради. Сначала записывайте продажи, остатки и насию в телефоне, и для AI, и для себя. BirLiy помогает начать.",
      keywords: [
        "AI малый бизнес",
        "оцифровка данных магазина",
        "учёт продаж и остатков в телефоне",
        "учёт насии программа",
        "замена долговой тетради приложение",
        "контроль магазина с телефона",
        "BirLiy касса",
      ],
      intro: [
        "Про AI вы слышите много. Но простая правда такая: AI ничего не сделает для вашего магазина, если ему нечего читать. Рукопись в тетради программа прочитать не может.",
        "Если продажи в тетради, остаток в голове, а насия в памяти, то для любого анализа просто нет данных. Первый шаг это не умные инструменты, а обычная запись: каждая продажа, остаток и долг должны где-то лежать.",
        "Эта статья не принесёт AI в ваш магазин. Она говорит одну полезную вещь: сначала перенесите базовые цифры в телефон. Сделаете это, и контроль над магазином крепче, и данные для будущего инструмента готовы.",
      ],
      sections: [
        {
          h2: "Почему AI бесполезен для магазина с тетрадью",
          paragraphs: [
            "Программа читает только записанную, упорядоченную цифру. Почерк в бумажной тетради, остаток в голове, запоминаемая насия: ничего из этого для программы не данные. Значит любой умный инструмент спотыкается ещё до старта.",
            "Поэтому первый и самый полезный шаг для владельца магазина это не мысли об AI. Это завести место, где базовые цифры записываются сами: каждая продажа в момент, когда она прошла, каждый остаток в момент изменения, каждая насия с тем, кто сколько должен.",
            "Это не сложная работа. Это просто перенос учёта из тетради в телефон. Но именно этот шаг делает возможным всё остальное.",
          ],
        },
        {
          h2: "Что записывать в первую очередь",
          paragraphs: [
            "Не всё сразу. Для контроля над магазином важны четыре цифры, и если они записаны, в конце дня всё сходится само.",
            "Этот список не ради AI, а прежде всего ради вас самих. Но побочная польза в том, что чем дольше эти цифры пишутся, тем готовее основа для будущего анализа.",
          ],
          list: [
            "Продажа: каждая продажа записывается в момент, когда прошла, запоминать ничего не нужно.",
            "Остаток: товар сам убывает после каждой продажи.",
            "Насия: кто сколько должен и когда обещал оплатить, в одном списке.",
            "Наличные: движения кассы сводятся в один отчёт в конце дня.",
          ],
        },
        {
          h2: "Отличие от тетради: запись не теряется",
          paragraphs: [
            "Тетрадь хороша, пока не потеряется. Страница порвалась или намокла, и доказать, кто сколько должен, сложно. Покупатель говорит, что уже заплатил, а у вас в руке только смазанная цифра.",
            "Продажа и насия, записанные в телефоне, не теряются. Наличные, QR и долг лежат в одном учёте. Отличие от тетради в том, что запись не пропадает, и вечером её не нужно совмещать с цифрой из другого места.",
            "Это ещё не AI. Это просто запись, которая сходится сама и находится по поиску.",
          ],
        },
        {
          h2: "Где здесь BirLiy",
          paragraphs: [
            "BirLiy не AI-продукт. Это касса в телефоне: продажи, склад, насия и движения кассы пишутся в одно место. Владелец видит сегодняшнюю выручку, заканчивающийся товар и кто на смене со своего телефона.",
            "Именно эта запись потом становится основой для любого анализа или инструмента. Но заводите её не ради отказа от тетради, а потому что так контроль над магазином крепче.",
            "Сейчас открываем ранний доступ для первых магазинов Ташкента. Сделано для Узбекистана.",
          ],
        },
      ],
      faq: [
        {
          q: "Поможет ли AI моему магазину прямо сейчас?",
          a: "Нет, если данные в тетради или в голове. Программа читает только записанную, упорядоченную цифру. Сначала записывайте продажи, остатки и насию в телефоне.",
        },
        {
          q: "Что небольшому магазину записывать в первую очередь?",
          a: "Продажи, остатки, насию и наличные. Если эти четыре цифры записаны, и контроль над магазином крепче, и основа для будущего анализа готова.",
        },
        {
          q: "Работает ли BirLiy на AI?",
          a: "Нет. BirLiy это касса в телефоне. Она записывает цифры магазина в одно место, это не AI-инструмент.",
        },
        {
          q: "Тетрадь это тоже запись, в чём разница?",
          a: "Запись в телефоне не теряется и не намокает. Наличные, QR и долг лежат в одном учёте, вечером их не нужно собирать из разных мест.",
        },
        {
          q: "Что нужно для старта?",
          a: "Только телефон. Отдельное оборудование не требуется. Сейчас открываем ранний доступ для первых магазинов Ташкента.",
        },
      ],
      cta: { text: "Сначала перенесите продажи и остатки магазина в телефон. Команда BirLiy поможет с подключением.", button: "Оставить заявку" },
    },
    en: {
      title: "Before AI can help a shop, it needs data to read",
      description:
        "AI cannot read sales from a paper notebook. Record sales, stock and credit in your phone first, for AI and for yourself. BirLiy helps you start.",
      keywords: [
        "AI small business",
        "digitize shop data",
        "sales and stock tracking on phone",
        "customer credit tracking app",
        "replace debt notebook app",
        "shop control from phone",
        "BirLiy POS",
      ],
      intro: [
        "You hear a lot about AI. But the plain truth is this: AI can do nothing for your shop if it has nothing to read. A program cannot read handwriting in a notebook.",
        "If sales are in a notebook, stock is in your head, and credit is in your memory, there is simply no data for any analysis. The first step is not a smart tool, it is plain recording: every sale, stock level and debt has to live somewhere.",
        "This article will not bring AI into your shop. It says one useful thing: move the basic numbers into your phone first. Do that, and your control over the shop is firmer, and the data for any future tool is ready.",
      ],
      sections: [
        {
          h2: "Why AI is useless for a shop run on a notebook",
          paragraphs: [
            "A program can only read a recorded, orderly number. Handwriting in a paper notebook, stock in your head, credit kept in memory: none of these are data to a program. So any smart tool stalls before it even starts.",
            "That is why the first and most useful step for a shop owner is not to think about AI. It is to have a place where the basic numbers record themselves: every sale the moment it happens, every stock level the moment it changes, every credit entry with who owes how much.",
            "This is not hard work. It is simply moving the records from the notebook into the phone. But this is the step that makes everything else possible.",
          ],
        },
        {
          h2: "What to record first",
          paragraphs: [
            "Not everything at once. Four numbers matter most for shop control, and when they are recorded, the day reconciles by itself at close.",
            "This list is not for AI, it is first of all for you. But the side benefit is that the longer these numbers are recorded, the readier the foundation for any future analysis.",
          ],
          list: [
            "Sale: every sale is recorded the moment it happens, with nothing to memorize.",
            "Stock: the item count drops by itself after each sale.",
            "Credit: who owes how much and when they promised to pay, in one list.",
            "Cash: till movements are summarized in one report at the end of the day.",
          ],
        },
        {
          h2: "The difference from a notebook: the record does not get lost",
          paragraphs: [
            "A notebook is fine until it gets lost. A page tears or gets wet, and proving who owes how much is hard. A customer says they already paid, and all you hold is a smudged number.",
            "A sale and a credit entry recorded in the phone do not get lost. Cash, QR and debt sit in one ledger. The difference from a notebook is that the record does not disappear, and in the evening you do not need to match it against a number from somewhere else.",
            "This is not AI yet. It is simply a record that reconciles by itself and can be found by search.",
          ],
        },
        {
          h2: "Where BirLiy fits in",
          paragraphs: [
            "BirLiy is not an AI product. It is a till in the phone: sales, stock, credit and till movements are written into one place. The owner sees today's revenue, low-stock items and who is on shift from their phone.",
            "It is exactly this record that later becomes the foundation for any analysis or tool. But set it up not to abandon the notebook, but because shop control is firmer this way.",
            "We are now opening early access for the first shops in Tashkent. Made for Uzbekistan.",
          ],
        },
      ],
      faq: [
        {
          q: "Will AI help my shop right now?",
          a: "No, if the data is in a notebook or in your head. A program can only read a recorded, orderly number. Record sales, stock and credit in your phone first.",
        },
        {
          q: "What should a small shop record first?",
          a: "Sales, stock, credit and cash. If these four numbers are recorded, shop control is firmer and the foundation for future analysis is ready.",
        },
        {
          q: "Does BirLiy run on AI?",
          a: "No. BirLiy is a till in the phone. It records a shop's numbers into one place, it is not an AI tool.",
        },
        {
          q: "A notebook is a record too, so what is the difference?",
          a: "A record in the phone does not get lost or wet. Cash, QR and debt sit in one ledger, so you do not need to gather them from different places in the evening.",
        },
        {
          q: "What do I need to start?",
          a: "Only a phone. No separate equipment is required. We are now opening early access for the first shops in Tashkent.",
        },
      ],
      cta: { text: "Move your shop's sales and stock into the phone first. The BirLiy team helps with setup.", button: "Leave a request" },
    },
  },
};
