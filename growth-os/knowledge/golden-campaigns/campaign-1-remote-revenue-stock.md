# Golden Campaign 1: Remote control of revenue and stock

A reference campaign for the BirLiy CMO. It is fully written, fact-grounded, and QA-clean, so it doubles as a worked example of how every future campaign should look: one segment, one promise, native RU and UZ, only approved facts, one approved CTA, zero em-dash, no bank, no UZS.

Theme: remote control of revenue and stock.
Target segment: minimarket owner who is often away from the counter.

All public copy below obeys the hard rules. Each factual line carries its APPROVED_FACTS id inline. needs_confirmation facts are qualified ("на старте", "в раннем доступе", "обычно" / "startda", "erta kirishda", "odatda"). No prohibited demo number, no "real shops already working", no testimonial, no deadline beyond early access 2026.

---

## 1. Campaign strategy

Brand principle running through every piece: "Меньше частей. Больше ясности." / "Kamroq qism. Ko'proq aniqlik."

The single idea of this campaign: a minimarket owner does not have to stand at the counter to know what is happening with money and stock. The phone shows the shop.

Why this theme for this segment:
- A minimarket has hundreds of items and usually more than one cashier, so the owner cannot personally ring up every sale. They are running to suppliers, opening a second point, or simply at home in the evening.
- Their real daily fear is not "I need software". It is "while I am away, do I actually know what is selling, what is running low, and who is on shift?".
- BirLiy answers exactly that, with verified capabilities: the owner sees revenue, stock, who is on shift and the latest sales from the phone (`fact_owner_remote`); reports show revenue for the day, average check and top products (`fact_reporting`); stock updates itself after each sale and the system warns when an item runs low (`fact_stock_auto_low_alert`); each cashier logs in by PIN and the action log records what was sold, written off and returned (`fact_roles_security`).

Positioning anchor: касса, склад и оплаты в одном приложении на телефоне, сделано для Узбекистана (`fact_positioning`, `fact_made_for_uzbekistan`). We never expand "сделано для Узбекистана" to name any company.

Persuasion approach (from BRAND_VOICE section 7): problem-recognition first, one concrete benefit tied to the owner's control, honest about stage (`fact_stage_early_access`). No fake scarcity. The offer is mentioned only where it belongs (the offer post), framed as the first-cohort pilot rate (`fact_pricing_promo`, `fact_promo_six_month`).

Channel role (from `marketing/01-strategy.md` section 6): Telegram is the conversion channel where the audience reads the full text, so the two example posts are Telegram posts ending in the lowest-friction CTA "Написать в Telegram". The blog outline builds organic and AI-discovery reach around the same intent and routes to a request.

Content pillar used: pillar 3, "Свобода собственника / Egasi erkinligi" (the owner sees everything from the phone), with pillar 5 (trust: PIN and action log) supporting it.

What this campaign deliberately does NOT do:
- It does not promise a revenue lift, a time-saving percentage, or any merchant result (none are approved).
- It does not show the demo dashboard figures (3 450 000, 87 000, 42, +12%, 18) as real (`fact_demo_*` are prohibited).
- It does not claim a live customer base or "реальные магазины уже работают" (`fact_real_shops_badge` prohibited).
- It does not turn the action log into a broad "ваши данные полностью защищены" guarantee (`fact_roles_security` condition).

---

## 2. Target segment

Who: the owner of a minimarket in Uzbekistan (Tashkent first), per `fact_icp_segments`. Hundreds of items, one or several cashiers, a normal daily flow of sales.

Their situation:
- They are frequently away from the counter: at suppliers, at the wholesale market, at a second point, or at home in the evening.
- They employ cashiers and cannot watch every sale in person.
- Until now they reconstruct the day from memory, a notebook, and what the cashier tells them.

Their pains (from the pain map and HOOK_BANK):
- "While I am gone, I do not really know today's revenue." (revenue visibility)
- "Stock on the shelf and stock in my head drift apart; recounting eats the evening." (stock loss)
- "I am not behind the counter, so I cannot tell who rang up what." (cashier control)

What moves them: control without being present. Calm, concrete, no pressure. They want to feel that the shop is legible from their phone, in their own language.

Language: bilingual RU and UZ, both native. This is a key campaign, so it ships in both languages.

---

## 3. Telegram post, Russian (real, ready to publish)

Pillar: Свобода собственника (3). Template: telegram_post / owner_freedom. CTA: Написать в Telegram.

```
Вы уехали к поставщику, а магазин работает без вас.

Что там сейчас: какая выручка, что заканчивается, кто на смене?
Раньше это вы узнавали только вечером, со слов кассира.

С BirLiy магазин видно с телефона: выручка за день, остатки, кто на смене и последние продажи.
Остаток обновляется сам после каждой продажи, а когда товар заканчивается, программа подскажет.
Каждый кассир заходит по своему PIN, журнал хранит, что продано, списано и возвращено.

Сейчас открываем ранний доступ для первых магазинов Ташкента. Сделано для Узбекистана.

Написать в Telegram: +998 97 421 24 54
```

Facts behind each line:
- "магазин видно с телефона: выручка за день, остатки, кто на смене и последние продажи" -> `fact_owner_remote` (verified), `fact_reporting` (verified for day revenue, average check, top products).
- "Остаток обновляется сам после каждой продажи, а когда товар заканчивается, программа подскажет" -> `fact_stock_auto_low_alert` (verified).
- "Каждый кассир заходит по своему PIN, журнал хранит, что продано, списано и возвращено" -> `fact_roles_security` (verified; stated as mechanics, not a broad data-protection guarantee).
- "ранний доступ для первых магазинов Ташкента" -> `fact_stage_early_access` (verified).
- "Сделано для Узбекистана" -> `fact_made_for_uzbekistan` (verified; not expanded).
- CTA phone -> `fact_contacts` (verified).

---

## 4. Telegram post, Uzbek (real, native mirror, equivalent meaning)

Pillar: Egasi erkinligi (3). Same idea and same fact set as the RU post, rebuilt in natural Tashkent-shopkeeper Uzbek (not a transliteration). CTA: Telegramga yozish.

```
Siz yetkazib beruvchining oldiga ketdingiz, do'kon esa siz yo'qligingizda ishlayapti.

Hozir u yerda nima bo'lyapti: tushum qancha, nima tugayapti, kim smenada?
Avval buni faqat kechqurun, kassirning gapidan bilardingiz.

BirLiy bilan do'kon telefonda ko'rinadi: kunlik tushum, qoldiqlar, kim smenada va oxirgi sotuvlar.
Qoldiq har bir sotuvdan keyin o'zi yangilanadi, tovar tugayotganini tizim oldindan eslatadi.
Har bir kassir o'z PIN'i bilan kiradi, jurnal nima sotilgani, hisobdan chiqarilgani va qaytarilganini saqlaydi.

Hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz. O'zbekiston uchun yaratilgan.

Telegramga yozing: +998 97 421 24 54
```

Facts behind each line (same ids as RU, native UZ wording from APPROVED_FACTS safe_public_wording_uz):
- "do'kon telefonda ko'rinadi: kunlik tushum, qoldiqlar, kim smenada va oxirgi sotuvlar" -> `fact_owner_remote`, `fact_reporting`.
- "Qoldiq har bir sotuvdan keyin o'zi yangilanadi, tovar tugayotganini tizim oldindan eslatadi" -> `fact_stock_auto_low_alert`.
- "Har bir kassir o'z PIN'i bilan kiradi, jurnal ... saqlaydi" -> `fact_roles_security`.
- "Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz" -> `fact_stage_early_access`.
- "O'zbekiston uchun yaratilgan" -> `fact_made_for_uzbekistan`.
- CTA phone -> `fact_contacts`.

Parity check (BRAND_VOICE section 15): same fact ids, same claim strength, same CTA action (Telegram), currency words not needed in either post (no price quoted here), neither reads as a translation of the other. Pass.

---

## 5. Blog outline (RU / UZ / EN)

Template: seo_blog_article. Pillar: owner freedom + revenue/stock visibility. One primary CTA at the close: Оставить заявку (birliy.uz #lead), because this is a product-intent article.

Primary keyword:
- RU: "как следить за магазином с телефона"
- UZ: "do'konni telefondan kuzatish"
- EN: "watch your shop from your phone"

Search intent: an owner who is often away wants to know whether they can see revenue, stock and cashiers remotely, and how.

ICP pain resolved: revenue visibility + stock loss + cashier control for an owner away from the counter.

The three language versions are equivalent in meaning and structure, each native (UZ and EN are not literal rebuilds of RU). Currency, where it appears at all, is сум in RU and so'm in UZ; the EN version writes the bare number without UZS.

### Shared outline (applied to all three languages)

- H1: the primary keyword phrased as the owner would say it.
  - RU: "Как видеть выручку и остатки магазина с телефона, когда вас нет на месте"
  - UZ: "Joyda bo'lmaganingizda do'kon tushumi va qoldiqlarini telefondan qanday ko'rish mumkin"
  - EN: "How to see your shop's revenue and stock from your phone when you are away"

- Intro: name the situation in the owner's words (you left for a supplier, the shop runs without you, in the evening you reconstruct the day from memory). Promise a plain answer. No invented numbers. Backed by `fact_owner_remote`.

- H2: "Что вообще можно увидеть с телефона" / "Telefondan nimani ko'rish mumkin" / "What you can actually see from the phone"
  - Revenue for the day, who is on shift, the latest sales. Tied to `fact_owner_remote` and `fact_reporting` (day revenue, average check, top products). State week and month reports as v2/early-access wording, not as a hard claim (`fact_reporting` condition).

- H3: "Остатки, которые не надо пересчитывать вечером" / "Kechqurun qayta sanash shart bo'lmagan qoldiqlar" / "Stock you do not have to recount in the evening"
  - Stock updates itself after each sale; the system warns when an item runs low. Tied to `fact_stock_auto_low_alert` and `fact_catalog_stock`.

- H3: "Кто и что пробил, пока вас не было" / "Siz yo'qligingizda kim nima urgan" / "Who rang up what while you were away"
  - PIN login per cashier, action log of sales, write-offs and returns, shift log. Tied to `fact_roles_security`. Do not overclaim "данные защищены" as a broad guarantee.

- H2: "Итоги смены и дня приходят сами" / "Smena va kun yakunlari o'zi keladi" / "Shift and day summaries arrive on their own"
  - Shift and day summaries arrive in Telegram. Tied to `fact_owner_remote`.

- H2: "Чем это лучше тетради и тяжёлой программы" / "Daftar va og'ir dasturdan nimasi yaxshi" / "Why this beats a notebook or heavy software"
  - Factual comparison only: a notebook or Excel loses balances; 1C is complex and expensive for a small shop; BirLiy works on a phone and combines register, stock, debts and reports in one place. Tied to `fact_competitive_vs_notebook_1c` and `fact_positioning`. No named POS vendor, no disparagement.

- H2: "Сколько это стоит на старте" / "Startda narxi qancha" / "What it costs at the start"
  - First 6 months 49 000 сум/мес, then 149 000 сум/мес, full functionality, no hidden payments, nothing charged without consent. UZ: birinchi 6 oy oyiga 49 000 so'm, keyin 149 000 so'm. EN: first 6 months 49 000 a month, then 149 000. Framed as the first-cohort / early-access rate. Tied to `fact_pricing_promo`, `fact_promo_six_month` (needs_confirmation, qualified).

- FAQ block (AEO, 3 questions, answers grounded in facts):
  1. "Нужен ли компьютер, чтобы следить за магазином удалённо?" -> No, a smartphone is enough on the start (`fact_equipment_phone_only`).
  2. "А если в магазине пропадёт интернет?" -> The app works offline; sales are saved locally and sync when the connection returns (`fact_offline`).
  3. "Сколько кассиров можно завести?" -> During early access the number of cashiers is unlimited, each logs in by PIN; always state the early-access condition (`fact_unlimited_cashiers_early`, qualified; `fact_roles_security`).
  (UZ and EN mirror the same three Q&A natively.)

- Closing CTA section: invite a pilot conversation. Single CTA.
  - RU: "Оставить заявку: birliy.uz"
  - UZ: "Ariza qoldiring: birliy.uz"
  - EN: keep the same approved action; route to "Оставить заявку" on birliy.uz (the site form).

Internal links: to the existing blog posts on stock-from-the-phone and notebook-vs-app, and to the landing #lead block.

Allowed-facts list for the writer: `fact_owner_remote`, `fact_reporting` (qualify week/month), `fact_stock_auto_low_alert`, `fact_catalog_stock`, `fact_roles_security`, `fact_offline`, `fact_equipment_phone_only`, `fact_unlimited_cashiers_early` (qualify), `fact_competitive_vs_notebook_1c`, `fact_positioning`, `fact_pricing_promo` + `fact_promo_six_month` (qualify), `fact_made_for_uzbekistan`, `fact_stage_early_access`, `fact_contacts`.

Do-not-use list (prohibited): demo dashboard numbers (`fact_demo_revenue`, `fact_demo_avg_check`, `fact_demo_sales_delta`, `fact_demo_stock`, `fact_demo_cashiers_returns`), the sample receipt (`fact_demo_receipt`), "реальные магазины уже работают" (`fact_real_shops_badge`), any bank name, any deadline beyond early access 2026, any result percentage or customer count.

---

## 6. QA report (QA_RULES run mentally)

Artifact scope checked: the two Telegram posts (RU, UZ) and the blog outline copy lines above. Verdict logic: PASS only if zero blocking rules fire.

### Blocking checks (all PASS)

- B01 forbidden company / bank mention: PASS. No bank, no Ipak Yuli, no processor, no parent company. Only "Сделано для Узбекистана" / "O'zbekiston uchun yaratilgan", not expanded.
- B02 unsupported factual claim: PASS. Every product line traces to an approved fact id (see sections 3, 4, 5). Only approved numbers appear: 49 000, 149 000, 6, the phone +998 97 421 24 54, 2026. No off-allowlist quantity or percentage.
- B03 fabricated result or metric: PASS. No demo token (3 450 000, 87 000, 42, +12%, 20 500, 14 000, 18, 3 cashiers, 2 returns). No revenue/profit/time-saving %, no shop/customer count, no "реальные магазины уже работают".
- B04 missing required language: PASS. This key campaign ships RU and UZ; both bodies are present, non-empty, native, and not duplicates. EN is provided in the blog outline as an additional non-required language.
- B05 em-dash character: PASS. Scanned both posts and all outline copy lines for U+2014 / U+2013 / U+2015. None present. Only the hyphen-minus is used.
- B06 forbidden currency notation: PASS. No "UZS". The blog outline uses сум in RU and so'm in UZ, with a space thousands separator (49 000, 149 000); EN uses the bare number. No cross-script contamination.
- B07 unqualified needs_confirmation claim: PASS. Pricing (`fact_pricing_promo`, `fact_promo_six_month`) is framed as the start / first-cohort rate. Week/month reporting (`fact_reporting`) and unlimited cashiers (`fact_unlimited_cashiers_early`) are qualified as v2 / early-access. No guarantee word ("гарантируем", "всегда", "мгновенно", "kafolat") attached to any needs_confirmation fact. The Telegram posts use only verified facts plus the qualified early-access stage line.
- B08 fabricated testimonial: PASS. No quote, no named customer, no anonymous endorsement. The voice is BirLiy's own calm narration to the owner.
- B09 fabricated deadline or roadmap-as-done: PASS. Only "ранний доступ ... для первых магазинов Ташкента" / "erta kirishni ochmoqdamiz". No date, no countdown, no planned feature stated as shipped.
- B10 empty or placeholder artifact: PASS. Full real copy, no TODO, no unfilled bracket slots.
- B11 missing required CTA: PASS. Each Telegram post ends with exactly one approved CTA ("Написать в Telegram: +998 97 421 24 54" / "Telegramga yozing: +998 97 421 24 54"); the blog outline closes with exactly one ("Оставить заявку: birliy.uz" / "Ariza qoldiring: birliy.uz"). One CTA per piece, on its own line, no non-approved call to action.

### Warning checks (all PASS, none fire)

- W01 generic AI language: PASS. No "в современном мире", no "мы рады представить", no buzzword closer. Opens on the owner's real situation.
- W02 paragraph too long: PASS. Short lines, one thought per line, line breaks for white space; no sentence over 22 words.
- W03 vague benefit: PASS. Benefits are concrete and anchored to trade nouns (выручка, остатки, смена, кассир / tushum, qoldiq, smena, kassir), each tied to a fact id. No bare "удобно и эффективно".
- W04 excessive jargon: PASS. Kitchen-table vocabulary; no "апп", "репорт", "SaaS", "UX". "Функционал" appears only inside the approved price line in the blog outline.
- W05 weak hook: PASS. RU hook "Вы уехали к поставщику, а магазин работает без вас." and UZ hook "Siz yetkazib beruvchining oldiga ketdingiz, do'kon esa siz yo'qligingizda ishlayapti." name a concrete situation, under 14 words at the lead, not a label or a stakeless question.
- W06 literal translation: PASS. UZ is rebuilt in native word order and idiom (yetkazib beruvchining oldiga ketdingiz; kassirning gapidan bilardingiz), reusing safe_public_wording_uz, not a calque of RU. No RU loanword (магазин, выручка, остаток) inside the UZ block.
- W07 duplicated meaning: PASS. One idea per piece (the shop is legible from the phone). No triad adjective padding, no restated benefit.
- W08 inconsistent product terminology: PASS. Canonical terms only (касса, склад, остатки, выручка, смена, чек / kassa, ombor, qoldiq, tushum, smena, chek). Brand spelled "BirLiy".
- W09 aggressive or misleading persuasion: PASS. No fake scarcity, no superlative, no hype word, no caps-lock, no emoji wall (zero emoji used). Calm confidence; the offer is stated plainly only in the blog outline.

Verdict: PASS / CLEAN. Zero blocking, zero warning. Publishable.

---

## 7. Exact factual claims used (with APPROVED_FACTS ids)

Verified facts (reusable as public product copy):
- `fact_owner_remote`: the owner sees the shop from the phone (revenue, stock, who is on shift, the latest sales); shift and day summaries arrive in Telegram.
- `fact_reporting`: reports show revenue for the day, average check and top products. (Week/month-with-delta range qualified as v2 / early-access in the blog outline.)
- `fact_stock_auto_low_alert`: stock updates itself after each sale; the system warns when an item runs low.
- `fact_catalog_stock`: catalog and stock (goods, categories, piece and weight items, balances and write-offs). [blog outline]
- `fact_roles_security`: roles Owner / Cashier / Superadmin, PIN login per cashier, full action log and shift log. (Not turned into a broad "данные защищены" guarantee.)
- `fact_offline`: the app works offline; sales are saved locally and sync when the connection returns. [blog FAQ]
- `fact_equipment_phone_only`: you can start with just a smartphone, no computer needed. [blog FAQ]
- `fact_competitive_vs_notebook_1c`: works on a phone, understandable without training, combines register/stock/debts/reports in one place; a notebook or Excel loses balances; 1C is complex and expensive for a small shop. [blog outline]
- `fact_positioning`: касса, склад и оплаты в одном приложении на телефоне.
- `fact_made_for_uzbekistan`: "Сделано для Узбекистана" / "O'zbekiston uchun yaratilgan" (never expanded).
- `fact_stage_early_access`: early access 2026, first cohort of pilots, Tashkent first.
- `fact_contacts`: phone +998 97 421 24 54 (CTA destination); support @birliy_support_bot, channel @bir_liy.

needs_confirmation facts (qualified everywhere they appear):
- `fact_pricing_promo` and `fact_promo_six_month`: first 6 months 49 000 сум/мес (so'm/oy), then 149 000, full functionality, no hidden payments, framed as the first-cohort / early-access rate. [blog outline only]
- `fact_unlimited_cashiers_early`: unlimited cashiers during early access, each by PIN; the early-access condition is always stated. [blog FAQ]
- `fact_reporting` week/month range: qualified as v2 / early-access wording, not a hard claim. [blog outline]

prohibited facts (explicitly NOT used as real anywhere): `fact_demo_revenue`, `fact_demo_avg_check`, `fact_demo_sales_delta`, `fact_demo_stock`, `fact_demo_cashiers_returns`, `fact_demo_receipt`, `fact_real_shops_badge`.

---

## 8. Assumptions made

- The minimarket segment and its "owner often away from the counter" framing are drawn from `fact_icp_segments` (minimarket is a stated secondary segment) plus the revenue-visibility, stock-loss and cashier-control pains in HOOK_BANK and COMPANY_CONTEXT. The "often away" detail is a reasonable, non-factual narrative frame for the segment; it makes no product claim and asserts no result.
- Both Telegram posts are written with no emoji. The brand allows 1 to 2 soft emoji, but zero is on-brand for a calm owner-freedom post and keeps the QA cleanest.
- The two example posts deliberately quote no price, so they rely only on verified facts plus the qualified early-access stage line; the price (needs_confirmation) is placed in the blog outline where it can be framed as the first-cohort rate.
- For the blog, the keyword phrasing is a plausible RU/UZ/EN query for this intent; exact search volumes are not asserted (none are in source). Treated as observed intent, not invented SERP data.
- The blog "week and month" reporting and "unlimited cashiers" lines are kept as qualified early-access wording per their needs_confirmation status, since the source marks the wider reporting range as v2 keys unused by the current UI.
- ContentObject mapping below is the expected metadata shape for ingesting this campaign; it is illustrative of the schema, not a live database record.

---

## 9. CTA used (one of the two approved)

- Telegram posts (RU and UZ): "Написать в Telegram" -> +998 97 421 24 54 / "Telegramga yozish" -> +998 97 421 24 54. Source: `fact_contacts`, BRAND_VOICE section 9. Lowest-friction action, correct for Telegram conversion posts.
- Blog outline (RU / UZ / EN): "Оставить заявку" -> birliy.uz (#lead) / "Ariza qoldiring" -> birliy.uz. Source: `fact_lead_form_docs`, BRAND_VOICE section 9. Correct for a product-intent article.

Each piece carries exactly one approved CTA on its own closing line.

---

## 10. Expected ContentObject metadata (shape aligned to lib/content-objects.ts)

This is how the campaign maps onto the ContentObject model in `lib/content-objects.ts` and `lib/db/schema.ts`, validated against `lib/validators/content-object.ts`. Field names, the platform enum (`blog`, `telegram`, `instagram`, `linkedin`, `tiktok`, `pinterest`), and the status enum (`draft`, `generating`, `pending_approval`, `publishing`, `staged`, `approved`, `rejected`, `published`, `failed`) match the schema. `metadata` is a free-form `Record<string, unknown>`, so the fact ids and QA verdict are carried there. The campaign produces three drafts (one per language deliverable) under one ContentObject.

```json
{
  "campaign_id": "campaign-1-remote-revenue-stock",
  "brief": "Remote control of revenue and stock for a minimarket owner who is often away from the counter. Pillar: owner freedom. RU + UZ Telegram posts and an RU/UZ/EN blog outline. Only approved facts, one approved CTA per piece.",
  "status": "pending_approval",
  "platforms": ["telegram", "blog"],
  "source": "golden-campaign",
  "drafts": [
    {
      "version": 1,
      "platform": "telegram",
      "format": "telegram_text",
      "created_at": "2026-06-23T00:00:00.000Z",
      "text": "Вы уехали к поставщику, а магазин работает без вас. ... Написать в Telegram: +998 97 421 24 54",
      "metadata": {
        "locale": "ru",
        "pillar": "owner_freedom",
        "segment": "minimarket",
        "theme": "remote-revenue-stock",
        "cta": "write_telegram",
        "cta_destination": "+998 97 421 24 54",
        "fact_ids": [
          "fact_owner_remote",
          "fact_reporting",
          "fact_stock_auto_low_alert",
          "fact_roles_security",
          "fact_stage_early_access",
          "fact_made_for_uzbekistan",
          "fact_contacts"
        ],
        "qa_verdict": "PASS",
        "languages": ["ru"]
      }
    },
    {
      "version": 1,
      "platform": "telegram",
      "format": "telegram_text",
      "created_at": "2026-06-23T00:00:00.000Z",
      "text": "Siz yetkazib beruvchining oldiga ketdingiz, do'kon esa siz yo'qligingizda ishlayapti. ... Telegramga yozing: +998 97 421 24 54",
      "metadata": {
        "locale": "uz",
        "pillar": "owner_freedom",
        "segment": "minimarket",
        "theme": "remote-revenue-stock",
        "cta": "write_telegram",
        "cta_destination": "+998 97 421 24 54",
        "fact_ids": [
          "fact_owner_remote",
          "fact_reporting",
          "fact_stock_auto_low_alert",
          "fact_roles_security",
          "fact_stage_early_access",
          "fact_made_for_uzbekistan",
          "fact_contacts"
        ],
        "qa_verdict": "PASS",
        "languages": ["uz"]
      }
    },
    {
      "version": 1,
      "platform": "blog",
      "format": "blog_outline",
      "created_at": "2026-06-23T00:00:00.000Z",
      "text": "H1 (ru/uz/en) ... FAQ ... CTA: Оставить заявку: birliy.uz / Ariza qoldiring: birliy.uz",
      "metadata": {
        "locale": "ru",
        "languages": ["ru", "uz", "en"],
        "doc_type": "seo_blog_outline",
        "pillar": "owner_freedom",
        "segment": "minimarket",
        "theme": "remote-revenue-stock",
        "primary_keyword": {
          "ru": "как следить за магазином с телефона",
          "uz": "do'konni telefondan kuzatish",
          "en": "watch your shop from your phone"
        },
        "cta": "leave_request",
        "cta_destination": "birliy.uz#lead",
        "fact_ids": [
          "fact_owner_remote",
          "fact_reporting",
          "fact_stock_auto_low_alert",
          "fact_catalog_stock",
          "fact_roles_security",
          "fact_offline",
          "fact_equipment_phone_only",
          "fact_unlimited_cashiers_early",
          "fact_competitive_vs_notebook_1c",
          "fact_positioning",
          "fact_pricing_promo",
          "fact_promo_six_month",
          "fact_made_for_uzbekistan",
          "fact_stage_early_access",
          "fact_contacts"
        ],
        "qualified_fact_ids": [
          "fact_pricing_promo",
          "fact_promo_six_month",
          "fact_unlimited_cashiers_early"
        ],
        "prohibited_fact_ids_excluded": [
          "fact_demo_revenue",
          "fact_demo_avg_check",
          "fact_demo_sales_delta",
          "fact_demo_stock",
          "fact_demo_cashiers_returns",
          "fact_demo_receipt",
          "fact_real_shops_badge"
        ],
        "qa_verdict": "PASS"
      }
    }
  ],
  "assets": [],
  "metrics": {}
}
```

Notes on the shape:
- One ContentObject per campaign; the three deliverables are `drafts[]`. The validator (`contentObjectDraftSchema`) requires each draft to have `version`, `platform`, and non-empty `text`; `format` and `metadata` are optional, and `metadata.locale` is read by `draftLocale` / `contentObjectDraftKey` to keep RU and UZ Telegram drafts distinct.
- `platforms` lists the platforms covered (`telegram`, `blog`); per the create validator, if `drafts` are present, every listed platform must have at least one draft, satisfied here.
- The fact ids, QA verdict, CTA, segment, and qualified/prohibited fact lists live inside `metadata` (a free-form record), so the brand's grounding rules travel with the object without changing the schema.
- The `text` fields above are abbreviated with the real opening and the real closing CTA for readability; the full publishable copy is in sections 3, 4, and 5 of this file.
