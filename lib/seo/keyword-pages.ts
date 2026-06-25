import type { Metadata } from "next";

export const SEO_SITE = "https://birliy.uz";
export const SEO_KEYWORD_LAST_MODIFIED = "2026-06-24";

export type SeoKeywordLocale = "uz" | "ru";

export type SeoProblem = {
  title: string;
  problem: string;
  solution: string;
};

export type SeoFaq = {
  q: string;
  a: string;
};

export type SeoKeywordPage = {
  locale: SeoKeywordLocale;
  slug: string;
  path: string;
  mainKeyword: string;
  eyebrow: string;
  h1: string;
  intro: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  problems: SeoProblem[];
  steps: string[];
  features: Array<{ title: string; text: string }>;
  price: {
    title: string;
    body: string;
    bullets: string[];
  };
  helper: {
    title: string;
    body: string;
  };
  faq: SeoFaq[];
  finalCta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };
  related: Array<{ label: string; href: string }>;
  keywords: string[];
};

export const SEO_KEYWORD_CONFIG = {
  uz: {
    priority: [
      "dokon uchun programma",
      "dokon kassa",
      "magazin uchun programma",
      "nasiya daftar",
      "ombor dasturi",
      "telefon kassa",
      "kompyutersiz kassa",
    ],
    problem: [
      "tovar qoldiq programma",
      "sklad programma",
      "dokon kirim chiqim",
      "kassir nazorat",
      "dokon tushumi",
    ],
    debt: ["qarz daftar", "nasiya dasturi", "elektron qarz daftar", "qarzdorlar royxati"],
    payment: ["qr tolov kassa", "karta tolov kassa", "naqd va karta hisob"],
    typo: ["dokon pragramma", "magazin pragramma", "tavar xisob", "qarz davtar", "telifonda kassa"],
  },
  ru: {
    priority: [
      "программа для магазина",
      "касса для магазина",
      "кассовая программа для магазина",
      "касса на телефоне",
      "касса без компьютера",
    ],
    problem: [
      "учет товара в магазине",
      "складской учет для магазина",
      "учет остатков в магазине",
      "контроль кассира магазин",
    ],
    debt: ["программа для учета долгов", "долговая тетрадь магазин", "учет долгов клиентов"],
    payment: ["qr оплата магазин", "касса с qr оплатой", "оплата qr в магазине"],
    typo: ["магазинная программа", "насия программа", "программа склад магазин"],
  },
} as const;

const uzSteps = [
  "Ariza qoldirasiz, menejer do'kon turi va savdo oqimini aniqlaydi.",
  "Do'kon, kassirlar va tovarlarni sozlashga yordam beramiz.",
  "Kassir telefon yoki planshetda sotishni o'rganadi.",
  "Birinchi chekni birga urib, egasi panelini ko'rsatamiz.",
];

const ruSteps = [
  "Оставляете заявку, менеджер уточняет формат магазина и продажи.",
  "Помогаем настроить точку, кассиров и товары.",
  "Кассир учится продавать с телефона или планшета.",
  "Вместе пробиваем первый чек и показываем кабинет владельца.",
];

const uzFeatures = [
  { title: "Kassa", text: "Sotuv, qaytarish va chek bitta ekranda yuradi." },
  { title: "Sklad va qoldiq", text: "Har sotuvdan keyin tovar qoldig'i yangilanadi." },
  { title: "QR va to'lovlar", text: "Naqd, karta, QR va nasiya bitta hisobda ko'rinadi." },
  { title: "Nasiya", text: "Qarzlarni daftar tutmasdan mijoz bo'yicha yozasiz." },
  { title: "Egasi paneli", text: "Tushum, kassir va qoldiqni telefondan ko'rasiz." },
  { title: "PIN nazorat", text: "Har kassir alohida PIN bilan ishlaydi." },
];

const ruFeatures = [
  { title: "Касса", text: "Продажа, возврат и чек в одном экране." },
  { title: "Склад и остатки", text: "Остаток товара обновляется после каждой продажи." },
  { title: "QR и оплаты", text: "Наличные, карта, QR и долг сходятся в одном учете." },
  { title: "Долги", text: "Долги клиентов ведутся без бумажной тетради." },
  { title: "Кабинет владельца", text: "Выручка, кассир и остатки видны с телефона." },
  { title: "PIN контроль", text: "Каждый кассир работает под своим PIN." },
];

const uzPrice = {
  title: "Narx sodda va oldindan ma'lum",
  body: "Birinchi 6 oy 49 000 sum/oy. Keyin 149 000 sum/oy. Kassa, sklad, nasiya, hisobot va QR/to'lov imkoniyatlari kiradi.",
  bullets: ["Boshlash uchun kompyuter shart emas", "Jihoz keyin va ixtiyoriy", "Yashirin to'lovsiz"],
};

const ruPrice = {
  title: "Цена понятная заранее",
  body: "Первые 6 месяцев 49 000 sum/мес. Потом 149 000 sum/мес. Входит касса, склад, долги, отчеты и QR/оплаты.",
  bullets: ["Для старта компьютер не нужен", "Оборудование позже и по желанию", "Без скрытых платежей"],
};

const uzFinalCta = {
  title: "Do'koningizni telefondan boshqarishni ko'ring",
  body: "Ariza qoldiring. Menejer do'koningiz uchun qaysi start qulayligini tushuntiradi.",
  primary: "Ariza qoldirish",
  secondary: "Jonli demoni ko'rish",
};

const ruFinalCta = {
  title: "Посмотрите, как магазин работает с телефона",
  body: "Оставьте заявку. Менеджер объяснит, какой старт удобен для вашей точки.",
  primary: "Оставить заявку",
  secondary: "Смотреть демо",
};

const uzProgramProblems: SeoProblem[] = [
  {
    title: "Daftarda yozish ko'p vaqt oladi",
    problem: "Sotuv, qoldiq va qarzni alohida yozsangiz, kechqurun raqamlar chalkashadi.",
    solution: "BirLiy sotuv, qoldiq va to'lovni bitta ilovada yig'adi.",
  },
  {
    title: "Tovar qoldig'i ko'rinmaydi",
    problem: "Qaysi tovar tugayotganini faqat polkaga qarab bilasiz.",
    solution: "Har sotuvdan keyin qoldiq yangilanadi, egasi telefondan ko'radi.",
  },
  {
    title: "Kassir nazorati qiyin",
    problem: "Kassir nima sotganini va smenada qancha tushum bo'lganini so'rab bilasiz.",
    solution: "PIN-rollar va hisobotlar egasiga smenani ko'rsatadi.",
  },
];

const uzKassaProblems: SeoProblem[] = [
  {
    title: "Kassa uchun katta uskuna qo'rqitadi",
    problem: "Do'kon egasi kompyuter, printer va murakkab dasturdan boshlashni xohlamaydi.",
    solution: "BirLiy telefon bilan start beradi, skaner va printer keyin ulanadi.",
  },
  {
    title: "To'lovlar alohida yuradi",
    problem: "Naqd, karta, QR va nasiya boshqa-boshqa joyda qoladi.",
    solution: "To'lov turi chek ichida yoziladi va umumiy hisobotga tushadi.",
  },
  {
    title: "Tushumni kech ko'rasiz",
    problem: "Egasi kassirga qo'ng'iroq qilib, kunlik savdoni so'raydi.",
    solution: "Tushum va smena egasi telefonida ko'rinadi.",
  },
];

const uzDebtProblems: SeoProblem[] = [
  {
    title: "Qarzlar daftar sahifasida qoladi",
    problem: "Kim qancha qarz olgani yo'qolishi yoki noto'g'ri o'qilishi mumkin.",
    solution: "BirLiy qarzni mijoz bo'yicha yozadi va ro'yxatda ko'rsatadi.",
  },
  {
    title: "Nasiya sotuv hisobga qo'shilmaydi",
    problem: "Naqd pul va nasiya alohida yuradi, kunlik savdo chalkashadi.",
    solution: "Nasiya ham chek ichida turadi, umumiy savdo hisobotida ko'rinadi.",
  },
  {
    title: "Qaytarilgan pulni belgilash qiyin",
    problem: "Mijoz pul berganda daftarni qayta tekshirish kerak bo'ladi.",
    solution: "Qarz yopilganda holat yangilanadi va egasi ko'radi.",
  },
];

const uzStockProblems: SeoProblem[] = [
  {
    title: "Qoldiq qo'lda sanaladi",
    problem: "Tovarni har kuni sanash vaqt oladi va xato bo'lishi mumkin.",
    solution: "BirLiy sotuvdan keyin qoldiqni avtomatik kamaytiradi.",
  },
  {
    title: "Kirim-chiqim aralashadi",
    problem: "Kirim alohida, sotuv alohida yozilsa, haqiqiy qoldiq bilinmaydi.",
    solution: "Kirim va sotuv bitta ombor hisobiga ulanadi.",
  },
  {
    title: "Tugayotgan tovar kech bilinadi",
    problem: "Polka bo'shaganda tovar tugaganini sezasiz.",
    solution: "Qoldiqni telefondan ko'rib, oldindan buyurtma qilasiz.",
  },
];

const ruProgramProblems: SeoProblem[] = [
  {
    title: "Записи в тетради занимают время",
    problem: "Продажи, остатки и долги ведутся отдельно, поэтому вечером цифры не сходятся.",
    solution: "BirLiy собирает кассу, склад и оплаты в одном приложении.",
  },
  {
    title: "Остатки товара не видны",
    problem: "Владелец узнает о нехватке товара только по полке или словам кассира.",
    solution: "Остатки обновляются после продажи и видны с телефона.",
  },
  {
    title: "Кассира сложно контролировать",
    problem: "Нужно звонить и спрашивать, что продали и сколько денег в кассе.",
    solution: "PIN роли и отчеты показывают смену владельцу.",
  },
];

const ruKassaProblems: SeoProblem[] = [
  {
    title: "Сложная касса мешает старту",
    problem: "Маленькому магазину не хочется начинать с компьютера и тяжелого обучения.",
    solution: "BirLiy запускается с телефона, оборудование можно добавить позже.",
  },
  {
    title: "Оплаты расходятся",
    problem: "Наличные, карта, QR и долг остаются в разных местах.",
    solution: "Тип оплаты фиксируется в чеке и попадает в общий отчет.",
  },
  {
    title: "Выручка видна слишком поздно",
    problem: "Владелец узнает итог дня только вечером.",
    solution: "Выручка и смена видны в телефоне владельца.",
  },
];

const ruDebtProblems: SeoProblem[] = [
  {
    title: "Долги теряются в тетради",
    problem: "Запись можно пропустить, перепутать или потерять.",
    solution: "BirLiy хранит долг по клиенту и показывает список должников.",
  },
  {
    title: "Продажа в долг выпадает из учета",
    problem: "Наличные и долг ведутся отдельно, итог продаж становится мутным.",
    solution: "Долг фиксируется в продаже и виден в отчете.",
  },
  {
    title: "Возврат денег трудно отметить",
    problem: "Когда клиент платит, приходится искать запись в бумаге.",
    solution: "Погашение долга отмечается в приложении.",
  },
];

const uzProgramFaq: SeoFaq[] = [
  { q: "Do'kon uchun programma nima beradi?", a: "U sotuv, tovar qoldig'i, tushum, nasiya va kassir ishini bitta joyda ko'rsatadi. Egasi telefonidan asosiy raqamlarni ko'radi." },
  { q: "BirLiy telefonda ishlaydigan kassa va sklad dasturimi?", a: "Ha. BirLiy telefon orqali kassa, sklad, QR/to'lov va nasiya hisobini yuritishga yordam beradi." },
  { q: "Do'konimda kompyuter bo'lmasa ham ishlaydimi?", a: "Ha. Boshlash uchun telefon yetarli. Planshet, skaner va chek printeri keyin kerak bo'lsa ulanadi." },
  { q: "Excel'dagi tovarlarni yuklash mumkinmi?", a: "Ha, katalogni Excel orqali import qilish mumkin. Jamoa birinchi sozlashda yordam beradi." },
  { q: "Internet bo'lmasa savdo to'xtaydimi?", a: "Savdo lokal saqlanadi va internet tiklanganda sinxronlanadi. Bu oddiy uzilishlarda kassani to'xtatmaslik uchun kerak." },
];

const uzKassaFaq: SeoFaq[] = [
  { q: "Do'kon kassasi uchun qimmat uskuna kerakmi?", a: "Yo'q. BirLiy bilan telefon orqali boshlash mumkin. Jihozlar qulaylik uchun keyin qo'shiladi." },
  { q: "QR to'lovlarni ham hisobga oladimi?", a: "Ha. QR, karta, naqd va nasiya bitta chek va hisobot ichida ko'rinadi." },
  { q: "Shtrix kod skaner ulash mumkinmi?", a: "Ha. Boshlashda telefon kamerasi yetishi mumkin, keyin skaner ulash mumkin." },
  { q: "Kassirni egasi telefondan ko'ra oladimi?", a: "Ha. Egasi tushum, smena va kassir harakatlarini nazorat qiladi." },
  { q: "Bir nechta kassir bilan ishlaydimi?", a: "Ha. Har kassir alohida PIN bilan ishlaydi, shuning uchun smena va harakatlarni ajratish osonroq." },
];

const uzDebtFaq: SeoFaq[] = [
  { q: "Qarz daftarni telefonda yuritsa bo'ladimi?", a: "Ha. Mijoz qarzlari alohida daftar tutmasdan ilovada yoziladi." },
  { q: "Nasiya bergan mijozlarni qanday nazorat qilaman?", a: "Qarz mijoz bo'yicha ko'rinadi. Kim qancha olgani va qaysi qarz yopilgani ilovada turadi." },
  { q: "Qarz sotuv bilan birga hisoblanadimi?", a: "Ha. Nasiya sotuvning bir turi sifatida yoziladi, shu sababli umumiy savdo hisobotida ham ko'rinadi." },
  { q: "Odamlar karz daftar yoki qarz davtar deb qidirsa ham shu mavzumi?", a: "Ha. Bu oddiy qidiruv variantlari. Maqsad bir xil: qog'oz daftar o'rniga elektron qarz hisobi." },
  { q: "BirLiy narxi qancha?", a: "Birinchi 6 oy 49 000 sum/oy, keyin 149 000 sum/oy. Narx oldindan ma'lum." },
];

const uzStockFaq: SeoFaq[] = [
  { q: "Magazinda tovar qoldig'ini qanday ko'raman?", a: "Sotuv va kirim BirLiyda yuritilsa, qoldiq egasi telefonida ko'rinadi." },
  { q: "Tovar kirim-chiqim hisobini yuritsa bo'ladimi?", a: "Ha. Kirim, sotuv va qoldiq bitta ombor hisobida yuradi." },
  { q: "Sklad programma yoki ombor dasturi degani nima?", a: "Bu do'kondagi tovar qoldig'i, kirim va chiqimni ko'rsatadigan dastur. BirLiy buni kassa bilan birga beradi." },
  { q: "Tovarlarni Excel'dan yuklash mumkinmi?", a: "Ha. Excel import orqali boshlash osonlashadi." },
  { q: "Bir nechta do'konni bitta joydan ko'rish mumkinmi?", a: "Bir nechta nuqta bo'lsa, egasi ularni alohida nazorat qilish imkoniyatini kelishib oladi." },
];

const ruProgramFaq: SeoFaq[] = [
  { q: "Что дает программа для магазина?", a: "Она показывает продажи, остатки, выручку, долги клиентов и работу кассира в одном месте." },
  { q: "Нужен ли компьютер для работы магазина?", a: "Нет. Начать можно с телефона. Планшет, сканер и принтер можно подключить позже." },
  { q: "Подходит ли для маленького магазина?", a: "Да. BirLiy сделан для магазина у дома, минимаркета и похожих торговых точек." },
  { q: "Можно ли загрузить товары из Excel?", a: "Да. Товары можно импортировать из Excel, а команда помогает с первым запуском." },
  { q: "Сколько стоит BirLiy?", a: "Первые 6 месяцев 49 000 sum/мес, затем 149 000 sum/мес." },
];

const ruKassaFaq: SeoFaq[] = [
  { q: "Можно ли использовать кассу на телефоне?", a: "Да. BirLiy работает как касса на телефоне, а оборудование можно добавить позже." },
  { q: "Работает ли QR-оплата?", a: "Да. QR, карта, наличные и долг фиксируются в одном учете." },
  { q: "Можно ли подключить сканер штрихкода?", a: "Да. Можно начать с камеры телефона и позже подключить сканер." },
  { q: "Можно ли контролировать кассира удаленно?", a: "Да. Владелец видит выручку, смену и действия кассира." },
  { q: "Что делать, если нет интернета?", a: "Продажа сохраняется локально и синхронизируется после восстановления связи." },
];

const ruDebtFaq: SeoFaq[] = [
  { q: "Можно ли заменить тетрадь долгов телефоном?", a: "Да. Долги клиентов можно вести в приложении без бумажной тетради." },
  { q: "Как вести долги клиентов в магазине?", a: "Долг записывается по клиенту, а владелец видит список должников и погашения." },
  { q: "Насия программа это про такой учет?", a: "Да. Насия, долг и долговая тетрадь в поиске часто означают одну задачу: не потерять клиентские долги." },
  { q: "Долг попадает в отчет продаж?", a: "Да. Продажа в долг остается частью продажи и видна в отчетах." },
  { q: "Сколько стоит BirLiy?", a: "Первые 6 месяцев 49 000 sum/мес, затем 149 000 sum/мес." },
];

const baseUzRelated = [
  { label: "Do'kon uchun programma", href: "/uz/dokon-uchun-programma" },
  { label: "Do'kon kassa", href: "/uz/dokon-kassa" },
  { label: "Nasiya daftar", href: "/uz/nasiya-daftar" },
  { label: "Ombor dasturi", href: "/uz/ombor-dasturi" },
];

const baseRuRelated = [
  { label: "Программа для магазина", href: "/ru/programma-dlya-magazina" },
  { label: "Касса для магазина", href: "/ru/kassa-dlya-magazina" },
  { label: "Учет долгов в магазине", href: "/ru/uchet-dolgov-magazin" },
];

export const SEO_KEYWORD_PAGES = [
  {
    locale: "uz",
    slug: "dokon-uchun-programma",
    path: "/uz/dokon-uchun-programma",
    mainKeyword: "dokon uchun programma",
    eyebrow: "Do'kon egalari uchun sodda yechim",
    h1: "Do'kon uchun programma: kassa, sklad va nasiya bitta telefonda",
    intro: "BirLiy kichik do'konga sotuvni urish, tovar qoldig'ini ko'rish, tushumni nazorat qilish va qarzlarni yozishni kompyutersiz beradi.",
    title: "Do'kon uchun programma: kassa, sklad va nasiya bitta telefonda",
    description: "Do'kon uchun programma izlayapsizmi? BirLiy telefonda kassa, sklad, tovar qoldig'i, nasiya va QR to'lov hisobini yuritadi. Narx 49 000 sum/oydan.",
    ogTitle: "Do'kon uchun programma, BirLiy telefonda kassa va sklad",
    ogDescription: "Kichik do'kon uchun kassa, sklad, nasiya va egasi nazorati bitta telefonda.",
    problems: uzProgramProblems,
    steps: uzSteps,
    features: uzFeatures,
    price: uzPrice,
    helper: {
      title: "Buni har xil yozib qidirishadi",
      body: "Kimdir 'dokon programma', kimdir 'dokon pragramma' yoki 'dukon dasturi' deb qidiradi. Bu sahifa do'kon uchun sodda kassa va hisob dasturini tushuntiradi.",
    },
    faq: uzProgramFaq,
    finalCta: uzFinalCta,
    related: baseUzRelated,
    keywords: ["dokon uchun programma", "dokon programma", "dukon dasturi", "dokon uchun dastur", "savdo programma"],
  },
  {
    locale: "uz",
    slug: "dokon-kassa",
    path: "/uz/dokon-kassa",
    mainKeyword: "dokon kassa",
    eyebrow: "Telefon orqali kassa",
    h1: "Do'kon kassa: telefon orqali sotuv va qoldiq nazorati",
    intro: "BirLiy do'kon kassasini telefon orqali boshlashga yordam beradi. Sotuv, to'lov turi, chek, qoldiq va kassir smenasi bitta joyda ko'rinadi.",
    title: "Do'kon kassa: telefon orqali sotuv va qoldiq nazorati",
    description: "Do'kon kassa kerakmi? BirLiy telefon orqali kassa, QR to'lov, nasiya, qoldiq va kassir nazoratini beradi. Kompyuter shart emas.",
    ogTitle: "Do'kon kassa, telefon bilan sotuvni boshqarish",
    ogDescription: "BirLiy bilan kassa, QR to'lov, nasiya va qoldiq nazorati telefonda.",
    problems: uzKassaProblems,
    steps: uzSteps,
    features: uzFeatures,
    price: uzPrice,
    helper: {
      title: "Oddiy qidiruvlarga mos",
      body: "'Dokonga kassa', 'dukon kassa', 'kasa magazin' yoki 'kassa aparatsiz' deb qidirsangiz ham, savol bir xil: kichik do'konga sodda kassa kerak.",
    },
    faq: uzKassaFaq,
    finalCta: uzFinalCta,
    related: baseUzRelated,
    keywords: ["dokon kassa", "dokonga kassa", "dukon kassa", "kassa dasturi", "telefon kassa"],
  },
  {
    locale: "uz",
    slug: "magazin-uchun-programma",
    path: "/uz/magazin-uchun-programma",
    mainKeyword: "magazin uchun programma",
    eyebrow: "Magazin hisobi uchun",
    h1: "Magazin uchun programma: tovar, tushum va qarz hisobi",
    intro: "Magazin uchun programma sotuvni yozish bilan cheklanmasligi kerak. BirLiy tovar qoldig'i, kunlik tushum, nasiya va kassir nazoratini bir joyga yig'adi.",
    title: "Magazin uchun programma: tovar, tushum va qarz hisobi",
    description: "Magazin uchun programma: tovar qoldig'i, savdo hisobi, kassir nazorati, nasiya va QR to'lov. BirLiy telefonda ishlaydi.",
    ogTitle: "Magazin uchun programma, tovar va tushum hisobi",
    ogDescription: "BirLiy magazin uchun kassa, sklad va qarz hisobini bitta telefonda beradi.",
    problems: uzProgramProblems,
    steps: uzSteps,
    features: uzFeatures,
    price: uzPrice,
    helper: {
      title: "Magazin yoki do'kon, maqsad bitta",
      body: "Ko'p egalar 'magazin programma', 'magazinga programma' yoki 'magazin pragramma' deb yozadi. Biz professional matnda ma'noni saqlaymiz: kichik savdo nuqtasi uchun hisob.",
    },
    faq: uzProgramFaq,
    finalCta: uzFinalCta,
    related: baseUzRelated,
    keywords: ["magazin uchun programma", "magazin programma", "magazinga programma", "magazin kassa", "magazin hisobi"],
  },
  {
    locale: "uz",
    slug: "nasiya-daftar",
    path: "/uz/nasiya-daftar",
    mainKeyword: "nasiya daftar",
    eyebrow: "Qarz daftar o'rniga",
    h1: "Nasiya daftar o'rniga elektron qarz hisobi",
    intro: "Qarzlarni daftar tutmasdan yozing. BirLiy nasiya sotuvni mijoz bo'yicha saqlaydi, egasi esa kim qancha qarzdorligini ko'radi.",
    title: "Nasiya daftar o'rniga elektron qarz hisobi",
    description: "Nasiya daftar va qarz daftar o'rniga BirLiy. Mijoz qarzlari, sotuv, to'lov va qarzdorlar ro'yxati telefonda ko'rinadi.",
    ogTitle: "Nasiya daftar o'rniga BirLiy elektron qarz hisobi",
    ogDescription: "Qarzlarni mijoz bo'yicha yozing va egasi telefonidan nazorat qiling.",
    problems: uzDebtProblems,
    steps: uzSteps,
    features: uzFeatures,
    price: uzPrice,
    helper: {
      title: "Qarz daftarni turlicha yozishadi",
      body: "'Qarz daftar', 'karz daftar', 'nasiya davtar' yoki 'nasya programma' deb yozilganda ham ehtiyoj bir xil: mijoz qarzlarini yo'qotmaslik.",
    },
    faq: uzDebtFaq,
    finalCta: uzFinalCta,
    related: baseUzRelated,
    keywords: ["nasiya daftar", "qarz daftar", "qarz dasturi", "elektron nasiya daftar", "qarzdorlar royxati"],
  },
  {
    locale: "uz",
    slug: "ombor-dasturi",
    path: "/uz/ombor-dasturi",
    mainKeyword: "ombor dasturi",
    eyebrow: "Tovar qoldig'i uchun",
    h1: "Ombor dasturi: do'konda tovar qoldig'ini ko'rish",
    intro: "BirLiy ombor dasturi vazifasini kassa bilan birga bajaradi. Kirim, sotuv va qoldiq telefonda ko'rinadi.",
    title: "Ombor dasturi: do'konda tovar qoldig'ini ko'rish",
    description: "Ombor dasturi va sklad programma izlayotgan do'konlar uchun BirLiy. Tovar qoldig'i, kirim-chiqim va sotuv hisobi telefonda.",
    ogTitle: "Ombor dasturi, tovar qoldig'ini telefondan ko'rish",
    ogDescription: "Kirim, sotuv va qoldiqni bitta kassa va ombor hisobida yuriting.",
    problems: uzStockProblems,
    steps: uzSteps,
    features: uzFeatures,
    price: uzPrice,
    helper: {
      title: "Sklad programma degan qidiruv ham shu yerga yaqin",
      body: "Ba'zi egalar 'sklad programma', 'ombor pragramma', 'tavar xisob' yoki 'qoldiq korish' deb qidiradi. Asosiy savol: do'konda nima qolganini tez ko'rish.",
    },
    faq: uzStockFaq,
    finalCta: uzFinalCta,
    related: baseUzRelated,
    keywords: ["ombor dasturi", "sklad programma", "tovar qoldiq programma", "kirim chiqim programma", "dokon qoldiqni korish"],
  },
  {
    locale: "uz",
    slug: "telefon-kassa",
    path: "/uz/telefon-kassa",
    mainKeyword: "telefon kassa",
    eyebrow: "Kompyutersiz start",
    h1: "Telefon kassa: kompyutersiz savdoni boshqarish",
    intro: "Telefon kassa kichik do'kon uchun oddiyroq start beradi. BirLiy bilan sotuv, to'lov, qoldiq va nasiya telefon orqali yuradi.",
    title: "Telefon kassa: kompyutersiz savdoni boshqarish",
    description: "Telefon kassa va kompyutersiz kassa izlayotgan do'konlar uchun BirLiy. Sotuv, QR to'lov, qoldiq va nasiya telefonda.",
    ogTitle: "Telefon kassa, BirLiy bilan kompyutersiz savdo",
    ogDescription: "Kassa, qoldiq, QR to'lov va nasiya bitta telefonda.",
    problems: uzKassaProblems,
    steps: uzSteps,
    features: uzFeatures,
    price: uzPrice,
    helper: {
      title: "Telefon orqali kassa deb qidiradiganlar uchun",
      body: "'Telefonda kassa', 'telifonda kassa', 'oddiy telefon bilan kassa' yoki 'kompyuter kerak emas kassa' degan qidiruvlar bir ehtiyojni bildiradi.",
    },
    faq: uzKassaFaq,
    finalCta: uzFinalCta,
    related: baseUzRelated,
    keywords: ["telefon kassa", "telefonda kassa", "telefon orqali kassa", "kompyutersiz kassa", "oddiy telefon bilan kassa"],
  },
  {
    locale: "ru",
    slug: "programma-dlya-magazina",
    path: "/ru/programma-dlya-magazina",
    mainKeyword: "программа для магазина",
    eyebrow: "Для маленького магазина",
    h1: "Программа для магазина: касса, склад и долги в телефоне",
    intro: "BirLiy помогает магазину продавать, видеть остатки, контролировать выручку и вести долги клиентов без компьютера.",
    title: "Программа для магазина: касса, склад и долги в телефоне",
    description: "Программа для магазина BirLiy: касса на телефоне, складской учет, остатки, долги клиентов, QR-оплата и отчеты. Цена от 49 000 sum/мес.",
    ogTitle: "Программа для магазина, BirLiy касса и склад в телефоне",
    ogDescription: "Касса, склад, долги клиентов и отчеты для магазина у дома.",
    problems: ruProgramProblems,
    steps: ruSteps,
    features: ruFeatures,
    price: ruPrice,
    helper: {
      title: "Как это ищут владельцы магазинов",
      body: "Кто-то пишет 'магазинная программа', кто-то ищет 'программа склад магазин' или 'программа для торговли'. Задача одна: видеть продажи, остатки и деньги.",
    },
    faq: ruProgramFaq,
    finalCta: ruFinalCta,
    related: baseRuRelated,
    keywords: ["программа для магазина", "программа для торговли", "магазинная программа", "программа для минимаркета", "товарный учет для магазина"],
  },
  {
    locale: "ru",
    slug: "kassa-dlya-magazina",
    path: "/ru/kassa-dlya-magazina",
    mainKeyword: "касса для магазина",
    eyebrow: "Касса без компьютера",
    h1: "Касса для магазина без компьютера и сложного обучения",
    intro: "BirLiy дает кассу на телефоне: кассир продает, покупатель получает чек, а владелец видит выручку, оплату и остатки.",
    title: "Касса для магазина без компьютера и сложного обучения",
    description: "Касса для магазина BirLiy работает на телефоне. QR-оплата, долги, склад, отчеты и контроль кассира без сложного запуска.",
    ogTitle: "Касса для магазина, BirLiy на телефоне",
    ogDescription: "Телефонная касса для магазина у дома, минимаркета и продуктовой точки.",
    problems: ruKassaProblems,
    steps: ruSteps,
    features: ruFeatures,
    price: ruPrice,
    helper: {
      title: "Обычные запросы без сложных терминов",
      body: "Владельцы ищут 'касса на телефоне', 'касса без компьютера' или 'касса для маленького магазина'. BirLiy отвечает на этот простой сценарий.",
    },
    faq: ruKassaFaq,
    finalCta: ruFinalCta,
    related: baseRuRelated,
    keywords: ["касса для магазина", "касса на телефоне", "касса без компьютера", "касса для минимаркета", "касса с qr оплатой"],
  },
  {
    locale: "ru",
    slug: "uchet-dolgov-magazin",
    path: "/ru/uchet-dolgov-magazin",
    mainKeyword: "учет долгов в магазине",
    eyebrow: "Вместо тетради долгов",
    h1: "Учет долгов клиентов вместо бумажной тетради",
    intro: "BirLiy помогает вести долги клиентов в магазине: продажа в долг записывается в приложении, а владелец видит список должников.",
    title: "Учет долгов клиентов вместо бумажной тетради",
    description: "Учет долгов в магазине без бумажной тетради. BirLiy показывает долги клиентов, продажи, погашения и отчеты владельцу.",
    ogTitle: "Учет долгов в магазине, BirLiy вместо тетради",
    ogDescription: "Долги клиентов, продажи и погашения в телефоне владельца.",
    problems: ruDebtProblems,
    steps: ruSteps,
    features: ruFeatures,
    price: ruPrice,
    helper: {
      title: "Насия, долги, тетрадь",
      body: "Запросы 'долговая тетрадь магазин', 'учет долгов клиентов' и 'насия программа' обычно про одну проблему: не потерять, кто сколько должен.",
    },
    faq: ruDebtFaq,
    finalCta: ruFinalCta,
    related: baseRuRelated,
    keywords: ["учет долгов в магазине", "программа для учета долгов", "долговая тетрадь магазин", "насия программа", "учет долгов клиентов"],
  },
] satisfies SeoKeywordPage[];

export function seoKeywordPagesForLocale(locale: SeoKeywordLocale): SeoKeywordPage[] {
  return SEO_KEYWORD_PAGES.filter((page) => page.locale === locale);
}

export function getSeoKeywordPage(locale: SeoKeywordLocale, slug: string): SeoKeywordPage | undefined {
  return SEO_KEYWORD_PAGES.find((page) => page.locale === locale && page.slug === slug);
}

export function seoKeywordMetadata(page: SeoKeywordPage): Metadata {
  const url = `${SEO_SITE}${page.path}`;
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": `${SEO_SITE}/feed.xml` },
    },
    openGraph: {
      title: page.ogTitle,
      description: page.ogDescription,
      type: "website",
      locale: page.locale === "ru" ? "ru_RU" : "uz_UZ",
      url,
      siteName: "BirLiy",
      images: [{ url: "/photos/owner-tablet.jpg", width: 1120, height: 840, alt: page.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description: page.ogDescription,
      images: ["/photos/owner-tablet.jpg"],
    },
  };
}

export function seoKeywordJsonLd(page: SeoKeywordPage) {
  const url = `${SEO_SITE}${page.path}`;
  const home = page.locale === "ru" ? `${SEO_SITE}/ru` : SEO_SITE;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: page.locale,
        isPartOf: { "@id": `${SEO_SITE}/#website` },
        about: { "@id": `${SEO_SITE}/#software` },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: page.locale,
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: page.locale === "ru" ? "Главная" : "Bosh sahifa",
            item: home,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.mainKeyword,
            item: url,
          },
        ],
      },
    ],
  };
}
