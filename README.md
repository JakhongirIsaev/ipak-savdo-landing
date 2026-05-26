# Ipak Savdo Landing

Lead-generation landing page for **Ipak Savdo** — POS/cashbox for SMBs in Uzbekistan, part of the Ipak Yuli Bank ecosystem.

## Architecture

- **Framework:** Next.js 14 (App Router, single-component `components/LandingPage.tsx`)
- **i18n:** Russian + Uzbek (`lib/locale.ts`)
- **Database:** Postgres via Drizzle ORM (`lib/db/`)
- **Lead intake:** `POST /api/lead` validates → inserts → fires Telegram notification
- **Admin:** `/admin/leads` (HTTP Basic Auth) — table, filters, CSV export
- **Hosting:** Railway (single service + Postgres in the same project)

## Local development

```bash
pnpm install
cp .env.example .env.local
# Fill in DATABASE_URL with a local or Railway-provided Postgres URL
pnpm db:migrate
pnpm dev
```

Landing: http://localhost:3000  
Admin: http://localhost:3000/admin/leads (set `ADMIN_USER` / `ADMIN_PASSWORD` in `.env.local`)

## Tests

```bash
pnpm test          # one-off
pnpm test:watch    # watch mode
```

## Environment variables

See `.env.example`. All six are required in production.

## Deploy

Railway service `ipak-savdo-landing`. On every push to `main`:
1. Build runs (`next build`)
2. Start command runs `pnpm db:migrate && next start` — migrations apply before the server boots

## Lead pipeline (sub-projects)

- **Sub-1 (this repo):** Lead intake + Telegram notifications + admin (shipped)
- **Sub-2 (planned):** Sales pipeline statuses + inline bot buttons + KPI dashboard
- **Sub-3 (planned):** Behavioral analytics via PostHog Cloud (funnel, heatmaps, recordings)

Design docs in `docs/superpowers/specs/`.
