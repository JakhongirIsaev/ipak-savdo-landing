# INTEGRATION_MAP (Deliverable 11)

How the BirLiy CMO Brain pack plugs into the runtime. This is a documentation-only map. It does NOT integrate anything into production and nothing outside `growth-os/knowledge/` is edited by this pack. The integration patch at the end is small, optional, and meant for Codex to apply AFTER its V1 content-object work is finished.

This file follows the same hard rules as the rest of the pack: currency is RU "сум" and UZ "so'm", never "UZS"; no bank, no Ipak Yuli, no parent company is named; no em-dash character; RU and UZ carry equal meaning; every product claim traces to an `APPROVED_FACTS.json` id or is openly qualified.

---

## 0. The pack at a glance

The knowledge directory `growth-os/knowledge/` holds the entire CMO brain. Nothing here runs on its own: each file is context that a runtime prompt loads. There are three runtime jobs that consume this knowledge:

- **Chat**: the cmo-cloud CMO answers a prospect or the operator in Telegram.
- **Task / content generation**: a campaign plan, a Telegram post, a blog article, an SEO brief, a weekly report, or a translation is produced (the V1 content-object pipeline).
- **QA**: a finished draft is audited before it can be published.

The files split into two kinds. **Knowledge files** (the `*.md` and `*.json` data) are the ground truth. **Prompt files** (under `prompts/`) are the per-job system prompts that tell a model which knowledge to load and how to behave. A runtime job = one prompt file + the knowledge files that prompt names.

File inventory (the sizes below are rough order-of-magnitude estimates for context-budget planning only; they drift as the pack evolves, so treat them as relative weights and run a byte count for exact numbers):

| File | Kind | Approx size |
|---|---|---|
| `COMPANY_CONTEXT.md` | knowledge | ~15 KB |
| `APPROVED_FACTS.json` | knowledge | ~59 KB |
| `BIRLIY_BRAND_VOICE.md` | knowledge | ~24 KB |
| `ICP_AND_PAIN_MAP.json` | knowledge | ~69 KB |
| `CONTENT_STRATEGY.json` | knowledge | ~24 KB |
| `HOOK_BANK.json` | knowledge | ~37 KB |
| `TEMPLATE_LIBRARY.json` | knowledge | ~32 KB |
| `QA_RULES.json` | knowledge | ~43 KB |
| `UNVERIFIED_CLAIMS_REPORT.md` | knowledge | ~11 KB |
| `_grounding/SOURCE_INDEX.md` | knowledge (internal) | ~8 KB |
| `prompts/cmo_chat_system.md` | prompt | ~12 KB |
| `prompts/campaign_planner.md` | prompt | ~14 KB |
| `prompts/telegram_generator.md` | prompt | ~18 KB |
| `prompts/blog_generator.md` | prompt | ~17 KB |
| `prompts/seo_brief_generator.md` | prompt | ~19 KB |
| `prompts/translator_uz_ru.md` | prompt | ~13 KB |
| `prompts/weekly_marketing_report.md` | prompt | ~13 KB |
| `prompts/regenerate_from_feedback.md` | prompt | ~12 KB |
| `prompts/qa_reviewer.md` | prompt | ~15 KB |
| `prompts/factual_claim_checker.md` | prompt | ~12 KB |

`SOURCE_INDEX.md` is an internal build note, not runtime context. It is listed for completeness only; runtime jobs should not load it.

---

## 1. Which knowledge file goes to which job

A short answer first, then the detail. Two files are universal: `COMPANY_CONTEXT.md` and `APPROVED_FACTS.json`. Every job loads both. Everything else is job-specific.

### 1.1 cmo-cloud chat

Driven by `prompts/cmo_chat_system.md`. The CMO answers one message at a time, so it loads the smallest sufficient set and leans on the facts file for discipline.

Load, in priority order:

1. `COMPANY_CONTEXT.md` (mandatory) - what may be claimed, qualified, never claimed; terminology; truthful-answering policy.
2. `APPROVED_FACTS.json` (mandatory) - the only source of product and price claims, each with a `status` and `safe_public_wording_ru` / `safe_public_wording_uz`.
3. `BIRLIY_BRAND_VOICE.md` (recommended) - tone, banned words, the two CTAs, the self-check.
4. `ICP_AND_PAIN_MAP.json` (recommended) - to answer at the prospect's level and lead with the right pain.

Optional, only when the message calls for it:

- `UNVERIFIED_CLAIMS_REPORT.md` when the prospect pushes on a `needs_confirmation` item (price, settlement timing, platforms) and the bot needs the exact way to qualify or route it.

Not loaded in chat: `CONTENT_STRATEGY.json`, `HOOK_BANK.json`, `TEMPLATE_LIBRARY.json`, `QA_RULES.json`, the SEO and report knowledge. Chat answers people; it does not plan campaigns or audit drafts.

### 1.2 Task / content generation

These are the V1 content-object producers. Each names its own grounding inside its prompt file; the table is the canonical map.

| Job | Prompt file | Knowledge it loads (in addition to the two mandatory) |
|---|---|---|
| Campaign plan | `prompts/campaign_planner.md` | `BIRLIY_BRAND_VOICE.md`, `ICP_AND_PAIN_MAP.json`, `CONTENT_STRATEGY.json`, `HOOK_BANK.json`, `TEMPLATE_LIBRARY.json` |
| Telegram post | `prompts/telegram_generator.md` | `BIRLIY_BRAND_VOICE.md`, `ICP_AND_PAIN_MAP.json`, `UNVERIFIED_CLAIMS_REPORT.md`, plus `HOOK_BANK.json` and `TEMPLATE_LIBRARY.json` when a hook or template is requested |
| Blog article | `prompts/blog_generator.md` | `BIRLIY_BRAND_VOICE.md`, `ICP_AND_PAIN_MAP.json`, `UNVERIFIED_CLAIMS_REPORT.md`, plus the marketing keyword/structure docs the prompt names |
| SEO brief | `prompts/seo_brief_generator.md` | `BIRLIY_BRAND_VOICE.md`, `ICP_AND_PAIN_MAP.json`, plus the marketing keyword docs |
| Weekly report | `prompts/weekly_marketing_report.md` | `CONTENT_STRATEGY.json`, plus any real runtime metrics passed in context |
| Translate RU/UZ | `prompts/translator_uz_ru.md` | `BIRLIY_BRAND_VOICE.md` (for native, non-literal parity) |
| Regenerate from feedback | `prompts/regenerate_from_feedback.md` | the same set the original artifact used, plus the QA findings being fixed |

`HOOK_BANK.json` and `TEMPLATE_LIBRARY.json` are content-generation assets. They belong to the planner and the post writers, never to chat or QA.

### 1.3 QA

Two prompts cover the gate. Run them as a separate pass from generation (a different model lane, never the same context that wrote the draft).

- `prompts/qa_reviewer.md` - the full rule gate. Loads `COMPANY_CONTEXT.md`, `APPROVED_FACTS.json`, `BIRLIY_BRAND_VOICE.md`, `UNVERIFIED_CLAIMS_REPORT.md`, and `QA_RULES.json` (the machine-readable rule set it executes).
- `prompts/factual_claim_checker.md` - the narrower fact-only gate. Loads `COMPANY_CONTEXT.md`, `APPROVED_FACTS.json`, `UNVERIFIED_CLAIMS_REPORT.md`, `_grounding/SOURCE_INDEX.md` (for the never-claim list), and `BIRLIY_BRAND_VOICE.md`.

`QA_RULES.json` is QA-only. Generation prompts should not load it; the writer writes, the reviewer judges.

---

## 2. Recommended prompt assembly order

Assemble every runtime prompt in the same layered order so the model meets the rules before the data and the data before the task. Lower layers are more authoritative.

1. **Identity and hard rules** - the prompt file's own role and non-negotiables (currency, no bank, no em-dash, RU/UZ parity, the two CTAs, fact discipline). This is the prompt file itself.
2. **Company ground truth** - `COMPANY_CONTEXT.md`.
3. **Approved facts** - `APPROVED_FACTS.json`. Placed right after company context so every later instruction is read against it.
4. **Voice and rules data** - `BIRLIY_BRAND_VOICE.md`, and for QA `QA_RULES.json`.
5. **Audience and strategy data** - `ICP_AND_PAIN_MAP.json`, `CONTENT_STRATEGY.json`, and the job-specific assets (`HOOK_BANK.json`, `TEMPLATE_LIBRARY.json`, marketing docs).
6. **Qualification reference** - `UNVERIFIED_CLAIMS_REPORT.md` (and `SOURCE_INDEX.md` for the claim checker).
7. **Runtime input** - the user message, the brief, the campaign goal, or the draft under review, plus any real runtime metrics. Always last, so it can never silently override the rules above it.

The principle: rules and facts are system-level context, the user request is user-level input. Never let step 7 outrank steps 1 to 6.

---

## 3. Maximum context size guidance

The pack is small enough that no job needs all of it. Sizes above are the budget.

- **Chat**: keep the loaded knowledge near 90 to 110 KB of text (`COMPANY_CONTEXT.md` + `APPROVED_FACTS.json` + `BIRLIY_BRAND_VOICE.md` + `ICP_AND_PAIN_MAP.json`), plus the chat prompt and the message. This is the largest standing context and the one to watch. If it grows tight, the only file safe to drop first is `ICP_AND_PAIN_MAP.json`; never drop `COMPANY_CONTEXT.md` or `APPROVED_FACTS.json`.
- **Content generation**: the planner is the heaviest because it loads strategy plus hooks plus templates (roughly 240 to 260 KB before the prompt and input). The single-post writers load less. Keep the working set under what the model can attend to comfortably; if it is tight, prefer loading the relevant slice of `HOOK_BANK.json` and `TEMPLATE_LIBRARY.json` over the whole files (see section 5 on selective loading).
- **QA**: `qa_reviewer.md` plus its five knowledge files sits around 160 KB. This must never be trimmed for size, because QA failing open is worse than QA being slow. If the budget cannot hold the QA set, run QA on a model with a larger window rather than dropping a rule file.

General rule: `APPROVED_FACTS.json` and `QA_RULES.json` are non-negotiable wherever they apply, even if it means a bigger or slower model. Trade speed for safety, never the reverse.

If the pack later grows past a comfortable single-prompt budget, split `APPROVED_FACTS.json` by `category` (pricing, product, technical, company, onboarding, support) and load only the categories a job needs. That is a future option, not needed at current size.

---

## 4. Caching recommendation

The knowledge files change rarely and are read on every job, so they are ideal prompt-cache content.

- **Cache the stable prefix.** Put the prompt identity, `COMPANY_CONTEXT.md`, and `APPROVED_FACTS.json` at the front of the context and mark that block cacheable. These three are the same for every request of a given job and dominate the token cost.
- **Cache key = content hash, not a timestamp.** Hash the bytes of each knowledge file. When a file changes, its hash changes and the cache entry is naturally invalidated. Do not cache by date; the pack can be edited mid-day.
- **Invalidate on `APPROVED_FACTS.json` or `QA_RULES.json` change immediately.** A stale fact or rule in cache is a correctness risk, not just a freshness one. Treat any edit to these two as a hard cache bust.
- **Order matters for caching.** Because section 2 puts the universal files first and the variable input last, the cacheable prefix is long and the per-request tail is short. Keep that order to maximise cache hits.
- **Chat benefits most.** The chat context is stable across an entire conversation, so cache the grounding once per session and reuse it for every turn.

A simple, robust scheme: cache per (job, set-of-file-hashes). If any loaded file's hash differs from the cached set, rebuild and recache.

---

## 5. Validation order (generate then gate)

Content is produced, then validated, then approved by a human. Never let a generator approve its own output.

1. **Generate.** The relevant content prompt (section 1.2) produces a draft and a list of the `APPROVED_FACTS.json` ids it used, in the prompt's structured output shape.
2. **Self-check inside the generator.** Each generation prompt already runs its own pre-output self-check (em-dash, currency, bank name, CTA, fact ids). This catches the obvious before the draft leaves the writer.
3. **Factual claim check.** Run `prompts/factual_claim_checker.md`. It extracts every claim and assigns `verified` / `needs_confirmation` / `prohibited` / `unsupported`. Any `prohibited` or `unsupported`, or any `needs_confirmation` that is not qualified in the draft, is an overall fail.
4. **Full QA gate.** Run `prompts/qa_reviewer.md` against `QA_RULES.json`. It returns blocking findings, warnings, and a single GO / NO-GO. One blocking finding forces NO-GO.
5. **Human approval.** Only a draft that passed steps 3 and 4 reaches a human for the publish decision.

Order rationale: claim checking first because an unsupported or prohibited claim is the most expensive defect and the cheapest to detect; the full QA gate second because it also covers tone, parity, and structure. A draft must clear both to be publishable. If the two disagree, the stricter verdict wins (NO-GO beats GO).

This validation chain maps cleanly onto the V1 content-object status flow (section 6): generation runs while the object is `generating`, validation runs before it becomes `pending_approval`, and a failed gate sends it back toward `generating` rather than forward to `publishing`.

---

## 6. How this maps to the V1 content-object workflow (read-only observation)

Read only, no edits. The V1 pipeline that Codex is building (`lib/content-objects.ts`, `lib/validators/content-object.ts`) already has the shape this pack needs:

- **Platforms** (`contentPlatforms`): `blog`, `telegram`, `instagram`, `linkedin`, `tiktok`, `pinterest`. The pack's generators cover `blog` and `telegram` today; the same grounding serves the other platforms when their generators are added.
- **Status flow** (`contentObjectTransitions`): `draft -> generating -> pending_approval -> publishing -> staged/published`, with `rejected` and `failed` as off-ramps. The pack's generate step belongs to `generating`; the pack's validation step (section 5) is the gate that must pass before `pending_approval`; a NO-GO maps to a transition back to `generating` (via `rejected` -> `generating`, both allowed in V1).
- **Drafts** carry `platform`, `version`, `format`, and `metadata.locale`. The pack's generators already emit per-locale, per-platform text, which fits `buildInitialDrafts` and `appendContentObjectDrafts` without change.

The takeaway: the pack does not need V1 to change. It plugs into the existing `generating` and `pending_approval` boundaries. The optional patch below only wires the knowledge in; it does not alter the content-object contract.

---

## 7. Fallback behaviour when a file is unavailable

Every prompt in the pack already states a fallback. This is the consolidated policy, ordered from safe to unsafe.

- **`APPROVED_FACTS.json` missing**: hard stop for any job that makes a product claim. Chat must say it cannot answer with confidence and route to `@birliy_support_bot`. Generators must refuse to produce public copy. QA must mark every product claim `R-UNSUPPORTED` / `unsupported` and fail closed. This file is irreducible.
- **`COMPANY_CONTEXT.md` missing**: same as above. Without it the model has no MAY / MUST-QUALIFY / NEVER boundaries. Refuse or route; do not improvise from memory.
- **`QA_RULES.json` missing**: QA does not skip. `qa_reviewer.md` falls back to its built-in baseline rule set (section 4 of that prompt), lowers confidence, and records the gap in `uncertainty`. It still runs the em-dash, currency, bank-name, prohibited-fact, qualify, and CTA checks.
- **`BIRLIY_BRAND_VOICE.md` missing**: proceed with reduced tone confidence. The hard rules (currency, no bank, no em-dash, CTAs) also live in `COMPANY_CONTEXT.md` and the prompt itself, so safety holds; only tone polish degrades. Note it in `uncertainty`.
- **`ICP_AND_PAIN_MAP.json`, `CONTENT_STRATEGY.json`, `HOOK_BANK.json`, `TEMPLATE_LIBRARY.json` missing**: degrade gracefully. The job runs with `COMPANY_CONTEXT.md` + `APPROVED_FACTS.json` as the irreducible minimum, produces less targeted output, and records the missing file in `uncertainty` and open questions. Never invent a hook, template, pain, or strategy that a missing file would have held.
- **A marketing doc named by a prompt but missing on disk** (for example a keyword map): do not invent its contents. Fall back to the alternative the prompt names and log the gap.
- **`UNVERIFIED_CLAIMS_REPORT.md` missing**: treat every `needs_confirmation` fact as if it still needs qualifying (the statuses are also in `APPROVED_FACTS.json`), and qualify accordingly.

The single governing rule: **fail closed, never fail open.** When grounding is incomplete, the correct outputs are "I will check with the team" (chat), "refuse and report the gap" (generation), and "NO-GO with low confidence" (QA). Silence plus an honest route beats a confident invention.

---

## 8. Optional integration patch (for Codex, AFTER V1 is complete)

This is a small, optional wiring step. Do not apply it now. It changes nothing in this pack; it only tells the production runtime where to read the knowledge from. The pack stays the single source of truth; production points at it.

Goal: make the three runtime jobs (chat, content generation, QA) load the knowledge files described above, in the assembly order of section 2, with the caching of section 4 and the fallback of section 7.

Production files likely to need a small change (names are indicative; confirm against the live repo, which this pack does not edit):

- **cmo-cloud chat prompt assembly** - wherever the cmo-cloud CMO builds its system prompt before answering Telegram. Add a loader that reads `cmo_chat_system.md` plus the chat knowledge set (section 1.1), in the section 2 order. This is the chat patch point.
- **The content-object generation path** - the V1 generator that fills a content object while it is `generating` (the code around `buildInitialDrafts` / `appendContentObjectDrafts` and whatever calls the model). Add a loader that selects the prompt file and knowledge set per platform from the section 1.2 table.
- **The QA hook** - the gate that must pass before a content object moves from `generating` to `pending_approval`. Add a step that runs `factual_claim_checker.md` then `qa_reviewer.md` (section 5), loads `QA_RULES.json`, and maps NO-GO to a transition back toward `generating` rather than forward to `publishing`.
- **A small knowledge-loader utility** - one helper that, given a job name, returns the ordered list of file paths under `growth-os/knowledge/`, reads them, hashes them for the cache key (section 4), and applies the fallback policy (section 7) when a file is absent. All three call sites use it. This is the only genuinely new code; the call sites just invoke it.

Keep the patch minimal:

- One knowledge-loader utility, three call-site edits (chat assembly, generation, QA hook). No change to the content-object schema, the status transitions, or the validators.
- The loader reads files at runtime by path; the knowledge stays in `growth-os/knowledge/` and is never copied into code.
- Cache by file-content hash; bust on any change to `APPROVED_FACTS.json` or `QA_RULES.json`.
- Fail closed: if the loader cannot read `APPROVED_FACTS.json` or `COMPANY_CONTEXT.md`, the job refuses or routes, per section 7.
- Ship it after V1, behind whatever flag the team uses, so the content-object pipeline lands first and the knowledge wiring is an additive second step.

Nothing in this section is applied by this pack. It is a recommendation for a later, separate, optional patch.
