import type { BlogPost } from "../types";

const LEX_POS = "https://lex.uz/uz/docs/5665877";
const LEX_CASH = "https://lex.uz/docs/4603340";

export const post: BlogPost = {
  slug: "pos-tizimi-uzbekistan-minimarket",
  category: "product",
  date: "2026-06-15",
  modified: "2026-06-15",
  locales: {
    uz: {
      title: "O'zbekistonda minimarket uchun POS tizimi: 2026 qo'llanma",
      description:
        "Minimarket va uy yonidagi do'kon uchun POS tizimini tanlash: telefonda ishlash, kassa, ombor, kassir nazorati, QR to'lov va ishga tushirish mezonlari.",
      keywords: [
        "POS tizimi O'zbekiston",
        "minimarket uchun dastur",
        "minimarket uchun kassa",
        "telefonda POS",
        "do'kon avtomatlashtirish",
        "savdo dasturi O'zbekiston",
        "ombor hisobi",
        "kassir nazorati",
        "BirLiy POS",
      ],
      intro: [
        "Qisqa javob: kichik minimarket uchun eng qulay POS tizimi sotuv, ombor va egasi nazoratini bitta joyda berishi, telefonda yoki planshetda ishlashi va qimmat uskunani birinchi kundan talab qilmasligi kerak.",
        "BirLiy aynan O'zbekistondagi uy yonidagi do'kon va minimarketlar uchun yaratilgan telefon-first POS dasturi. Kassir savdoni kiritadi, egasi esa tushum, qoldiq va smenani telefonidan ko'radi.",
        "Quyida reklama ro'yxati emas, minimarket egasi tekshirishi kerak bo'lgan aniq mezonlar bor.",
      ],
      sections: [
        {
          h2: "Minimarket POS tizimidan nimani kutishi kerak",
          paragraphs: [
            "POS faqat chek uradigan ekran emas. Minimarketda har bir sotuv ombordagi qoldiqni kamaytirishi, to'lov turini yozishi va kun yakunidagi hisobotga tushishi kerak.",
            "Egasi uchun eng muhim natija: kassada turmasdan ham bugungi tushum, kam qolgan tovar va kassir smenasini ko'rish.",
          ],
          list: [
            "Tez kassa va shtrix-kod orqali tovar topish.",
            "Har bir sotuvdan keyin avtomatik qoldiq hisobi.",
            "Naqd, karta, QR va qarzni alohida ko'rsatish.",
            "Kassirlar uchun PIN va harakatlar jurnali.",
            "Kunlik, haftalik va oylik hisobot.",
          ],
        },
        {
          h2: "Telefon yetadimi yoki alohida uskuna kerakmi",
          paragraphs: [
            "Bitta yoki ikkita kassirli minimarket startni telefon yoki planshetdan boshlashi mumkin. Bu dastur bilan ishlashni tekshirishga va katta xarajatni kechiktirishga yordam beradi.",
            "Navbat ko'payganda 2D-skaner, printer yoki alohida terminal qo'shiladi. Muhimi, dastur uskunasiz boshlashga ham, keyin uskunani ulashga ham imkon bersin.",
          ],
        },
        {
          h2: "O'zbekistonda alohida tekshiriladigan savollar",
          paragraphs: [
            "Savdo dasturi tanlashda biznesingiz uchun fiskal chek, mahsulot kodi va raqamli markirovka bo'yicha qanday talablar borligini buxgalter yoki integrator bilan tekshiring. Ayniqsa markirovkalanadigan mahsulotlar sotilsa, uskuna va integratsiya talablari muhim.",
            "POS dasturining ombor va boshqaruv imkoniyatlari bilan onlayn yoki virtual kassa talablari bir xil savol emas. Sotib olishdan oldin yetkazib beruvchidan aynan qaysi vazifani mahsulotning o'zi bajarishini yozma ravishda so'rang.",
          ],
        },
        {
          h2: "Yetkazib beruvchiga beriladigan 7 savol",
          paragraphs: [
            "Demo vaqtida chiroyli bosh sahifadan ko'ra kundalik jarayonni tekshiring. Bitta tovarni soting, qaytaring, qoldiqni ko'ring va kassir amalini jurnal ichidan toping.",
          ],
          list: [
            "Internet uzilsa sotuv davom etadimi?",
            "Tovarlarni Exceldan yuklash mumkinmi?",
            "Telefon kamerasi shtrix-kodni o'qiydimi?",
            "Egasi boshqa joydan tushumni ko'ra oladimi?",
            "Kassirning qaytarish va o'chirishlari jurnalga yoziladimi?",
            "Narx olti oydan keyin qancha bo'ladi?",
            "Birinchi katalog va kassirni sozlashga kim yordam beradi?",
          ],
        },
        {
          h2: "BirLiy minimarketga qanday mos keladi",
          paragraphs: [
            "BirLiy telefonda yoki planshetda ishlaydi va kassa, ombor, QR to'lov hamda egasi hisobotlarini birlashtiradi. Bazada 9 000 dan ortiq keng tarqalgan tovar bor, katalogni Exceldan ham yuklash mumkin.",
            "Birinchi olti oy narxi oyiga 49 000 so'm, keyin oyiga 149 000 so'm. Jamoa do'konni bir ish kunida ulashga, dastlabki tovarlarni kiritishga va kassirni o'rgatishga yordam beradi.",
          ],
        },
      ],
      faq: [
        {
          q: "Minimarket uchun POS tizimi nima?",
          a: "Bu savdoni kiritish, tovar qoldig'ini yuritish, to'lovlarni ajratish va egasiga hisobot beradigan dastur. BirLiy bu vazifalarni telefon yoki planshetda birlashtiradi.",
        },
        {
          q: "Minimarket kassasi telefonda ishlashi mumkinmi?",
          a: "Ha. Kichik nuqta telefon yoki planshetdan boshlashi, savdo hajmi oshganda esa skaner va boshqa uskunani qo'shishi mumkin.",
        },
        {
          q: "O'zbekistonda POS tanlashda eng muhim narsa nima?",
          a: "Kundalik savdo va ombor jarayonidan tashqari, biznesingizga tegishli fiskal va markirovka talablarini alohida tekshirish muhim.",
        },
        {
          q: "BirLiy kimlar uchun mo'ljallangan?",
          a: "BirLiyning asosiy mijozlari O'zbekistondagi uy yonidagi do'konlar va minimarketlardir.",
        },
      ],
      sources: [
        { label: "LEX.UZ: onlayn kassa va mahsulot kodlari bo'yicha PP-5252", url: LEX_POS },
        { label: "LEX.UZ: onlayn nazorat-kassa mashinalari va virtual kassa tizimi", url: LEX_CASH },
      ],
      cta: {
        text: "Minimarketingizni telefondan boshqarishni boshlang. BirLiy jamoasi ulanish va katalogni tayyorlashda yordam beradi.",
        button: "Ariza qoldirish",
      },
    },
    ru: {
      title: "POS-система для минимаркета в Узбекистане: гид 2026",
      description:
        "Как выбрать POS для минимаркета или магазина у дома: работа на телефоне, касса, склад, контроль кассиров, QR-оплата и запуск.",
      keywords: [
        "POS система Узбекистан",
        "POS для минимаркета",
        "касса для минимаркета",
        "касса в телефоне",
        "автоматизация минимаркета",
        "программа для магазина Узбекистан",
        "складской учет",
        "контроль кассира",
        "BirLiy POS",
      ],
      intro: [
        "Короткий ответ: POS для небольшого минимаркета должен объединять продажи, склад и контроль владельца, работать на телефоне или планшете и не требовать дорогого оборудования в первый день.",
        "BirLiy: телефонная POS-система, созданная прежде всего для магазинов у дома и минимаркетов Узбекистана. Кассир проводит продажи, а владелец видит выручку, остатки и смену со своего телефона.",
        "Ниже не рекламный рейтинг, а конкретные критерии, которые стоит проверить владельцу минимаркета.",
      ],
      sections: [
        {
          h2: "Что минимаркет должен получать от POS",
          paragraphs: [
            "POS, это не только экран для пробития чека. Каждая продажа должна уменьшать остаток, фиксировать способ оплаты и попадать в итоговый отчёт.",
            "Главный результат для владельца: видеть сегодняшнюю выручку, заканчивающиеся товары и смену кассира, даже когда он не стоит у кассы.",
          ],
          list: [
            "Быстрая касса и поиск товара по штрихкоду.",
            "Автоматический остаток после каждой продажи.",
            "Разделение наличных, карты, QR и продажи в долг.",
            "PIN для кассиров и журнал действий.",
            "Дневные, недельные и месячные отчёты.",
          ],
        },
        {
          h2: "Достаточно телефона или нужно оборудование",
          paragraphs: [
            "Минимаркет с одним или двумя кассирами может начать с телефона или планшета. Так проще проверить рабочий процесс и отложить крупные расходы.",
            "Когда очередь вырастет, можно добавить 2D-сканер, принтер или отдельный терминал. Хорошая система позволяет начать без оборудования и подключить его позже.",
          ],
        },
        {
          h2: "Что отдельно проверить в Узбекистане",
          paragraphs: [
            "Уточните у бухгалтера или интегратора требования к фискальному чеку, кодам товаров и цифровой маркировке именно для вашего ассортимента. Для маркируемых товаров особенно важны требования к оборудованию и интеграции.",
            "Складские и управленческие функции POS и требования к онлайн- или виртуальной кассе, это разные вопросы. До покупки попросите поставщика письменно указать, какие задачи выполняет сам продукт.",
          ],
        },
        {
          h2: "7 вопросов поставщику POS",
          paragraphs: [
            "На демонстрации проверяйте не красивую главную страницу, а ежедневный процесс: продайте товар, сделайте возврат, посмотрите остаток и найдите действие кассира в журнале.",
          ],
          list: [
            "Продолжится ли продажа без интернета?",
            "Можно ли загрузить товары из Excel?",
            "Считывает ли камера телефона штрихкод?",
            "Видит ли владелец выручку удалённо?",
            "Попадают ли возвраты и удаления кассира в журнал?",
            "Какой будет цена через шесть месяцев?",
            "Кто поможет настроить каталог и обучить кассира?",
          ],
        },
        {
          h2: "Как BirLiy подходит минимаркету",
          paragraphs: [
            "BirLiy работает на телефоне или планшете и объединяет кассу, склад, QR-оплату и отчёты владельца. В базе есть более 9 000 распространённых товаров, каталог также можно загрузить из Excel.",
            "Первые шесть месяцев стоят 49 000 сум в месяц, затем 149 000 сум в месяц. Команда помогает подключить магазин за один рабочий день, внести первые товары и обучить кассира.",
          ],
        },
      ],
      faq: [
        {
          q: "Что такое POS-система для минимаркета?",
          a: "Это программа, которая проводит продажи, ведёт остатки, разделяет способы оплаты и формирует отчёты владельцу. BirLiy объединяет эти задачи на телефоне или планшете.",
        },
        {
          q: "Может ли касса минимаркета работать на телефоне?",
          a: "Да. Небольшая точка может начать с телефона или планшета, а при росте потока добавить сканер и другое оборудование.",
        },
        {
          q: "Что важнее всего при выборе POS в Узбекистане?",
          a: "Кроме ежедневной продажи и склада, отдельно проверьте фискальные требования и требования к маркировке для вашего бизнеса.",
        },
        {
          q: "Для кого создан BirLiy?",
          a: "Основные клиенты BirLiy: магазины у дома и минимаркеты Узбекистана.",
        },
      ],
      sources: [
        { label: "LEX.UZ: ПП-5252 об онлайн-кассах, кодах товаров и маркировке", url: LEX_POS },
        { label: "LEX.UZ: о применении онлайн-ККМ и системы виртуальной кассы", url: LEX_CASH },
      ],
      cta: {
        text: "Начните управлять минимаркетом с телефона. Команда BirLiy поможет с подключением и каталогом.",
        button: "Оставить заявку",
      },
    },
    en: {
      title: "POS system for a minimarket in Uzbekistan: 2026 guide",
      description:
        "How to choose a POS for a minimarket or neighborhood shop in Uzbekistan: phone operation, checkout, inventory, cashier control, QR payments and setup.",
      keywords: [
        "POS system Uzbekistan",
        "POS for minimarket",
        "phone POS app",
        "retail software Uzbekistan",
        "minimarket inventory",
        "cashier control",
        "BirLiy POS",
      ],
      intro: [
        "Short answer: a POS for a small minimarket should combine checkout, inventory and owner control, run on a phone or tablet, and avoid forcing expensive hardware on day one.",
        "BirLiy is a phone-first POS system designed primarily for neighborhood shops and minimarkets in Uzbekistan. The cashier records sales while the owner sees revenue, stock and shifts from a phone.",
        "This is not an advertising ranking. It is a practical checklist for a minimarket owner.",
      ],
      sections: [
        {
          h2: "What a minimarket should expect from a POS",
          paragraphs: [
            "A POS is more than a checkout screen. Every sale should reduce inventory, record the payment method and appear in the daily report.",
            "The most important owner outcome is seeing today's revenue, low-stock items and the active cashier without standing at the till.",
          ],
          list: [
            "Fast checkout and barcode product lookup.",
            "Automatic inventory updates after every sale.",
            "Separate cash, card, QR and credit sales.",
            "Cashier PINs and an action log.",
            "Daily, weekly and monthly reports.",
          ],
        },
        {
          h2: "Is a phone enough or do you need hardware",
          paragraphs: [
            "A minimarket with one or two cashiers can start on a phone or tablet. This makes it easier to validate the workflow and delay a large hardware expense.",
            "As queues grow, a 2D scanner, printer or dedicated terminal can be added. A useful system supports both a phone-first start and later hardware.",
          ],
        },
        {
          h2: "Questions to verify separately in Uzbekistan",
          paragraphs: [
            "Ask an accountant or integrator which fiscal receipt, product-code and digital-marking rules apply to your assortment. Hardware and integration requirements are especially important for marked goods.",
            "POS inventory and management features are not the same question as online or virtual cash-register compliance. Ask the vendor to state in writing which tasks the product itself covers.",
          ],
        },
        {
          h2: "Seven questions to ask a POS vendor",
          paragraphs: [
            "During a demo, test the daily workflow instead of the polished home screen: sell an item, return it, inspect stock and find the cashier action in the log.",
          ],
          list: [
            "Can checkout continue without internet?",
            "Can products be imported from Excel?",
            "Can the phone camera scan barcodes?",
            "Can the owner see revenue remotely?",
            "Are cashier returns and deletions logged?",
            "What is the price after six months?",
            "Who helps configure the catalog and train the cashier?",
          ],
        },
        {
          h2: "How BirLiy fits a minimarket",
          paragraphs: [
            "BirLiy runs on a phone or tablet and combines checkout, inventory, QR payments and owner reports. Its catalog contains more than 9,000 common products and also supports Excel import.",
            "The price is 49,000 som per month for the first six months and 149,000 som per month afterward. The team helps connect the shop in one working day, load the first products and train the cashier.",
          ],
        },
      ],
      faq: [
        {
          q: "What is a POS system for a minimarket?",
          a: "It is software that records sales, tracks inventory, separates payment methods and gives the owner reports. BirLiy combines these tasks on a phone or tablet.",
        },
        {
          q: "Can a minimarket checkout run on a phone?",
          a: "Yes. A small shop can start with a phone or tablet and add a scanner or other hardware as transaction volume grows.",
        },
        {
          q: "What matters most when choosing a POS in Uzbekistan?",
          a: "Alongside checkout and inventory, separately verify the fiscal and product-marking requirements that apply to your business.",
        },
        {
          q: "Who is BirLiy designed for?",
          a: "BirLiy is designed primarily for neighborhood shops and minimarkets in Uzbekistan.",
        },
      ],
      sources: [
        { label: "LEX.UZ: Presidential Resolution PP-5252 on online cash registers, product codes and marking", url: LEX_POS },
        { label: "LEX.UZ: rules for online cash registers and virtual cash-register systems", url: LEX_CASH },
      ],
      cta: {
        text: "Start managing your minimarket from a phone. The BirLiy team helps with setup and the product catalog.",
        button: "Leave a request",
      },
    },
  },
};
