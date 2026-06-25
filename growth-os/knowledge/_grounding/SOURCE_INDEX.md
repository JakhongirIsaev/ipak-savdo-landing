# SOURCE_INDEX (internal grounding backbone)

Internal working note for the CMO Brain pack build. NOT a public deliverable.
Every build agent MUST read this first. It lists the only approved source files
and the candidate factual claims with source locations. Agents must VERIFY each
claim against the cited source; do not trust this summary blindly.

## Repo / workspace

- Production repo: `D:/birliy/ipak-savdo-landing-complete` (branch `deploy/mobile-live`, Codex is live-editing it — DO NOT TOUCH).
- Isolated worktree (write here only): `D:/birliy/wt-cmo-brain-pack` (branch `claude/cmo-brain-pack`, clean HEAD `cfeacf2`).
- Deliverable directory (ONLY allowed write target): `D:/birliy/wt-cmo-brain-pack/growth-os/knowledge/`.

## HARD RULES for every agent

1. Write ONLY under `growth-os/knowledge/`. Never edit any file outside it.
2. Never read or copy: `.env*`, `_secrets`, `node_modules`, anything under `.swarm`. No secrets in any output.
3. Read source ONLY from the paths listed below (absolute).
4. Never invent: prices, customer counts, % improvements, testimonials, integrations, deadlines, install times, team actions, or completion states.
5. Currency spelling: RU `сум`, UZ `so'm`. NEVER `UZS`. Never a bank/`Ipak Yuli`/parent-company name in public content.
6. No em-dash character (—) in any GENERATED public copy or approved-wording field. Use `:` `,` or `-`. (The live landing copy contains em-dashes; that is a known inconsistency to FLAG, not replicate.)
7. RU and UZ must carry equivalent meaning; translations must read native, not literal.
8. Every factual product claim must be tagged: VERIFIED (with source path), NEEDS_OWNER_CONFIRMATION, or PROHIBITED_FROM_PUBLIC_USE.

## Approved source files (the only grounding)

### Primary: live landing copy (truth for current public claims)
- `lib/landing/i18n.ts` — full RU+UZ landing dictionary. PRIMARY fact source.
- `components/concept/ConceptLanding.tsx` — landing structure/sections.

### Blog (14 real articles, RU+UZ, on the exact ICP pains)
- `lib/blog/index.ts`, `lib/blog/i18n.ts`, `lib/blog/types.ts`
- `lib/blog/posts/*.ts` — incl. `dokonda-nima-qolganini-telefondan-bilish`, `qarz-daftar-orniga-nima`, `uchet-v-tetradi-skolko-teryaet-magazin`, `skladskoy-uchet-v-malenkom-magazine`, `kassa-apparatsiz-savdo`, `pos-tizimi-uzbekistan-minimarket`, `magazin-uchun-dastur-telefonda-savdo`, `kak-vybrat-kassu-dlya-magazina`.

### Marketing strategy / system docs
- `marketing/01-strategy.md` (positioning/strategy)
- `marketing/02-content-system.md` (content operating model)
- `marketing/03-launch-calendar.md`, `marketing/04-video-strategy.md`
- `marketing/05-blog-ai-discovery.md`, `marketing/08-behavioral-seo-keywords.md`, `marketing/11-blog-keyword-map.md`, `marketing/12-money-keywords-onpage-spec.md`
- `marketing/CRO-audit-2026-06-01.md` (closest thing to a current-state audit)
- `marketing/content-batch-2026-06-01.md`, `marketing/content-batch-2026-06-05.md` (content examples)

### Social content briefs (real, map 1:1 to pains/hooks)
- `D:/birliy/birliy-reels/social-posts/post-0XX-*/brief.md` (13 briefs: qoldiq-nazorati, telefon-bilan-boshlash, qarz-daftar, kassa-sklad-qarz, nasiya, ombor, etc.)

### Growth-OS planning
- `D:/birliy/ai-os-upgrade/BACKLOG.md` (Growth OS backlog)
- `D:/birliy/Fable-birliy-rec/BIRLIY-WOW-LANDING.md` (positioning/wow notes)

## Named-but-missing source docs (task referenced; not present verbatim)
- `BirLiy-Growth-OS-Spec.md` -> use `ai-os-upgrade/BACKLOG.md` + `marketing/01-strategy.md` as the spec equivalent. FLAG: no canonical spec file exists.
- `panel-brief.md` -> not found. Closest: `Fable-birliy-rec/BIRLIY-WOW-LANDING.md` + social briefs. FLAG.
- `birliy-current-state-audit` -> use `marketing/CRO-audit-2026-06-01.md`. FLAG.
- Existing cmo-cloud CMO prompts: NOT on this disk (cmo-cloud is a separate Railway service). The prompt pack is built fresh; FLAG as owner question.

## Candidate facts extracted from `lib/landing/i18n.ts` (VERIFY before use)

Status legend: [LANDING] = stated on live landing (reuse exact public wording OK, but the underlying business fact may still need owner confirmation). [PROHIBITED] = mockup/never claim as real. [CONFIRM] = needs owner confirmation.

- PRICING [LANDING]: First 6 months 49 000 сум/мес (so'm/oy), then 149 000 сум/мес. "Полный функционал, без скрытых платежей", no charges without consent. Source: i18n freemium, faq "Сколько стоит", hero heroOfferNote.
- 6-MONTH PROMO [LANDING]: tied to "первая когорта" / early access. Source: i18n freemium/earlyAccess.
- EQUIPMENT [LANDING]: phone-only start, no equipment required; optional planshet + 2D Bluetooth barcode scanner + thermal receipt printer. Source: i18n equipment*, faq "Нужно ли покупать компьютер", "Можно ли подключить сканер".
- OFFLINE [LANDING]: works on weak internet; sales saved locally, auto-sync on reconnect. Source: i18n offline*, faq.
- ONBOARDING TIME [LANDING/CONFIRM]: "Подключаем за один день" / "Bir kunda ulaymiz"; cashier learns in ~30 min; personal help on day one. CONFIRM whether "1 day" is a guarantee. Source: i18n formIntro, earlyAccess, faq.
- PAYMENTS [LANDING]: Наличные / Карта(Терминал) / QR / В долг(Nasiya). QR instant, no terminal required. Source: i18n payMethods, faq "Нужен ли терминал".
- SKU BASE [LANDING/CONFIRM]: "база 9 000+ распространённых SKU", import from Excel. CONFIRM exact number is current. Source: i18n faq "Можно ли импортировать", capabilities, trustStrip catalogSize.
- BRANCHES/MULTI-POINT [LANDING]: consolidated reports + cross-point cashier control for multi-point businesses; owner sees all from phone. Source: i18n faq "несколько точках", owner.
- REPORTING [LANDING]: revenue day/week/month with delta +/-%, average check, top products, cashier performance, shift log, full action log. Source: i18n features, capabilities, owner.
- NASIYA/DEBT [LANDING]: customer debts in-app instead of paper notebook (who owes, how much, when promised). Source: i18n nasiyaCaption, faq nasiya.
- ROLES/SECURITY [LANDING]: roles Владелец/Кассир/Суперадмин (Egasi/Kassir/Superadmin), PIN login, full action log; cashiers unlimited DURING early access. Data protected. Source: i18n faq "Сколько кассиров", formSecurity, heroV2 trustLine.
- LOYALTY [LANDING]: bonuses, discounts, promotions. Source: i18n features.
- E-RECEIPT [LANDING]: electronic receipt to Telegram; printing optional. Source: i18n features, demoSteps.
- STAGE [LANDING]: early access 2026 ("Ранний доступ 2026"), first pilot cohort, Tashkent first. Source: i18n trustStrip pilot, earlyAccess.
- MADE FOR UZBEKISTAN [LANDING]: "Сделано для Узбекистана" / "O'zbekiston uchun yaratilgan" (deliberately NO bank name). Source: i18n trustStrip bank.
- CONTACTS [LANDING]: support @birliy_support_bot, channel @bir_liy, phone +998 97 421 24 54. Source: i18n support, telegramChannel, footerV2.
- DEMO NUMBERS [PROHIBITED]: 3 450 000 сум revenue, 87 000 avg check, 42 sales, "18 шт", "20 500 сум" — illustrative mockups. NEVER present as real metrics/results.

## Never-claim list (must NEVER appear as fact unless owner confirms with evidence)
- Any number of shops/customers using BirLiy.
- Any revenue/profit/time improvement % for merchants.
- Any named bank/payment-processor integration.
- Any testimonial or named customer.
- Any specific launch/delivery deadline beyond "early access 2026".
