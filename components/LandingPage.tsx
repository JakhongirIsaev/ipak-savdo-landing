"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Menu,
  MessageCircle,
  Package,
  Play,
  Printer,
  QrCode,
  Receipt,
  ScanLine,
  Send,
  ShoppingCart,
  Smartphone,
  Store,
  Tablet,
  TrendingUp,
  Users,
  WifiOff,
  X,
  AlertTriangle,
  Clock,
  FileText,
  Heart,
  Shield,
  Zap,
  Coffee,
  Pill,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type Locale = "ru" | "uz";

const equipment = {
  scanner:
    "https://uzum.uz/ru/product/nastolnye-i-ruchnye-biryuzovyj---124-1230978?skuId=3858317",
  printer:
    "https://uzum.uz/ru/product/printer-chekov-58-778819?skuId=1862943",
};

const ru = {
  nav: ["Возможности", "Как работает", "Оборудование", "FAQ"],
  cta: "Оставить заявку",
  title: "Ipak Savdo — касса, склад и QR-оплата в одном приложении",
  subtitle:
    "Продавайте со смартфона или планшета, принимайте оплату по QR, отправляйте электронный чек и контролируйте остатки — без сложных программ.",
  telegram: "Написать в Telegram",
  demo: "Смотреть демо",
  trust: "Для магазинов у дома, минимаркетов, кафе, аптек и сервисных точек.",
  badges: [
    "QR-оплата в момент продажи",
    "Остатки обновляются автоматически",
    "Работа при слабом интернете",
    "Отчёты по выручке и кассирам",
  ],
  ecosystemBadge: "Продукт экосистемы Ipak Yuli Bank",

  problemTitle: "Знакомые проблемы?",
  problems: [
    ["Блокнот вместо учёта", "Товары записываются в тетрадь, остатки теряются, пересчёт занимает часы."],
    ["Деньги мимо кассы", "Без чёткого учёта сложно понять, сколько реально заработал за день."],
    ["Клиент уходит без сдачи", "Нет терминала, нет QR — покупатель уходит в соседний магазин."],
    ["Нет времени разбираться", "Сложные программы требуют обучения, настройки и компьютера."],
  ],

  segmentsTitle: "Для кого Ipak Savdo",
  segments: [
    ["Магазины у дома", "Продукты, бытовая химия, повседневные товары — быстрые продажи и понятный учёт."],
    ["Минимаркеты", "Сотни позиций, несколько кассиров — нужен контроль остатков и выручки."],
    ["Кафе и точки питания", "Быстрый заказ, оплата по QR, чек в Telegram — без лишних устройств."],
    ["Аптеки", "Точный учёт по наименованиям, контроль сроков и остатков."],
    ["Сервисные точки", "Ремонт, химчистка, ателье — приём оплаты и учёт заказов."],
  ],

  benefitsTitle: "Почему выбирают Ipak Savdo",
  benefits: [
    ["Начните за 5 минут", "Скачайте приложение, добавьте товары — и сразу продавайте. Без установки программ и оборудования."],
    ["Всё в одном месте", "Касса, склад, QR-оплата, чеки и отчёты — в одном приложении на вашем смартфоне."],
    ["Понятно без обучения", "Интерфейс создан для тех, кто никогда не работал с кассовыми программами."],
    ["Надёжная связь с банком", "Продукт экосистемы Ipak Yuli Bank — безопасные платежи и поддержка."],
  ],

  featuresTitle: "Что умеет Ipak Savdo",
  features: [
    ["Касса и продажи", "Сканер или камера, быстрый поиск товара, скидки, возврат и отложенный чек."],
    ["Каталог и склад", "Товары, категории, штучные и весовые позиции, остатки и списания."],
    ["QR-оплата", "Покупатель сканирует QR — оплата поступает мгновенно. Наличные, карта или QR."],
    ["Электронный чек", "Чек отправляется покупателю в Telegram. Печать можно подключить отдельно."],
    ["Роли сотрудников", "Владелец видит всё, кассир работает только с продажами."],
    ["Отчёты", "Выручка за день, средний чек, топ-товары и работа кассиров — всё наглядно."],
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
    "Кассир продолжает пробивать товары. Когда связь восстановится, все продажи и остатки синхронизируются автоматически.",
  offlineBadge: "Работа при слабом интернете",
  offlineSteps: ["Продажа сохранена локально", "Интернет восстановился", "Данные синхронизированы"],

  equipmentTitle: "Оборудование — по желанию",
  equipmentText:
    "Начните только со смартфона. Для потоковых точек подключите сканер штрих-кодов и принтер чеков.",
  scanner: "Сканер штрих-кодов",
  scannerText: "Ускоряет поиск товара и снижает ошибки на кассе.",
  printer: "Принтер чеков 58 мм",
  printerText: "Для тех, кому важен бумажный чек.",
  openProduct: "Посмотреть на Uzum",

  roadmapTitle: "Что появится дальше",
  roadmap: [
    ["Сейчас", "Касса, склад, QR-оплата, электронный чек, отчёты"],
    ["Скоро", "Акции, скидки и уведомления клиентам в Telegram"],
    ["Далее", "Закупки у поставщиков и удобные банковские сервисы для бизнеса"],
  ],

  formTitle: "Заявка на ранний доступ",
  success: "Заявка принята. Команда Ipak Savdo свяжется с вами.",
  formName: "Имя",
  formPhone: "Телефон",
  formBusiness: "Тип бизнеса",
  formComment: "Комментарий",
  optional: "Показать дополнительные поля",
  submit: "Отправить заявку",

  faqTitle: "Часто задаваемые вопросы",
  faq: [
    ["Нужно ли покупать компьютер?", "Нет. Достаточно смартфона или планшета."],
    ["Можно ли подключить сканер?", "Да. Подойдёт любой 2D Bluetooth-сканер."],
    ["Как работает QR-оплата?", "Покупатель сканирует QR-код на экране — деньги поступают на счёт мгновенно."],
    ["Что происходит со складом после продажи?", "Остаток товара обновляется автоматически после каждой продажи."],
    ["Приложение работает без интернета?", "Да. Продажи сохраняются и синхронизируются, когда связь вернётся."],
  ],

  cookie: "Мы используем cookies для аналитики и улучшения работы сайта.",
  accept: "Принять",
  later: "Позже",

  heroOnline: "Онлайн",
  heroRevenue: "Выручка",
  heroAvgCheck: "Средний чек",
  heroSales: "Продаж",
  heroRevenueVal: "3 450 000",
  heroAvgCheckVal: "87 000",
  heroSalesVal: "42",
  heroSaleTitle: "Продажа",
  heroItems: ["Молоко 1л", "Хлеб", "Кофе 3в1"],
  heroItemPrice: "14 000",
  heroTotal: "Итого",
  heroTotalVal: "20 500 сум",
  heroReceiptSent: "Чек отправлен",
  heroReceiptDetail: "Telegram · 20 500 сум",

  demoTitle: "Как работает Ipak Savdo",
  demoSteps: [
    ["Сканирование товара", "Наведите камеру или используйте сканер — товар мгновенно добавляется в чек."],
    ["Формирование корзины", "Все товары в одном списке. Можно менять количество, добавлять скидку."],
    ["QR-оплата", "На экране появляется QR-код. Покупатель сканирует — оплата проходит мгновенно."],
    ["Подтверждение оплаты", "Деньги поступили на счёт. Кассир видит подтверждение на экране."],
    ["Отправка чека", "Электронный чек уходит покупателю в Telegram. Можно напечатать, если нужно."],
    ["Обновление склада", "Остатки пересчитаны автоматически. Владелец видит актуальные данные в отчёте."],
  ],
  demoClose: "Закрыть",
};

const uz: typeof ru = {
  nav: ["Imkoniyatlar", "Qanday ishlaydi", "Jihozlar", "FAQ"],
  cta: "Ariza qoldirish",
  title: "Ipak Savdo — kassa, ombor va QR-to'lov bitta ilovada",
  subtitle:
    "Smartfon yoki planshetdan soting, QR orqali to'lov qabul qiling, elektron chek yuboring va qoldiqlarni nazorat qiling — murakkab dasturlarsiz.",
  telegram: "Telegram orqali yozish",
  demo: "Demoni ko'rish",
  trust: "Uy yonidagi do'konlar, minimarketlar, kafelar, dorixonalar va xizmat nuqtalari uchun.",
  badges: [
    "Sotuv paytida QR-to'lov",
    "Qoldiqlar avtomatik yangilanadi",
    "Zaif internetda ishlaydi",
    "Tushum va kassirlar bo'yicha hisobotlar",
  ],
  ecosystemBadge: "Ipak Yuli Bank ekotizimi mahsuloti",

  problemTitle: "Tanish muammolar?",
  problems: [
    ["Daftar o'rniga hisob", "Tovarlar daftarga yoziladi, qoldiqlar yo'qoladi, qayta hisoblash soatlab davom etadi."],
    ["Pul kassadan chetda", "Aniq hisobsiz kunlik daromadni bilish qiyin."],
    ["Mijoz qaytib ketadi", "Terminal yo'q, QR yo'q — xaridor qo'shni do'konga ketadi."],
    ["Tushunish qiyin", "Murakkab dasturlar o'rganish, sozlash va kompyuter talab qiladi."],
  ],

  segmentsTitle: "Ipak Savdo kim uchun",
  segments: [
    ["Uy yonidagi do'konlar", "Oziq-ovqat, maishiy kimyo, kundalik tovarlar — tez sotish va tushunarli hisob."],
    ["Minimarketlar", "Yuzlab tovar, bir necha kassir — qoldiq va tushumni nazorat qilish kerak."],
    ["Kafelar va ovqatlanish nuqtalari", "Tez buyurtma, QR orqali to'lov, Telegram chek — ortiqcha qurilmasiz."],
    ["Dorixonalar", "Nomlar bo'yicha aniq hisob, muddat va qoldiqlarni nazorat."],
    ["Xizmat nuqtalari", "Ta'mirlash, kimyoviy tozalash, tikuvchilik — to'lov qabul qilish va buyurtma hisobi."],
  ],

  benefitsTitle: "Nima uchun Ipak Savdoni tanlashadi",
  benefits: [
    ["5 daqiqada boshlang", "Ilovani yuklab oling, tovarlarni qo'shing — va darhol soting. Dastur o'rnatish va jihozlarsiz."],
    ["Hammasi bir joyda", "Kassa, ombor, QR-to'lov, cheklar va hisobotlar — smartfoningizdagi bitta ilovada."],
    ["O'rganishsiz tushunarli", "Interfeys kassa dasturlari bilan hech qachon ishlamagan kishilar uchun yaratilgan."],
    ["Bank bilan ishonchli aloqa", "Ipak Yuli Bank ekotizimi mahsuloti — xavfsiz to'lovlar va qo'llab-quvvatlash."],
  ],

  featuresTitle: "Ipak Savdo nimalarni qila oladi",
  features: [
    ["Kassa va sotuvlar", "Skaner yoki kamera, tez tovar qidirish, chegirmalar, qaytarish va kechiktirilgan chek."],
    ["Katalog va ombor", "Tovarlar, kategoriyalar, donali va vaznli pozitsiyalar, qoldiqlar va hisobdan chiqarish."],
    ["QR-to'lov", "Xaridor QR-kodni skanerlaydi — to'lov bir zumda tushadi. Naqd, karta yoki QR."],
    ["Elektron chek", "Chek xaridorga Telegramga yuboriladi. Bosib chiqarishni alohida ulash mumkin."],
    ["Xodim rollari", "Egasi hammasini ko'radi, kassir faqat sotuvlar bilan ishlaydi."],
    ["Hisobotlar", "Kunlik tushum, o'rtacha chek, top-tovarlar va kassirlar ishi — hammasi ko'rinarli."],
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
    "Kassir tovarlarni sotishda davom etadi. Aloqa tiklanganda barcha sotuvlar va qoldiqlar avtomatik sinxronlanadi.",
  offlineBadge: "Zaif internetda ishlash",
  offlineSteps: ["Sotuv lokal saqlandi", "Internet tiklandi", "Ma'lumotlar sinxronlandi"],

  equipmentTitle: "Jihozlar — ixtiyoriy",
  equipmentText:
    "Faqat smartfondan boshlang. Xaridor oqimi ko'p bo'lsa, shtrix-kod skaneri va chek printeri yordam beradi.",
  scanner: "Shtrix-kod skaneri",
  scannerText: "Tovarni tezroq topishga va kassada kamroq xato qilishga yordam beradi.",
  printer: "58 mm chek printeri",
  printerText: "Xaridorga qog'oz chek kerak bo'lsa foydali.",
  openProduct: "Uzumda ko'rish",

  roadmapTitle: "Keyin nimalar qo'shiladi",
  roadmap: [
    ["Hozir", "Kassa, ombor, QR-to'lov, elektron chek, hisobotlar"],
    ["Tez orada", "Aksiyalar, chegirmalar va mijozlarga Telegram xabarnomalar"],
    ["Keyinchalik", "Yetkazib beruvchilardan xarid va biznes uchun qulay bank xizmatlari"],
  ],

  formTitle: "Erta kirish uchun ariza",
  success: "Ariza qabul qilindi. Ipak Savdo jamoasi siz bilan bog'lanadi.",
  formName: "Ism",
  formPhone: "Telefon",
  formBusiness: "Biznes turi",
  formComment: "Izoh",
  optional: "Qo'shimcha maydonlarni ko'rsatish",
  submit: "Ariza yuborish",

  faqTitle: "Tez-tez so'raladigan savollar",
  faq: [
    ["Kompyuter sotib olish kerakmi?", "Yo'q. Smartfon yoki planshet yetarli."],
    ["Skaner ulash mumkinmi?", "Ha. Har qanday 2D Bluetooth-skaner mos keladi."],
    ["QR-to'lov qanday ishlaydi?", "Xaridor ekrandagi QR-kodni skanerlaydi — pul hisobga bir zumda tushadi."],
    ["Sotuvdan keyin omborga nima bo'ladi?", "Tovar qoldig'i har bir sotuvdan keyin avtomatik yangilanadi."],
    ["Ilova internetsiz ishlaydi?", "Ha. Sotuvlar saqlanadi va aloqa tiklanganda sinxronlanadi."],
  ],

  cookie: "Sayt tahlili va ishlashini yaxshilash uchun cookies ishlatamiz.",
  accept: "Qabul qilish",
  later: "Keyinroq",

  heroOnline: "Onlayn",
  heroRevenue: "Tushum",
  heroAvgCheck: "O'rtacha chek",
  heroSales: "Sotuvlar",
  heroRevenueVal: "3 450 000",
  heroAvgCheckVal: "87 000",
  heroSalesVal: "42",
  heroSaleTitle: "Sotuv",
  heroItems: ["Sut 1l", "Non", "Kofe 3in1"],
  heroItemPrice: "14 000",
  heroTotal: "Jami",
  heroTotalVal: "20 500 so'm",
  heroReceiptSent: "Chek yuborildi",
  heroReceiptDetail: "Telegram · 20 500 so'm",

  demoTitle: "Ipak Savdo qanday ishlaydi",
  demoSteps: [
    ["Tovarni skanerlash", "Kamerani yo'naltiring yoki skaner ishlating — tovar bir zumda chekka qo'shiladi."],
    ["Savatni shakllantirish", "Barcha tovarlar bitta ro'yxatda. Miqdorni o'zgartirish, chegirma qo'shish mumkin."],
    ["QR-to'lov", "Ekranda QR-kod paydo bo'ladi. Xaridor skanerlaydi — to'lov bir zumda o'tadi."],
    ["To'lov tasdiqlandi", "Pul hisobga tushdi. Kassir ekranda tasdiqlashni ko'radi."],
    ["Chek yuborish", "Elektron chek xaridorga Telegramga yuboriladi. Kerak bo'lsa bosib chiqarish mumkin."],
    ["Ombor yangilandi", "Qoldiqlar avtomatik qayta hisoblandi. Egasi hisobotda dolzarb ma'lumotlarni ko'radi."],
  ],
  demoClose: "Yopish",
};

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const t = locale === "ru" ? ru : uz;
  const ids = ["features", "workflow", "equipment", "faq"];

  useEffect(() => {
    const saved = localStorage.getItem("ipak-locale") as Locale | null;
    if (saved === "ru" || saved === "uz") setLocale(saved);
  }, []);

  const switchLocale = useCallback((loc: Locale) => {
    setLocale(loc);
    localStorage.setItem("ipak-locale", loc);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Logo />
          </button>
          <nav className="hidden items-center gap-7 lg:flex">
            {t.nav.map((item, index) => (
              <button key={item} type="button" onClick={() => scrollTo(ids[index])} className="text-sm font-bold text-slate-600 hover:text-[#005B45]">
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => switchLocale("ru")} className={langClass(locale === "ru")}>RU</button>
            <button type="button" onClick={() => switchLocale("uz")} className={langClass(locale === "uz")}>UZ</button>
            <button type="button" onClick={() => setModalOpen(true)} className="hidden rounded-lg bg-[#00C853] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(0,200,83,0.22)] sm:block">
              {t.cta}
            </button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-slate-200 p-3 lg:hidden">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="section-shell grid gap-2 border-t border-slate-200 bg-white py-4 lg:hidden">
            {t.nav.map((item, index) => (
              <button key={item} type="button" onClick={() => scrollTo(ids[index])} className="rounded-lg px-2 py-3 text-left font-bold">
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 green-grid opacity-70" />
        <div className="section-shell relative grid gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
          <div className="min-w-0 max-w-[calc(100vw-2rem)]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#BDECD5] bg-[#F3FBF7] px-3 py-2 text-xs font-black text-[#005B45]">
              <CheckCircle2 size={15} />
              {t.ecosystemBadge}
            </div>
            <h1 className="max-w-[760px] text-balance text-[34px] font-black leading-[1.06] tracking-normal sm:text-5xl lg:text-[60px]">
              {t.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">{t.subtitle}</p>
            <div className="mt-7 flex w-full max-w-[calc(100vw-2rem)] flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setModalOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00C853] px-5 py-4 text-sm font-black text-white sm:w-auto">
                {t.cta}
                <ArrowRight size={18} />
              </button>
              <button type="button" onClick={() => setDemoOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#00A86B]/30 bg-white px-5 py-4 text-sm font-black text-[#005B45] sm:w-auto">
                <Play size={18} />
                {t.demo}
              </button>
            </div>
            <p className="mt-5 text-sm text-slate-500">{t.trust}</p>
            <div className="mt-6 grid w-full max-w-[calc(100vw-2rem)] gap-2 sm:grid-cols-2">
              {t.badges.map((badge) => (
                <div key={badge} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="shrink-0 text-[#00A86B]" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <HeroMockup t={t} />
        </div>
      </section>

      {/* Problem */}
      <Section title={t.problemTitle} tinted>
        <div className="grid gap-4 md:grid-cols-2">
          {t.problems.map(([title, text], i) => {
            const icons = [FileText, TrendingUp, AlertTriangle, Clock];
            const Icon = icons[i] || AlertTriangle;
            return (
              <div key={title} className="flex gap-4 rounded-lg border border-red-200/60 bg-white p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black">{title}</h3>
                  <p className="mt-1 text-base leading-7 text-slate-600">{text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Segments */}
      <Section title={t.segmentsTitle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.segments.map(([title, text], i) => {
            const icons = [Store, ShoppingCart, Coffee, Pill, Wrench];
            const Icon = icons[i] || Store;
            return (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EAF7F1] text-[#005B45]">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-1 text-base leading-7 text-slate-600">{text}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Benefits */}
      <section className="border-y border-[#BDECD5] bg-[#F3FBF7] py-16 lg:py-20">
        <div className="section-shell">
          <h2 className="mx-auto mb-10 max-w-3xl text-center text-3xl font-black leading-tight sm:text-4xl">{t.benefitsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {t.benefits.map(([title, text], i) => {
              const icons = [Zap, Smartphone, Heart, Shield];
              const Icon = icons[i] || CheckCircle2;
              return (
                <div key={title} className="flex gap-4 rounded-lg border border-[#BDECD5] bg-white p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF7F1] text-[#005B45]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">{title}</h3>
                    <p className="mt-1 text-base leading-7 text-slate-600">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <Section id="features" title={t.featuresTitle}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.features.map(([title, text], index) => (
            <FeatureCard key={title} index={index} title={title} text={text} t={t} />
          ))}
        </div>
      </Section>

      {/* Workflow */}
      <Section id="workflow" title={t.workflowTitle} tinted>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {t.workflowSteps.map((step, index) => {
            const icons = [ScanLine, ShoppingCart, QrCode, CheckCircle2, Receipt, Package];
            const Icon = icons[index] || CheckCircle2;
            return (
              <div key={step} className="rounded-lg border border-[#BDECD5] bg-white p-4 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF7F1] text-[#005B45]">
                  <Icon size={18} />
                </div>
                <div className="text-sm font-black">{step}</div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Offline */}
      <section className="bg-[#005B45] py-16 text-white lg:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-black text-[#B7F34A]">
              <WifiOff size={16} />
              {t.offlineBadge}
            </div>
            <h2 className="text-3xl font-black sm:text-4xl">{t.offlineTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-white/80">{t.offlineText}</p>
          </div>
          <div className="grid gap-3">
            {t.offlineSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4">
                <Check className="shrink-0 text-[#B7F34A]" />
                <span className="font-bold">{index + 1}. {step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <Section id="equipment" title={t.equipmentTitle} subtitle={t.equipmentText}>
        <div className="grid gap-4 md:grid-cols-2">
          <EquipmentCard icon={<ScanLine />} title={t.scanner} text={t.scannerText} href={equipment.scanner} cta={t.openProduct} />
          <EquipmentCard icon={<Printer />} title={t.printer} text={t.printerText} href={equipment.printer} cta={t.openProduct} />
        </div>
      </Section>

      {/* Roadmap */}
      <Section title={t.roadmapTitle} tinted>
        <div className="grid gap-4 lg:grid-cols-3">
          {t.roadmap.map(([label, text]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="text-sm font-black text-[#005B45]">{label}</div>
              <p className="mt-2 font-bold leading-7 text-slate-700">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Lead Form */}
      <Section title={t.formTitle}>
        <LeadForm t={t} />
      </Section>

      {/* FAQ */}
      <Section id="faq" title={t.faqTitle} tinted>
        <FAQ items={t.faq} />
      </Section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="text-sm font-bold text-slate-500">© 2026 Ipak Savdo</p>
        </div>
      </footer>

      {/* Cookie */}
      <Cookie t={t} />

      {/* Sticky mobile CTA */}
      <button type="button" onClick={() => setModalOpen(true)} className="fixed bottom-4 left-4 right-4 z-30 rounded-lg bg-[#00C853] px-5 py-4 text-base font-black text-white shadow-2xl md:hidden">
        {t.cta}
      </button>

      {/* Lead form modal */}
      {modalOpen && <Modal close={() => setModalOpen(false)}><LeadForm t={t} compact /></Modal>}

      {/* Demo modal */}
      <AnimatePresence>
        {demoOpen && <DemoModal t={t} close={() => setDemoOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function langClass(active: boolean) {
  return cn("rounded-lg border border-slate-200 px-3 py-2 text-xs font-black", active ? "bg-[#EAF7F1] text-[#005B45]" : "bg-white text-slate-500");
}

function Section({ id, title, subtitle, tinted, children }: { id?: string; title: string; subtitle?: string; tinted?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("py-16 lg:py-20", tinted ? "border-y border-slate-200 bg-[#F8FBFA]" : "bg-white")}>
      <div className="section-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg leading-8 text-slate-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ── Feature cards ───────────────────────────────────────── */

function FeatureCard({ index, title, text, t }: { index: number; title: string; text: string; t: typeof ru }) {
  const icons = [ScanLine, Package, QrCode, Receipt, Users, BarChart3];
  const Icon = icons[index] || CheckCircle2;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF7F1] text-[#005B45]">
          <Icon />
        </div>
        <div>
          <h3 className="text-xl font-black">{title}</h3>
          <p className="mt-2 text-base leading-7 text-slate-600">{text}</p>
        </div>
      </div>
      {index === 2 ? <MockQR t={t} /> : <MiniPreview index={index} t={t} />}
    </div>
  );
}

function MockQR({ t }: { t: typeof ru }) {
  return (
    <div className="mt-5 flex items-center gap-4 rounded-lg bg-[#F3FBF7] p-3">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2">
        <QrCode size={56} className="text-[#005B45]" />
      </div>
      <span className="text-sm font-bold text-slate-600">
        <span className="block font-black text-[#005B45]">{t.qrCardTitle}</span>
        <span>{t.qrCardHint}</span>
      </span>
    </div>
  );
}

function MiniPreview({ index, t }: { index: number; t: typeof ru }) {
  const row = t.miniPreviews[Math.min(index, t.miniPreviews.length - 1)];
  return (
    <div className="mt-5 flex justify-between rounded-lg bg-[#F3FBF7] p-3 text-sm font-bold">
      <span>{row[0]}</span>
      <span className="text-[#005B45]">{row[1]}</span>
    </div>
  );
}

/* ── Equipment ───────────────────────────────────────────── */

function EquipmentCard({ icon, title, text, href, cta }: { icon: React.ReactNode; title: string; text: string; href: string; cta: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-[#00A86B]/40">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF7F1] text-[#005B45]">{icon}</div>
      <span>
        <span className="block text-xl font-black">{title}</span>
        <span className="mt-2 block text-base leading-7 text-slate-600">{text}</span>
        <span className="mt-3 inline-flex items-center gap-2 font-black text-[#005B45]">{cta}<ArrowRight size={16} /></span>
      </span>
    </a>
  );
}

/* ── Lead form ───────────────────────────────────────────── */

function LeadForm({ t, compact }: { t: typeof ru; compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [extra, setExtra] = useState(false);
  if (sent) return <div className="mx-auto max-w-xl rounded-lg border border-[#BDECD5] bg-white p-8 text-center text-xl font-black text-[#005B45]">{t.success}</div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className={cn("mx-auto grid max-w-xl gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm", compact && "shadow-none")}>
      <input required placeholder={t.formName} className={inputClass} />
      <input required placeholder={t.formPhone} className={inputClass} />
      <input required placeholder={t.formBusiness} className={inputClass} />
      <button type="button" onClick={() => setExtra(!extra)} className="flex items-center gap-2 text-left text-sm font-black text-[#005B45]">
        <ChevronDown size={16} className={cn("transition", extra && "rotate-180")} />
        {t.optional}
      </button>
      {extra && <textarea placeholder={t.formComment} rows={3} className={cn(inputClass, "resize-none")} />}
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00C853] px-5 py-4 font-black text-white">
        <Send size={18} />
        {t.submit}
      </button>
    </form>
  );
}

/* ── FAQ ─────────────────────────────────────────────────── */

function FAQ({ items }: { items: readonly string[][] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto grid max-w-4xl gap-3">
      {items.map(([q, a], index) => (
        <div key={q} className="rounded-lg border border-slate-200 bg-white">
          <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-4 text-left font-black">
            {q}
            <ChevronDown className={cn("shrink-0 text-[#005B45] transition", open === index && "rotate-180")} />
          </button>
          {open === index && <p className="px-4 pb-4 leading-7 text-slate-600">{a}</p>}
        </div>
      ))}
    </div>
  );
}

/* ── Cookie ──────────────────────────────────────────────── */

function Cookie({ t }: { t: typeof ru }) {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(localStorage.getItem("ipak-cookie-ok") !== "true"), []);
  if (!show) return null;
  return (
    <div className="fixed bottom-24 left-4 right-4 z-30 rounded-lg border border-slate-200 bg-white p-4 shadow-xl md:bottom-6 md:left-auto md:right-6 md:w-[520px] md:max-w-[calc(100vw-3rem)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold text-slate-600">{t.cookie}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { localStorage.setItem("ipak-cookie-ok", "true"); setShow(false); }} className="rounded-lg bg-[#005B45] px-4 py-2 font-black text-white">{t.accept}</button>
          <button type="button" onClick={() => setShow(false)} className="rounded-lg border border-slate-200 px-4 py-2 font-black">{t.later}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────── */

function Modal({ close, children }: { close: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={close}>
      <div className="w-full max-w-xl rounded-lg bg-white p-4" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} className="mb-3 ml-auto block rounded-lg border border-slate-200 p-2"><X /></button>
        {children}
      </div>
    </div>
  );
}

/* ── Demo Modal (animated 6-step walkthrough) ────────────── */

function DemoModal({ t, close }: { t: typeof ru; close: () => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const total = t.demoSteps.length;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [playing, total]);

  const icons = [ScanLine, ShoppingCart, QrCode, CheckCircle2, Receipt, Package];
  const Icon = icons[step] || CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onClick={close}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-black">{t.demoTitle}</h3>
          <button type="button" onClick={close} className="rounded-lg border border-slate-200 p-2">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF7F1] text-[#005B45]">
                <Icon size={32} />
              </div>
              <div className="text-sm font-black text-[#005B45]">
                {step + 1} / {total}
              </div>
              <h4 className="mt-2 text-xl font-black">{t.demoSteps[step][0]}</h4>
              <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-600">{t.demoSteps[step][1]}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="px-5">
          <div className="flex gap-1.5">
            {t.demoSteps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setStep(i); setPlaying(false); }}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i === step ? "bg-[#00C853]" : i < step ? "bg-[#00C853]/40" : "bg-slate-200"
                )}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={() => { setStep((step - 1 + total) % total); setPlaying(false); }}
            className="rounded-lg border border-slate-200 p-2"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-[#005B45]"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            onClick={() => { setStep((step + 1) % total); setPlaying(false); }}
            className="rounded-lg border border-slate-200 p-2"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Hero Mockup ─────────────────────────────────────────── */

function HeroMockup({ t }: { t: typeof ru }) {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-xl">
      {/* Browser chrome */}
      <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-[#F1F3F5] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-[#F8F9FA] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <div className="h-3 w-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-slate-400">
            app.ipaksavdo.uz
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <Logo small />
            <span className="rounded-lg bg-[#F3FBF7] px-3 py-2 text-xs font-black text-[#005B45]">{t.heroOnline}</span>
          </div>
          <div className="mt-5 grid min-w-0 gap-2 sm:grid-cols-3 sm:gap-3">
            {[
              [t.heroRevenue, t.heroRevenueVal],
              [t.heroAvgCheck, t.heroAvgCheckVal],
              [t.heroSales, t.heroSalesVal],
            ].map(([label, val]) => (
              <div key={label} className="min-w-0 rounded-lg border border-slate-200 p-3">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-1 text-sm font-black">{val}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
            <PhoneSale t={t} />
            <div className="min-w-0 rounded-lg border border-slate-200 bg-[#F3FBF7] p-4">
              <div className="font-black text-[#005B45]">{t.heroReceiptSent}</div>
              <p className="mt-3 break-words text-sm font-bold text-slate-600">{t.heroReceiptDetail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneSale({ t }: { t: typeof ru }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 p-4">
      <div className="font-black">{t.heroSaleTitle}</div>
      {t.heroItems.map((item) => (
        <div key={item} className="mt-3 flex items-start justify-between gap-3 rounded-lg bg-[#F8FBFA] p-3 text-sm font-bold">
          <span className="min-w-0">{item}</span>
          <span className="shrink-0">{t.heroItemPrice}</span>
        </div>
      ))}
      <div className="mt-4 flex flex-wrap justify-between gap-2 font-black text-[#005B45]">
        <span>{t.heroTotal}</span>
        <span>{t.heroTotalVal}</span>
      </div>
    </div>
  );
}

/* ── Logo ────────────────────────────────────────────────── */

function Logo({ small = false }: { small?: boolean }) {
  if (small) return <img src="/logo.png" alt="Ipak Savdo" className="h-8 w-auto" />;
  return <img src="/logo.png" alt="Ipak Savdo" className="h-12 w-auto" />;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none focus:border-[#00A86B] focus:ring-4 focus:ring-[#00A86B]/20";
