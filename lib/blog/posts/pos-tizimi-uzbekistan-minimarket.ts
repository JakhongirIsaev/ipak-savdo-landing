import type { BlogPost } from "../types";
import { blogCover } from "../blog-image";

export const post: BlogPost = {
  slug: "pos-tizimi-uzbekistan-minimarket",
  category: "product",
  date: "2026-06-15",
  modified: "2026-06-23",
  image: blogCover("pos-tizimi-uzbekistan-minimarket"),
  locales: {
    uz: {
      title: "POS tizimi minimarket uchun: O'zbekistonda tanlash",
      description:
        "Minimarket uchun POS tizimini qanday tanlash: telefonda kassa, ombor, nasiya, kassir nazorati va O'zbekistonda alohida tekshiriladigan talablar.",
      keywords: [
        "POS tizimi minimarket uchun",
        "POS tizimi O'zbekiston",
        "minimarket uchun kassa",
        "telefonda kassa",
        "do'kon avtomatlashtirish",
        "ombor hisobi",
        "nasiya yuritish",
        "kassir nazorati",
        "BirLiy POS",
      ],
      intro: [
        "Kechqurun do'konni yopasiz. Kassadagi pul bir xil, daftardagi qoldiq boshqacha, nasiya esa alohida varaqda. Uchtasini bir-biriga to'g'rilash yarim soat oladi va baribir biror joyda xato qoladi.",
        "Minimarket uchun POS tizimi aynan shu uchta ishni bitta joyga olib keladigan dastur: har bir sotuv qoldiqni o'zi kamaytiradi, to'lov turi yoziladi va kun yakuni tayyor turadi.",
        "Quyida reklama ro'yxati emas, do'kon egasi sotib olishdan oldin o'zi tekshirishi mumkin bo'lgan aniq mezonlar bor.",
      ],
      sections: [
        {
          h2: "Minimarket POS tizimi nima qiladi",
          paragraphs: [
            "POS faqat chek uradigan ekran emas. Minimarketda har bir sotuv uchta ishni bir vaqtda bajarishi kerak: ombordagi qoldiqni kamaytirishi, pul naqd, karta, QR yoki nasiya bilan kelganini yozishi va kun hisobotiga tushishi.",
            "Egasi uchun asosiy natija oddiy: kassada turmasdan ham bugungi tushumni, kam qolgan tovarni va qaysi kassir smenada ekanini telefonidan ko'rish.",
          ],
          list: [
            "Tez kassa va shtrix-kod orqali tovarni topish.",
            "Har bir sotuvdan keyin qoldiq o'zi yangilanadi.",
            "Naqd, karta, QR va nasiya alohida ko'rinadi.",
            "Kassirlar uchun alohida kirish va harakatlar yozuvi.",
            "Kunlik, haftalik va oylik hisobot.",
          ],
        },
        {
          h2: "Telefon yetadimi yoki alohida uskuna kerakmi",
          paragraphs: [
            "Bitta yoki ikkita kassirli minimarket savdoni telefon yoki planshetdan boshlashi mumkin. Bu yangi dasturni katta xarajatsiz sinab ko'rishga yordam beradi: avval ishlashini ko'rasiz, keyin uskunaga pul tikasiz.",
            "Navbat ko'paygach 2D-skaner yoki printer qo'shiladi. Muhimi, dastur uskunasiz boshlashga ham, keyin uskuna ulashga ham xalal bermasin. Demo vaqtida shuni so'rang: bugun faqat telefon bilan sota olamanmi.",
          ],
        },
        {
          h2: "Nasiyani daftarda emas, dasturda yuritish",
          paragraphs: [
            "Doimiy xaridorga nasiyaga berish minimarketda oddiy hol. Muammo nasiyada emas, uni qog'oz daftarda yuritishda: sahifa yo'qoladi, suv tegadi yoki kim qancha qarz ekani esdan chiqadi.",
            "POS tanlashda nasiya kassaning o'zida bo'lishi katta farq qiladi. Sotuv naqd, karta va QR bilan bitta ro'yxatda tursa, kim qancha qarz va qachon to'lashni va'da qilgani bitta joyda ko'rinadi.",
          ],
        },
        {
          h2: "O'zbekistonda alohida tekshiriladigan talablar",
          paragraphs: [
            "Bu yerda 'buxgalterdan so'rang' deb qo'yib yuborilmaydi. Aniq qadam shu: demo vaqtida yetkazib beruvchidan ikkita rasmiy hujjat bo'yicha javob yozma so'rang. Birinchisi onlayn nazorat-kassa mashinalari va virtual kassa tartibi (LEX.UZ, hujjat 4603340), ikkinchisi mahsulot kodlari va raqamli markirovka talablari (LEX.UZ, hujjat 5665877).",
            "Savol oddiy: mening tovarlarim bo'yicha fiskal chek va markirovka talablarini mahsulotning o'zi bajaradimi yoki alohida tizim kerakmi. Agar markirovkalanadigan tovar sotsangiz, javob ayniqsa muhim, chunki bu uskuna va integratsiyaga ta'sir qiladi.",
            "POS dasturining ombor va boshqaruv qismi bilan kassa qonun talablari bir xil savol emas. Shuning uchun har bir javobni og'zaki emas, yozma oling. Keyin nizo chiqsa, sizda hujjat bo'ladi.",
          ],
          list: [
            "Fiskal chek talabini kim bajaradi: dasturmi yoki alohida tizimmi.",
            "Mening tovarlarim markirovkaga tushadimi.",
            "Markirovka uchun qanday uskuna kerak.",
            "Javoblar yozma berilganmi.",
          ],
        },
        {
          h2: "Demo vaqtida yetkazib beruvchiga beriladigan savollar",
          paragraphs: [
            "Demoda chiroyli bosh sahifaga emas, kundalik jarayonga qarang. Bitta tovarni soting, keyin qaytaring, qoldiqni ko'ring va kassir qaytarishini yozuv ichidan toping. Shu uch qadam dasturning haqiqatda ishlashini ko'rsatadi.",
          ],
          list: [
            "Internet uzilsa sotuv davom etadimi?",
            "Tovarlarni Exceldan yuklash mumkinmi?",
            "Telefon kamerasi shtrix-kodni o'qiydimi?",
            "Egasi boshqa joydan tushumni ko'ra oladimi?",
            "Kassirning qaytarish va o'chirishlari yozuvga tushadimi?",
            "Narx olti oydan keyin qancha bo'ladi?",
            "Birinchi katalog va kassirni sozlashga kim yordam beradi?",
          ],
        },
        {
          h2: "BirLiy minimarketga qanday mos keladi",
          paragraphs: [
            "BirLiy O'zbekiston do'konlari uchun telefondagi POS. Kassa, ombor, to'lovlar va hisobotlar bitta ilovada turadi, nasiya esa naqd va QR bilan bitta ro'yxatda ko'rinadi. Saytda ikkala rol uchun jonli kliklanadigan demo bor, sotib olishdan oldin o'zingiz bosib ko'rasiz.",
            "Erta kirish davrida katalogni Exceldan yuklash mumkin, ilovada keng tarqalgan tovarlar uchun tayyor baza ham bor. BirLiy hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqda. Birinchi kogorta uchun e'lon qilingan narx birinchi olti oy oyiga 49 000 so'm, keyin oyiga 149 000 so'm.",
          ],
        },
      ],
      faq: [
        {
          q: "Minimarket uchun POS tizimi nima?",
          a: "Bu sotuvni kiritadigan, tovar qoldig'ini yuritadigan, to'lov turlarini ajratadigan va egasiga hisobot beradigan dastur. BirLiy bu ishlarni telefon yoki planshetda bitta joyga bog'laydi.",
        },
        {
          q: "Minimarket kassasi telefonda ishlaydimi?",
          a: "Kichik nuqta telefon yoki planshetdan boshlashi, savdo ko'payganda esa skaner va boshqa uskuna qo'shishi mumkin.",
        },
        {
          q: "O'zbekistonda POS tanlashda nimani alohida tekshirish kerak?",
          a: "Kundalik kassa va ombordan tashqari, fiskal chek va markirovka talablarini yetkazib beruvchidan yozma so'rang. Rasmiy tartib LEX.UZ hujjatlarida (4603340 va 5665877) keltirilgan.",
        },
        {
          q: "Nasiyani POS dasturida yuritsa bo'ladimi?",
          a: "Ha. BirLiy'da xaridor nasiyasi daftar o'rniga ilovada ko'rinadi: kim qancha qarz va qachon to'lashni va'da qilgani bitta ro'yxatda.",
        },
        {
          q: "BirLiy kimlar uchun?",
          a: "BirLiy uy yonidagi do'konlar, minimarketlar, oziq-ovqat do'konlari va shunga o'xshash kichik nuqtalar uchun. Hozir Toshkentda erta kirish ochilmoqda.",
        },
      ],
      cta: { text: "Minimarketingizni telefondan boshqarib ko'ring. Erta kirishga ariza qoldiring, jonli demoni saytda o'zingiz sinab ko'rasiz.", button: "Ariza qoldirish" },
    },
    ru: {
      title: "POS-система для минимаркета: как выбрать в Узбекистане",
      description:
        "Как выбрать POS-систему для минимаркета: касса в телефоне, склад, насия, контроль кассира и требования, которые в Узбекистане проверяют отдельно.",
      keywords: [
        "POS система для минимаркета",
        "POS система Узбекистан",
        "касса для минимаркета",
        "касса в телефоне",
        "автоматизация минимаркета",
        "складской учет",
        "учет долгов покупателей",
        "контроль кассира",
        "BirLiy POS",
      ],
      intro: [
        "Вечером закрываете магазин. Деньги в кассе одни, остаток в тетради другой, насия записана на отдельном листке. Свести три цифры занимает полчаса, и где-то всё равно остаётся ошибка.",
        "POS-система для минимаркета сводит эти три вещи в одно место: каждая продажа сама уменьшает остаток, фиксирует способ оплаты и попадает в дневной отчёт.",
        "Ниже не рекламный рейтинг, а конкретные критерии, которые владелец минимаркета может проверить сам до покупки.",
      ],
      sections: [
        {
          h2: "Что делает POS-система для минимаркета",
          paragraphs: [
            "POS, это не только экран для пробития чека. В минимаркете каждая продажа должна делать три дела сразу: уменьшать остаток на складе, фиксировать оплату наличными, картой, QR или в долг, и попадать в итоговый отчёт.",
            "Главный результат для владельца простой: видеть сегодняшнюю выручку, заканчивающийся товар и кто из кассиров на смене, не стоя у кассы.",
          ],
          list: [
            "Быстрая касса и поиск товара по штрихкоду.",
            "Остаток обновляется сам после каждой продажи.",
            "Наличные, карта, QR и насия видны отдельно.",
            "Отдельный вход для кассиров и журнал действий.",
            "Дневной, недельный и месячный отчёт.",
          ],
        },
        {
          h2: "Достаточно телефона или нужно оборудование",
          paragraphs: [
            "Минимаркет с одним или двумя кассирами может начать продажи с телефона или планшета. Так новую программу можно проверить без крупных трат: сначала видите, что она работает, потом вкладываетесь в оборудование.",
            "Когда вырастет очередь, добавляется 2D-сканер или принтер. Важно, чтобы программа не мешала ни старту без оборудования, ни подключению оборудования позже. На демо спросите прямо: смогу ли я сегодня продавать только с телефона.",
          ],
        },
        {
          h2: "Насия в программе вместо тетради",
          paragraphs: [
            "Дать в долг постоянному покупателю в минимаркете дело обычное. Проблема не в насии, а в том, что её ведут в бумажной тетради: страница теряется, намокает, или забывается, кто сколько должен.",
            "При выборе POS большая разница, когда насия живёт в самой кассе. Если продажа стоит в одном списке с наличными, картой и QR, то кто сколько должен и когда обещал оплатить видно в одном месте.",
          ],
        },
        {
          h2: "Что в Узбекистане проверяют отдельно",
          paragraphs: [
            "Здесь нельзя отделаться фразой 'спросите бухгалтера'. Конкретный шаг такой: на демо письменно запросите у поставщика ответ по двум официальным документам. Первый, порядок применения онлайн-ККМ и системы виртуальной кассы (LEX.UZ, документ 4603340). Второй, требования к кодам товаров и цифровой маркировке (LEX.UZ, документ 5665877).",
            "Вопрос простой: по моему ассортименту требования к фискальному чеку и маркировке выполняет сам продукт или нужна отдельная система. Если вы продаёте маркируемый товар, ответ особенно важен, потому что он влияет на оборудование и интеграцию.",
            "Складская и управленческая часть POS и требования кассового закона, это разные вопросы. Поэтому берите каждый ответ письменно, а не на словах. Если позже возникнет спор, у вас будет документ.",
          ],
          list: [
            "Кто выполняет требование фискального чека: программа или отдельная система.",
            "Попадает ли мой товар под маркировку.",
            "Какое оборудование нужно для маркировки.",
            "Даны ли ответы письменно.",
          ],
        },
        {
          h2: "Что спросить у поставщика на демо",
          paragraphs: [
            "На демонстрации смотрите не на красивую главную страницу, а на ежедневный процесс. Продайте товар, потом сделайте возврат, посмотрите остаток и найдите возврат кассира в журнале. Эти три шага показывают, как программа работает на деле.",
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
            "BirLiy, это POS в телефоне для магазинов Узбекистана. Касса, склад, оплаты и отчёты живут в одном приложении, а насия видна в одном списке с наличными и QR. На сайте есть живое кликабельное демо для обеих ролей, можно нажать самому до покупки.",
            "В раннем доступе каталог можно загрузить из Excel, в приложении есть и готовая база распространённых товаров. Сейчас BirLiy открывает ранний доступ для первых магазинов Ташкента. Объявленная для первой когорты цена: первые шесть месяцев 49 000 сум в месяц, затем 149 000 сум в месяц.",
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
          a: "Небольшая точка может начать с телефона или планшета, а при росте потока добавить сканер и другое оборудование.",
        },
        {
          q: "Что в Узбекистане проверяют отдельно при выборе POS?",
          a: "Помимо ежедневной кассы и склада, письменно запросите у поставщика требования к фискальному чеку и маркировке. Официальный порядок изложен в документах LEX.UZ (4603340 и 5665877).",
        },
        {
          q: "Можно ли вести насию в POS-программе?",
          a: "Да. В BirLiy долг покупателя виден в приложении вместо тетради: кто сколько должен и когда обещал оплатить, всё в одном списке.",
        },
        {
          q: "Для кого создан BirLiy?",
          a: "BirLiy для магазинов у дома, минимаркетов, продуктовых и похожих небольших точек. Сейчас открывается ранний доступ в Ташкенте.",
        },
      ],
      cta: { text: "Попробуйте управлять минимаркетом с телефона. Оставьте заявку на ранний доступ, а живое демо можно нажать на сайте.", button: "Оставить заявку" },
    },
    en: {
      title: "POS system for a minimarket in Uzbekistan: how to choose",
      description:
        "How to choose a POS system for a minimarket in Uzbekistan: phone checkout, inventory, credit sales, cashier control and the rules you verify separately.",
      keywords: [
        "POS system for minimarket",
        "POS system Uzbekistan",
        "phone POS app",
        "minimarket inventory",
        "cashier control",
        "credit sales tracking",
        "BirLiy POS",
      ],
      intro: [
        "You close the shop in the evening. The cash in the till says one thing, the stock notebook says another, and the credit sales sit on a separate sheet. Reconciling the three takes half an hour, and an error still slips through somewhere.",
        "A POS system for a minimarket pulls those three things into one place: every sale lowers the stock itself, records the payment method, and lands in the daily report.",
        "This is not an advertising ranking. It is a set of concrete criteria a minimarket owner can check before buying.",
      ],
      sections: [
        {
          h2: "What a POS system for a minimarket actually does",
          paragraphs: [
            "A POS is more than a checkout screen. In a minimarket every sale should do three things at once: lower the stock, record whether the money came in as cash, card, QR or credit, and land in the end-of-day report.",
            "The main outcome for the owner is simple: see today's revenue, the items running low, and which cashier is on shift, without standing at the till.",
          ],
          list: [
            "Fast checkout and barcode product lookup.",
            "Stock updates itself after every sale.",
            "Cash, card, QR and credit shown separately.",
            "Separate cashier logins and an action log.",
            "Daily, weekly and monthly reports.",
          ],
        },
        {
          h2: "Is a phone enough or do you need hardware",
          paragraphs: [
            "A minimarket with one or two cashiers can start selling from a phone or tablet. That lets you test a new program without a large outlay: first you see it works, then you spend on hardware.",
            "As the queue grows, a 2D scanner or printer can be added. What matters is that the program blocks neither a hardware-free start nor adding hardware later. At the demo, ask plainly: can I sell with just a phone today.",
          ],
        },
        {
          h2: "Credit sales in the app instead of a notebook",
          paragraphs: [
            "Giving a regular customer goods on credit is normal in a minimarket. The problem is not the credit, it is keeping it in a paper notebook: the page gets lost, gets wet, or you forget who owes how much.",
            "When choosing a POS, it makes a real difference if credit lives inside the checkout itself. When a sale sits in one list with cash, card and QR, who owes how much and when they promised to pay is visible in one place.",
          ],
        },
        {
          h2: "What to verify separately in Uzbekistan",
          paragraphs: [
            "You cannot settle this with 'ask an accountant'. The concrete step is this: at the demo, ask the vendor in writing for an answer on two official documents. The first covers online cash registers and the virtual cash-register system (LEX.UZ, document 4603340). The second covers product codes and digital marking (LEX.UZ, document 5665877).",
            "The question is simple: for my assortment, does the product itself meet the fiscal receipt and marking requirements, or do I need a separate system. If you sell marked goods, the answer matters most, because it affects hardware and integration.",
            "The inventory and management side of a POS is a different question from cash-register law. So take every answer in writing, not by word of mouth. If a dispute comes up later, you will have a document.",
          ],
          list: [
            "Who meets the fiscal receipt requirement: the program or a separate system.",
            "Whether my goods fall under marking rules.",
            "What hardware marking requires.",
            "Whether the answers were given in writing.",
          ],
        },
        {
          h2: "Questions to ask the vendor at the demo",
          paragraphs: [
            "At the demo, look at the daily workflow, not the polished home screen. Sell an item, then return it, check the stock, and find the cashier return in the log. Those three steps show how the program works in practice.",
          ],
          list: [
            "Can checkout continue without internet?",
            "Can products be imported from Excel?",
            "Can the phone camera scan barcodes?",
            "Can the owner see revenue remotely?",
            "Are cashier returns and deletions logged?",
            "What is the price after six months?",
            "Who helps set up the catalog and train the cashier?",
          ],
        },
        {
          h2: "How BirLiy fits a minimarket",
          paragraphs: [
            "BirLiy is a POS in the phone for shops in Uzbekistan. Checkout, inventory, payments and reports live in one app, and credit shows up in one list with cash and QR. The site has a live clickable demo for both roles, so you can try it yourself before buying.",
            "In early access the catalog can be loaded from Excel, and the app also has a ready base of common goods. BirLiy is now opening early access for the first shops in Tashkent. The stated price for the first cohort is 49 000 som per month for the first six months, then 149 000 som per month.",
          ],
        },
      ],
      faq: [
        {
          q: "What is a POS system for a minimarket?",
          a: "It is software that records sales, tracks stock, separates payment methods and gives the owner reports. BirLiy combines these tasks on a phone or tablet.",
        },
        {
          q: "Can a minimarket checkout run on a phone?",
          a: "A small shop can start with a phone or tablet and add a scanner or other hardware as the volume grows.",
        },
        {
          q: "What do you verify separately when choosing a POS in Uzbekistan?",
          a: "Besides daily checkout and inventory, ask the vendor in writing about fiscal receipt and marking requirements. The official rules are set out in LEX.UZ documents 4603340 and 5665877.",
        },
        {
          q: "Can credit sales be tracked in the POS app?",
          a: "Yes. In BirLiy a customer's debt shows up in the app instead of a notebook: who owes how much and when they promised to pay, all in one list.",
        },
        {
          q: "Who is BirLiy for?",
          a: "BirLiy is for neighborhood shops, minimarkets, grocery and similar small points. Early access is opening now in Tashkent.",
        },
      ],
      cta: { text: "Try running your minimarket from a phone. Leave a request for early access, and you can click through the live demo on the site.", button: "Leave a request" },
    },
  },
};
