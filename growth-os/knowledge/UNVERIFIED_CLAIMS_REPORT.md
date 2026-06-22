# BirLiy Unverified Claims Report (for Jack's confirmation)

Every landing-page or blog claim below is reusable as public copy, but the underlying business fact or guarantee cannot be proven from the source files alone. Each item lists the claim, where it appears, why it needs confirmation, and the exact question to ask Jack. No em-dashes used in this report.

Status key inside the report: NEEDS CONFIRMATION (real number or guarantee not provable from source) and PROHIBITED (mockup or claim that must never be presented as real until proven).

---

## Group A: Pricing and the six-month promotion

### A1. Price points 49 000 / 149 000 and the 6-month duration
- Claim: First 6 months 49 000 сум/мес, then 149 000 сум/мес, full functionality, no hidden payments, nothing charged without consent.
- Source: lib/landing/i18n.ts (faq[1], freemium.body/bullets, heroOfferNote); repeated across blog product articles (e.g. lib/blog/posts/kassa-apparatsiz-savdo.ts).
- Why it needs confirmation: the wording matches the live landing, but the actual numbers and the promo length are business facts. A landing statement is not proof the price is current or committed.
- Question for Jack: Are 49 000 сум/мес for the first 6 months and 149 000 сум/мес after that the current, committed prices the CMO may quote? Is the 6-month promo still live?

### A2. Pilot / first-cohort framing of the price
- Claim: 49 000 сум/мес is the starting price for the first cohort of pilots.
- Source: lib/landing/i18n.ts (freemium.bullets[0], earlyAccess.body); ConceptLanding.tsx (copy.price.eyebrow "Пилотная цена").
- Why it needs confirmation: it bounds the price to a cohort, so the CMO must know the cohort scope and whether the rate is locked for those who join.
- Question for Jack: Is the 49 000 rate limited to the first cohort? Is it locked for early-access shops once they join, or can it change?

---

## Group B: Onboarding, install and learning times

### B1. One-day connection
- Claim: "Подключаем за один день" / "Bir kunda ulaymiz" (install, setup, first receipt in one meeting).
- Source: lib/landing/i18n.ts (formIntro, earlyAccess.promises[0], heroChips[1]); ConceptLanding.tsx (rollout).
- Why it needs confirmation: stated as a promise. SOURCE_INDEX explicitly flags whether "1 day" is a guarantee or typical.
- Question for Jack: Is one-day onboarding a guarantee, or is it the typical case? Can the CMO promise it, or should it be phrased as "usually one day"?

### B2. Cashier learns in 30 minutes
- Claim: "Кассир осваивает за 30 минут" / "Kassir 30 daqiqada o'rganadi".
- Source: lib/landing/i18n.ts (faq[0]); ConceptLanding.tsx (cashier/rollout).
- Why it needs confirmation: a soft performance claim with no evidence in source.
- Question for Jack: Is 30 minutes a representative cashier learning time the CMO can repeat?

### B3. Start in five minutes
- Claim: "Начните за пять минут" / "Besh daqiqada boshlang".
- Source: lib/landing/i18n.ts (benefits[0]).
- Why it needs confirmation: a marketing speed claim about setup time.
- Question for Jack: Is "start in five minutes" accurate enough to use, or should it be softened?

---

## Group C: Payments

### C1. QR payment "money arrives instantly"
- Claim: the buyer scans the QR and money arrives in the account instantly / immediately ("деньги поступают мгновенно" / "pul bir zumda tushadi").
- Source: lib/landing/i18n.ts (faq[4], features[2], qrCardHint); blog magazin-uchun-dastur-telefonda-savdo.ts.
- Why it needs confirmation: this is a settlement-timing guarantee. The "no terminal needed" part is verified product behavior; the "instant settlement" part is a business fact about money movement. We also must never name the bank or payment processor behind it.
- Question for Jack: Can the CMO say QR payments settle instantly, or should it say "fast"? Is there any settlement delay we must not misstate? (We will not name any bank or PSP either way.)

---

## Group D: Catalog and reporting numbers / depth

### D1. 9 000+ SKU base
- Claim: "база 9 000+ распространённых SKU" / "9 000+ tovar bazada".
- Source: lib/landing/i18n.ts (faq[7], trustStrip.catalogSize, capabilities.cards[2]); blog dokonda-nima-qolganini-telefondan-bilish.ts.
- Why it needs confirmation: a specific number. SOURCE_INDEX flags "confirm the exact number is current". Excel import itself is verified.
- Question for Jack: Is "9 000+" the current size of the built-in product base? Can the CMO quote that figure?

### D2. Full week/month reporting with delta
- Claim: revenue by day, week and month with a plus/minus % delta.
- Source: lib/landing/i18n.ts (capabilities.cards[3], which the file header notes are v2 keys "unused by the current UI").
- Why it needs confirmation: the daily revenue + delta is live; the week/month range sits in v2 copy that may not be shipped.
- Question for Jack: Are week and month reports with the delta actually shipped, or only day reports today?

### D3. Turnover / dead-stock analytics
- Claim: shows which goods sell and which sit as dead stock; suggests what to reorder and write off.
- Source: lib/landing/i18n.ts (capabilities.cards[4], v2 keys "unused by the current UI").
- Why it needs confirmation: only present in unused v2 keys.
- Question for Jack: Does the turnover / dead-stock report exist in the product today?

---

## Group E: Features stated weakly or in one place only

### E1. Loyalty program
- Claim: bonuses, discounts, promotions for regular customers.
- Source: lib/landing/i18n.ts (features[4] only; absent from ConceptLanding modules).
- Why it needs confirmation: appears in only one place and not in the module list.
- Question for Jack: Is the loyalty / bonus module shipped, or is it planned?

### E2. Multi-point / branches with consolidated reporting
- Claim: consolidated reports and cross-point cashier control for multi-location businesses.
- Source: lib/landing/i18n.ts (faq[9]); ConceptLanding.tsx (faq).
- Why it needs confirmation: a substantial feature stated only in FAQ.
- Question for Jack: Can a shop with several points really get consolidated reports and cross-point cashier control today?

### E3. Android and iOS both available
- Claim: app available on Android and iOS.
- Source: lib/landing/i18n.ts (equipLiteItems, equipLiteDesc); blog kassa-apparatsiz-savdo.ts.
- Why it needs confirmation: the curated facts flag confirmation of both platforms being live.
- Question for Jack: Are both the Android and iOS apps live and downloadable now?

### E4. Per-customer debt limit
- Claim: you can set a debt limit for each customer.
- Source: lib/blog/posts/qarz-daftar-orniga-nima.ts and kak-vybrat-kassu-dlya-magazina.ts (blog only; not on the landing).
- Why it needs confirmation: appears only in blog copy, not in the landing source.
- Question for Jack: Does the nasiya feature support a per-customer debt limit today?

---

## Group F: Security and capacity assurances

### F1. "Данные защищены" / data protected
- Claim: data is protected (PIN access, role separation, full action log).
- Source: lib/landing/i18n.ts (formSecurity, heroV2.trustLine).
- Why it needs confirmation: PIN, roles and the action log are real mechanics, but "data protected" is a broad security assurance we should not overstate.
- Question for Jack: Beyond PIN, roles and the action log, what data-protection claims are accurate? We do not want to imply more security than exists.

### F2. Unlimited cashiers during early access
- Claim: unlimited cashiers during the early-access period.
- Source: lib/landing/i18n.ts (faq[8]).
- Why it needs confirmation: explicitly bounded to early access; what happens after is unspecified.
- Question for Jack: Is "unlimited cashiers" correct for early access, and what is the limit after early access ends?

### F3. "Up to 200 receipts per day" sizing
- Claim: home-corner shop segment, 1 cashier, up to 200 receipts a day.
- Source: lib/landing/i18n.ts (segmentsV2.cards[0]); ConceptLanding.tsx (segments2).
- Why it needs confirmation: reads like a capacity figure; we treat it as a descriptive illustration only.
- Question for Jack: Is "up to 200 receipts/day" just a sizing illustration, or a real capacity figure the CMO can cite?

---

## Group G: Equipment service commitments

### G1. BirLiy delivers and installs equipment; pay in installments
- Claim: if you want, BirLiy delivers and installs the kit (tablet on a stand, 2D Bluetooth scanner, thermal receipt printer); equipment can be paid for in parts ("частями" / "bo'lib to'lash").
- Source: ConceptLanding.tsx (setup tab JSX, lines 1480-1510); lib/landing/i18n.ts (faq[3], equipFullItems).
- Why it needs confirmation: these are service and commercial commitments (a delivery/install service plus an installment payment option), not software features. We must also never invent kit prices.
- Question for Jack: Does BirLiy actually deliver and install equipment for the shop? Is installment payment for equipment really offered? What can the CMO say about kit prices (currently nothing, since none are in source)?

---

## Group H: Prohibited (mockup / contradicts stage) - never present as real

### H1. Demo dashboard numbers
- Claim: revenue 3 450 000, average check 87 000, 42 sales, +12% vs yesterday, 18 stock, 3 cashiers, 2 returns.
- Source: lib/landing/i18n.ts (heroRevenueVal, heroAvgCheckVal, heroSalesVal, miniPreviews); ConceptLanding.tsx (copy.command.*, copy.owner.metrics, lines 184-218).
- Why it is prohibited: illustrative mockup numbers in the hero and owner-panel demo. SOURCE_INDEX lists these as never-claim-as-real.
- Question for Jack: Confirm these are demo placeholders only and the CMO must never present them as real merchant metrics. (Default assumption: yes, prohibited.)

### H2. Sample receipt
- Claim: Milk 1L / Bread / Coffee 3in1, item 14 000, total 20 500.
- Source: lib/landing/i18n.ts (heroItems, heroItemPrice, heroTotalVal, heroReceiptDetail).
- Why it is prohibited: an illustrative sample transaction.
- Question for Jack: Confirm the sample receipt is illustrative only and must never be cited as a real transaction.

### H3. "Реальные магазины уже работают" / "Real shops already working"
- Claim: the hero photo badge says real shops are already working on BirLiy.
- Source: ConceptLanding.tsx (copy.meta.heroPhotoBadge, lines 87 and 302).
- Why it is prohibited: it implies a live customer base, which contradicts the stated stage (early access 2026, first pilot cohort) and the never-claim list (no shop/customer counts, no implied customer base).
- Question for Jack: Are there real shops already operating live on BirLiy with evidence we can cite? If not, the CMO must not repeat this badge, and you may want it removed from the landing.

---

## Group I: Stage and never-claim guardrails (confirm policy)

### I1. No customer counts, no result percentages, no testimonials, no named bank, no deadlines
- These never appear as facts in any source, and SOURCE_INDEX lists them as never-claim unless owner-confirmed with evidence.
- Question for Jack: Confirm the CMO must never state a number of shops/customers, any revenue/profit/time-saving %, any testimonial or named customer, any named bank or payment-processor integration, or any launch/delivery deadline beyond "early access 2026". If any of these become provable, send the evidence and we will add an approved fact.
