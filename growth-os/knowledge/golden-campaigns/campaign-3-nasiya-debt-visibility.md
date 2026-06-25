# Golden Campaign 3: Nasiya and debt visibility

A reference, fully-written campaign for the BirLiy CMO. Theme: replacing the paper debt notebook (qarz daftari) with the in-app nasiya ledger. This file is a worked example of how a campaign on a single content pillar is built end to end, so the CMO can copy the structure for future themes. Every public line below obeys the hard rules: no em-dash, no bank or parent company, currency is сум / so'm (never UZS), and every claim traces to an APPROVED_FACTS id or is qualified. Internal headings and labels in this file may use a hyphen for readability; the public copy blocks (the posts, the blog outline, the CTAs) contain zero em-dash characters.

Brand principle running through all of it: "Меньше частей. Больше ясности." / "Kamroq qism. Ko'proq aniqlik."

---

## 1. Campaign strategy

### Why this campaign exists

The single sharpest differentiator for BirLiy's primary ICP is the in-app nasiya (debt) ledger that replaces the paper debt notebook (`fact_nasiya_debt`, `COMPANY_CONTEXT` Primary ICP). A neighbourhood grocery shop that sells on credit lives with one recurring fear: the paper qarz daftari is the only record of who owes what, and the day it is lost, smudged, or argued over, that money is gone. This campaign turns that fear into recognition, then into the calm relief of seeing every debt on the phone.

### Core message (one idea)

Долги покупателей видно в приложении вместо бумажной тетради: кто сколько должен и когда обещал оплатить. The campaign carries this one thought across every piece. One pillar, one idea, one CTA per piece (`BIRLIY_BRAND_VOICE` hard rule 10).

### Content pillar and angle

- Primary pillar: pillar 1, "Боль -> облегчение" / "Og'riq -> yengillik" (`02-content-system.md`).
- Supporting angle on the discovery post and the blog: nasiya sits next to cash, card, and QR in one ledger (`fact_payment_methods`), so selling on credit does not mean the sale falls out of the books.
- Honest-stage framing throughout: early access 2026, first cohort, Tashkent first (`fact_stage_early_access`). No implied customer base.

### Positioning guardrails specific to nasiya

- We never imply the app collects debts, chases customers, or guarantees repayment. It records and shows debt; the owner still does the human part. The hooks deliberately avoid "возврат всех долгов" / "barcha qarzlar qaytishini" (`HOOK_BANK` hook_ru_nasiya_001, hook_uz_nasiya_001 risk notes).
- Per-customer debt limit is NOT claimed. It appears only in blog source, not the landing, so it is owner-confirm (`UNVERIFIED_CLAIMS_REPORT` E4). The blog outline flags it as a question to confirm, never as a shipped feature.
- We never name a bank or payment processor when nasiya sits beside QR (`fact_payment_methods` note, hard rule).
- The pain is described qualitatively only. No invented count of debtors, no sum of debt, no "теряете X% долгов" (`QA_RULES` B03, `TEMPLATE_LIBRARY` pain_to_solution_post failure_conditions).

### Channels and rhythm

This golden campaign produces two ready-to-publish Telegram posts (RU and UZ as native mirrors) plus a tri-lingual blog outline (RU/UZ/EN). It fits the Monday slot of the weekly rhythm (pillar 1 pain-to-relief), with the blog as the evergreen SEO anchor the posts can link to (`02-content-system.md` rhythm; `seo_blog_article` template). Telegram is the default conversion channel; the Telegram CTA is the lowest-barrier action.

### Funnel role

- Top of funnel: the blog article ranks for nasiya / qarz daftari pain queries and answers them plainly (AI-discovery and organic).
- Middle: the Telegram posts catch the owner who already feels the pain and route them to a one-to-one chat.
- Both end in an approved CTA so a request can actually be captured.

### Success signals (no fabricated targets)

We do not invent KPIs or promise numbers. Observable signals the CMO may watch: Telegram replies to the post, lead-form submissions attributed to the nasiya theme, and blog impressions/clicks for the nasiya keyword cluster (these map to the real ContentObjectMetrics fields: leads, gsc_clicks, gsc_impressions, saves, shares, comments). No target figure is asserted as a fact.

---

## 2. Target segment

Primary: the owner of a neighbourhood grocery shop (магазин у дома / oziq-ovqat do'koni, uy yonidagi do'kon) in Uzbekistan, Tashkent first, who sells on credit (nasiya) to regular local customers and tracks those debts in a paper notebook (`fact_icp_segments`, `COMPANY_CONTEXT` Primary ICP and Secondary segments).

Profile of this owner:
- Often the cashier too. Non-technical, busy, practical.
- Keeps the qarz daftari by hand. Knows the regulars by name and face, but the written record is fragile.
- Sells produce and everyday goods, piece and weight items, hundreds of SKU (`fact_catalog_stock`).
- Currently uses a notebook, sometimes Excel, rarely anything heavier. Finds 1C complex and expensive for a small shop (`fact_competitive_vs_notebook_1c`).
- Reads RU and UZ; the UZ version must read like a Tashkent shopkeeper talking, not a translation.

The pain this segment feels (qualitatively, no numbers):
- The debt record lives in one fragile place. Lose the page, lose the proof.
- At the end of the month it is hard to see who still owes and who promised to pay when.
- A debt sale and a cash sale are recorded in different places, so the evening reconciliation never quite matches.

What this segment is NOT promised:
- That the app will recover the money.
- A debt limit per customer (owner-confirm, not claimed).
- Any result, percentage, or count.

---

## 3. RU Telegram post (ready to publish)

Pillar 1 (Боль -> облегчение). Template: pain_to_solution_post. Facts: `fact_nasiya_debt` (relief, verified), `fact_payment_methods` (nasiya in one ledger, verified), `fact_stage_early_access` (honest stage, verified). CTA: Написать в Telegram (`fact_contacts`).

```
Долговая тетрадь знает всё: кто взял в долг, сколько и когда обещал вернуть.
А если страница потерялась, спорить уже не с чем.

В BirLiy долги покупателей видно в приложении вместо тетради.
Кто сколько должен и когда обещал оплатить, всё в одном списке.

В долг учитывается рядом с наличными, картой и QR, в одном учёте.
Вечером цифры сходятся, тетрадь не нужна.

Сейчас открываем ранний доступ для первых магазинов Ташкента.

Написать в Telegram: +998 97 421 24 54
```

Notes for the CMO: 6 short lines plus CTA, calm rhythm, one idea (nasiya in the app). No invented numbers. "Вечером цифры сходятся" echoes `fact_positioning` without quoting any demo figure. Zero em-dash; «вы» tone implicit; currency word not needed here so none used.

---

## 4. UZ Telegram post (ready to publish, native mirror)

Same meaning as the RU post, rebuilt in natural Tashkent-shopkeeper Uzbek (not a transliteration), per `BIRLIY_BRAND_VOICE` section 15 and the `safe_public_wording_uz` of the cited facts. Facts: `fact_nasiya_debt`, `fact_payment_methods`, `fact_stage_early_access`. CTA: Telegramga yozish (`fact_contacts`).

```
Qarz daftari hammasini biladi: kim nasiyaga oldi, qancha va qachon qaytarishni va'da qilgan.
Sahifa yo'qolsa esa, endi bahslashishga hujjat qolmaydi.

BirLiy'da xaridorlar nasiyasi daftar o'rniga ilovada ko'rinadi.
Kim qancha qarz va qachon to'lashni va'da qilgani, hammasi bitta ro'yxatda.

Nasiya naqd, karta va QR bilan bir qatorda, bitta hisobda turadi.
Kechqurun raqamlar to'g'ri keladi, daftar kerak emas.

Hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz.

Telegramga yozing: +998 97 421 24 54
```

Notes for the CMO: native verbs (oldi, qaytarishni va'da qilgan, to'g'ri keladi), trade words (nasiya, qarz daftari, naqd, QR). Same fact ids, same claim strength, same CTA action as RU. Currency word not used in either post, so no сум/so'm cross-contamination risk. Zero em-dash.

---

## 5. Blog outline (RU / UZ / EN)

Template: seo_blog_article. Intent: an owner searching how to stop losing the debt notebook / how to track nasiya without paper. Primary ICP pain: paper debt notebook is fragile and scattered. CTA at the close: Оставить заявку (birliy.uz #lead), product-intent article. Each heading is tagged with the fact ids that back it. Prohibited facts are listed in the do-not-use block so they never leak into the body.

### Keyword and intent

- RU primary: "долги покупателей в магазине как вести" / "учёт долгов в магазине без тетради".
- UZ primary: "do'konda nasiya hisobi" / "qarz daftari o'rniga ilova".
- EN primary (for AI-discovery and the English locale): "track customer debt in a small shop without a paper notebook".
- Search intent: a grocery-shop owner who sells on credit wants a reliable way to see who owes what, without the paper qarz daftari getting lost.

### Shared H2/H3 skeleton (same structure across all three locales, native phrasing per language)

1. H1: the reader's own question.
   - RU: "Как вести долги покупателей в магазине без бумажной тетради"
   - UZ: "Do'konda xaridorlar nasiyasini qog'oz daftarsiz qanday yuritish kerak"
   - EN: "How to track customer debt in a small shop without a paper notebook"
2. Intro: name the pain in the owner's words, promise a plain answer. (pain framing only, no product claim, no numbers)
3. H2: "Почему тетрадь долгов подводит" / "Nima uchun qarz daftari qiynaydi" / "Why the paper debt notebook lets you down". Qualitative pains: one fragile record, hard to see who still owes, debt and cash sales recorded apart. (no figures; backed by the pain map, no product claim here)
4. H2: "Что меняется, когда долги в приложении" / "Qarz ilovada bo'lsa nima o'zgaradi" / "What changes when debt lives in the app". Core relief: who owes how much and when they promised, in one list. (`fact_nasiya_debt`)
5. H3: "Долг рядом с наличными, картой и QR" / "Nasiya naqd, karta va QR bilan bir qatorda" / "Credit sits beside cash, card and QR". One ledger for all four payment methods, no bank named. (`fact_payment_methods`)
6. H3: "Вечером цифры сходятся" / "Kechqurun raqamlar to'g'ri keladi" / "In the evening the numbers reconcile". The single-surface calm, no late-night reconciling. (`fact_positioning`, `fact_single_surface_demo`)
7. H2 (factual comparison, respectful): "Тетрадь, Excel или приложение" / "Daftar, Excel yoki ilova" / "Notebook, Excel or an app". Works on a phone, understandable without training, debts do not get lost; 1C is complex and costly for a small shop. (`fact_competitive_vs_notebook_1c`) No POS vendor named or disparaged (`competitor_comparison_without_defamation`).
8. H2: "Как начать" / "Qanday boshlash" / "How to get started". Phone-only start, hands-on onboarding, honest early-access stage. (`fact_equipment_phone_only`, `fact_onboarding_service`, `fact_stage_early_access`; onboarding timing qualified as typical per `fact_onboarding_one_day`)
9. FAQ block (AEO), 2-4 short Q&A:
   - "Можно ли вести долги без интернета?" -> sales and records work offline and sync later. (`fact_offline`)
   - "Кто увидит долги, кроме меня?" -> roles and PIN login, action log; do not overclaim broad data protection. (`fact_roles_security`, bounded per `UNVERIFIED_CLAIMS_REPORT` F1)
   - "Можно ли поставить лимит долга на покупателя?" -> answer honestly that specifics are confirmed with the team via @birliy_support_bot; do NOT assert a per-customer limit (owner-confirm, `UNVERIFIED_CLAIMS_REPORT` E4).
10. Closing CTA section: one approved CTA.
    - RU: "Оставить заявку: birliy.uz"
    - UZ: "Ariza qoldiring: birliy.uz"
    - EN (routes to the same site action): "Leave a request: birliy.uz"

### Meta description drafts (no em-dash, keyword present)

- RU: "Долги покупателей в магазине без бумажной тетради: кто сколько должен и когда обещал оплатить, видно в приложении BirLiy. Сделано для Узбекистана."
- UZ: "Do'konda xaridorlar nasiyasi qog'oz daftarsiz: kim qancha qarz va qachon to'lashni va'da qilgani BirLiy ilovasida ko'rinadi. O'zbekiston uchun yaratilgan."
- EN: "Track customer debt in a small shop without a paper notebook: who owes how much and when they promised to pay, all in the BirLiy app. Made for Uzbekistan."

### Internal links

- To the related pillar posts on stock and on kassa-without-a-register (the existing 14-article set).
- To the landing #lead block via the CTA.

### Do-not-use block (must NOT appear in any locale of the article)

- Any demo dashboard number: 3 450 000, 87 000, 42 продажи, +12%, 18 шт, 3 кассира, 2 возврата (`fact_demo_*`, prohibited).
- The sample receipt: Milk/Bread/Coffee, 14 000, 20 500 (`fact_demo_receipt`, prohibited).
- "Реальные магазины уже работают" / "Haqiqiy do'konlar allaqachon ishlamoqda" (`fact_real_shops_badge`, prohibited).
- Any count of shops/customers, any debt sum, any repayment % (UNVERIFIED Group H/I).
- A per-customer debt limit stated as shipped (E4, owner-confirm).
- Any bank, processor, or parent-company name.

---

## 6. QA report (QA_RULES run mentally)

Verdict: PASS (zero blocking hits). Result: CLEAN, no warning hits on the public copy. Scope of this QA: the RU post (section 3), the UZ post (section 4), the blog outline public lines and CTAs (section 5). Internal strategy prose and labels are exempt per `QA_RULES` scope_note.

### Blocking rules (all pass)

- B01 forbidden company or bank mention: PASS. No bank, Ipak Yuli, processor, or parent company anywhere. Trust line used is only "ранний доступ для первых магазинов Ташкента" and the blog's "Сделано для Узбекистана" / "O'zbekiston uchun yaratilgan", never expanded.
- B02 unsupported factual claim: PASS. Every claim maps to an id: `fact_nasiya_debt`, `fact_payment_methods`, `fact_stage_early_access`, `fact_positioning`, `fact_single_surface_demo`, `fact_competitive_vs_notebook_1c`, `fact_equipment_phone_only`, `fact_onboarding_service`, `fact_offline`, `fact_roles_security`, `fact_contacts`. No standalone numeric claim except the contact phone (an approved token) and the price line is not used in the posts at all.
- B03 fabricated result or metric: PASS. No demo token, no result %, no shop/customer count, no debt sum, no "real shops" badge. Pain described qualitatively.
- B04 missing required language: PASS. RU and UZ posts are both present, non-empty, native, and not duplicates of each other; the blog outline carries RU/UZ/EN.
- B05 em-dash character: PASS. Scanned all public blocks for U+2014/U+2013/U+2015: zero found. Only the hyphen-minus and colon/comma are used.
- B06 forbidden currency notation: PASS. No "UZS" anywhere. The posts carry no currency figure, so no сум/so'm appears in them and there is no cross-script contamination; the blog body intentionally avoids price figures and routes price questions to the team.
- B07 unqualified needs_confirmation claim: PASS. `fact_payment_methods`, `fact_nasiya_debt`, `fact_positioning`, `fact_offline`, `fact_roles_security`, `fact_equipment_phone_only`, `fact_onboarding_service`, `fact_competitive_vs_notebook_1c`, `fact_stage_early_access` are all verified. The only needs_confirmation touch is the onboarding timing in the blog "Как начать" section, which is framed as typical (per `fact_onboarding_one_day`), and the per-customer debt limit, which is explicitly NOT asserted and routed to support. QR settlement timing is not claimed (the posts say nasiya is recorded beside QR, not that money arrives instantly).
- B08 fabricated testimonial: PASS. No quote, no named customer, no anonymous endorsement. The voice is BirLiy's own calm narration.
- B09 fabricated deadline or roadmap as done: PASS. Only "ранний доступ" / "erta kirish" framing; no date, no countdown, no planned feature stated as shipped.
- B10 empty or placeholder artifact: PASS. All blocks are real, filled copy with no TODO or bracket slots.
- B11 missing required CTA: PASS. Exactly one approved CTA per piece: the RU post ends with "Написать в Telegram: +998 97 421 24 54"; the UZ post ends with "Telegramga yozing: +998 97 421 24 54"; the blog closes with "Оставить заявку: birliy.uz" / "Ariza qoldiring: birliy.uz". No second CTA, no non-approved destination.

### Warning rules (all pass, none fire)

- W01 generic AI language: PASS. No empty opener, no self-narration, no buzzword closer. Posts open on the recognizable notebook situation.
- W02 paragraph too long: PASS. Lines are short (6-12 words), 6 lines plus CTA, with line breaks and white space.
- W03 vague benefit: PASS. Benefit is concrete and trade-anchored (долги в приложении вместо тетради, в одном учёте), tied to fact ids.
- W04 excessive jargon: PASS. Kitchen-table words only (долг, тетрадь, наличные, карта, QR, насия). No anglicism, no "функционал" outside the price line (price line not used here).
- W05 weak hook: PASS. Both posts open on a recognizable pain in under 14 words ("Долговая тетрадь знает всё..." / "Qarz daftari hammasini biladi...").
- W06 literal translation: PASS. The UZ post is rebuilt natively (oldi, va'da qilgan, to'g'ri keladi), not a calque; no RU loanword inside the UZ block.
- W07 duplicated meaning: PASS. One idea (nasiya in the app), no triad padding, no restated sentence.
- W08 inconsistent product terminology: PASS. Canonical terms used consistently (насия / в долг / nasiya, qarz daftari). Brand spelled "BirLiy".
- W09 aggressive or misleading persuasion: PASS. No scarcity, no superlative, no hype word, no caps-lock, zero emoji. Calm confidence; the offer is stated as honest early access.

### Parity checklist (bilingual pieces)

- Same fact ids cited in RU and UZ posts: yes.
- Same claim strength (all verified, nothing over-promised in either): yes.
- Same CTA action (Telegram) in both posts: yes.
- Currency per language: not applicable in the posts (no figure used), so no error possible.
- Neither version reads like a translation of the other: confirmed.

---

## 7. Exact factual claims used (with APPROVED_FACTS ids)

| Claim used in copy | Fact id | Status | How it is framed here |
|---|---|---|---|
| Customer debts (nasiya) are shown in the app instead of a paper notebook: who owes how much and when they promised to pay | `fact_nasiya_debt` | verified | Stated as the core capability (the relief) |
| Cash, card, QR and on credit are tracked in one ledger | `fact_payment_methods` | verified | "в долг рядом с наличными, картой и QR, в одном учёте"; no bank named |
| Early access 2026, first cohort, Tashkent first | `fact_stage_early_access` | verified | Honest stage line; no implied customer base |
| One phone surface, the evening reconciles itself | `fact_positioning`, `fact_single_surface_demo` | verified | "вечером цифры сходятся"; blog body only, no demo figure |
| Beats notebook / Excel / 1C for a small shop | `fact_competitive_vs_notebook_1c` | verified | Blog comparison section, respectful, no vendor named |
| Phone-only start, no computer needed | `fact_equipment_phone_only` | verified | Blog "Как начать" |
| Service-style onboarding (install, import, train, first receipt) | `fact_onboarding_service` | verified | Blog "Как начать" |
| One-day onboarding (timing) | `fact_onboarding_one_day` | needs_confirmation | Blog: framed as typical, not guaranteed |
| Works offline, syncs later | `fact_offline` | verified | Blog FAQ answer |
| Roles, PIN login, action log | `fact_roles_security` | verified | Blog FAQ answer; bounded, no broad data-protection guarantee (F1) |
| Contacts: phone +998 97 421 24 54 | `fact_contacts` | verified | CTA destination in both posts |
| Made for Uzbekistan | `fact_made_for_uzbekistan` | verified | Blog meta descriptions only; never expanded |

Facts deliberately NOT used (and why):
- `fact_demo_revenue`, `fact_demo_avg_check`, `fact_demo_sales_delta`, `fact_demo_stock`, `fact_demo_receipt`, `fact_demo_cashiers_returns`: prohibited demo mockups. Listed in the do-not-use block.
- `fact_real_shops_badge`: prohibited, contradicts the early-access stage.
- Per-customer debt limit (`UNVERIFIED_CLAIMS_REPORT` E4): owner-confirm, only flagged in the blog FAQ as a question to confirm via support.
- `fact_qr_no_terminal` instant-settlement clause: not claimed; nasiya is shown as recorded beside QR, not as instant money movement.

---

## 8. Assumptions made

1. The primary reader sells on credit and currently keeps a paper qarz daftari. This is grounded in `COMPANY_CONTEXT` (Primary ICP, the nasiya differentiator) and the `HOOK_BANK` nasiya hooks, not invented.
2. The Telegram channel is the right home for the two posts and the lowest-friction CTA, per `02-content-system.md` rhythm and `TEMPLATE_LIBRARY` (Telegram default CTA = Написать в Telegram).
3. The blog is shipped as RU/UZ/EN because the existing blog already runs three locales (`SOURCE_INDEX`, `COMPANY_CONTEXT` channels). EN is included for AI-discovery; its CTA routes to the same site action.
4. "Вечером цифры сходятся" is used as a tone line from `fact_positioning`, NOT as a claim that the books always balance. It describes the calm of one surface, not a guaranteed outcome.
5. No price line is placed in the two posts on purpose: this is a pain-to-relief campaign, not an offer campaign, so price would split the single idea. Price belongs to a separate offer post (`02-content-system.md` template D).
6. The campaign maps to a single ContentObject with two telegram drafts (RU, UZ) and one blog draft; the EN blog locale can be a third blog draft if the pipeline carries per-locale blog drafts. This matches the `lib/content-objects.ts` draft model (platform + format + metadata.locale dedupe key).
7. Onboarding timing is treated as typical, not guaranteed, because `fact_onboarding_one_day` is needs_confirmation; this is the only qualified fact in the set and it lives in the blog, not the posts.

---

## 9. CTA used (one of the two approved)

- Telegram posts (RU and UZ): "Написать в Telegram" / "Telegramga yozish", routed to +998 97 421 24 54 (`fact_contacts`, `BIRLIY_BRAND_VOICE` section 9). Chosen as the lowest-barrier action for a pain-led post.
- Blog article (RU/UZ/EN): "Оставить заявку" / "Ariza qoldiring", routed to birliy.uz (#lead) (`fact_lead_form_docs`, `BIRLIY_BRAND_VOICE` section 9). Chosen for the higher-intent, product-led long-form piece.

Exactly one CTA per piece. No other call to action, link, or handle is used as the action.

---

## 10. Expected ContentObject metadata

Shape aligned to `lib/content-objects.ts` and `lib/validators/content-object.ts` (read only). `status` is from `contentObjectStatuses`; `platforms` from `contentPlatforms` (blog, telegram, instagram, linkedin, tiktok, pinterest). Drafts carry `version`, `platform`, `text`, `created_at`, `format`, and `metadata.locale` (the dedupe key is platform:version:format:locale). This is the metadata a CMO pipeline would attach when registering this campaign; it is illustrative of the shape, not a live record.

```json
{
  "campaign_id": "campaign-3-nasiya-debt-visibility",
  "brief": "Nasiya and debt visibility: replace the paper qarz daftari with the in-app nasiya ledger for a neighbourhood grocery shop that sells on credit. Pillar 1 pain-to-relief. RU + UZ Telegram posts and an RU/UZ/EN blog. Facts: fact_nasiya_debt, fact_payment_methods, fact_stage_early_access, fact_positioning, fact_competitive_vs_notebook_1c. No demo numbers, no bank, no UZS, no em-dash.",
  "status": "pending_approval",
  "platforms": ["telegram", "blog"],
  "source": "growth-os-golden-campaign",
  "drafts": [
    {
      "version": 1,
      "platform": "telegram",
      "format": "telegram_text",
      "created_at": "2026-06-23T00:00:00.000Z",
      "metadata": {
        "locale": "ru",
        "pillar": "pain_to_relief",
        "template": "pain_to_solution_post",
        "cta": "write_telegram",
        "cta_destination": "+998 97 421 24 54",
        "fact_ids": ["fact_nasiya_debt", "fact_payment_methods", "fact_stage_early_access", "fact_contacts"],
        "qa_verdict": "PASS"
      },
      "text": "Долговая тетрадь знает всё: кто взял в долг, сколько и когда обещал вернуть. А если страница потерялась, спорить уже не с чем. В BirLiy долги покупателей видно в приложении вместо тетради. Кто сколько должен и когда обещал оплатить, всё в одном списке. В долг учитывается рядом с наличными, картой и QR, в одном учёте. Вечером цифры сходятся, тетрадь не нужна. Сейчас открываем ранний доступ для первых магазинов Ташкента. Написать в Telegram: +998 97 421 24 54"
    },
    {
      "version": 1,
      "platform": "telegram",
      "format": "telegram_text",
      "created_at": "2026-06-23T00:00:00.000Z",
      "metadata": {
        "locale": "uz",
        "pillar": "pain_to_relief",
        "template": "pain_to_solution_post",
        "cta": "write_telegram",
        "cta_destination": "+998 97 421 24 54",
        "fact_ids": ["fact_nasiya_debt", "fact_payment_methods", "fact_stage_early_access", "fact_contacts"],
        "qa_verdict": "PASS"
      },
      "text": "Qarz daftari hammasini biladi: kim nasiyaga oldi, qancha va qachon qaytarishni va'da qilgan. Sahifa yo'qolsa esa, endi bahslashishga hujjat qolmaydi. BirLiy'da xaridorlar nasiyasi daftar o'rniga ilovada ko'rinadi. Kim qancha qarz va qachon to'lashni va'da qilgani, hammasi bitta ro'yxatda. Nasiya naqd, karta va QR bilan bir qatorda, bitta hisobda turadi. Kechqurun raqamlar to'g'ri keladi, daftar kerak emas. Hozir Toshkentning birinchi do'konlari uchun erta kirishni ochmoqdamiz. Telegramga yozing: +998 97 421 24 54"
    },
    {
      "version": 1,
      "platform": "blog",
      "format": "blog_outline",
      "created_at": "2026-06-23T00:00:00.000Z",
      "metadata": {
        "locale": "ru",
        "locales_planned": ["ru", "uz", "en"],
        "pillar": "pain_to_relief",
        "template": "seo_blog_article",
        "primary_keyword_ru": "учёт долгов в магазине без тетради",
        "primary_keyword_uz": "do'konda nasiya hisobi",
        "primary_keyword_en": "track customer debt without a notebook",
        "cta": "leave_request",
        "cta_destination": "birliy.uz#lead",
        "fact_ids": ["fact_nasiya_debt", "fact_payment_methods", "fact_positioning", "fact_single_surface_demo", "fact_competitive_vs_notebook_1c", "fact_equipment_phone_only", "fact_onboarding_service", "fact_onboarding_one_day", "fact_offline", "fact_roles_security", "fact_made_for_uzbekistan", "fact_stage_early_access"],
        "do_not_use_fact_ids": ["fact_demo_revenue", "fact_demo_avg_check", "fact_demo_sales_delta", "fact_demo_stock", "fact_demo_receipt", "fact_demo_cashiers_returns", "fact_real_shops_badge"],
        "qualified_fact_ids": ["fact_onboarding_one_day"],
        "qa_verdict": "PASS"
      },
      "text": "Blog outline for 'How to track customer debt without a paper notebook' (RU/UZ/EN). Full H1/H2/H3 structure, meta descriptions, FAQ, do-not-use block and single Оставить заявку CTA are written in section 5 of campaign-3-nasiya-debt-visibility.md."
    }
  ],
  "assets": [],
  "metrics": {}
}
```

Metadata notes:
- `status` starts at `pending_approval` (the validator default), then moves through the approved transitions (`pending_approval` -> `approved` -> `publishing` -> `published`) per `contentObjectTransitions`.
- `platforms` lists only `telegram` and `blog`; Instagram is available in the enum but not used by this campaign.
- The two telegram drafts share `version` and `format` but differ by `metadata.locale` (ru vs uz), so they are distinct under the platform:version:format:locale dedupe key in `contentObjectDraftKey`; they will not collide.
- `fact_ids`, `qa_verdict`, and the do-not-use list live in `metadata` (a free-form record on each draft), which is where the QA engine in `QA_RULES` reads the machine-checkable fact citations.
- `assets` and `metrics` are empty at creation; real assets (a paper-background screenshot of the nasiya list) and metrics (leads, gsc_clicks) attach later through the patch flow.
