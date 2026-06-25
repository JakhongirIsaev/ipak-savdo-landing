# QA-REPORT — BIRAAA-69 (Brand & QA Guard, round 3)

VERDICT: PASS  (blog in-body images, uz/ru/en, target: birliy.uz/blog)

Scope of this PASS: the in-body image DELIVERABLE only (14 `-body-4x3.jpg` assets,
the `bodyImage` wiring in the 14 posts, and the rendered alt). It does NOT sign off
the Phase 2 locale-text rewrite that shares the deploy branch (see EVIDENCE / NEXT STEP).

Reviewed against committed blobs (the working tree is shared with a concurrent agent and
switched branches mid-review, so all checks were run via `git show` against pinned commits):
- Phase 1.5 deliverable: branch `blog/phase1-5-body-images`, commits `9147f5e` + `a2ce64b`.
- Actual deploy candidate: branch `blog/phase2-content-first`, commit `b9a6767`
  ("BIRAAA-74 add 14 body images to Phase 2 deploy branch"), which is what would ship.

## HARD-GUARDRAILS
- Ipak Yuli Bank mention: PASS  (no bank/Ipak/Yuli/Ипак/Юли in posts or alt source on either branch; images are text-free vector covers, no overlay text)
- Em-dash (U+2012/2013/2014/2015/2212): PASS  (zero U+2014 in committed gen script `a2ce64b` and `b9a6767`, zero in all 14 posts on the deploy branch; bodyImage values are ASCII URLs; alt = `c.title`, already-gated content)
- Cyrillic sum not UZS: PASS  (no currency strings introduced)
- RU/UZ(/EN) parity: PASS  (alt rendered from per-locale `c.title` at BlogArticle.tsx:144; uz/ru/en present in all 14 posts, 0 locale gaps)
- AI-slop: PASS  (no new prose in this deliverable)
- Secret leak: PASS

## PRIOR BLOCKERS — both RESOLVED
1. Football body images off-theme — FIXED. `scripts/gen-blog-images.mjs` BODY_POSTS rows for the 4 football posts now use `motif: "football"`, seeds 106-109. All 4 football body JPGs are sha256-distinct from their heroes (heroes seeds 6-9):
   - angliya-xorvatiya  hero=cd3a1fb7f5d9 body=1fb490ba0a48  distinct
   - gana-panama        hero=6884a265072b body=4ea63bb0e661  distinct
   - portugaliya-kongo  hero=da866155acfd body=47e80d56cbe0  distinct
   - uzbekiston-kolumbiya hero=d8c620cec66e body=f9383ef2ea19  distinct
2. Deploy-isolation / 404 risk — FIXED. The deploy branch `blog/phase2-content-first` (b9a6767, via BIRAAA-74) now carries all 14 `-body-4x3.jpg` assets. The 4 football body images on the deploy branch are BYTE-IDENTICAL to the corrected Phase 1.5 versions (verified sha256 MATCH). 14/14 `bodyImage` URLs on the deploy branch resolve to an existing `-body-4x3.jpg`; no broken-image risk.

## NON-BLOCKING NITS
- In-body image alt = `c.title` (BlogArticle.tsx:144), i.e. the same alt as the hero image (line 122). It is meaningful and localized (parity holds), so it satisfies "with alt", but a dedicated alt describing the themed body image would be marginally better for a11y/SEO. Not gating; the issue DoD only requires "с alt".
- `ai-dan-foyda-malumotlar-va-nazorat` body motif is "boxes" (inventory); "ai" would fit the AI-data theme slightly better. Within the shop-management motif family; not gating.

## EVIDENCE
- distinctness (deploy branch b9a6767): 14/14 body images sha256-distinct from their `-4x3.jpg` hero; 0 hero==body duplicates; 0 bad URLs (all point to `-body-4x3.jpg`).
- guardrails (deploy branch posts): em-dash scan clean, bank/Ipak/Yuli/UZS scan clean, locale parity uz/ru/en 0 gaps.
- tests/lint (run on the phase1-5 working tree before the branch switch): `tsc --noEmit` exit 0; `vitest run lib/blog` 29/29 pass (blog-seo, blog-category, blog-image); `npm run lint:copy` (textlint + prh) exit 0.
- branch topology: `blog/phase2-content-first` does NOT contain commit `a2ce64b`; it re-adds the assets independently (binary-only, "No .ts or .mjs files changed"). The body-image deliverable is therefore correctly represented on the actual deploy candidate.
- attachments: this file.

## GATE-HARDENING (recommendation, non-gating)
- `npm run lint:copy` does not scan `scripts/**`. A transient em-dash in a gen-script comment briefly appeared in the working tree during review; it is NOT in any committed blob, but to prevent any future em-dash slipping into a build script, consider adding `scripts/**/*.mjs` to the textlint glob in the `lint:copy` script.

NEXT STEP: QA gate PASSED for the BIRAAA-69 body-image deliverable. Escalating to CMO for Jack's final approval.
IMPORTANT for Publisher/CMO: this PASS clears the 14 body images + wiring + alt ONLY. The deploy branch `blog/phase2-content-first` also carries Phase 2 locale-text content (BIRAAA-65 / Writer) which is a SEPARATE QA gate and is NOT signed off here. Do not treat this PASS as clearance for the whole deploy branch; the Phase 2 text must pass its own Brand & QA review before deploy.
