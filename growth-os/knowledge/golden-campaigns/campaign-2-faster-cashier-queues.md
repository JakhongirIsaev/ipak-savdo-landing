# Golden Campaign 2: Faster cashier work and shorter queues

A reference, fully written campaign for the BirLiy CMO. It is a worked example of the
`telegram_post`, `pain_to_solution_post` and `seo_blog_article` templates from
`TEMPLATE_LIBRARY.json`, applied to one theme for one segment. Every line obeys the
hard rules in `BIRLIY_BRAND_VOICE.md` and `QA_RULES.json`, and every product claim
traces to an id in `APPROVED_FACTS.json`. Copy here is publishable as written.

- Theme: faster cashier work and shorter queues at the counter.
- Primary CTA: "Написать в Telegram" (`+998 97 421 24 54`), with the offer post using "Оставить заявку" (`birliy.uz` #lead).
- Languages: RU primary, UZ native mirror, EN for the blog outline only.
- Brand principle: "Меньше частей. Больше ясности." / "Kamroq qism. Ko'proq aniqlik."

---

## 1. Campaign strategy

### The idea in one line
At a small grocery shop the cashier is the bottleneck: searching for a price in a
notebook, counting change, writing the sale down later. The queue grows, and a
hurried customer leaves. BirLiy collapses the sale into one screen so the line at
the counter moves and nothing is written down twice.

### Why this theme, for this segment
The neighbourhood grocery shop with one or two cashiers feels the queue every busy
hour: morning bread run, lunchtime, evening after work. The owner is usually one of
those cashiers. The pain is physical and daily, so it is recognizable without any
invented numbers. The relief is a real, verified product behavior: one connected
checkout screen instead of three separate steps and a notebook.

This maps to content pillar 2 ("Как это работает") and pillar 1 ("Боль to облегчение")
from `marketing/02-content-system.md`, and to the `queue speed` pain in `HOOK_BANK.json`.

### The message, kept to one idea
One sale, one screen, no switching between apps and no writing it down again later.
Scan or search, basket, payment, receipt to the buyer in Telegram, stock updated.
That is the whole pitch. We do not stack stock, reports, debts and pricing into the
same post; each gets its own piece elsewhere.

### Honest framing
BirLiy is in early access 2026, first cohort, Tashkent first (`fact_stage_early_access`).
We never imply an existing customer base, never quote a result, and we keep the
"15 seconds" speed line as a description of the flow, not a stopwatch guarantee
(`fact_sale_flow_15s`, needs_confirmation).

### Channel and rhythm
- Telegram is the conversion channel: two posts (a pain-to-solution post and a
  how-it-works post), closing with "Написать в Telegram".
- One offer-style mirror is available on the blog for organic and AI-discovery reach,
  closing with "Оставить заявку".
- The blog article carries the long-form, SEO version of the same theme.

### What we deliberately do NOT say
- No "продаёте быстрее на N%", no time-saved figure, no queue-length figure.
- No bank, no payment processor, no parent company, ever.
- No "real shops already working", no demo dashboard numbers, no sample receipt as a real sale.
- No fake scarcity ("осталось 2 места"), no hype words.

---

## 2. Target segment

**Neighbourhood grocery shop (продуктовый магазин у дома / uy yonidagi oziq-ovqat
do'koni) with one or two cashiers.** From `fact_icp_segments` and `COMPANY_CONTEXT.md`
secondary segments.

- Hundreds of everyday items: bread, milk, drinks, household goods, piece and weight goods.
- One or two people behind the counter, often the owner among them.
- Busy bursts: morning, lunch, evening. During a burst the queue is the problem.
- Today the cashier rings up by hand or from memory, looks for a price, counts change,
  and writes the sale into a notebook to reconcile later.
- The owner fears two things at the counter: a slow line that loses an impatient
  customer, and sales that get mis-entered or forgotten in the rush.

Sizing note (`fact_segment_sizing_200`, needs_confirmation): the "home-corner shop"
sizing of one cashier and an ordinary daily flow is a descriptive illustration, not a
capacity limit or guaranteed throughput. We describe it qualitatively, we do not quote
"up to 200 receipts a day" as a hard number in public copy.

---

## 3. Real RU Telegram post (publishable)

Format: `telegram_post` built on `pain_to_solution_post` (pillar 2, how it works).
Hook adapted from `hook_ru_queue_002`.

```
Очередь у прилавка растёт, пока вы ищете цену и считаете сдачу.

В часы пик это знакомо каждому небольшому магазину.
Покупатель спешит, а вы ещё записываете продажу в тетрадь на потом.

В BirLiy продажа идёт на одном экране.
Скан или быстрый поиск, корзина, оплата, чек уходит покупателю в Telegram, остаток обновляется сам.
Без переключений между приложениями и без записи в тетрадь после.

Камера телефона читает штрих-код, а можно подключить любой 2D Bluetooth-сканер.

Покажем на вашем магазине.
Написать в Telegram: +998 97 421 24 54
```

Fact backing for this post:
- "продажа идёт на одном экране ... без переключений" : `fact_sale_flow_15s` (the 6-step
  flow, kept descriptive), `fact_single_surface_demo`, `fact_checkout_sales`.
- "чек уходит покупателю в Telegram" : `fact_ereceipt_telegram` (verified).
- "остаток обновляется сам" : `fact_stock_auto_low_alert` (verified).
- "камера телефона читает штрих-код ... 2D Bluetooth-сканер" : `fact_scanner_2d_bluetooth` (verified).
- CTA : `fact_contacts` (verified).

---

## 4. Real UZ Telegram post (native mirror, equivalent meaning)

Format: same `telegram_post`. Native Tashkent-shopkeeper Uzbek, not a calque of the RU.
Hook adapted from `hook_uz_queue_002`. UZ wording reuses `safe_public_wording_uz` from
the cited facts.

```
Narxni qidirib, qaytimni sanab turganingizda peshtaxta oldida navbat o'sib boradi.

Gavjum soatlarda buni har bir kichik do'kon biladi.
Xaridor shoshyapti, siz esa sotuvni keyinroq daftarga yozib qo'yasiz.

BirLiy'da sotuv bitta ekranda boradi.
Skan yoki tez qidiruv, savat, to'lov, chek xaridorga Telegramga ketadi, qoldiq o'zi yangilanadi.
Ilovalar orasida o'tishsiz va keyin daftarga yozishsiz.

Telefon kamerasi shtrix-kodni o'qiydi, xohlasangiz har qanday 2D Bluetooth skaner ham ulanadi.

Do'koningizda ko'rsatamiz.
Telegramga yozing: +998 97 421 24 54
```

Parity check (run per `BIRLIY_BRAND_VOICE.md` section 15):
- Same fact ids cited in both versions.
- Same claim strength: the flow is descriptive in both, no guarantee word in either.
- Same CTA action: "Написать в Telegram" / "Telegramga yozing", same phone.
- Currency not used in either post (no price line here), so no сум/so'm conflict.
- Neither version reads as a translation of the other: UZ uses native verbs
  (qidirib, sanab, o'sib boradi, ketadi) and word order, not RU loanwords.

---

## 5. RU / UZ / EN blog outline

Format: `seo_blog_article` (ICP-pain led, routes to a request). Mirrors the existing
blog posts on `kassa`, `magazin-uchun-dastur` and `skladskoy-uchet`. This is an
outline, fully specified, not the final article body.

### Primary keyword
- RU: "как ускорить работу кассы в магазине" / "очередь на кассе в магазине".
- UZ: "do'konda kassa ishini qanday tezlashtirish" / "do'konda navbatni qisqartirish".
- EN (reference only): "how to speed up the checkout in a small shop".

### Search intent
A small-shop owner whose counter slows down at peak hours is asking, in plain words,
how to make the sale faster and stop losing impatient customers without buying a
computer or a complicated register.

### ICP pain
Queue speed at a one or two cashier grocery shop: manual price lookup, change
counting, and re-writing the sale into a notebook all slow the line (`queue speed`
pain in `HOOK_BANK.json`).

### Outline (shared structure across RU / UZ / EN; the three versions are equivalent, native, not literal translations)

- **H1.** Phrased as the reader asks it.
  - RU: "Как ускорить работу кассы и сократить очередь в небольшом магазине"
  - UZ: "Kichik do'konda kassa ishini qanday tezlashtirish va navbatni qisqartirish"
  - EN: "How to speed up the checkout and shorten the queue in a small shop"

- **Intro (name the pain, promise a plain answer).** The peak-hour queue, the cashier
  searching for a price and counting change, the sale written down for later. Promise:
  a calmer counter without a computer. No numbers. Backed by the pain framing, no product claim yet.

- **H2: Почему очередь растёт / Navbat nega o'sadi / Why the queue grows.** Three honest,
  qualitative reasons: price lookup by hand, change and payment handled separately,
  the sale recorded twice (once at the counter, once in the notebook in the evening).
  Comparison to a notebook or Excel here uses `fact_competitive_vs_notebook_1c` only,
  stated factually and respectfully, no other vendor named.

- **H2: Как проходит продажа в BirLiy / BirLiy'da sotuv qanday boradi / How a sale runs in BirLiy.**
  The 6-step flow on one screen: scan or quick search, basket, to payment, payment,
  confirmation, e-receipt to the buyer in Telegram and stock updated.
  Backed by `fact_sale_flow_15s` (flow described, "15 seconds" kept as a description not
  a guarantee), `fact_checkout_sales`, `fact_single_surface_demo`, `fact_ereceipt_telegram`,
  `fact_stock_auto_low_alert`.

- **H3: Сканер или камера / Skaner yoki kamera / Scanner or camera.** The phone camera
  reads the barcode; any 2D Bluetooth scanner can be connected. No equipment model or
  price named. Backed by `fact_scanner_2d_bluetooth`. Optional equipment is "по желанию",
  no kit price (`fact_equipment_optional_kit`, needs_confirmation, qualified).

- **H3: Оплата без задержки / Kechikishsiz to'lov / Payment without a hold-up.** Cash,
  card, QR and on credit (nasiya) are all in one ledger; for QR no separate terminal is
  needed, the buyer scans the code on the phone screen. Backed by `fact_payment_methods`
  and `fact_qr_no_terminal` (settlement timing kept as "быстро / tez", never "мгновенно
  гарантированно"). No bank or processor named.

- **H3: Очередь не встаёт, если интернет пропал / Internet uzilsa ham navbat to'xtamaydi /
  The queue keeps moving if the internet drops.** The app keeps selling offline; sales
  are saved locally and sync when the connection returns. Backed by `fact_offline`.

- **H2: Что это даёт магазину / Bu do'konga nima beradi / What it gives the shop.**
  Qualitative only: fewer steps per sale, no double entry, the line keeps moving, the
  evening reconciles itself (`fact_positioning`). ZERO results numbers, no time-saved
  or queue-length figure.

- **Honest scope line.** Early access 2026, first cohort, Tashkent first
  (`fact_stage_early_access`). Phone-only start, no computer required
  (`fact_equipment_phone_only`). Onboarding help: install, catalog import or first 100
  SKU, cashier training, first receipt with the team, typically connected in a day
  (`fact_onboarding_service` verified; `fact_onboarding_one_day` qualified as typical).

- **FAQ block (AEO, 3 Q&A, answers grounded in facts):**
  1. "Нужен ли компьютер, чтобы ускорить кассу?" / "Kassani tezlashtirish uchun kompyuter kerakmi?"
     Answer: no, a phone is enough (`fact_equipment_phone_only`).
  2. "Нужен ли отдельный терминал для QR?" / "QR uchun alohida terminal kerakmi?"
     Answer: no, the buyer scans the QR on the phone screen (`fact_qr_no_terminal`, qualified).
  3. "А если на кассе пропал интернет?" / "Kassada internet uzilsa-chi?"
     Answer: the app keeps selling and syncs later (`fact_offline`).

- **Closing CTA section (one CTA).**
  - RU: "Хотите, покажем на вашем магазине? Оставить заявку: birliy.uz"
  - UZ: "Do'koningizda ko'rsatamizmi? Ariza qoldiring: birliy.uz"
  - EN (reference): "Want us to show it on your shop? Leave a request: birliy.uz"

### Meta description draft (no em-dash, with keyword)
- RU: "Очередь на кассе растёт в час пик? Как ускорить продажу в небольшом магазине: один экран, скан или поиск, оплата и чек в Telegram. Сделано для Узбекистана."
- UZ: "Gavjum soatda kassada navbat o'syaptimi? Kichik do'konda sotuvni qanday tezlashtirish: bitta ekran, skan yoki qidiruv, to'lov va Telegramda chek. O'zbekiston uchun yaratilgan."

### Internal links
- The two campaign Telegram posts above.
- The landing #lead block.
- The existing blog posts on `kassa-apparatsiz-savdo` and `magazin-uchun-dastur-telefonda-savdo`.

---

## 6. QA report (QA_RULES.json run mentally)

Artifacts checked: the RU Telegram post (section 3), the UZ Telegram post (section 4),
and the blog outline copy lines (section 5). Verdict logic per `QA_RULES.json`: PASS
only if zero blocking rules fire.

### Blocking checks (all PASS)

| Rule | Check | Result |
|---|---|---|
| B01 forbidden company/bank mention | No bank, Ipak Yuli, processor, or parent company anywhere. Trust line, where used, is only "Сделано для Узбекистана" / "O'zbekiston uchun yaratilgan", never expanded. | PASS |
| B02 unsupported factual claim | Every claim maps to a fact id (see section 7). No stray numbers: the only digits are the phone +998 97 421 24 54, the early-access year 2026, and "2D" / "100 SKU" inside qualified outline notes, all approved. | PASS |
| B03 fabricated result or metric | No revenue, no time-saved, no queue-length, no shop/customer count, no demo dashboard number, no "real shops already working". Benefits stay qualitative. | PASS |
| B04 missing required language | Both posts ship RU and UZ; both bodies are non-empty, native, and not duplicates of each other. | PASS |
| B05 em-dash character | No U+2014, U+2013 or U+2015 anywhere. Pauses use "," ":" or a plain hyphen "-". | PASS |
| B06 forbidden currency notation | No "UZS". No price figure appears in the two posts. In the outline, price is referenced only by citing `fact_pricing_promo` wording; RU uses сум, UZ uses so'm, never mixed. | PASS |
| B07 unqualified needs_confirmation claim | `fact_sale_flow_15s` kept as a flow description (no "15 seconds" guarantee). `fact_qr_no_terminal` kept as "терминал не нужен" with no "мгновенно гарантированно". `fact_onboarding_one_day` framed as typical. `fact_segment_sizing_200` kept qualitative. `fact_equipment_optional_kit` "по желанию", no kit price. | PASS |
| B08 fabricated testimonial | No quote, no named customer, no anonymous endorsement. Only BirLiy's own calm voice. | PASS |
| B09 fabricated deadline or roadmap as done | Only "ранний доступ 2026" / "erta kirish 2026". No other date, no countdown, no unshipped feature stated as live. | PASS |
| B10 empty or placeholder artifact | All slots filled with real copy; no TODO, no bracket placeholders. | PASS |
| B11 missing required CTA | Each post ends with exactly one approved CTA ("Написать в Telegram" / "Telegramga yozing"); the blog closes with one "Оставить заявку" / "Ariza qoldiring". No extra link or handle used as the action. | PASS |

### Warning checks (all clear)

| Rule | Check | Result |
|---|---|---|
| W01 generic AI language | No "в современном мире", no "мы рады представить", no buzzword closer. Opens on the real counter situation. | CLEAN |
| W02 paragraph too long | 3 to 6 short lines per post; sentences within 6 to 14 words; line breaks for white space. | CLEAN |
| W03 vague benefit | Benefits are concrete and trade-anchored (один экран, скан, чек в Telegram, остаток, сканер), not "удобно и эффективно". | CLEAN |
| W04 excessive jargon | Plain words: "приложение", "экран", "сканер". No "апп", "SaaS", "UX". "Функционал" not used in body. | CLEAN |
| W05 weak hook | First line names the recognizable peak-hour queue, under 14 words. | CLEAN |
| W06 literal translation | UZ rebuilt natively (qidirib, sanab, o'sib boradi, ketadi); no RU loanwords like "выручка/скидка" inside the UZ block. | CLEAN |
| W07 duplicated meaning | One idea per post; no triad padding; no restated benefit. | CLEAN |
| W08 inconsistent terminology | Canonical terms only (касса/kassa, остаток/qoldiq, скан/skan, чек/chek); brand spelled "BirLiy". | CLEAN |
| W09 aggressive or misleading persuasion | No fake scarcity, no superlative, no hype word, no caps-lock; zero emoji used. | CLEAN |

**Overall verdict: PASS / GO.** Zero blocking, zero warnings.

---

## 7. Exact factual claims used (cited to APPROVED_FACTS ids)

| Claim used in the campaign | Fact id | Status | How it is framed here |
|---|---|---|---|
| Sale runs as one connected flow on one screen, scan/search, basket, payment, receipt, stock update | `fact_sale_flow_15s` | needs_confirmation | Described as a flow; "15 seconds" NOT stated as a guarantee |
| Checkout: scanner or camera, quick search, discounts, refund, deferred receipt | `fact_checkout_sales` | verified | Plain capability |
| One surface links checkout, payments and stock; no app switching | `fact_single_surface_demo` | verified | Plain capability |
| Phone camera reads barcodes; any 2D Bluetooth scanner connects | `fact_scanner_2d_bluetooth` | verified | Plain capability, no model or price |
| Electronic receipt sent to the buyer in Telegram | `fact_ereceipt_telegram` | verified | Plain capability |
| Stock updates automatically after each sale | `fact_stock_auto_low_alert` | verified | Plain capability |
| Cash, card, QR, on credit (nasiya) tracked in one ledger | `fact_payment_methods` | verified | Plain capability (blog outline) |
| QR needs no separate terminal; buyer scans on phone screen | `fact_qr_no_terminal` | needs_confirmation | "терминал не нужен" + "быстро"; never "мгновенно гарантированно" |
| App keeps selling offline; syncs when connection returns | `fact_offline` | verified | Plain capability (blog outline + FAQ) |
| Phone-only start, no computer required | `fact_equipment_phone_only` | verified | Plain capability (blog outline + FAQ) |
| Optional equipment by желанию (tablet, scanner, printer) | `fact_equipment_optional_kit` | needs_confirmation | "по желанию"; no kit price quoted |
| Beats a notebook / Excel / 1C for a small shop | `fact_competitive_vs_notebook_1c` | verified | Factual, respectful; no other vendor named |
| Grocery shop is a target segment | `fact_icp_segments` | verified | Segment definition |
| Home-corner sizing (one cashier, ordinary daily flow) | `fact_segment_sizing_200` | needs_confirmation | Kept qualitative; "up to 200 receipts" NOT quoted |
| Service-style onboarding (install, import, train, first receipt) | `fact_onboarding_service` | verified | Plain (blog outline) |
| Typically connected in one day | `fact_onboarding_one_day` | needs_confirmation | "обычно / typically", not guaranteed |
| Pricing wording, if referenced | `fact_pricing_promo` | needs_confirmation | Outline cites wording only; framed as first-cohort rate |
| Early access 2026, first cohort, Tashkent first | `fact_stage_early_access` | verified | Honest scope line |
| Made for Uzbekistan | `fact_made_for_uzbekistan` | verified | Trust line, never expanded |
| Contacts (phone for the CTA) | `fact_contacts` | verified | CTA destination |
| The evening reconciles itself | `fact_positioning` | verified | Emotional close, qualitative |

Prohibited facts deliberately NOT used (do-not-use list): `fact_demo_revenue`,
`fact_demo_avg_check`, `fact_demo_sales_delta`, `fact_demo_stock`, `fact_demo_receipt`,
`fact_demo_cashiers_returns`, `fact_real_shops_badge`.

---

## 8. Assumptions made

1. **Segment specifics** (peak hours: morning bread run, lunch, evening) are a generic,
   true description of how a neighbourhood grocery shop trades. They carry no product
   claim and no number, so they need no fact id. Flagged as illustrative scene-setting.
2. **"15 seconds" is treated as marketing speed copy, not a guarantee.** Per
   `fact_sale_flow_15s` conditions, the campaign shows the flow and avoids the number
   in the posts; the blog mentions it only as a description if at all. Owner confirmation
   of representative timing is still open.
3. **QR settlement timing is left soft** ("быстро / tez"), not "мгновенно". Owner
   confirmation of settlement timing is still open (`fact_qr_no_terminal`).
4. **The grocery segment is secondary** in `COMPANY_CONTEXT.md`; the campaign treats it
   as a real target but does not over-promise weight-scale or grocery-specific features
   beyond the verified piece-and-weight catalog wording.
5. **Channel choice** (Telegram for the two posts, blog for long-form) follows
   `marketing/01-strategy.md` section 6; no new channel is invented.
6. **The "1 or 2 cashiers" framing** uses only what is verified about roles and PIN
   login if expanded later; this campaign keeps the focus on speed, so it does not lean
   on `fact_roles_security` or `fact_unlimited_cashiers_early` (both available for a
   future trust-angle post, the latter always bounded to early access).

---

## 9. CTA used

Two approved CTAs only, one per piece:

- **RU Telegram post / UZ Telegram post:** "Написать в Telegram" / "Telegramga yozing",
  destination `+998 97 421 24 54` (`fact_contacts`). Lowest barrier, the default for
  Telegram and pain-to-solution posts.
- **Blog article close:** "Оставить заявку" / "Ariza qoldiring", destination `birliy.uz`
  (#lead block). The product-intent CTA for the long-form piece (`fact_lead_form_docs`,
  `marketing/01-strategy.md` section 8).

No other CTA, link, or handle is used as the call to action.

---

## 10. Expected ContentObject metadata

Shape aligned to `lib/content-objects.ts` and `lib/db/schema.ts`
(`ContentObjectDraft`: `version`, `platform`, `text`, `created_at`, `format`, `metadata`;
platforms from `contentPlatforms`; status from `contentObjectStatuses`). This is the
metadata a generation worker would attach when turning this campaign into a
ContentObject. Illustrative `campaign_id` and timestamps; status starts at
`pending_approval` (the create-schema default), then follows the approved transitions
(`pending_approval -> approved -> publishing -> published`).

```jsonc
{
  "campaign_id": "campaign-2-faster-cashier-queues",
  "brief": "Faster cashier work and shorter queues for a neighbourhood grocery shop with one or two cashiers. One sale, one screen: scan or search, basket, payment, e-receipt to Telegram, stock updated. RU + UZ Telegram posts plus an RU/UZ/EN blog outline. Early access 2026, Tashkent first.",
  "status": "pending_approval",
  "platforms": ["telegram", "blog"],
  "source": "growth-os/golden-campaigns",
  "drafts": [
    {
      "version": 1,
      "platform": "telegram",
      "format": "telegram_text",
      "text": "Очередь у прилавка растёт, пока вы ищете цену и считаете сдачу. ... Написать в Telegram: +998 97 421 24 54",
      "created_at": "2026-06-23T08:00:00.000Z",
      "metadata": {
        "locale": "ru",
        "template": "telegram_post",
        "pillar": "how_it_works",
        "hook_id": "hook_ru_queue_002",
        "fact_ids": [
          "fact_sale_flow_15s",
          "fact_single_surface_demo",
          "fact_checkout_sales",
          "fact_ereceipt_telegram",
          "fact_stock_auto_low_alert",
          "fact_scanner_2d_bluetooth",
          "fact_contacts"
        ],
        "cta": "write_telegram",
        "cta_destination": "+998 97 421 24 54",
        "qa_verdict": "PASS"
      }
    },
    {
      "version": 1,
      "platform": "telegram",
      "format": "telegram_text",
      "text": "Narxni qidirib, qaytimni sanab turganingizda peshtaxta oldida navbat o'sib boradi. ... Telegramga yozing: +998 97 421 24 54",
      "created_at": "2026-06-23T08:00:00.000Z",
      "metadata": {
        "locale": "uz",
        "template": "telegram_post",
        "pillar": "how_it_works",
        "hook_id": "hook_uz_queue_002",
        "fact_ids": [
          "fact_sale_flow_15s",
          "fact_single_surface_demo",
          "fact_checkout_sales",
          "fact_ereceipt_telegram",
          "fact_stock_auto_low_alert",
          "fact_scanner_2d_bluetooth",
          "fact_contacts"
        ],
        "cta": "write_telegram",
        "cta_destination": "+998 97 421 24 54",
        "qa_verdict": "PASS",
        "parity_with": "ru"
      }
    },
    {
      "version": 1,
      "platform": "blog",
      "format": "blog_outline",
      "text": "H1: Как ускорить работу кассы и сократить очередь в небольшом магазине ... (RU/UZ/EN outline per section 5)",
      "created_at": "2026-06-23T08:00:00.000Z",
      "metadata": {
        "locale": "ru",
        "languages": ["ru", "uz", "en"],
        "template": "seo_blog_article",
        "primary_keyword_ru": "как ускорить работу кассы в магазине",
        "primary_keyword_uz": "do'konda kassa ishini qanday tezlashtirish",
        "icp_pain": "queue_speed",
        "fact_ids": [
          "fact_sale_flow_15s",
          "fact_checkout_sales",
          "fact_single_surface_demo",
          "fact_ereceipt_telegram",
          "fact_stock_auto_low_alert",
          "fact_scanner_2d_bluetooth",
          "fact_payment_methods",
          "fact_qr_no_terminal",
          "fact_offline",
          "fact_equipment_phone_only",
          "fact_equipment_optional_kit",
          "fact_competitive_vs_notebook_1c",
          "fact_icp_segments",
          "fact_segment_sizing_200",
          "fact_onboarding_service",
          "fact_onboarding_one_day",
          "fact_stage_early_access",
          "fact_made_for_uzbekistan",
          "fact_positioning"
        ],
        "cta": "leave_request",
        "cta_destination": "birliy.uz#lead",
        "qa_verdict": "PASS"
      }
    }
  ],
  "metrics": {}
}
```

Notes on shape:
- `platform` values are drawn from `contentPlatforms` (`telegram`, `blog`).
- `format` mirrors the worker conventions in `buildInitialDrafts` (`telegram_text`,
  and an outline analogue of `blog_ts`).
- `metadata.locale` matches the field `draftLocale()` reads in `content-objects.ts`;
  `metadata` is an open `Record<string, unknown>`, so `template`, `fact_ids`, `cta` and
  `qa_verdict` are valid extra keys the QA linter and reviewer can read.
- `fact_ids` is the machine-checkable citation array `QA_RULES.json` B02 treats as the
  source of truth.
- The two Telegram drafts share `platform` and `version` but differ by `locale`, so
  `contentObjectDraftKey()` (platform:version:format:locale) keeps them distinct and
  `appendContentObjectDrafts` will not treat them as duplicates.
