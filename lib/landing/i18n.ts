/* ────────────────────────────────────────────────────────────
   BirLiy landing i18n dictionary.
   Both dicts MUST stay structurally identical (typeof ru === typeof uz).
   TypeScript enforces this via `const uz: typeof ru = {...}`.
   New keys added for v2 sections are unused by the current UI —
   they will be consumed as v2 section components are built.
   ──────────────────────────────────────────────────────────── */

const ru = {
  nav: ["Возможности", "Оборудование", "FAQ"],
  cta: "Оставить заявку",
  title: "Ваш бизнес. В одном месте.",
  subtitle:
    "BirLiy собирает кассу, склад и оплаты в одну спокойную поверхность. Без вкладок, без переключений — одна рабочая среда на смартфоне или планшете.",
  telegram: "Написать в Telegram",
  demo: "Смотреть демо",
  trust: "Магазины у дома, минимаркеты, кафе, аптеки, сервисные точки.",
  badges: [
    "QR-оплата в момент продажи",
    "Остатки обновляются автоматически",
    "Работа при слабом интернете",
    "Отчёты по выручке и кассирам",
  ],
  ecosystemBadge: "Рабочая среда для бизнеса",

  problemTitle: "Знакомые проблемы?",
  problems: [
    ["Блокнот вместо учёта", "Товары записываются в тетрадь, остатки теряются, пересчёт занимает часы."],
    ["Деньги мимо кассы", "Без чёткого учёта сложно понять, сколько реально заработал за день."],
    ["Клиент уходит без сдачи", "Нет терминала, нет QR — покупатель уходит в соседний магазин."],
    ["Нет времени разбираться", "Сложные программы требуют обучения, настройки и компьютера."],
  ],

  segmentsTitle: "Для кого BirLiy",
  segments: [
    ["Магазины у дома", "Продукты, бытовая химия, повседневные товары."],
    ["Минимаркеты", "Сотни позиций, несколько кассиров, контроль остатков."],
    ["Кафе и точки питания", "Быстрый заказ, оплата по QR, чек в Telegram."],
    ["Аптеки", "Точный учёт по наименованиям, контроль сроков."],
    ["Сервисные точки", "Ремонт, химчистка, ателье — приём оплаты и учёт заказов."],
  ],

  benefitsTitle: "Почему BirLiy",
  benefits: [
    ["Начните за пять минут", "Скачайте приложение, добавьте товары — и продавайте. Без установок и оборудования."],
    ["Всё в одной поверхности", "Касса, склад, QR-оплата, чеки и отчёты — без вкладок и переключений."],
    ["Понятно без обучения", "Интерфейс собран для тех, кто никогда не работал с кассовыми программами."],
    ["Спокойный фон для шумной работы", "Меньше частей — больше ясности. Поверхность не отвлекает кассира от покупателя."],
  ],

  featuresTitle: "Что делает BirLiy",
  features: [
    ["Касса и продажи", "Сканер или камера, быстрый поиск, скидки, возврат, отложенный чек."],
    ["Каталог и склад", "Товары, категории, штучные и весовые позиции, остатки и списания."],
    ["QR-оплата", "Покупатель сканирует QR — оплата поступает мгновенно. Наличные, карта или QR."],
    ["Электронный чек", "Чек уходит покупателю в Telegram. Печать можно подключить отдельно."],
    ["Программа лояльности", "Бонусы, скидки и акции для постоянных покупателей."],
    ["Отчёты", "Выручка за день, средний чек, топ-товары, работа кассиров."],
  ],

  workflowTitle: "Как проходит продажа",
  workflowSteps: ["Сканирование", "Корзина", "QR-оплата", "Подтверждение", "Чек", "Склад обновлён"],

  qrCardTitle: "QR-оплата",
  qrCardLabel: "Пример QR-кода",
  qrCardHint: "Покупатель сканирует — оплата поступает мгновенно",

  miniPreviews: [
    ["Сканер", "быстрый поиск"],
    ["Остатки", "18 шт"],
    ["Чек", "Telegram"],
    ["Доступ", "владелец / кассир"],
    ["Выручка", "3 450 000 сум"],
  ],

  offlineTitle: "Интернет пропал? Касса работает",
  offlineText:
    "Кассир продолжает пробивать товары. Когда связь восстановится, всё синхронизируется автоматически.",
  offlineBadge: "Работа при слабом интернете",
  offlineSteps: ["Продажа сохранена локально", "Интернет восстановился", "Данные синхронизированы"],

  equipmentTitle: "Два формата под ваш бизнес",
  equipFullTitle: "Продуктовый магазин",
  equipFullDesc: "Планшет, сканер штрих-кодов и термопринтер чеков. Полный контроль склада и быстрый поток покупателей.",
  equipFullItems: ["Планшет", "Сканер штрих-кодов", "Термопринтер чеков"],
  equipLiteTitle: "Магазин одежды и другие",
  equipLiteDesc: "Приложение на Android или iOS — всё, что нужно. Простой учёт, QR-оплата и чек в Telegram прямо с телефона.",
  equipLiteItems: ["Android-приложение", "iOS-приложение", "Без доп. оборудования"],

  roadmapTitle: "Что дальше",
  roadmap: [
    ["Сейчас", "Касса, склад, QR-оплата, электронный чек, отчёты, Telegram-бот."],
    ["Q3 2026", "Программа лояльности, акции и скидки клиентам, расширенный Telegram-marketing."],
    ["Q4 2026", "Подключение к банковским сервисам Ipak Yuli внутри приложения."],
    ["2027", "B2B-маркетплейс закупок у поставщиков + лимиты, факторинг, BNPL."],
  ],

  formTitle: "Оставьте заявку",
  formIntro: "Расскажем, как BirLiy подходит под ваш формат. Без обзвонов и навязчивости.",
  success: "Заявка принята. Команда BirLiy свяжется с вами.",
  formName: "Имя",
  formPhone: "Телефон",
  formBusiness: "Тип бизнеса",
  formBusinessName: "Название бизнеса",
  formNeedsEquipment: "Нужно оборудование (касса, сканер)",
  formBusinessTypeOther: "Уточните вид бизнеса",
  formSubmitError: "Не удалось отправить. Попробуйте ещё раз или напишите нам в Telegram.",
  formRateLimited: "Слишком много заявок с одного устройства. Попробуйте через 10 минут.",
  formValidationError: "Проверьте поля и попробуйте ещё раз.",
  // Order matches BUSINESS_TYPE_VALUES in components/LeadForm.tsx — DO NOT REORDER
  businessTypes: [
    "Магазин",
    "Кафе",
    "Ресторан",
    "Рынок / точка",
    "Салон красоты",
    "Сервис",
    "Другое",
  ],
  formComment: "Комментарий",
  optional: "Показать дополнительные поля",
  submit: "Отправить заявку",

  faqTitle: "Вопросы и ответы",
  faq: [
    ["Нужно ли покупать компьютер?", "Нет. Достаточно смартфона или планшета."],
    ["Можно ли подключить сканер?", "Да. Подойдёт любой 2D Bluetooth-сканер."],
    ["Как работает QR-оплата?", "Покупатель сканирует QR-код на экране — деньги поступают на счёт мгновенно."],
    ["Что происходит со складом после продажи?", "Остаток обновляется автоматически после каждой продажи."],
    ["Приложение работает без интернета?", "Да. Продажи сохраняются и синхронизируются, когда связь вернётся."],
    ["Можно ли импортировать товары?", "Да, из Excel. Также в продукте уже доступна база 9 000+ распространённых SKU — многие товары находятся сразу."],
    ["Сколько кассиров можно завести?", "На периоде раннего доступа — без ограничений. Роли: Владелец / Кассир / Суперадмин. Каждый кассир заходит по PIN."],
    ["Что насчёт безопасности?", "Данные хранятся в инфраструктуре Ipak Yuli Bank. Доступ — по PIN, с разделением ролей. Все действия попадают в полный журнал событий."],
    ["Можно ли работать на нескольких точках?", "Да. Сводные отчёты и кросс-точечный контроль кассиров доступны для бизнесов с несколькими точками."],
  ],

  voiceTitle: "Меньше частей. Больше ясности.",
  voiceBody:
    "BirLiy собирает разрозненную работу — продажи, склад, оплаты — в одну спокойную поверхность. Касса не борется со складом. Склад не борется с отчётами. Всё движется в одном направлении: вперёд.",

  cookie: "Мы используем cookies для аналитики и улучшения работы сайта.",
  accept: "Принять",
  later: "Позже",

  heroOnline: "Онлайн",
  heroRevenue: "Выручка за день",
  heroAvgCheck: "Средний чек",
  heroSales: "Продаж",
  heroRevenueVal: "3 450 000",
  heroAvgCheckVal: "87 000",
  heroSalesVal: "42",
  heroCurrency: "сум",
  heroSaleTitle: "Продажа",
  heroItems: ["Молоко 1л", "Хлеб", "Кофе 3в1"],
  heroItemPrice: "14 000",
  heroTotal: "Итого",
  heroTotalVal: "20 500 сум",
  heroReceiptSent: "Чек отправлен",
  heroReceiptDetail: "Telegram · 20 500 сум",
  heroLast: "Последняя продажа",
  heroLastTime: "минуту назад",
  heroLive: "сейчас",

  productCaption: "BirLiy — спокойная рабочая поверхность. Один экран на всё.",
  footerTagline: "Ваш бизнес. В одном месте.",
  footerSmall: "© 2026 BirLiy. Продукт Ipak Yuli Bank.",

  demoTitle: "Как работает BirLiy",
  demoSteps: [
    ["Сканирование товара", "Наведите камеру или используйте сканер — товар добавляется в чек."],
    ["Формирование корзины", "Все товары в одном списке. Меняйте количество, добавляйте скидку."],
    ["QR-оплата", "На экране появляется QR-код. Покупатель сканирует — оплата проходит мгновенно."],
    ["Подтверждение оплаты", "Деньги поступили на счёт. Кассир видит подтверждение."],
    ["Отправка чека", "Электронный чек уходит покупателю в Telegram. Можно напечатать."],
    ["Обновление склада", "Остатки пересчитаны автоматически. Владелец видит дашборд."],
  ],
  demoClose: "Закрыть",

  // ── v2 keys (unused by current UI; consumed by v2 section components) ──

  trustStrip: {
    bank: "Продукт Ipak Yuli Bank",
    catalogSize: "9 000+ товаров в базе",
    pilot: "Ранний доступ 2026",
  },

  pain: {
    eyebrow: "01 / Знакомо?",
    headline: "Касса отдельно. Склад отдельно. Банк отдельно. Вы — нигде вместе.",
    body: "Кассир пробивает чек на одном устройстве. Остатки ведутся в тетради. Платежи приходят на терминал банка. Чтобы понять, сколько вы заработали сегодня — нужно сесть в офисе вечером и сводить три источника. К ночи вы устаёте и решаете «потом». Так месяц превращается в загадку.",
  },

  howItWorks: {
    eyebrow: "02 / Как проходит продажа",
    headline: "Продажа за 15 секунд",
    intro: "Один экран. Шесть шагов. От сканирования товара до электронного чека покупателю — без переключений между приложениями.",
    steps: [
      { num: "01", label: "Скан товара", caption: "Камера или сканер — товар добавляется в чек." },
      { num: "02", label: "Корзина", caption: "Все позиции в одном списке. Меняйте количество, добавляйте скидку." },
      { num: "03", label: "К оплате", caption: "Выберите способ: наличные, терминал, QR или в долг." },
      { num: "04", label: "Оплата", caption: "QR на экране — покупатель сканирует, оплата проходит мгновенно." },
      { num: "05", label: "Подтверждение", caption: "Кассир видит подтверждение. Деньги на счёте." },
      { num: "06", label: "Чек в Telegram", caption: "Электронный чек уходит покупателю. Склад обновлён." },
    ],
  },

  capabilities: {
    eyebrow: "03 / Что внутри",
    headline: "Шесть инструментов вместо шести приложений",
    cards: [
      {
        title: "Многоканальная оплата",
        body: "4 способа: наличные, терминал, QR, в долг. Калькулятор сдачи.",
        metric: "Одна страница оплаты — четыре кнопки",
      },
      {
        title: "Касса дня",
        body: "Смена в реальном времени: ожидаемая сумма, разбивка по способам, журнал движений.",
        metric: "Сколько денег в кассе прямо сейчас",
      },
      {
        title: "Каталог + склад",
        body: "9 000+ товаров в базе. Штрих-коды, ИКПУ, импорт из Excel, приём по сканеру.",
        metric: "Не заводить вручную",
      },
      {
        title: "Отчёты с дельтой",
        body: "Показатели с изменением к прошлому периоду, почасовой график, топ-товары, по кассирам.",
        metric: "День, неделя, месяц — за один взгляд",
      },
      {
        title: "Оборачиваемость",
        body: "Быстрые / медленные / мёртвые товары за 7/30/90 дней.",
        metric: "Что заказать, что списать",
      },
      {
        title: "Telegram уведомления",
        body: "Бот шлёт каждую продажу в Telegram. Команды /today, /last 10.",
        metric: "Бизнес в кармане, без захода в приложение",
      },
    ],
  },

  owner: {
    eyebrow: "04 / Для собственника",
    headline: "Вы видите всё. С телефона. В любой момент.",
    body: "Касса работает в магазине. Вы — в любом месте. Отчёт за сегодня, остатки на складе, кто из кассиров когда вошёл в смену, последние 10 продаж — всё под рукой, без звонков и пересылок.",
    bullets: [
      "Реальная выручка с дельтой ±%",
      "Журнал смен и кассиров",
      "Журнал всех действий: что продано, что списано, что возвращено",
    ],
  },

  segmentsV2: {
    eyebrow: "05 / Для какого бизнеса",
    headline: "Магазинам у дома. Минимаркетам. Кафе. Аптекам.",
    cards: [
      {
        title: "Магазин у дома",
        body: "Продукты, бытовая химия, ежедневные товары. 1 кассир, до 200 чеков в день.",
      },
      {
        title: "Минимаркет",
        body: "Сотни позиций, несколько кассиров, контроль остатков и кассиров.",
      },
      {
        title: "Кафе и точка питания",
        body: "Быстрый чек, оплата по QR, чек в Telegram. Без печатной техники.",
      },
      {
        title: "Аптека",
        body: "Точный учёт по наименованиям, контроль сроков.",
      },
      {
        title: "Сервисная точка",
        body: "Ремонт, химчистка, ателье. Приём оплаты и журнал заказов.",
      },
    ],
  },

  freemium: {
    eyebrow: "07 / Цена",
    headline: "Бесплатно 6 месяцев. Без условий.",
    body: "BirLiy сейчас в этапе раннего доступа. Первая когорта пилотных клиентов получает полный функционал бесплатно — на 6 месяцев. Никаких ограничений по числу чеков, товаров или операций. Платные тарифы появятся после периода раннего доступа — когда мы будем уверены, что продукт точно решает вашу задачу.",
    bullets: [
      {
        title: "6 месяцев",
        caption: "Без оплаты, без скрытых условий",
      },
      {
        title: "Полный функционал",
        caption: "Касса, склад, QR-оплата, отчёты, Telegram-бот — без урезанных «free» режимов",
      },
      {
        title: "Без обязательств",
        caption: "Не подойдёт — уходите. Подойдёт — обсуждаем тариф вместе после периода",
      },
    ],
    cta: "Получить ранний доступ",
  },

  earlyAccess: {
    eyebrow: "09 / Ранний доступ",
    headline: "Мы запускаемся с первой когортой пилотов",
    body: "BirLiy сейчас работает в первых пилотных магазинах Ташкента. Подключение занимает один день: установка приложения, импорт каталога, первое обучение кассира — мы делаем всё это с вами. 6 месяцев без оплаты. Если вы хотите быть в первой когорте — оставьте заявку.",
    promises: [
      {
        title: "Подключаем за один день",
        caption: "Установка, настройка, первый чек — за одну встречу с нашим менеджером",
      },
      {
        title: "Помогаем заполнить каталог",
        caption: "Загружаем ваши товары из Excel или вместе вносим первые 100 SKU",
      },
      {
        title: "6 месяцев без оплаты",
        caption: "Чтобы вы успели проверить, подходит ли BirLiy вашему бизнесу — без давления",
      },
    ],
  },

  footerV2: {
    columns: [
      {
        title: "Продукт",
        links: [
          { label: "Возможности", href: "#capabilities" },
          { label: "Как работает", href: "#how-it-works" },
          { label: "Для собственника", href: "#owner" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Бизнесу",
        links: [
          { label: "Магазины у дома", href: "#segments" },
          { label: "Минимаркеты", href: "#segments" },
          { label: "Кафе", href: "#segments" },
          { label: "Аптеки", href: "#segments" },
          { label: "Сервис", href: "#segments" },
        ],
      },
      {
        title: "Подключение",
        links: [
          { label: "Ранний доступ", href: "#lead" },
          { label: "Оборудование", href: "#equipment" },
          { label: "Цена", href: "#freemium" },
        ],
      },
      {
        title: "Контакт",
        links: [],
      },
    ],
    phone: "+998 97 421 24 54",
    copyright: "© 2026 BirLiy. Продукт Ipak Yuli Bank.",
    tagline: "Ваш бизнес. В одном месте.",
  },

  heroV2: {
    secondaryCta: "Посмотреть как работает",
    trustLine: "Продукт Ipak Yuli Bank · Ранний доступ 2026",
  },
};

const uz: typeof ru = {
  nav: ["Imkoniyatlar", "Jihozlar", "FAQ"],
  cta: "Ariza qoldirish",
  title: "Sizning biznesingiz. Bitta joyda.",
  subtitle:
    "BirLiy kassa, ombor va to'lovlarni bitta tinch sirtga yig'adi. Varaqlar va o'tishlarsiz — bitta ish muhiti smartfon yoki planshetda.",
  telegram: "Telegram orqali yozish",
  demo: "Demoni ko'rish",
  trust: "Uy yonidagi do'konlar, minimarketlar, kafelar, dorixonalar va xizmat nuqtalari.",
  badges: [
    "Sotuv paytida QR-to'lov",
    "Qoldiqlar avtomatik yangilanadi",
    "Zaif internetda ishlaydi",
    "Tushum va kassirlar bo'yicha hisobotlar",
  ],
  ecosystemBadge: "Biznes uchun ish muhiti",

  problemTitle: "Tanish muammolar?",
  problems: [
    ["Daftar o'rniga hisob", "Tovarlar daftarga yoziladi, qoldiqlar yo'qoladi, qayta hisoblash soatlab davom etadi."],
    ["Pul kassadan chetda", "Aniq hisobsiz kunlik daromadni bilish qiyin."],
    ["Mijoz qaytib ketadi", "Terminal yo'q, QR yo'q — xaridor qo'shni do'konga ketadi."],
    ["Tushunish qiyin", "Murakkab dasturlar o'rganish, sozlash va kompyuter talab qiladi."],
  ],

  segmentsTitle: "BirLiy kim uchun",
  segments: [
    ["Uy yonidagi do'konlar", "Oziq-ovqat, maishiy kimyo, kundalik tovarlar."],
    ["Minimarketlar", "Yuzlab tovar, bir necha kassir, qoldiq nazorati."],
    ["Kafelar va ovqatlanish", "Tez buyurtma, QR orqali to'lov, Telegram chek."],
    ["Dorixonalar", "Nomlar bo'yicha aniq hisob, muddat nazorati."],
    ["Xizmat nuqtalari", "Ta'mirlash, kimyoviy tozalash, tikuvchilik — to'lov va buyurtma hisobi."],
  ],

  benefitsTitle: "Nima uchun BirLiy",
  benefits: [
    ["Besh daqiqada boshlang", "Ilovani yuklab oling, tovarlarni qo'shing — va soting. O'rnatish va jihozlarsiz."],
    ["Hammasi bitta sirtda", "Kassa, ombor, QR-to'lov, cheklar va hisobotlar — varaqlarsiz va o'tishlarsiz."],
    ["O'rganishsiz tushunarli", "Interfeys kassa dasturlari bilan hech qachon ishlamagan kishilar uchun."],
    ["Shovqinli ish uchun tinch sirt", "Kamroq qism — ko'proq aniqlik. Sirt kassirni xaridordan chalg'itmaydi."],
  ],

  featuresTitle: "BirLiy nima qiladi",
  features: [
    ["Kassa va sotuvlar", "Skaner yoki kamera, tez qidirish, chegirmalar, qaytarish, kechiktirilgan chek."],
    ["Katalog va ombor", "Tovarlar, kategoriyalar, donali va vaznli pozitsiyalar, qoldiqlar va hisobdan chiqarish."],
    ["QR-to'lov", "Xaridor QR-kodni skanerlaydi — to'lov bir zumda tushadi. Naqd, karta yoki QR."],
    ["Elektron chek", "Chek xaridorga Telegramga yuboriladi. Bosib chiqarishni alohida ulash mumkin."],
    ["Sodiqlik dasturi", "Doimiy xaridorlar uchun bonuslar, chegirmalar va aksiyalar."],
    ["Hisobotlar", "Kunlik tushum, o'rtacha chek, top-tovarlar, kassirlar ishi."],
  ],

  workflowTitle: "Sotuv qanday o'tadi",
  workflowSteps: ["Skanerlash", "Savat", "QR-to'lov", "Tasdiqlash", "Chek", "Ombor yangilandi"],

  qrCardTitle: "QR-to'lov",
  qrCardLabel: "QR-kod namunasi",
  qrCardHint: "Xaridor skanerlaydi — to'lov bir zumda tushadi",

  miniPreviews: [
    ["Skaner", "tez qidirish"],
    ["Qoldiq", "18 dona"],
    ["Chek", "Telegram"],
    ["Kirish", "egasi / kassir"],
    ["Tushum", "3 450 000 so'm"],
  ],

  offlineTitle: "Internet uzildi? Kassa ishlaydi",
  offlineText:
    "Kassir tovarlarni sotishda davom etadi. Aloqa tiklanganda hammasi avtomatik sinxronlanadi.",
  offlineBadge: "Zaif internetda ishlash",
  offlineSteps: ["Sotuv lokal saqlandi", "Internet tiklandi", "Ma'lumotlar sinxronlandi"],

  equipmentTitle: "Biznesingizga mos ikki format",
  equipFullTitle: "Oziq-ovqat do'koni",
  equipFullDesc: "Planshet, shtrix-kod skaneri va termoprinter. Omborni to'liq nazorat va tez xaridor oqimi.",
  equipFullItems: ["Planshet", "Shtrix-kod skaneri", "Termoprinter"],
  equipLiteTitle: "Kiyim do'koni va boshqalar",
  equipLiteDesc: "Android yoki iOS ilovasi — kerakli hamma narsa. Oddiy hisob, QR-to'lov va Telegram chek to'g'ridan-to'g'ri telefondan.",
  equipLiteItems: ["Android-ilova", "iOS-ilova", "Qo'shimcha jihozlarsiz"],

  roadmapTitle: "Keyin nima",
  roadmap: [
    ["Hozir", "Kassa, ombor, QR-to'lov, elektron chek, hisobotlar, Telegram-bot."],
    ["Q3 2026", "Sodiqlik dasturi, mijozlarga aksiyalar va chegirmalar, kengaytirilgan Telegram-marketing."],
    ["Q4 2026", "Ilova ichida Ipak Yuli bank xizmatlariga ulanish."],
    ["2027", "Yetkazib beruvchilardan B2B-marketplace + limitlar, faktoring, BNPL."],
  ],

  formTitle: "Ariza qoldiring",
  formIntro: "BirLiy formatingizga qanday mos kelishini aytib beramiz. Qo'ng'iroq va bezovta qilishlarsiz.",
  success: "Ariza qabul qilindi. BirLiy jamoasi siz bilan bog'lanadi.",
  formName: "Ism",
  formPhone: "Telefon",
  formBusiness: "Biznes turi",
  formBusinessName: "Biznes nomi",
  formNeedsEquipment: "Jihoz kerak (kassa, skaner)",
  formBusinessTypeOther: "Biznes turini aniqlang",
  formSubmitError: "Yuborib bo'lmadi. Yana urinib ko'ring yoki bizga Telegramda yozing.",
  formRateLimited: "Bitta qurilmadan juda ko'p so'rov. 10 daqiqadan keyin urinib ko'ring.",
  formValidationError: "Maydonlarni tekshiring va yana urinib ko'ring.",
  // Order matches BUSINESS_TYPE_VALUES in components/LeadForm.tsx — DO NOT REORDER
  businessTypes: [
    "Do'kon",
    "Kafe",
    "Restoran",
    "Bozor",
    "Go'zallik saloni",
    "Xizmat",
    "Boshqa",
  ],
  formComment: "Izoh",
  optional: "Qo'shimcha maydonlarni ko'rsatish",
  submit: "Ariza yuborish",

  faqTitle: "Savol va javoblar",
  faq: [
    ["Kompyuter sotib olish kerakmi?", "Yo'q. Smartfon yoki planshet yetarli."],
    ["Skaner ulash mumkinmi?", "Ha. Har qanday 2D Bluetooth-skaner mos keladi."],
    ["QR-to'lov qanday ishlaydi?", "Xaridor ekrandagi QR-kodni skanerlaydi — pul hisobga bir zumda tushadi."],
    ["Sotuvdan keyin omborga nima bo'ladi?", "Tovar qoldig'i har bir sotuvdan keyin avtomatik yangilanadi."],
    ["Ilova internetsiz ishlaydi?", "Ha. Sotuvlar saqlanadi va aloqa tiklanganda sinxronlanadi."],
    ["Tovarlarni import qilish mumkinmi?", "Ha, Excel orqali. Bundan tashqari mahsulotda 9 000+ keng tarqalgan SKU bazasi mavjud — ko'p tovarlar darhol topiladi."],
    ["Nechta kassir yaratish mumkin?", "Erta kirish davrida cheklov yo'q. Rollar: Egasi / Kassir / Superadmin. Har bir kassir PIN bilan kiradi."],
    ["Xavfsizlik qanday?", "Ma'lumotlar Ipak Yuli Bank infratuzilmasida saqlanadi. Kirish — PIN orqali, rollar ajratilgan. Barcha harakatlar to'liq voqealar jurnaliga tushadi."],
    ["Bir necha nuqtada ishlash mumkinmi?", "Ha. Bir nechta nuqtaga ega bizneslar uchun yig'ma hisobotlar va kassirlarni nuqtalararo nazorat qilish mavjud."],
  ],

  voiceTitle: "Kamroq qism. Ko'proq aniqlik.",
  voiceBody:
    "BirLiy tarqoq ishni — sotuvlar, ombor, to'lovlar — bitta tinch sirtga yig'adi. Kassa ombor bilan kurashmaydi. Ombor hisobotlar bilan kurashmaydi. Hammasi bir yo'nalishda: oldinga.",

  cookie: "Sayt tahlili va ishlashini yaxshilash uchun cookies ishlatamiz.",
  accept: "Qabul qilish",
  later: "Keyinroq",

  heroOnline: "Onlayn",
  heroRevenue: "Kunlik tushum",
  heroAvgCheck: "O'rtacha chek",
  heroSales: "Sotuvlar",
  heroRevenueVal: "3 450 000",
  heroAvgCheckVal: "87 000",
  heroSalesVal: "42",
  heroCurrency: "so'm",
  heroSaleTitle: "Sotuv",
  heroItems: ["Sut 1l", "Non", "Kofe 3in1"],
  heroItemPrice: "14 000",
  heroTotal: "Jami",
  heroTotalVal: "20 500 so'm",
  heroReceiptSent: "Chek yuborildi",
  heroReceiptDetail: "Telegram · 20 500 so'm",
  heroLast: "Oxirgi sotuv",
  heroLastTime: "bir daqiqa oldin",
  heroLive: "hozir",

  productCaption: "BirLiy — tinch ish sirti. Bitta ekran hamma narsa uchun.",
  footerTagline: "Sizning biznesingiz. Bitta joyda.",
  footerSmall: "© 2026 BirLiy. Ipak Yuli Bank mahsuloti.",

  demoTitle: "BirLiy qanday ishlaydi",
  demoSteps: [
    ["Tovarni skanerlash", "Kamerani yo'naltiring yoki skaner ishlating — tovar chekka qo'shiladi."],
    ["Savatni shakllantirish", "Barcha tovarlar bitta ro'yxatda. Miqdorni o'zgartirish, chegirma qo'shish mumkin."],
    ["QR-to'lov", "Ekranda QR-kod paydo bo'ladi. Xaridor skanerlaydi — to'lov bir zumda o'tadi."],
    ["To'lov tasdiqlandi", "Pul hisobga tushdi. Kassir ekranda tasdiqlashni ko'radi."],
    ["Chek yuborish", "Elektron chek xaridorga Telegramga yuboriladi. Bosib chiqarish mumkin."],
    ["Ombor yangilandi", "Qoldiqlar avtomatik qayta hisoblandi. Egasi dashbordda ko'radi."],
  ],
  demoClose: "Yopish",

  // ── v2 keys (unused by current UI; consumed by v2 section components) ──

  trustStrip: {
    bank: "Ipak Yuli Bank mahsuloti",
    catalogSize: "9 000+ tovar bazada",
    pilot: "Erta kirish 2026",
  },

  pain: {
    eyebrow: "01 / Tanish?",
    headline: "Kassa alohida. Ombor alohida. Bank alohida. Siz — hech qaerda birga.",
    body: "Kassir bir qurilmada chek uradi. Qoldiqlar daftarda olib boriladi. To'lovlar bank terminaliga tushadi. Bugun qancha topganingizni bilish uchun — kechqurun ofisga o'tirib, uchta manbani solishtirish kerak. Kechga borib charchasiz va «keyinroq» deb qo'yasiz. Shunday qilib, bir oy sir bo'lib qoladi.",
  },

  howItWorks: {
    eyebrow: "02 / Sotuv qanday o'tadi",
    headline: "15 soniyada sotuv",
    intro: "Bitta ekran. Olti qadam. Tovarni skanerlashdan xaridorga elektron chek yuborishgacha — ilovalar o'rtasida o'tishsiz.",
    steps: [
      { num: "01", label: "Tovarni skanerlash", caption: "Kamera yoki skaner — tovar chekka qo'shiladi." },
      { num: "02", label: "Savat", caption: "Barcha pozitsiyalar bitta ro'yxatda. Miqdorni o'zgartiring, chegirma qo'shing." },
      { num: "03", label: "To'lovga", caption: "Usulni tanlang: naqd, terminal, QR yoki qarzga." },
      { num: "04", label: "To'lov", caption: "Ekrandagi QR — xaridor skanerlaydi, to'lov bir zumda o'tadi." },
      { num: "05", label: "Tasdiqlash", caption: "Kassir tasdiqlashni ko'radi. Pul hisobda." },
      { num: "06", label: "Telegramda chek", caption: "Elektron chek xaridorga yuboriladi. Ombor yangilandi." },
    ],
  },

  capabilities: {
    eyebrow: "03 / Ichida nima bor",
    headline: "Olti dastur o'rniga olti asbob",
    cards: [
      {
        title: "Ko'p kanalli to'lov",
        body: "4 usul: naqd, terminal, QR, qarzga. Qaytim kalkulyatori.",
        metric: "Bir sahifada to'lov — to'rt tugma",
      },
      {
        title: "Kun kassasi",
        body: "Smenani real vaqtda kuzatish: kutilgan summa, usullar bo'yicha taqsimlash, harakatlar jurnali.",
        metric: "Hozir kassada qancha pul bor",
      },
      {
        title: "Katalog + ombor",
        body: "Bazada 9 000+ tovar. Shtrix-kodlar, IKPU, Exceldan import, skaner orqali qabul.",
        metric: "Qo'lda kiritmaslik",
      },
      {
        title: "Delta bilan hisobotlar",
        body: "O'tgan davr bilan solishtirma KPI, soatlik grafik, top-tovarlar, kassirlar bo'yicha.",
        metric: "Kun, hafta, oy — bir qarashda",
      },
      {
        title: "Aylanish",
        body: "7/30/90 kun uchun tez / sekin / o'lik tovarlar.",
        metric: "Nimani buyurtma qilish, nimani hisobdan chiqarish",
      },
      {
        title: "Telegram xabarnomalar",
        body: "Bot har bir sotuvni Telegramga yuboradi. /today, /last 10 buyruqlari.",
        metric: "Ilovaga kirmasdan biznes qo'lda",
      },
    ],
  },

  owner: {
    eyebrow: "04 / Egasi uchun",
    headline: "Siz hamma narsani ko'rasiz. Telefondan. Istalgan vaqtda.",
    body: "Kassa do'konda ishlaydi. Siz — istalgan joyda. Bugungi hisobot, omboridagi qoldiqlar, kassirlardan qaysi biri qachon smenaga kirgan, oxirgi 10 ta sotuv — barchasi qo'lingizda, qo'ng'iroq va jo'natmalarsiz.",
    bullets: [
      "Delta ±% bilan real tushum",
      "Smenalar va kassirlar jurnali",
      "Barcha harakatlar jurnali: nima sotildi, nima hisobdan chiqarildi, nima qaytarildi",
    ],
  },

  segmentsV2: {
    eyebrow: "05 / Qanday biznes uchun",
    headline: "Uy yonidagi do'konlar. Minimarketlar. Kafelar. Dorixonalar.",
    cards: [
      {
        title: "Uy yonidagi do'kon",
        body: "Oziq-ovqat, maishiy kimyo, kundalik tovarlar. 1 kassir, kuniga 200 tagacha chek.",
      },
      {
        title: "Minimarket",
        body: "Yuzlab pozitsiya, bir necha kassir, qoldiqlar va kassirlarni nazorat.",
      },
      {
        title: "Kafe va ovqatlanish nuqtasi",
        body: "Tez chek, QR orqali to'lov, Telegramda chek. Chop etish texnikasisiz.",
      },
      {
        title: "Dorixona",
        body: "Nomlar bo'yicha aniq hisob, muddatlarni nazorat.",
      },
      {
        title: "Xizmat nuqtasi",
        body: "Ta'mirlash, kimyoviy tozalash, tikuvchilik. To'lovni qabul qilish va buyurtmalar jurnali.",
      },
    ],
  },

  freemium: {
    eyebrow: "07 / Narx",
    headline: "6 oy bepul. Shartlarsiz.",
    body: "BirLiy hozir erta kirish bosqichida. Birinchi pilot mijozlar kogortalari to'liq funksionallikni bepul oladi — 6 oy davomida. Cheklar, tovarlar yoki operatsiyalar soni bo'yicha cheklov yo'q. Pullik tariflar erta kirish davridan keyin paydo bo'ladi — mahsulot sizning muammoingizni aniq hal qilishiga ishonch hosil qilganimizda.",
    bullets: [
      {
        title: "6 oy",
        caption: "To'lovsiz, yashirin shartlarsiz",
      },
      {
        title: "To'liq funksionallik",
        caption: "Kassa, ombor, QR-to'lov, hisobotlar, Telegram-bot — qisqartirilgan «free» rejimlarsiz",
      },
      {
        title: "Majburiyatlarsiz",
        caption: "Mos kelmasa — ketasiz. Mos kelsa — davrdan keyin birga tarif muhokama qilamiz",
      },
    ],
    cta: "Erta kirishga ariza berish",
  },

  earlyAccess: {
    eyebrow: "09 / Erta kirish",
    headline: "Biz birinchi pilot kogorta bilan ishga tushmoqdamiz",
    body: "BirLiy hozir Toshkentning birinchi pilot do'konlarida ishlayapti. Ulanish bir kun davom etadi: ilovani o'rnatish, katalogni import qilish, kassirni birinchi o'qitish — bularni biz siz bilan birgalikda qilamiz. 6 oy to'lovsiz. Birinchi kohortada bo'lishni istasangiz — ariza qoldiring.",
    promises: [
      {
        title: "Bir kunda ulaymiz",
        caption: "O'rnatish, sozlash, birinchi chek — menejerimiz bilan bitta uchrashuvda",
      },
      {
        title: "Katalogni to'ldirishga yordam beramiz",
        caption: "Tovarlaringizni Exceldan yuklaymiz yoki birgalikda birinchi 100 SKU kiritamiz",
      },
      {
        title: "6 oy to'lovsiz",
        caption: "BirLiy biznesingizga mos kelishini bosimisiz tekshirib ko'rishingiz uchun",
      },
    ],
  },

  footerV2: {
    columns: [
      {
        title: "Mahsulot",
        links: [
          { label: "Imkoniyatlar", href: "#capabilities" },
          { label: "Qanday ishlaydi", href: "#how-it-works" },
          { label: "Egasi uchun", href: "#owner" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Biznesga",
        links: [
          { label: "Uy yonidagi do'konlar", href: "#segments" },
          { label: "Minimarketlar", href: "#segments" },
          { label: "Kafelar", href: "#segments" },
          { label: "Dorixonalar", href: "#segments" },
          { label: "Xizmat", href: "#segments" },
        ],
      },
      {
        title: "Ulanish",
        links: [
          { label: "Erta kirish", href: "#lead" },
          { label: "Jihozlar", href: "#equipment" },
          { label: "Narx", href: "#freemium" },
        ],
      },
      {
        title: "Kontakt",
        links: [],
      },
    ],
    phone: "+998 97 421 24 54",
    copyright: "© 2026 BirLiy. Ipak Yuli Bank mahsuloti.",
    tagline: "Sizning biznesingiz. Bitta joyda.",
  },

  heroV2: {
    secondaryCta: "Qanday ishlashini ko'rish",
    trustLine: "Ipak Yuli Bank mahsuloti · Erta kirish 2026",
  },
};

export const dicts = { ru, uz } as const;
export type LandingDict = typeof ru;
