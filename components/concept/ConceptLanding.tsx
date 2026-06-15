"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  Pill,
  QrCode,
  Receipt,
  ScanLine,
  Send,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

type Locale = "ru" | "uz";

const EASE = [0.2, 0.8, 0.2, 1] as const;

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
      secondaryCta: "Смотреть продукт",
      telegram: "Telegram",
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
    segments: ["Магазин у дома", "Минимаркет", "Кафе", "Аптека", "Сервисная точка"],
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
    },
    segments2: {
      eyebrow: "Главные клиенты",
      title: "Сначала для магазинов у дома и минимаркетов.",
      photoAlt: "QR-оплата в магазине на BirLiy",
      cards: [
        { title: "Магазин у дома", body: "Продукты, бытовая химия, ежедневные товары. 1 кассир, до 200 чеков в день.", icon: Store },
        { title: "Минимаркет", body: "Сотни позиций, несколько кассиров, контроль остатков и смен.", icon: ShoppingCart },
        { title: "Кафе и точка питания", body: "Быстрый чек, оплата по QR, чек в Telegram. Без печатной техники.", icon: Coffee },
        { title: "Аптека", body: "Точный учёт по наименованиям, контроль сроков годности.", icon: Pill },
        { title: "Сервисная точка", body: "Ремонт, химчистка, ателье. Приём оплаты и журнал заказов.", icon: Wrench },
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
      scarcity: "Оставьте заявку: проверим данные магазина и согласуем подключение.",
      photoAlt: "Владельцы магазина смотрят отчёты на планшете",
      cta: "Оставить заявку",
      promises: [
        { title: "Подключаем за один день", caption: "Установка, настройка, первый чек за одну встречу с менеджером." },
        { title: "Помогаем заполнить каталог", caption: "Загружаем товары из Excel или вносим первые 100 SKU вместе." },
        { title: "49 000 сум/мес на старте", caption: "Низкая стартовая цена на первые 6 месяцев: спокойно проверить BirLiy." },
      ],
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
        { title: "Сканирование", text: "Камера или 2D-сканер добавляет товар в чек.", icon: ScanLine },
        { title: "Оплата", text: "Наличные, терминал, QR или долг остаются в одной смене.", icon: QrCode },
        { title: "Чек", text: "Электронный чек уходит покупателю в Telegram.", icon: Receipt },
        { title: "Склад", text: "Остатки и отчёты обновляются после продажи.", icon: PackageCheck },
      ],
    },
    owner: {
      eyebrow: "02 / Панель владельца",
      title: "Владелец видит магазин даже когда он не у кассы.",
      body:
        "Выручка, смены кассиров, возвраты, низкие остатки и структура оплат собраны в один командный экран. Не надо звонить кассиру, чтобы понять, как прошёл день.",
      bullets: ["PIN-роли для владельца и кассира", "Журнал продаж, возвратов и списаний", "Telegram-чеки и дневные итоги"],
      metrics: [
        { label: "Дельта выручки", value: "+12%", detail: "рост за день" },
        { label: "Кассиры", value: "3", detail: "смены под контролем" },
        { label: "Пополнить", value: "18", detail: "товаров мало" },
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
      steps: [
        "Создать торговую точку и роли",
        "Импортировать каталог или добавить первые товары",
        "Провести первый чек вместе с кассиром",
        "Проверить выручку, оплату и остатки за день",
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
        { title: "Для кого", links: [["Магазин у дома", "#segments"], ["Минимаркет", "#segments"], ["Кафе", "#segments"], ["Аптека", "#segments"], ["Сервис", "#segments"]] },
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
      secondaryCta: "Mahsulotni ko'rish",
      telegram: "Telegram",
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
    segments: ["Uy yonidagi do'kon", "Minimarket", "Kafe", "Dorixona", "Servis nuqtasi"],
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
    },
    segments2: {
      eyebrow: "Asosiy mijozlar",
      title: "Avvalo uy yonidagi do'kon va minimarketlar uchun.",
      photoAlt: "BirLiy do'konida QR-to'lov",
      cards: [
        { title: "Uy yonidagi do'kon", body: "Oziq-ovqat, maishiy kimyo, kundalik tovarlar. 1 kassir, kuniga 200 tagacha chek.", icon: Store },
        { title: "Minimarket", body: "Yuzlab pozitsiya, bir necha kassir, qoldiq va smenalar nazorati.", icon: ShoppingCart },
        { title: "Kafe va ovqatlanish nuqtasi", body: "Tez chek, QR orqali to'lov, Telegramda chek. Chop etish texnikasisiz.", icon: Coffee },
        { title: "Dorixona", body: "Nomlar bo'yicha aniq hisob, yaroqlilik muddatlari nazorati.", icon: Pill },
        { title: "Xizmat nuqtasi", body: "Ta'mirlash, kimyoviy tozalash, tikuvchilik. To'lov va buyurtmalar jurnali.", icon: Wrench },
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
      scarcity: "Ariza qoldiring: do'kon ma'lumotlarini tekshirib, ulanishni kelishamiz.",
      photoAlt: "Do'kon egalari planshetda hisobotlarni ko'rmoqda",
      cta: "Ariza qoldirish",
      promises: [
        { title: "Bir kunda ulaymiz", caption: "O'rnatish, sozlash, birinchi chek menejer bilan bitta uchrashuvda." },
        { title: "Katalogni to'ldirishga yordam", caption: "Tovarlarni Exceldan yuklaymiz yoki birinchi 100 SKU'ni birga kiritamiz." },
        { title: "Startda 49 000 so'm/oy", caption: "Birinchi 6 oyga past start narxi: BirLiy'ni bemalol sinab ko'rasiz." },
      ],
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
        { title: "Skanerlash", text: "Kamera yoki 2D-skaner tovarni chekka qo'shadi.", icon: ScanLine },
        { title: "To'lov", text: "Naqd, terminal, QR yoki qarz bitta smenada qoladi.", icon: QrCode },
        { title: "Chek", text: "Elektron chek xaridorga Telegram orqali yuboriladi.", icon: Receipt },
        { title: "Ombor", text: "Qoldiq va hisobotlar sotuvdan keyin yangilanadi.", icon: PackageCheck },
      ],
    },
    owner: {
      eyebrow: "02 / Egasi paneli",
      title: "Egasi kassada bo'lmasa ham do'konni ko'rib turadi.",
      body:
        "Tushum, kassir smenalari, qaytarishlar, kam qolgan tovarlar va to'lov tarkibi bitta boshqaruv ekranida. Kun qanday o'tganini bilish uchun kassirga qo'ng'iroq qilish shart emas.",
      bullets: ["Egasi va kassir uchun PIN-rollar", "Sotuv, qaytarish va hisobdan chiqarish jurnali", "Telegram-cheklar va kunlik yakunlar"],
      metrics: [
        { label: "Tushum o'zgarishi", value: "+12%", detail: "kunlik o'sish" },
        { label: "Kassirlar", value: "3", detail: "smenalar nazoratda" },
        { label: "To'ldirish", value: "18", detail: "tovar kamaygan" },
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
      steps: [
        "Savdo nuqtasi va rollarni yaratish",
        "Katalogni import qilish yoki ilk tovarlarni qo'shish",
        "Kassir bilan birinchi chekni o'tkazish",
        "Kunlik tushum, to'lov va qoldiqni tekshirish",
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
        { title: "Kimlar uchun", links: [["Uy yonidagi do'kon", "#segments"], ["Minimarket", "#segments"], ["Kafe", "#segments"], ["Dorixona", "#segments"], ["Xizmat", "#segments"]] },
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
  const [faqOpen, setFaqOpen] = useState<number>(0);
  const [leadOpen, setLeadOpen] = useState(false);
  const [heroGone, setHeroGone] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const openLead = (placement: string) => {
    trackSiteEvent("cta_click", { placement });
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

        <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="inline-flex min-h-11 items-center gap-2.5" aria-label="BirLiy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/birliy-symbol.svg" alt="" width={84} height={96} className="h-7 w-auto" />
            <span className="text-2xl font-extrabold tracking-tight text-white">BirLiy</span>
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

        <div id="top" className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-8 sm:px-6 md:pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-14">
          <div>
            {/* Hero renders statically: it is the LCP element and must be visible
                in SSR HTML, not gated behind JS hydration (PageSpeed mobile). */}
            <motion.p {...fade(0, true)} className="text-sm font-semibold uppercase tracking-normal text-green-300">
              {t.meta.eyebrow}
            </motion.p>
            <motion.h1 {...fade(0.12, true)} className="mt-4 max-w-[16ch] text-5xl font-extrabold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl">
              <HeroTitle lead={t.meta.titleLead} words={t.meta.titleWords} tail={t.meta.titleTail} reduce={reduce} />
            </motion.h1>
            <motion.p {...fade(0.2, true)} className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/78 sm:text-xl">
              {t.meta.subtitle}
            </motion.p>

            <motion.div {...fade(0.26, true)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openLead("hero")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.88)] transition duration-200 ease-birliy hover:bg-green-800 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                {t.meta.primaryCta}
                <ArrowRight size={18} />
              </button>
              <a
                href="#reveal"
                onClick={() => trackSiteEvent("product_demo_click", { placement: "hero" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/8 px-5 py-3 font-extrabold text-white backdrop-blur transition-colors duration-200 ease-birliy hover:bg-white/12"
              >
                {t.meta.secondaryCta}
              </a>
            </motion.div>

            <motion.div {...fade(0.34, true)} className="mt-9 grid gap-3 sm:grid-cols-2">
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

          <motion.div {...fade(0.28, true)} className="relative mx-auto w-full max-w-[560px]">
            <div className="overflow-hidden rounded-2xl border border-white/12 shadow-[0_44px_100px_-44px_rgba(0,0,0,0.9)]">
              <Image
                src="/photos/owner-tablet.jpg"
                alt={locale === "ru" ? "Владелец магазина работает с BirLiy на планшете" : "Do'kon egasi BirLiy bilan planshetda ishlamoqda"}
                width={1120}
                height={840}
                priority
                quality={60}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto max-h-[300px] w-full object-cover object-top sm:max-h-none"
              />
            </div>
            <LiveShiftBadge
              locale={locale}
              label={t.command.revenueLabel}
              value={t.command.revenue}
              delta={t.command.delta}
              status={t.command.status}
            />
            <div className="absolute -bottom-4 -left-3 flex items-center gap-2 rounded-xl border border-white/14 bg-[#0b1826]/92 px-4 py-3 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-semibold text-white">{t.meta.heroPhotoBadge}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <EcosystemStrip locale={locale} />

      <section id="pain" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-4xl">
            <SectionLabel>{t.pain.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-[1.12] tracking-normal text-ink-900 sm:text-4xl lg:text-[2.75rem]">{t.pain.headline}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-700">{t.pain.body}</p>
          </motion.div>
          <motion.div {...reveal(0.1, reduce)} className="mx-auto mt-12 max-w-3xl">
            <PaperVsBirliy locale={locale} />
          </motion.div>
        </div>
      </section>

      <section id="reveal" className="overflow-hidden bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {t.scroll.eyebrow}
            </p>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-5xl">{t.scroll.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink-700">{t.scroll.body}</p>
          </motion.div>

          <motion.div {...reveal(0.06, reduce)} className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-[#d9e2db] bg-white p-1 shadow-[0_1px_2px_rgba(11,24,38,0.06)]">
              <button
                type="button"
                onClick={() => setDemoRole("cashier")}
                aria-pressed={demoRole === "cashier"}
                className={`min-h-10 rounded-full px-4 text-sm font-extrabold transition sm:px-5 ${demoRole === "cashier" ? "bg-green-700 text-white" : "text-ink-700 hover:text-ink-900"}`}
              >
                {t.scroll.roleCashier}
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("owner")}
                aria-pressed={demoRole === "owner"}
                className={`min-h-10 rounded-full px-4 text-sm font-extrabold transition sm:px-5 ${demoRole === "owner" ? "bg-green-700 text-white" : "text-ink-700 hover:text-ink-900"}`}
              >
                {t.scroll.roleOwner}
              </button>
            </div>
          </motion.div>

          <motion.div {...reveal(0.1, reduce)} className="mx-auto mt-6 max-w-5xl">
            <div className="rounded-[28px] border-4 border-[#1b2733] bg-[#0b1826] p-2 shadow-[0_40px_90px_-50px_rgba(11,24,38,0.85)] md:p-3">
              {demoRole === "cashier" ? <PosDemo locale={locale} /> : <AdminDemo locale={locale} />}
            </div>
            <p className="mt-4 text-center text-sm font-bold text-ink-500">{t.scroll.hint}</p>
          </motion.div>
        </div>
      </section>

      <section id="segments" className="border-y border-[#d9e2db] bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-3xl">
            <SectionLabel>{t.segments2.eyebrow}</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">{t.segments2.title}</h2>
          </motion.div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.segments2.cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  {...reveal(index * 0.04, reduce)}
                  className="rounded-lg border border-[#d9e2db] bg-[#fbfcfb] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-transform duration-200 ease-birliy hover:-translate-y-0.5"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-green-700">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-normal">{card.title}</h3>
                  <p className="mt-2 leading-7 text-ink-500">{card.body}</p>
                </motion.article>
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
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.flow.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  {...reveal(index * 0.05, reduce)}
                  className="rounded-lg border border-[#d9e2db] bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-transform duration-200 ease-birliy hover:-translate-y-0.5"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-green-700">
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

      <section id="owner" className="bg-[#0b1826] py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel dark>{t.owner.eyebrow}</SectionLabel>
            <h2 className="max-w-[17ch] text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.owner.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">{t.owner.body}</p>
            <div className="mt-8 grid gap-3">
              {t.owner.bullets.map((item, index) => (
                <motion.div key={item} {...reveal(index * 0.05, reduce)} className="flex items-start gap-3 rounded-lg border border-white/12 bg-white/[0.07] p-4">
                  <Check size={20} className="mt-0.5 shrink-0 text-green-300" />
                  <p className="font-semibold leading-7 text-white/86">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal(0.08, reduce)} className="grid gap-3 sm:grid-cols-3">
            {t.owner.metrics.map((metric) => (
              <article key={metric.label} className="rounded-lg border border-white/12 bg-white/[0.07] p-5">
                <p className="text-sm font-semibold text-white/52">{metric.label}</p>
                <p className="mt-2 text-4xl font-extrabold tracking-normal text-white">{metric.value}</p>
                <p className="mt-2 text-sm font-semibold text-green-300">{metric.detail}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="owner-control" className="bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel>{t.ownerControl.eyebrow}</SectionLabel>
            <h2 className="max-w-[14ch] text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl lg:text-5xl">{t.ownerControl.headline}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">{t.ownerControl.body}</p>
            <div className="mt-8 grid gap-3">
              {t.ownerControl.bullets.map((item, index) => (
                <motion.div key={item} {...reveal(index * 0.05, reduce)} className="flex items-start gap-3 rounded-lg border border-[#d9e2db] bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
                  <Check size={20} className="mt-0.5 shrink-0 text-green-700" />
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
            <div className="absolute -bottom-4 -right-3 hidden items-center gap-2 rounded-xl border border-[#d9e2db] bg-white px-4 py-3 shadow-[0_24px_50px_-30px_rgba(11,24,38,0.4)] sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-sm font-semibold text-ink-900">{locale === "ru" ? "Вижу всё с телефона" : "Hammasini telefondan ko'raman"}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="modules" className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="max-w-2xl">
            <SectionLabel>{t.modules.eyebrow}</SectionLabel>
            <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.modules.title}</h2>
          </motion.div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.modules.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  {...reveal(index * 0.04, reduce)}
                  className="rounded-lg border border-[#d9e2db] bg-[#fbfcfb] p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-transform duration-200 ease-birliy hover:-translate-y-0.5"
                >
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-green-50 text-green-700">
                    <Icon size={22} strokeWidth={1.75} />
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

      <section id="rollout" className="border-y border-[#d9e2db] bg-[#e9eff0] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel>{t.rollout.eyebrow}</SectionLabel>
            <h2 className="max-w-[17ch] text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.rollout.title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-ink-700">{t.rollout.body}</p>
          </motion.div>
          <div className="grid gap-3">
            {t.rollout.steps.map((item, index) => (
              <motion.article
                key={item}
                {...reveal(index * 0.05, reduce)}
                className="grid grid-cols-[52px_1fr] items-center gap-4 rounded-lg border border-[#cfdad4] bg-white p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
              >
                <div className="grid h-13 min-h-[52px] w-13 min-w-[52px] place-items-center rounded-lg bg-ink-900 font-extrabold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p className="text-lg font-extrabold leading-7 tracking-normal">{item}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="early-access" className="border-t border-[#d9e2db] bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <motion.div {...reveal(0, reduce)}>
            <SectionLabel>{t.early.eyebrow}</SectionLabel>
            <h2 className="max-w-[20ch] text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl">{t.early.headline}</h2>
            <div className="mt-7 grid gap-3">
              {t.early.promises.map((promise, index) => (
                <motion.article
                  key={promise.title}
                  {...reveal(index * 0.05, reduce)}
                  className="grid grid-cols-[44px_1fr] items-start gap-4 rounded-lg border border-[#d9e2db] bg-[#fbfcfb] p-4 shadow-[0_1px_2px_rgba(11,24,38,0.04)]"
                >
                  <div className="grid h-11 min-h-[44px] w-11 place-items-center rounded-lg bg-green-700 font-extrabold text-white">{String(index + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-normal">{promise.title}</h3>
                    <p className="mt-1 leading-7 text-ink-500">{promise.caption}</p>
                  </div>
                </motion.article>
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
            <p className="mt-3 text-sm font-semibold text-green-700">{t.early.scarcity}</p>
          </motion.div>
          <motion.div {...reveal(0.08, reduce)}>
            <div className="overflow-hidden rounded-2xl border border-[#d9e2db] shadow-[0_30px_70px_-46px_rgba(11,24,38,0.55)]">
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

      <section id="faq" className="bg-[#f4f6f1] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...reveal(0, reduce)} className="text-center">
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {t.faq.eyebrow}
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-normal text-ink-900 sm:text-4xl">{t.faq.title}</h2>
          </motion.div>
          <div className="mt-10 grid gap-3">
            {dicts[locale].faq.map(([question, answer], index) => {
              const open = faqOpen === index;
              return (
                <motion.div
                  key={question}
                  {...reveal(index * 0.04, reduce)}
                  className="overflow-hidden rounded-lg border border-[#d9e2db] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? -1 : index)}
                    aria-expanded={open}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-base font-extrabold text-ink-900">{question}</span>
                    <ChevronDown size={20} className={`shrink-0 text-green-700 transition-transform duration-200 ease-birliy ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="px-5 pb-5 leading-7 text-ink-700">{answer}</p>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1826] py-12 text-white sm:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
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
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">{t.footer.contactTitle}</p>
              <a
                href={t.footer.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Send size={16} className="text-green-700" />
                {t.footer.telegram}
              </a>
              <a
                href={t.footer.supportHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-9 items-center gap-2 text-sm font-bold text-ink-700 transition-colors duration-200 ease-birliy hover:text-green-700"
              >
                <Send size={16} className="text-green-700" />
                {t.footer.support}
              </a>
              <p className="mt-3 text-base font-extrabold tracking-normal">{t.footer.phone}</p>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-[#d9e2db] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-ink-500">{t.footer.copyright}</p>
            <div className="flex items-center gap-2">
              <a
                href="/ru"
                aria-current={locale === "ru" ? "true" : undefined}
                className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm font-extrabold transition-colors duration-200 ease-birliy ${locale === "ru" ? "bg-ink-900 text-white" : "border border-[#d9e2db] text-ink-700 hover:bg-white"}`}
              >
                RU
              </a>
              <a
                href="/"
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
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href={otherHref}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d9e2db] text-sm font-extrabold text-ink-700"
            aria-label={switchLangLabel}
          >
            {t.meta.otherLang}
          </a>
          <button type="button" onClick={() => openLead("mobile_sticky")} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 font-extrabold text-white">
            {t.meta.primaryCta}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} locale={locale} />
    </main>
  );
}
