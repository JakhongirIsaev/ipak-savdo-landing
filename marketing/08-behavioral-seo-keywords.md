# 08: Behavioral SEO Keywords for BirLiy

This document catalogues the search phrases real owners use when looking for a tool like BirLiy, organized into clusters. For each cluster it states WHERE the phrases should be applied in the codebase. It also flags noisy/ambiguous phrases and gives safe contextual forms, and ends with a priorities list and suggested new page/post titles.

---

## Keyword Clusters

### UZ Clusters

#### 1. Kassa / POS dasturi (hardware-agnostic)

| Term | Notes |
|---|---|
| kassa programma | everyday transliterated |
| magazin uchun programma | everyday transliterated |
| savdo uchun programma | formal |
| telefonda kassa | conversational |
| telefon orqali kassa | conversational |
| kassa aparatsiz savdo | pivot angle (no hardware) |
| kassa apparat kerakmi | question form |
| android kassa ilovasi | platform-specific |
| internetsiz kassa | offline angle |
| oflayn kassa dasturi | offline angle |
| dukon uchun telefon kassa | neighborhood shop angle |

Where to use: landing hero/subtitle copy (i18n.ts), FAQ pairs in i18n.ts faq[], app/page.tsx metadata keywords, llms.txt everyday-names section.

---

#### 2. Do'kon dasturi (store software)

| Term | Notes |
|---|---|
| do kon uchun dastur | unformatted (common typo) |
| do'kon uchun dastur | formal |
| dukon uchun dastur | everyday |
| magazin uchun dastur | everyday transliterated |
| kichik do'kon uchun dastur | small shop angle |
| minimarket uchun kassa dasturi | minimarket angle |
| oziq-ovqat do'koni uchun dastur | grocery angle |
| do'kon uchun ilov | short everyday |

Where to use: landing segment sublines (i18n.ts), app/page.tsx keywords array, JSON-LD applicationCategory/isRelatedTo, blog titles.

---

#### 3. Ombor / Tovar hisobi (inventory)

| Term | Notes |
|---|---|
| ombor hisobi | core term |
| do'kon ombor hisobi | shop-specific |
| ombor hisobini yuritish | action form |
| tovar hisobi | core term |
| tovar sanash | everyday action |
| tovarlarni hisobga olish dasturi | formal |
| do'konda tovar hisobi | shop-specific |
| tovar qoldig'i hisobi | stock-left angle |
| nima qolganini bilish | conversational question form |
| do'konda nima qolgan | conversational question form |
| savdo va ombor dasturi | combined |

Where to use: ombor/stock feature caption (i18n.ts), FAQ pairs, app/page.tsx keywords, llms.txt inventory section, blog post bodies.

---

#### 4. Nasiya / Qarz daftar (debt notebook)

| Term | Notes |
|---|---|
| qarz daftar | everyday |
| qarz daftari | formal |
| nasiya daftar | everyday |
| nasiya hisob | formal |
| nasiya savdo | sales-on-credit |
| nasiya yuritish dasturi | formal |
| qarzni kuzatish ilovasi | formal |
| mijozlar qarzi hisobi | formal |
| qarz yozib olish | action form |
| xaridor qarz daftari | buyer-debt angle |

Where to use: nasiya feature caption (i18n.ts), FAQ pairs, app/page.tsx keywords, llms.txt debt-notebook section, blog post bodies.

---

#### 5. QR tolov / Terminalsiz

| Term | Notes |
|---|---|
| qr tolov | core |
| qr orqali tolov | core |
| terminalsiz QR tolov | no-terminal pivot |
| do'konda QR tolov | shop-specific |
| kassa aparatsiz savdo | no-hardware pivot |

Where to use: QR/payment feature caption (i18n.ts), FAQ pairs, app/page.tsx keywords, JSON-LD featureList.

---

#### 6. Kassa apparat narxi (hardware comparison, pivot angle)

| Term | Notes |
|---|---|
| kassa aparat narxi | price comparison intent |
| kassa aparat narxlari | price comparison intent |
| shtrix kod skaner | hardware add-on angle |
| skaner narxi | hardware add-on angle |

Where to use: blog post on hardware costs vs. BirLiy phone-only approach. Do NOT put these in the main landing keywords; they are better suited to a dedicated comparison blog post.

---

#### 7. Savdo hisobi / Hisobot

| Term | Notes |
|---|---|
| savdo dasturi | core |
| savdo uchun programma | core |
| kundalik savdo hisobi | daily report angle |
| smena hisobi | shift report angle |
| kunlik tushum hisobi | daily revenue angle |
| kassir nazorati | cashier control angle |
| do'kon uchun hisobot | report angle |
| savdo hisoboti | report angle |

Where to use: owner-reports feature section (i18n.ts), app/page.tsx keywords, JSON-LD featureList, blog post bodies.

---

#### 8. Lokatsiya / Bozor signal

| Term | Notes |
|---|---|
| Toshkent kassa dasturi | geo-specific |
| o'zbekiston kassa dasturi | country-level |
| savdo avtomatlashtirish kichik biznes | automation angle |

Where to use: JSON-LD areaServed, llms-full.txt primary-segments section, FAQ pairs (location context). Avoid keyword-stuffing these into visible landing copy; use naturally in blog post opening paragraphs.

---

### RU Clusters

#### 1. Касса в телефоне

| Term | Notes |
|---|---|
| касса для магазина | core |
| кассовая программа для магазина | core |
| касса в телефоне | core |
| мобильная касса | core |
| мобильная касса приложение | product form |
| касса на Android | platform |
| касса на смартфоне | platform |
| касса для магазина продуктов | grocery angle |
| онлайн касса Узбекистан | geo |
| касса без интернета | offline angle |

Where to use: app/ru/page.tsx keywords, landing RU hero/subtitle (i18n.ts), RU FAQ pairs, llms.txt RU everyday-names section, JSON-LD applicationCategory.

---

#### 2. Программа для магазина

| Term | Notes |
|---|---|
| программа для магазина | core |
| программа для магазина продуктов | grocery angle |
| программа для минимаркета | minimarket angle |
| программа для магазина у дома | neighborhood angle |
| программа для дукана | Uzbek-market angle |
| программа для продуктового магазина | grocery angle |
| программа для небольшого магазина | small-shop angle |
| программа для розничной торговли | formal retail |
| приложение для магазина у дома | neighborhood mobile angle |

Where to use: app/ru/page.tsx keywords, landing RU segment sublines, JSON-LD isRelatedTo, RU blog post titles.

---

#### 3. Учет товаров и остатков

| Term | Notes |
|---|---|
| учет товаров | core |
| учет товаров программа | product form |
| учет остатков | core |
| учет остатков в магазине | shop-specific |
| учет товара в магазине | shop-specific |
| учет продаж в магазине | sales angle |
| программа учета товаров в магазине | formal |
| контроль остатков товаров | control angle |
| импорт товаров из Excel | Excel-migration angle |

Where to use: RU inventory feature caption (i18n.ts), app/ru/page.tsx keywords, JSON-LD featureList, RU blog post bodies.

---

#### 4. Долги и насия

| Term | Notes |
|---|---|
| долговая тетрадь | core |
| долговая тетрадь в магазине | shop-specific |
| тетрадь долгов | everyday form |
| чем заменить тетрадь долгов | question form (high intent) |
| учет долгов покупателей | formal |
| учет долгов в магазине | shop-specific |
| насия учет | mixed-language |
| долги покупателей приложение | product form |
| замена долговой тетради | replacement angle |
| Qarz daftar приложение | transliterated mixed |

Where to use: RU nasiya feature caption (i18n.ts), app/ru/page.tsx keywords, RU FAQ pairs, llms.txt debt-notebook section, RU blog post title.

---

#### 5. QR оплата и платежи

| Term | Notes |
|---|---|
| QR оплата без терминала | no-terminal pivot |
| QR оплата Узбекистан | geo |
| принять оплату по QR | action form |
| мобильная касса приложение | overlaps cluster 1 |

Where to use: RU QR feature caption, app/ru/page.tsx keywords, JSON-LD featureList.

---

#### 6. Автоматизация и владелец

| Term | Notes |
|---|---|
| автоматизация магазина | core |
| автоматизация розничной торговли | formal |
| автоматизация минимаркета | minimarket angle |
| контроль кассира | cashier control |
| доступ по PIN кассир | PIN access angle |
| отчет по выручке магазина | revenue report |
| чек в Telegram магазин | Telegram receipt |

Where to use: owner-control feature section (i18n.ts), app/ru/page.tsx keywords, RU blog post bodies.

---

#### 7. Ценовые и брендовые запросы

| Term | Notes |
|---|---|
| сколько стоит BirLiy | branded price intent |
| BirLiy | brand |
| касса для магазина цена | price intent |
| программа для ИП Узбекистан | legal entity angle |

Where to use: app/ru/page.tsx keywords, pricing section copy, RU FAQ pairs, JSON-LD offers priceSpecification.

---

## Noisy Phrases

These terms are ambiguous and should only appear WITH the stated contextual wrapper; never as isolated keywords.

1. **"pos" alone** maps primarily to Postman (CLI tool) and PostgreSQL in developer search results. Use only with context: "POS система для магазина", "POS система Узбекистан", "POS для минимаркета". Safe form: always combine with "магазин" or "минимаркет".

2. **"qoldiq" alone** maps to school/math contexts (remainder/residual). Use with context: "do'konda nima qolganini bilish", "tovar qoldig'i", "ombor hisobi". Safe form: always pair with "do'kon" or "tovar".

3. **"ombor" alone** is semantically broad in Uzbek (warehouse, storage room, any stock room). Use with context: "ombor hisobi", "do'kon ombor hisobi". Safe form: always add "hisobi" or "do'kon".

4. **Apostrophe-heavy QR forms** (e.g. "to'lov") are inconsistently indexed. Prefer "qr tolov" and "qr orqali tolov" over forms containing apostrophes in URL slugs and metadata. Use the full apostrophe form only in visible body copy for readability.

---

## Priorities

1. **P0: Cafe removal** from public positioning (Testimonials.tsx lines 20/30, i18n.ts lines 19/40/267/278/279/352/416/437/664/675/676/749). RU/UZ parity required on every paired line. Do NOT touch backend enums, tests, admin, Telegram parsing, or i18n businessTypes[] lines 105-113 and 502-510, or LeadForm.tsx.

2. **P0: CSP additive patch** in next.config.js: add https://yastatic.net to script-src and append frame-src, child-src, worker-src for Yandex Webvisor. All other security headers stay identical.

3. **P1: Meta enrichment** in app/page.tsx (uz) and app/ru/page.tsx (ru): polish title/description and append new behavioral terms to existing keywords arrays. Dedup required; append only the listed new terms.

4. **P1: FAQ pairs** in lib/landing/i18n.ts: add 4 UZ plus 4 RU behavioral FAQ pairs (append after existing 14). JSON-LD FAQPage auto-derives from these.

5. **P2: JSON-LD APP_KEYWORDS and APP_DESCRIPTION** in components/landing/JsonLd.tsx: append new behavioral terms and replace APP_DESCRIPTION with improved machine-readable form.

6. **P2: Copy placements** in lib/landing/i18n.ts: weave 5 behavioral lines into hero subtitle, segments subline, nasiya caption, stock caption, offline subline. RU/UZ parallel, no em-dash.

7. **P2: llms enrichment** in app/llms.txt/route.ts and app/llms-full.txt/route.ts: add everyday-names, hardware-free, debt-notebook, and inventory blocks (done in this session).

8. **P3 (optional): Blog metadata** in lib/blog/posts/*.ts: existing titles already read naturally; skip unless copy changes are explicitly requested.

---

## Next Blog/Post Ideas

These titles address high-intent behavioral queries not yet covered in the blog:

- `/narx` page or post: "Kassa uchun programma narxi"
- "Do'kon uchun dastur: kassa, ombor, qarz daftar"
- "Qarz daftarini telefonda yuritish"
- "Ombor hisobi: do'konda nima qolganini qanday bilish"
- RU: "Программа для магазина продуктов: касса, склад, долги"
- "Чем заменить долговую тетрадь в магазине"
- "Касса в телефоне для магазина у дома"
