"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bluetooth,
  Check,
  CheckCircle2,
  ChevronDown,
  Menu,
  MessageCircle,
  Package,
  Printer,
  QrCode,
  Receipt,
  ScanLine,
  Send,
  Smartphone,
  Tablet,
  WifiOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Locale = "ru" | "uz";

const bankQrTarget =
  "https://ru.ipakyulibank.uz/physical/karty/sumovie-karty/karta-woman-card?utm_content=uz_iyb_visa_woman_google_search_cpc__uz-iyb__visa_woman__traffic&utm_source=google&utm_medium=cpc&utm_campaign=uz_iyb_visa_woman_google_search_cpc&adposition=&placement=&matchtype=b&network=g&device=c&campaignid=22770030134&adgroupid=180916564246&utm_term=%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D1%8C+%D0%B1%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D1%83%D1%8E+%D0%BA%D0%B0%D1%80%D1%82%D1%83+%D0%B2+%D1%83%D0%B7%D0%B1%D0%B5%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D0%B5&gad_source=1&gad_campaignid=22770030134&gbraid=0AAAAApVVhNme4XQXcPnCYsND1GJ4Mv8hS&gclid=CjwKCAjwntHPBhAaEiwA_Xp6RiqccIGdCfUCI40etF--khX6HzzTUwUzJsM_1POpMZps5R1iTYSrwBoCsEEQAvD_BwE";

const equipment = {
  scanner:
    "https://uzum.uz/ru/product/nastolnye-i-ruchnye-biryuzovyj---124-1230978?skuId=3858317",
  printer:
    "https://uzum.uz/ru/product/printer-chekov-58-778819?skuId=1862943&utm_source=google&utm_medium=cpc&utm_campaign=MARKET_ALWN_B2C_UZB_WEB_DM_GOOGLE_SHOPPING_RMKT_FID_ALL_GA&utm_content=738378638781&utm_term=&gad_source=1&gad_campaignid=22290073375&gbraid=0AAAAAo3hfGOI90xGMDaTvIT68lS699Zxv&gclid=CjwKCAjwwJzPBhBREiwAJfHRnXzIjX4pj7IN_B-WrsGG_0XYQ2Yp4DEDQZ9nHh-0rmrFuz_3xxSmABoCyJUQAvD_BwE",
};

const ru = {
  nav: ["Возможности", "Как работает", "Оборудование", "FAQ"],
  cta: "Оставить заявку",
  title: "Ipak Savdo — касса, склад и QR-оплата в одном приложении",
  subtitle:
    "Продавайте со смартфона или планшета, принимайте оплату по QR, отправляйте электронный чек и контролируйте остатки без сложной программы учета.",
  telegram: "Написать в Telegram",
  demo: "Смотреть демо",
  trust: "Для магазинов у дома, минимаркетов, кафе, аптек и сервисных точек.",
  badges: [
    "QR-оплата в момент продажи",
    "Остатки обновляются автоматически",
    "Работа при слабом интернете",
    "Отчеты по выручке и кассирам",
  ],
  featuresTitle: "Что умеет Ipak Savdo",
  features: [
    ["Касса и продажи", "Сканер или камера, быстрый поиск товара, скидки, возврат и отложенный чек."],
    ["Каталог и склад", "Товары, категории, штучные и весовые позиции, остатки и списания."],
    ["QR и оплаты", "QR для оплаты, наличные, терминал, долг и оплата разными способами."],
    ["Электронный чек", "Чек можно отправить покупателю в Telegram. Печать можно подключить отдельно."],
    ["Роли сотрудников", "Владелец видит все, кассир работает только с продажами."],
    ["Отчеты", "Выручка за день, средний чек, топ-товары и работа кассиров."],
  ],
  qrTitle: "Тестовый QR для проверки",
  qrText: "Этот QR ведет на реальную страницу Ipak Yuli Bank. Позже здесь будет QR оплаты заказа.",
  offlineTitle: "Если интернет слабый, касса не останавливается",
  offlineText:
    "Кассир продолжает пробивать товары. Когда связь восстановится, продажи и остатки обновятся автоматически.",
  offlineSteps: ["Продажа сохранена", "Интернет восстановился", "Остатки обновились"],
  equipmentTitle: "Оборудование можно подключить позже",
  equipmentText:
    "Можно начать только со смартфона. Для потоковых точек пригодятся сканер штрих-кодов и принтер чеков.",
  scanner: "Сканер штрих-кодов",
  scannerText: "Помогает быстрее находить товар и меньше ошибаться на кассе.",
  printer: "Принтер чеков 58 мм",
  printerText: "Нужен, если покупателям важен бумажный чек.",
  openProduct: "Посмотреть",
  roadmapTitle: "Что появится дальше",
  roadmap: [
    ["Сейчас", "Касса, склад, QR, электронный чек, отчеты"],
    ["Скоро", "Акции, скидки и сообщения клиентам в Telegram"],
    ["Далее", "Закупки у поставщиков и удобные банковские сервисы для бизнеса"],
  ],
  formTitle: "Заявка на ранний доступ",
  success: "Заявка принята. Команда Ipak Savdo свяжется с вами.",
  form: ["Имя", "Телефон", "Тип бизнеса"],
  optional: "Показать дополнительные поля",
  submit: "Отправить заявку",
  faqTitle: "Часто задаваемые вопросы",
  faq: [
    ["Нужно ли покупать компьютер?", "Нет. Можно начать со смартфона или планшета."],
    ["Можно ли использовать сканер?", "Да. Для быстрых продаж можно подключить 2D Bluetooth-сканер."],
    ["Будет ли QR-оплата?", "Да. QR-оплата — один из основных сценариев продукта."],
    ["Что со складом после продажи?", "Остаток товара обновляется автоматически после продажи."],
  ],
  cookie: "Мы используем cookies для аналитики и улучшения работы сайта.",
  accept: "Принять",
  later: "Позже",
};

const uz = {
  ...ru,
  nav: ["Imkoniyatlar", "Qanday ishlaydi", "Jihozlar", "FAQ"],
  cta: "Ariza qoldirish",
  title: "Ipak Savdo — kassa, ombor va QR-to'lov bitta ilovada",
  subtitle:
    "Smartfon yoki planshetdan soting, QR orqali to'lov qabul qiling, elektron chek yuboring va qoldiqlarni nazorat qiling.",
  telegram: "Telegram orqali yozish",
  demo: "Demoni ko'rish",
  trust: "Uy yonidagi do'konlar, minimarketlar, kafelar va xizmat nuqtalari uchun.",
  featuresTitle: "Ipak Savdo nimalarni qiladi",
  qrTitle: "Tekshirish uchun test QR",
  qrText: "Bu QR Ipak Yuli Bank sahifasiga olib boradi. Keyin bu joyda buyurtma to'lovi QR bo'ladi.",
  offlineTitle: "Internet zaif bo'lsa ham kassa to'xtamaydi",
  offlineText:
    "Kassir tovarlarni sotishda davom etadi. Aloqa tiklanganda sotuvlar va qoldiqlar avtomatik yangilanadi.",
  equipmentTitle: "Jihozlarni keyin ulash mumkin",
  equipmentText:
    "Faqat smartfondan boshlash mumkin. Xaridor oqimi ko'p bo'lsa, skaner va chek printeri yordam beradi.",
  scanner: "Shtrix-kod skaneri",
  scannerText: "Tovarni tezroq topishga va kassada kamroq xato qilishga yordam beradi.",
  printer: "58 mm chek printeri",
  printerText: "Xaridorga qog'oz chek kerak bo'lsa foydali.",
  openProduct: "Ko'rish",
  roadmapTitle: "Keyin nimalar qo'shiladi",
  formTitle: "Erta kirish uchun ariza",
  success: "Ariza qabul qilindi. Ipak Savdo jamoasi siz bilan bog'lanadi.",
  form: ["Ism", "Telefon", "Biznes turi"],
  optional: "Qo'shimcha maydonlarni ko'rsatish",
  submit: "Ariza yuborish",
  faqTitle: "Tez-tez so'raladigan savollar",
  cookie: "Sayt tahlili va ishlashini yaxshilash uchun cookies ishlatamiz.",
  accept: "Qabul qilish",
  later: "Keyinroq",
};

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const t = locale === "ru" ? ru : uz;
  const ids = ["features", "workflow", "equipment", "faq"];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
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
            <button type="button" onClick={() => setLocale("ru")} className={langClass(locale === "ru")}>RU</button>
            <button type="button" onClick={() => setLocale("uz")} className={langClass(locale === "uz")}>UZ</button>
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

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 green-grid opacity-70" />
        <div className="section-shell relative grid gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
          <div className="min-w-0 max-w-[calc(100vw-2rem)]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#BDECD5] bg-[#F3FBF7] px-3 py-2 text-xs font-black text-[#005B45]">
              <CheckCircle2 size={15} />
              {locale === "ru" ? "Продукт экосистемы Ipak Yuli Bank" : "Ipak Yuli Bank ekotizimi mahsuloti"}
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
              <button type="button" onClick={() => setModalOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#00A86B]/30 bg-white px-5 py-4 text-sm font-black text-[#005B45] sm:w-auto">
                <MessageCircle size={18} />
                {t.telegram}
              </button>
            </div>
            <p className="mt-5 text-sm text-slate-500">{t.trust}</p>
            <div className="mt-6 grid w-full max-w-[calc(100vw-2rem)] gap-2 sm:grid-cols-2">
              {t.badges.map((badge) => (
                <div key={badge} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-[#00A86B]" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      <Section id="features" title={t.featuresTitle}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.features.map(([title, text], index) => (
            <FeatureCard key={title} index={index} title={title} text={text} />
          ))}
        </div>
      </Section>

      <Section id="workflow" title={locale === "ru" ? "Как проходит продажа" : "Sotuv qanday o'tadi"} tinted>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {["Скан", "Корзина", "QR", "Оплата", "Чек", "Склад"].map((step, index) => (
            <div key={step} className="rounded-lg border border-[#BDECD5] bg-white p-4 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF7F1] text-[#005B45]">{index + 1}</div>
              <div className="font-black">{step}</div>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-[#005B45] py-16 text-white lg:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-black text-[#B7F34A]">
              <WifiOff size={16} />
              {locale === "ru" ? "Работа при слабом интернете" : "Zaif internetda ishlash"}
            </div>
            <h2 className="text-3xl font-black sm:text-4xl">{t.offlineTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-white/80">{t.offlineText}</p>
          </div>
          <div className="grid gap-3">
            {t.offlineSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4">
                <Check className="text-[#B7F34A]" />
                <span className="font-bold">{index + 1}. {step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section id="equipment" title={t.equipmentTitle} subtitle={t.equipmentText}>
        <div className="grid gap-4 md:grid-cols-2">
          <EquipmentCard icon={<ScanLine />} title={t.scanner} text={t.scannerText} href={equipment.scanner} cta={t.openProduct} />
          <EquipmentCard icon={<Printer />} title={t.printer} text={t.printerText} href={equipment.printer} cta={t.openProduct} />
        </div>
      </Section>

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

      <Section title={t.formTitle}>
        <LeadForm t={t} />
      </Section>

      <Section id="faq" title={t.faqTitle} tinted>
        <FAQ items={t.faq} />
      </Section>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="section-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="text-sm font-bold text-slate-500">© 2026 Ipak Savdo</p>
        </div>
      </footer>

      <Cookie t={t} />
      <button type="button" onClick={() => setModalOpen(true)} className="fixed bottom-4 left-4 right-4 z-30 rounded-lg bg-[#00C853] px-5 py-4 text-base font-black text-white shadow-2xl md:hidden">
        {t.cta}
      </button>
      {modalOpen && <Modal close={() => setModalOpen(false)}><LeadForm t={t} compact /></Modal>}
    </main>
  );
}

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

function FeatureCard({ index, title, text }: { index: number; title: string; text: string }) {
  const icons = [ScanLine, Package, QrCode, Receipt, CheckCircle2, BarChart3];
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
      {index === 2 ? <RealQR /> : <MiniPreview index={index} />}
    </div>
  );
}

function RealQR() {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(bankQrTarget)}`;
  return (
    <a href={bankQrTarget} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-4 rounded-lg bg-[#F3FBF7] p-3">
      <img src={src} alt="QR для перехода на страницу Ipak Yuli Bank" className="h-24 w-24 rounded-lg border border-slate-200 bg-white p-1" />
      <span className="text-sm font-bold text-slate-600">
        <span className="block font-black text-[#005B45]">QR Ipak Yuli Bank</span>
        <span>Откроет страницу банка</span>
      </span>
    </a>
  );
}

function MiniPreview({ index }: { index: number }) {
  const rows = [
    ["Сканер", "быстрый поиск"],
    ["Остатки", "18 шт"],
    ["Чек", "Telegram"],
    ["Доступ", "владелец / кассир"],
    ["Выручка", "3 450 000 сум"],
  ];
  const row = rows[Math.min(index, rows.length - 1)];
  return (
    <div className="mt-5 flex justify-between rounded-lg bg-[#F3FBF7] p-3 text-sm font-bold">
      <span>{row[0]}</span>
      <span className="text-[#005B45]">{row[1]}</span>
    </div>
  );
}

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

function LeadForm({ t, compact }: { t: typeof ru; compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [extra, setExtra] = useState(false);
  if (sent) return <div className="mx-auto max-w-xl rounded-lg border border-[#BDECD5] bg-white p-8 text-center text-xl font-black text-[#005B45]">{t.success}</div>;
  return (
    <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className={cn("mx-auto grid max-w-xl gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm", compact && "shadow-none")}>
      {t.form.map((label) => <input key={label} required placeholder={label} className={inputClass} />)}
      <button type="button" onClick={() => setExtra(!extra)} className="flex items-center gap-2 text-left text-sm font-black text-[#005B45]">
        <ChevronDown size={16} />
        {t.optional}
      </button>
      {extra && <textarea placeholder="Комментарий" rows={3} className={cn(inputClass, "resize-none")} />}
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00C853] px-5 py-4 font-black text-white">
        <Send size={18} />
        {t.submit}
      </button>
    </form>
  );
}

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

function Modal({ close, children }: { close: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={close}>
      <div className="w-full max-w-xl rounded-lg bg-white p-4" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={close} className="mb-3 ml-auto block rounded-lg border border-slate-200 p-2"><X /></button>
        {children}
      </div>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-2rem)] sm:max-w-xl">
      <div className="overflow-hidden rounded-[28px] bg-slate-950 p-2 shadow-2xl sm:p-3">
        <div className="min-w-0 rounded-[20px] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <Logo small />
            <span className="rounded-lg bg-[#F3FBF7] px-3 py-2 text-xs font-black text-[#005B45]">Онлайн</span>
          </div>
          <div className="mt-5 grid min-w-0 gap-2 sm:grid-cols-3 sm:gap-3">
            {["Выручка 3 450 000", "Средний чек 87 000", "Продаж 42"].map((item) => <div key={item} className="min-w-0 break-words rounded-lg border border-slate-200 p-3 text-xs font-black sm:text-sm">{item}</div>)}
          </div>
          <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">
            <PhoneSale />
            <div className="min-w-0 rounded-lg border border-slate-200 bg-[#F3FBF7] p-4"><div className="font-black text-[#005B45]">Чек отправлен</div><p className="mt-3 break-words text-sm font-bold text-slate-600">Telegram · 20 500 сум</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneSale() {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 p-4">
      <div className="font-black">Продажа</div>
      {["Молоко 1л", "Хлеб", "Кофе 3в1"].map((item) => <div key={item} className="mt-3 flex items-start justify-between gap-3 rounded-lg bg-[#F8FBFA] p-3 text-sm font-bold"><span className="min-w-0">{item}</span><span className="shrink-0">14 000</span></div>)}
      <div className="mt-4 flex flex-wrap justify-between gap-2 font-black text-[#005B45]"><span>Итого</span><span>20 500 сум</span></div>
    </div>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  if (small) return <Barcode className="h-8 w-8" />;
  return (
    <span className="inline-flex items-center gap-3">
      <Barcode className="h-12 w-12" />
      <span className="grid leading-none">
        <span className="text-[26px] font-black text-[#00742A]">ipak</span>
        <span className="-mt-0.5 text-[26px] font-black text-[#38DD3E]">savdo</span>
      </span>
    </span>
  );
}

function Barcode({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      {[5, 13, 21, 29, 37, 45, 53].map((x, i) => <rect key={x} x={x} y="8" width={i % 2 === 0 ? 4 : 3} height="48" rx="1.2" fill={i < 4 ? "#008529" : "#37DD3B"} />)}
      <path d="M21 56C23 39 27 30 32 23C37 30 41 39 43 56" fill="#008529" opacity="0.82" />
      <path d="M29 56C30 43 31 33 32 22C33 33 34 43 35 56" fill="#37DD3B" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none focus:border-[#00A86B] focus:ring-4 focus:ring-[#00A86B]/20";
