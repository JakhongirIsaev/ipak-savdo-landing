# Expected failures (QA golden cases, part 1)

This document explains every blocking failure category the QA gate must catch, why it is unpublishable, a concrete failing example, and the rule id it trips in `QA_RULES.json`. It pairs with `qa_cases.jsonl`, the machine-readable golden set. The two together are the regression suite for both consumers of the rules: `validate_pack.py` (mechanical linter) and the LLM QA reviewer.

Reading rule: any single blocking hit forces NO-GO regardless of warnings. PASS only if zero blocking rules fire. WARN if zero blocking and one or more warnings fire.

Note on this document: the failing examples below are quoted deliberately so a reviewer can see exactly what a violation looks like. The em-dash and en-dash inside the two dash examples (B05) are intentional demonstrations of the banned characters, not a slip in this prose. Everywhere else in this file, dashes are plain hyphens.

---

## B01: forbidden company or bank mention

Why it fails: no bank, no parent company, and no payment processor may ever be named in public copy. The only allowed origin or trust line is "Сделано для Узбекистана" / "O'zbekiston uchun yaratilgan" (`fact_made_for_uzbekistan`), and it must never be expanded to name or imply an entity, even an unnamed "known bank".

Failing example (RU): "Касса BirLiy от Ipak Yuli Bank. Оставить заявку: birliy.uz"

Also fails, by implication: "Сделано для Узбекистана при поддержке банка." This expands the trust line to imply a bank backer.

Rule tripped: `B01_forbidden_company_or_bank_mention`. Note that "процессинг", "эквайринг", "платёжная система" as a partner, and "банковское шифрование" all trip the same processor or bank pattern even when no specific name is written.

Remediation: delete the entity name entirely. If an origin signal is needed, use only the approved trust line with no addition.

---

## B02: unsupported factual claim (fabrication)

Why it fails: every product claim, price, number, capability, count, percentage, or completion state must trace to an id in `APPROVED_FACTS.json`. A factual claim with no backing approved fact is fabrication. Any standalone quantity that is not on the approved allowlist (for example 49 000, 149 000, 9 000, 30, 100, 6, 200, 2026, the contact phone) is a fire.

Failing example (RU): "Старт всего за 19 000 сум/мес. Оставить заявку: birliy.uz" The number 19 000 is not an approved figure; the only approved starting price is 49 000 (`fact_pricing_promo`).

Other shapes that fail here: an invented capacity ("выдерживает до 1000 чеков в день"), an invented offline duration ("до 72 часов подряд"), an invented loyalty bonus ("5% bonus"). None of these have an approved fact, so they are fabrication by construction.

Rule tripped: `B02_unsupported_factual_claim`. Result, count, integration, deadline, and testimonial claims also fire the more specific rules B03, B08, B09 below.

Remediation: cite an approved fact id that genuinely supports the claim, or remove the claim. For numbers, use only approved figures with their exact wording. Route any true-but-unlisted claim to the owner via `UNVERIFIED_CLAIMS_REPORT`.

---

## B03: fabricated result, metric, or prohibited demo number

Why it fails: no merchant result, revenue, profit, time-saving, growth percentage, shop or customer count, or any prohibited demo dashboard or receipt number may be presented as real. This also covers the "real shops already working" badge, which contradicts the early-access stage.

Failing example (RU), result percentage: "Магазины с BirLiy продают на 30% больше. Оставить заявку: birliy.uz"

Failing example (RU), prohibited demo numbers: "Сегодня выручка 3 450 000 сум, средний чек 87 000." These are the mockup figures from `fact_demo_revenue` and `fact_demo_avg_check`, never real metrics.

Failing example (RU), customer count: "Уже 500 магазинов работают на BirLiy."

Failing example (RU and UZ), the prohibited badge: "Реальные магазины уже работают на BirLiy." / "Haqiqiy do'konlar allaqachon ishlamoqda." (`fact_real_shops_badge`).

Rule tripped: `B03_fabricated_result_or_metric`. The demo numbers also overlap `B07` because the underlying facts are status "prohibited".

Remediation: describe the capability instead (you can SEE revenue, average check, top products), citing `fact_reporting` or `fact_owner_remote`. State the stage honestly with `fact_stage_early_access`. Never reuse demo numbers or the badge.

---

## B04: missing required language

Why it fails: when an artifact is declared bilingual, or is a key piece (launch or offer) that requires both RU and UZ, each required language version must be present and non-empty. A missing language, a placeholder, or a slot that simply duplicates the other language is blocked.

Failing example (offer post, empty UZ): `{ languages: ['ru','uz'], ru: 'Первые 6 месяцев: 49 000 сум/мес, дальше 149 000. Оставить заявку: birliy.uz', uz: '' }`

Failing example (UZ slot is a Cyrillic copy of RU): `{ languages: ['ru','uz'], ru: 'Старт 49 000 сум. Оставить заявку: birliy.uz', uz: 'Старт 49 000 сум. Оставить заявку: birliy.uz' }` The UZ slot has no Latin Uzbek markers, so it counts as a missing UZ version (and also trips B06 for the Cyrillic "сум" inside the UZ block).

Rule tripped: `B04_missing_required_language`. A "TODO" placeholder in a required slot trips both B04 and B10.

Remediation: provide a native, non-placeholder version in every required language. Build UZ from the human-written `safe_public_wording_uz` in `APPROVED_FACTS.json`, not a transliteration of RU.

---

## B05: em-dash character

Why it fails: the em-dash family (em dash, en dash, horizontal bar) is banned in all generated public copy, hooks, CTAs, examples, and outlines. The live landing's em-dashes are a known inconsistency to flag, never to copy. A plain hyphen-minus is allowed.

Failing example (RU, em dash): "BirLiy — это касса, склад и оплаты в одном приложении."

Failing example (UZ, en dash): "Kassa, ombor va to'lovlar – bitta ilovada."

Rule tripped: `B05_em_dash_character`. (The two dash characters in the examples just above are the intentional demonstration of the violation.)

Remediation: replace every em or en dash with a colon for a lead-in, a comma for a pause, or a plain hyphen. Re-scan to confirm zero banned codepoints.

---

## B06: forbidden currency notation

Why it fails: currency is written "сум" in RU and "so'm" in UZ. "UZS" is banned everywhere. Cyrillic "сум" must not appear inside a UZ body, and amounts must use a space as the thousands separator.

Failing example (RU, UZS): "Старт 49 000 UZS в месяц первые 6 месяцев."

Failing example (UZ, Cyrillic currency): "Birinchi 6 oy oyiga 49 000 сум, keyin 149 000."

Failing example (RU, no space separator): "Первые 6 месяцев 149000 сум." The amount must be written "149 000 сум".

Rule tripped: `B06_forbidden_currency_notation`.

Remediation: write "сум" in RU, "so'm" in UZ, never "UZS". Use a space thousands separator (49 000, 149 000). Keep the currency word in the correct script for each language.

---

## B07: unqualified needs-confirmation claim (or prohibited fact stated as real)

Why it fails: facts whose status is "needs_confirmation" in `APPROVED_FACTS.json` must be stated as a pilot, early-access, or typical condition, never as a hard guarantee. Presenting such a fact with a guarantee word, or presenting a "prohibited" fact as real, is blocked.

Failing example (RU, QR settlement guarantee): "Деньги от QR поступают на счёт мгновенно, гарантированно." `fact_qr_no_terminal` is needs_confirmation on settlement timing; "мгновенно, гарантированно" turns it into a guarantee.

Failing example (UZ, one-day onboarding guarantee in a bilingual mismatch): a UZ slot reading "Bir kunda ulashga kafolat beramiz" while the RU slot correctly qualifies with "обычно". `fact_onboarding_one_day` must stay typical, not guaranteed, and parity of claim strength must hold across languages.

Failing example (RU, unshipped feature as live): "Программа лояльности уже работает в приложении." `fact_loyalty` is needs_confirmation; "уже работает" overstates it (this also trips B09).

Rule tripped: `B07_unqualified_needs_confirmation_claim`.

Remediation: add a stage or typicality qualifier ("на старте", "в раннем доступе", "обычно" / "startda", "erta kirishda", "odatda") and drop guarantee words. For QR, say "терминал не нужен" and "быстро", never "мгновенно гарантированно".

---

## B08: fabricated testimonial

Why it fails: there are zero approved testimonials. Any quoted satisfied-customer voice, named or anonymous, is fabrication. The brand's own first-person ("мы помогаем") is not a testimonial and does not fire.

Failing example (RU): "«Теперь я вижу выручку с телефона, очень удобно», Алишер, владелец магазина в Чиланзаре."

Failing example (UZ): "«BirLiy bizning savdoni o'zgartirdi», Toshkentlik do'kon egasi."

Rule tripped: `B08_fabricated_testimonial`.

Remediation: remove the quote and attribution. Describe the capability in BirLiy's own calm voice tied to an approved fact. A real testimonial can be published only after it becomes an approved fact with evidence.

---

## B09: fabricated deadline, or roadmap presented as done

Why it fails: no launch, delivery, or availability deadline beyond "ранний доступ 2026" / "erta kirish 2026" may be stated, and no planned item may be presented as already shipped. Inventing a date, a "launching on X", a countdown, or a "уже доступно" for an unconfirmed feature is blocked.

Failing example (RU, invented date): "Полный запуск 1 сентября 2026. Оставить заявку: birliy.uz"

Failing example (RU, countdown scarcity): "Осталось 3 дня до старта продаж, успейте!"

Failing example (RU, roadmap as done): "Команда BirLiy только что выпустила маркетплейс, он уже доступен в приложении."

Rule tripped: `B09_fabricated_deadline_or_roadmap_as_done`. Unshipped needs_confirmation features stated in the present tense also overlap B07.

Remediation: use only "ранний доступ 2026" / "erta kirish 2026". Add no other date or countdown. Present plans explicitly as plans ("что дальше"), never as shipped. Cite `fact_stage_early_access`.

---

## B10: empty or placeholder artifact

Why it fails: an artifact with no usable body, or one that is only a template skeleton, is not publishable. This includes whitespace-only bodies, unfilled bracket slots from `02-content-system.md`, and TODO or TBD markers.

Failing example (whitespace only): `{ ru: '   ' }`

Failing example (unfilled template): "[Узнаваемая проблема в 1-2 строки.]\n\n[CTA.]"

Rule tripped: `B10_empty_or_placeholder_artifact`. These cases also trip B11 because no real CTA is present.

Remediation: write real copy that fills every slot, tied to approved facts, ending in an approved CTA. Remove all bracket placeholders and TODO markers.

---

## B11: missing or non-approved CTA

Why it fails: every public piece must end with exactly one of the two approved CTAs. No CTA, a non-approved CTA, or more than one CTA makes it unpublishable. Approved: "Оставить заявку" to birliy.uz (#lead) / "Ariza qoldirish"; and "Написать в Telegram" to +998 97 421 24 54 / "Telegramga yozish".

Failing example (no CTA): "49 000 сум/мес первые 6 месяцев. Полный функционал, без скрытых платежей." Factually sound, but there is no closing action.

Failing example (non-approved CTA): "Купите BirLiy прямо сейчас на нашем сайте! Подписывайтесь в Instagram."

Failing example (more than one CTA): "Оставить заявку: birliy.uz. Или напишите в Telegram: +998 97 421 24 54. Или позвоните." Three actions, one of them non-approved.

Rule tripped: `B11_missing_required_cta`.

Remediation: end with exactly one approved CTA on its own line. Remove any other call to action, link, or handle used as the action.

---

## Cross-cutting categories the golden set also exercises

These are not separate blocking rules but recurring failure shapes that the golden cases stress, mapping onto the rules above:

- Unsupported claim cluster (`unsupported_*` cases): invented capacity, partner, security, offline-duration, and loyalty-specifics numbers. They fail mainly under B02, and under B01 or B07 when they also name a partner or overstate an unconfirmed fact.
- Hallucinated operation status (`hallucinated_op_*` cases): "campaign already started", "team just shipped X", "apps fully launched today", "financial services live now", "pilot already complete". These self-narrate a company action or completion state with no approved fact and present it as done. They fail under B09 (roadmap or completion presented as done) plus B02, B03, or B07 depending on the specific overstatement, and they contradict the calm-stage honesty rule (early access 2026, first cohort).
- Parity cases (`parity_*` cases): bilingual pieces where claim strength, CTA action, currency script, or language presence diverges between RU and UZ. A strength divergence (one side qualifies, the other guarantees) is blocking under B07; a Cyrillic-duplicate UZ slot is blocking under B04 and B06; a CTA-action mismatch where both CTAs are individually approved is a quality warning, not a block.

## Warning-level shapes (publishable but below brand quality)

These never force NO-GO on their own. They are included in the golden set as WARN cases so the reviewer does not over-block: generic AI openers and self-narration (W01), wall-of-text paragraphs (W02), vague unanchored benefits (W03), tech jargon and anglicisms (W04), weak label or stakeless-question hooks (W05), literal RU-calque Uzbek (W06), triad adjective padding and duplicated meaning (W07), inconsistent product terminology or misspelled brand (W08), and soft hype, fake scarcity, superlatives, or an emoji wall that is not itself a factual fabrication (W09). A key guard inside W04: "функционал" is allowed only inside the exact approved price line "полный функционал", so a clean offer post must pass, not warn.
