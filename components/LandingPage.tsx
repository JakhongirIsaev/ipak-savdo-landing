"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ScanLine,
  Package,
  QrCode,
  WifiOff,
  BarChart3,
  Tablet,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LeadFormStandalone from "@/components/LeadForm";
import { useAttribution } from "@/lib/use-attribution";

type Locale = "ru" | "uz";

/* ────────────────────────────────────────────────────────────
   Copy. Plain, practical, unhurried. Short sentences. Real verbs.
   Both dicts MUST stay structurally identical (typeof ru === typeof uz).
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
  ecosystemBadge: "Workspace для бизнеса",

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
    ["Сейчас", "Касса, склад, QR-оплата, электронный чек, отчёты."],
    ["Скоро", "Акции, скидки и уведомления клиентам в Telegram."],
    ["Далее", "Закупки у поставщиков и банковские сервисы для бизнеса."],
  ],

  formTitle: "Оставьте заявку",
  formIntro: "Расскажем, как BirLiy подходит под ваш формат. Без обзвонов и навязчивости.",
  success: "Заявка принята. Команда BirLiy свяжется с вами.",
  formName: "Имя",
  formPhone: "Телефон",
  formBusiness: "Тип бизнеса",
  formBusinessName: "Название бизнеса",
  formNeedsEquipment: "Нужно оборудование (касса, принтер, сканер)",
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
  ecosystemBadge: "Biznes uchun workspace",

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
    ["Hozir", "Kassa, ombor, QR-to'lov, elektron chek, hisobotlar."],
    ["Tez orada", "Aksiyalar, chegirmalar va mijozlarga Telegram xabarnomalar."],
    ["Keyinchalik", "Yetkazib beruvchilardan xarid va biznes uchun bank xizmatlari."],
  ],

  formTitle: "Ariza qoldiring",
  formIntro: "BirLiy formatingizga qanday mos kelishini aytib beramiz. Qo'ng'iroq va bezovta qilishlarsiz.",
  success: "Ariza qabul qilindi. BirLiy jamoasi siz bilan bog'lanadi.",
  formName: "Ism",
  formPhone: "Telefon",
  formBusiness: "Biznes turi",
  formBusinessName: "Biznes nomi",
  formNeedsEquipment: "Jihoz kerak (kassa, printer, skaner)",
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
};

/* ────────────────────────────────────────────────────────────
   Motion: BirLiy curve. Settle, don't bounce.
   ──────────────────────────────────────────────────────────── */

const EASE = [0.2, 0.8, 0.2, 1] as const;
const settle = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const attribution = useAttribution();
  const t = locale === "ru" ? ru : uz;

  useEffect(() => {
    const saved = localStorage.getItem("birliy-locale") as Locale | null;
    if (saved === "ru" || saved === "uz") setLocale(saved);
  }, []);

  const switchLocale = useCallback((loc: Locale) => {
    setLocale(loc);
    localStorage.setItem("birliy-locale", loc);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navTargets = ["capabilities", "equipment", "faq"];

  return (
    <main className="min-h-screen bg-paper text-ink-900 antialiased">
      <Header t={t} locale={locale} switchLocale={switchLocale} scrollTo={scrollTo} navTargets={navTargets} />
      <Hero t={t} />
      <Capabilities t={t} />
      <VoiceInsert t={t} />
      <ProductMoment t={t} />
      <WhyBirliy t={t} />
      <Equipment t={t} />
      <Roadmap t={t} />
      <LeadSection t={t} locale={locale} attribution={attribution} />
      <FAQ t={t} />
      <Footer t={t} locale={locale} switchLocale={switchLocale} />
      <Cookie t={t} />
    </main>
  );
}

/* ────────────────────────────────────────────────────────────
   Header — sticky, minimal, ~72px
   ──────────────────────────────────────────────────────────── */

interface HeaderProps {
  t: typeof ru;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
  scrollTo: (id: string) => void;
  navTargets: readonly string[];
}

function Header({ t, locale, switchLocale, scrollTo, navTargets }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/85 backdrop-blur">
      <div className="section-shell flex h-[72px] items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="BirLiy"
          className="shrink-0"
        >
          <img src="/birliy-wordmark.svg" alt="BirLiy" className="h-7 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {t.nav.map((item, i) => (
            <button
              key={item}
              type="button"
              onClick={() => scrollTo(navTargets[i])}
              className="text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangPill locale={locale} switchLocale={switchLocale} />
          <button
            type="button"
            onClick={() => scrollTo("lead")}
            className="hidden items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-700 sm:inline-flex"
          >
            {t.cta}
          </button>
        </div>
      </div>
    </header>
  );
}

function LangPill({ locale, switchLocale }: { locale: Locale; switchLocale: (loc: Locale) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-mist bg-paper p-0.5 text-xs font-medium">
      {(["ru", "uz"] as const).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors duration-200 ease-birliy",
            locale === loc ? "bg-ink-900 text-paper" : "text-ink-500 hover:text-ink-900",
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero — 7/12 + 5/12, single orchestrated settle-in
   ──────────────────────────────────────────────────────────── */

function Hero({ t }: { t: typeof ru }) {
  return (
    <section className="relative">
      <div className="section-shell grid items-center gap-16 py-24 lg:grid-cols-12 lg:gap-12 lg:py-32">
        <div className="lg:col-span-7">
          <motion.p
            {...settle(0)}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500"
          >
            {t.ecosystemBadge}
          </motion.p>

          <motion.h1
            {...settle(0.08)}
            className="mt-6 max-w-[15ch] text-balance font-display text-5xl font-bold leading-[1.04] tracking-tightish text-ink-900 sm:text-6xl lg:text-[80px]"
          >
            {t.title}
          </motion.h1>

          <motion.p
            {...settle(0.16)}
            className="mt-7 max-w-[58ch] text-[19px] font-light leading-relaxed text-ink-700 sm:text-[22px]"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            {...settle(0.24)}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#lead"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-700"
            >
              {t.cta}
              <ArrowRight size={16} strokeWidth={1.75} />
            </a>
            <a
              href="https://t.me/birliy_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.telegram}
              <ArrowRight size={14} strokeWidth={1.75} className="opacity-60" />
            </a>
          </motion.div>

          <motion.p
            {...settle(0.32)}
            className="mt-8 text-sm leading-relaxed text-ink-500"
          >
            {t.trust}
          </motion.p>
        </div>

        <motion.div {...settle(0.32)} className="lg:col-span-5">
          <HeroStatCard t={t} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStatCard({ t }: { t: typeof ru }) {
  return (
    <div className="rounded-3xl border border-mist bg-white p-7 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {t.heroOnline}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          live
        </div>
      </div>

      <div className="mt-7">
        <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
          {t.heroRevenue}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-5xl font-bold tracking-tightish text-ink-900 tabular-nums">
            {t.heroRevenueVal}
          </span>
          <span className="text-base font-medium text-ink-500">{t.heroCurrency}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-mist pt-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {t.heroAvgCheck}
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tightish text-ink-900 tabular-nums">
            {t.heroAvgCheckVal}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {t.heroSales}
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tightish text-ink-900 tabular-nums">
            {t.heroSalesVal}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-mist pt-5 text-sm">
        <div className="text-ink-500">{t.heroLast}</div>
        <div className="font-medium text-ink-700 tabular-nums">{t.heroTotalVal}</div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Capabilities — 3 columns, no card backgrounds
   ──────────────────────────────────────────────────────────── */

function Capabilities({ t }: { t: typeof ru }) {
  // pick top 3 + offline as a 4th caption-line
  const cap = [
    { icon: ScanLine, title: t.features[0][0], body: t.features[0][1] },
    { icon: Package, title: t.features[1][0], body: t.features[1][1] },
    { icon: QrCode, title: t.features[2][0], body: t.features[2][1] },
  ];

  return (
    <section id="capabilities" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            01 / {t.featuresTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.featuresTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-mist pt-16 md:grid-cols-3 md:gap-10">
          {cap.map(({ icon: Icon, title, body }) => (
            <div key={title} className="max-w-sm">
              <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tightish text-ink-900">
                {title}
              </h3>
              <p className="mt-3 text-[17px] leading-[1.55] text-ink-700">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-start gap-3 border-t border-mist pt-8 text-sm text-ink-500">
          <WifiOff size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <p className="max-w-2xl leading-relaxed">
            {t.offlineBadge}. {t.offlineText}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Voice insert — the quiet centerpiece
   ──────────────────────────────────────────────────────────── */

function VoiceInsert({ t }: { t: typeof ru }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-32 lg:py-40">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-tightish text-ink-900 sm:text-[40px]">
            {t.voiceTitle}
          </h2>
          <p className="mt-8 max-w-[62ch] text-[22px] font-light leading-[1.55] text-ink-700">
            {t.voiceBody}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Product moment — one large screenshot, minimal caption
   ──────────────────────────────────────────────────────────── */

function ProductMoment({ t }: { t: typeof ru }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="overflow-hidden rounded-2xl border border-mist bg-mist">
          <img
            src="/app-screenshot.jpg"
            alt="BirLiy — рабочая поверхность"
            className="block w-full"
          />
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-500">{t.productCaption}</p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Why BirLiy — 2x2 type-only
   ──────────────────────────────────────────────────────────── */

function WhyBirliy({ t }: { t: typeof ru }) {
  return (
    <section className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            02 / {t.benefitsTitle}
          </p>
          <h2 className="mt-5 max-w-[18ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.benefitsTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-14 border-t border-mist pt-16 md:grid-cols-2">
          {t.benefits.map(([title, body]) => (
            <div key={title} className="max-w-md">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tightish text-ink-900">
                {title}
              </h3>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Equipment — 2 columns, type + check lists
   ──────────────────────────────────────────────────────────── */

function Equipment({ t }: { t: typeof ru }) {
  return (
    <section id="equipment" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            03 / {t.equipmentTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.equipmentTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-16 gap-y-14 border-t border-mist pt-16 md:grid-cols-2">
          <EquipmentColumn
            icon={Tablet}
            title={t.equipFullTitle}
            desc={t.equipFullDesc}
            items={t.equipFullItems}
          />
          <EquipmentColumn
            icon={Smartphone}
            title={t.equipLiteTitle}
            desc={t.equipLiteDesc}
            items={t.equipLiteItems}
          />
        </div>
      </div>
    </section>
  );
}

interface EquipmentColumnProps {
  icon: typeof Tablet;
  title: string;
  desc: string;
  items: readonly string[];
}

function EquipmentColumn({ icon: Icon, title, desc, items }: EquipmentColumnProps) {
  return (
    <div>
      <Icon size={24} strokeWidth={1.5} className="text-ink-900" />
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tightish text-ink-900">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-[17px] leading-[1.55] text-ink-700">{desc}</p>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-ink-700">
            <Check size={16} strokeWidth={1.5} className="shrink-0 text-ink-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Roadmap — minimal 3-step horizontal sequence
   ──────────────────────────────────────────────────────────── */

function Roadmap({ t }: { t: typeof ru }) {
  return (
    <section className="border-t border-mist bg-mist/40 py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            04 / {t.roadmapTitle}
          </p>
          <h2 className="mt-5 max-w-[20ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.roadmapTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-ink-900/10 pt-12 md:grid-cols-3 md:gap-8">
          {t.roadmap.map(([label, body], i) => (
            <div key={label} className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                {label}
              </div>
              <p className="mt-4 text-[17px] leading-[1.55] text-ink-900">{body}</p>
              {i < t.roadmap.length - 1 && (
                <div className="absolute right-0 top-2 hidden h-px w-12 -translate-y-1/2 bg-ink-900/15 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Lead form section
   ──────────────────────────────────────────────────────────── */

interface LeadSectionProps {
  t: typeof ru;
  locale: Locale;
  attribution: ReturnType<typeof useAttribution>;
}

function LeadSection({ t, locale, attribution }: LeadSectionProps) {
  return (
    <section id="lead" className="border-t border-mist bg-paper py-24 lg:py-32">
      <div className="section-shell grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            05 / {t.formTitle}
          </p>
          <h2 className="mt-5 max-w-[14ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.formTitle}
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.55] text-ink-700">{t.formIntro}</p>
        </div>

        <div className="lg:col-span-7">
          <LeadFormStandalone t={t} locale={locale} attribution={attribution} />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   FAQ — minimal collapsible list, hairlines only
   ──────────────────────────────────────────────────────────── */

function FAQ({ t }: { t: typeof ru }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="border-t border-mist py-24 lg:py-32">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            06 / {t.faqTitle}
          </p>
          <h2 className="mt-5 max-w-[16ch] text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tightish text-ink-900 sm:text-5xl">
            {t.faqTitle}
          </h2>
        </div>

        <div className="mt-16 border-t border-mist">
          {t.faq.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-mist">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-semibold leading-snug tracking-tightish text-ink-900 sm:text-xl">
                    {q}
                  </span>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    className={cn(
                      "mt-1 shrink-0 text-ink-500 transition-transform duration-320 ease-birliy",
                      isOpen && "rotate-180 text-ink-900",
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="max-w-2xl pb-6 pr-10 text-[17px] leading-[1.55] text-ink-700">
                    {a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────────────────────── */

interface FooterProps {
  t: typeof ru;
  locale: Locale;
  switchLocale: (loc: Locale) => void;
}

function Footer({ t, locale, switchLocale }: FooterProps) {
  return (
    <footer className="border-t border-mist py-16">
      <div className="section-shell">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
          <div>
            <img src="/birliy-wordmark.svg" alt="BirLiy" className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-base leading-relaxed text-ink-700">{t.footerTagline}</p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <LangPill locale={locale} switchLocale={switchLocale} />
            <a
              href="https://t.me/birliy_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
            >
              {t.telegram}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-mist pt-6 text-xs leading-relaxed text-ink-500">
          {t.footerSmall}
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   Cookie banner
   ──────────────────────────────────────────────────────────── */

function Cookie({ t }: { t: typeof ru }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(localStorage.getItem("birliy-cookie-ok") !== "true");
  }, []);
  if (!show) return null;

  const accept = () => {
    localStorage.setItem("birliy-cookie-ok", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-2xl border border-mist bg-white p-5 shadow-[0_8px_32px_rgba(11,24,38,0.08)] md:bottom-6 md:left-auto md:right-6 md:max-w-md">
      <p className="text-sm leading-relaxed text-ink-700">{t.cookie}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors duration-200 ease-birliy hover:bg-ink-700"
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
        >
          {t.later}
        </button>
      </div>
    </div>
  );
}
