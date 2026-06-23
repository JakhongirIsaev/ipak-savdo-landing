import type { BlogPost } from "../types";
import { blogCover } from "../blog-image";

export const post: BlogPost = {
  slug: "skladskoy-uchet-v-malenkom-magazine",
  category: "product",
  date: "2026-06-11",
  modified: "2026-06-23",
  image: blogCover("skladskoy-uchet-v-malenkom-magazine"),
  locales: {
    uz: {
      title: "Do'konda ombor hisobi: tugab qolmaslik uchun amaliy yo'l",
      description:
        "Kichik do'konda ombor hisobi: tez sotiladigan tovar tugab qolmasligi, qoldiqni telefonda yuritish va qayta buyurtma chegarasi. Amaliy qo'llanma.",
      keywords: [
        "do'konda ombor hisobi",
        "ombor hisobi",
        "qoldiq hisobi",
        "tovar qoldig'i",
        "inventarizatsiya",
        "qayta buyurtma chegarasi",
        "telefonda ombor hisobi",
        "BirLiy ombor",
        "minimarket ombor dasturi",
      ],
      intro: [
        "Tez sotiladigan tovar bir kuni indamay tugaydi. Buni siz emas, xaridor aytadi: \"Falon mahsulot bormi?\" Yo'q ekan. U boshqa do'konga ketadi, sizda esa polkada bo'sh joy qoladi. Ombor hisobi aslan shu lahzani oldini olish uchun kerak.",
        "Ko'p egasi qoldiqni daftarda yoki yodda yuritadi. Tovar oz bo'lganda ishlaydi. Pozitsiya yuzlab bo'lganda esa raqamlar bir-biriga to'g'ri kelmaydi: bestseller tugaydi, sekin tovar polkada pulni ushlab turadi, oy oxirida inventarizatsiya yarim kechgacha cho'ziladi.",
        "Bu qo'llanma chiroyli gaplar haqida emas. Do'koningizda ombor hisobini qanday yo'lga qo'yish va ayni qaysi tovarni qachon qayta buyurtma qilishni ko'rsatadi. Til oddiy: pul va vaqt tili.",
      ],
      sections: [
        {
          h2: "Do'konda ombor hisobi nimani hal qiladi",
          paragraphs: [
            "Ombor hisobi murakkab atama emas. Bu bitta savolga aniq javob: ayni damda har bir tovardan nechta dona bor. Shu bitta raqam sizga uchta narsani beradi: nima tugayapti, nima sekin turibdi, nimani qachon olib kelish kerak.",
            "Bu raqam yo'q bo'lsa, ikki tomondan pul oqib ketadi. Bir tomondan, tez tovar tugaydi va siz sotuvni hamda mijozni yo'qotasiz. Boshqa tomondan, kerakmagan molni ko'p olib qo'yasiz, u polkada turadi va pulingizni muzlatadi. Ikkalasi ham ko'rinmaydi, chunki hisob yo'q.",
            "Daftar bilan ham boshlash mumkin, daftar yomon emas. Lekin har bir sotuvni qo'lda yozish vaqt oladi va adashtiradi: bitta sotuv yozilmay qoladi, qoldiq xato bo'ladi. Shu sababli ko'pchilik telefondagi hisobga o'tadi, u yerda sotuvdan keyin qoldiq o'zi kamayadi.",
          ],
        },
        {
          h2: "Ombor hisobini do'koningizda qanday yo'lga qo'yish",
          paragraphs: [
            "Boshlash uchun katta tizim shart emas. Asosiysi tartib. Quyidagi besh qadam bilan yuring, qoldiq hisobi bir hafta ichida ishlay boshlaydi.",
            "Eng nozik joy: boshlang'ich qoldiq. Agar boshida tovar sonini xato yozsangiz, keyingi hamma hisob xato boradi. Shuning uchun birinchi inventarizatsiyani shoshmasdan, polkadan polkaga qarab qiling. Bu bir martalik mehnat, keyin qoldiq o'zi yuriladi.",
          ],
          list: [
            "Tovarlarni guruhga ajrating: ichimlik, non, sut mahsulotlari, maishiy. Yuzta tovarni birdan emas, guruh bo'yicha sanash oson.",
            "Har bir guruhdan boshlang'ich qoldiqni yozing: ayni damda nechta dona bor.",
            "Eng tez sotiladigan o'n besh tovarni alohida belgilang: aynan shular tugab qolsa zarar katta.",
            "Mol kelganda kirimni yozing, sotilganda qoldiq kamaysin: shunda raqam doim joriy bo'lib turadi.",
            "Haftada bir marta tekshiring: shu o'n besh tovarning polkadagi soni hisobdagi son bilan to'g'ri kelyaptimi.",
          ],
        },
        {
          h2: "Qayta buyurtma chegarasi: bitta tovar misolida",
          paragraphs: [
            "Eng kerakli vosita: har bir asosiy tovar uchun eng kam qoldiq chegarasi. Bu daraja oddiy savoldan kelib chiqadi: yangi mol kelgunicha shu tovardan nechta sotaman.",
            "Bir misol. Aytaylik, do'koningizda bir litrli suv yaxshi ketadi. Yetkazib beruvchi sizga har payshanba keladi. Hafta ichida shu suvdan o'rtacha qancha sotsangiz, o'shanga ozgina zaxira qo'shib, eng kam qoldiq chegarasini belgilaysiz. Qoldiq shu chegaraga tushganda, bu yangi mol buyurtma qilish vaqti degani, polka bo'shashini kutmaysiz.",
            "Sekin sotiladigan tovarga esa teskari qoida: chegarani past qo'ying va ko'p olib qo'ymang. Hisobdan qaysi tovar tez, qaysi biri sekin ketishi ko'rinadi, buyurtmani ana shunga moslang. Maqsad oddiy: har bir tovardan kerakli miqdorda saqlash, ko'p ham, kam ham emas.",
          ],
        },
        {
          h2: "Telefon kamerasi bilan barkod o'qish",
          paragraphs: [
            "Eng ko'p vaqt qayerga ketadi? Har bir tovarni ro'yxatdan qo'lda topib, sonini o'zgartirishga. Barkod o'qish shu ishni qisqartiradi.",
            "Telefon kamerasi barkodni o'qiydi, tovar darhol ekranga chiqadi. Sotuvda barkodni o'qiysiz, qoldiq o'zi kamayadi. Mol kelganda o'qiysiz, qoldiq o'zi ortadi. Tovarni ro'yxatdan qidirib o'tirmaysiz.",
            "Bu xatoni ham kamaytiradi. Qo'lda yozganda odam adashadi: noto'g'ri tovar, noto'g'ri son. Barkod bilan har bir harakat aniq, kechqurun qoldiq bilan polka bir-biriga to'g'ri keladi.",
          ],
        },
        {
          h2: "BirLiy ombor hisobini qanday osonlashtiradi",
          paragraphs: [
            "BirLiy: telefon yoki planshetdagi bitta ilova. Kassa, ombor va to'lovlar bir joyda. Sotuv qabul qilinsa, qoldiq o'zi yangilanadi, kechqurun qayta sanab o'tirish shart emas.",
            "Ombor hisobini boshlashda eng zerikarli qism: har bir tovarni nomi va narxi bilan kiritish. BirLiy bazasida 9 000 dan ortiq tovar tayyor, ko'p mahsulot uchun siz faqat narx va qoldiqni qo'yasiz. Internet uzilsa, ilova ishlashda davom etadi, aloqa qaytganda hammasi o'zi sinxronlanadi. Kirish PIN orqali, har bir harakat jurnalga yoziladi, shuning uchun qaysi kassir nimani urganini ko'rasiz.",
            "Hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz. O'zbekiston uchun yaratilgan.",
          ],
        },
      ],
      faq: [
        {
          q: "Do'konda ombor hisobini qanday boshlash kerak?",
          a: "Tovarlarni guruhga ajrating, har bir guruhdan boshlang'ich qoldiqni sanang, keyin kirim va sotuvni yozib boring. Eng tez sotiladigan tovarlarni alohida kuzating. Bir hafta ichida qoldiq hisobi aniq ishlaydi, telefondagi dastur bilan bu jarayon tezroq.",
        },
        {
          q: "Qayta buyurtma chegarasini qanday belgilanadi?",
          a: "Yetkazib beruvchi kelgunicha shu tovardan qancha sotishingizga qarang, unga kichik zaxira qo'shing. Qoldiq shu darajaga tushganda yangi mol buyurtma qiling. Shunda tez tovar polka bo'shashini kutmay, o'z vaqtida to'ldiriladi.",
        },
        {
          q: "Barkod o'qish uchun alohida qurilma kerakmi?",
          a: "Yo'q. Telefon yoki planshet kamerasi barkodni o'qiydi. Tovar ekranga chiqadi, qoldiq o'zi yangilanadi. Alohida skaner sotib olish shart emas.",
        },
        {
          q: "Internet bo'lmasa ombor hisobi ishlaydimi?",
          a: "Ilova internetsiz ham ishlaydi: sotuv qabul qilinadi, qoldiq yangilanadi. Aloqa qaytganda hamma ma'lumot o'zi sinxronlanadi.",
        },
        {
          q: "Yuzlab tovarni qo'lda kiritish kerakmi?",
          a: "Shart emas. BirLiy bazasida 9 000 dan ortiq tovar tayyor, ko'p mahsulot uchun siz faqat narx va qoldiqni qo'yasiz. Bazada yo'q tovarni barkod orqali yoki qo'lda qo'shasiz.",
        },
      ],
      cta: { text: "Do'koningizda ombor hisobini telefonda yo'lga qo'ying. Erta kirish ochiq.", button: "Ariza qoldirish" },
    },
    ru: {
      title: "Складской учёт в магазине: чтобы товар не кончался",
      description:
        "Складской учёт в небольшом магазине: чтобы ходовой товар не кончался, остатки в телефоне и точка дозаказа на примере. Практический гид для владельца.",
      keywords: [
        "складской учёт в магазине",
        "учёт остатков",
        "остатки товара",
        "точка дозаказа",
        "инвентаризация в магазине",
        "складской учёт в телефоне",
        "контроль остатков",
        "BirLiy склад",
        "программа учёта для минимаркета",
      ],
      intro: [
        "Ходовой товар кончается тихо. И узнаёте об этом не вы, а покупатель: \"А такое есть?\" Нет. Он уходит в магазин напротив, а у вас на полке пустое место. Складской учёт нужен именно для того, чтобы этот момент не повторялся.",
        "Многие владельцы ведут остатки в тетради или в голове. Пока товаров мало, это работает. Когда позиций сотни, числа перестают сходиться: бестселлер заканчивается, медленный товар лежит и держит деньги, а инвентаризация в конце месяца тянется до ночи.",
        "Этот гид не про красивые слова. Он про то, как наладить складской учёт в вашем магазине и какой именно товар когда дозаказывать. Язык простой: про деньги и про время.",
      ],
      sections: [
        {
          h2: "Что решает складской учёт в магазине",
          paragraphs: [
            "Складской учёт: это не сложный термин. Это точный ответ на один вопрос: сколько единиц каждого товара у вас сейчас. Из этого одного числа вы видите три вещи: что заканчивается, что лежит мёртвым грузом, что и когда пора привезти.",
            "Без этого числа деньги утекают с двух сторон. С одной стороны, ходовой товар кончается, и вы теряете продажу и покупателя. С другой стороны, лишнего товара набираете слишком много, он стоит на полке и замораживает ваши деньги. Обе утечки незаметны, потому что учёта нет.",
            "Начать можно и с тетради, тетрадь не враг. Но записывать каждую продажу вручную долго и легко сбиться: одна продажа не записана, остаток уже неверный. Поэтому многие переходят на учёт в телефоне, где остаток уменьшается сам после продажи.",
          ],
        },
        {
          h2: "Как наладить складской учёт в вашем магазине",
          paragraphs: [
            "Большая система для старта не нужна. Нужен порядок. Пройдите эти пять шагов, и учёт остатков начнёт работать за неделю.",
            "Самое тонкое место: начальные остатки. Если в начале записать неверное число, весь дальнейший учёт пойдёт с ошибкой. Поэтому первую инвентаризацию делайте спокойно, полка за полкой. Это разовый труд, дальше остаток ведётся сам.",
          ],
          list: [
            "Разбейте товары на группы: напитки, хлеб, молочка, бытовое. Сотню позиций проще считать по группам, чем разом.",
            "По каждой группе запишите начальный остаток: сколько единиц есть прямо сейчас.",
            "Отдельно отметьте пятнадцать самых ходовых товаров: именно их пропажа бьёт сильнее всего.",
            "Записывайте приход, когда товар привезли, и списывайте при продаже: тогда число всегда актуальное.",
            "Раз в неделю проверяйте: сходится ли число на полке с числом в учёте по этим пятнадцати товарам.",
          ],
        },
        {
          h2: "Точка дозаказа: на примере одного товара",
          paragraphs: [
            "Главный инструмент: минимальный остаток по каждому основному товару. Он берётся из простого вопроса: сколько этого товара я продам, пока не приедет новая поставка.",
            "Пример. Допустим, в вашем магазине хорошо идёт вода в литровых бутылках. Поставщик приезжает каждый четверг. Смотрите, сколько такой воды вы в среднем продаёте за неделю, добавляете небольшой запас и ставите минимальный остаток на этом уровне. Когда остаток падает до него, это сигнал заказать новую партию, а не ждать, пока полка опустеет.",
            "Для медленного товара правило обратное: ставьте порог низким и не набирайте впрок. По учёту видно, что идёт быстро, а что медленно, и под это подстраивайте заказ. Цель простая: держать каждого товара нужное количество, не много и не мало.",
          ],
        },
        {
          h2: "Штрихкод камерой телефона",
          paragraphs: [
            "Куда уходит больше всего времени? На то, чтобы вручную найти товар в списке и поменять его количество. Сканирование штрихкода это сокращает.",
            "Камера телефона читает штрихкод, и товар сразу появляется на экране. При продаже сканируете, остаток уменьшается сам. При поставке сканируете, остаток растёт сам. Искать позицию в списке не нужно.",
            "Это ещё и снижает ошибки. При записи вручную человек путается: не тот товар, не то число. Со штрихкодом каждое действие точное, и вечером остаток сходится с полкой.",
          ],
        },
        {
          h2: "Как BirLiy упрощает складской учёт",
          paragraphs: [
            "BirLiy: это одно приложение на телефоне или планшете. Касса, склад и оплаты в одном месте. Приняли продажу, остаток обновился сам, пересчитывать вечером вручную не нужно.",
            "Самая скучная часть старта учёта: внести каждый товар с названием и ценой. В базе BirLiy уже больше 9 000 товаров, для многих позиций вы ставите только цену и остаток. Если интернет пропал, приложение продолжает работать и синхронизируется само, когда связь вернётся. Вход по PIN, ведётся журнал действий, поэтому видно, что пробил каждый кассир.",
            "Сейчас открываем ранний доступ для первых магазинов Ташкента. Сделано для Узбекистана.",
          ],
        },
      ],
      faq: [
        {
          q: "Как начать вести складской учёт в магазине?",
          a: "Разбейте товары на группы, посчитайте начальные остатки по каждой группе, затем записывайте приход и продажи. Самые ходовые товары держите на отдельном контроле. За неделю учёт остатков начнёт работать точно, с приложением в телефоне это идёт быстрее.",
        },
        {
          q: "Как определить точку дозаказа товара?",
          a: "Посмотрите, сколько товара вы продаёте до приезда поставщика, и добавьте небольшой запас. Когда остаток падает до этого уровня, заказывайте новую партию. Так ходовой товар пополняется вовремя, а не после того, как полка опустела.",
        },
        {
          q: "Нужно ли отдельное устройство для сканирования штрихкодов?",
          a: "Нет. Камера телефона или планшета читает штрихкод. Товар появляется на экране, остаток обновляется сам. Отдельный сканер покупать не нужно.",
        },
        {
          q: "Работает ли складской учёт без интернета?",
          a: "Приложение работает и без интернета: продажа принимается, остаток обновляется. Когда связь вернётся, все данные синхронизируются сами.",
        },
        {
          q: "Нужно ли вносить сотни товаров вручную?",
          a: "Не обязательно. В базе BirLiy уже больше 9 000 товаров, для многих позиций вы ставите только цену и остаток. Товар, которого нет в базе, добавляете сканированием штрихкода или вручную.",
        },
      ],
      cta: { text: "Наладьте складской учёт в магазине прямо в телефоне. Ранний доступ открыт.", button: "Оставить заявку" },
    },
    en: {
      title: "Inventory in a small shop: so you never run out",
      description:
        "Inventory management in a small shop: keep bestsellers in stock, track stock on your phone, and set a reorder point with a worked example. A practical owner guide.",
      keywords: [
        "inventory management small shop",
        "stock tracking",
        "reorder point",
        "stock control",
        "inventory count",
        "inventory on your phone",
        "BirLiy stock",
        "minimarket inventory app",
        "small retail stock control",
      ],
      intro: [
        "A bestseller runs out quietly. And you are not the one who notices, the customer is: \"Do you have this?\" You do not. They walk to the shop across the street, and you are left with an empty spot on the shelf. Inventory management exists to stop that moment from repeating.",
        "Many owners keep stock in a notebook or in their head. While you have few items, it works. Once you have hundreds of products, the numbers stop matching: the bestseller runs out, slow stock sits and ties up cash, and the month-end count drags into the night.",
        "This guide is not about nice words. It is about how to set up inventory in your shop and which exact product to reorder when. The language is plain: money and time.",
      ],
      sections: [
        {
          h2: "What inventory management solves in a small shop",
          paragraphs: [
            "Inventory management is not a complicated term. It is a precise answer to one question: how many units of each product you have right now. From that one number you see three things: what is running out, what is sitting dead, and what to bring in and when.",
            "Without that number, money leaks from two sides. On one side, a bestseller runs out and you lose the sale and the customer. On the other, you over-order things you do not need, they sit on the shelf and freeze your cash. Both leaks are invisible, because there is no count.",
            "You can start with a notebook, the notebook is not the enemy. But writing every sale by hand is slow and easy to slip on: one sale unrecorded, and the stock count is already wrong. So many owners move to a count on the phone, where the stock drops by itself after a sale.",
          ],
        },
        {
          h2: "How to set up inventory in your shop",
          paragraphs: [
            "You do not need a big system to start. You need order. Walk through these five steps, and your stock tracking will work within a week.",
            "The trickiest part: the starting quantities. If you record a wrong number at the start, every later count is off. So do the first inventory count calmly, shelf by shelf. It is one-time work, after that the stock runs itself.",
          ],
          list: [
            "Split products into groups: drinks, bread, dairy, household. A hundred items are easier to count by group than all at once.",
            "For each group, record the starting quantity: how many units you have right now.",
            "Mark the fifteen fastest-selling items separately: those are the ones whose absence hurts most.",
            "Record deliveries when stock arrives and deduct on each sale: then the number stays current.",
            "Once a week, check: does the number on the shelf match the number in your records for those fifteen items.",
          ],
        },
        {
          h2: "Reorder point: with one product as an example",
          paragraphs: [
            "The main tool: a minimum quantity for each main product. It comes from a simple question: how much of this product will I sell before the next delivery arrives.",
            "An example. Say one-litre bottled water sells well in your shop. Your supplier comes every Thursday. Look at how much of that water you sell in an average week, add a small buffer, and set the minimum quantity at that level. When the stock falls to it, that is the signal to order a new batch, not to wait for the shelf to go empty.",
            "For slow stock the rule is reversed: keep the threshold low and do not over-buy. Your records show what moves fast and what moves slowly, so you match the order to that. The goal is simple: keep the right amount of each product, not too much, not too little.",
          ],
        },
        {
          h2: "Barcode with the phone camera",
          paragraphs: [
            "Where does most of the time go? Into finding the product in the list by hand and changing its quantity. Barcode scanning cuts that.",
            "The phone camera reads the barcode and the product appears on screen right away. On a sale you scan, the stock drops by itself. On a delivery you scan, the stock goes up by itself. No searching the list for the item.",
            "It also cuts mistakes. When you write by hand, people slip: wrong product, wrong number. With a barcode every action is exact, and in the evening the stock matches the shelf.",
          ],
        },
        {
          h2: "How BirLiy makes inventory easier",
          paragraphs: [
            "BirLiy is one app on a phone or tablet. Till, stock and payments in one place. You take a sale, the stock updates on its own, no manual recount in the evening.",
            "The most tedious part of starting inventory is entering every product with its name and price. The BirLiy database already holds more than 9 000 products, and for many items you only set the price and the quantity. If the internet drops, the app keeps working and syncs by itself when the connection returns. Access is by PIN, with an action log, so you can see what each cashier rang up.",
            "We are opening early access for the first shops in Tashkent now. Made for Uzbekistan.",
          ],
        },
      ],
      faq: [
        {
          q: "How do I start inventory management in a small shop?",
          a: "Split products into groups, count the starting quantity for each group, then record deliveries and sales. Keep the fastest-selling items on separate watch. Within a week your stock tracking will run accurately, and with an app on the phone it goes faster.",
        },
        {
          q: "How do I set a reorder point for a product?",
          a: "Look at how much you sell before the supplier arrives, then add a small buffer. When the stock falls to that level, order a new batch. That way a bestseller is refilled on time, not after the shelf is already empty.",
        },
        {
          q: "Do I need a separate device to scan barcodes?",
          a: "No. Your phone or tablet camera reads the barcode. The product appears on screen and the stock updates by itself. No separate scanner is needed.",
        },
        {
          q: "Does inventory tracking work without internet?",
          a: "The app works offline too: a sale is taken, the stock updates. When the connection returns, all data syncs on its own.",
        },
        {
          q: "Do I have to enter hundreds of products by hand?",
          a: "Not necessarily. The BirLiy database already holds more than 9 000 products, and for many items you only set the price and the quantity. A product that is not in the database you add by scanning the barcode or by hand.",
        },
      ],
      cta: { text: "Set up inventory in your shop right on the phone. Early access is open.", button: "Leave a request" },
    },
  },
};
