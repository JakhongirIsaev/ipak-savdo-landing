import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "skladskoy-uchet-v-malenkom-magazine",
  date: "2026-06-11",
  locales: {
    uz: {
      title: "Do'konda ombor hisobi: yangi boshlovchilar uchun qo'llanma",
      description:
        "Kichik do'konda ombor hisobi qanday yuritiladi: qoldiq hisobi, tovar ro'yxati, qayta buyurtma signallari va telefonda barkod skaneri. Amaliy qo'llanma.",
      keywords: [
        "ombor hisobi",
        "do'konda ombor hisobi",
        "qoldiq hisobi",
        "tovar hisobi dasturi",
        "inventarizatsiya",
        "tovar qoldig'i",
        "ombor dasturi",
        "mol hisobi",
        "shtrix kod bilan hisob",
        "tovar buyurtma qilish",
      ],
      intro: [
        "Kichik do'kon egasi uchun ombor hisobi murakkab gap emas. Bu shunchaki bitta savolga aniq javob: ayni damda do'konda nima bor, nima yaxshi sotilyapti va nimani qayta buyurtma qilish kerak. 50 kvadrat metrli do'konda ham, kattaroq joyda ham mantiq bir xil.",
        "Ko'p egalar hisobni daftarda yoki yodda yuritadi. Bu kichik bo'lganda ishlaydi. Ammo tovar soni o'sganda qoldiq hisobi chalkashadi: bestseller tugab qoladi, sekin sotiladigan mol esa pulni muzlatadi. Natijada siz qancha mol borligini bilmaysiz va inventarizatsiya har safar bir necha soat vaqtingizni oladi.",
        "Bu qo'llanmada do'konda ombor hisobini noldan qanday boshlashni bosqichma-bosqich ko'rsatamiz. Hech qanday murakkab atama yo'q, faqat pul va vaqt tilida.",
      ],
      sections: [
        {
          h2: "Ombor hisobi kichik do'kon uchun aslida nima",
          paragraphs: [
            "Ombor hisobi: bu do'koningizdagi har bir tovarning sonini bilish degani. Necha dona bor, qaysi biri sotildi, qaysi biri omborda qoldi. Shu uchta raqamni bilsangiz, do'koningiz nazorat ostida.",
            "Bu nima beradi? Birinchidan, siz bestseller tugab qolishidan oldin buyurtma berasiz. Ikkinchidan, sekin sotiladigan molni ko'rib, unga ortiqcha pul bog'lamaysiz. Uchinchidan, oy oxirida qancha mol qolganini taxmin qilmaysiz, aniq bilasiz.",
            "Daftar bilan ham boshlash mumkin. Ammo har bir sotuvni qo'lda yozish vaqt oladi va xato beradi. Shu uchun ko'pchilik tovar hisobi dasturiga o'tadi: sotuv paytida qoldiq o'zi kamayadi.",
          ],
        },
        {
          h2: "Bosqichma-bosqich: ombor hisobini qanday boshlash",
          paragraphs: [
            "Boshlash uchun katta tizim shart emas. Quyidagi tartibda yuring va bir hafta ichida hisob tayyor bo'ladi.",
            "Eng muhimi: boshlang'ich qoldiqni to'g'ri kiriting. Agar boshida noto'g'ri raqam qo'ysangiz, keyingi hamma hisob xato bo'ladi. Shuning uchun birinchi inventarizatsiyani bemalol, shoshmasdan qiling.",
          ],
          list: [
            "Tovar ro'yxatini tuzing: do'kondagi har bir mol nomi va narxi.",
            "Boshlang'ich qoldiqni belgilang: hozir har bir tovardan necha dona bor.",
            "Har bir sotuvni yozib boring: mol sotilsa, qoldiq kamayadi.",
            "Har bir kelishni kiriting: yangi mol kelsa, qoldiq ortadi.",
            "Har hafta tekshiring: javondagi son bilan hisobdagi sonni solishtiring.",
          ],
        },
        {
          h2: "Telefon kamerasi bilan barkod: qo'l mehnatini olib tashlash",
          paragraphs: [
            "Eng ko'p vaqt qayerga ketadi? Har bir tovarni qo'lda topib, sonini o'zgartirishga. Barkod skaneri shu ishni yo'q qiladi.",
            "Telefon kamerasi barkodni o'qiydi va tovar darhol ekranga chiqadi. Sotuvda: skanerlang, narx o'zi qo'yiladi, qoldiq o'zi kamayadi. Mol kelganda: skanerlang, qoldiq o'zi ortadi. Alohida skaner qurilmasi sotib olish shart emas.",
            "Bu xatoni ham kamaytiradi. Qo'lda yozganda odam adashadi: noto'g'ri tovar, noto'g'ri son. Barkod bilan har bir harakat aniq bo'ladi.",
          ],
        },
        {
          h2: "Tayyor tovar bazasi: sozlash haftasini tejaydi",
          paragraphs: [
            "Ombor hisobini boshlashda eng zerikarli qism: har bir tovarni nomi, barkodi va narxi bilan qo'lda kiritish. Yuzlab pozitsiya bo'lsa, bu bir necha kun ketadi.",
            "BirLiy bazasida 9 000 dan ortiq tovar allaqachon mavjud. Ko'p mahsulotlar uchun siz faqat narx va qoldiqni qo'yasiz, qolgani tayyor. Shu sababli sozlash haftalar emas, bir kunga qisqaradi.",
            "Bazada yo'q tovarlarni qo'lda qo'shasiz yoki barkod orqali skanerlab kiritasiz. Bir marta kiritilsa, keyin doim hisobda qoladi.",
          ],
        },
        {
          h2: "Qayta buyurtma signallari: tugab qolmaslik, pulni muzlatmaslik",
          paragraphs: [
            "Yaxshi ombor hisobining maqsadi: har bir tovardan kerakli miqdorda saqlash. Ko'p ham, kam ham emas.",
            "Bestseller tugab qolsa, siz sotuvni va mijozni yo'qotasiz. Shuning uchun har bir asosiy tovar uchun minimal qoldiq belgilang. Qoldiq shu darajaga tushganda, bu qayta buyurtma signali.",
            "Boshqa tomondan, sekin sotiladigan molni ko'p olib qo'ymang. U javonda turadi va pulingizni muzlatadi. Hisobdan qaysi tovar yaxshi, qaysi biri sekin sotilishini ko'rib, buyurtmani shunga moslang.",
          ],
        },
        {
          h2: "BirLiy: kassa, ombor va hisobotlar bitta ilovada",
          paragraphs: [
            "BirLiy: telefon yoki planshetdagi bitta ilova. Kassa, ombor hisobi, QR orqali to'lov va hisobotlar bir joyda. Uch xil dastur va daftar o'rniga bitta ekran.",
            "Sotuv qabul qilinganda qoldiq o'zi yangilanadi. Mijozga chek qog'oz printer o'rniga Telegram orqali yuboriladi. Internet o'chsa, ilova ishlashda davom etadi va aloqa qaytganda o'zi sinxronlanadi. Kirish PIN orqali, hamma harakatlar jurnali yuritiladi, shuning uchun kassir aldovidan himoyalanasiz.",
            "Narx: birinchi 6 oy 49 000 so'm/oy, keyin 149 000 so'm/oy, to'liq funksiya bilan. Bizning jamoa do'koningizni bir kunda ulaydi va tovarlarni yuklashga yordam beradi. Hozir Toshkentda birinchi pilot do'konlar ulanmoqda.",
          ],
        },
      ],
      faq: [
        {
          q: "Do'konda ombor hisobini qanday boshlash kerak?",
          a: "Tovar ro'yxatini tuzing, har bir tovardan necha dona borligini belgilang, keyin har bir sotuv va kelishni yozib boring. Bir hafta ichida qoldiq hisobi aniq ishlaydi. Dastur bilan bu jarayon yanada tez bo'ladi.",
        },
        {
          q: "Tovar hisobi dasturi qancha turadi?",
          a: "BirLiy narxi birinchi 6 oy 49 000 so'm/oy, keyin 149 000 so'm/oy. Bunga kassa, ombor hisobi, QR to'lov va hisobotlar kiradi, to'liq funksiya bilan.",
        },
        {
          q: "Barkod skanerlash uchun alohida qurilma kerakmi?",
          a: "Yo'q. Telefon yoki planshet kamerasi barkodni o'qiydi. Tovar ekranga chiqadi, qoldiq o'zi yangilanadi. Alohida skaner sotib olish shart emas.",
        },
        {
          q: "Internet bo'lmasa ombor hisobi ishlaydimi?",
          a: "Ha. Ilova internetsiz ham ishlaydi: sotuv qabul qilinadi, qoldiq yangilanadi. Aloqa qaytganda hamma ma'lumot o'zi sinxronlanadi.",
        },
      ],
      cta: {
        text: "Do'koningizda ombor hisobini bir kunda yo'lga qo'ying. Jamoamiz tovarlarni yuklashga yordam beradi.",
        button: "Ariza qoldirish",
      },
    },
    ru: {
      title: "Складской учёт в магазине: пошаговый гид для новичка",
      description:
        "Как вести складской учёт в небольшом магазине: учёт остатков, список товаров, сигналы дозаказа и сканирование штрихкодов телефоном. Пошаговый гид.",
      keywords: [
        "складской учёт в магазине",
        "учёт остатков",
        "как вести склад",
        "программа складского учёта",
        "инвентаризация в магазине",
        "остатки товара",
        "учёт товара в магазине",
        "контроль остатков",
        "дозаказ товара",
        "учёт по штрихкоду",
        "ревизия товара",
        "программа учёта товаров",
      ],
      intro: [
        "Складской учёт для владельца небольшого магазина: это не про сложные таблицы. Это про один понятный ответ: что у вас сейчас есть на полках, что хорошо продаётся и что пора дозаказать. В магазине на 50 квадратных метров и в точке побольше логика одна и та же.",
        "Многие ведут учёт в тетради или в голове. Пока товаров мало, это работает. Но когда позиций становится много, учёт остатков путается: ходовой товар заканчивается, а медленный лежит и замораживает деньги. В итоге вы не знаете точные остатки товара, а инвентаризация в магазине каждый раз отнимает несколько часов.",
        "В этом гиде разберём по шагам, как вести склад с нуля. Без сложных терминов, простым языком про деньги и время.",
      ],
      sections: [
        {
          h2: "Что такое складской учёт для маленького магазина",
          paragraphs: [
            "Складской учёт: это знание количества каждого товара в вашем магазине. Сколько единиц есть, сколько продано, сколько осталось на складе. Знаете эти три числа: магазин под контролем.",
            "Что это даёт? Во-первых, вы заказываете ходовой товар до того, как он закончится. Во-вторых, видите медленный товар и не вкладываете в него лишние деньги. В-третьих, в конце месяца вы не угадываете остатки, а знаете их точно.",
            "Начать можно и с тетради. Но записывать каждую продажу вручную долго и легко ошибиться. Поэтому многие переходят на программу складского учёта: при продаже остаток уменьшается сам.",
          ],
        },
        {
          h2: "Пошагово: как начать вести складской учёт",
          paragraphs: [
            "Чтобы начать, большая система не нужна. Идите в таком порядке, и за неделю учёт будет готов.",
            "Самое важное: правильно внести начальные остатки. Если в начале поставить неверное число, весь дальнейший учёт будет с ошибкой. Поэтому первую инвентаризацию делайте спокойно, без спешки.",
          ],
          list: [
            "Составьте список товаров: название и цена каждой позиции в магазине.",
            "Задайте начальные остатки: сколько единиц каждого товара есть сейчас.",
            "Записывайте каждую продажу: товар продан, остаток уменьшается.",
            "Вносите каждую поставку: пришёл новый товар, остаток растёт.",
            "Проверяйте раз в неделю: сравните число на полке с числом в учёте.",
          ],
        },
        {
          h2: "Штрихкод камерой телефона: убираем ручную работу",
          paragraphs: [
            "Куда уходит больше всего времени? На то, чтобы вручную найти каждый товар и поменять его количество. Сканирование штрихкода убирает эту работу.",
            "Камера телефона читает штрихкод, и товар сразу появляется на экране. При продаже: сканируете, цена подставляется сама, остаток уменьшается сам. При поставке: сканируете, остаток растёт сам. Отдельное устройство-сканер покупать не нужно.",
            "Это ещё и снижает ошибки. При записи вручную человек путается: не тот товар, не то число. Со штрихкодом каждое действие точное.",
          ],
        },
        {
          h2: "Готовая база товаров: экономит неделю настройки",
          paragraphs: [
            "Самая скучная часть старта учёта: вручную внести каждый товар с названием, штрихкодом и ценой. Если позиций сотни, это несколько дней.",
            "В базе BirLiy уже больше 9 000 товаров. Для многих позиций вы ставите только цену и остаток, остальное готово. Поэтому настройка сокращается с недель до одного дня.",
            "Товары, которых нет в базе, вы добавляете вручную или вносите сканированием штрихкода. Один раз внесли: дальше товар всегда в учёте.",
          ],
        },
        {
          h2: "Сигналы дозаказа: не остаться без ходового, не заморозить деньги",
          paragraphs: [
            "Цель хорошего складского учёта: держать каждого товара нужное количество. Не много и не мало.",
            "Если ходовой товар закончился, вы теряете продажу и покупателя. Поэтому задайте по каждому основному товару минимальный остаток. Когда остаток падает до этого уровня: это сигнал дозаказа.",
            "С другой стороны, не берите много медленного товара. Он лежит на полке и замораживает ваши деньги. По учёту видно, что продаётся хорошо, а что медленно, и под это подстраивайте заказ.",
          ],
        },
        {
          h2: "BirLiy: касса, склад и отчёты в одном приложении",
          paragraphs: [
            "BirLiy: это одно приложение на телефоне или планшете. Касса, складской учёт, оплата по QR и отчёты в одном месте. Вместо трёх программ и тетради: один экран.",
            "При приёме продажи остаток обновляется сам. Чек покупателю уходит через Telegram вместо бумажного принтера. Если интернет пропал, приложение продолжает работать и синхронизируется само, когда связь вернётся. Вход по PIN, ведётся журнал всех действий: это защита от обмана кассиром.",
            "Цена: первые 6 месяцев 49 000 сум/мес, дальше 149 000 сум/мес, с полным функционалом. Наша команда подключит ваш магазин за один день и поможет загрузить товары. Сейчас в Ташкенте подключаются первые пилотные магазины.",
          ],
        },
      ],
      faq: [
        {
          q: "Как начать вести складской учёт в магазине?",
          a: "Составьте список товаров, задайте начальные остатки по каждому, затем записывайте каждую продажу и поставку. За неделю учёт остатков начнёт работать точно. С программой этот процесс идёт ещё быстрее.",
        },
        {
          q: "Сколько стоит программа складского учёта?",
          a: "Цена BirLiy: первые 6 месяцев 49 000 сум/мес, дальше 149 000 сум/мес. В неё входят касса, складской учёт, оплата по QR и отчёты, с полным функционалом.",
        },
        {
          q: "Нужно ли отдельное устройство для сканирования штрихкодов?",
          a: "Нет. Камера телефона или планшета читает штрихкод. Товар появляется на экране, остаток обновляется сам. Отдельный сканер покупать не нужно.",
        },
        {
          q: "Работает ли складской учёт без интернета?",
          a: "Да. Приложение работает и без интернета: продажа принимается, остаток обновляется. Когда связь вернётся, все данные синхронизируются сами.",
        },
      ],
      cta: {
        text: "Наладьте складской учёт в магазине за один день. Наша команда поможет загрузить товары.",
        button: "Оставить заявку",
      },
    },
    en: {
      title: "Inventory management for a small shop: a beginner guide",
      description:
        "How to run inventory management in a small shop: stock tracking, product list, reorder signals and phone-camera barcode scanning. A step-by-step guide.",
      keywords: [
        "inventory management small shop",
        "stock tracking app",
        "inventory software Uzbekistan",
        "inventory tracking",
        "reorder signals",
        "how to track inventory",
        "small retail stock control",
        "barcode inventory app",
        "stock count guide",
        "product reorder point",
      ],
      intro: [
        "Inventory management for a small shop owner is not about complicated spreadsheets. It is about one clear answer: what you have on the shelves right now, what sells well, and what you need to reorder. In a 50 square meter shop and in a bigger one, the logic is the same.",
        "Many owners keep records in a notebook or in their head. While you have few items, that works. But once the number of products grows, stock tracking gets messy: your bestseller runs out, while slow stock sits and freezes your money. You end up not knowing your real stock, and a stock count takes several hours every time.",
        "In this guide we go step by step on how to run inventory from scratch. No complicated terms, just plain language about money and time.",
      ],
      sections: [
        {
          h2: "What inventory management really means for a small shop",
          paragraphs: [
            "Inventory management means knowing the quantity of each product in your shop. How many units you have, how many sold, how many are left. Know these three numbers and your shop is under control.",
            "What does it give you? First, you reorder a bestseller before it runs out. Second, you see slow stock and stop tying extra money into it. Third, at the end of the month you do not guess your stock, you know it exactly.",
            "You can start with a notebook. But writing every sale by hand is slow and easy to get wrong. That is why many shops move to a stock tracking app: when you sell, the stock count drops on its own.",
          ],
        },
        {
          h2: "Step by step: how to start inventory tracking",
          paragraphs: [
            "You do not need a big system to start. Follow this order, and within a week your inventory will be ready.",
            "The most important part: enter your starting quantities correctly. If you put a wrong number at the start, every later count will be off. So take your first stock count calmly, without rushing.",
          ],
          list: [
            "List your products: the name and price of every item in the shop.",
            "Set starting quantities: how many units of each product you have now.",
            "Record every sale: a product sells, the stock count drops.",
            "Record every delivery: new stock arrives, the count goes up.",
            "Check once a week: compare the number on the shelf with the number in your records.",
          ],
        },
        {
          h2: "Barcode scanning with a phone camera: removing manual work",
          paragraphs: [
            "Where does most of the time go? Into finding each product by hand and changing its quantity. Barcode scanning removes that work.",
            "The phone camera reads the barcode, and the product appears on screen right away. On a sale: scan, the price fills in by itself, the stock drops by itself. On a delivery: scan, the stock goes up by itself. You do not need a separate scanner device.",
            "It also cuts mistakes. When you write by hand, people slip: wrong product, wrong number. With a barcode every action is exact.",
          ],
        },
        {
          h2: "A ready product database: saves a setup week",
          paragraphs: [
            "The most tedious part of starting inventory is entering every product by hand with its name, barcode and price. With hundreds of items, that takes days.",
            "The BirLiy database already holds more than 9 000 products. For many items you only set the price and the quantity, the rest is ready. That is why setup shrinks from weeks to one day.",
            "Products not in the database you add by hand or by scanning the barcode. Enter an item once, and it stays in your records from then on.",
          ],
        },
        {
          h2: "Reorder signals: never out of bestsellers, no frozen money",
          paragraphs: [
            "The goal of good inventory management is to keep the right amount of each product. Not too much, not too little.",
            "If a bestseller runs out, you lose the sale and the customer. So set a minimum quantity for each main product. When the stock falls to that level, it is a reorder signal.",
            "On the other side, do not over-order slow stock. It sits on the shelf and freezes your money. Your records show what sells well and what sells slowly, so you can match your orders to that.",
          ],
        },
        {
          h2: "BirLiy: till, stock and reports in one app",
          paragraphs: [
            "BirLiy is one app on a phone or tablet. The till, inventory management, QR payment and reports in one place. Instead of three programs and a notebook, one screen.",
            "When you take a sale, the stock updates on its own. The receipt goes to the customer through Telegram instead of a paper printer. If the internet drops, the app keeps working and syncs by itself when the connection returns. Access is by PIN, with a full action journal, so you are protected from cashier fraud.",
            "Price: 49 000 som per month for the first 6 months, then 149 000 som per month, with full functionality. Our team connects your shop in one day and helps you load your products. First pilot shops in Tashkent are being connected now.",
          ],
        },
      ],
      faq: [
        {
          q: "How do I start inventory management in a small shop?",
          a: "List your products, set the starting quantity for each, then record every sale and delivery. Within a week your stock tracking will run accurately. With an app the process is even faster.",
        },
        {
          q: "How much does inventory software cost?",
          a: "BirLiy costs 49 000 som per month for the first 6 months, then 149 000 som per month. That includes the till, inventory management, QR payment and reports, with full functionality.",
        },
        {
          q: "Do I need a separate device to scan barcodes?",
          a: "No. Your phone or tablet camera reads the barcode. The product appears on screen and the stock updates by itself. No separate scanner is needed.",
        },
        {
          q: "Does inventory tracking work without internet?",
          a: "Yes. The app works offline too: a sale is taken, the stock updates. When the connection returns, all data syncs on its own.",
        },
      ],
      cta: {
        text: "Set up inventory management in your shop in one day. Our team helps you load your products.",
        button: "Leave a request",
      },
    },
  },
};
