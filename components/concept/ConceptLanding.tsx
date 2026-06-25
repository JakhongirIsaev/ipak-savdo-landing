"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PosDemo } from "./PosDemo";
import { AdminDemo } from "./AdminDemo";
import { LeadSection, LeadModal } from "./LeadSection";
import { MobileLanding } from "./MobileLanding";
import { CountUp } from "./CountUp";
import { EcosystemStrip } from "./EcosystemStrip";
import { useCoarsePointer } from "./useCoarsePointer";
import { dicts } from "@/lib/landing/i18n";
import { postCategory, postsByCategory, readingTimeMin } from "@/lib/blog";
import { BLOG_UI, blogPostPath, blogIndexPath, CATEGORY_LABEL } from "@/lib/blog/i18n";
import { trackSiteEvent } from "@/lib/track/client";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  ChevronDown,
  Clock3,
  Languages,
  Menu,
  PackageCheck,
  Phone,
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

// Landing preview stays conversion-focused: show shop-operation guides here;
// football and AI categories remain one tap away inside the blog.
const LANDING_BLOG_POSTS = postsByCategory("product").slice(0, 4);

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
      mobileTitle: "Касса, склад, QR и долги в одном телефоне",
      mobileTitleLead: "Касса, склад, QR и долги",
      mobileTitleAccent: "в одном телефоне",
      subtitle:
        "Касса и склад для магазинов у дома и минимаркетов. BirLiy работает на телефоне: кассир продаёт, вы видите выручку, остатки и смену.",
      mobileSubtitle:
        "BirLiy помогает магазину продавать, видеть остатки и принимать оплату без компьютера.",
      primaryCta: "Оставить заявку",
      ctaShort: "Заявка",
      secondaryCta: "Смотреть продукт",
      telegram: "Telegram",
      call: "Позвонить",
      up: "Наверх",
      heroPhotoBadge: "Ранний доступ: подключаем первые магазины",
      trustStrip: ["Сделано для Узбекистана", "Запуск за 1 день", "Работает офлайн"],
    },
    byNumbers: {
      eyebrow: "В цифрах",
      title: "Что входит уже на старте",
      items: [
        { value: "49 000", suffix: "сум/мес", label: "стартовая цена" },
        { value: "1", suffix: "день", label: "на подключение" },
        { value: "0", suffix: "оборудования", label: "нужно для старта" },
        { value: "4", suffix: "способа", label: "оплаты: наличные, карта, QR, долг" },
        { value: "9 000+", suffix: "SKU", label: "база товаров" },
      ],
    },
    nav: [
      { label: "Как работает", href: "#flow" },
      { label: "Владелец", href: "#owner" },
      { label: "Возможности", href: "#modules" },
      { label: "Блог", href: "#blog" },
      { label: "Цена", href: "#price" },
      { label: "Контакты", href: "#lead" },
    ],
    mobileNav: {
      landmark: "Навигация по странице",
      menuTitle: "Быстро перейти",
      home: "Главная",
      flow: "Как",
      product: "Продукт",
      price: "Цена",
      apply: "Заявка",
      owner: "Владелец",
      blog: "Блог",
      telegram: "Telegram",
      call: "Звонок",
    },
    stats: [
      { label: "Первые 6 месяцев", value: "49 000", suffix: "сум/мес" },
      { label: "Подключение", value: "1", suffix: "день" },
      { label: "База товаров", value: "9 000+", suffix: "SKU" },
      { label: "Оплата", value: "4", suffix: "способа", helper: "наличные, карта, QR, долг" },
    ],
    // Condensed proof numbers for the mobile first screen.
    heroNumbers: [
      { value: "49 000", suffix: "сум/мес" },
      { value: "1", suffix: "день" },
      { value: "0", suffix: "оборудования" },
      { value: "4", suffix: "способа оплаты" },
    ],
    mobileEssentials: {
      eyebrow: "Главное в продукте",
      title: "Что владелец получает в телефоне",
      body: "BirLiy заменяет тетрадь, отдельную QR-оплату и вечерние пересчёты. Кассир продаёт, а владелец видит магазин сразу.",
      cta: "Посмотреть живое демо",
      items: [
        { title: "Продажа", text: "Сканируете товар, выбираете оплату, чек готов.", pill: "15 секунд" },
        { title: "Склад", text: "Остатки уменьшаются после каждой продажи.", pill: "без Excel" },
        { title: "QR и долг", text: "Наличные, карта, QR и долг сходятся в одном чеке.", pill: "4 оплаты" },
      ],
    },
    segments: ["Магазин у дома", "Минимаркет", "Аптека", "Сервисная точка"],
    scroll: {
      eyebrow: "Живое демо",
      title: "Попробуйте обе роли прямо здесь",
      body: "Это не скриншот. Переключайте кассира и владельца, открывайте любые разделы. Всё кликабельно.",
      hint: "Это живое демо. Нажимайте и листайте разделы в меню слева",
      roleCashier: "Касса · кассир",
      roleOwner: "Владелец бизнеса",
    },
    pain: {
      eyebrow: "Знакомо?",
      headline: "Сколько товара осталось? Сколько вы заработали сегодня? С тетрадью точного ответа нет.",
      body: "Записи в тетради отнимают время и быстро расходятся с реальностью. BirLiy собирает продажи, остатки, выручку и долги в одном месте, чтобы вечером не пересчитывать всё вручную.",
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
        { key: "shop", title: "Магазин у дома", body: "Продукты, бытовая химия, ежедневные товары. Один кассир, быстрые продажи, понятный остаток.", pain: "Главная боль: тетрадь не показывает остатки и кто сколько должен.", icon: Store },
        { key: "minimarket", title: "Минимаркет", body: "Сотни позиций, несколько кассиров, контроль смен, выручки и товара без вечернего пересчета.", pain: "Главная боль: трудно проверить кассиров и смены без присутствия в зале.", icon: ShoppingCart },
        { key: "grocery", title: "Продуктовый магазин", body: "Касса, склад, QR-оплата и долги в одном телефоне для ежедневной торговли.", pain: "Главная боль: товар, деньги и долги живут в разных местах.", icon: Boxes },
      ],
    },
    ownerControl: {
      eyebrow: "Для собственника",
      headline: "Магазин как на ладони.",
      body: "Пока касса работает, вы уже видите выручку, остатки и кто за прилавком. Никаких звонков, никаких пересылок. Открыли телефон и видите всю картину.",
      photoAlt: "Кассир принимает QR-оплату в магазине",
      bullets: [
        "Живая выручка с дельтой ±% прямо сейчас",
        "Журнал смен: кто открыл, кто закрыл",
        "Каждая продажа, возврат и списание с именем кассира",
      ],
    },
    early: {
      eyebrow: "Запуск",
      headline: "Подключим магазин за один день, вместе с вами.",
      applicationNote: "Оставьте заявку: согласуем точку, комплект и удобное время подключения.",
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
      subtitle: "Материалы про кассу, склад, долги, QR-оплату и управление магазином.",
      categories: "Разделы блога",
      latest: "Новые материалы",
      countLabel: "статей",
      readMore: "Читать",
      allPosts: "Все статьи",
      topics: ["Касса", "Склад", "Долги", "QR-оплата", "Управление магазином"],
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
      delta: "На 12% больше, чем вчера",
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
      title: "Я не в магазине, но вижу, что происходит.",
      remoteNote: "Дома, в дороге или в другой точке. Открыли телефон и видите магазин в реальном времени.",
      body:
        "Выручка, смены кассиров, возвраты, низкие остатки и структура оплат собраны в один командный экран. Не надо звонить кассиру, чтобы понять, как прошёл день.",
      bullets: ["PIN-роли для владельца и кассира", "Журнал продаж, возвратов и списаний", "Telegram-чеки и дневные итоги"],
      metrics: [
        { label: "Выручка сегодня", value: "3 450 000", detail: "На 12% больше, чем вчера" },
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
      eyebrow: "Стартовая цена",
      amount: "49 000",
      suffix: "сум / месяц",
      laterAmount: "149 000",
      laterSuffix: "сум / месяц",
      scarcity: "Цена раннего доступа для первых магазинов",
      body: "Первые 6 месяцев: 49 000 сум/мес. Дальше прозрачно: 149 000 сум в месяц. Полный функционал и помощь с запуском.",
      bullets: ["Касса, склад, QR-оплата и отчёты", "Без обязательной покупки оборудования в первый день", "Помощь с первым запуском"],
      cta: "Подать заявку",
    },
    trust: {
      eyebrow: "Надежность",
      title: "Понятные правила для владельца и кассира.",
      body: "BirLiy не обещает магию. Он аккуратно сохраняет продажи, разделяет роли и показывает цену заранее.",
      items: [
        "PIN-роли для владельца и кассира",
        "Каждая продажа сохраняется с именем кассира",
        "Данные защищены",
        "Поддержка через Telegram",
        "Цена известна заранее",
        "Без скрытых платежей",
      ],
    },
    footer: {
      tagline: "Ваш бизнес. В одном месте.",
      cols: [
        { title: "Продукт", links: [["Демо", "#reveal"], ["Модули", "#modules"], ["Для собственника", "#owner"], ["FAQ", "#faq"], ["Блог", "/ru/blog"]] },
        { title: "Для кого", links: [["Магазин у дома", "#segments"], ["Минимаркет", "#segments"], ["Продуктовый магазин", "#segments"]] },
        { title: "Подключение", links: [["Запуск", "#setup"], ["Цена", "#price"], ["Заявка", "#lead"]] },
        { title: "Популярные запросы", links: [["Программа для магазина", "/ru/programma-dlya-magazina"], ["Касса для магазина", "/ru/kassa-dlya-magazina"], ["Учет долгов", "/ru/uchet-dolgov-magazin"]] },
      ],
      legalTitle: "Документы",
      legalNote: "Нужна юридическая проверка перед публикацией.",
      legalItems: ["Privacy Policy", "Public Offer / Terms", "Personal Data Policy"],
      contactTitle: "Контакт",
      telegram: "@bir_liy",
      telegramHref: "https://t.me/bir_liy",
      support: "Связаться с нами",
      supportHref: "https://t.me/birliy_support_bot",
      phone: "+998 95 240 24 54",
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
      mobileTitle: "Kassa, ombor, QR va nasiya bitta telefonda",
      mobileTitleLead: "Kassa, ombor, QR va nasiya",
      mobileTitleAccent: "bitta telefonda",
      subtitle:
        "Uy yonidagi do'kon va minimarketlar uchun kassa va ombor. BirLiy telefonda ishlaydi: kassir sotadi, siz tushum, qoldiq va smenani ko'rasiz.",
      mobileSubtitle:
        "BirLiy do'konga sotish, qoldiqni ko'rish va to'lov qabul qilishni kompyutersiz beradi.",
      primaryCta: "Ariza qoldirish",
      ctaShort: "Ariza",
      secondaryCta: "Mahsulotni ko'rish",
      telegram: "Telegram",
      call: "Qo'ng'iroq",
      up: "Yuqoriga",
      heroPhotoBadge: "Erta kirish: birinchi do'konlar ulanmoqda",
      trustStrip: ["O'zbekiston uchun", "1 kunda ulanish", "Oflayn ishlaydi"],
    },
    byNumbers: {
      eyebrow: "Raqamlarda",
      title: "Startning o'zida nima bor",
      items: [
        { value: "49 000", suffix: "so'm/oy", label: "start narxi" },
        { value: "1", suffix: "kun", label: "ulanish uchun" },
        { value: "0", suffix: "uskuna", label: "start uchun kerak" },
        { value: "4", suffix: "usul", label: "to'lov: naqd, karta, QR, nasiya" },
        { value: "9 000+", suffix: "SKU", label: "tovarlar bazasi" },
      ],
    },
    nav: [
      { label: "Qanday ishlaydi", href: "#flow" },
      { label: "Egasi uchun", href: "#owner" },
      { label: "Imkoniyatlar", href: "#modules" },
      { label: "Blog", href: "#blog" },
      { label: "Narx", href: "#price" },
      { label: "Aloqa", href: "#lead" },
    ],
    mobileNav: {
      landmark: "Sahifa bo'ylab navigatsiya",
      menuTitle: "Tez o'tish",
      home: "Bosh",
      flow: "Qanday",
      product: "Mahsulot",
      price: "Narx",
      apply: "Ariza",
      owner: "Egasi",
      blog: "Blog",
      telegram: "Telegram",
      call: "Qo'ng'iroq",
    },
    stats: [
      { label: "Birinchi 6 oy", value: "49 000", suffix: "so'm/oy" },
      { label: "Ulanish", value: "1", suffix: "kun" },
      { label: "Tovar bazasi", value: "9 000+", suffix: "SKU" },
      { label: "To'lov", value: "4", suffix: "xil usul", helper: "naqd, karta, QR, nasiya" },
    ],
    // Condensed proof numbers for the mobile first screen.
    heroNumbers: [
      { value: "49 000", suffix: "so'm/oy" },
      { value: "1", suffix: "kun" },
      { value: "0", suffix: "uskuna" },
      { value: "4", suffix: "to'lov usuli" },
    ],
    mobileEssentials: {
      eyebrow: "Mahsulotning asosi",
      title: "Egasi telefonda nimani ko'radi",
      body: "BirLiy daftar, alohida QR-to'lov va kechki qo'l hisobini almashtiradi. Kassir sotadi, egasi esa do'konni darhol ko'radi.",
      cta: "Jonli demoni ko'rish",
      items: [
        { title: "Sotuv", text: "Tovar skanerlanadi, to'lov tanlanadi, chek tayyor.", pill: "15 soniya" },
        { title: "Ombor", text: "Har sotuvdan keyin qoldiq avtomatik kamayadi.", pill: "Excelsiz" },
        { title: "QR va nasiya", text: "Naqd, karta, QR va nasiya bitta chekda yuradi.", pill: "4 to'lov" },
      ],
    },
    segments: ["Uy yonidagi do'kon", "Minimarket", "Dorixona", "Servis nuqtasi"],
    scroll: {
      eyebrow: "Jonli demo",
      title: "Ikkala rolni shu yerda sinab ko'ring",
      body: "Bu skrinshot emas. Kassir va egasini almashtiring, istalgan bo'limni oching. Hammasi bosiladi.",
      hint: "Bu jonli demo. Bosing va chapdagi menyudan bo'limlarni oching",
      roleCashier: "Kassa · kassir",
      roleOwner: "Biznes egasi",
    },
    pain: {
      eyebrow: "Tanish?",
      headline: "Qancha tovar qoldi? Bugun qancha ishladingiz? Daftar bilan aniq javob yo'q.",
      body: "Daftarda yozish ko'p vaqt oladi va tez haqiqatdan orqada qoladi. BirLiy sotuv, qoldiq, tushum va qarzlarni bitta joyga yig'adi, shunda kun oxirida qo'lda qayta sanash kerak bo'lmaydi.",
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
        { key: "shop", title: "Uy yonidagi do'kon", body: "Oziq-ovqat, maishiy kimyo, kundalik tovarlar. Bitta kassir, tez sotuv, qoldiq aniq.", pain: "Asosiy muammo: daftar qoldiq va kim qancha qarzdorligini ko'rsatmaydi.", icon: Store },
        { key: "minimarket", title: "Minimarket", body: "Yuzlab pozitsiya, bir necha kassir, smena, tushum va tovar nazorati kechki qayta sanashsiz.", pain: "Asosiy muammo: zalda bo'lmasdan kassir va smenalarni tekshirish qiyin.", icon: ShoppingCart },
        { key: "grocery", title: "Oziq-ovqat do'koni", body: "Kassa, ombor, QR-to'lov va nasiya kundalik savdo uchun bitta telefonda.", pain: "Asosiy muammo: tovar, pul va qarzlar har xil joyda yuradi.", icon: Boxes },
      ],
    },
    ownerControl: {
      eyebrow: "Egasi uchun",
      headline: "Do'kon qo'lingizning kaftida.",
      body: "Kassa ishlayotgan paytda siz allaqachon tushum, qoldiqlar va kimning kassada turganini ko'rasiz. Qo'ng'iroq ham yo'q, xabar ham yo'q. Telefonni ochdingiz, butun manzara ko'z oldingizda.",
      photoAlt: "Kassir do'konda QR-to'lov qabul qilmoqda",
      bullets: [
        "Jonli tushum ±% delta bilan, ayni shu daqiqada",
        "Smenalar jurnali: kim ochdi, kim yopdi",
        "Har bir sotuv, qaytarish va hisobdan chiqarish kassir ismi bilan",
      ],
    },
    early: {
      eyebrow: "Ishga tushirish",
      headline: "Do'konni bir kunda ulaymiz, siz bilan birga.",
      applicationNote: "Ariza qoldiring: nuqta, jihoz kerakmi va ulash vaqtini kelishamiz.",
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
      subtitle: "Kassa, ombor, nasiya, QR-to'lov va do'kon boshqaruvi haqida maqolalar.",
      categories: "Blog bo'limlari",
      latest: "Yangi maqolalar",
      countLabel: "maqola",
      readMore: "O'qish",
      allPosts: "Barcha maqolalar",
      topics: ["Kassa", "Ombor", "Nasiya", "QR-to'lov", "Do'kon boshqaruvi"],
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
      delta: "Kechagidan 12% ko'p",
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
      title: "Do'konda bo'lmasam ham, biznesni ko'rib turaman.",
      remoteNote: "Uyda, yo'lda yoki boshqa nuqtada. Telefonni ochdingiz, do'konni real vaqtda ko'rasiz.",
      body:
        "Tushum, kassir smenalari, qaytarishlar, kam qolgan tovarlar va to'lov tarkibi bitta boshqaruv ekranida. Kun qanday o'tganini bilish uchun kassirga qo'ng'iroq qilish shart emas.",
      bullets: ["Egasi va kassir uchun PIN-rollar", "Sotuv, qaytarish va hisobdan chiqarish jurnali", "Telegram-cheklar va kunlik yakunlar"],
      metrics: [
        { label: "Bugungi tushum", value: "3 450 000", detail: "Kechagidan 12% ko'p" },
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
      eyebrow: "Start narx",
      amount: "49 000",
      suffix: "so'm / oy",
      laterAmount: "149 000",
      laterSuffix: "so'm / oy",
      scarcity: "Birinchi do'konlar uchun erta kirish narxi",
      body: "Birinchi 6 oy: oyiga 49 000 so'm. Keyin shaffof: oyiga 149 000 so'm. To'liq funksiyalar va ishga tushirishda yordam.",
      bullets: ["Kassa, ombor, QR-to'lov va hisobotlar", "Birinchi kuni majburiy uskuna xaridi yo'q", "Birinchi startda yordam"],
      cta: "Ariza topshirish",
    },
    trust: {
      eyebrow: "Ishonch",
      title: "Egasi va kassir uchun aniq qoidalar.",
      body: "BirLiy mo'jiza va'da qilmaydi. Sotuvlarni tartibli saqlaydi, rollarni ajratadi va narxni oldindan ko'rsatadi.",
      items: [
        "PIN-rollar",
        "Har bir sotuv kassir nomi bilan saqlanadi",
        "Ma'lumotlar xavfsiz saqlanadi",
        "Telegram orqali yordam",
        "Narx oldindan ma'lum",
        "Yashirin to'lovsiz",
      ],
    },
    footer: {
      tagline: "Sizning biznesingiz. Bitta joyda.",
      cols: [
        { title: "Mahsulot", links: [["Demo", "#reveal"], ["Modullar", "#modules"], ["Egasi uchun", "#owner"], ["FAQ", "#faq"], ["Blog", "/blog"]] },
        { title: "Kimlar uchun", links: [["Uy yonidagi do'kon", "#segments"], ["Minimarket", "#segments"], ["Oziq-ovqat do'koni", "#segments"]] },
        { title: "Ulanish", links: [["Ishga tushirish", "#setup"], ["Narx", "#price"], ["Ariza", "#lead"]] },
        { title: "Qidiruv", links: [["Do'kon uchun programma", "/uz/dokon-uchun-programma"], ["Do'kon kassa", "/uz/dokon-kassa"], ["Magazin programma", "/uz/magazin-uchun-programma"], ["Nasiya daftar", "/uz/nasiya-daftar"], ["Ombor dasturi", "/uz/ombor-dasturi"], ["Telefon kassa", "/uz/telefon-kassa"]] },
      ],
      legalTitle: "Hujjatlar",
      legalNote: "Chop etishdan oldin yuridik tekshiruv kerak.",
      legalItems: ["Privacy Policy", "Public Offer / Terms", "Personal Data Policy"],
      contactTitle: "Kontakt",
      telegram: "@bir_liy",
      telegramHref: "https://t.me/bir_liy",
      support: "Bizga murojaat uchun",
      supportHref: "https://t.me/birliy_support_bot",
      phone: "+998 95 240 24 54",
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
    initial: false,
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

function HeroProductPanel({
  locale,
  revenueLabel,
  revenue,
  delta,
  status,
  badge,
}: {
  locale: Locale;
  revenueLabel: string;
  revenue: string;
  delta: string;
  status: string;
  badge: string;
}) {
  const labels = locale === "ru"
    ? {
        screen: "Рабочий экран",
        demo: "Демо данные",
        stock: "Склад",
        low: "мало",
        sales: "Продажи",
        payment: "Оплата",
        debt: "Долг",
        average: "Средний чек",
        items: ["Cola 1.5L", "Non", "Sut 1L"],
      }
    : {
        screen: "Ish ekrani",
        demo: "Demo ma'lumot",
        stock: "Ombor",
        low: "kam",
        sales: "Sotuvlar",
        payment: "To'lov",
        debt: "Nasiya",
        average: "O'rtacha chek",
        items: ["Cola 1.5L", "Non", "Sut 1L"],
      };

  return (
    <div className="rounded-[1.45rem] border border-white/14 bg-[#eef5ef] p-4 text-ink-900 shadow-[0_44px_100px_-44px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#d9e2db] pb-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-normal text-green-800">{labels.screen}</p>
          <p className="mt-1 text-sm font-bold text-ink-500">{labels.demo}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-extrabold text-green-800 ring-1 ring-green-700/10">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1.15fr_0.85fr] gap-3">
        <div className="rounded-2xl bg-[#0b1826] p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-normal text-white/48">{revenueLabel}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums">
            <CountUp value={revenue} />
          </p>
          <p className="mt-2 text-sm font-semibold text-green-300">{delta}</p>
        </div>
        <div className="rounded-2xl border border-[#d9e2db] bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-50 text-green-700">
              <Boxes size={18} strokeWidth={2.25} />
            </span>
            <span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-xs font-extrabold text-[#9a3412]">
              18 {labels.low}
            </span>
          </div>
          <p className="mt-4 text-sm font-extrabold text-ink-900">{labels.stock}</p>
          <div className="mt-3 h-2 rounded-full bg-[#edf1ed]">
            <div className="h-2 w-2/3 rounded-full bg-green-700" />
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-[#d9e2db] bg-white p-4">
        <div className="flex items-center justify-between text-sm font-extrabold text-ink-900">
          <span>{labels.sales}</span>
          <span>42</span>
        </div>
        <div className="mt-3 grid gap-2">
          {labels.items.map((item, index) => (
            <div key={item} className="flex items-center justify-between rounded-xl bg-[#f7faf8] px-3 py-2 text-sm font-bold text-ink-700">
              <span>{item}</span>
              <span>{["18 000", "4 000", "14 000"][index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: Receipt, label: labels.average, value: "87 000" },
          { icon: QrCode, label: labels.payment, value: "QR" },
          { icon: Wallet, label: labels.debt, value: "0" },
        ].map((tile) => {
          const Icon = tile.icon;
          return (
            <div key={tile.label} className="rounded-2xl border border-[#d9e2db] bg-white p-3">
              <Icon size={17} strokeWidth={2.25} className="text-green-700" />
              <p className="mt-2 text-[11px] font-bold leading-4 text-ink-500">{tile.label}</p>
              <p className="mt-1 text-base font-extrabold text-ink-900">{tile.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-green-700/15 bg-green-50 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <p className="text-sm font-extrabold text-green-900">{badge}</p>
      </div>
    </div>
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
  // Carries the segment that opened the lead form (e.g. "shop", "cafe") so the
  // form can attach it for attribution; cleared when no segment-card opened it.
  const [leadSegment, setLeadSegment] = useState<string | undefined>(undefined);
  const [leadNeedsEquipment, setLeadNeedsEquipment] = useState(false);
  const [heroGone, setHeroGone] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const [activeMobileNav, setActiveMobileNav] = useState("top");
  const openLead = (placement: string, segment?: string, options?: { needsEquipment?: boolean }) => {
    trackSiteEvent("cta_click", segment ? { placement, segment } : { placement });
    setLeadSegment(segment);
    setLeadNeedsEquipment(Boolean(options?.needsEquipment));
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
  const mobileDockItems = [
    { id: "flow", href: "#flow", label: t.mobileNav.flow, icon: ScanLine },
    { id: "reveal", href: "#reveal", label: t.mobileNav.product, icon: Smartphone },
    { id: "price", href: "#price", label: t.mobileNav.price, icon: Wallet },
  ];
  const mobileMenuItems = [
    { href: "#flow", label: t.nav[0].label, icon: ScanLine },
    { href: "#owner", label: t.nav[1].label, icon: BarChart3 },
    { href: "#modules", label: t.nav[2].label, icon: Smartphone },
    { href: "#blog", label: t.nav[3].label, icon: Receipt },
    { href: "#price", label: t.nav[4].label, icon: Wallet },
  ];

  // Keep <html lang> in sync with the active locale (app/layout.tsx hardcodes "uz").
  // The data flag gives browser QA a deterministic point after hydration.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.birliyLandingReady = locale;
    return () => {
      if (document.documentElement.dataset.birliyLandingReady === locale) {
        delete document.documentElement.dataset.birliyLandingReady;
      }
    };
  }, [locale]);

  // BR-12 page_view: fire one funnel page_view per landing render, after the
  // <html lang> is set above so the beacon and gtag carry the right lang. This
  // is the GA4-compatible funnel start; VisitorBeacon counts the raw hit in our
  // own DB separately. Locale is fixed per route, so this runs once on mount.
  useEffect(() => {
    trackSiteEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ids = mobileDockItems.map((item) => item.id);
    const visible = new Map<string, number>();
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const updateActive = () => {
      const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      if (best) setActiveMobileNav(best);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        updateActive();
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] },
    );

    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
    // mobileDockItems are derived from static locale copy; route changes remount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const showSticky = heroGone && !nearBottom && !leadOpen && !menuOpen;

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

      {/* Native mobile experience (separate from desktop, not a shrunk copy).
          Shown below lg; desktop tree below is wrapped in `hidden lg:block`. */}
      <div className="lg:hidden">
        <MobileLanding
          locale={locale}
          t={t}
          openLead={(placement) => openLead(placement)}
          leadSection={<LeadSection locale={locale} onOpenForm={() => openLead("mobile_lead_section")} />}
        />
      </div>

      {/* Desktop layout — unchanged, only gated to lg+ so it is pixel-identical. */}
      <div className="hidden lg:block">
      <section className="relative overflow-visible bg-[#f4f7f2] text-ink-900 lg:overflow-hidden lg:bg-[#08131c] lg:text-white">
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[radial-gradient(circle_at_78%_-8%,rgba(3,183,61,0.16),transparent_56%)] lg:block"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:36px_36px] lg:block"
        />
        {/* Drifting aurora glows use a hyphen '-', comma, or period (no long dash) decorative, sit below the z-10 content. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, 36, 0], y: [0, -28, 0], opacity: [0.45, 0.72, 0.45] }}
          transition={reduce ? undefined : { duration: 16, ease: "easeInOut", repeat: Infinity }}
          className="hidden"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 24, 0], opacity: [0.28, 0.5, 0.28] }}
          transition={reduce ? undefined : { duration: 21, ease: "easeInOut", repeat: Infinity }}
          className="hidden"
        />

        <header className="sticky top-0 z-40 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-b-2xl border-b border-[#d9e2db] bg-white/96 px-4 py-3 text-ink-900 shadow-[0_18px_45px_-36px_rgba(11,24,38,0.65)] backdrop-blur sm:px-6 lg:relative lg:z-20 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-8 lg:py-4 lg:text-white lg:shadow-none">
          <a href="#top" className="inline-flex min-h-11 items-center" aria-label="BirLiy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birliy-wordmark.png" alt="BirLiy" width={1072} height={360} className="h-8 w-auto lg:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birliy-wordmark-white.png" alt="BirLiy" width={1072} height={360} className="hidden h-8 w-auto lg:block" />
          </a>

          <nav className="hidden items-center gap-1 rounded-lg border border-white/14 bg-white/8 p-1 backdrop-blur lg:flex">
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
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d9e2db] bg-[#f4f6f1] px-3 py-2 text-sm font-extrabold text-ink-900 transition-colors duration-200 ease-birliy hover:bg-white lg:rounded-lg lg:border-white/16 lg:bg-white lg:text-ink-900 lg:hover:bg-white/90"
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
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#d9e2db] bg-[#f4f6f1] text-ink-900 transition-colors duration-200 ease-birliy hover:bg-white lg:hidden"
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
          <nav id="concept-mobile-menu" className="sticky top-[68px] z-30 border-b border-[#d9e2db] bg-white/98 px-4 py-4 text-ink-900 shadow-[0_24px_55px_-38px_rgba(11,24,38,0.65)] backdrop-blur lg:hidden">
            <div className="mx-auto max-w-md">
              <p className="px-1 text-xs font-semibold uppercase tracking-normal text-green-800">{t.mobileNav.menuTitle}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mobileMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#d9e2db] bg-[#f7faf8] px-3 text-sm font-extrabold text-ink-900 transition-colors duration-200 ease-birliy hover:border-green-600/40 hover:bg-white"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-green-50 text-green-700">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 leading-5">{item.label}</span>
                    </a>
                  );
                })}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={t.footer.telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { setMenuOpen(false); trackSiteEvent("telegram_click", { cta_location: "mobile_menu" }); }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#d9e2db] bg-white px-3 text-sm font-extrabold text-ink-900"
                >
                  <Send size={17} />
                  {t.mobileNav.telegram}
                </a>
                <a
                  href={telHref}
                  onClick={() => { setMenuOpen(false); trackSiteEvent("phone_click", { cta_location: "mobile_menu" }); }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#d9e2db] bg-white px-3 text-sm font-extrabold text-ink-900"
                >
                  <Phone size={17} />
                  {t.mobileNav.call}
                </a>
              </div>
              <button type="button" onClick={() => { setMenuOpen(false); openLead("mobile_menu"); }} className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-green-700 px-4 font-extrabold text-white shadow-[0_16px_34px_-20px_rgba(2,127,46,0.9)]">
                {t.meta.primaryCta}
              </button>
            </div>
          </nav>
        )}

        <div id="top" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 pb-6 pt-10 sm:gap-12 sm:px-6 sm:pb-10 sm:pt-12 md:pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-14">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:max-w-none lg:text-left">
            {/* Hero renders statically: it is the LCP element and must be visible
                in SSR HTML, not gated behind JS hydration (PageSpeed mobile). */}
            <motion.p {...fade(0, true)} className="text-xs font-semibold uppercase tracking-normal text-green-700 sm:text-sm lg:text-green-300">
              {t.meta.eyebrow}
            </motion.p>
            {/* Compact viewports use the direct offer copy so price, CTA, and setup facts
                stay visible without waiting for the desktop animated headline. */}
            <motion.h1 {...fade(0.12, true)} className="mx-auto mt-4 max-w-[13ch] text-[31px] font-extrabold leading-[1.08] tracking-normal text-ink-900 min-[390px]:text-[34px] sm:mt-4 sm:max-w-[15ch] sm:text-6xl sm:leading-[1.05] lg:mx-0 lg:max-w-[16ch] lg:text-white lg:text-7xl">
              <span className="block lg:hidden">
                {t.meta.mobileTitleLead}
                <span className="block text-green-700">{t.meta.mobileTitleAccent}</span>
              </span>
              <span className="hidden lg:block">
                {t.meta.mobileTitle}
              </span>
            </motion.h1>
            <motion.p {...fade(0.2, true)} className="mx-auto mt-4 max-w-[31ch] text-[15px] font-semibold leading-6 text-ink-700 sm:mt-6 sm:max-w-2xl sm:text-xl sm:leading-8 lg:mx-0 lg:text-white/78">
              <span className="lg:hidden">{t.meta.mobileSubtitle}</span>
              <span className="hidden lg:inline">{t.meta.subtitle}</span>
            </motion.p>

            {/* Compact proof row keeps price, setup, equipment, and payment facts above the fold. */}
            <motion.div {...fade(0.28, true)} className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
              {t.heroNumbers.map((stat) => (
                <div key={stat.suffix} className="rounded-2xl border border-[#d9e2db] bg-[#f7faf8] px-2 py-3 text-center shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
                  <CountUp value={stat.value} className="block text-[22px] font-extrabold leading-none text-ink-900 sm:text-3xl" />
                  <span className="mt-1 block text-[11px] font-bold leading-tight text-ink-500 sm:text-sm">{stat.suffix}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fade(0.26, true)} className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <button
                type="button"
                onClick={() => openLead("hero")}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-3 font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.88)] transition duration-200 ease-birliy hover:bg-green-800 active:scale-[0.97] motion-reduce:active:scale-100 sm:w-auto lg:min-h-12 lg:rounded-lg"
              >
                {t.meta.primaryCta}
                <ArrowRight size={18} />
              </button>
              <a
                href={t.footer.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSiteEvent("telegram_click", { cta_location: "hero" })}
                className="hidden min-h-12 items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/8 px-5 py-3 font-extrabold text-white backdrop-blur transition-colors duration-200 ease-birliy hover:bg-white/12"
              >
                <Send size={18} />
                {t.meta.telegram}
              </a>
              <a
                href="#reveal"
                onClick={() => trackSiteEvent("product_demo_click", { placement: "hero" })}
                className="hidden min-h-12 items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/8 px-5 py-3 font-extrabold text-white backdrop-blur transition-colors duration-200 ease-birliy hover:bg-white/12 lg:inline-flex"
              >
                {t.meta.secondaryCta}
              </a>
            </motion.div>

            {/* Honest hero trust strip: made-for-UZ, one-day setup, works offline.
                Slim row near the CTA; brand green accent on the lucide icons. */}
            <motion.ul {...fade(0.3, true)} className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:mx-0 lg:max-w-none lg:justify-start">
              {t.meta.trustStrip.map((item, i) => {
                const TrustIcon = [ShieldCheck, Clock3, Smartphone][i] ?? ShieldCheck;
                return (
                  <li key={item} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-700 lg:text-white/80">
                    <TrustIcon size={15} strokeWidth={2.25} className="text-green-700 lg:text-green-300" aria-hidden />
                    {item}
                  </li>
                );
              })}
            </motion.ul>

            {/* Full four-card grid: desktop only. Compact viewports keep the BR
                price / one-day / no-equipment proof points above. */}
            <motion.div {...fade(0.34, true)} className="mt-7 hidden gap-3 lg:grid lg:grid-cols-2 xl:grid-cols-4">
              {t.stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/12 bg-white/8 p-3 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-normal text-white/48">{stat.label}</p>
                  <p className="mt-2 flex flex-wrap items-end gap-2">
                    <CountUp value={stat.value} className="text-2xl font-extrabold leading-none text-white" />
                    <span className="text-sm font-semibold text-white/62">{stat.suffix}</span>
                  </p>
                  {"helper" in stat && stat.helper ? (
                    <p className="mt-1 text-xs font-semibold leading-5 text-white/50">{stat.helper}</p>
                  ) : null}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fade(0.28, true)} className="relative mx-auto hidden w-full max-w-[520px] lg:block">
            {/* Product-first dashboard composition. No fake customer photo in the hero. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] bg-[radial-gradient(58%_52%_at_50%_38%,rgba(3,183,61,0.28),transparent_70%)] blur-2xl"
            />
            <HeroProductPanel
              locale={locale}
              revenueLabel={t.command.revenueLabel}
              revenue={t.command.revenue}
              delta={t.command.delta}
              status={t.command.status}
              badge={t.meta.heroPhotoBadge}
            />
          </motion.div>
        </div>
      </section>

      <EcosystemStrip locale={locale} />

      <section id="reveal" className="relative scroll-mt-24 overflow-hidden bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        {/* Decorative ambient stage use a hyphen '-', comma, or period (no long dash) sits below content, gated on reduce like the hero auroras. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -22, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={reduce ? undefined : { duration: 18, ease: "easeInOut", repeat: Infinity }}
          className="hidden"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -26, 0], y: [0, 20, 0], opacity: [0.22, 0.45, 0.22] }}
          transition={reduce ? undefined : { duration: 23, ease: "easeInOut", repeat: Infinity }}
          className="hidden"
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

      <section id="pain" className="scroll-mt-24 bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-3xl">
            <SectionLabel>{t.pain.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-4xl lg:text-5xl">{t.pain.headline}</h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-ink-700 sm:text-lg sm:leading-8">{t.pain.body}</p>
          </motion.div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {t.pain.points.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.article
                  key={point.title}
                  {...reveal(0.06 + index * 0.06, reduce)}
                  className="rounded-xl border border-[#d9e2db] bg-[#fbfcfb] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-green-700">
                    <Icon size={21} strokeWidth={2.25} />
                  </div>
                  <h3 className="text-lg font-extrabold leading-6 tracking-normal text-ink-900">{point.title}</h3>
                  <p className="mt-2 leading-7 text-ink-500">{point.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="segments" className="relative hidden overflow-hidden border-y border-[#d9e2db] bg-white py-16 sm:py-20 lg:block lg:py-24">
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

      <section id="flow" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
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
                  {/* Step number badge: top-left on mobile (geometry unchanged so the
                      vertical connector stays aligned), enlarged and bolder on wide
                      screens for clear 1-2-3-4-5 sequencing. */}
                  <span className="absolute left-4 top-5 grid h-9 w-9 place-items-center rounded-full bg-green-700 text-sm font-extrabold text-white ring-2 ring-green-700/20 sm:static sm:mb-4 sm:h-12 sm:w-12 sm:text-2xl sm:ring-4">
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

      {/* By the numbers: honest product facts only (no client counts / testimonials). */}
      <section id="numbers" className="scroll-mt-24 border-y border-[#d9e2db] bg-[#f7faf8] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-3xl">
            <SectionLabel>{t.byNumbers.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-4xl">{t.byNumbers.title}</h2>
          </motion.div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {t.byNumbers.items.map((item, index) => (
              <motion.div
                key={item.label}
                {...reveal(index * 0.05, reduce)}
                className="rounded-2xl border border-[#d9e2db] bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)] sm:p-5"
              >
                <p className="flex flex-wrap items-baseline gap-1.5">
                  <CountUp value={item.value} className="text-3xl font-extrabold leading-none text-green-700 sm:text-4xl" />
                  <span className="text-sm font-bold text-ink-500">{item.suffix}</span>
                </p>
                <p className="mt-2 text-sm font-semibold leading-5 text-ink-700">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="owner" className="relative scroll-mt-24 overflow-hidden bg-[#0b1826] py-16 text-white sm:py-20 lg:py-24">
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
          className="hidden"
        />
        <motion.div
          aria-hidden
          initial={false}
          animate={reduce ? undefined : { x: [0, -24, 0], y: [0, 22, 0], opacity: [0.24, 0.46, 0.24] }}
          transition={reduce ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity }}
          className="hidden"
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

      <section id="modules" className="relative scroll-mt-24 overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        {/* Branded top accent rail + soft aurora wash use a hyphen '-', comma, or period (no long dash) decorative, behind content. */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(3,183,61,0.55),transparent)]" />
        <motion.span
          aria-hidden
          {...fade(0, reduce)}
          className="hidden"
        />
        <motion.span
          aria-hidden
          {...fade(0.08, reduce)}
          className="hidden"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
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

          {/* Desktop product switcher: phone vs full setup. Mobile gets a compact
              equipment CTA below the modules instead of repeating this visual. */}
          <div className="order-3 mt-10 hidden lg:block">
            <h3 className="text-center text-2xl font-extrabold tracking-normal text-ink-900">
              {locale === "ru" ? "Как начать?" : "Qanday boshlaysiz?"}
            </h3>
            <div className="flex justify-center">
              <div className="mt-4 inline-flex rounded-full border border-[#d9e2db] bg-white p-1 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
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
              <motion.div {...reveal(0.05, reduce)} className="relative mx-auto hidden w-full max-w-[420px] lg:block">
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
          <div className="order-2 mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

          <div className="order-4 mt-8 rounded-3xl border border-[#d9e2db] bg-[#f7faf8] p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)] lg:hidden">
            <SectionLabel>{locale === "ru" ? "Оборудование" : "Jihozlar"}</SectionLabel>
            <h3 className="text-2xl font-extrabold leading-tight tracking-normal text-ink-900">
              {locale === "ru"
                ? "Если нужен комплект, отметьте это в заявке"
                : "Jihoz kerak bo'lsa, arizada bitta belgi yetadi"}
            </h3>
            <p className="mt-3 text-base font-medium leading-7 text-ink-700">
              {locale === "ru"
                ? "Можно начать с телефона. Если нужен полный комплект, BirLiy согласует планшет, сканер и чековый принтер."
                : "Telefondan boshlash mumkin. To'liq to'plam kerak bo'lsa, BirLiy planshet, skaner va chek printerini kelishadi."}
            </p>
            <div className="mt-5 grid gap-2">
              {(locale === "ru"
                ? [
                    { icon: Tablet, label: "Планшет", sub: "для кассы" },
                    { icon: ScanLine, label: "Сканер", sub: "для штрих-кода" },
                    { icon: Printer, label: "Чековый принтер", sub: "для печати чеков" },
                  ]
                : [
                    { icon: Tablet, label: "Planshet", sub: "kassa uchun" },
                    { icon: ScanLine, label: "Skaner", sub: "shtrix-kod uchun" },
                    { icon: Printer, label: "Chek printeri", sub: "chek chiqarish uchun" },
                  ]
              ).map((piece) => {
                const PieceIcon = piece.icon;
                return (
                  <div key={piece.label} className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#d9e2db] bg-white px-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-700">
                      <PieceIcon size={19} strokeWidth={2.25} />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold leading-5 text-ink-900">{piece.label}</span>
                      <span className="block text-xs font-bold leading-5 text-ink-500">{piece.sub}</span>
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => openLead("mobile_equipment", undefined, { needsEquipment: true })}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 font-extrabold text-white shadow-[0_14px_32px_-20px_rgba(3,183,61,0.9)]"
            >
              {locale === "ru"
                ? "Нужен комплект: планшет, сканер и принтер"
                : "Menga jihoz kerak: planshet, skaner va printer"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section id="setup" className="relative scroll-mt-24 overflow-hidden border-y border-[#d9e2db] bg-[#e9eff0] py-16 sm:py-20 lg:py-24">
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
            <span aria-hidden className="hidden" />
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
                  className="grid h-[52px] min-h-[52px] w-[52px] min-w-[52px] place-items-center rounded-xl bg-green-700 font-extrabold text-white ring-1 ring-green-700/25 transition-transform duration-200 ease-birliy group-hover:scale-[1.08] motion-reduce:group-hover:scale-100"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.div>
                <p className="text-lg font-extrabold leading-7 tracking-normal">{item}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="relative scroll-mt-24 overflow-hidden border-y border-[#d9e2db] bg-white py-12 sm:py-20 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(3,183,61,0.08),transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>{t.blog.eyebrow}</SectionLabel>
              <h2 className="text-[28px] font-extrabold leading-[1.12] tracking-normal text-ink-900 sm:text-4xl">
                {t.blog.title}
              </h2>
              <p className="mt-3 text-base font-medium leading-7 text-ink-700 sm:mt-4 sm:text-lg sm:leading-8">{t.blog.subtitle}</p>
            </div>
            <a
              href={blogIndexPath(locale)}
              onClick={() => trackSiteEvent("blog_click", { cta_location: "blog_index" })}
              className="inline-flex min-h-11 shrink-0 items-center justify-start gap-2 text-sm font-extrabold text-green-800 transition-colors duration-200 ease-birliy hover:text-green-900 sm:min-h-12 sm:justify-center sm:rounded-lg sm:border sm:border-[#d9e2db] sm:bg-white sm:px-5 sm:py-3 sm:hover:border-green-600/50 sm:hover:bg-green-50"
            >
              {t.blog.allPosts}
              <ArrowRight size={18} />
            </a>
          </motion.div>

          <motion.div {...reveal(0.06, reduce)} className="mt-7 sm:mt-8 sm:rounded-2xl sm:border sm:border-[#d9e2db] sm:bg-[#f7faf8] sm:p-5">
            <p className="text-sm font-extrabold text-ink-900">{t.blog.categories}</p>
            <div className="-mx-4 mt-3 flex snap-x flex-nowrap gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {t.blog.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex min-h-10 shrink-0 snap-start items-center rounded-full border border-[#d9e2db] bg-white px-4 text-sm font-extrabold text-ink-700"
                >
                  {topic}
                </span>
              ))}
              <a
                href={blogIndexPath(locale)}
                onClick={() => trackSiteEvent("blog_click", { cta_location: "blog_categories_all" })}
                className="inline-flex min-h-10 shrink-0 snap-start items-center rounded-full bg-ink-900 px-4 text-sm font-extrabold text-white"
              >
                {t.blog.allPosts}
              </a>
            </div>
          </motion.div>

          <div className="mt-8 flex items-center justify-between gap-4 sm:mt-10">
            <p className="text-sm font-extrabold uppercase tracking-normal text-ink-500">{t.blog.latest}</p>
            <p className="text-sm font-bold text-ink-500">
              {LANDING_BLOG_POSTS.length} {t.blog.countLabel}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {LANDING_BLOG_POSTS.map((post, index) => {
              const c = post.locales[locale];
              const catLabel = CATEGORY_LABEL[postCategory(post)][locale];
              return (
                <motion.a
                  key={post.slug}
                  {...reveal(index * 0.08, reduce)}
                  href={blogPostPath(locale, post.slug)}
                  onClick={() => trackSiteEvent("blog_click", { article_slug: post.slug, cta_location: "blog_card" })}
                  className={`group overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_1px_2px_rgba(11,24,38,0.05)] transition-all duration-200 ease-birliy hover:-translate-y-0.5 hover:border-green-700 hover:shadow-[0_24px_56px_-38px_rgba(11,24,38,0.48)] motion-reduce:hover:translate-y-0 sm:flex sm:h-full sm:flex-col sm:rounded-lg ${
                    index === 0 ? "flex flex-col" : "grid grid-cols-[92px_1fr]"
                  }`}
                >
                  {post.image && (
                    <div className="overflow-hidden bg-paper">
                      <Image
                        src={blogImgPath(post.image.landscape)}
                        alt={c.title}
                        width={1200}
                        height={900}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className={`w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:aspect-[4/3] ${
                          index === 0 ? "aspect-[16/10]" : "h-full min-h-[112px]"
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-500 sm:mb-3">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-800">{catLabel}</span>
                      <span>{BLOG_UI[locale].readingTime(readingTimeMin(post, locale))}</span>
                    </div>
                    <h3 className="font-display text-base font-extrabold leading-snug tracking-normal text-ink-900 transition-colors duration-200 group-hover:text-green-800 sm:text-xl">
                      {c.title}
                    </h3>
                    <p className={`${index === 0 ? "mt-2 line-clamp-2" : "hidden"} text-sm leading-6 text-ink-700 sm:mt-2 sm:line-clamp-3 sm:block`}>{c.description}</p>
                    <span className={`${index === 0 ? "inline-flex" : "hidden"} mt-auto items-center gap-1.5 pt-4 text-sm font-extrabold text-green-800 sm:inline-flex`}>
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

      <section id="price" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel>{t.price.eyebrow}</SectionLabel>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-normal text-green-800 ring-1 ring-green-500/25">
              <Clock3 size={13} strokeWidth={2.5} aria-hidden />
              {t.price.scarcity}
            </span>
            {/* Scarcity framing: early-access rate emphasised, full rate shown honestly. */}
            <h2 className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-4xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-5xl">
              <span className="text-green-700">
                <CountUp value={t.price.amount} /> <span className="text-2xl sm:text-3xl">{t.price.suffix}</span>
              </span>
            </h2>
            <p className="mt-2 text-base font-semibold text-ink-500">
              {locale === "ru" ? "дальше " : "keyin "}
              <span className="text-ink-700 line-through decoration-ink-300">{t.price.laterAmount} {t.price.laterSuffix}</span>
            </p>
            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-ink-700">{t.price.body}</p>
            <button
              type="button"
              onClick={() => openLead("price")}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.88)] transition duration-200 ease-birliy hover:bg-green-800"
            >
              {t.price.cta}
              <ArrowRight size={18} />
            </button>
          </motion.div>
          <motion.div {...reveal(0.08, reduce)} className="rounded-2xl border border-[#d9e2db] bg-[#f7faf8] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] sm:p-6">
            <div className="grid gap-3">
              {t.price.bullets.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-[#d9e2db] bg-white p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-green-50 text-green-700">
                    <Check size={17} strokeWidth={2.6} />
                  </span>
                  <span className="font-extrabold leading-7 text-ink-900">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-bold leading-6 text-ink-500 ring-1 ring-[#d9e2db]">
              {locale === "ru"
                ? "Оборудование не обязательно для старта. Если нужен комплект, отметьте это в заявке."
                : "Start uchun uskuna majburiy emas. Jihoz kerak bo'lsa, arizada belgilang."}
            </p>
          </motion.div>
        </div>
      </section>

      <section id="trust" className="scroll-mt-24 bg-[#0b1826] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-3xl">
            <SectionLabel dark>{t.trust.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">{t.trust.title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t.trust.body}</p>
          </motion.div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.trust.items.map((item, index) => (
              <motion.div
                key={item}
                {...reveal(0.05 + index * 0.04, reduce)}
                className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/[0.07] p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-green-500/15 text-green-300 ring-1 ring-green-400/25">
                  <ShieldCheck size={17} strokeWidth={2.4} />
                </span>
                <p className="font-semibold leading-7 text-white/86">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
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

      <section id="lead" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
        <LeadSection locale={locale} onOpenForm={() => openLead("lead_section")} />
      </section>

      <footer className="border-t border-[#d9e2db] bg-[#f7faf8] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_0.9fr_1fr]">
            <div>
              <a href="#top" className="inline-flex items-center" aria-label="BirLiy">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/birliy-wordmark.png" alt="BirLiy" width={1216} height={403} loading="lazy" decoding="async" className="h-9 w-auto" />
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">{t.footer.legalTitle}</p>
              <ul className="mt-4 grid gap-3">
                {t.footer.legalItems.map((item) => (
                  <li key={item} className="text-sm font-bold leading-6 text-ink-700">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold leading-5 text-ink-500">{t.footer.legalNote}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">{t.footer.contactTitle}</p>
              <a
                href={t.footer.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSiteEvent("telegram_click", { cta_location: "footer" })}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Send size={16} className="text-green-700" />
                {t.footer.telegram}
              </a>
              <a
                href={t.footer.supportHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSiteEvent("telegram_click", { cta_location: "footer_support" })}
                className="mt-3 flex min-h-11 items-center gap-2 text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Send size={16} className="text-green-700" />
                {t.footer.support}
              </a>
              <a
                href={telHref}
                onClick={() => trackSiteEvent("phone_click", { cta_location: "footer" })}
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-base font-extrabold tracking-normal text-ink-900 transition-colors duration-200 ease-birliy hover:text-green-700"
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
      </div>
      {/* end desktop-only tree (hidden lg:block) */}

      {/* Legacy mobile dock is retired: MobileLanding owns the single sticky CTA.
          Kept rendered but fully hidden so its observers/state stay harmless. */}
      <div
        ref={stickyRef}
        data-testid="mobile-sticky"
        aria-hidden
        className="hidden"
      >
        {/* App-style mobile dock: primary sections are one tap away, while the
            application button stays visually dominant. It hides over #lead and
            the footer (showSticky), so it never covers inputs or footer links. */}
        <nav aria-label={t.mobileNav.landmark} className="mx-auto grid max-w-lg grid-cols-[1fr_1fr_1fr_1.35fr] items-center gap-1 rounded-2xl border border-[#d9e2db] bg-white p-1.5 shadow-[0_14px_42px_-28px_rgba(11,24,38,0.55)]">
          {mobileDockItems.map((item) => {
            const Icon = item.icon;
            const active = activeMobileNav === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={active ? "location" : undefined}
                onClick={() => trackSiteEvent("cta_click", { placement: "mobile_dock", step: item.id })}
                className={`flex min-h-[54px] items-center justify-center gap-1.5 rounded-xl px-1 text-[12px] font-extrabold leading-none transition-colors duration-200 ease-birliy ${active ? "bg-green-50 text-green-900" : "text-ink-700 hover:bg-[#f4f6f1] hover:text-ink-900"}`}
              >
                <Icon size={16} strokeWidth={2.2} />
                <span className="min-w-0 truncate leading-3">{item.label}</span>
              </a>
            );
          })}
          <button
            type="button"
            aria-label={`${t.mobileNav.apply}, ${t.meta.primaryCta}`}
            onClick={() => openLead("mobile_dock")}
            className="flex min-h-[54px] items-center justify-center gap-1.5 rounded-xl bg-green-700 px-2 text-[12px] font-extrabold leading-none text-white shadow-[0_12px_28px_-16px_rgba(3,183,61,0.95)] transition-colors duration-200 ease-birliy hover:bg-green-800"
          >
            <ArrowRight size={16} strokeWidth={2.5} />
            <span className="min-w-0 truncate leading-3">{t.mobileNav.apply}</span>
          </button>
        </nav>
      </div>

      <LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        locale={locale}
        segment={leadSegment}
        initialNeedsEquipment={leadNeedsEquipment}
      />
    </main>
  );
}
