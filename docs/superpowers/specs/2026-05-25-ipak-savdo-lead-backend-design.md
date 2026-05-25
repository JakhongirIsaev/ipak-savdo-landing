# Ipak Savdo — Lead Intake Backend (Sub-project 1)

**Date:** 2026-05-25
**Owner:** Jack
**Status:** Design approved, ready for implementation plan
**Scope:** Sub-project 1 of 3. Sub-projects 2 (sales pipeline) and 3 (behavioral analytics via PostHog) are out of scope for this spec but considered in the design so the schema/code extends naturally.

---

## Executive summary (RU, для Jack)

Лендинг получает форму заявки → сохраняем в Postgres → шлём уведомление в новый Telegram-бот для команды продаж → Jack может смотреть/фильтровать/экспортировать заявки в простой admin-странице с паролем. Всё хостится на Railway (один сервис лендинга + Postgres). Vercel-деплой и старый сервис `ipaksavdo-production-3f29` удаляются после успешного теста.

---

## 1. Context

The Ipak Savdo landing page (`components/LandingPage.tsx`, Next.js 14) currently has no backend — it's a static marketing site. We need to turn it into a lead generation funnel so the sales team gets notified about every interested business and Jack can see the full list with filters.

This is Sub-project 1 of a 3-stage rollout (decomposed during brainstorming):
- **Sub-1 (this spec):** Lead intake + Telegram notifications + minimal admin
- **Sub-2 (future):** Sales pipeline (status transitions, inline bot buttons, KPIs)
- **Sub-3 (future):** Behavioral analytics via PostHog Cloud (funnel, heatmaps, recordings)

## 2. Goals

- Capture leads from the landing page form into a database
- Notify the sales team in a Telegram chat the moment a lead arrives
- Provide a password-protected admin page to view/filter/export leads
- Attribute every lead to a traffic source (`?source=` query param + UTM params + referrer)
- Consolidate hosting on Railway; remove the Vercel deploy and the abandoned `ipaksavdo-production-3f29` Railway service

## 3. Non-goals

- Sales status transitions, won/lost tracking, bot inline buttons → Sub-2
- Funnel analytics, heatmaps, session recording → Sub-3 (PostHog Cloud)
- Multi-user admin with roles → not needed; one shared password
- Inbound DMs from Instagram/Telegram as separate intake channels → not needed; landing form is the single funnel, social channels drive traffic via tagged links
- Email/SMS notifications as fallback to Telegram → Telegram only is acceptable
- CAPTCHA → honeypot field + IP rate-limit are sufficient for current threat model

## 4. User flow

```
Visitor enters landing via ?source=instagram&utm_campaign=may26
        │
        ▼
Fills out form (business name, type, owner name, contact, equipment checkbox, optional comment)
        │
        ▼
Clicks "Оставить заявку"
        │
        ▼
POST /api/lead  ──┬──► Postgres INSERT INTO leads
                  │
                  └──► Telegram Bot API sendMessage to sales group chat
        │
        ▼
Visitor sees: "Спасибо! Свяжемся в течение часа."

Parallel:
Jack opens /admin/leads → enters basic-auth → sees table → filters → exports CSV
```

## 5. Architecture

**Stack:**
- Next.js 14 (existing project, App Router)
- Drizzle ORM + `postgres` driver
- Postgres on Railway (added as new service in the existing project)
- Telegram Bot API via direct `fetch` (no SDK)
- HTTP Basic Auth via Next.js `middleware.ts`
- Zod for validation
- Tailwind (existing) for admin UI

**Hosting:**
- Railway project `ipak-savdo-landing`, services:
  - `ipak-savdo-landing` (the Next.js app, already deployed)
  - `Postgres` (new service, referenced via `DATABASE_URL`)
- Removed after migration:
  - Vercel project `prj_HBRpwG0nEi7IHvRfitxqvnUjuHQJ`
  - Railway service `ipaksavdo-production-3f29` (was abandoned, never the real product)

**Why no separate bot worker:** the bot only sends messages — no incoming commands, no polling. A direct `fetch` from the API route is the simplest correct thing. A worker becomes necessary in Sub-2 when we add inline-button callbacks.

## 6. Data model

**Table: `leads`** (Drizzle ORM schema in `lib/db/schema.ts`, migrations in `drizzle/`)

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `serial` | PK | autoincrement, also used as human-readable lead number |
| `business_name` | `text` | NOT NULL | 2-100 chars |
| `business_type` | `text` enum | NOT NULL | one of: `shop`, `cafe`, `restaurant`, `market`, `beauty`, `service`, `other` |
| `business_type_other` | `text` | nullable | required iff `business_type = 'other'`, max 50 chars |
| `owner_name` | `text` | NOT NULL | 2-50 chars |
| `owner_contact` | `text` | NOT NULL | 5-100 chars, free-form (phone / @telegram / email) |
| `needs_equipment` | `boolean` | NOT NULL, default `false` | |
| `comment` | `text` | nullable | max 500 chars |
| `source` | `text` | NOT NULL, default `'direct'` | from `?source=` query param |
| `utm_source` | `text` | nullable | |
| `utm_medium` | `text` | nullable | |
| `utm_campaign` | `text` | nullable | |
| `referrer` | `text` | nullable | from `Referer` request header |
| `user_agent` | `text` | nullable | from `User-Agent` request header |
| `ip` | `text` | nullable | from `X-Forwarded-For` (Railway sets this); used for rate-limit and dedup |
| `language` | `text` enum | NOT NULL | one of: `ru`, `uz` — landing language at submit time |
| `status` | `text` enum | NOT NULL, default `'new'` | values for Sub-1: only `'new'`. Sub-2 will add `'contacted'`, `'demo'`, `'won'`, `'lost'`. |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |

**Indexes:** `created_at DESC` for admin sort, `source` for filter, `status` for future Sub-2 queries.

**Migration strategy:** Drizzle generates one initial migration. Run via `npx drizzle-kit migrate` in Railway start command.

## 7. API contract

### `POST /api/lead`

**Request body (JSON):**
```json
{
  "business_name": "BillzCafe",
  "business_type": "cafe",
  "business_type_other": null,
  "owner_name": "Иван Иванов",
  "owner_contact": "+998 90 123 45 67",
  "needs_equipment": true,
  "comment": "нужно срочно",
  "source": "instagram",
  "utm_source": "instagram",
  "utm_medium": "bio",
  "utm_campaign": "may26",
  "language": "ru",
  "_hp": ""
}
```

`_hp` is a honeypot field — must be empty. If filled, silently return 200 without writing anything.

**Validation:** zod schema in `lib/validators/lead.ts`. All length limits per data model. `business_type_other` is enforced as required-non-empty when `business_type === 'other'` and forbidden otherwise (via zod `superRefine`). On validation failure → `400 { ok: false, error: "validation", details: [...] }`.

**Rate limit:** 5 requests per 10 minutes per IP. Implemented in-memory with a Map (acceptable for a single-instance Railway deploy; revisit if we scale to multiple replicas). On limit hit → `429 { ok: false, error: "rate_limit" }`.

**Server-derived fields** (not from body): `referrer` (`Referer` header), `user_agent` (`User-Agent` header), `ip` (first comma-separated value of `X-Forwarded-For`, fallback to `req.ip` if missing), `created_at` (`now()` from Postgres), `status='new'`.

**Success response:** `200 { ok: true, id: 42 }`.

**Telegram failure handling:** if Telegram API returns non-200 or times out (3s timeout), log the error but still return `200` to the client — the lead is in the DB, sales team will see it in admin even if the notification was lost. Failures are logged to stderr (Railway captures them).

## 8. Telegram integration

**Setup steps (manual, by Jack):**
1. Open @BotFather → `/newbot` → name `Ipak Savdo Sales Bot` → username e.g. `IpakSavdoSalesBot`. Save the token.
2. Create a Telegram group "Ipak Savdo — Заявки" (or use existing sales chat). Add the bot as admin.
3. Send any message in the group, then `curl https://api.telegram.org/bot<TOKEN>/getUpdates` to fetch the `chat.id` (negative number for groups).
4. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to Railway env.

**Message format (parsemode `HTML`):**
```html
🎯 <b>Новая заявка #42</b>

🏪 <b>Бизнес:</b> BillzCafe (кафе)
👤 <b>Владелец:</b> Иван Иванов
📞 <b>Контакт:</b> +998 90 123 45 67
🛠 <b>Оборудование:</b> да
💬 <b>Комментарий:</b> «нужно срочно»

📍 <b>Источник:</b> instagram · кампания: may26
🕒 25.05.2026, 18:42 (Asia/Tashkent)

<a href="https://ipak-savdo-landing-production.up.railway.app/admin/leads?id=42">👉 Открыть в админке</a>
```

User-supplied strings (business_name, owner_name, owner_contact, comment) are HTML-escaped before interpolation to prevent injection of Telegram-formatting characters.

**Implementation:** `lib/telegram/notify.ts` exports `notifyNewLead(lead: Lead): Promise<void>` that wraps the `fetch` call. Has a 3-second timeout via `AbortController`. The `created_at` UTC timestamp is converted to `Asia/Tashkent` for the message body using `Intl.DateTimeFormat`.

## 9. Admin UI

**Route:** `/admin/leads`

**Auth:** HTTP Basic Auth in `middleware.ts`, matcher `^/admin`. Single user/password from env (`ADMIN_USER`, `ADMIN_PASSWORD`). On wrong creds → 401 with `WWW-Authenticate: Basic realm="Ipak Savdo Admin"`.

**Page structure:**
- Top bar: title, total count, "Logout" link (which clears basic-auth via browser redirect trick)
- Filter row: date range picker, source dropdown, business_type dropdown, "needs equipment" tri-state (any/yes/no), free-text search across business_name and owner_name
- Table: all columns from data model, sorted `created_at DESC`, paginated 50/page
- "Export CSV" button: streams currently-filtered set as CSV download

**Server actions:** filter state encoded in URL query params (`?from=&to=&source=&type=&equipment=&q=&page=`), no client-side filtering. CSV export is a separate route `/admin/leads/export.csv` that re-applies the same filters server-side.

**Design:** Tailwind, monochrome, dense — internal tool, not marketing surface. Reuse existing brand colors only for accents (CTA buttons green `#02691A`).

## 10. Environment variables

| Variable | Required | Source | Notes |
|---|---|---|---|
| `DATABASE_URL` | yes | Railway service reference `${{Postgres.DATABASE_URL}}` | Postgres connection string |
| `TELEGRAM_BOT_TOKEN` | yes | @BotFather | secret |
| `TELEGRAM_CHAT_ID` | yes | `getUpdates` curl | negative integer for group |
| `ADMIN_USER` | yes | Jack chooses | e.g. `jack` |
| `ADMIN_PASSWORD` | yes | generated | 32+ chars, random |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://ipak-savdo-landing-production.up.railway.app` | used in Telegram message link |

A `.env.example` is committed at repo root listing all keys with empty values.

## 11. Deploy plan

**Order matters — do not delete old infra until new infra is verified.**

1. Implement code on a branch, open PR
2. On Railway, in project `ipak-savdo-landing`:
   - Add Postgres service
   - Wire `DATABASE_URL` via service reference
   - Add all other env vars
3. Merge PR → Railway auto-deploys. Start command is `npx drizzle-kit migrate && next start` so migrations apply automatically before the server boots.
4. Verify migration applied: `railway run psql -c '\dt'` should list `leads`
5. Submit a real test lead from the live landing
6. Verify: Telegram message arrives in sales chat AND row appears in `/admin/leads`
7. Only after both verified — cleanup:
   - `vercel project rm ipak-savdo-landing --yes` (or via dashboard)
   - Delete `ipaksavdo-production-3f29` service in Railway dashboard
   - Commit removal of `.vercel/` from repo
8. Update README with the new architecture and admin URL

## 12. Error handling and observability

- **Validation errors** → `400` with details, surfaced to user as field-specific error messages
- **Rate limit** → `429` with friendly Russian/Uzbek message ("Слишком много заявок с одного устройства, попробуйте через 10 минут")
- **DB write fails** → `500`, error logged with full lead payload (so we can replay manually). User sees "Ой, что-то сломалось, напишите в Telegram @..." with a recovery channel
- **Telegram fails** → swallowed (lead is in DB), logged
- **Basic auth fails** → `401`, browser re-prompts
- All errors logged to stderr (Railway captures and exposes in dashboard logs)

## 13. Acceptance criteria

- [ ] Submitting the form from the live landing creates a row in `leads` and sends a Telegram message within 3 seconds
- [ ] `?source=instagram` in URL is captured in the row
- [ ] UTM params in URL are captured
- [ ] Validation rejects empty `business_name`, invalid `business_type`, contact shorter than 5 chars
- [ ] Honeypot submission silently returns 200 without writing
- [ ] 6th rapid submission from same IP within 10 min returns 429
- [ ] Telegram message renders with bold labels, escapes user-supplied chars
- [ ] `/admin/leads` requires basic auth; correct creds show the table
- [ ] Filters and CSV export work
- [ ] Vercel project removed, abandoned Railway service removed, `.vercel/` removed from repo
- [ ] Landing is reachable only via `ipak-savdo-landing-production.up.railway.app`

## 14. Open questions / future work

- **Custom domain** (`ipaksavdo.uz`?): out of scope, can be added in 10 minutes via Railway custom domain settings when Jack has DNS
- **Sub-2 schema impact:** `status` enum will gain values, `assigned_to`, `last_contacted_at`, `notes` columns may be added — non-breaking migrations
- **Sub-3 PostHog integration:** events fired from form (`lead_form_viewed`, `lead_form_started`, `lead_form_submitted`) — additive, no impact on Sub-1 design
- **Multi-language admin:** out of scope, Russian-only

## 15. Reference / file plan

New files (this sub-project):
- `app/api/lead/route.ts` — POST handler
- `app/admin/leads/page.tsx` — admin table
- `app/admin/leads/export.csv/route.ts` — CSV streaming
- `middleware.ts` — basic auth for /admin
- `lib/db/index.ts` — Drizzle client
- `lib/db/schema.ts` — table definitions
- `lib/validators/lead.ts` — zod schema
- `lib/telegram/notify.ts` — Telegram send wrapper
- `lib/rate-limit.ts` — in-memory limiter
- `drizzle.config.ts`
- `drizzle/0000_initial.sql` — generated migration
- `.env.example`

Modified files:
- `components/LeadForm.tsx` — currently has 4 fields (name, phone, business_type, optional comment) and a stub `onSubmit` that just sets `sent=true`. Need to:
  - Add `business_name` input (separate from owner name)
  - Add `needs_equipment` checkbox
  - If `business_type === 'other'` selected, reveal `business_type_other` input
  - Add hidden honeypot `_hp` input
  - Replace stub `onSubmit` with real `fetch('/api/lead', ...)` call
  - Surface validation errors per-field
  - On success: keep current "thank you" UI, but actually wait for `200` before showing it
- `components/LandingPage.tsx` (or wherever LeadForm is mounted) — read `?source=`, `?utm_*` from `window.location` once on mount and pass to LeadForm as props (or use a small React context)
- `package.json` — add deps: `drizzle-orm`, `drizzle-kit`, `postgres`, `zod`
- `README.md` — document new architecture
- `next.config.js` — verify `output: 'standalone'` still works with API routes (it does, just sanity-check)

Deleted:
- `.vercel/` directory
