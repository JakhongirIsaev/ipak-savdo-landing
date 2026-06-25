# CONTENT_PACK_REPORT

BirLiy CMO Brain and Content Quality Pack. Built on branch `claude/cmo-brain-pack`, in an isolated git worktree, entirely under `growth-os/knowledge/`. No production file was edited; nothing was deployed; no database, env var, or secret was touched. Parallel to and non-conflicting with Codex's V1 content-object work on `deploy/mobile-live`.

Date: 2026-06-23.

## Files created

Grounding (Deliverables 1 to 2):
- `COMPANY_CONTEXT.md` (canonical, CMO-injectable; with MAY / MUST QUALIFY / MUST NEVER lists)
- `APPROVED_FACTS.json` (46 machine-readable facts)
- `UNVERIFIED_CLAIMS_REPORT.md` (claims needing Jack's confirmation, grouped A to I)
- `_grounding/SOURCE_INDEX.md` (internal build backbone; not runtime context)

Brand and audience (Deliverables 3 to 4):
- `BIRLIY_BRAND_VOICE.md` (RU + UZ voice; 10+10 bad/good pairs; CTAs; banned phrases; AI-slop patterns)
- `ICP_AND_PAIN_MAP.json` (5 segments: 2 primary, 3 secondary; full pain/job/objection/CTA fields)

Operating model and assets (Deliverables 5 to 7):
- `CONTENT_STRATEGY.json` (7 content pillars + realistic weekly balance)
- `HOOK_BANK.json` (60 hooks: 30 RU + 30 UZ across 10 pains)
- `TEMPLATE_LIBRARY.json` (10 reusable templates)

Prompts (Deliverable 8) under `prompts/`:
- `cmo_chat_system.md`, `campaign_planner.md`, `blog_generator.md`, `telegram_generator.md`, `translator_uz_ru.md`, `qa_reviewer.md`, `factual_claim_checker.md`, `regenerate_from_feedback.md`, `weekly_marketing_report.md`, `seo_brief_generator.md`

Quality and tests (Deliverables 9 to 10):
- `QA_RULES.json` (11 blocking + 9 warning rules, each with detection_method, fail/pass examples, remediation)
- `qa_cases.jsonl` (82 cases), `generation_cases.jsonl` (25 cases), `expected_failures.md`
- `golden-campaigns/campaign-1-remote-revenue-stock.md`
- `golden-campaigns/campaign-2-faster-cashier-queues.md`
- `golden-campaigns/campaign-3-nasiya-debt-visibility.md`

Integration and validation (Deliverables 11 to 12):
- `INTEGRATION_MAP.md` (load map, prompt assembly order, optional patch for Codex; documentation only)
- `validate_pack.py` (standard-library linter) + `test_validate_pack.py` (25 unit tests)
- `CONTENT_PACK_REPORT.md` (this file)
- `.gitignore` (keeps Python caches out of the commit)

## Test results

- `python validate_pack.py`: RESULT PASS, 0 issues. Per-file counts: APPROVED_FACTS=46 facts; HOOK_BANK=60 hooks, 30 pain/angle pairs; ICP/CONTENT_STRATEGY/TEMPLATE_LIBRARY/QA_RULES parse with required keys; qa_cases=82 records; generation_cases=25 records.
- `python -m unittest test_validate_pack`: 25 tests, all OK (parse errors, missing keys, duplicate ids, RU/UZ parity gaps, em-dash, UZS, bank-name, empty values, exit codes all caught; the real pack passes).
- Adversarial verify pass (3 lenses: safety/brand, fact-check, structure): overall OK, 0 blocking, 3 warnings, all fixed (UZ Telegram CTA label standardized `Telegramda yozish` to `Telegramga yozish` across 4 files; incidental mixed-script CTA in one fail-fixture cleaned; INTEGRATION_MAP size table reframed as relative estimates).
- Manual grep of generated public `.md` copy (campaigns + prompts): zero em-dash; every UZS / Ipak / Yuli / demo-number match is in a rule-stating or QA-report-PASS context, never in public copy.

## Fact counts

- Total approved facts: 46
- Verified: 21
- Needs owner confirmation: 18
- Prohibited (never present as real): 7 (6 demo/mockup figures + the "Реальные магазины уже работают" badge)

## Asset counts

- Hooks: 60 (RU 30, UZ 30)
- Templates: 10
- QA test cases: 82 (`qa_cases.jsonl`: 32 pass, 42 fail, 8 warn) + 25 generation cases
- Golden campaigns: 3 (each with RU + UZ Telegram posts, RU/UZ/EN blog outline, QA report, facts used, assumptions, CTA, expected ContentObject metadata)
- Prompts: 10
- QA rules: 20 (11 blocking, 9 warning)

## Files modified outside growth-os/knowledge

None. `git status` shows only `growth-os/` as added. No production file, migration, config, env var, or secret was touched.

## Top 10 questions requiring Jack's confirmation

1. Pricing: Are 49 000 сум/мес (first 6 months) and 149 000 сум/мес after that the current, committed prices the CMO may quote, and is the 6-month promo still live and locked for first-cohort shops once they join?
2. Onboarding time: Is "подключаем за один день" a guarantee or just the typical case? Can the CMO promise one day, or must it say "usually"?
3. QR settlement: Can the CMO say QR payments settle instantly, or only "fast"? (Either way we never name a bank or processor.)
4. SKU base: Is "9 000+" the current size of the built-in product base, and may the CMO quote that figure?
5. Shipped vs roadmap: Which of these are actually shipped today: week/month reports with delta, turnover / dead-stock report, real-time day register, loyalty module, multi-point consolidated reporting, both Android and iOS apps, per-customer debt limit?
6. Equipment service: Does BirLiy actually deliver and install the equipment kit, and is installment ("частями") payment for it really offered? What (if anything) may the CMO say about kit prices?
7. Real customers: Are there shops already operating live on BirLiy with citable evidence? If not, the CMO must drop the "Реальные магазины уже работают" badge and treat the stage strictly as early access 2026 (and you may want the badge removed from the landing).
8. Demo placeholders: Confirm the demo dashboard numbers (3 450 000 revenue, 87 000 average check, 42 sales, +12%, 18 stock, 3 cashiers, 2 returns) and the sample receipt (20 500) are placeholders the CMO must never present as real.
9. Soft performance claims: Are "кассир осваивает за 30 минут", "начните за пять минут", and "продажа за 15 секунд" representative enough to repeat, or should they be softened?
10. Security and capacity: Beyond PIN, roles, and the action log, what data-protection claims are accurate (we do not want to imply more than exists)? Is "unlimited cashiers" only for early access, and what is the limit after? Is "до 200 чеков в день" a real capacity figure or just a sizing illustration?

## Integration note

Nothing here is wired into production. `INTEGRATION_MAP.md` documents how Codex can load this pack after its V1 work is finished (a small, optional patch to the cmo-cloud chat prompt assembly and the QA hook). Do not merge this branch into the Codex branch; integrate deliberately after V1.
