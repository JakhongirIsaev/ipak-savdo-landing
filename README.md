# BirLiy Landing

Lead-generation landing page for **BirLiy** — POS/cashbox for SMBs in Uzbekistan, part of the Ipak Yuli Bank ecosystem. (Repo folder and Railway service kept the legacy `ipak-savdo-landing` name to avoid breaking deploy URLs.)

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

## Sales pipeline (Sub-2 — shipped)

- `/admin/dashboard` — 6 KPI tiles + 30-day stacked bars + funnel + top sources
- `/admin/leads/[id]` — single-lead detail + chronological event timeline
- Status transitions via inline buttons in Telegram OR via the dropdown in the leads table

### One-time webhook registration

After deploying Sub-2 to production:

```bash
TOKEN=...                                   # your bot token
SECRET=$(openssl rand -hex 32)              # save to Railway as TELEGRAM_WEBHOOK_SECRET
URL=https://your-domain/api/telegram/webhook

curl -X POST "https://api.telegram.org/bot$TOKEN/setWebhook" \
  -d "url=$URL" \
  -d "secret_token=$SECRET" \
  -d "allowed_updates=[\"callback_query\",\"message\"]"
```

Verify:

```bash
curl "https://api.telegram.org/bot$TOKEN/getWebhookInfo"
```

### Backfilling event history

For leads created before Sub-2 shipped:

```bash
pnpm tsx scripts/backfill-events.ts
```

This is idempotent — it only adds a `lead_events` row for leads that have none.
