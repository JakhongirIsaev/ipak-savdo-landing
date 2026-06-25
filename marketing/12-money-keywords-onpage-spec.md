# 12: Money-keyword on-page spec (Phase 2, BIRAAA-68)

Owner: SEO Intel. Date: 2026-06-20. Source data: ranking report 20.06 (real). Pattern to copy: `pos-tizimi-uzbekistan-minimarket` (our champion, pos #2).

## The diagnosis (why this spec exists)
When we target a keyword, we win: minimarket pos #1.5, homepage #2, `pos-tizimi-uzbekistan-minimarket` #2 to #4. The problem is NOT ranking ability. It is COVERAGE of money keywords. On these we sit outside the top 30:

| Money keyword | Lang | Who owns top now | Our page action |
|---|---|---|---|
| kassa dasturi | uz | moysklad.uz | NEW `minimarket-uchun-kassa-dasturi-2026` |
| kassa dasturi narxi | uz | tovar.uz | same NEW page, narx block + FAQ |
| pos tizimi / minimarket pos | uz | moysklad.uz | UPGRADE `pos-tizimi-uzbekistan-minimarket` |
| qarz daftar | uz | pdaftar.uz | UPGRADE `qarz-daftar-orniga-nima` |
| nasiya savdo | uz | m.olx.uz | same UPGRADE page (H2 + FAQ) |
| программа для кассы | ru | ususoft.uz | UPGRADE `kak-vybrat-kassu-dlya-magazina` |
| касса для магазина | ru | m.olx.uz | same UPGRADE page |
| складская программа узбекистан | ru | moysklad.uz | UPGRADE `skladskoy-uchet-v-malenkom-magazine` |

## Anti-cannibalization decisions (from 11-blog-keyword-map.md)
- ONE canonical page per primary keyword. Repo model = one post slug carries uz/ru/en locales (hreflang: `/blog/slug` uz, `/ru/blog/slug` ru, `/en/blog/slug` en).
- The head term "magazin uchun dastur / программа для магазина" stays owned only by `magazin-uchun-dastur-telefonda-savdo` (the HUB). New pages must use segment-qualified primary keywords.
- "kassa dasturi" (new page) is kept DISTINCT from "POS tizimi" (`pos-tizimi`). Different primary keyword, different H1. If GSC later shows them competing, MERGE the new page into `pos-tizimi`.
- ONE qarz page. `qarz-daftar-orniga-nima` absorbs "nasiya savdo" as an H2 + FAQ, not a second page.
- Pillar reconciliation: `magazin-uchun-dastur-telefonda-savdo` stays the top head-term HUB. `pos-tizimi-uzbekistan-minimarket` becomes the POS/kassa SEGMENT sub-pillar that the new kassa-dasturi page and `kak-vybrat-kassu` link up to. This satisfies the issue's "make pos-tizimi a pillar" without two competing hubs.
- The RU sibling of the new kassa page targets "программа для минимаркета (Узбекистан)" (thin local SERP), NOT "программа для магазина" (head, owned) and NOT "POS-система" (owned by pos-tizimi). This keeps the new post bilingual and non-cannibalizing.
- UZ-axis split (Page 2 vs Page 4): Page 2 (`minimarket-uchun-kassa-dasturi-2026`) owns the transactional / overview query `kassa dasturi` (what it is + narx). The UZ sibling of Page 4 (`kak-vybrat-kassu`) holds the choose / compare intent `kassa dasturini qanday tanlash` and does NOT put the exact `kassa dasturi` in its UZ H1. Page 4 UZ H1 stays "Do'kon uchun kassa dasturini qanday tanlash kerak", with no separate H2 carrying the bare `kassa dasturi` the way Page 2 does. If GSC later shows UZ competition between them, we merge Page 4 UZ occurrences into Page 2.

## On-page checklist applied to EVERY page below (champion pattern)
1. Title <=60 chars, primary keyword at the start.
2. Meta description <=155 chars: keyword + concrete benefit + CTA.
3. H1 with exact primary keyword. H2s carry related keys and real question forms.
4. Keyword natural in the first paragraph and through the body, no stuffing.
5. FAQ block + JSON-LD FAQPage (auto-derives from `faq[]`) built on real keyword questions.
6. Internal links: 2 to 3 related posts + the landing, wiring finance cluster <-> product cluster.
7. Content deeper and more concrete than the competitor, local: UZ reality, сум / so'm, real shop-owner cases.
8. uz/ru/en parity + hreflang. Guardrails: no bank, zero em-dash, сум (ru) / so'm (uz) never UZS, no AI-slop.

---

# PAGE 1: pos-tizimi-uzbekistan-minimarket (LIVE-UPGRADE -> segment sub-pillar)

1. **Slug / pillar:** `pos-tizimi-uzbekistan-minimarket` (live, no new URL). Pillar: product. Role: POS/kassa segment sub-pillar.
2. **Primary keyword + variants:** uz `pos tizimi`, `minimarket pos`, `minimarket uchun pos tizimi`, `do'kon pos tizimi`; ru `POS-система для минимаркета`, `POS для магазина`. Scope uz+ru (+en sibling).
3. **Intent:** commercial-investigational. Pain: "Qaysi POS tizimi kichik do'konimga arziydi, qimmat uskuna shartmi?"
4. **Canonical decision:** LIVE-UPGRADE (deepen the champion, keep the URL). Anti-cannibalization: keeps "POS tizimi"; must stay distinct from the new "kassa dasturi" page (Page 2).
5. **Evidence:** champion at pos #2 to #4; "pos tizimi / minimarket pos" head still owned by moysklad.uz. We already rank, so deepening to sub-pillar + more internal links is the cheapest top-3 push. Source: report 20.06.
6. **Outline (additions to current H2s):** keep current H1. Add H2 "POS tizimi narxi: nimaga to'laysiz" (links to Page 2), H2 "POS tizimi vs oddiy kassa apparat" (links to `kassa-apparatsiz-savdo`), H2 "Tez-tez beriladigan savollar". Move keyword "POS tizimi" into the first intro sentence (currently starts "Qisqa javob").
7. **Internal links (add):** down to Page 2 `minimarket-uchun-kassa-dasturi-2026` (anchor "minimarket uchun kassa dasturi"), to `kassa-apparatsiz-savdo`, to finance `qarz-daftar-orniga-nima` (anchor "nasiya / qarz daftar"); up to HUB `magazin-uchun-dastur-telefonda-savdo`; to landing birliy.uz.
8. **Meta (proposed):**
   - UZ title: `POS tizimi minimarket uchun: O'zbekiston 2026 qo'llanma` (55)
   - UZ desc: `Minimarket uchun POS tizimi: telefonda kassa, ombor, kassir nazorati va QR. Narx va tanlov mezonlari, bir kunda ulaymiz.` (<=155)
   - RU title: `POS-система для минимаркета: Узбекистан 2026` (43)
   - RU desc: `POS-система для минимаркета: касса в телефоне, склад, контроль кассира и QR. Критерии выбора и цена, подключаем за один день.` (<=155)
9. **AEO/GEO:** add FAQ "POS tizimi narxi qancha?" -> answer with BirLiy price (49 000 so'm/oy birinchi 6 oy, keyin 149 000 so'm/oy), and RU "Сколько стоит POS-система?". Strengthens FAQPage schema + AI snippet.
10. **Success metric (14 days):** "pos tizimi" / "POS-система для минимаркета" enters top 20 (from outside 30); champion query holds top 5. Check GSC position + `keyword_ranks`.

---

# PAGE 2: minimarket-uchun-kassa-dasturi-2026 (NEW, P1): kassa dasturi + narx

1. **Slug / pillar:** `minimarket-uchun-kassa-dasturi-2026` (NEW). Pillar: product.
2. **Primary keyword + variants:** uz `kassa dasturi`, `kassa dasturi narxi`, `minimarket uchun kassa dasturi`, `kassa programma`, `do'kon uchun kassa dasturi`; ru sibling `программа для минимаркета`, `программа для минимаркета цена`, `автоматизация минимаркета`. Scope uz+ru+en.
3. **Intent:** commercial + price. Pain: "Kassa dasturi qancha turadi, qaysi biri kichik do'konga arzon va yetarli?"
4. **Canonical decision:** NEW. Anti-cannibalization: primary "kassa dasturi" is segment-qualified (minimarket uchun), DISTINCT from "POS tizimi" (Page 1) and from the head term. Price intent ("narxi") is folded into THIS page as a dedicated narx H2 + FAQ rather than a separate URL, per the one-page-per-primary rule and the map's price-as-FAQ guidance. If GSC later shows "kassa dasturi narxi" as a distinct uncovered query with volume, split it then.
5. **Evidence:** "kassa dasturi" owned by moysklad.uz, "kassa dasturi narxi" by tovar.uz, we are outside top 30 (no dedicated page). Thin, beatable local SERP. Source: report 20.06.
6. **Outline:** H1 "Minimarket uchun kassa dasturi: narx va tanlov (2026)". H2s: "Kassa dasturi nima va do'konga nima beradi", "Kassa dasturi narxi: nimaga to'laysiz va yashirin to'lov bormi" (BirLiy: 49 000 so'm/oy birinchi 6 oy, keyin 149 000 so'm/oy, to'liq funksiya, yashirin to'lovsiz), "Telefonda kassa: uskuna shartmi", "Kassa dasturini tanlashda 7 savol" (champion checklist), "Tez-tez beriladigan savollar". Keyword in first paragraph.
7. **Internal links:** up to sub-pillar `pos-tizimi-uzbekistan-minimarket` and HUB `magazin-uchun-dastur-telefonda-savdo`; sideways to `kassa-apparatsiz-savdo` and finance `qarz-daftar-orniga-nima`; to landing birliy.uz.
8. **Meta (proposed):**
   - UZ title: `Kassa dasturi minimarket uchun: narx va tanlov 2026` (51)
   - UZ desc: `Minimarket uchun kassa dasturi: narxi, telefonda kassa, ombor va qarz. BirLiy 49 000 so'm/oy birinchi 6 oy, bir kunda ulaymiz.` (<=155)
   - RU title: `Программа для минимаркета в Узбекистане: цена 2026` (49)
   - RU desc: `Программа для минимаркета: цена, касса в телефоне, склад и долги. BirLiy 49 000 сум/мес первые 6 месяцев, подключаем за день.` (<=155)
   - EN title: `Cash register app for a minimarket in Uzbekistan 2026` (53)
9. **AEO/GEO:** Q/A "Kassa dasturi narxi qancha?" / "Сколько стоит программа для минимаркета?" answered with the canonical price, plus "Eng arzon kassa dasturi qaysi?" framed honestly (price + what is included). Add to llms-full.txt pricing block on next refresh.
10. **Success metric (21 days, new page):** indexed within 7 days; "kassa dasturi" / "программа для минимаркета" into top 30 then top 20; "kassa dasturi narxi" appears for the page. Check GSC indexation + position.

---

# PAGE 3: qarz-daftar-orniga-nima (LIVE-UPGRADE): qarz daftar + nasiya savdo

1. **Slug / pillar:** `qarz-daftar-orniga-nima` (live). Pillar: finance-for-shops.
2. **Primary keyword + variants:** uz `qarz daftar`, `nasiya savdo`, `nasiya daftar`, `qarz daftari`, `nasiyani telefonda yuritish`; ru `долговая тетрадь`, `учёт долгов покупателей`, `насия`. Scope uz+ru+en.
3. **Intent:** informational -> commercial. Pain: "Qarz daftarini tashlab, nasiyani telefonda kim qancha qarz, qachon to'layman deganini qanday yuritaman?"
4. **Canonical decision:** LIVE-UPGRADE. Anti-cannibalization: ONE qarz page. "nasiya savdo" is added as an H2 + FAQ on THIS page, not a new article (map rule 4).
5. **Evidence:** "qarz daftar" owned by pdaftar.uz, "nasiya savdo" by m.olx.uz; we are outside top 30. Live post already owns "o'rniga nima / чем заменить", so deepening to also own the head term is low-risk. Source: report 20.06.
6. **Outline (additions):** keep H1 with "qarz daftar". Add H2 "Nasiya savdo: do'konda qarzga sotishni qanday yuritish kerak", H2 "Qarz daftarini telefonda yuritish: kim qancha qarz", H2 "Nasiya eslatmasi: to'lov muddatini esga solish", H2 "Tez-tez beriladigan savollar". Keyword "nasiya savdo" natural in a new opening paragraph of that H2.
7. **Internal links:** to product `magazin-uchun-dastur-telefonda-savdo` (HUB) and `pos-tizimi-uzbekistan-minimarket` (anchor "kassa va qarz bitta dasturda"); to `uchet-v-tetradi-skolko-teryaet-magazin`; to landing birliy.uz. This wires finance -> product cluster.
8. **Meta (proposed):**
   - UZ title: `Qarz daftar va nasiya savdo: telefonda yuritish` (47)
   - UZ desc: `Qarz daftar o'rniga nasiya savdoni telefonda yuriting: kim qancha qarz, to'lov muddati eslatmasi. Bumaga daftarsiz, BirLiyda.` (<=155)
   - RU title: `Долговая тетрадь: учёт долгов и насия в телефоне` (48)
   - RU desc: `Замените долговую тетрадь: ведите долги покупателей и насия в телефоне, видно кто сколько должен и срок оплаты. BirLiy.` (<=155)
9. **AEO/GEO:** Q/A "Nasiya savdoni qanday yuritish kerak?" / "Как вести продажи в долг (насия)?" and "Qarz daftarini nima bilan almashtirish mumkin?". Reinforces existing FAQPage.
10. **Success metric (14 days):** "qarz daftar" and "nasiya savdo" into top 20; finance cluster impressions up WoW. Check `keyword_ranks` + GSC finance-cluster.

---

# PAGE 4: kak-vybrat-kassu-dlya-magazina (LIVE-UPGRADE): программа для кассы + касса для магазина

1. **Slug / pillar:** `kak-vybrat-kassu-dlya-magazina` (live). Pillar: product.
2. **Primary keyword + variants:** ru `касса для магазина`, `программа для кассы`, `кассовая программа для магазина`, `касса в телефоне`, `касса для магазина цена`; uz sibling `do'kon uchun kassa dasturini tanlash`. Scope ru primary (+uz+en).
3. **Intent:** commercial-investigational. Pain: "Какую кассу / программу для кассы выбрать для маленького магазина и не переплатить."
4. **Canonical decision:** LIVE-UPGRADE. Anti-cannibalization: keeps decision/comparison intent ("как выбрать"); distinct from `pos-tizimi` (POS-система) and from the new program page (программа для минимаркета). Title shifts to lead with "касса для магазина" but page stays the comparison page. UZ-axis: this page's UZ sibling holds the choose / compare intent `kassa dasturini qanday tanlash` only. Page 2 (`minimarket-uchun-kassa-dasturi-2026`) owns the bare `kassa dasturi`. Keep Page 4 UZ H1 as "Do'kon uchun kassa dasturini qanday tanlash kerak" and do NOT add a UZ H2 with the bare `kassa dasturi`. If GSC shows UZ competition, merge Page 4 UZ occurrences into Page 2.
5. **Evidence:** "программа для кассы" owned by ususoft.uz, "касса для магазина" by m.olx.uz; we are outside top 30. Source: report 20.06.
6. **Outline (additions):** H1 to lead with "Касса для магазина". Add H2 "Программа для кассы: что должна уметь", H2 "Касса для магазина: цена и что входит" (BirLiy 49 000 сум/мес первые 6 мес, затем 149 000 сум/мес), keep the comparison/checklist H2s, add H2 "Частые вопросы". Keyword in first paragraph.
7. **Internal links:** to `pos-tizimi-uzbekistan-minimarket` (sub-pillar) and HUB; to `skladskoy-uchet-v-malenkom-magazine`; to finance `qarz-daftar-orniga-nima` (anchor "долги и насия"); to landing birliy.uz.
8. **Meta (proposed):**
   - RU title: `Касса для магазина: какую программу выбрать (2026)` (50)
   - RU desc: `Касса для магазина: как выбрать программу для кассы, что входит и цена. Касса, склад и долги в телефоне. BirLiy, подключаем за день.` (<=155)
   - UZ title (sibling, keep): `Do'kon uchun kassa dasturini qanday tanlash kerak (2026)`
9. **AEO/GEO:** Q/A "Какая программа для кассы лучше для маленького магазина?" and "Сколько стоит касса для магазина?" with the canonical price.
10. **Success metric (14 days):** "касса для магазина" and "программа для кассы" into top 20. Check `keyword_ranks` + GSC ru.

---

# PAGE 5: skladskoy-uchet-v-malenkom-magazine (LIVE-UPGRADE): складская программа узбекистан

1. **Slug / pillar:** `skladskoy-uchet-v-malenkom-magazine` (live). Pillar: product.
2. **Primary keyword + variants:** ru `складская программа узбекистан`, `складской учёт в магазине`, `программа складского учёта`, `учёт остатков в магазине`, `учёт товара в магазине`; uz sibling `do'konda ombor hisobi`. Scope ru primary (+uz+en).
3. **Intent:** informational -> commercial. Pain: "Нужна складская программа, чтобы остатки не терялись и было видно что заканчивается."
4. **Canonical decision:** LIVE-UPGRADE. Anti-cannibalization: page owns "складской учёт"; "складская программа узбекистан" is a close synonym added to the same page (title + H2), not a new URL.
5. **Evidence:** "складская программа узбекистан" owned by moysklad.uz; we are outside top 30. Source: report 20.06.
6. **Outline (additions):** H1 to lead with "Складская программа". Add H2 "Складская программа для магазина в Узбекистане: что важно", H2 "Импорт товаров из Excel и база товаров" (9 000+ товаров в базе BirLiy), keep step-by-step H2s, add H2 "Частые вопросы". Keyword in first paragraph.
7. **Internal links:** to `pos-tizimi-uzbekistan-minimarket` and HUB; to `kak-vybrat-kassu-dlya-magazina`; to finance `qarz-daftar-orniga-nima`; to landing birliy.uz.
8. **Meta (proposed):**
   - RU title: `Складская программа для магазина в Узбекистане 2026` (51)
   - RU desc: `Складская программа для магазина в Узбекистане: учёт остатков и товаров в телефоне, импорт из Excel. Остатки не теряются. BirLiy.` (<=155)
   - UZ title (sibling, keep): `Do'konda ombor hisobi: yangi boshlovchilar uchun qo'llanma`
9. **AEO/GEO:** Q/A "Какая складская программа подходит маленькому магазину в Узбекистане?" and "Как вести учёт остатков в магазине?".
10. **Success metric (14 days):** "складская программа узбекистан" into top 20; складская/учёт cluster impressions up WoW. Check `keyword_ranks` + GSC ru.

---

# Pillar wiring note (apply across all pages)
- `magazin-uchun-dastur-telefonda-savdo` = top head-term HUB. Every page above links UP to it; on its next edit it links DOWN to Pages 1, 2, 3.
- `pos-tizimi-uzbekistan-minimarket` = POS/kassa SEGMENT sub-pillar. Pages 2 and 4 link up to it.
- Finance <-> product cross-link: Page 3 (qarz/nasiya) links to Pages 1, 2; Pages 1, 2, 4, 5 each carry one link to Page 3. This is the cluster the report says is most underserved and most winnable.

# Blog Writer handoff notes (from Gate 1 review)
- EN parity: for EVERY page above, output an EN title <=60 and EN desc <=155 (this spec gives EN title only for Page 2). Without it the uz/ru/en parity provisions slip at the output.
- Page 4: when the RU H1 leads with "Касса для магазина", keep the EN sibling ("How to Choose a POS System...") and the UZ sibling on their own intent. Do NOT pull "POS" back into the RU page, so Page 1 (`pos-tizimi`) stays unchallenged.
- Pages 1, 3, 4, 5 are edits to LIVE posts. On output the Writer must ship a clean `npm run lint:copy` and green `blog-seo.test.ts`, `blog-category.test.ts`, `blog-image.test.ts`. Categories stay product / ai-tech / football, no new enum.

# Guardrails carried (QA will check)
No parent bank named or implied, no bank anywhere. Zero em-dash (and en-dash/lookalikes). Currency: сум in RU/Cyrillic, so'm in Latin UZ, never UZS, never comma-thousands. Canonical price 49 000 / 149 000 only. uz/ru/en parity + hreflang. No AI-slop. Segments: shops/minimarkets/grocery/pharmacy/service only, no cafe. No unverified legal/QR-mandate claims (terminalsiz-qr-tolov stays GATED, not in this batch).
