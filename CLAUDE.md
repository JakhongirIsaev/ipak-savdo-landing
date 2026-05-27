# BirLiy Landing — project guidance for Claude

## Project context

- BirLiy: SMB workspace (POS/касса/склад/QR-оплата) для Узбекистана, экосистема Ipak Yuli Bank.
- Stack: Next.js 14 App Router, TypeScript strict, Tailwind 3, Drizzle ORM + Neon Postgres, Telegram Bot API, framer-motion, lucide-react.
- Landing: RU/UZ. Admin: RU only.
- Hosting: Railway (prod). Local dev на `.env.local` с Neon-connection.

## Design System

**Always read `DESIGN.md` before making any visual or UI decisions.**

All font choices, colors, spacing, motion, status semantics, and aesthetic direction are defined there. The canonical sources of visual truth are:
- `tailwind.config.ts` — palette + fonts + motion easing
- `app/globals.css` — CSS variables + utilities
- `app/layout.tsx` — next/font loading
- `components/LandingPage.tsx` — landing canonical implementation (single-file)
- `lib/admin/status-meta.ts` — status emoji/label/color mapping (single source)
- `lib/admin/svg-chart.tsx` — chart color palette

Do not deviate from DESIGN.md without explicit user approval. If a new requirement doesn't fit the system, surface the conflict — don't silently invent new tokens/components.

### Anti-drift rules

- **Never** add new color tokens to `tailwind.config.ts` without updating DESIGN.md in the same change.
- **Never** import from `components/Hero.tsx`, `components/Header.tsx`, `components/Footer.tsx`, or other top-level `components/*.tsx` files except `LandingPage.tsx` and `LeadForm.tsx`. The rest is orphaned legacy code (see DESIGN.md → Known Issues) and references undefined Tailwind tokens.
- **Never** hardcode hex values in className. Use Tailwind tokens (`bg-green-500`, `text-ink-700`, `border-mist`, etc.). Exception: `lib/admin/svg-chart.tsx` is allowed hex for SVG attributes.
- **Never** add chart libraries (Recharts, Chart.js). Use hand-rolled SVG following the pattern in `lib/admin/svg-chart.tsx`.

## Code conventions

- TypeScript strict mode. No `any` without explanation comment.
- Server components by default. `"use client"` only when needed (interactivity, localStorage, framer-motion).
- DB access lazy-loaded via `getDb()` to keep pure functions unit-testable without DB.
- Tests live next to source as `*.test.ts` / `*.test.tsx`. Run with `pnpm test`.
- Migrations: `pnpm db:generate` → review SQL → `pnpm db:migrate`. Never edit applied migrations.

## Don't

- Don't add features beyond what the user asked. Bug fix doesn't need a refactor.
- Don't add error handling for cases that can't happen (trust internal code).
- Don't write comments that explain WHAT (the code does that). Only WHY when non-obvious.
- Don't create markdown docs unless asked.
- Don't push to Railway without explicit user permission.
- Don't run `git reset --hard`, `git push --force`, or destructive ops without asking.
- Don't skip pre-commit hooks (`--no-verify`).

## Russian for status

User Jack prefers plain-language **Russian** for results/status explanations. He's a non-programmer in Tashkent. Avoid jargon when reporting outcomes. Code, commit messages, and file content stay in English (project convention).
