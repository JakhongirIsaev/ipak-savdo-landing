# BirLiy — Sales Pipeline & KPI Dashboard (Sub-project 2)

**Date:** 2026-05-26
**Owner:** Jack
**Status:** Design approved, ready for implementation plan
**Scope:** Sub-project 2 of 3. Sub-1 (lead intake) shipped; Sub-3 (PostHog behavioral analytics) remains separate.

---

## Executive summary (RU, для Jack)

Каждое сообщение о новом лиде в Telegram-боте получает 4 inline-кнопки (`В работу / Демо / Выигран / Проигран`). Нажатие меняет статус лида в БД, ведёт audit-лог кто и когда, и редактирует сам сообщение бота. В админке появляется `/admin/dashboard` с цифрами-плитками (лиды за день/неделю/месяц, конверсия, медианное время до контакта) и парой простых SVG-чартов (лиды по дням stacked по source, воронка по статусам). `/admin/leads` расширяется — статус-колонка с цветной точкой, dropdown для смены статуса прямо в строке, клик на ID открывает страничку лида с timeline-ом всех изменений.

---

## 1. Context

Sub-1 shipped a lead intake pipeline: landing form → POST /api/lead → Postgres + Telegram notification → /admin/leads with filter + CSV export. The `leads` table already includes a `status` column with enum `["new", "contacted", "demo", "won", "lost"]` (defaulted to `"new"`), but no UI ever transitions it.

Sub-2 makes that status field actionable. The sales team — currently Jack solo, plus 1-5 sellers later — needs:
- Cheap-and-fast status transitions without leaving Telegram
- An at-a-glance KPI view to see whether the funnel is healthy
- An audit trail for every status change

## 2. Goals

- Allow status transitions on every new-lead Telegram notification via 4 inline buttons
- Sync those status changes into the DB atomically with an audit-log row
- Reflect the latest status in the original Telegram message (edit in place)
- Surface KPIs in a new `/admin/dashboard` page: 6 numeric tiles + 2 SVG charts
- Add an in-row status dropdown + a lead-detail view (`/admin/leads/[id]`) with full timeline
- Stay within single-shared-admin auth model — no multi-user identity

## 3. Non-goals

- Multi-user assignment (per-lead `assignee` column) — single shared admin is enough for 1-5 sellers; revisit later if team grows
- Kanban-board UI — table-with-dropdown is enough at this stage
- PostHog or any behavioral analytics — Sub-3
- Email / SMS notifications when status changes — Telegram message edit is sufficient
- Charts beyond stacked-bars-by-day + funnel-by-status — no cohort, no retention curves
- Recharts or any chart library — hand-rolled SVG (~50 lines) keeps bundle slim and brand-aligned
- Custom statuses (workflow builder) — fixed 5-state enum is intentional

## 4. User flow

### 4a. Sales-team flow (Telegram-driven)
```
New lead arrives → Telegram message with 4 inline buttons
  ↓
Jack taps "Демо"
  ↓
Telegram POSTs callback to /api/telegram/webhook
  ↓
Server: validate secret → UPDATE leads.status → INSERT lead_event → editMessageText
  ↓
Jack sees the same message but status now reads "📅 demo · @science369 · 18:47"
  ↓
Buttons updated: "Демо" disabled, "Выигран"/"Проигран" still active
```

### 4b. Admin-team flow (browser-driven)
```
Jack opens /admin/dashboard
  ↓
6 tiles + 2 SVG charts render server-side (single SQL query per panel)
  ↓
Jack clicks a tile → drills into /admin/leads pre-filtered
  ↓
In the leads table, the status column shows colored dot + label
  ↓
Jack changes status via in-row dropdown → POST /api/admin/leads/:id/status
  ↓
Same server logic as the bot path (UPDATE + INSERT event), but actor="admin@web"
```

### 4c. Lead-detail flow
```
Jack clicks #42 in any admin table
  ↓
/admin/leads/42 renders: all lead fields + chronological event timeline
  ↓
Each event: "from_status → to_status by actor at timestamp (TZ Tashkent)"
```

## 5. Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Next.js service on Railway (existing)                         │
│                                                                │
│   Existing:                                                    │
│     POST /api/lead              ─┐                             │
│     /admin/leads (table)         │                             │
│     /admin/leads/export.csv      ├─► Postgres (Railway)        │
│     middleware (basic auth)      │                             │
│                                  │                             │
│   NEW in Sub-2:                  │                             │
│     POST /api/telegram/webhook  ─┤                             │
│     POST /api/admin/leads/:id/status ─┤                       │
│     GET  /admin/dashboard       ─┤                             │
│     GET  /admin/leads/[id]      ─┤                             │
│     lib/telegram/buttons.ts      │ (callback_data + keyboard)  │
│     lib/telegram/webhook.ts      │ (handler core, testable)    │
│     lib/admin/kpi.ts             │ (SQL aggregation helpers)   │
│     lib/admin/svg-chart.ts       │ (pure SVG renderers)        │
│                                  │                             │
│   notifyNewLead (extended) ──────┘                             │
│   formatLeadMessage (extended)                                 │
│                                                                │
│   ▲ Telegram Bot API                                           │
│   │ (sendMessage with inline_keyboard, editMessageText,        │
│   │  answerCallbackQuery, setWebhook)                          │
│   └──────────────────────────────────────────────────────────  │
└────────────────────────────────────────────────────────────────┘
```

**Why no separate bot worker:** the Sub-1 spec already argued for this. Sub-2 adds two-way interaction, but Telegram's webhook model means we still don't need a long-polling worker — we just expose a new POST endpoint and call `setWebhook` once.

**Webhook security:** Telegram supports a `secret_token` set at `setWebhook` time. The token is then sent in `X-Telegram-Bot-Api-Secret-Token` on every POST to our endpoint. Validated with constant-time compare against `TELEGRAM_WEBHOOK_SECRET` env var. Mismatched → 401 immediately.

## 6. Data model changes

### 6a. Extend `leads` table

Add 3 columns (migration `drizzle/0001_sales_pipeline.sql`):

| Column | Type | Notes |
|---|---|---|
| `last_status_change_at` | `timestamptz` nullable | Updated whenever `status` changes. NULL for leads still at default `"new"`. |
| `last_changed_by` | `text` nullable | Actor name — `@telegram_username` for bot transitions, `"admin@web"` for in-app transitions, `NULL` for never-changed. |
| `telegram_message_id` | `text` nullable | The message_id returned by `sendMessage` when we first notified about the lead. Stored so callback handler can `editMessageText` later. Also `telegram_chat_id` is the same TELEGRAM_CHAT_ID env var so we don't denormalize that one. |

### 6b. New `lead_events` table

```sql
CREATE TABLE lead_events (
  id            serial PRIMARY KEY,
  lead_id       integer NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_status   text,                           -- nullable for the first 'new' creation row
  to_status     text NOT NULL,
  actor         text NOT NULL,                  -- '@username' | 'admin@web' | 'system'
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lead_events_lead_idx ON lead_events (lead_id, created_at DESC);
```

A row is INSERTed at every status change. The first row (created at lead-intake time) has `from_status = NULL, to_status = 'new', actor = 'system'` so the timeline always starts from a known point.

### 6c. Drizzle schema additions

`lib/db/schema.ts` gets:
```ts
export const leads = pgTable("leads", {
  // … existing columns …
  lastStatusChangeAt: timestamp("last_status_change_at", { withTimezone: true }),
  lastChangedBy: text("last_changed_by"),
  telegramMessageId: text("telegram_message_id"),
});

export const leadEvents = pgTable("lead_events", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status", { enum: leadStatuses }).notNull(),
  actor: text("actor").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  leadIdx: index("lead_events_lead_idx").on(t.leadId, t.createdAt),
}));

export type LeadEvent = typeof leadEvents.$inferSelect;
```

## 7. Telegram protocol

### 7a. Message format (extension of Sub-1's `formatLeadMessage`)

Add a status line as the first line:
```
{statusEmoji} <b>{statusUpper}</b> {actorSuffix}

🎯 <b>Новая заявка #42</b>
🏪 <b>Бизнес:</b> …
…
```

`statusEmoji` and `statusUpper` mapping:
| status | emoji | label |
|---|---|---|
| new | 🆕 | NEW |
| contacted | 📞 | CONTACTED |
| demo | 📅 | DEMO |
| won | 🏆 | WON |
| lost | ❌ | LOST |

`actorSuffix` is empty for `new` (no actor yet), otherwise `· @actor · DD.MM HH:MM` in Asia/Tashkent.

### 7b. Inline keyboard

```ts
const keyboardForStatus = (leadId: number, current: LeadStatus): InlineKeyboardMarkup => ({
  inline_keyboard: [[
    btn("✅ В работу", `lead:${leadId}:contacted`, current === "contacted"),
    btn("📅 Демо",     `lead:${leadId}:demo`,      current === "demo"),
    btn("🏆 Выигран",  `lead:${leadId}:won`,       current === "won"),
    btn("❌ Проигран", `lead:${leadId}:lost`,      current === "lost"),
  ]],
});
```

`btn(label, callback_data, isCurrent)` returns `{text: isCurrent ? `· ${label} ·` : label, callback_data}` so the current status is visually framed (Telegram doesn't support real disabling, but text framing is the standard convention).

`callback_data` MUST be ≤ 64 bytes per Telegram limit. `lead:NNNNN:contacted` = 22 bytes, safe.

### 7c. `notifyNewLead` (extended)

After `sendMessage` succeeds:
1. Capture `response.result.message_id`
2. `UPDATE leads SET telegram_message_id = $1 WHERE id = $2`

So future callback handlers know which message to edit.

If `sendMessage` failed (Sub-1's "silent failure" path), `telegram_message_id` stays NULL. Callback handler degrades gracefully (just updates DB, skips edit).

### 7d. Webhook handler `POST /api/telegram/webhook`

```ts
1. Validate X-Telegram-Bot-Api-Secret-Token header (constant-time) → 401 if mismatch.
2. Parse update body. Branch:
   - update.callback_query → handleCallback(update.callback_query)
   - update.message and message.text === '/start' → reply with a short "Hi, this bot only sends lead notifications." text. (Optional, polite.)
   - else → ignore, return 200.
3. handleCallback:
   a. Parse callback_data = `lead:{id}:{status}`. Validate id is int, status is in enum.
   b. Read current lead. If lead.status === target status, skip UPDATE but still answerCallbackQuery + return 200 (idempotent).
   c. UPDATE leads SET status, last_status_change_at=now(), last_changed_by=actor.
   d. INSERT lead_events (lead_id, from_status, to_status, actor).
   e. editMessageText with formatLeadMessage(refreshed lead) and a fresh keyboard.
   f. answerCallbackQuery (silent — no toast on the user's side).
   g. Return 200.
4. On exception: log, answerCallbackQuery with error toast, return 200 (Telegram retries only on 5xx, and we don't want retries for app-level errors).
```

`actor` = `'@' + callback_query.from.username` if username present, else `'@' + callback_query.from.id`.

## 8. Web admin POST `/api/admin/leads/:id/status`

Same logic as 7d step c-d, but actor=`'admin@web'`. Also editMessageText if `telegram_message_id` is set (so dashboard changes also reflect in the Telegram thread). Body: `{ to_status: LeadStatus }`. Auth: middleware basic-auth (already in place).

## 9. KPI computation

Each tile is one SQL query, each chart is one SQL query. All execute on every page request — no caching for now (volume is tiny). Asia/Tashkent timezone for all `today`/`this week`/`this month` boundaries.

```sql
-- Today (Tashkent midnight)
SELECT count(*) FROM leads
WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Tashkent') AT TIME ZONE 'Asia/Tashkent';

-- Yesterday for delta — same shape, shifted

-- 7-day, 30-day similar with date_trunc + interval

-- Total leads
SELECT count(*) FROM leads;

-- Conversion new→won (entire history)
SELECT
  count(*) FILTER (WHERE status = 'won')::float
  / NULLIF(count(*), 0) AS conv
FROM leads;

-- Median time from 'new' to 'contacted' (using lead_events)
SELECT percentile_cont(0.5) WITHIN GROUP (
  ORDER BY EXTRACT(epoch FROM (e2.created_at - e1.created_at))
) FROM lead_events e1
JOIN lead_events e2 ON e1.lead_id = e2.lead_id
WHERE e1.from_status IS NULL AND e1.to_status = 'new'
  AND e2.from_status = 'new' AND e2.to_status = 'contacted';
```

**Funnel** (one query):
```sql
SELECT status, count(*) FROM leads GROUP BY status;
```
Render as horizontal bars with percentages relative to total.

**Source-stacked daily bars** (one query):
```sql
SELECT
  date_trunc('day', created_at AT TIME ZONE 'Asia/Tashkent')::date AS day,
  source,
  count(*) AS n
FROM leads
WHERE created_at >= now() - interval '30 days'
GROUP BY day, source
ORDER BY day;
```
Render as SVG stacked bars, X-axis = 30 days, Y-axis = lead count, color slots = `green-500` / `green-300` / `ink-500` / `mist` for top 4 sources (others bucketed as "other" in `ink-700`).

All KPI helpers live in `lib/admin/kpi.ts` as discrete async functions: `getLeadCounts()`, `getConversionRate()`, `getMedianTimeToContact()`, `getDailyLeadsBySource()`, `getFunnel()`. Each returns a plain typed object.

## 10. Admin UI changes

### 10a. `/admin/dashboard` (new page)

Server component. Calls all 5 KPI helpers in parallel via `Promise.all`. Renders:
- Top row: 6 tiles in a 3-col grid (collapses to 2-col on tablet, 1-col on mobile). Each tile: small Manrope eyebrow + Sora 600 large number + tiny delta (`↑ 12% от прошлой недели` in green or `↓ 8%` in `ink-500`).
- Mid row: 1 big stacked-bar chart `Лиды за 30 дней`, full-width SVG, ~280px tall.
- Bottom row (2 columns): funnel chart on the left, top-5 sources by win% on the right.
- All cards/charts: paper bg, mist hairline borders, ink type. **Zero green except the green-500 bar slot for `instagram` source and the green delta-up arrows.** Brand recipe holds.

Nav link in admin shell: `Dashboard | Leads | Export CSV`.

### 10b. `/admin/leads` (extension)

Add a status column to the existing table:
- Colored dot + label: `🆕 new` / `📞 contacted` / `📅 demo` / `🏆 won` / `❌ lost` with brand-aligned ink-color (only `won` is in green-500, rest in ink-700/info-blue/warn-yellow/stop-red).
- Click on the colored dot opens a dropdown → POST `/api/admin/leads/:id/status` → page refreshes with updated row.

Add `status` to the existing filter row (multi-select chips or simple `<select>`).

Add `Last change` column (relative time: `2 ч назад · @science369`).

The `#id` cell becomes a link to `/admin/leads/[id]`.

### 10c. `/admin/leads/[id]` (new page)

Server component. Single lead detail view:
- Lead-card header: same fields as the table row, plus full comment, full referrer/UA, IP.
- Telegram-message-id (if set) shown as small caption "Telegram msg #abc — synced".
- Timeline (event log): one row per `lead_event`, oldest at the top:
  ```
  • 2026-05-25 12:34 — system: created (new)
  • 2026-05-25 18:42 — @science369: new → contacted
  • 2026-05-26 09:15 — admin@web: contacted → demo
  ```
- Status-change dropdown at the top (same POST as in 10b).
- Read-only details below: contact, business, source/utm, language, raw comment.

Design: tight editorial card, Sora display L for the lead title (`Заявка #42 — BillzCafe`), Manrope body.

## 11. Environment variables (additions)

| Variable | Required | Notes |
|---|---|---|
| `TELEGRAM_WEBHOOK_SECRET` | yes | Random 32+ char string. Set via `setWebhook` call. Validated on every callback. |

Existing vars (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`) remain unchanged.

`.env.example` is updated to list `TELEGRAM_WEBHOOK_SECRET`.

## 12. Deploy plan (additions to Sub-1 deploy)

1. Apply new migration on Railway: `tsx scripts/migrate.ts` runs in the existing `start` script chain, so deploy auto-applies on next push.
2. Backfill `lead_events` for existing leads (one-off script `scripts/backfill-events.ts`): for every existing lead, INSERT a `lead_events` row with `from_status=NULL, to_status='new', actor='system', created_at=lead.created_at`. Idempotent — only inserts if no event row exists for that lead.
3. Generate a webhook secret: `openssl rand -hex 32`. Set as `TELEGRAM_WEBHOOK_SECRET` env var in Railway.
4. Register webhook with Telegram (one-time, via curl OR a one-off node script `scripts/set-webhook.ts`):
   ```bash
   curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -d "url=$NEXT_PUBLIC_SITE_URL/api/telegram/webhook" \
     -d "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
     -d "allowed_updates=[\"callback_query\",\"message\"]"
   ```
5. Verify with `curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"` — should show our URL and `pending_update_count: 0`.
6. Smoke test: submit a fresh lead from the live landing, tap "Демо" in Telegram, verify message updates AND `/admin/dashboard` increments the relevant tile.

## 12.5 Local development

The Telegram webhook (`/api/telegram/webhook`) needs a publicly-reachable HTTPS URL. Local `http://localhost:3000` is unreachable from Telegram's servers, so the inline-button path is **not exercisable in pure local dev** without a tunnel.

Options for local end-to-end testing:
- **Skip webhook locally:** test status transitions through `/admin/leads` dropdown + `/admin/leads/:id` page. The web flow exercises the same `lib/telegram/webhook.ts` core logic (extracted to be Next.js-runtime-agnostic) and the same DB-update + audit-log path.
- **Tunnel via `cloudflared`:** `cloudflared tunnel --url http://localhost:3000` gives an ephemeral HTTPS URL. Call `setWebhook` with that URL pointing at a SEPARATE test bot, never the production one. Tear down before pushing.

Webhook tests in `lib/telegram/webhook.test.ts` mock `fetch` and never actually call Telegram, so the test suite runs entirely offline.

## 13. Error handling

- **Webhook secret mismatch** → 401, no logging beyond a counter (avoid log-flood from probe bots).
- **Callback for missing lead_id** → answerCallbackQuery with toast "Заявка не найдена", return 200.
- **DB UPDATE fails** → 500, Telegram retries automatically. answerCallbackQuery skipped (will be retried).
- **editMessageText fails** (e.g. message too old, > 48h) → log but continue. The DB and audit log are still correct; only the Telegram thread is stale.
- **Webhook receives `/start` or DM text** → respond with a short "This bot only sends lead notifications. Use /admin/dashboard." text. Don't log.
- **In-app status POST fails validation** → 400 with details. Form shows inline error.

## 14. Acceptance criteria

- [ ] Tapping "Демо" in Telegram changes lead.status to `demo`, inserts a `lead_events` row, and edits the original message within 2 seconds
- [ ] Tapping the SAME status twice is a no-op (no extra event row, idempotent)
- [ ] Changing status from `/admin/leads` dropdown writes both DB and edits the Telegram message
- [ ] `/admin/dashboard` shows 6 tiles with correct counts for today/week/month/total/conversion/median-time
- [ ] Stacked-bar daily chart renders 30 days with source colors
- [ ] Funnel chart renders 5 rows ordered new → contacted → demo → won → lost
- [ ] `/admin/leads/42` shows full lead detail + chronological timeline
- [ ] Webhook 401s on bad `X-Telegram-Bot-Api-Secret-Token`
- [ ] Backfill script can run twice without creating duplicate `new` events for the same lead
- [ ] All times displayed in Asia/Tashkent
- [ ] No new chart libraries in `package.json` (SVG hand-rolled)
- [ ] No changes to the recipe — green appears ≤ 5 times across `/admin/dashboard`

## 15. File plan

New files:
- `app/api/telegram/webhook/route.ts` — POST handler for callback queries
- `app/api/admin/leads/[id]/status/route.ts` — POST handler for in-app status changes
- `app/admin/dashboard/page.tsx` — KPI dashboard server component
- `app/admin/leads/[id]/page.tsx` — single-lead detail view
- `lib/telegram/buttons.ts` — inline keyboard builder (pure)
- `lib/telegram/webhook.ts` — webhook handler core (testable, no Next.js dependency)
- `lib/telegram/webhook.test.ts`
- `lib/telegram/edit-message.ts` — wrapper for editMessageText / answerCallbackQuery
- `lib/admin/kpi.ts` — SQL aggregation helpers (one fn per metric)
- `lib/admin/kpi.test.ts` — TDD on the date-boundary math (won't need a real DB; pass a mock)
- `lib/admin/svg-chart.ts` — pure SVG stacked-bar + funnel renderers
- `lib/admin/svg-chart.test.ts`
- `lib/admin/status-meta.ts` — single source of truth for {emoji, label, color} per status
- `scripts/backfill-events.ts` — one-off migration helper
- `scripts/set-webhook.ts` — one-off webhook registration helper (idempotent)
- `drizzle/0001_sales_pipeline.sql` — auto-generated migration

Modified files:
- `lib/db/schema.ts` — add `lastStatusChangeAt`, `lastChangedBy`, `telegramMessageId` columns; add `leadEvents` table; export `LeadEvent` type
- `lib/telegram/format.ts` — prepend status line, accept refreshed lead
- `lib/telegram/notify.ts` — after sendMessage, persist `message_id`; pass inline_keyboard
- `app/api/lead/route.ts` — after insert, INSERT initial `lead_events` row (`new`, `system`)
- `app/admin/leads/page.tsx` — status column + dropdown + status filter + link to detail
- `lib/admin/filters.ts` — extend `LeadFilters` with `status: LeadStatus | null`; `parseLeadFilters` reads `status` param; `buildWhereClause` adds it
- `lib/admin/filters.test.ts` — add tests for status filter
- `.env.example` — add `TELEGRAM_WEBHOOK_SECRET`
- `README.md` — add dashboard + webhook setup notes

## 16. Open questions / future work

- **Sub-3 PostHog integration:** the `lead_events` table + dashboard KPIs cover SALES funnel. MARKETING funnel (visit → form-view → form-start → form-submit) needs PostHog. Out of scope here.
- **Push to multiple chats:** if Jack ever wants to send notifications to a sales group AND DM at once, `TELEGRAM_CHAT_ID` becomes a list. Not now.
- **Per-status timestamps as columns:** could denormalize `contacted_at`, `demo_at`, `won_at` for query speed. Skipping for now — `lead_events` is queryable enough at our volume.
- **Slack mirror:** if Jack adopts Slack later, mirror notifications. Not now.
- **Custom button labels:** Russian-only for now. UZ-only button labels are out of scope; the bot speaks RU in the sales chat regardless of lead.language.
