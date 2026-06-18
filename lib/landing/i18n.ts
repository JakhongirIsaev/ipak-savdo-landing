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
  ctaShort: "Заявка",
  stickyNote: "Старт 49 000 сум/мес",
  title: "Ваш бизнес. В одном месте.",
  subtitle:
    "Касса, склад и оплаты — в одном приложении на телефоне. Вечером цифры сходятся сами: видно, сколько продали, что осталось, где деньги. Без отдельных программ и ночных подсчётов. Программа для магазина: начать можно без отдельного оборудования, работает на телефоне.",
  telegram: "Написать в Telegram",
  demo: "Смотреть демо",
  trust: "Магазины у дома, минимаркеты, продуктовые магазины, аптеки, сервисные точки.",
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
  segmentsSubtitle: "Касса в телефоне для продуктового магазина, минимаркета и магазина у дома.",
  segments: [
    ["Магазины у дома", "Продукты, бытовая химия, повседневные товары."],
    ["Минимаркеты", "Сотни позиций, несколько кассиров, контроль остатков."],
    ["Продуктовые магазины", "Сотни товаров, вес и штучный учёт, оплата по QR."],
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
  nasiyaCaption: "Долговая тетрадь теперь в телефоне: сразу видно, кто и сколько должен.",
  stockCaption: "Всегда знайте, что осталось в магазине: учёт остатков обновляется сам после каждой продажи.",

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
  offlineSubline: "Даже если интернет пропал, касса продолжает работать.",
  offlineText:
    "Кассир продолжает пробивать товары. Когда связь восстановится, всё синхронизируется автоматически.",
  offlineBadge: "Работа при слабом интернете",
  offlineSteps: ["Продажа сохранена локально", "Интернет восстановился", "Данные синхронизированы"],

  equipmentTitle: "Начните с телефона. Оборудование — по желанию",
  equipFullTitle: "Продуктовый магазин",
  equipFullDesc: "Планшет, сканер штрих-кодов и термопринтер чеков. Полный контроль склада и быстрый поток покупателей.",
  equipFullItems: ["Планшет", "Сканер штрих-кодов", "Термопринтер чеков"],
  equipLiteTitle: "Магазин одежды и другие",
  equipLiteDesc: "Приложение на Android или iOS — всё, что нужно. Простой учёт, QR-оплата и чек в Telegram прямо с телефона.",
  equipLiteItems: ["Android-приложение", "iOS-приложение", "Без доп. оборудования"],

  formTitle: "Оставьте заявку",
  formIntro: "Заполните за минуту — пришлём ссылку и ответим на вопросы в Telegram. Подключаем за один день.",
  success: "Заявка принята. Команда BirLiy свяжется с вами.",
  formName: "Имя",
  formPhone: "Телефон",
  formBusiness: "Тип бизнеса",
  formBusinessName: "Официальное название магазина",
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
  optional: "Уточнить детали (необязательно)",
  submit: "Отправить заявку",
  formSecurity: "Доступ по PIN, разделение ролей и полный журнал действий — данные защищены.",
  formDocsTitle: "Документы для заявки",
  formDocsNote: "Приложите 3 фото: патент, паспорт директора/владельца и витрину магазина. Передаются по защищённому каналу — доступ только у команды BirLiy.",
  formPatent: "Фото патента",
  formPassport: "Фото паспорта директора/владельца",
  formShop: "Фото магазина",
  formFilePick: "Выбрать фото",
  formFileTooBig: "Файл слишком большой — максимум 10 МБ.",
  formFileWrongType: "Нужно фото: JPG, PNG или WEBP.",
  formFilesRequired: "Приложите все три фото: патент, паспорт и магазин.",

  faqTitle: "Вопросы и ответы",
  faq: [
    ["Я не разбираюсь в технологиях. Справлюсь?", "Да. BirLiy сделан для владельцев магазинов, не для айтишников. Отсканировал товар → выбрал оплату → чек ушёл. Кассир осваивает за 30 минут, а в первый день мы помогаем лично."],
    ["Сколько стоит BirLiy?", "Первые 6 месяцев: 49 000 сум в месяц, дальше 149 000 сум в месяц. Полный функционал, без скрытых платежей. Списаний без вашего согласия не будет: цену вы знаете заранее."],
    ["Нужно ли покупать компьютер?", "Нет. Достаточно смартфона или планшета."],
    ["Можно ли подключить сканер?", "Да. Подойдёт любой 2D Bluetooth-сканер."],
    ["Как работает QR-оплата?", "Покупатель сканирует QR-код на экране, и деньги поступают на счёт мгновенно."],
    ["Что происходит со складом после продажи?", "Остаток обновляется автоматически после каждой продажи."],
    ["Приложение работает без интернета?", "Да. Продажи сохраняются и синхронизируются, когда связь вернётся."],
    ["Можно ли импортировать товары?", "Да, из Excel. Также в продукте уже доступна база 9 000+ распространённых SKU: многие товары находятся сразу."],
    ["Сколько кассиров можно завести?", "На периоде раннего доступа без ограничений. Роли: Владелец / Кассир / Суперадмин. Каждый кассир заходит по PIN."],
    ["Можно ли работать на нескольких точках?", "Да. Сводные отчёты и кросс-точечный контроль кассиров доступны для бизнесов с несколькими точками."],
    ["Для каких магазинов подходит BirLiy?", "Для магазинов у дома, минимаркетов, продуктовых магазинов и дуканов, а также аптек и сервисных точек. Это простая касса на телефоне для небольшого магазина, а не тяжёлая корпоративная программа."],
    ["Чем BirLiy лучше тетради, Excel или 1С?", "Тетрадь и Excel приходится вести вручную, и долги легко теряются. 1С сложна и дорога для маленького магазина. BirLiy работает на телефоне, понятен без обучения и собирает кассу, склад, долги и отчёты в одном месте."],
    ["Можно ли вести долги покупателей (насия)?", "Да. Долги покупателей видно в приложении вместо бумажной тетради: кто сколько должен и когда обещал оплатить. Насия всегда под рукой, прямо на телефоне."],
    ["Нужен ли терминал для приёма оплаты?", "Нет. Покупатель сканирует QR-код на экране телефона, и оплата приходит сразу. Наличные, карта, QR или в долг учитываются в одном месте."],
    ["Какая программа нужна для магазина продуктов?", "Подойдёт простая программа для магазина, которая работает прямо на телефоне. В BirLiy касса, складской учёт, долговая тетрадь и QR-оплата собраны в одном приложении. Компьютер и отдельное оборудование не нужны: скачали, добавили товары и сразу продаёте."],
    ["Можно ли работать без кассового аппарата?", "BirLiy работает на телефоне, поэтому начать можно без отдельного оборудования. Покупатель сканирует QR-код на экране, и оплата приходит сразу. Если хотите более удобный формат, можно подключить планшет, сканер или принтер, а мы поможем с настройкой."],
    ["Чем заменить долговую тетрадь в магазине?", "Долговую тетрадь заменяет насия в BirLiy: кто сколько должен и когда обещал вернуть, видно прямо в телефоне. Бумажные записи больше не теряются, а долги покупателей идут вместе с продажами и остатками в одном приложении."],
    ["Как вести складской учёт остатков без Excel?", "Учёт остатков в магазине ведётся сам, без таблиц Excel и ручного пересчёта. После каждой продажи остаток уменьшается автоматически, поэтому вы всегда видите, что осталось на полке. Когда товар заканчивается, программа подскажет, что пора дозаказать."],
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
  heroOfferNote: "Первые 6 месяцев — 49 000 сум/мес, дальше 149 000",

  productCaption: "BirLiy — спокойная рабочая поверхность. Один экран на всё.",
  footerTagline: "Ваш бизнес. В одном месте.",
  footerSmall: "© 2026 BirLiy.",

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
    bank: "Сделано для Узбекистана",
    catalogSize: "9 000+ товаров в базе",
    pilot: "Ранний доступ 2026",
  },

  pain: {
    eyebrow: "01 / Знакомо?",
    headline: "Касса отдельно. Склад отдельно. Оплаты отдельно. BirLiy собирает всё в одном экране, и расхождения исчезают.",
    body: "Кассир пробивает чек на одном устройстве. Остатки ведутся в тетради. Оплаты считаются отдельно. Чтобы понять, сколько вы заработали сегодня, нужно вечером сесть и свести три источника. К ночи вы устаёте и решаете «потом». Так месяц превращается в загадку.",
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
    headline: "Всё для магазина в шести модулях",
    cards: [
      {
        title: "Многоканальная оплата",
        body: "Наличные, карта, QR, в долг — один учёт, не четыре тетрадки.",
        metric: "Одна страница оплаты — четыре кнопки",
      },
      {
        title: "Касса дня",
        body: "Видите смену в реальном времени — без ночных споров о выручке.",
        metric: "Сколько денег в кассе прямо сейчас",
      },
      {
        title: "Каталог + склад",
        body: "9 000+ товаров в базе, импорт из Excel. Заканчивается товар — система подскажет.",
        metric: "Не заводить вручную",
      },
      {
        title: "Отчёты с дельтой",
        body: "Выручка за день, неделю, месяц и насколько выросла или упала — тренд виден сразу.",
        metric: "День, неделя, месяц — за один взгляд",
      },
      {
        title: "Оборачиваемость",
        body: "Какой товар продаётся, а какой месяцами лежит мёртвым грузом — освобождайте деньги.",
        metric: "Что заказать, что списать",
      },
      {
        title: "Telegram уведомления",
        body: "Итоги смены приходят вам в Telegram — не отвлекаясь от работы.",
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
    headline: "Магазинам у дома. Минимаркетам. Продуктовым. Аптекам.",
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
        title: "Продуктовый магазин",
        body: "Сотни наименований, штучный и весовой учёт, оплата по QR, чек в Telegram.",
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
    headline: "49 000 сум/мес. Первые 6 месяцев.",
    body: "Стартовая цена для первой когорты: 49 000 сум в месяц первые 6 месяцев, дальше — 149 000 сум в месяц. Полный функционал без урезаний, без оборудования, подключаем за один день. Цена известна заранее: без скрытых платежей и списаний без вашего согласия.",
    priceAmount: "49 000",
    priceUnit: "сум в месяц",
    priceNote: "первые 6 месяцев · дальше 149 000",
    bullets: [
      {
        title: "49 000 сум/мес",
        caption: "Первые 6 месяцев — стартовая цена для первой когорты",
      },
      {
        title: "Полный функционал",
        caption: "Касса, склад, QR-оплата, отчёты, Telegram-бот — без урезанных режимов",
      },
      {
        title: "Потом 149 000 сум/мес",
        caption: "Прозрачная цена после 6 месяцев. Без скрытых платежей и списаний без вашего согласия.",
      },
    ],
    cta: "Получить ранний доступ",
  },

  earlyAccess: {
    eyebrow: "08 / Ранний доступ",
    headline: "Мы запускаемся с первой когортой пилотов",
    body: "BirLiy открывает ранний доступ для первых магазинов Ташкента. Подключение занимает один день: установка приложения, импорт каталога, первое обучение кассира — мы делаем всё это с вами. Стартовая цена для первой когорты — 49 000 сум/мес первые 6 месяцев. Если вы хотите быть в первой когорте — оставьте заявку.",
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
        title: "49 000 сум/мес на старте",
        caption: "Низкая стартовая цена на первые 6 месяцев — спокойно проверить BirLiy в деле",
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
          { label: "Продуктовые", href: "#segments" },
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
    copyright: "© 2026 BirLiy.",
    tagline: "Ваш бизнес. В одном месте.",
  },

  heroV2: {
    secondaryCta: "Посмотреть как работает",
    trustLine: "Данные под защитой · Доступ по PIN и журнал всех действий",
  },

  payMethods: ["Наличные", "Терминал", "QR", "В долг"],

  heroChips: ["Старт 49 000 сум/мес", "Подключаем за 1 день", "Старт без оборудования"],

  support: {
    label: "Поддержка",
    handle: "@birliy_support_bot",
    href: "https://t.me/birliy_support_bot",
  },

  telegramChannel: {
    eyebrow: "Telegram-канал",
    headline: "Будьте на связи с BirLiy",
    body: "Новости продукта, советы по торговле и учёту, истории первых магазинов. Коротко и без спама — прямо в Telegram.",
    handle: "@bir_liy",
    href: "https://t.me/bir_liy",
    cta: "Открыть канал",
    follow: "Подписаться",
    points: [
      "Обновления продукта и новые возможности",
      "Практичные советы для розницы",
      "Истории магазинов на BirLiy",
    ],
  },
};

const uz: typeof ru = {
  nav: ["Imkoniyatlar", "Jihozlar", "FAQ"],
  cta: "Ariza qoldirish",
  ctaShort: "Ariza",
  stickyNote: "Start 49 000 so'm/oy",
  title: "Sizning biznesingiz. Bitta joyda.",
  subtitle:
    "Kassa, ombor va to'lovlar — telefondagi bitta ilovada. Kechqurun raqamlar o'z-o'zidan to'g'ri keladi: qancha sotgansiz, nima qolgan, pul qayerda. Alohida dasturlar va tungi hisob-kitoblarsiz. Magazin uchun dastur: boshlash uchun alohida uskuna shart emas, telefonda ishlaydi.",
  telegram: "Telegram orqali yozish",
  demo: "Demoni ko'rish",
  trust: "Uy yonidagi do'konlar, minimarketlar, oziq-ovqat do'konlari, dorixonalar va xizmat nuqtalari.",
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
    ["Tushunish qiyin", "Murakkab dasturlar o'rganishni, sozlashni va kompyuterni talab qiladi."],
  ],

  segmentsTitle: "BirLiy kim uchun",
  segmentsSubtitle: "Oziq-ovqat do'koni, minimarket va uy yonidagi do'kon uchun telefondagi kassa.",
  segments: [
    ["Uy yonidagi do'konlar", "Oziq-ovqat, maishiy kimyo, kundalik tovarlar."],
    ["Minimarketlar", "Yuzlab tovar, bir necha kassir, qoldiq nazorati."],
    ["Oziq-ovqat do'konlari", "Yuzlab tovar, vaznli va donali hisob, QR orqali to'lov."],
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
  nasiyaCaption: "Qarz daftarini yoping: nasiya endi telefonda, kim qancha qarzligini darhol ko'rasiz.",
  stockCaption: "Do'konda nima qolganini har doim biling: tovar qoldig'i har sotuvdan keyin o'zi yangilanadi.",

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
  offlineSubline: "Internet uzilsa ham kassa ishlashda davom etadi.",
  offlineText:
    "Kassir tovarlarni sotishda davom etadi. Aloqa tiklanganda hammasi avtomatik sinxronlanadi.",
  offlineBadge: "Zaif internetda ishlash",
  offlineSteps: ["Sotuv lokal saqlandi", "Internet tiklandi", "Ma'lumotlar sinxronlandi"],

  equipmentTitle: "Telefondan boshlang. Jihoz — xohishingizga ko'ra",
  equipFullTitle: "Oziq-ovqat do'koni",
  equipFullDesc: "Planshet, shtrix-kod skaneri va termoprinter. To'liq ombor nazorati va tez xaridor oqimi.",
  equipFullItems: ["Planshet", "Shtrix-kod skaneri", "Termoprinter"],
  equipLiteTitle: "Kiyim do'koni va boshqalar",
  equipLiteDesc: "Android yoki iOS ilovasi — kerakli hamma narsa. Oddiy hisob, QR-to'lov va Telegram chek to'g'ridan-to'g'ri telefondan.",
  equipLiteItems: ["Android-ilova", "iOS-ilova", "Qo'shimcha jihozlarsiz"],

  formTitle: "Ariza qoldiring",
  formIntro: "Bir daqiqada to'ldiring — havola yuboramiz va Telegramda savollarga javob beramiz. Bir kunda ulaymiz.",
  success: "Ariza qabul qilindi. BirLiy jamoasi siz bilan bog'lanadi.",
  formName: "Ism",
  formPhone: "Telefon",
  formBusiness: "Biznes turi",
  formBusinessName: "Do'kon rasmiy nomi",
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
  optional: "Tafsilotlarni aniqlash (ixtiyoriy)",
  submit: "Ariza yuborish",
  formSecurity: "PIN orqali kirish, rollar va to'liq harakatlar jurnali — ma'lumotlar himoyalangan.",
  formDocsTitle: "Ariza uchun hujjatlar",
  formDocsNote: "3 ta foto biriktiring: patent, direktor/egasi pasporti va do'kon vitrinasi. Himoyalangan kanal orqali yuboriladi — faqat BirLiy jamoasi ko'radi.",
  formPatent: "Patent fotosi",
  formPassport: "Direktor/egasi pasporti fotosi",
  formShop: "Do'kon fotosi",
  formFilePick: "Foto tanlash",
  formFileTooBig: "Fayl juda katta — maksimum 10 MB.",
  formFileWrongType: "Foto kerak: JPG, PNG yoki WEBP.",
  formFilesRequired: "Uchala fotoni biriktiring: patent, pasport va do'kon.",

  faqTitle: "Savol va javoblar",
  faq: [
    ["Men texnologiyani tushunmayman. Eplay olamanmi?", "Ha. BirLiy do'kon egalari uchun, IT-mutaxassislar uchun emas. Tovarni skaner qildingiz → to'lovni tanladingiz → chek ketdi. Kassir 30 daqiqada o'rganadi, birinchi kuni shaxsan yordam beramiz."],
    ["BirLiy qancha turadi?", "Birinchi 6 oy: oyiga 49 000 so'm, keyin oyiga 149 000 so'm. To'liq funksionallik, yashirin to'lovlarsiz. Roziligingizsiz hech narsa yechib olinmaydi: narxni oldindan bilasiz."],
    ["Kompyuter sotib olish kerakmi?", "Yo'q. Smartfon yoki planshet yetarli."],
    ["Skaner ulash mumkinmi?", "Ha. Har qanday 2D Bluetooth-skaner mos keladi."],
    ["QR-to'lov qanday ishlaydi?", "Xaridor ekrandagi QR-kodni skanerlaydi va pul hisobga bir zumda tushadi."],
    ["Sotuvdan keyin omborga nima bo'ladi?", "Tovar qoldig'i har bir sotuvdan keyin avtomatik yangilanadi."],
    ["Ilova internetsiz ishlaydi?", "Ha. Sotuvlar saqlanadi va aloqa tiklanganda sinxronlanadi."],
    ["Tovarlarni import qilish mumkinmi?", "Ha, Excel orqali. Bundan tashqari ilovada 9 000+ keng tarqalgan SKU bazasi mavjud: ko'p tovarlar darhol topiladi."],
    ["Nechta kassir yaratish mumkin?", "Erta kirish davrida cheklov yo'q. Rollar: Egasi / Kassir / Superadmin. Har bir kassir PIN bilan kiradi."],
    ["Bir necha nuqtada ishlash mumkinmi?", "Ha. Bir nechta nuqtaga ega bizneslar uchun yig'ma hisobotlar va kassirlarni nuqtalararo nazorat qilish mavjud."],
    ["BirLiy qaysi do'konlar uchun mos?", "Uy yonidagi do'konlar, minimarketlar, oziq-ovqat do'konlari va dukanlar, shuningdek dorixonalar va xizmat nuqtalari uchun. Bu kichik do'kon uchun telefondagi oddiy kassa, og'ir korporativ dastur emas."],
    ["BirLiy daftar, Excel yoki 1C dan nimasi bilan yaxshi?", "Daftar va Excelni qo'lda yuritish kerak, qarzlar oson yo'qoladi. 1C kichik do'kon uchun murakkab va qimmat. BirLiy telefonda ishlaydi, o'rganishsiz tushunarli va kassa, ombor, nasiya hamda hisobotlarni bitta joyga yig'adi."],
    ["Xaridorlar nasiyasini (qarzini) yuritish mumkinmi?", "Ha. Xaridorlar qarzi qog'oz daftar o'rniga ilovada ko'rinadi: kim qancha qarz va qachon to'lashni va'da qilgan. Nasiya har doim telefoningizda qo'l ostida."],
    ["To'lov qabul qilish uchun terminal kerakmi?", "Yo'q. Xaridor telefon ekranidagi QR-kodni skanerlaydi va to'lov darhol tushadi. Naqd, karta, QR yoki nasiya bitta joyda hisobga olinadi."],
    ["Magazin uchun qanday dastur kerak: telefonda ishlaydimi?", "Ha. BirLiy magazin uchun dastur bo'lib, oddiy telefon yoki planshetda ishlaydi. Kassa, ombor hisobi, qarz daftari va QR to'lov bitta ilovada. Kompyuter va alohida uskuna shart emas: ilovani yuklab, tovarlarni qo'shib, darhol sotuvni boshlaysiz."],
    ["Kassa apparati olmasdan ishlash mumkinmi?", "BirLiy telefonda ishlaydi, shuning uchun boshlash uchun alohida uskuna sotib olish shart emas. Xaridor ekrandagi QR-kodni skanerlaydi va to'lov darhol tushadi. Xohlasangiz planshet, skaner yoki printer ulashingiz mumkin, sozlashda yordam beramiz."],
    ["Qarz daftarini telefonda yuritsa bo'ladimi?", "Ha. Qog'oz qarz daftarini yopib, nasiyani telefonga ko'chirasiz: kim, qancha va qachon to'lashni va'da qilgani ko'rinib turadi. Qarz daftari alohida ilovaga kerak emas, u sotuv va ombor bilan birga BirLiy ichida ishlaydi."],
    ["Omborda nima qolganini qanday bilaman?", "Do'konda nima qolganini istalgan vaqtda telefondan ko'rasiz. Tovar qoldig'i har bir sotuvdan keyin avtomatik kamayadi, shuning uchun qo'lda sanab o'tirmaysiz. Tovar tugayotganini tizim oldindan eslatadi, vaqti-vaqti bilan tovar sanash ham oson bo'ladi."],
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
  heroOfferNote: "Birinchi 6 oy — 49 000 so'm/oy, keyin 149 000",

  productCaption: "BirLiy — tinch ish sirti. Bitta ekran hamma narsa uchun.",
  footerTagline: "Sizning biznesingiz. Bitta joyda.",
  footerSmall: "© 2026 BirLiy.",

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
    bank: "O'zbekiston uchun yaratilgan",
    catalogSize: "9 000+ tovar bazada",
    pilot: "Erta kirish 2026",
  },

  pain: {
    eyebrow: "01 / Tanish?",
    headline: "Kassa alohida. Ombor alohida. To'lovlar alohida. BirLiy hammasini bitta ekranga yig'adi, va farqlar yo'qoladi.",
    body: "Kassir bir qurilmada chek uradi. Qoldiqlar daftarda olib boriladi. To'lovlar alohida hisoblanadi. Bugun qancha topganingizni bilish uchun kechqurun ofisga o'tirib, uchta manbani solishtirish kerak. Kechga borib charchasiz va «keyinroq» deb qo'yasiz. Shunday qilib, bir oy sir bo'lib qoladi.",
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
    headline: "Do'kon uchun kerakli hamma narsa olti modulda",
    cards: [
      {
        title: "Ko'p kanalli to'lov",
        body: "Naqd, karta, QR, nasiya — bitta hisob, to'rtta daftar emas.",
        metric: "Bir sahifada to'lov — to'rt tugma",
      },
      {
        title: "Kun kassasi",
        body: "Smenani real vaqtda ko'rasiz — tushum bo'yicha tungi bahslarsiz.",
        metric: "Hozir kassada qancha pul bor",
      },
      {
        title: "Katalog + ombor",
        body: "Bazada 9 000+ tovar, Exceldan import. Tovar tugayapti — tizim eslatadi.",
        metric: "Qo'lda kiritmaslik",
      },
      {
        title: "Delta bilan hisobotlar",
        body: "Kunlik, haftalik, oylik tushum va u qancha o'sgani yoki tushgani — trend darhol ko'rinadi.",
        metric: "Kun, hafta, oy — bir qarashda",
      },
      {
        title: "Aylanish",
        body: "Qaysi tovar sotiladi, qaysi biri oylab o'lik yuk bo'lib yotadi — pulni bo'shating.",
        metric: "Nimani buyurtma qilish, nimani hisobdan chiqarish",
      },
      {
        title: "Telegram xabarnomalar",
        body: "Smena yakunlari Telegramga keladi — ishdan chalg'imasdan.",
        metric: "Ilovaga kirmasdan biznes qo'lda",
      },
    ],
  },

  owner: {
    eyebrow: "04 / Egasi uchun",
    headline: "Siz hamma narsani ko'rasiz. Telefondan. Istalgan vaqtda.",
    body: "Kassa do'konda ishlaydi. Siz — istalgan joyda. Bugungi hisobot, ombordagi qoldiqlar, kassirlardan qaysi biri qachon smenaga kirgan, oxirgi 10 ta sotuv — barchasi qo'lingizda, qo'ng'iroq va jo'natmalarsiz.",
    bullets: [
      "Delta ±% bilan real tushum",
      "Smenalar va kassirlar jurnali",
      "Barcha harakatlar jurnali: nima sotildi, nima hisobdan chiqarildi, nima qaytarildi",
    ],
  },

  segmentsV2: {
    eyebrow: "05 / Qanday biznes uchun",
    headline: "Uy yonidagi do'konlar. Minimarketlar. Oziq-ovqat do'konlari. Dorixonalar.",
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
        title: "Oziq-ovqat do'koni",
        body: "Yuzlab nom, donali va vaznli hisob, QR orqali to'lov, Telegramda chek.",
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
    headline: "49 000 so'm/oy. Birinchi 6 oy.",
    body: "Birinchi kogorta uchun start narxi: oyiga 49 000 so'm birinchi 6 oy, keyin — oyiga 149 000 so'm. To'liq funksionallik, jihozsiz, bir kunda ulaymiz. Narx oldindan ma'lum: yashirin to'lovlar yo'q, roziligingizsiz hech narsa yechib olinmaydi.",
    priceAmount: "49 000",
    priceUnit: "so'm/oy",
    priceNote: "birinchi 6 oy · keyin 149 000",
    bullets: [
      {
        title: "49 000 so'm/oy",
        caption: "Birinchi 6 oy — birinchi kogorta uchun start narxi",
      },
      {
        title: "To'liq funksionallik",
        caption: "Kassa, ombor, QR-to'lov, hisobotlar, Telegram-bot — qisqartirilmagan",
      },
      {
        title: "Keyin 149 000 so'm/oy",
        caption: "6 oydan keyin shaffof narx. Yashirin to'lovlar yo'q, roziligingizsiz hech narsa yechilmaydi.",
      },
    ],
    cta: "Erta kirishga ariza berish",
  },

  earlyAccess: {
    eyebrow: "08 / Erta kirish",
    headline: "Biz birinchi pilot kogorta bilan ishga tushmoqdamiz",
    body: "BirLiy Toshkentning birinchi do'konlari uchun erta kirishni ochmoqda. Ulanish bir kun davom etadi: ilovani o'rnatish, katalogni import qilish, kassirni birinchi o'qitish — bularni biz siz bilan birgalikda qilamiz. Birinchi kogorta uchun start narxi — oyiga 49 000 so'm birinchi 6 oy. Birinchi kogortada bo'lishni istasangiz — ariza qoldiring.",
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
        title: "Startda 49 000 so'm/oy",
        caption: "Birinchi 6 oyga past start narxi — BirLiy'ni bemalol sinab ko'rasiz",
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
          { label: "Oziq-ovqat", href: "#segments" },
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
    copyright: "© 2026 BirLiy.",
    tagline: "Sizning biznesingiz. Bitta joyda.",
  },

  heroV2: {
    secondaryCta: "Qanday ishlashini ko'rish",
    trustLine: "Ma'lumotlar himoyalangan · PIN orqali kirish va barcha amallar jurnali",
  },

  payMethods: ["Naqd", "Terminal", "QR", "Qarzga"],

  heroChips: ["Start 49 000 so'm/oy", "1 kunda ulaymiz", "Jihozsiz start"],

  support: {
    label: "Qo'llab-quvvatlash",
    handle: "@birliy_support_bot",
    href: "https://t.me/birliy_support_bot",
  },

  telegramChannel: {
    eyebrow: "Telegram-kanal",
    headline: "BirLiy bilan aloqada bo'ling",
    body: "Mahsulot yangiliklari, savdo va hisob bo'yicha maslahatlar, birinchi do'konlar tajribasi. Qisqa va spamsiz — to'g'ridan-to'g'ri Telegramda.",
    handle: "@bir_liy",
    href: "https://t.me/bir_liy",
    cta: "Kanalni ochish",
    follow: "Obuna bo'lish",
    points: [
      "Mahsulot yangilanishlari va yangi imkoniyatlar",
      "Chakana savdo uchun amaliy maslahatlar",
      "BirLiy'dagi do'konlar tajribasi",
    ],
  },
};

export const dicts = { ru, uz } as const;
export type LandingDict = typeof ru;
