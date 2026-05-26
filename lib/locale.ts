export type Locale = "ru" | "uz";

export const dictionary = {
  ru: {
    // Header
    logo: "Ipak Savdo",
    navFeatures: "Возможности",
    navHowItWorks: "Как работает",
    navForWhom: "Для кого",
    navPricing: "Тарифы",
    navFAQ: "FAQ",
    ctaApply: "Оставить заявку",
    langRu: "RU",
    langUz: "UZ",

    // Hero
    heroTitle: "Ipak Savdo — касса, склад и QR-оплата в одном приложении",
    heroSubtitle: "Продавайте со смартфона или планшета, принимайте оплату по QR, отправляйте электронный чек и контролируйте остатки без тяжёлой ERP.",
    primaryCta: "Оставить заявку",
    telegramCta: "Написать в Telegram",
    demoCta: "Смотреть демо",
    badgeQR: "QR-оплата в момент продажи",
    badgeStock: "Остатки обновляются автоматически",
    badgeOffline: "Работает при нестабильном интернете",
    badgeReports: "Отчёты по выручке и кассирам",
    trustLine: "Для магазинов у дома, минимаркетов, кафе, аптек и сервисных точек.",
    bankBadge: "Продукт экосистемы Ipak Yuli Bank",

    // Trust Strip
    trustPilot: "Готовится пилот с первыми торговыми точками",
    trustIntegrations: "Интеграции с QR-оплатой и фискализацией — в дорожной карте MVP",

    // Problem
    problemTitle: "Когда касса, склад и банк живут отдельно — бизнес теряет контроль",
    problem1Title: "Касса отдельно",
    problem1Desc: "Продажи проходят через наличные, терминал и телефон, но не собираются в единую картину.",
    problem2Title: "Склад на глаз",
    problem2Desc: "Остатки проверяются вручную, ошибки видны слишком поздно.",
    problem3Title: "Чеки и оплата отдельно",
    problem3Desc: "QR, чек и списание товара не связаны в один быстрый сценарий.",
    problem4Title: "Нет понятных отчётов",
    problem4Desc: "Собственник не видит выручку, топ-товары, возвраты и работу кассиров в реальном времени.",

    // Workflow
    workflowTitle: "Одна система для ежедневной работы торговой точки",
    workflowSubtitle: "Кассир продаёт. Покупатель оплачивает. Склад обновляется. Собственник видит результат.",
    stepScan: "Скан",
    stepCart: "Корзина",
    stepQR: "Dynamic QR",
    stepPay: "Оплата",
    stepReceipt: "Чек",
    stepStock: "Склад",
    stepReport: "Отчёт",

    // Demo
    demoTitle: "Посмотрите, как проходит продажа",
    demoText: "Короткое демо покажет путь от сканирования товара до QR-оплаты, чека и обновления остатков.",
    demoWatch: "Смотреть демо",
    demoModalText: "Демо-видео будет добавлено после запуска пилота.",

    // Features
    featuresTitle: "Всё, что нужно точке продаж в первом релизе",
    featPosTitle: "Касса и продажа",
    featPosDesc: "Сканер / камера, быстрый поиск товара, скидки, возврат, отложенный чек",
    featCatalogTitle: "Каталог и склад",
    featCatalogDesc: "SKU, категории, бренды, штучные и весовые товары, остатки и списания",
    featQRTitle: "QR и оплаты",
    featQRDesc: "Static / dynamic QR, наличные, терминал, долг, смешанные оплаты",
    featFiscalTitle: "Фискализация и чек",
    featFiscalDesc: "Электронный чек, печать опционально, доставка чека в Telegram",
    featRolesTitle: "Роли и контроль",
    featRolesDesc: "Владелец, кассир, несколько точек, контроль действий сотрудников",
    featReportsTitle: "Отчёты",
    featReportsDesc: "День / неделя / месяц, топ-товары, средний чек, возвраты, кассиры",

    // Offline
    offlineTitle: "Работает даже при нестабильном интернете",
    offlineText: "Продажи не должны останавливаться из-за слабой связи. Ipak Savdo проектируется с offline-first логикой: кассир продолжает работать, а данные синхронизируются после восстановления интернета.",
    offlineBullet1: "Продажи продолжаются при слабой связи",
    offlineBullet2: "Данные сохраняются локально",
    offlineBullet3: "Синхронизация после восстановления интернета",
    offlineBullet4: "Меньше риска остановить кассу в час пик",
    offlineNote: "Offline-first логика заложена в архитектуру MVP.",

    // App Screens
    screensTitle: "Работает со смартфона, планшета и комплектом кассы",
    screensHardware: "Для потоковых точек можно использовать планшет, 2D Bluetooth-сканер, принтер чеков и подставку.",
    screensStart: "Можно начать только со смартфона. Оборудование подключается по мере роста.",

    // Segments
    segmentsTitle: "Для какого бизнеса подходит Ipak Savdo",
    segConvenience: "Магазины у дома",
    segMinimarket: "Минимаркеты",
    segCafe: "Кафе и общепит",
    segPharmacy: "Аптеки",
    segClothing: "Одежда и бутики",
    segService: "Сервисные точки",

    // Benefits
    benefitsTitle: "Что получает владелец бизнеса",
    ben1: "Быстрее продажи на кассе",
    ben2: "Меньше ручного учёта",
    ben3: "Видны остатки и топ-товары",
    ben4: "Удобнее принимать оплату по QR",
    ben5: "Электронные чеки и фискализация",
    ben6: "Контроль сотрудников и точек",
    ben7: "Отчёты для решений, а не Excel вручную",
    benSummary: "Главное: собственник видит продажи, деньги и склад в одном месте.",

    // Roadmap
    roadmapTitle: "Финтех-подход для малого бизнеса",
    roadmapText: "Ipak Savdo создаётся вокруг ежедневной операционки бизнеса. Сначала — простая касса и склад. Затем — маркетинг, loyalty, B2B-закупки и финансовые продукты.",
    roadmapNow: "Сейчас",
    roadmapNowDesc: "Касса, склад, QR, чек, отчёты",
    roadmapSoon: "Скоро",
    roadmapSoonDesc: "Telegram-маркетинг, акции, loyalty",
    roadmapLater: "Далее",
    roadmapLaterDesc: "Банк внутри, B2B-закупки, лимиты, факторинг, BNPL",

    // Launch Offer
    launchTitle: "Старт без тяжёлой ERP и больших затрат",
    launchText: "Для первых клиентов планируется ранний доступ и льготный период. Точные условия подключения будут доступны при запуске пилота.",
    launchCta: "Оставить заявку на ранний доступ",

    // How to Start
    howToStartTitle: "Как начать работу",
    step1Title: "Оставьте заявку",
    step1Desc: "Укажите номер телефона, город и тип бизнеса.",
    step2Title: "Получите доступ к приложению",
    step2Desc: "После подключения скачайте Ipak Savdo в Play Market.",
    step3Title: "Начните продавать",
    step3Desc: "Добавьте товары, подключите QR и начните продажи.",

    // Lead Form
    formName: "Имя",
    formPhone: "Телефон",
    formBusinessType: "Тип бизнеса",
    formBusiness: "Тип бизнеса",
    formOptional: "Показать дополнительные поля",
    formTelegram: "Telegram username",
    formCity: "Город / регион",
    formPoints: "Количество торговых точек",
    formComment: "Комментарий",
    formSubmit: "Отправить заявку",
    formSuccess: "Заявка принята. Команда Ipak Savdo свяжется с вами.",
    formBusinessName: "Название бизнеса",
    formNeedsEquipment: "Нужно оборудование (касса, принтер, сканер)",
    formBusinessTypeOther: "Уточните вид бизнеса",
    formSubmitError: "Не удалось отправить. Попробуйте ещё раз или напишите нам в Telegram.",
    formRateLimited: "Слишком много заявок с одного устройства. Попробуйте через 10 минут.",
    formValidationError: "Проверьте поля и попробуйте ещё раз.",
    // Order matches BUSINESS_TYPE_VALUES in components/LeadForm.tsx — DO NOT REORDER
    businessTypes: ["Магазин", "Кафе", "Ресторан", "Рынок", "Красота", "Сервис", "Другое"] as const,
    success: "Заявка принята. Команда Ipak Savdo свяжется с вами.",
    submit: "Отправить заявку",
    optional: "Показать дополнительные поля",

    // FAQ
    faqTitle: "Часто задаваемые вопросы",
    faq1Q: "Нужно ли покупать компьютер?",
    faq1A: "Нет. Ipak Savdo создаётся как mobile-first решение. Можно работать со смартфона или планшета.",
    faq2Q: "Можно ли использовать сканер?",
    faq2A: "Да. Для быстрых продаж можно подключить 2D Bluetooth-сканер.",
    faq3Q: "Будет ли QR-оплата?",
    faq3A: "Да. Один из ключевых сценариев — QR-оплата прямо в момент продажи.",
    faq4Q: "Что происходит со складом после продажи?",
    faq4A: "Остаток товара обновляется автоматически после продажи.",
    faq5Q: "Можно ли отправлять чек клиенту?",
    faq5A: "Да. Электронный чек можно отправлять в Telegram. Печать чека можно добавить опционально.",
    faq6Q: "Есть ли приложение в Play Market?",
    faq6A: "Приложение готовится к публикации и будет доступно в Play Market.",
    faq7Q: "Для кого продукт не подходит?",
    faq7A: "Для крупных компаний со сложным ERP-процессом на старте лучше использовать индивидуальное внедрение. Ipak Savdo сначала фокусируется на микро и малом бизнесе.",

    // Footer
    footerTagline: "Касса, склад и QR-оплата для малого бизнеса",
    footerContact: "Для подключения оставьте заявку на сайте.",
    footerNavFeatures: "Возможности",
    footerNavHowItWorks: "Как работает",
    footerNavForWhom: "Для кого",
    footerNavFAQ: "FAQ",

    // Cookie
    cookieText: "Мы используем cookies для аналитики и улучшения работы сайта.",
    cookieAccept: "Принять",
    cookieLater: "Настроить позже",

    // Modal
    modalTitle: "Оставить заявку",
    modalClose: "Закрыть",

    // Common
    soonInPlayMarket: "Скоро в Play Market",
    downloadPlayMarket: "Скачать в Play Market",
    earlyAccess: "Оставить заявку на ранний доступ",
    getConsultation: "Получить консультацию",
  },
  uz: {
    // Header
    logo: "Ipak Savdo",
    navFeatures: "Imkoniyatlar",
    navHowItWorks: "Qanday ishlaydi",
    navForWhom: "Kim uchun",
    navPricing: "Tariflar",
    navFAQ: "FAQ",
    ctaApply: "Ariza qoldirish",
    langRu: "RU",
    langUz: "UZ",

    // Hero
    heroTitle: "Ipak Savdo — kassa, ombor va QR-to'lov bitta ilovada",
    heroSubtitle: "Smartfon yoki planshet orqali soting, QR orqali to'lov qabul qiling, elektron chek yuboring va qoldiqlarni nazorat qiling.",
    primaryCta: "Ariza qoldirish",
    telegramCta: "Telegram orqali yozish",
    demoCta: "Demoni ko'rish",
    badgeQR: "Sotish vaqtida QR-to'lov",
    badgeStock: "Qoldiqlar avtomatik yangilanadi",
    badgeOffline: "Noaniq internetda ham ishlaydi",
    badgeReports: "Daromad va kassirlar hisoboti",
    trustLine: "Uy yonidagi do'konlar, minimarketlar, kafelar, dorixonalar va xizmat ko'rsatish nuqtalari uchun.",
    bankBadge: "Ipak Yuli Bank ekotizimi mahsuloti",

    // Trust Strip
    trustPilot: "Birinchi savdo nuqtalari bilan pilot tayyorlanmoqda",
    trustIntegrations: "QR-to'lov va fiskalizatsiya integratsiyalari — MVP yo'l xaritasida",

    // Problem
    problemTitle: "Kassa, ombor va bank alohida yashaganda — biznes nazoratni yo'qotadi",
    problem1Title: "Kassa alohida",
    problem1Desc: "Sotish naqd pul, terminal va telefon orqali o'tadi, lekin bitta rasmga yig'ilmaydi.",
    problem2Title: "Ombor ko'z bilan",
    problem2Desc: "Qoldiqlar qo'lda tekshiriladi, xatolar juda kech ko'rinadi.",
    problem3Title: "Chek va to'lov alohida",
    problem3Desc: "QR, chek va tovar yechib olish bitta tez scenariyga bog'lanmagan.",
    problem4Title: "Tushunarli hisobotlar yo'q",
    problem4Desc: "Egasi daromad, top-tovarlar, qaytarishlar va kassirlar ishini real vaqtda ko'rmaydi.",

    // Workflow
    workflowTitle: "Savdo nuqtasining kundalik ishi uchun bitta tizim",
    workflowSubtitle: "Kassir sotadi. Xaridor to'laydi. Ombor yangilanadi. Egasi natijani ko'radi.",
    stepScan: "Skan",
    stepCart: "Savat",
    stepQR: "Dynamic QR",
    stepPay: "To'lov",
    stepReceipt: "Chek",
    stepStock: "Ombor",
    stepReport: "Hisobot",

    // Demo
    demoTitle: "Sotish qanday o'tishini ko'ring",
    demoText: "Qisqa demo tovar skanerlashdan QR-to'lov, chek va qoldiqlarni yangilashgacha bo'lgan yo'lni ko'rsatadi.",
    demoWatch: "Demoni ko'rish",
    demoModalText: "Demo-video pilot ishga tushirilgandan keyin qo'shiladi.",

    // Features
    featuresTitle: "Sotish nuqtasining birinchi relizida kerak bo'lgan hamma narsa",
    featPosTitle: "Kassa va sotish",
    featPosDesc: "Skaner / kamera, tez tovar qidirish, chegirmalar, qaytarish, kechiktirilgan chek",
    featCatalogTitle: "Katalog va ombor",
    featCatalogDesc: "SKU, kategoriyalar, brendlar, dona va vaznli tovarlar, qoldiqlar va yechib olish",
    featQRTitle: "QR va to'lovlar",
    featQRDesc: "Static / dynamic QR, naqd pul, terminal, qarz, aralash to'lovlar",
    featFiscalTitle: "Fiskalizatsiya va chek",
    featFiscalDesc: "Elektron chek, chop etish ixtiyoriy, Telegramga chek yetkazib berish",
    featRolesTitle: "Rollar va nazorat",
    featRolesDesc: "Egasi, kassir, bir nechta nuqtalar, xodimlar harakatlarini nazorat qilish",
    featReportsTitle: "Hisobotlar",
    featReportsDesc: "Kun / hafta / oy, top-tovarlar, o'rtacha chek, qaytarishlar, kassirlar",

    // Offline
    offlineTitle: "Noaniq internetda ham ishlaydi",
    offlineText: "Sotish zaif aloqa tufayli to'xtamasligi kerak. Ipak Savdo offline-first mantiq bilan loyihalanmoqda: kassir ishda davom etadi, ma'lumotlar internet tiklangandan keyin sinxronlanadi.",
    offlineBullet1: "Zaif aloqada sotish davom etadi",
    offlineBullet2: "Ma'lumotlar mahalliy saqlanadi",
    offlineBullet3: "Internet tiklangandan keyin sinxronlash",
    offlineBullet4: "Pik soatlarida kassani to'xtatish xavfini kamaytirish",
    offlineNote: "Offline-first mantiq MVP arxitekturasiga qo'yilgan.",

    // App Screens
    screensTitle: "Smartfon, planshet va kassa to'plami bilan ishlaydi",
    screensHardware: "Oqimli nuqtalar uchun planshet, 2D Bluetooth-skaner, chek printeri va o'rnatgich ishlatilishi mumkin.",
    screensStart: "Faqat smartfondan boshlash mumkin. Jihozlar o'sish bilan ulanadi.",

    // Segments
    segmentsTitle: "Ipak Savdo qaysi biznes uchun mos",
    segConvenience: "Uy yonidagi do'konlar",
    segMinimarket: "Minimarketlar",
    segCafe: "Kafelar va oshxona",
    segPharmacy: "Dorixonalar",
    segClothing: "Kiyim va butiklar",
    segService: "Xizmat ko'rsatish nuqtalari",

    // Benefits
    benefitsTitle: "Biznes egasi nima oladi",
    ben1: "Kassada tezroq sotish",
    ben2: "Kamroq qo'lda hisob-kitob",
    ben3: "Qoldiqlar va top-tovarlar ko'rinadi",
    ben4: "QR orqali to'lov qabul qilish osonroq",
    ben5: "Elektron chek va fiskalizatsiya",
    ben6: "Xodimlar va nuqtalarni nazorat qilish",
    ben7: "Qo'lda Excel emas, qarorlar uchun hisobotlar",
    benSummary: "Asosiy: egasi sotish, pul va omborni bitta joyda ko'radi.",

    // Roadmap
    roadmapTitle: "Kichik biznes uchun fintex yondashuvi",
    roadmapText: "Ipak Savdo biznesning kundalik operatsion ishi atrofida yaratilmoqda. Avval — oddiy kassa va ombor. Keyin — marketing, loyalty, B2B-xaridlar va moliyaviy mahsulotlar.",
    roadmapNow: "Hozir",
    roadmapNowDesc: "Kassa, ombor, QR, chek, hisobotlar",
    roadmapSoon: "Tez orada",
    roadmapSoonDesc: "Telegram-marketing, aksiyalar, loyalty",
    roadmapLater: "Keyinroq",
    roadmapLaterDesc: "Ichki bank, B2B-xaridlar, limitlar, faktoring, BNPL",

    // Launch Offer
    launchTitle: "Og'ir ERP va katta xarajatlarsiz boshlash",
    launchText: "Birinchi mijozlar uchun erta kirish va imtiyozli davr rejalashtirilmoqda. Aniq ulanish shartlari pilot ishga tushirilganda mavjud bo'ladi.",
    launchCta: "Erta kirish uchun ariza qoldirish",

    // How to Start
    howToStartTitle: "Ishni qanday boshlash",
    step1Title: "Ariza qoldiring",
    step1Desc: "Telefon raqami, shahar va biznes turini ko'rsating.",
    step2Title: "Ilovaga kirish oling",
    step2Desc: "Ulanishdan keyin Ipak Savdo ilovasini Play Marketdan yuklab oling.",
    step3Title: "Sotishni boshlang",
    step3Desc: "Tovarlar qo'shing, QR ulang va sotishni boshlang.",

    // Lead Form
    formName: "Ism",
    formPhone: "Telefon",
    formBusinessType: "Biznes turi",
    formBusiness: "Biznes turi",
    formOptional: "Qo'shimcha maydonlarni ko'rsatish",
    formTelegram: "Telegram username",
    formCity: "Shahar / viloyat",
    formPoints: "Savdo nuqtalari soni",
    formComment: "Izoh",
    formSubmit: "Ariza yuborish",
    formSuccess: "Ariza qabul qilindi. Ipak Savdo jamoasi siz bilan bog'lanadi.",
    formBusinessName: "Biznes nomi",
    formNeedsEquipment: "Jihoz kerak (kassa, printer, skaner)",
    formBusinessTypeOther: "Biznes turini aniqlang",
    formSubmitError: "Yuborib bo'lmadi. Yana urinib ko'ring yoki bizga Telegramda yozing.",
    formRateLimited: "Bitta qurilmadan juda ko'p so'rov. 10 daqiqadan keyin urinib ko'ring.",
    formValidationError: "Maydonlarni tekshiring va yana urinib ko'ring.",
    // Order matches BUSINESS_TYPE_VALUES in components/LeadForm.tsx — DO NOT REORDER
    businessTypes: ["Do'kon", "Kafe", "Restoran", "Bozor", "Go'zallik", "Xizmat", "Boshqa"] as const,
    success: "Ariza qabul qilindi. Ipak Savdo jamoasi siz bilan bog'lanadi.",
    submit: "Ariza yuborish",
    optional: "Qo'shimcha maydonlarni ko'rsatish",

    // FAQ
    faqTitle: "Tez-tez so'raladigan savollar",
    faq1Q: "Kompyuter sotib olish kerakmi?",
    faq1A: "Yo'q. Ipak Savdo mobile-first yechim sifatida yaratilmoqda. Smartfon yoki planshet bilan ishlamoq mumkin.",
    faq2Q: "Skaner ishlatish mumkinmi?",
    faq2A: "Ha. Tez sotish uchun 2D Bluetooth-skaner ulash mumkin.",
    faq3Q: "QR-to'lov bo'ladimi?",
    faq3A: "Ha. Asosiy scenariylardan biri — sotish vaqtida to'g'ridan-to'g'ri QR-to'lov.",
    faq4Q: "Sotishdan keyin ombor bilan nima bo'ladi?",
    faq4A: "Tovar qoldig'i sotishdan keyin avtomatik yangilanadi.",
    faq5Q: "Chekni mijozga yuborish mumkinmi?",
    faq5A: "Ha. Elektron chekni Telegramga yuborish mumkin. Chek chop etish ixtiyoriy qo'shilishi mumkin.",
    faq6Q: "Play Marketda ilova bormi?",
    faq6A: "Ilova nashr etishga tayyorlanmoqda va Play Marketda mavjud bo'ladi.",
    faq7Q: "Mahsulot kim uchun mos emas?",
    faq7A: "Boshlang'ichda murakkab ERP jarayoni bo'lgan yirik kompaniyalar uchun individual joriy etish yaxshiroq. Ipak Savdo avvalo mikro va kichik biznesga qaratilgan.",

    // Footer
    footerTagline: "Kichik biznes uchun kassa, ombor va QR-to'lov",
    footerContact: "Ulanish uchun saytda ariza qoldiring.",
    footerNavFeatures: "Imkoniyatlar",
    footerNavHowItWorks: "Qanday ishlaydi",
    footerNavForWhom: "Kim uchun",
    footerNavFAQ: "FAQ",

    // Cookie
    cookieText: "Sayt tahlili va ishlashini yaxshilash uchun cookies ishlatamiz.",
    cookieAccept: "Qabul qilish",
    cookieLater: "Keyinroq sozlash",

    // Modal
    modalTitle: "Ariza qoldirish",
    modalClose: "Yopish",

    // Common
    soonInPlayMarket: "Tez orada Play Marketda",
    downloadPlayMarket: "Play Marketdan yuklab olish",
    earlyAccess: "Erta kirish uchun ariza qoldirish",
    getConsultation: "Maslahat olish",
  }
};

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}

export type Dict = ReturnType<typeof getDictionary>;
