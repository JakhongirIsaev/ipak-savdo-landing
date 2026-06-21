"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PosDemo } from "./PosDemo";
import { AdminDemo } from "./AdminDemo";
import { LeadSection, LeadModal } from "./LeadSection";
import { CountUp } from "./CountUp";
import { EcosystemStrip } from "./EcosystemStrip";
import { LiveShiftBadge } from "./LiveShiftBadge";
import { PaperVsBirliy } from "./PaperVsBirliy";
import { PriceReceipt } from "./PriceReceipt";
import { useCoarsePointer } from "./useCoarsePointer";
import { dicts } from "@/lib/landing/i18n";
import { POSTS, postCategory } from "@/lib/blog";
import { blogPostPath, blogIndexPath, CATEGORY_LABEL } from "@/lib/blog/i18n";
import { trackSiteEvent } from "@/lib/track/client";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Languages,
  Menu,
  PackageCheck,
  Phone,
  Pill,
  Printer,
  QrCode,
  Receipt,
  ScanLine,
  Send,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  Tablet,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

type Locale = "ru" | "uz";

const EASE = [0.2, 0.8, 0.2, 1] as const;

// BlogPost.image holds ABSOLUTE URLs (https://birliy.uz/...). On the landing
// page serve them same-origin so they resolve to /photos/blog/... locally.
const BLOG_SITE = "https://birliy.uz";
function blogImgPath(url: string): string {
  return url.startsWith(BLOG_SITE) ? url.slice(BLOG_SITE.length) : url;
}

// Latest 3 posts by date, newest first. The comparator returns 0 on equal
// dates so Array.prototype.sort stays stable and ties fall back to the curated
// POSTS order (many posts share one publish date, so a non-zero tie result
// would pick an engine-dependent, wrong set). Computed once at module load.
const LATEST_POSTS = [...POSTS]
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  .slice(0, 3);

const copy = {
  ru: {
    meta: {
      langLabel: "RU",
      otherLang: "UZ",
      badge: "Сделано для Узбекистана",
      eyebrow: "Хватит вести три таблицы",
      title: "BirLiy показывает кассу, склад и деньги в одном экране.",
      titleLead: "BirLiy показывает",
      titleWords: ["кассу", "остатки", "выручку", "долги", "отчёты"],
      titleTail: "в одном экране.",
      subtitle:
        "Касса и склад для магазинов у дома и минимаркетов. BirLiy работает на телефоне: кассир продаёт, вы видите выручку, остатки и смену.",
      primaryCta: "Оставить заявку",
      ctaShort: "Заявка",
      secondaryCta: "Смотреть продукт",
      telegram: "Telegram",
      call: "Позвонить",
      pilot: "Пилотная цена",
      up: "Наверх",
      heroPhotoBadge: "Реальные магазины уже работают",
    },
    nav: [
      { label: "Сценарий", href: "#flow" },
      { label: "Владелец", href: "#owner" },
      { label: "Модули", href: "#modules" },
      { label: "Блог", href: "/ru/blog" },
      { label: "Заявка", href: "#lead" },
    ],
    stats: [
      { label: "Первые 6 месяцев", value: "49 000", suffix: "сум/мес" },
      { label: "Подключение", value: "1", suffix: "день" },
      { label: "База товаров", value: "9 000+", suffix: "SKU" },
      { label: "Способы оплаты", value: "4", suffix: "в одном чеке" },
    ],
    // Condensed three numbers for the mobile first screen (one-screen rule).
    heroNumbers: [
      { value: "49 000", suffix: "сум/мес" },
      { value: "1", suffix: "день" },
      { value: "0", suffix: "оборудования" },
    ],
    segments: ["Магазин у дома", "Минимаркет", "Аптека", "Сервисная точка"],
    scroll: {
      eyebrow: "Живое демо",
      title: "Попробуйте обе роли прямо здесь",
      body: "Это не скриншот. Переключайте кассира и владельца, открывайте любые разделы. Всё кликабельно.",
      hint: "Это живое демо. Нажимайте и листайте разделы в меню слева",
      roleCashier: "Касса · кассир",
      roleOwner: "Админка · владелец",
    },
    pain: {
      eyebrow: "Знакомо?",
      headline: "Сколько товара осталось? Сколько вы заработали сегодня? С тетрадью точного ответа нет.",
      body: "Раньше товары записывали в тетрадь, остатки держали в голове, а выручку сводили поздно вечером. Что-то забыли, что-то потеряли, а к утру уже не вспомнить. BirLiy убирает эту головную боль: касса, склад и деньги в одном телефоне. И вы не остаётесь с этим один на один. Мы подключаем за день, заносим первые товары вместе с вами и учим кассира за полчаса. Не нужно быть «технарём», нужно просто продавать.",
      points: [
        { title: "Тетрадь не показывает остатки", text: "Сколько товара на полке, узнаёте только когда он закончился. Записи отстают от реальности.", icon: Boxes },
        { title: "Кассир не считает выручку сам", text: "Вечером пересчитываете деньги вручную и звоните кассиру, чтобы понять, как прошёл день.", icon: Receipt },
        { title: "QR-оплата живёт отдельно", text: "Касса в тетради, QR на стене, чеки на бумаге. Три разных места, ничего не сходится.", icon: QrCode },
      ],
    },
    segments2: {
      eyebrow: "Главные клиенты",
      title: "Сначала для магазинов у дома и минимаркетов.",
      photoAlt: "QR-оплата в магазине на BirLiy",
      cta: "Подключить мой магазин",
      cards: [
        { key: "shop", title: "Магазин у дома", body: "Продукты, бытовая химия, ежедневные товары. 1 кассир, до 200 чеков в день.", pain: "Боль: тетрадь не показывает остатки и кто сколько должен.", icon: Store },
        { key: "minimarket", title: "Минимаркет", body: "Сотни позиций, несколько кассиров, контроль остатков и смен.", pain: "Боль: трудно проверить кассиров и смены без присутствия в зале.", icon: ShoppingCart },
        { key: "pharmacy", title: "Аптека", body: "Точный учёт по наименованиям, контроль сроков годности.", pain: "Боль: легко потерять срок годности и точный остаток по наименованиям.", icon: Pill },
        { key: "service", title: "Сервисная точка", body: "Ремонт, химчистка, ателье. Приём оплаты и журнал заказов.", pain: "Боль: заказы и оплаты живут на бумажках и теряются.", icon: Wrench },
        { key: "cafe", title: "Кафе и точка еды", body: "Быстрые заказы, оплата на месте, контроль выручки за смену.", pain: "Боль: выручка за смену не сходится, а считать вручную долго.", icon: Coffee },
      ],
    },
    ownerControl: {
      eyebrow: "Для собственника",
      headline: "Магазин как на ладони.",
      body: "Пока касса работает, вы уже видите выручку, остатки и кто за прилавком. Никаких звонков, никаких пересылок. Открыли телефон и видите всю картину.",
      photoAlt: "Владелец магазина с телефоном в торговом зале",
      bullets: [
        "Живая выручка с дельтой ±% прямо сейчас",
        "Журнал смен: кто открыл, кто закрыл",
        "Каждая продажа, возврат и списание с именем кассира",
      ],
    },
    early: {
      eyebrow: "Ранний доступ",
      headline: "Запускаемся с первой группой. Подключим за один день, вместе с вами.",
      applicationNote: "Оставьте заявку: проверим данные магазина и согласуем подключение.",
      photoAlt: "Владельцы магазина смотрят отчёты на планшете",
      cta: "Оставить заявку",
      promises: [
        { title: "Подключаем за один день", caption: "Установка, настройка, первый чек за одну встречу с менеджером." },
        { title: "Помогаем заполнить каталог", caption: "Загружаем товары из Excel или вносим первые 100 SKU вместе." },
        { title: "49 000 сум/мес на старте", caption: "Низкая стартовая цена на первые 6 месяцев: спокойно проверить BirLiy." },
      ],
    },
    blog: {
      eyebrow: "Блог",
      title: "Полезные статьи для владельцев магазинов",
      subtitle: "Короткие разборы про кассу, склад, долги и учёт. Без воды.",
      readMore: "Читать",
      allPosts: "Все статьи",
    },
    faq: {
      eyebrow: "Вопросы и ответы",
      title: "Коротко о главном",
      items: [
        ["Я не разбираюсь в технологиях. Справлюсь?", "Да. BirLiy сделан для владельцев магазинов, не для айтишников. Отсканировал товар → выбрал оплату → чек ушёл. Кассир осваивает за 30 минут, а в первый день мы помогаем лично."],
        ["Сколько стоит и без скрытых списаний?", "Первые 6 месяцев: 49 000 сум/мес, дальше 149 000 сум/мес. Полный функционал, без скрытых платежей. Списаний без вашего согласия не будет."],
        ["Нужен ли компьютер?", "Нет. Достаточно смартфона или планшета. Сканер и принтер по желанию, позже."],
        ["Работает без интернета?", "Да. Продажи сохраняются и синхронизируются, когда связь вернётся."],
        ["Можно импортировать товары?", "Да, из Excel. В продукте уже есть база 9 000+ распространённых SKU, многие товары находятся сразу."],
        ["Можно несколько точек?", "Да. Сводные отчёты и кросс-точечный контроль кассиров доступны для бизнесов с несколькими точками."],
      ],
    },
    command: {
      live: "Рабочая смена",
      revenue: "3 450 000",
      revenueLabel: "Выручка сегодня",
      delta: "+12% ко вчера",
      average: "87 000",
      averageLabel: "Средний чек",
      sales: "42",
      salesLabel: "Продажи",
      stock: "18",
      stockLabel: "Низкие остатки",
      status: "Онлайн",
    },
    flow: {
      eyebrow: "01 / Сценарий на кассе",
      title: "Продажа проходит быстро. Учёт не разваливается после оплаты.",
      body:
        "BirLiy соединяет кассовый экран, способы оплаты и склад. Кассиру не нужно прыгать между приложениями, а владельцу не нужно вручную сводить итоги дня.",
      steps: [
        { title: "Скан", text: "Камера или 2D-сканер добавляет товар в чек.", icon: ScanLine },
        { title: "Чек", text: "Сумма собирается сама, чек готов за секунду.", icon: Receipt },
        { title: "QR", text: "Покупатель видит QR и сканирует его телефоном.", icon: QrCode },
        { title: "Оплата", text: "Наличные, карта, QR или долг остаются в одной смене.", icon: Wallet },
        { title: "Остатки", text: "Остаток и отчёты обновляются сразу после продажи.", icon: PackageCheck },
      ],
    },
    owner: {
      eyebrow: "02 / Панель владельца",
      title: "Я не в магазине, но вижу бизнес.",
      remoteNote: "Дома, в дороге или в другой точке. Открыли телефон и видите магазин в реальном времени.",
      body:
        "Выручка, смены кассиров, возвраты, низкие остатки и структура оплат собраны в один командный экран. Не надо звонить кассиру, чтобы понять, как прошёл день.",
      bullets: ["PIN-роли для владельца и кассира", "Журнал продаж, возвратов и списаний", "Telegram-чеки и дневные итоги"],
      metrics: [
        { label: "Выручка сегодня", value: "3 450 000", detail: "+12% ко вчера" },
        { label: "Кассиры", value: "3", detail: "смены под контролем" },
        { label: "Возвраты", value: "2", detail: "за сегодня" },
        { label: "Заканчиваются", value: "18", detail: "товаров мало" },
      ],
    },
    cashier: {
      eyebrow: "Для кассира",
      title: "Кассир разберётся за 30 минут.",
      body: "Большие кнопки, понятный экран. Кассир входит по своему PIN, сканирует товар камерой или сканером и пробивает чек. Учиться неделю не нужно.",
      photoAlt: "Кассир пробивает товар на телефоне BirLiy",
      features: [
        { title: "Крупные кнопки", text: "Большой экран и понятные надписи. Промахнуться сложно.", icon: ShoppingCart },
        { title: "Вход по PIN", text: "У каждого кассира свой PIN. Видно, кто продал и кто открыл смену.", icon: ShieldCheck },
        { title: "Сканер или камера", text: "Товар добавляется камерой телефона или ручным сканером.", icon: ScanLine },
        { title: "Обучение 30 минут", text: "Кассир осваивает кассу за полчаса. В первый день помогаем лично.", icon: Clock3 },
      ],
    },
    modules: {
      eyebrow: "03 / Что внутри",
      title: "Шесть модулей. Одна программа. Ноль лишних.",
      items: [
        { title: "Касса без лишних шагов", text: "Крупные кнопки, мгновенный поиск товара. Кассир пробивает чек, и покупатель уже уходит.", payoff: "Чек за секунды, без обучения", icon: Store },
        { title: "Склад сам себя считает", text: "Каждый чек списывает остаток. Конец дня, и вы уже знаете, чего не хватает.", payoff: "Товар заканчивается, система предупредит", icon: Boxes },
        { title: "Карта, наличные, QR, долг в одном экране", text: "Четыре способа оплаты. Ни один покупатель не уйдёт с пустыми руками.", payoff: "Один учёт, а не четыре тетрадки", icon: Wallet },
        { title: "Итоги не вечером, а сразу", text: "Выручка, средний чек, топ-товары без пересчёта и таблиц. Смотришь и понимаешь.", payoff: "День, неделя, месяц с одного взгляда", icon: BarChart3 },
        { title: "Ваши права отдельно. Кассира отдельно.", text: "Разные PIN, разные экраны. Кассир видит кассу. Вы видите всё, включая то, чего кассир не знает.", payoff: "Полный журнал по каждому PIN", icon: ShieldCheck },
        { title: "Сегодня телефон, сегодня работаете", text: "Никакой поставки оборудования. Сканер и принтер, если хотите, потом. Касса прямо сейчас.", payoff: "Старт с телефона, оборудование потом", icon: Smartphone },
      ],
    },
    rollout: {
      eyebrow: "04 / Запуск",
      title: "От пустого приложения до первого чека за один рабочий день.",
      body:
        "BirLiy запускается как сервис: настройка, каталог, обучение кассира и сверка первого дня вместе с командой.",
      chip: "Подключение за 1 день",
      steps: [
        "Установка и настройка точки",
        "Импорт товаров из Excel или первые SKU",
        "Обучение кассира за 30 минут",
        "Первый чек вместе с командой",
      ],
    },
    price: {
      eyebrow: "Пилотная цена",
      amount: "49 000",
      suffix: "сум / месяц",
      body: "Первые 6 месяцев: 49 000 сум/мес. Дальше прозрачно: 149 000 сум в месяц. Полный функционал и помощь с запуском.",
      bullets: ["Касса, склад, QR-оплата и отчёты", "Без обязательной покупки оборудования в первый день", "Помощь с первым запуском"],
      cta: "Подать заявку",
    },
    footer: {
      tagline: "Ваш бизнес. В одном месте.",
      cols: [
        { title: "Продукт", links: [["Демо", "#reveal"], ["Модули", "#modules"], ["Для собственника", "#owner"], ["FAQ", "#faq"], ["Блог", "/ru/blog"]] },
        { title: "Для кого", links: [["Магазин у дома", "#segments"], ["Минимаркет", "#segments"], ["Аптека", "#segments"], ["Сервис", "#segments"]] },
        { title: "Подключение", links: [["Ранний доступ", "#early-access"], ["Цена", "#lead"], ["Заявка", "#lead"]] },
      ],
      contactTitle: "Контакт",
      telegram: "@bir_liy",
      telegramHref: "https://t.me/bir_liy",
      support: "Связаться с нами",
      supportHref: "https://t.me/birliy_support_bot",
      phone: "+998 97 421 24 54",
      copyright: "© 2026 BirLiy.",
    },
  },
  uz: {
    meta: {
      langLabel: "UZ",
      otherLang: "RU",
      badge: "O'zbekiston uchun yaratilgan",
      eyebrow: "Endi uchta jadval yuritmang",
      title: "BirLiy kassa, ombor va pul oqimini bitta ekranda ko'rsatadi.",
      titleLead: "BirLiy",
      titleWords: ["kassani", "qoldiqlarni", "tushumni", "qarzlarni", "hisobotlarni"],
      titleTail: "bitta ekranda ko'rsatadi.",
      subtitle:
        "Uy yonidagi do'kon va minimarketlar uchun kassa va ombor. BirLiy telefonda ishlaydi: kassir sotadi, siz tushum, qoldiq va smenani ko'rasiz.",
      primaryCta: "Ariza qoldirish",
      ctaShort: "Ariza",
      secondaryCta: "Mahsulotni ko'rish",
      telegram: "Telegram",
      call: "Qo'ng'iroq",
      pilot: "Pilot narx",
      up: "Yuqoriga",
      heroPhotoBadge: "Haqiqiy do'konlar allaqachon ishlamoqda",
    },
    nav: [
      { label: "Jarayon", href: "#flow" },
      { label: "Egasi", href: "#owner" },
      { label: "Modullar", href: "#modules" },
      { label: "Blog", href: "/blog" },
      { label: "Ariza", href: "#lead" },
    ],
    stats: [
      { label: "Birinchi 6 oy", value: "49 000", suffix: "so'm/oy" },
      { label: "Ulanish", value: "1", suffix: "kun" },
      { label: "Tovar bazasi", value: "9 000+", suffix: "SKU" },
      { label: "To'lov usullari", value: "4", suffix: "bitta chekda" },
    ],
    // Condensed three numbers for the mobile first screen (one-screen rule).
    heroNumbers: [
      { value: "49 000", suffix: "so'm/oy" },
      { value: "1", suffix: "kun" },
      { value: "0", suffix: "uskuna" },
    ],
    segments: ["Uy yonidagi do'kon", "Minimarket", "Dorixona", "Servis nuqtasi"],
    scroll: {
      eyebrow: "Jonli demo",
      title: "Ikkala rolni shu yerda sinab ko'ring",
      body: "Bu skrinshot emas. Kassir va egasini almashtiring, istalgan bo'limni oching. Hammasi bosiladi.",
      hint: "Bu jonli demo. Bosing va chapdagi menyudan bo'limlarni oching",
      roleCashier: "Kassa · kassir",
      roleOwner: "Admin · ega",
    },
    pain: {
      eyebrow: "Tanish?",
      headline: "Qancha tovar qoldi? Bugun qancha ishladingiz? Daftar bilan aniq javob yo'q.",
      body: "Ilgari tovarlarni daftarga yozardingiz, qoldiqni xayolda sanardingiz, tushumni esa kechqurun zo'rg'a yig'ardingiz. Biror narsa esdan chiqadi, biror narsa yo'qoladi, ertalabga borib eslay olmaysiz. BirLiy bu bosh og'rig'ini olib tashlaydi: kassa, ombor va pul bitta telefonda. Va siz bu ishda yolg'iz qolmaysiz. Bir kunda ulaymiz, birinchi tovarlarni siz bilan birga kiritamiz va kassirni yarim soatda o'rgatamiz. «Texnik» bo'lish shart emas, shunchaki sotsangiz bo'ldi.",
      points: [
        { title: "Daftar qoldiqni ko'rsatmaydi", text: "Javonda qancha tovar borligini faqat u tugaganda bilasiz. Yozuvlar haqiqatdan orqada qoladi.", icon: Boxes },
        { title: "Kassir tushumni o'zi sanamaydi", text: "Kechqurun pulni qo'lda qayta sanaysiz va kun qanday o'tganini bilish uchun kassirga qo'ng'iroq qilasiz.", icon: Receipt },
        { title: "QR-to'lov alohida yashaydi", text: "Kassa daftarda, QR devorda, cheklar qog'ozda. Uch xil joy, hech narsa to'g'ri kelmaydi.", icon: QrCode },
      ],
    },
    segments2: {
      eyebrow: "Asosiy mijozlar",
      title: "Avvalo uy yonidagi do'kon va minimarketlar uchun.",
      photoAlt: "BirLiy do'konida QR-to'lov",
      cta: "Do'konimni ulash",
      cards: [
        { key: "shop", title: "Uy yonidagi do'kon", body: "Oziq-ovqat, maishiy kimyo, kundalik tovarlar. 1 kassir, kuniga 200 tagacha chek.", pain: "Muammo: daftar qoldiq va kim qancha qarzdorligini ko'rsatmaydi.", icon: Store },
        { key: "minimarket", title: "Minimarket", body: "Yuzlab pozitsiya, bir necha kassir, qoldiq va smenalar nazorati.", pain: "Muammo: zalda bo'lmasdan kassir va smenalarni tekshirish qiyin.", icon: ShoppingCart },
        { key: "pharmacy", title: "Dorixona", body: "Nomlar bo'yicha aniq hisob, yaroqlilik muddatlari nazorati.", pain: "Muammo: yaroqlilik muddati va aniq qoldiqni yo'qotish oson.", icon: Pill },
        { key: "service", title: "Xizmat nuqtasi", body: "Ta'mirlash, kimyoviy tozalash, tikuvchilik. To'lov va buyurtmalar jurnali.", pain: "Muammo: buyurtma va to'lovlar qog'ozda qoladi va yo'qoladi.", icon: Wrench },
        { key: "cafe", title: "Kafe va ovqat nuqtasi", body: "Tez buyurtmalar, joyida to'lov, smena tushumini nazorat.", pain: "Muammo: smena tushumi to'g'ri kelmaydi, qo'lda hisoblash uzoq.", icon: Coffee },
      ],
    },
    ownerControl: {
      eyebrow: "Egasi uchun",
      headline: "Do'kon qo'lingizning kaftida.",
      body: "Kassa ishlayotgan paytda siz allaqachon tushum, qoldiqlar va kimning kassada turganini ko'rasiz. Qo'ng'iroq ham yo'q, xabar ham yo'q. Telefonni ochdingiz, butun manzara ko'z oldingizda.",
      photoAlt: "Do'kon egasi savdo zalida telefon bilan",
      bullets: [
        "Jonli tushum ±% delta bilan, ayni shu daqiqada",
        "Smenalar jurnali: kim ochdi, kim yopdi",
        "Har bir sotuv, qaytarish va hisobdan chiqarish kassir ismi bilan",
      ],
    },
    early: {
      eyebrow: "Erta kirish",
      headline: "Birinchi guruh bilan ishga tushmoqdamiz. Bir kunda ulaymiz, siz bilan birga.",
      applicationNote: "Ariza qoldiring: do'kon ma'lumotlarini tekshirib, ulanishni kelishamiz.",
      photoAlt: "Do'kon egalari planshetda hisobotlarni ko'rmoqda",
      cta: "Ariza qoldirish",
      promises: [
        { title: "Bir kunda ulaymiz", caption: "O'rnatish, sozlash, birinchi chek menejer bilan bitta uchrashuvda." },
        { title: "Katalogni to'ldirishga yordam", caption: "Tovarlarni Exceldan yuklaymiz yoki birinchi 100 SKU'ni birga kiritamiz." },
        { title: "Startda 49 000 so'm/oy", caption: "Birinchi 6 oyga past start narxi: BirLiy'ni bemalol sinab ko'rasiz." },
      ],
    },
    blog: {
      eyebrow: "Blog",
      title: "Do'kon egalari uchun foydali maqolalar",
      subtitle: "Kassa, ombor, qarz va hisob haqida qisqa va aniq.",
      readMore: "O'qish",
      allPosts: "Barcha maqolalar",
    },
    faq: {
      eyebrow: "Savol va javoblar",
      title: "Qisqacha asosiy narsalar",
      items: [
        ["Men texnologiyani tushunmayman. Eplay olamanmi?", "Ha. BirLiy do'kon egalari uchun, IT-mutaxassislar uchun emas. Tovarni skaner qildingiz → to'lovni tanladingiz → chek ketdi. Kassir 30 daqiqada o'rganadi, birinchi kuni shaxsan yordam beramiz."],
        ["Qancha turadi, yashirin to'lovlar bormi?", "Birinchi 6 oy: 49 000 so'm/oy, keyin 149 000 so'm/oy. To'liq funksionallik, yashirin to'lovlarsiz. Roziligingizsiz hech narsa yechib olinmaydi."],
        ["Kompyuter kerakmi?", "Yo'q. Smartfon yoki planshet yetarli. Skaner va printer keyin, xohishga ko'ra."],
        ["Internetsiz ishlaydimi?", "Ha. Sotuvlar saqlanadi va aloqa tiklanganda sinxronlanadi."],
        ["Tovarlarni import qilish mumkinmi?", "Ha, Excel orqali. Mahsulotda 9 000+ keng tarqalgan SKU bazasi bor, ko'p tovarlar darhol topiladi."],
        ["Bir necha nuqtada ishlaydimi?", "Ha. Bir nechta nuqtaga ega bizneslar uchun yig'ma hisobotlar va kassirlarni nuqtalararo nazorat qilish mavjud."],
      ],
    },
    command: {
      live: "Ish smenasi",
      revenue: "3 450 000",
      revenueLabel: "Bugungi tushum",
      delta: "+12% kechagiga nisbatan",
      average: "87 000",
      averageLabel: "O'rtacha chek",
      sales: "42",
      salesLabel: "Sotuvlar",
      stock: "18",
      stockLabel: "Kam qolgan tovarlar",
      status: "Onlayn",
    },
    flow: {
      eyebrow: "01 / Kassadagi jarayon",
      title: "Sotuv tez o'tadi. Hisob to'lovdan keyin buzilib ketmaydi.",
      body:
        "BirLiy kassa ekrani, to'lov usullari va omborni bog'laydi. Kassir ilovalar orasida almashmaydi, egasi esa kun yakunini qo'lda hisoblamaydi.",
      steps: [
        { title: "Skan", text: "Kamera yoki 2D-skaner tovarni chekka qo'shadi.", icon: ScanLine },
        { title: "Chek", text: "Summa o'zi yig'iladi, chek bir soniyada tayyor.", icon: Receipt },
        { title: "QR", text: "Xaridor QR'ni ko'radi va telefoni bilan skanerlaydi.", icon: QrCode },
        { title: "To'lov", text: "Naqd, karta, QR yoki qarz bitta smenada qoladi.", icon: Wallet },
        { title: "Qoldiq", text: "Qoldiq va hisobotlar sotuvdan keyin darhol yangilanadi.", icon: PackageCheck },
      ],
    },
    owner: {
      eyebrow: "02 / Egasi paneli",
      title: "Men do'konda emasman, lekin biznesni ko'rib turibman.",
      remoteNote: "Uyda, yo'lda yoki boshqa nuqtada. Telefonni ochdingiz, do'konni real vaqtda ko'rasiz.",
      body:
        "Tushum, kassir smenalari, qaytarishlar, kam qolgan tovarlar va to'lov tarkibi bitta boshqaruv ekranida. Kun qanday o'tganini bilish uchun kassirga qo'ng'iroq qilish shart emas.",
      bullets: ["Egasi va kassir uchun PIN-rollar", "Sotuv, qaytarish va hisobdan chiqarish jurnali", "Telegram-cheklar va kunlik yakunlar"],
      metrics: [
        { label: "Bugungi tushum", value: "3 450 000", detail: "+12% kechagiga" },
        { label: "Kassirlar", value: "3", detail: "smenalar nazoratda" },
        { label: "Qaytarishlar", value: "2", detail: "bugun" },
        { label: "Tugayapti", value: "18", detail: "tovar kamaygan" },
      ],
    },
    cashier: {
      eyebrow: "Kassir uchun",
      title: "Kassir 30 daqiqada o'rganadi.",
      body: "Katta tugmalar, tushunarli ekran. Kassir o'z PIN'i bilan kiradi, tovarni kamera yoki skaner bilan o'qiydi va chek uradi. Bir hafta o'qishning hojati yo'q.",
      photoAlt: "Kassir BirLiy telefonida tovarni chek qilmoqda",
      features: [
        { title: "Katta tugmalar", text: "Katta ekran va tushunarli yozuvlar. Adashish qiyin.", icon: ShoppingCart },
        { title: "PIN bilan kirish", text: "Har bir kassirning o'z PIN'i bor. Kim sotgani va kim smena ochgani ko'rinadi.", icon: ShieldCheck },
        { title: "Skaner yoki kamera", text: "Tovar telefon kamerasi yoki qo'l skaneri bilan qo'shiladi.", icon: ScanLine },
        { title: "30 daqiqalik o'qitish", text: "Kassir kassani yarim soatda o'rganadi. Birinchi kuni shaxsan yordam beramiz.", icon: Clock3 },
      ],
    },
    modules: {
      eyebrow: "03 / Ichida nima bor",
      title: "Olti modul. Bitta dastur. Ortiqcha hech narsa.",
      items: [
        { title: "Kassa, ortiqcha qadamsiz", text: "Katta tugmalar, tezkor qidiruv. Kassir chek urdi, xaridor ketdi.", payoff: "Soniyalarda chek, o'qitmasdan", icon: Store },
        { title: "Ombor o'zini o'zi sanaydi", text: "Har bir chek qoldiqni kamaytiradi. Kun oxirida nimaning yetishmayotganini allaqachon bilasiz.", payoff: "Tovar tugayotgan bo'lsa, tizim ogohlantiradi", icon: Boxes },
        { title: "Karta, naqd, QR, qarz bitta ekranda", text: "To'rt to'lov usuli. Birorta xaridor quruq ketmaydi.", payoff: "Bitta hisobot, to'rtta daftar emas", icon: Wallet },
        { title: "Yakunlar kechqurun emas, hoziroq", text: "Tushum, o'rtacha chek, eng ko'p sotilganlar jadvalsiz, hisob-kitobsiz. Qaradingiz va tushundingiz.", payoff: "Kun, hafta, oy bir qarashda", icon: BarChart3 },
        { title: "Sizning huquqingiz alohida. Kassirniki alohida.", text: "Har xil PIN, har xil ekranlar. Kassir kassani ko'radi. Siz hamma narsani ko'rasiz, kassir bilmaganini ham.", payoff: "Har bir PIN bo'yicha to'liq jurnal", icon: ShieldCheck },
        { title: "Bugun telefon bor, bugun ishladingiz", text: "Hech qanday uskunani kutmaysiz. Skaner va printer xohlasangiz, keyin. Kassa esa hozir.", payoff: "Telefondan start, uskunalar keyin", icon: Smartphone },
      ],
    },
    rollout: {
      eyebrow: "04 / Ishga tushirish",
      title: "Bo'sh ilovadan birinchi chekgacha bir ish kunida.",
      body:
        "BirLiy servisli start sifatida ishga tushadi: sozlash, katalog, kassirni o'rgatish va birinchi kunni jamoa bilan tekshirish.",
      chip: "1 kunda ulanish",
      steps: [
        "Nuqtani o'rnatish va sozlash",
        "Excel'dan tovar import qilish yoki ilk SKU",
        "Kassirni 30 daqiqada o'rgatish",
        "Jamoa bilan birinchi chek",
      ],
    },
    price: {
      eyebrow: "Pilot narx",
      amount: "49 000",
      suffix: "so'm / oy",
      body: "Birinchi 6 oy: oyiga 49 000 so'm. Keyin shaffof: oyiga 149 000 so'm. To'liq funksiyalar va ishga tushirishda yordam.",
      bullets: ["Kassa, ombor, QR-to'lov va hisobotlar", "Birinchi kuni majburiy uskuna xaridi yo'q", "Birinchi startda yordam"],
      cta: "Ariza topshirish",
    },
    footer: {
      tagline: "Sizning biznesingiz. Bitta joyda.",
      cols: [
        { title: "Mahsulot", links: [["Demo", "#reveal"], ["Modullar", "#modules"], ["Egasi uchun", "#owner"], ["FAQ", "#faq"], ["Blog", "/blog"]] },
        { title: "Kimlar uchun", links: [["Uy yonidagi do'kon", "#segments"], ["Minimarket", "#segments"], ["Dorixona", "#segments"], ["Xizmat", "#segments"]] },
        { title: "Ulanish", links: [["Erta kirish", "#early-access"], ["Narx", "#lead"], ["Ariza", "#lead"]] },
      ],
      contactTitle: "Kontakt",
      telegram: "@bir_liy",
      telegramHref: "https://t.me/bir_liy",
      support: "Bizga murojaat uchun",
      supportHref: "https://t.me/birliy_support_bot",
      phone: "+998 97 421 24 54",
      copyright: "© 2026 BirLiy.",
    },
  },
} as const;

function fade(delay = 0, reduce = false) {
  if (reduce) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASE, delay },
  };
}

function reveal(delay = 0, reduce = false) {
  if (reduce) {
    // `animate` (not whileInView) so elements already mounted with the
    // animated variant snap visible the moment `reduce` flips on hydration.
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.55, ease: EASE, delay },
  };
}

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <p className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-normal ${dark ? "text-green-300" : "text-green-800"}`}>
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {children}
    </p>
  );
}

// Rotating-word headline, adapted from tommyjepsen "animated-hero" (21st.dev).
function HeroTitle({
  lead,
  words,
  tail,
  reduce,
}: {
  lead: string;
  words: readonly string[];
  tail: string;
  reduce: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timeout = setTimeout(() => {
      setIndex((current) => (current === words.length - 1 ? 0 : current + 1));
    }, 2200);
    return () => clearTimeout(timeout);
  }, [index, words, reduce]);

  return (
    <>
      <span className="block">{lead}</span>
      <span className="relative flex h-[1.15em] w-full justify-start overflow-hidden">
        {reduce ? (
          <span className="text-green-300">{words[0]}</span>
        ) : (
          words.map((word, wordIndex) => (
            <motion.span
              key={word}
              className="absolute left-0 text-green-300"
              initial={wordIndex === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
              animate={
                index === wordIndex
                  ? { y: 0, opacity: 1 }
                  : { y: index > wordIndex ? -90 : 90, opacity: 0 }
              }
            >
              {word}
            </motion.span>
          ))
        )}
      </span>
      <span className="block">{tail}</span>
    </>
  );
}

export default function ConceptLanding({ initialLocale = "uz" }: { initialLocale?: Locale }) {
  // Each locale has its own route (/ = uz, /ru = ru), so the active locale is
  // fixed per page; the language control is real navigation, not a state toggle.
  const locale = initialLocale;
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoRole, setDemoRole] = useState<"cashier" | "owner">("cashier");
  const [setupTab, setSetupTab] = useState<"phone" | "setup">("phone");
  const [faqOpen, setFaqOpen] = useState<number>(0);
  // Refs to the FAQ question buttons so Up/Down/Home/End move focus between them
  // (BR-11 keyboard navigation for the accordion).
  const faqBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const toggleFaq = (index: number) => {
    const willOpen = faqOpen !== index;
    setFaqOpen(willOpen ? index : -1);
    if (willOpen) trackSiteEvent("faq_open", { question_id: index });
  };
  const onFaqKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number, total: number) => {
    let next = -1;
    if (e.key === "ArrowDown") next = (index + 1) % total;
    else if (e.key === "ArrowUp") next = (index - 1 + total) % total;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total - 1;
    if (next >= 0) {
      e.preventDefault();
      faqBtnRefs.current[next]?.focus();
    }
  };
  const [leadOpen, setLeadOpen] = useState(false);
  const [heroGone, setHeroGone] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const openLead = (placement: string, segment?: string) => {
    trackSiteEvent("cta_click", segment ? { placement, segment } : { placement });
    setLeadOpen(true);
  };
  const prefersReduce = useReducedMotion() ?? false;
  const coarse = useCoarsePointer();
  const reduce = prefersReduce || coarse;
  const t = copy[locale];

  // Where the language switch navigates, plus an accessible name that contains
  // the visible "UZ"/"RU" label (WCAG 2.5.3).
  const otherHref = locale === "ru" ? "/" : "/ru";
  const switchLangLabel = locale === "ru" ? "Сменить язык на узбекский (UZ)" : "Tilni ruschaga almashtirish (RU)";

  // Cleaned phone for a tappable tel: link (the display value carries spaces).
  const telHref = `tel:${t.footer.phone.replace(/[^+\d]/g, "")}`;
  const otherLocale: Locale = locale === "ru" ? "uz" : "ru";
  const trackLangSwitch = () =>
    trackSiteEvent("language_switch", { from_lang: locale, to_lang: otherLocale });

  // Keep <html lang> in sync with the active locale (app/layout.tsx hardcodes "uz").
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Mobile sticky CTA visibility. Show it only once the hero (which has its own
  // CTA) has scrolled away, and hide it again as soon as the lead section or the
  // footer enters view, so the bar never overlaps the lead CTA, footer links or
  // language controls. Hidden entirely while the lead modal is open.
  useEffect(() => {
    const hero = document.getElementById("top");
    const tail = [document.getElementById("lead"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting), {
        rootMargin: "-40% 0px",
      });
      io.observe(hero);
      observers.push(io);
    }

    if (tail.length > 0) {
      const visible = new Set<Element>();
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setNearBottom(visible.size > 0);
      });
      tail.forEach((el) => io.observe(el));
      observers.push(io);
    }

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const showSticky = heroGone && !nearBottom && !leadOpen;

  // react-dom 18.x does not serialize the `inert` attribute, so toggle the DOM
  // property imperatively. This makes the hidden sticky bar fully non-interactive
  // (descendants are not focusable or clickable) while the slide transition runs.
  const stickyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stickyRef.current;
    if (el) el.inert = !showSticky;
  }, [showSticky]);

  return (
    <main className="min-h-screen bg-[#f4f6f1] text-ink-900 antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-extrabold focus:text-ink-900 focus:shadow-lg"
      >
        {locale === "ru" ? "Перейти к содержимому" : "Asosiy qismga o'tish"}
      </a>
      <section className="relative overflow-hidden bg-[#08131c] text-white">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_-8%,rgba(3,183,61,0.16),transparent_56%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:36px_36px]"
        />
        {/* Drifting aurora glows use a hyphen '-', comma, or period (no long dash) decorative, sit below the z-10 content. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, 36, 0], y: [0, -28, 0], opacity: [0.45, 0.72, 0.45] }}
          transition={reduce ? undefined : { duration: 16, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -top-32 right-[-8%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(3,183,61,0.30),transparent_62%)] blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 24, 0], opacity: [0.28, 0.5, 0.28] }}
          transition={reduce ? undefined : { duration: 21, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute bottom-[-14%] left-[-6%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(16,160,118,0.22),transparent_64%)] blur-3xl"
        />

        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="inline-flex min-h-11 items-center" aria-label="BirLiy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birliy-wordmark-white.png" alt="BirLiy" width={1072} height={360} className="h-8 w-auto" />
          </a>

          <nav className="hidden items-center gap-1 rounded-lg border border-white/14 bg-white/8 p-1 backdrop-blur md:flex">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="min-h-10 rounded-md px-4 py-2 text-sm font-semibold text-white/78 transition-colors duration-200 ease-birliy hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={otherHref}
              onClick={trackLangSwitch}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/16 bg-white/8 px-3 py-2 text-sm font-extrabold text-white transition-colors duration-200 ease-birliy hover:bg-white/12"
              aria-label={switchLangLabel}
            >
              <Languages size={16} />
              {t.meta.otherLang}
            </a>
            <button
              type="button"
              onClick={() => openLead("header")}
              className="hidden min-h-11 items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-extrabold text-white transition-colors duration-200 ease-birliy hover:bg-green-800 sm:inline-flex"
            >
              {t.meta.primaryCta}
            </button>
            {/* Compact header CTA for mobile: keeps "Заявка" visible in the top
                bar on phones (the full button shows at sm:). */}
            <button
              type="button"
              onClick={() => openLead("header")}
              className="inline-flex min-h-11 items-center rounded-lg bg-green-700 px-3 text-sm font-extrabold text-white transition-colors duration-200 ease-birliy hover:bg-green-800 sm:hidden"
            >
              {t.meta.ctaShort}
            </button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/16 bg-white/8 text-white md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="concept-mobile-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {menuOpen && (
          <nav id="concept-mobile-menu" className="relative z-20 border-y border-white/10 bg-[#08131c]/96 px-4 py-3 md:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {t.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-2 text-base font-semibold text-white/82"
                >
                  {item.label}
                </a>
              ))}
              <button type="button" onClick={() => { setMenuOpen(false); openLead("mobile_menu"); }} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg bg-green-700 px-4 font-extrabold text-white">
                {t.meta.primaryCta}
              </button>
            </div>
          </nav>
        )}

        <div id="top" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-5 sm:gap-12 sm:pb-10 sm:pt-8 md:pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-14 sm:px-6">
          <div>
            {/* Hero renders statically: it is the LCP element and must be visible
                in SSR HTML, not gated behind JS hydration (PageSpeed mobile). */}
            <motion.p {...fade(0, true)} className="text-xs font-semibold uppercase tracking-normal text-green-300 sm:text-sm">
              {t.meta.eyebrow}
            </motion.p>
            {/* Mobile caps the H1 at text-4xl so the offer + numbers + CTA fit one
                390x844 screen without scroll (BR-02); desktop sizes are unchanged. */}
            <motion.h1 {...fade(0.12, true)} className="mt-3 max-w-[16ch] text-4xl font-extrabold leading-[1.06] tracking-normal text-white sm:mt-4 sm:text-6xl sm:leading-[1.05] lg:text-7xl">
              <HeroTitle lead={t.meta.titleLead} words={t.meta.titleWords} tail={t.meta.titleTail} reduce={reduce} />
            </motion.h1>
            <motion.p {...fade(0.2, true)} className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/78 sm:mt-6 sm:text-xl sm:leading-8">
              {t.meta.subtitle}
            </motion.p>

            {/* Condensed three-number row: visible on mobile only, so the offer
                proof stays above the fold. Replaced by the 4-card grid at sm:. */}
            <motion.div {...fade(0.28, true)} className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
              {t.heroNumbers.map((stat) => (
                <div key={stat.suffix} className="rounded-lg border border-white/12 bg-white/8 px-2.5 py-3 text-center backdrop-blur">
                  <CountUp value={stat.value} className="block text-2xl font-extrabold leading-none text-white" />
                  <span className="mt-1 block text-[11px] font-semibold leading-tight text-white/62">{stat.suffix}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fade(0.26, true)} className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <button
                type="button"
                onClick={() => openLead("hero")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.88)] transition duration-200 ease-birliy hover:bg-green-800 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                {t.meta.primaryCta}
                <ArrowRight size={18} />
              </button>
              <a
                href={t.footer.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSiteEvent("telegram_click", { cta_location: "hero" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/8 px-5 py-3 font-extrabold text-white backdrop-blur transition-colors duration-200 ease-birliy hover:bg-white/12 sm:hidden"
              >
                <Send size={18} />
                {t.meta.telegram}
              </a>
              <a
                href="#reveal"
                onClick={() => trackSiteEvent("product_demo_click", { placement: "hero" })}
                className="hidden min-h-12 items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/8 px-5 py-3 font-extrabold text-white backdrop-blur transition-colors duration-200 ease-birliy hover:bg-white/12 sm:inline-flex"
              >
                {t.meta.secondaryCta}
              </a>
            </motion.div>

            {/* Full four-card grid: desktop and tablet only. Hidden on mobile in
                favour of the condensed numbers above. */}
            <motion.div {...fade(0.34, true)} className="mt-9 hidden gap-3 sm:grid sm:grid-cols-2">
              {t.stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/12 bg-white/8 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-normal text-white/48">{stat.label}</p>
                  <p className="mt-2 flex flex-wrap items-end gap-2">
                    <CountUp value={stat.value} className="text-3xl font-extrabold leading-none text-white" />
                    <span className="text-sm font-semibold text-white/62">{stat.suffix}</span>
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fade(0.28, true)} className="relative mx-auto w-full max-w-[520px]">
            {/* Green halo behind the editorial portrait. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-[radial-gradient(58%_52%_at_50%_38%,rgba(3,183,61,0.42),transparent_70%)] blur-2xl"
            />
            <div className="overflow-hidden rounded-[1.6rem] border border-white/12 shadow-[0_44px_100px_-44px_rgba(0,0,0,0.9)]">
              <Image
                src="/photos/owner-tablet.jpg"
                alt={locale === "ru" ? "Владелец магазина работает с BirLiy на планшете" : "Do'kon egasi BirLiy bilan planshetda ishlamoqda"}
                width={1120}
                height={840}
                priority
                quality={65}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <LiveShiftBadge
              locale={locale}
              label={t.command.revenueLabel}
              value={t.command.revenue}
              delta={t.command.delta}
              status={t.command.status}
            />
            <motion.div
              initial={false}
              animate={reduce ? undefined : { y: [0, -7, 0] }}
              transition={reduce ? undefined : { duration: 5, ease: "easeInOut", repeat: Infinity }}
              className="absolute -bottom-4 -left-3 flex items-center gap-2 rounded-xl border border-white/14 bg-[#0b1826]/92 px-4 py-3 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-semibold text-white">{t.meta.heroPhotoBadge}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <EcosystemStrip locale={locale} />

      <section id="pain" className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        {/* decorative brand-green aurora use a hyphen '-', comma, or period (no long dash) LCP-safe, never gates text */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }}
          transition={reduce ? undefined : { duration: 9, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -top-24 -left-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(3,183,61,0.16),transparent_65%)] blur-2xl"
        />
        <div aria-hidden className="pointer-events-none absolute top-1/3 -right-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(3,183,61,0.10),transparent_70%)] blur-3xl" />
        <span
          aria-hidden
          className="select-none pointer-events-none absolute -top-10 right-2 hidden text-[14rem] font-black leading-none text-green-700/[0.06] sm:block sm:text-[18rem]"
        >
          ?
        </span>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="relative max-w-4xl">
            <motion.span
              aria-hidden
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={reduce ? undefined : { scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={reduce ? undefined : { duration: 0.7, ease: EASE, delay: 0.15 }}
              style={{ transformOrigin: "top" }}
              className="absolute -left-4 top-1 hidden h-[calc(100%-0.5rem)] w-1.5 rounded-full bg-gradient-to-b from-green-500 to-green-700 sm:block"
            />
            <SectionLabel>{t.pain.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-[1.12] tracking-normal text-ink-900 drop-shadow-[0_1px_0_rgba(8,19,28,0.04)] sm:text-4xl lg:text-[2.75rem]">{t.pain.headline}</h2>
            <motion.p {...reveal(0.18, reduce)} className="mt-6 max-w-2xl text-lg leading-8 text-ink-700">{t.pain.body}</motion.p>
          </motion.div>
          {/* Three owner-language pains (BR-05): scannable cards a shop owner recognises at a glance. */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {t.pain.points.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.article
                  key={point.title}
                  {...reveal(0.08 + index * 0.08, reduce)}
                  className="group relative overflow-hidden rounded-2xl border border-[#e4d9d9] bg-[#fffaf8] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition duration-300 ease-birliy hover:-translate-y-1 hover:border-[#e0b4ad] hover:shadow-[0_22px_50px_-30px_rgba(180,40,30,0.32)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#fdecea] text-[#c0392b] ring-1 ring-[#f0cfca]">
                    <Icon size={21} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-extrabold leading-6 tracking-normal text-ink-900">{point.title}</h3>
                  <p className="mt-2 leading-7 text-ink-500">{point.text}</p>
                </motion.article>
              );
            })}
          </div>
          <motion.div {...reveal(0.1, reduce)} className="mx-auto mt-12 max-w-3xl">
            <PaperVsBirliy locale={locale} />
          </motion.div>
        </div>
      </section>

      <section id="reveal" className="relative overflow-hidden bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        {/* Decorative ambient stage use a hyphen '-', comma, or period (no long dash) sits below content, gated on reduce like the hero auroras. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -22, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={reduce ? undefined : { duration: 18, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -top-24 right-[-6%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(3,183,61,0.22),transparent_62%)] blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -26, 0], y: [0, 20, 0], opacity: [0.22, 0.45, 0.22] }}
          transition={reduce ? undefined : { duration: 23, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -bottom-20 left-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(16,160,118,0.16),transparent_64%)] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(rgba(11,24,38,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-green-700">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {t.scroll.eyebrow}
            </p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-5xl">{t.scroll.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink-700">{t.scroll.body}</p>
          </motion.div>

          <motion.div {...reveal(0.06, reduce)} className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-[#d9e2db] bg-white p-1 shadow-[0_1px_2px_rgba(11,24,38,0.06)]">
              <button
                type="button"
                onClick={() => { setDemoRole("cashier"); trackSiteEvent("demo_interaction", { role: "cashier", step: "role_switch" }); }}
                aria-pressed={demoRole === "cashier"}
                className={`min-h-10 rounded-full px-4 text-sm font-extrabold transition sm:px-5 ${demoRole === "cashier" ? "bg-green-700 text-white" : "text-ink-700 hover:text-ink-900"}`}
              >
                {t.scroll.roleCashier}
              </button>
              <button
                type="button"
                onClick={() => { setDemoRole("owner"); trackSiteEvent("demo_interaction", { role: "owner", step: "role_switch" }); }}
                aria-pressed={demoRole === "owner"}
                className={`min-h-10 rounded-full px-4 text-sm font-extrabold transition sm:px-5 ${demoRole === "owner" ? "bg-green-700 text-white" : "text-ink-700 hover:text-ink-900"}`}
              >
                {t.scroll.roleOwner}
              </button>
            </div>
          </motion.div>

          <motion.div {...reveal(0.1, reduce)} className="relative mx-auto mt-6 max-w-5xl">
            {/* Breathing green halo use a hyphen '-', comma, or period (no long dash) the demo reads as powered-on. */}
            <motion.div
              aria-hidden
              initial={false}
              animate={reduce ? undefined : { opacity: [0.4, 0.75, 0.4], scale: [1, 1.04, 1] }}
              transition={reduce ? undefined : { duration: 6, ease: "easeInOut", repeat: Infinity }}
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(3,183,61,0.30),transparent_70%)] blur-2xl"
            />
            <div
              className="rounded-[28px] border-4 border-[#1b2733] bg-[#0b1826] p-2 shadow-[0_40px_90px_-50px_rgba(11,24,38,0.85)] transition-transform duration-300 ease-birliy hover:-translate-y-1.5 hover:shadow-[0_55px_110px_-50px_rgba(11,24,38,0.9)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-3"
              onClick={() => trackSiteEvent("demo_interaction", { role: demoRole, step: "demo_tap" })}
            >
              {demoRole === "cashier" ? <PosDemo locale={locale} /> : <AdminDemo locale={locale} />}
            </div>
            <div className="mt-5 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#cfe6d4] bg-green-50 px-4 py-2 text-sm font-bold text-green-800">
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={reduce ? undefined : { y: [0, -3, 0] }}
                  transition={reduce ? undefined : { duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                  className="inline-flex"
                >
                  <ScanLine size={16} strokeWidth={2.25} className="text-green-700" />
                </motion.span>
                {t.scroll.hint}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="segments" className="relative overflow-hidden border-y border-[#d9e2db] bg-white py-16 sm:py-20 lg:py-24">
        {/* Decorative backdrop use a hyphen '-', comma, or period (no long dash) green corner glows + faint brand grid, below content. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_12%_-10%,rgba(3,183,61,0.10),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(48%_44%_at_100%_108%,rgba(3,183,61,0.07),transparent_62%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(11,24,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(11,24,38,0.5)_1px,transparent_1px)] [background-size:34px_34px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-3xl">
            <SectionLabel>{t.segments2.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">{t.segments2.title}</h2>
            <motion.div
              aria-hidden
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={reduce ? undefined : { scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-5 h-px w-40 origin-left bg-[linear-gradient(90deg,#03b73d,transparent)]"
            />
          </motion.div>
          {/* BR-09: each segment is its own pain + personalized CTA. Tapping a card
              opens the lead modal and carries the segment key into the tracker, so
              cta_click tells us which kind of shop is interested. */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.segments2.cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.title}
                  type="button"
                  onClick={() => openLead("segment_" + card.key, card.key)}
                  {...reveal(0.08 + index * 0.07, reduce)}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-[#d9e2db] bg-white p-5 text-left shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-all duration-300 ease-birliy hover:-translate-y-1.5 hover:scale-[1.02] hover:border-green-600/60 hover:shadow-[0_28px_60px_-32px_rgba(3,183,61,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/60 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {/* Top accent bar grows to full width on hover. */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-1 w-8 rounded-full bg-[linear-gradient(90deg,#03b73d,#10a076)] transition-[width] duration-300 ease-birliy group-hover:w-full motion-reduce:transition-none"
                  />
                  {/* Oversized watermark index. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-2 select-none text-5xl font-extrabold leading-none text-green-700/10"
                  >
                    {index + 1}
                  </span>
                  <div className="relative mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#03b73d,#0b8f4e)] text-white shadow-[0_10px_24px_-12px_rgba(3,183,61,0.7)] transition-transform duration-300 ease-birliy group-hover:scale-110 group-hover:-rotate-3 motion-reduce:transform-none motion-reduce:transition-none">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="relative text-lg font-extrabold tracking-normal">{card.title}</h3>
                  <p className="relative mt-2 leading-7 text-ink-500">{card.body}</p>
                  <p className="relative mt-3 rounded-lg bg-[#fff7ed] px-3 py-2 text-sm font-semibold leading-6 text-[#9a3412]">{card.pain}</p>
                  <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-green-700 transition-all duration-300 ease-birliy group-hover:gap-2.5">
                    {t.segments2.cta}
                    <ArrowRight aria-hidden size={16} className="transition-transform duration-300 ease-birliy group-hover:translate-x-1 motion-reduce:transform-none" />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="flow" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-3xl">
            <SectionLabel>{t.flow.eyebrow}</SectionLabel>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.flow.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">{t.flow.body}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3.5 py-1.5 text-sm font-semibold text-green-800">
              <Clock3 size={15} />
              {locale === "ru" ? "Вся продажа: 15 секунд, без переключений" : "Bitta sotuv: 15 soniya, ilovalar orasida o'tmasdan"}
            </p>
          </motion.div>
          {/* BR-06: on mobile a vertical numbered stepper with a connector; on
              wide screens the 5 steps lay out in a row. Numbers make the 15-second
              скан -> чек -> QR -> оплата -> остатки sequence easy to follow. */}
          <div
            className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            onClick={() => trackSiteEvent("demo_interaction", { role: demoRole, step: "flow_view" })}
          >
            {t.flow.steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === t.flow.steps.length - 1;
              return (
                <motion.article
                  key={step.title}
                  {...reveal(index * 0.05, reduce)}
                  className="relative rounded-lg border border-[#d9e2db] bg-white p-5 pl-16 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-transform duration-200 ease-birliy hover:-translate-y-0.5 sm:pl-5"
                >
                  {/* Vertical connector between steps on the single-column mobile stack. */}
                  {!isLast && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-[33px] top-12 h-[calc(100%+1rem)] w-0.5 bg-[linear-gradient(to_bottom,#03b73d,rgba(3,183,61,0.18))] sm:hidden"
                    />
                  )}
                  {/* Step number badge: top-left on mobile, inline above the icon on wide screens. */}
                  <span className="absolute left-4 top-5 grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-extrabold text-white ring-2 ring-green-700/20 sm:static sm:mb-4 sm:h-8 sm:w-8">
                    {index + 1}
                  </span>
                  <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-green-700">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-normal">{step.title}</h3>
                  <p className="mt-2 leading-7 text-ink-500">{step.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="owner" className="relative overflow-hidden bg-[#0b1826] py-16 text-white sm:py-20 lg:py-24">
        {/* Top-right green wash + faint blueprint grid use a hyphen '-', comma, or period (no long dash) echoes the hero's living-dark vocabulary. Decorative, below z-10 content. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_-10%,rgba(3,183,61,0.18),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:40px_40px]"
        />
        {/* Drifting aurora glows. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, 34, 0], y: [0, -26, 0], opacity: [0.4, 0.65, 0.4] }}
          transition={reduce ? undefined : { duration: 17, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -top-28 right-[-6%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(3,183,61,0.26),transparent_64%)] blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 22, 0], opacity: [0.24, 0.46, 0.24] }}
          transition={reduce ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute bottom-[-16%] left-[-6%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(16,160,118,0.2),transparent_66%)] blur-3xl"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <div className="flex flex-wrap items-center gap-3">
              <SectionLabel dark>{t.owner.eyebrow}</SectionLabel>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/12 px-3 py-1 text-xs font-bold uppercase tracking-normal text-green-300 ring-1 ring-green-400/20">
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={reduce ? undefined : { opacity: [1, 0.35, 1], scale: [1, 0.82, 1] }}
                  transition={reduce ? undefined : { duration: 1.8, ease: "easeInOut", repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_2px_rgba(3,183,61,0.7)]"
                />
                {t.command.status}
              </span>
            </div>
            <h2 className="max-w-[20ch] text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.owner.title}</h2>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/12 px-3.5 py-1.5 text-sm font-bold text-green-200 ring-1 ring-green-400/20">
              <Smartphone size={15} strokeWidth={2.25} />
              {t.owner.remoteNote}
            </p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">{t.owner.body}</p>
            <div className="mt-8 grid gap-3">
              {t.owner.bullets.map((item, index) => (
                <motion.div
                  key={item}
                  {...reveal(index * 0.08, reduce)}
                  className="group flex items-start gap-3 rounded-lg border border-white/12 bg-white/[0.07] p-4 transition duration-200 ease-birliy hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-white/[0.1]"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-green-500/15 text-green-300 ring-1 ring-green-400/25 transition-colors duration-200 ease-birliy group-hover:bg-green-500/25 group-hover:text-green-200">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                  <p className="font-semibold leading-7 text-white/86">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Owner-remote panel: today's revenue, cashiers, returns and low-stock,
              the four numbers an owner checks from the phone (BR / owner panel). */}
          <motion.div {...reveal(0.08, reduce)} className="grid grid-cols-2 gap-3">
            {t.owner.metrics.map((metric, index) => (
              <motion.article
                key={metric.label}
                {...reveal(0.12 + index * 0.08, reduce)}
                className="group relative overflow-hidden rounded-lg border border-white/12 bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-5 transition duration-200 ease-birliy hover:-translate-y-1 hover:border-green-400/40 before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-green-400/70 before:to-transparent"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white/52">{metric.label}</p>
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={reduce ? undefined : { opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
                    transition={reduce ? undefined : { duration: 2, ease: "easeInOut", repeat: Infinity, delay: index * 0.4 }}
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(3,183,61,0.6)]"
                  />
                </div>
                <p className="mt-2 bg-gradient-to-b from-white to-green-200 bg-clip-text text-3xl font-extrabold tracking-normal text-transparent">
                  <CountUp value={metric.value} />
                </p>
                <p className="mt-2 text-sm font-semibold text-green-300">{metric.detail}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="owner-control" className="relative overflow-hidden bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        {/* Decorative drifting BirLiy-green aurora use a hyphen '-', comma, or period (no long dash) sits below the z-10 content, never gates text/LCP. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -22, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={reduce ? undefined : { duration: 17, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -top-24 -left-10 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(3,183,61,0.16),transparent_62%)] blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 20, 0], opacity: [0.34, 0.58, 0.34] }}
          transition={reduce ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity }}
          className="pointer-events-none absolute -bottom-24 right-[-6%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(16,160,118,0.12),transparent_64%)] blur-3xl"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel>{t.ownerControl.eyebrow}</SectionLabel>
            <h2 className="max-w-[14ch] text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">{t.ownerControl.headline}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">{t.ownerControl.body}</p>
            <div className="mt-8 grid gap-3 pl-5 relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-green-500 before:via-green-600 before:to-transparent">
              {t.ownerControl.bullets.map((item, index) => (
                <motion.div
                  key={item}
                  {...reveal(index * 0.07, reduce)}
                  whileHover={reduce ? undefined : { y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="group relative flex items-start gap-3 overflow-hidden rounded-lg border border-[#d9e2db] bg-white p-4 pl-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-shadow duration-300 ease-birliy hover:border-green-600/40 hover:shadow-[0_18px_40px_-26px_rgba(3,183,61,0.5)]"
                >
                  <span aria-hidden className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 rounded-l-lg bg-green-600 transition-transform duration-300 ease-birliy group-hover:scale-y-100" />
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 transition-colors duration-300 ease-birliy group-hover:bg-green-100">
                    <Check size={16} strokeWidth={2.5} />
                  </span>
                  <p className="font-semibold leading-7 text-ink-900">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal(0.08, reduce)} className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#d9e2db] shadow-[0_30px_70px_-46px_rgba(11,24,38,0.55)]">
              <Image
                src="/photos/owner-phone.jpg"
                alt={t.ownerControl.photoAlt}
                width={1300}
                height={988}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-3 hidden items-center gap-2 rounded-xl border border-[#d9e2db] bg-white px-4 py-3 shadow-[0_24px_50px_-30px_rgba(3,183,61,0.35)] sm:flex">
              <span className="relative grid h-2.5 w-2.5 place-items-center">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-green-500/50"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
                  />
                )}
              </span>
              <p className="text-sm font-semibold text-ink-900">{locale === "ru" ? "Вижу всё с телефона" : "Hammasini telefondan ko'raman"}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="cashier" className="relative overflow-hidden border-t border-[#d9e2db] bg-white py-16 sm:py-20 lg:py-24">
        {/* Decorative brand-green wash, below content, never gates text/LCP. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_-10%,rgba(3,183,61,0.08),transparent_62%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-2xl">
            <SectionLabel>{t.cashier.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">{t.cashier.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">{t.cashier.body}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-50 px-3.5 py-1.5 text-sm font-bold text-green-800">
              <Clock3 size={15} strokeWidth={2.25} />
              {locale === "ru" ? "Обучение кассира: 30 минут" : "Kassirni o'qitish: 30 daqiqa"}
            </p>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.cashier.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  {...reveal(index * 0.06, reduce)}
                  className="group relative overflow-hidden rounded-2xl border border-[#d9e2db] bg-[#fbfcfb] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition duration-300 ease-birliy hover:-translate-y-1.5 hover:border-green-600/60 hover:bg-white hover:shadow-[0_28px_60px_-30px_rgba(3,183,61,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(3,183,61,0.5),transparent)] opacity-0 transition-opacity duration-300 ease-birliy group-hover:opacity-100" />
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#03b73d,#10a076)] text-white shadow-[0_10px_24px_-12px_rgba(3,183,61,0.7)] transition-transform duration-300 ease-birliy group-hover:scale-110 group-hover:-rotate-3 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-normal text-ink-900">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-ink-500">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="modules" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        {/* Branded top accent rail + soft aurora wash use a hyphen '-', comma, or period (no long dash) decorative, behind content. */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(3,183,61,0.55),transparent)]" />
        <motion.span
          aria-hidden
          {...fade(0, reduce)}
          className="pointer-events-none absolute -top-24 right-[-6%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(3,183,61,0.16),transparent_62%)] blur-3xl"
        />
        <motion.span
          aria-hidden
          {...fade(0.08, reduce)}
          className="pointer-events-none absolute bottom-[-12%] left-[-8%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(16,160,118,0.12),transparent_64%)] blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-2xl">
            <SectionLabel>{t.modules.eyebrow}</SectionLabel>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.modules.title}</h2>
            <motion.span
              aria-hidden
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={reduce ? undefined : { scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
              className="mt-5 block h-1 w-16 origin-left rounded-full bg-[linear-gradient(90deg,#03b73d,#10a076)]"
            />
          </motion.div>

          {/* Product switcher: phone vs full setup. Static images + plain explanation; only the active image renders. */}
          <div className="mt-10">
            <div className="flex justify-center">
              <div className="inline-flex rounded-full border border-[#d9e2db] bg-white p-1 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
                {([
                  { id: "phone", label: locale === "ru" ? "Телефон" : "Telefon" },
                  { id: "setup", label: locale === "ru" ? "Полный комплект" : "To'liq jihoz" },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSetupTab(tab.id)}
                    aria-pressed={setupTab === tab.id}
                    className={`min-h-10 rounded-full px-5 py-2 text-sm font-extrabold transition-colors duration-200 ease-birliy ${
                      setupTab === tab.id
                        ? "bg-green-700 text-white shadow-[0_8px_20px_-10px_rgba(3,183,61,0.9)]"
                        : "text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <motion.div {...reveal(0.05, reduce)} className="relative mx-auto w-full max-w-[420px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(3,183,61,0.26),transparent_70%)] blur-2xl"
                />
                <div className="relative aspect-square overflow-hidden rounded-[1.6rem] border border-[#d9e2db] bg-[#0b1826] shadow-[0_40px_90px_-44px_rgba(3,183,61,0.45)]">
                  <Image
                    src={setupTab === "phone" ? "/photos/phone-s26-app.jpg" : "/photos/full-setup.jpg"}
                    alt={
                      setupTab === "phone"
                        ? locale === "ru"
                          ? "Приложение BirLiy на телефоне"
                          : "BirLiy ilovasi telefonda"
                        : locale === "ru"
                          ? "Планшет на подставке, сканер и принтер чеков"
                          : "Stenddagi planshet, skaner va chek printeri"
                    }
                    width={1024}
                    height={1024}
                    loading="lazy"
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div {...reveal(0.12, reduce)} className="max-w-md">
                <h3 className="text-2xl font-extrabold tracking-normal text-ink-900 sm:text-3xl">
                  {setupTab === "phone"
                    ? locale === "ru" ? "Только телефон" : "Faqat telefon"
                    : locale === "ru" ? "Полный комплект" : "To'liq jihoz"}
                </h3>
                <p className="mt-4 text-lg leading-8 text-ink-700">
                  {setupTab === "phone"
                    ? locale === "ru"
                      ? "Для тех, кто выбирает работать с телефона. BirLiy работает прямо на вашем телефоне: продаёте без отдельного оборудования, а чек уходит покупателю в Telegram."
                      : "Telefondan ishlashni tanlaganlar uchun. BirLiy to'g'ridan to'g'ri telefoningizda ishlaydi: alohida jihozsiz sotasiz, chek xaridorga Telegramda boradi."
                    : locale === "ru"
                      ? "Если хотите, BirLiy привезёт и установит оборудование: планшет на подставке, сканер штрих-кодов и принтер чеков. Удобно для магазина побольше."
                      : "Agar xohlasangiz, BirLiy jihozni yetkazib beradi va o'rnatadi: stenddagi planshet, shtrix-kod skaneri va chek printeri. Kattaroq do'kon uchun qulay."}
                </p>
                <ul className="mt-6 grid gap-3">
                  {(setupTab === "phone"
                    ? locale === "ru"
                      ? ["Хватит одного телефона", "Подключаем за 1 день", "Чек уходит в Telegram"]
                      : ["Bitta telefon yetarli", "1 kunda ulaymiz", "Chek Telegramda ketadi"]
                    : locale === "ru"
                      ? ["Планшет и подставка", "Ручной сканер штрих-кодов", "Принтер чеков"]
                      : ["Planshet va stend", "Qo'lda shtrix-kod skaneri", "Chek printeri"]
                  ).map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-green-50 text-green-700">
                        <Check size={15} strokeWidth={2.5} />
                      </span>
                      <span className="font-semibold leading-7 text-ink-900">{line}</span>
                    </li>
                  ))}
                </ul>
                {/* BR-07: start with no equipment cost, and the kit is optional and
                    can be paid in parts later. Plain language, no hidden cost. */}
                <p className="mt-6 inline-flex items-start gap-2 rounded-lg bg-green-50 px-3.5 py-2.5 text-sm font-semibold leading-6 text-green-800">
                  <Wallet size={16} className="mt-0.5 shrink-0" />
                  {setupTab === "phone"
                    ? locale === "ru"
                      ? "Начать можно без покупки оборудования. Оборудование позже и по желанию, можно частями."
                      : "Uskuna sotib olmasdan ham boshlash mumkin. Jihoz keyin va ixtiyoriy, bo'lib to'lash mumkin."
                    : locale === "ru"
                      ? "Оборудование можно взять частями. Цену и состав комплекта согласуем заранее, без скрытых платежей."
                      : "Jihozni bo'lib to'lash mumkin. To'plam narxi va tarkibini oldindan kelishamiz, yashirin to'lovsiz."}
                </p>
              </motion.div>
            </div>

            {/* Full-setup tab only: each optional device on its own labelled card. Phone is enough to start; BirLiy supplies the kit on request. Hyphen/comma only, no long dash. */}
            {setupTab === "setup" && (
              <div className="mt-8">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  {(locale === "ru"
                    ? [
                        { icon: Tablet, label: "Планшет", sub: "На подставке" },
                        { icon: ScanLine, label: "Сканер", sub: "Для штрих-кодов" },
                        { icon: Printer, label: "Принтер чеков", sub: "Для печати чеков" },
                      ]
                    : [
                        { icon: Tablet, label: "Planshet", sub: "Stend bilan" },
                        { icon: ScanLine, label: "Skaner", sub: "Shtrix-kod uchun" },
                        { icon: Printer, label: "Chek printeri", sub: "Chek chiqarish uchun" },
                      ]
                  ).map((piece, index) => {
                    const PieceIcon = piece.icon;
                    return (
                      <motion.li
                        key={piece.label}
                        {...fade(index * 0.05, reduce)}
                        className="flex items-center gap-3 rounded-2xl border border-[#d9e2db] bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition duration-300 ease-birliy hover:-translate-y-1 hover:border-green-600/50 hover:shadow-[0_20px_44px_-26px_rgba(3,183,61,0.5)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-600/15">
                          <PieceIcon size={20} strokeWidth={2} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-extrabold leading-5 text-ink-900">{piece.label}</span>
                          <span className="block text-xs font-medium leading-4 text-ink-500">{piece.sub}</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-center text-sm font-medium text-ink-500">
                  {locale === "ru"
                    ? "Оборудование по желанию: для старта хватает телефона, а BirLiy привезёт и настроит комплект, если он вам нужен."
                    : "Jihoz ixtiyoriy: boshlash uchun telefon yetarli, kerak bo'lsa BirLiy to'plamni yetkazib beradi va sozlaydi."}
                </p>
              </div>
            )}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.modules.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  {...reveal(index * 0.04, reduce)}
                  className="group relative overflow-hidden rounded-xl border border-[#d9e2db] bg-[#fbfcfb] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition duration-300 ease-birliy hover:-translate-y-1.5 hover:scale-[1.015] hover:border-green-600/60 hover:bg-white hover:shadow-[0_28px_60px_-30px_rgba(3,183,61,0.45)] hover:ring-1 hover:ring-green-600/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
                >
                  {/* Top hairline lights up on hover use a hyphen '-', comma, or period (no long dash) branded accent, decorative. */}
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(3,183,61,0.5),transparent)] opacity-0 transition-opacity duration-300 ease-birliy group-hover:opacity-100" />
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[linear-gradient(135deg,#03b73d,#10a076)] text-white shadow-[0_10px_24px_-12px_rgba(3,183,61,0.7)] ring-1 ring-green-600/20 transition-transform duration-300 ease-birliy group-hover:scale-110 group-hover:-rotate-3 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-normal">{item.title}</h3>
                  <p className="mt-3 leading-7 text-ink-500">{item.text}</p>
                  <p className="mt-4 flex items-center gap-2 border-t border-[#eef2ee] pt-4 text-sm font-extrabold text-green-700">
                    <Check size={15} strokeWidth={2.75} className="shrink-0" />
                    {item.payoff}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rollout" className="relative overflow-hidden border-y border-[#d9e2db] bg-[#e9eff0] py-16 sm:py-20 lg:py-24">
        {/* decorative aurora wash + accent hairline (LCP-safe, behind content) */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-px bg-[linear-gradient(90deg,transparent,rgba(3,183,61,0.5),transparent)]" />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_70%_at_18%_30%,rgba(3,183,61,0.14),transparent_60%)]"
          initial={reduce ? false : { opacity: 0.55, scale: 1 }}
          animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.04, 1] }}
          transition={reduce ? undefined : { duration: 9, ease: "easeInOut", repeat: Infinity }}
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)} className="relative">
            <span aria-hidden className="pointer-events-none absolute -left-6 -top-6 -z-0 hidden h-40 w-40 rounded-full bg-[radial-gradient(120%_120%_at_0%_0%,rgba(3,183,61,0.18),transparent_55%)] blur-2xl lg:block" />
            <SectionLabel>{t.rollout.eyebrow}</SectionLabel>
            <h2 className="relative max-w-[17ch] text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.rollout.title}</h2>
            <p className="relative mt-5 max-w-xl text-lg leading-8 text-ink-700">{t.rollout.body}</p>
            <p className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-green-700 px-4 py-1.5 text-sm font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(3,183,61,0.9)]">
              <Clock3 size={15} />
              {t.rollout.chip}
            </p>
          </motion.div>
          <div className="relative grid gap-3">
            {/* animated vertical stepper track that fills as you scroll */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-[26px] top-8 bottom-8 -z-0 w-[2px] origin-top rounded-full bg-[linear-gradient(to_bottom,#03b73d,rgba(3,183,61,0.15))]"
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={reduce ? undefined : { scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={reduce ? undefined : { duration: 0.9, ease: EASE }}
            />
            {t.rollout.steps.map((item, index) => (
              <motion.article
                key={item}
                {...reveal(index * 0.05, reduce)}
                whileHover={reduce ? undefined : { x: 4 }}
                className="group relative z-10 grid grid-cols-[52px_1fr] items-center gap-4 rounded-xl border border-[#cfdad4] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-[border-color,box-shadow,transform] duration-200 ease-birliy hover:border-green-700/40 hover:shadow-[0_20px_50px_-30px_rgba(11,24,38,0.45)] motion-reduce:transform-none"
              >
                <motion.div
                  initial={reduce ? false : { scale: 0.85, boxShadow: "0 0 0 0 rgba(3,183,61,0)" }}
                  whileInView={reduce ? undefined : { scale: 1, boxShadow: "0 10px 30px -12px rgba(3,183,61,0.7)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={reduce ? undefined : { duration: 0.45, ease: EASE, delay: index * 0.05 + 0.1 }}
                  className="grid h-13 min-h-[52px] w-13 min-w-[52px] place-items-center rounded-xl bg-green-700 font-extrabold text-white ring-1 ring-green-700/25 transition-transform duration-200 ease-birliy group-hover:scale-[1.08] motion-reduce:group-hover:scale-100"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.div>
                <p className="text-lg font-extrabold leading-7 tracking-normal">{item}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="early-access"
        className="relative isolate overflow-hidden bg-white py-16 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[linear-gradient(90deg,#03b73d_0%,#facc15_60%,#03b73d_100%)] before:content-[''] sm:py-20 lg:py-24"
      >
        {/* decorative aurora backdrop (LCP-safe, aria-hidden, behind content) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(3,183,61,0.16),transparent_70%)] blur-2xl"
          animate={reduce ? undefined : { x: [0, 18, 0], y: [0, -14, 0] }}
          transition={reduce ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div aria-hidden className="pointer-events-none absolute right-6 top-6 -z-10 hidden h-24 w-24 rounded-full border border-green-500/25 lg:block" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel>{t.early.eyebrow}</SectionLabel>
            <h2 className="max-w-[20ch] text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl">{t.early.headline}</h2>
            <div className="mt-7 grid gap-3">
              {t.early.promises.map((promise, index) => (
                (() => {
                  const isPrice = index === t.early.promises.length - 1;
                  return (
                    <motion.article
                      key={promise.title}
                      {...reveal(index * 0.12, reduce)}
                      className={`group relative grid grid-cols-[44px_1fr] items-start gap-4 rounded-lg p-4 transition-transform duration-200 ease-birliy hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(11,24,38,0.35)] ${
                        isPrice
                          ? "bg-[linear-gradient(135deg,#fffdf5,#fbfcfb)] ring-2 ring-yellow-400/70 shadow-[0_18px_46px_-26px_rgba(250,204,21,0.65)]"
                          : "border border-[#d9e2db] bg-[#fbfcfb] shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
                      }`}
                    >
                      {isPrice && (
                        <motion.div
                          aria-hidden
                          className="pointer-events-none absolute -inset-3 -z-10 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(250,204,21,0.30),transparent_70%)] blur-xl"
                          animate={reduce ? undefined : { opacity: [0.45, 0.85, 0.45] }}
                          transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      <motion.div
                        initial={{ scale: reduce || !isPrice ? 1 : 0.8 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, ease: EASE, delay: isPrice ? 0.3 : 0 }}
                        className={`grid h-11 min-h-[44px] w-11 place-items-center rounded-lg font-extrabold ${
                          isPrice
                            ? "bg-yellow-400 text-ink-900 shadow-[0_8px_20px_-8px_rgba(250,204,21,0.9)]"
                            : "bg-green-700 text-white"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </motion.div>
                      <div>
                        <h3 className="text-base font-extrabold tracking-normal">{promise.title}</h3>
                        <p className="mt-1 leading-7 text-ink-500">{promise.caption}</p>
                      </div>
                    </motion.article>
                  );
                })()
              ))}
            </div>
            <button
              type="button"
              onClick={() => openLead("early_access")}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.88)] transition duration-200 ease-birliy hover:bg-green-800 active:scale-[0.97] motion-reduce:active:scale-100"
            >
              {t.early.cta}
              <ArrowRight size={18} />
            </button>
            <p className="mt-3 text-sm font-semibold text-green-700">{t.early.applicationNote}</p>
          </motion.div>
          <motion.div {...reveal(0.08, reduce)} className="relative">
            <div aria-hidden className="pointer-events-none absolute -right-4 -top-4 -z-10 hidden h-28 w-28 rounded-2xl bg-[radial-gradient(circle,rgba(3,183,61,0.18)_1.5px,transparent_1.6px)] [background-size:14px_14px] lg:block" />
            <div className="overflow-hidden rounded-2xl ring-1 ring-green-500/15 shadow-[0_30px_70px_-40px_rgba(3,183,61,0.45)] transition-transform duration-300 ease-birliy hover:scale-[1.015]">
              <Image
                src="/photos/owners-team.jpg"
                alt={t.early.photoAlt}
                width={1000}
                height={750}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="blog" className="relative overflow-hidden border-y border-[#d9e2db] bg-white py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(3,183,61,0.08),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>{t.blog.eyebrow}</SectionLabel>
              <h2 className="text-3xl font-extrabold leading-[1.12] tracking-normal text-ink-900 sm:text-4xl">
                {t.blog.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-ink-700">{t.blog.subtitle}</p>
            </div>
            <a
              href={blogIndexPath(locale)}
              onClick={() => trackSiteEvent("blog_click", { cta_location: "blog_index" })}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d9e2db] bg-white px-5 py-3 font-extrabold text-green-800 transition-colors duration-200 ease-birliy hover:border-green-600/50 hover:bg-green-50"
            >
              {t.blog.allPosts}
              <ArrowRight size={18} />
            </a>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {LATEST_POSTS.map((post, index) => {
              const c = post.locales[locale];
              const catLabel = CATEGORY_LABEL[postCategory(post)][locale];
              return (
                <motion.a
                  key={post.slug}
                  {...reveal(index * 0.08, reduce)}
                  href={blogPostPath(locale, post.slug)}
                  onClick={() => trackSiteEvent("blog_click", { article_slug: post.slug, cta_location: "blog_card" })}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_1px_2px_rgba(11,24,38,0.05)] transition-all duration-200 ease-birliy hover:-translate-y-1 hover:border-green-700 hover:shadow-[0_28px_60px_-38px_rgba(11,24,38,0.55)] motion-reduce:hover:translate-y-0"
                >
                  {post.image && (
                    <div className="overflow-hidden bg-paper">
                      <Image
                        src={blogImgPath(post.image.landscape)}
                        alt={c.title}
                        width={1200}
                        height={900}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <span className="mb-3 inline-block w-fit rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      {catLabel}
                    </span>
                    <h3 className="font-display text-xl font-extrabold leading-snug tracking-normal text-ink-900 transition-colors duration-200 group-hover:text-green-800">
                      {c.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-700">{c.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-green-800">
                      {t.blog.readMore}
                      <ArrowRight size={16} className="transition-transform duration-200 ease-birliy group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="relative overflow-hidden bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        {/* decorative aurora glow use a hyphen '-', comma, or period (no long dash) LCP-safe, no text gated behind it */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(3,183,61,0.10),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-green-700">
              <span className="relative inline-flex h-2 w-2">
                <span aria-hidden className="absolute inset-0 rounded-full bg-green-500/60 animate-ping motion-reduce:hidden" />
                <span className="relative h-2 w-2 rounded-full bg-green-500" />
              </span>
              {t.faq.eyebrow}
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-4xl">{t.faq.title}</h2>
            <span aria-hidden className="mx-auto mt-5 block h-px w-16 bg-gradient-to-r from-transparent via-green-600/50 to-transparent" />
          </motion.div>
          <div className="mt-10 grid gap-3">
            {dicts[locale].faq.map(([question, answer], index) => {
              const open = faqOpen === index;
              return (
                <motion.div
                  key={question}
                  {...reveal(index * 0.06, reduce)}
                  className={`group relative overflow-hidden rounded-lg border bg-white transition-all duration-200 ease-birliy hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-30px_rgba(11,24,38,0.45)] motion-reduce:hover:translate-y-0 ${open ? "border-green-600/40 bg-[#f4faf5] ring-1 ring-green-600/30 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-green-600" : "border-[#d9e2db] hover:border-green-600/40"}`}
                >
                  <button
                    type="button"
                    ref={(el) => { faqBtnRefs.current[index] = el; }}
                    id={`faq-q-${index}`}
                    onClick={() => toggleFaq(index)}
                    onKeyDown={(e) => onFaqKeyDown(e, index, dicts[locale].faq.length)}
                    aria-expanded={open}
                    aria-controls={`faq-a-${index}`}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/60 focus-visible:ring-inset"
                  >
                    <span className="text-base font-extrabold text-ink-900">{question}</span>
                    <span
                      aria-hidden
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ease-birliy group-hover:scale-110 motion-reduce:group-hover:scale-100 ${open ? "border-green-700 bg-green-700 text-white" : "border-[#d9e2db] text-green-700 group-hover:border-green-600/50"}`}
                    >
                      <ChevronDown size={18} className={`transition-transform duration-200 ease-birliy ${open ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {/* smooth height open/close via grid-rows use a hyphen '-', comma, or period (no long dash) text stays in DOM (LCP/a11y-safe) */}
                  <div
                    id={`faq-a-${index}`}
                    role="region"
                    aria-labelledby={`faq-q-${index}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-birliy motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 leading-7 text-ink-700">{answer}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="price" className="bg-[#0b1826] py-12 text-white sm:py-14">
        {/* BR-08: transparent price. Three numbers stack one per row on mobile,
            then a plain line spells out the full price after 6 months and that
            there are no hidden fees. */}
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-400">{t.price.eyebrow}</p>
          <div className="mt-7 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {(locale === "ru"
              ? [["49 000", "сум/мес, первые 6 месяцев"], ["1 день", "на подключение"], ["0", "оборудования на старте"]]
              : [["49 000", "so'm/oy, birinchi 6 oy"], ["1 kun", "ulanishga"], ["0", "uskuna kerak emas startda"]]
            ).map(([value, label]) => (
              <div key={label}>
                <CountUp value={value} className="text-4xl font-extrabold tabular-nums text-white sm:text-5xl" />
                <p className="mx-auto mt-2 max-w-[24ch] text-sm font-semibold text-white/60">{label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold leading-7 text-white/80 ring-1 ring-white/10">
            {locale === "ru"
              ? "49 000 сум/мес первые 6 месяцев, дальше 149 000 сум/мес. Полный функционал, без скрытых платежей. Цену вы знаете заранее."
              : "Birinchi 6 oy 49 000 so'm/oy, keyin 149 000 so'm/oy. To'liq funksiya, yashirin to'lovsiz. Narxni oldindan bilasiz."}
          </p>
        </div>
        <PriceReceipt locale={locale} />
      </section>

      <section id="lead" className="bg-white py-16 sm:py-20 lg:py-24">
        <LeadSection locale={locale} onOpenForm={() => openLead("lead_section")} />
      </section>

      <footer className="border-t border-[#d9e2db] bg-[#f7faf8] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr]">
            <div>
              <a href="#top" className="inline-flex items-center" aria-label="BirLiy">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/birliy-wordmark.png" alt="BirLiy" width={1216} height={403} className="h-9 w-auto" />
              </a>
              <p className="mt-4 max-w-[24ch] text-sm font-bold text-ink-500">{t.footer.tagline}</p>
            </div>
            {t.footer.cols.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">{col.title}</p>
                <ul className="mt-4 grid gap-3">
                  {col.links.map(([label, href]) => {
                    const isBlog = href.includes("/blog");
                    return (
                      <li key={label}>
                        <a
                          href={href}
                          onClick={isBlog ? () => trackSiteEvent("blog_click", { cta_location: "footer" }) : undefined}
                          className="text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
                        >
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">{t.footer.contactTitle}</p>
              <a
                href={t.footer.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSiteEvent("telegram_click", { cta_location: "footer" })}
                className="mt-4 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Send size={16} className="text-green-700" />
                {t.footer.telegram}
              </a>
              <a
                href={t.footer.supportHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSiteEvent("telegram_click", { cta_location: "footer_support" })}
                className="mt-3 flex min-h-9 items-center gap-2 text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Send size={16} className="text-green-700" />
                {t.footer.support}
              </a>
              <a
                href={telHref}
                onClick={() => trackSiteEvent("phone_click", { cta_location: "footer" })}
                className="mt-3 inline-flex min-h-9 items-center gap-2 text-base font-extrabold tracking-normal text-ink-900 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Phone size={16} className="text-green-700" />
                {t.footer.phone}
              </a>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-[#d9e2db] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-ink-500">{t.footer.copyright}</p>
            <div className="flex items-center gap-2">
              <a
                href="/ru"
                onClick={locale === "ru" ? undefined : trackLangSwitch}
                aria-current={locale === "ru" ? "true" : undefined}
                className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm font-extrabold transition-colors duration-200 ease-birliy ${locale === "ru" ? "bg-ink-900 text-white" : "border border-[#d9e2db] text-ink-700 hover:bg-white"}`}
              >
                RU
              </a>
              <a
                href="/"
                onClick={locale === "uz" ? undefined : trackLangSwitch}
                aria-current={locale === "uz" ? "true" : undefined}
                className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm font-extrabold transition-colors duration-200 ease-birliy ${locale === "uz" ? "bg-ink-900 text-white" : "border border-[#d9e2db] text-ink-700 hover:bg-white"}`}
              >
                UZ
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div
        ref={stickyRef}
        data-testid="mobile-sticky"
        aria-hidden={!showSticky}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#d9e2db] bg-white/94 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-18px_50px_-34px_rgba(11,24,38,0.6)] backdrop-blur transition-transform duration-300 ease-birliy motion-reduce:transition-none sm:hidden ${showSticky ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Three persistent actions: primary lead CTA (flex-grows) plus Telegram
            and phone, so a shop owner can reach us the way they prefer. The bar
            hides over #lead and the footer (showSticky), so it never covers the
            form fields or the footer language controls. */}
        <div className="mx-auto flex max-w-md items-center gap-2">
          <button
            type="button"
            onClick={() => openLead("mobile_sticky")}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-3 text-sm font-extrabold text-white"
          >
            {t.meta.primaryCta}
            <ArrowRight size={17} />
          </button>
          <a
            href={t.footer.telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSiteEvent("telegram_click", { cta_location: "mobile_sticky" })}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d9e2db] text-green-700"
            aria-label={t.meta.telegram}
          >
            <Send size={18} />
          </a>
          <a
            href={telHref}
            onClick={() => trackSiteEvent("phone_click", { cta_location: "mobile_sticky" })}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d9e2db] text-green-700"
            aria-label={t.meta.call}
          >
            <Phone size={18} />
          </a>
        </div>
      </div>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} locale={locale} />
    </main>
  );
}
