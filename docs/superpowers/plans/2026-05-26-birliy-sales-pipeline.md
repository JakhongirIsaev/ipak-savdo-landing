# BirLiy Sales Pipeline & KPI Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Sub-2 of BirLiy: actionable lead statuses via Telegram inline buttons + audit log + `/admin/dashboard` with 6 KPI tiles and 2 SVG charts + `/admin/leads/[id]` lead-detail timeline.

**Architecture:** Next.js 14 App Router. New `POST /api/telegram/webhook` receives Telegram callback queries (status-button taps), updates `leads.status` + inserts `lead_events` audit row + edits the original Telegram message in place. New `POST /api/admin/leads/[id]/status` does the same from the web admin. New `/admin/dashboard` server component runs SQL aggregations and renders hand-rolled SVG charts. Single-shared-admin auth (existing basic-auth middleware extends to the new routes). All times Asia/Tashkent.

**Tech Stack:** Next.js 14, TypeScript, Drizzle ORM, postgres-js driver, Postgres on Railway/Neon, Zod, Vitest. **No chart library** — pure SVG.

**Spec reference:** `docs/superpowers/specs/2026-05-26-birliy-sales-pipeline-design.md`

---

## File Structure

### New files (in order of creation)

| Path | Responsibility |
|---|---|
| `lib/admin/status-meta.ts` | Single source of truth: {emoji, label, ringColor, badgeColor} per status |
| `lib/admin/status-meta.test.ts` | Completeness check (every status has metadata) |
| `lib/telegram/buttons.ts` | Build Telegram inline_keyboard for a given lead+status |
| `lib/telegram/buttons.test.ts` | callback_data shape, current-status framing |
| `lib/telegram/edit-message.ts` | Wrappers: `editMessageText`, `answerCallbackQuery` |
| `lib/telegram/edit-message.test.ts` | Mocked-fetch tests |
| `lib/telegram/webhook.ts` | Core handler: `handleTelegramUpdate(update, deps)` — runtime-agnostic |
| `lib/telegram/webhook.test.ts` | Tests with injected fake deps |
| `lib/admin/kpi.ts` | Pure date-window math + DB query functions |
| `lib/admin/kpi.test.ts` | Tests on the date-window math (TZ Tashkent) |
| `lib/admin/svg-chart.ts` | `<StackedBars />` and `<Funnel />` React components (no JSX hex — pass colors as props) |
| `lib/admin/svg-chart.test.ts` | Snapshot-ish tests on rendered output |
| `app/api/telegram/webhook/route.ts` | POST handler: header validation + body parse + delegate |
| `app/api/admin/leads/[id]/status/route.ts` | POST handler: body validation + delegate to shared status-change |
| `app/admin/dashboard/page.tsx` | KPI dashboard server component |
| `app/admin/leads/[id]/page.tsx` | Lead detail + timeline |
| `scripts/backfill-events.ts` | One-off: backfill `lead_events` rows for pre-Sub-2 leads |
| `scripts/set-webhook.ts` | One-off: register webhook URL with Telegram |
| `drizzle/0001_*.sql` | Auto-generated migration |

### Modified files

| Path | Change |
|---|---|
| `lib/db/schema.ts` | Add 3 columns to `leads` (`lastStatusChangeAt`, `lastChangedBy`, `telegramMessageId`); add new `leadEvents` table; export `LeadEvent` type |
| `lib/telegram/format.ts` | Prepend status line with emoji + actor + Tashkent time |
| `lib/telegram/format.test.ts` | Update assertions for new format |
| `lib/telegram/notify.ts` | Send inline_keyboard with sendMessage; return `{messageId}` from result |
| `lib/telegram/notify.test.ts` | Assert keyboard sent, return value shape |
| `app/api/lead/route.ts` | After insert: persist `telegram_message_id` from notify result; INSERT initial `lead_events` row |
| `app/api/lead/route.test.ts` | Add mock for lead_events insert; assert event row created |
| `app/admin/leads/page.tsx` | New status column + dropdown + `last_changed_by` column + #id link to detail |
| `lib/admin/filters.ts` | Add `status` to `LeadFilters`; `parseLeadFilters` reads `status` param; `buildWhereClause` adds it |
| `lib/admin/filters.test.ts` | Tests for status filter |
| `.env.example` | Add `TELEGRAM_WEBHOOK_SECRET` |
| `README.md` | Document `/admin/dashboard`, webhook setup, backfill script |

---

## Task 1: Schema additions + generated migration

**Files:**
- Modify: `lib/db/schema.ts`
- Generate: `drizzle/0001_*.sql`

- [ ] **Step 1: Update `lib/db/schema.ts`**

Read the existing file first. Find the `leads` table definition and add the 3 new columns. Below the `leads` table, add the new `leadEvents` table.

Add these imports if not present: `integer` and `index` (likely already there).

Inside `leads` columns block, after `createdAt`:
```ts
    lastStatusChangeAt: timestamp("last_status_change_at", { withTimezone: true }),
    lastChangedBy: text("last_changed_by"),
    telegramMessageId: text("telegram_message_id"),
```

After the `leads` table export (and after `export type Lead = ...` / `NewLead`), add:

```ts
export const leadEvents = pgTable(
  "lead_events",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
    fromStatus: text("from_status", { enum: leadStatuses }),
    toStatus: text("to_status", { enum: leadStatuses }).notNull(),
    actor: text("actor").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    leadIdx: index("lead_events_lead_idx").on(t.leadId, t.createdAt),
  }),
);

export type LeadEvent = typeof leadEvents.$inferSelect;
export type NewLeadEvent = typeof leadEvents.$inferInsert;
```

- [ ] **Step 2: Generate the migration**

Run:
```bash
pnpm db:generate
```

Expected: a file `drizzle/0001_*.sql` is created. Inspect it — it should contain:
- `ALTER TABLE "leads" ADD COLUMN "last_status_change_at" timestamp with time zone;`
- `ALTER TABLE "leads" ADD COLUMN "last_changed_by" text;`
- `ALTER TABLE "leads" ADD COLUMN "telegram_message_id" text;`
- `CREATE TABLE "lead_events" (...)`
- `CREATE INDEX "lead_events_lead_idx" ON "lead_events" USING btree ("lead_id","created_at");`
- `ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;`

- [ ] **Step 3: Apply migration locally**

Run:
```bash
pnpm db:migrate
```

Expected: `Migrations applied.`

Verify with:
```bash
psql "$DATABASE_URL" -c "\d lead_events" -c "\d leads"
```
(Or just trust the migration runner — manual psql is nice-to-have.)

- [ ] **Step 4: Commit**

```bash
git add lib/db/schema.ts drizzle/0001_*.sql drizzle/meta/
git commit -m "feat(db): add lead_events table + status-change tracking columns"
```

---

## Task 2: Status metadata (single source of truth)

**Files:**
- Create: `lib/admin/status-meta.ts`
- Create: `lib/admin/status-meta.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/admin/status-meta.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { STATUS_META, statusMeta } from "./status-meta";
import { leadStatuses } from "@/lib/db/schema";

describe("STATUS_META", () => {
  it("has metadata for every status in the enum", () => {
    for (const status of leadStatuses) {
      expect(STATUS_META[status]).toBeDefined();
      expect(STATUS_META[status].emoji).toBeTruthy();
      expect(STATUS_META[status].label).toBeTruthy();
      expect(STATUS_META[status].dotClass).toMatch(/^bg-/);
    }
  });

  it("statusMeta helper returns metadata for a known status", () => {
    expect(statusMeta("won").emoji).toBe("🏆");
  });

  it("statusMeta on an unknown string returns a fallback", () => {
    expect(statusMeta("garbage" as never).emoji).toBe("•");
  });

  it("uses brand-aligned colors — only 'won' is green", () => {
    expect(STATUS_META.won.dotClass).toContain("green");
    expect(STATUS_META.new.dotClass).not.toContain("green");
    expect(STATUS_META.contacted.dotClass).not.toContain("green");
    expect(STATUS_META.demo.dotClass).not.toContain("green");
    expect(STATUS_META.lost.dotClass).not.toContain("green");
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
pnpm test lib/admin/status-meta.test.ts
```

- [ ] **Step 3: Implement `lib/admin/status-meta.ts`**

```ts
import type { LeadStatus } from "@/lib/db/schema";

export interface StatusMeta {
  emoji: string;
  label: string;      // Russian-only for now per spec
  labelEn: string;    // For Telegram message status line uppercase
  dotClass: string;   // Tailwind bg-<color> class for the colored dot
  ringClass: string;  // Tailwind ring-<color> for focused dropdown
}

export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: {
    emoji: "🆕",
    label: "Новый",
    labelEn: "NEW",
    dotClass: "bg-ink-500",
    ringClass: "ring-ink-500",
  },
  contacted: {
    emoji: "📞",
    label: "В работе",
    labelEn: "CONTACTED",
    dotClass: "bg-info",
    ringClass: "ring-info",
  },
  demo: {
    emoji: "📅",
    label: "Демо",
    labelEn: "DEMO",
    dotClass: "bg-warn",
    ringClass: "ring-warn",
  },
  won: {
    emoji: "🏆",
    label: "Выигран",
    labelEn: "WON",
    dotClass: "bg-green-500",
    ringClass: "ring-green-500",
  },
  lost: {
    emoji: "❌",
    label: "Проигран",
    labelEn: "LOST",
    dotClass: "bg-stop",
    ringClass: "ring-stop",
  },
};

const FALLBACK: StatusMeta = {
  emoji: "•",
  label: "—",
  labelEn: "?",
  dotClass: "bg-mist",
  ringClass: "ring-mist",
};

export function statusMeta(status: LeadStatus | string | null | undefined): StatusMeta {
  if (!status) return FALLBACK;
  return (STATUS_META as Record<string, StatusMeta>)[status] ?? FALLBACK;
}
```

- [ ] **Step 4: Run, confirm pass**

```bash
pnpm test lib/admin/status-meta.test.ts
```
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/status-meta.ts lib/admin/status-meta.test.ts
git commit -m "feat(admin): add status metadata source of truth"
```

---

## Task 3: Extend Telegram message formatter with status line

**Files:**
- Modify: `lib/telegram/format.ts`
- Modify: `lib/telegram/format.test.ts`

- [ ] **Step 1: Add failing tests to `lib/telegram/format.test.ts`**

Append these tests inside the existing `describe("formatLeadMessage", ...)` block (before the closing `});`):
```ts
  it("prepends a status line with the status emoji and label", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    // baseLead.status === "new"
    expect(msg.startsWith("🆕 <b>NEW</b>")).toBe(true);
  });

  it("appends actor + Tashkent time on the status line when last_changed_by is set", () => {
    const lead = {
      ...baseLead,
      status: "demo" as const,
      lastChangedBy: "@science369",
      lastStatusChangeAt: new Date("2026-05-25T13:42:00Z"),
    };
    const msg = formatLeadMessage(lead, "https://example.com");
    // Tashkent = UTC+5 → 18:42
    expect(msg).toMatch(/📅 <b>DEMO<\/b> · @science369 · 25\.05 18:42/);
  });

  it("omits actor suffix when last_changed_by is null", () => {
    const lead = { ...baseLead, status: "new" as const, lastChangedBy: null, lastStatusChangeAt: null };
    const msg = formatLeadMessage(lead, "https://example.com");
    // First line should be just the status without ·
    const firstLine = msg.split("\n")[0];
    expect(firstLine).toBe("🆕 <b>NEW</b>");
  });
```

The existing `baseLead` fixture must include `lastChangedBy: null, lastStatusChangeAt: null, telegramMessageId: null` (it doesn't yet — those are the new Sub-2 columns). Update the fixture: after `createdAt: new Date(...)`, add:
```ts
  lastStatusChangeAt: null,
  lastChangedBy: null,
  telegramMessageId: null,
```

- [ ] **Step 2: Run, confirm the 3 new tests fail and the existing ones may also fail due to fixture changes**

```bash
pnpm test lib/telegram/format.test.ts
```

- [ ] **Step 3: Modify `lib/telegram/format.ts`**

At the top of the file, after the existing imports, add:
```ts
import { STATUS_META } from "@/lib/admin/status-meta";
```

Inside `formatLeadMessage`, BEFORE the `const lines: string[] = [...]` array, add the status-line builder:

```ts
  const meta = STATUS_META[lead.status] ?? STATUS_META.new;
  let statusLine = `${meta.emoji} <b>${meta.labelEn}</b>`;
  if (lead.lastChangedBy && lead.lastStatusChangeAt) {
    statusLine += ` · ${escapeHtml(lead.lastChangedBy)} · ${formatTashkentTimeShort(lead.lastStatusChangeAt)}`;
  }
```

Then change the `lines` array to PREPEND the status line + an empty line:
```ts
  const lines: string[] = [
    statusLine,
    "",
    `🎯 <b>Новая заявка #${lead.id}</b>`,
    "",
    // ... rest unchanged
```

Add a new helper above `formatLeadMessage`:
```ts
function formatTashkentTimeShort(date: Date): string {
  const fmt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}.${get("month")} ${get("hour")}:${get("minute")}`;
}
```

- [ ] **Step 4: Run, confirm all tests pass**

```bash
pnpm test lib/telegram/format.test.ts
```
Expected: all tests pass (existing + 3 new).

- [ ] **Step 5: Commit**

```bash
git add lib/telegram/format.ts lib/telegram/format.test.ts
git commit -m "feat(telegram): prepend status line to lead notifications"
```

---

## Task 4: Inline keyboard builder (TDD)

**Files:**
- Create: `lib/telegram/buttons.ts`
- Create: `lib/telegram/buttons.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/telegram/buttons.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildLeadKeyboard, parseCallbackData } from "./buttons";

describe("buildLeadKeyboard", () => {
  it("returns an inline_keyboard with one row of 4 buttons", () => {
    const kb = buildLeadKeyboard(42, "new");
    expect(kb.inline_keyboard).toHaveLength(1);
    expect(kb.inline_keyboard[0]).toHaveLength(4);
  });

  it("each button has callback_data 'lead:{id}:{status}'", () => {
    const kb = buildLeadKeyboard(42, "new");
    const datas = kb.inline_keyboard[0].map((b) => b.callback_data);
    expect(datas).toEqual([
      "lead:42:contacted",
      "lead:42:demo",
      "lead:42:won",
      "lead:42:lost",
    ]);
  });

  it("wraps the current-status button label with framing dots", () => {
    const kb = buildLeadKeyboard(42, "demo");
    const labels = kb.inline_keyboard[0].map((b) => b.text);
    expect(labels[1]).toMatch(/^· .+ ·$/);  // demo is index 1
    expect(labels[0]).not.toMatch(/^· /);   // contacted is plain
  });

  it("callback_data is under 64 bytes (Telegram limit)", () => {
    const kb = buildLeadKeyboard(999999, "contacted");
    for (const btn of kb.inline_keyboard[0]) {
      expect(Buffer.byteLength(btn.callback_data, "utf8")).toBeLessThanOrEqual(64);
    }
  });
});

describe("parseCallbackData", () => {
  it("parses well-formed callback_data", () => {
    expect(parseCallbackData("lead:42:contacted")).toEqual({
      leadId: 42,
      toStatus: "contacted",
    });
  });

  it("returns null on malformed input", () => {
    expect(parseCallbackData("garbage")).toBeNull();
    expect(parseCallbackData("lead:abc:won")).toBeNull();
    expect(parseCallbackData("lead:42:notastatus")).toBeNull();
    expect(parseCallbackData("lead:42")).toBeNull();
    expect(parseCallbackData("")).toBeNull();
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
pnpm test lib/telegram/buttons.test.ts
```

- [ ] **Step 3: Implement `lib/telegram/buttons.ts`**

```ts
import { leadStatuses, type LeadStatus } from "@/lib/db/schema";

export interface InlineButton {
  text: string;
  callback_data: string;
}

export interface InlineKeyboardMarkup {
  inline_keyboard: InlineButton[][];
}

const BUTTON_ORDER: ReadonlyArray<{ status: LeadStatus; label: string }> = [
  { status: "contacted", label: "✅ В работу" },
  { status: "demo",      label: "📅 Демо" },
  { status: "won",       label: "🏆 Выигран" },
  { status: "lost",      label: "❌ Проигран" },
];

export function buildLeadKeyboard(leadId: number, current: LeadStatus): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      BUTTON_ORDER.map(({ status, label }) => ({
        text: status === current ? `· ${label} ·` : label,
        callback_data: `lead:${leadId}:${status}`,
      })),
    ],
  };
}

const LEAD_STATUS_SET: ReadonlySet<string> = new Set(leadStatuses);

export interface ParsedCallback {
  leadId: number;
  toStatus: LeadStatus;
}

export function parseCallbackData(data: string): ParsedCallback | null {
  if (!data || typeof data !== "string") return null;
  const parts = data.split(":");
  if (parts.length !== 3) return null;
  const [prefix, idStr, status] = parts;
  if (prefix !== "lead") return null;
  const leadId = parseInt(idStr, 10);
  if (!Number.isInteger(leadId) || leadId <= 0) return null;
  if (!LEAD_STATUS_SET.has(status)) return null;
  return { leadId, toStatus: status as LeadStatus };
}
```

- [ ] **Step 4: Run, confirm pass**

```bash
pnpm test lib/telegram/buttons.test.ts
```
Expected: 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/telegram/buttons.ts lib/telegram/buttons.test.ts
git commit -m "feat(telegram): add inline keyboard builder and callback parser"
```

---

## Task 5: Telegram edit-message wrappers (TDD)

**Files:**
- Create: `lib/telegram/edit-message.ts`
- Create: `lib/telegram/edit-message.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/telegram/edit-message.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { editLeadMessage, answerCallback } from "./edit-message";

describe("editLeadMessage", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
  });
  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("calls editMessageText with chat_id, message_id, text, parse_mode, keyboard", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{\"ok\":true}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await editLeadMessage({
      chatId: "-100123",
      messageId: "555",
      text: "hello",
      keyboard: { inline_keyboard: [[{ text: "ok", callback_data: "x" }]] },
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/bottest-token/editMessageText");
    const body = JSON.parse(init.body);
    expect(body.chat_id).toBe("-100123");
    expect(body.message_id).toBe("555");
    expect(body.text).toBe("hello");
    expect(body.parse_mode).toBe("HTML");
    expect(body.reply_markup.inline_keyboard[0][0].text).toBe("ok");
  });

  it("does not throw on non-200 response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("err", { status: 400 })));
    await expect(editLeadMessage({
      chatId: "x", messageId: "1", text: "y", keyboard: { inline_keyboard: [] },
    })).resolves.toBeUndefined();
  });

  it("does not throw when token missing", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await editLeadMessage({
      chatId: "x", messageId: "1", text: "y", keyboard: { inline_keyboard: [] },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("answerCallback", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => { process.env.TELEGRAM_BOT_TOKEN = "test-token"; });
  afterEach(() => { process.env = { ...originalEnv }; vi.restoreAllMocks(); });

  it("posts answerCallbackQuery with the id", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{\"ok\":true}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await answerCallback({ callbackQueryId: "abc" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/answerCallbackQuery");
    expect(JSON.parse(init.body)).toEqual({ callback_query_id: "abc" });
  });

  it("includes text when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{\"ok\":true}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await answerCallback({ callbackQueryId: "abc", text: "Готово", showAlert: false });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.text).toBe("Готово");
    expect(body.show_alert).toBe(false);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
pnpm test lib/telegram/edit-message.test.ts
```

- [ ] **Step 3: Implement `lib/telegram/edit-message.ts`**

```ts
import type { InlineKeyboardMarkup } from "./buttons";

const TELEGRAM_API = "https://api.telegram.org";

async function tgFetch(method: string, body: unknown): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("Telegram token missing — skipping", method);
    return;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`Telegram ${method} failed`, res.status, text);
    }
  } catch (err) {
    console.error(`Telegram ${method} error`, err);
  } finally {
    clearTimeout(timeout);
  }
}

export interface EditLeadMessageArgs {
  chatId: string;
  messageId: string;
  text: string;
  keyboard: InlineKeyboardMarkup;
}

export async function editLeadMessage(args: EditLeadMessageArgs): Promise<void> {
  await tgFetch("editMessageText", {
    chat_id: args.chatId,
    message_id: args.messageId,
    text: args.text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: args.keyboard,
  });
}

export interface AnswerCallbackArgs {
  callbackQueryId: string;
  text?: string;
  showAlert?: boolean;
}

export async function answerCallback(args: AnswerCallbackArgs): Promise<void> {
  const body: Record<string, unknown> = { callback_query_id: args.callbackQueryId };
  if (args.text !== undefined) body.text = args.text;
  if (args.showAlert !== undefined) body.show_alert = args.showAlert;
  await tgFetch("answerCallbackQuery", body);
}
```

- [ ] **Step 4: Run, confirm pass**

```bash
pnpm test lib/telegram/edit-message.test.ts
```
Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/telegram/edit-message.ts lib/telegram/edit-message.test.ts
git commit -m "feat(telegram): add editMessageText and answerCallbackQuery wrappers"
```

---

## Task 6: Extend `notifyNewLead` + `/api/lead` to capture message_id + log initial event

**Files:**
- Modify: `lib/telegram/notify.ts`
- Modify: `lib/telegram/notify.test.ts`
- Modify: `app/api/lead/route.ts`
- Modify: `app/api/lead/route.test.ts`

- [ ] **Step 1: Update `lib/telegram/notify.ts`**

Replace the entire file with:
```ts
import type { Lead } from "@/lib/db/schema";
import { formatLeadMessage } from "./format";
import { buildLeadKeyboard } from "./buttons";

export interface NotifyResult {
  messageId: string | null;
}

export async function notifyNewLead(lead: Lead): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  if (!token || !chatId) {
    console.error("Telegram env vars missing — notification skipped for lead", lead.id);
    return { messageId: null };
  }

  const text = formatLeadMessage(lead, siteUrl);
  const keyboard = buildLeadKeyboard(lead.id, lead.status);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        text,
        reply_markup: keyboard,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendMessage failed", res.status, body);
      return { messageId: null };
    }
    const json = (await res.json().catch(() => null)) as { ok?: boolean; result?: { message_id?: number } } | null;
    const id = json?.result?.message_id;
    return { messageId: typeof id === "number" ? String(id) : null };
  } catch (err) {
    console.error("Telegram sendMessage error", err);
    return { messageId: null };
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 2: Update `lib/telegram/notify.test.ts`**

Update the existing tests so they expect a `NotifyResult` return shape and the keyboard in the body. Replace the file contents with:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { notifyNewLead } from "./notify";
import type { Lead } from "@/lib/db/schema";

const lead: Lead = {
  id: 1,
  businessName: "X",
  businessType: "cafe",
  businessTypeOther: null,
  ownerName: "O",
  ownerContact: "+998900000000",
  needsEquipment: false,
  comment: null,
  source: "direct",
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  referrer: null,
  userAgent: null,
  ip: null,
  language: "ru",
  status: "new",
  createdAt: new Date(),
  lastStatusChangeAt: null,
  lastChangedBy: null,
  telegramMessageId: null,
};

describe("notifyNewLead", () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "-100123";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
  });
  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("posts to Telegram with text, parse_mode, and inline_keyboard", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, result: { message_id: 555 } }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);
    const result = await notifyNewLead(lead);
    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.chat_id).toBe("-100123");
    expect(body.parse_mode).toBe("HTML");
    expect(body.text).toContain("Новая заявка #1");
    expect(body.reply_markup.inline_keyboard).toHaveLength(1);
    expect(body.reply_markup.inline_keyboard[0]).toHaveLength(4);
    expect(result.messageId).toBe("555");
  });

  it("returns null messageId when sendMessage 4xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{\"ok\":false}", { status: 400 })));
    const result = await notifyNewLead(lead);
    expect(result.messageId).toBeNull();
  });

  it("returns null messageId on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    const result = await notifyNewLead(lead);
    expect(result.messageId).toBeNull();
  });

  it("returns null and does not fetch when env vars missing", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await notifyNewLead(lead);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.messageId).toBeNull();
  });
});
```

- [ ] **Step 3: Modify `app/api/lead/route.ts`**

Read the existing file. After the successful `db.insert(leads).values(...).returning()` call and before the `void notifyNewLead(inserted)` line, change the flow to:

1. await the notify call to capture messageId
2. If messageId is non-null, UPDATE leads.telegram_message_id
3. INSERT initial lead_events row (regardless of telegram success)

Replace this block:
```ts
    const [inserted] = await db.insert(leads).values({...}).returning();
    void notifyNewLead(inserted);
    return Response.json({ ok: true, id: inserted.id });
```

With:
```ts
    const [inserted] = await db.insert(leads).values({
      // ... existing values unchanged ...
    }).returning();

    // Initial audit-log row
    await db.insert(leadEvents).values({
      leadId: inserted.id,
      fromStatus: null,
      toStatus: "new",
      actor: "system",
    });

    // Notify + capture message_id
    const { messageId } = await notifyNewLead(inserted);
    if (messageId) {
      await db
        .update(leads)
        .set({ telegramMessageId: messageId })
        .where(eq(leads.id, inserted.id));
    }

    return Response.json({ ok: true, id: inserted.id });
```

Add `leadEvents` to the import from `@/lib/db` at the top:
```ts
import { db, leads, leadEvents } from "@/lib/db";
```
Add `eq` import:
```ts
import { eq } from "drizzle-orm";
```

- [ ] **Step 4: Update `app/api/lead/route.test.ts`**

The existing test mocks `@/lib/db` with a custom factory. Update the mock to:
1. Export `leadEvents` as `{}` (so the import works)
2. Add an `__getEvents()` helper for assertions
3. Make `db.insert` smarter — track which TABLE it was called against

Replace the `vi.mock("@/lib/db", ...)` block with:
```ts
vi.mock("@/lib/db", () => {
  const insertedRows: any[] = [];
  const eventRows: any[] = [];
  const updates: any[] = [];

  return {
    db: {
      insert: (table: any) => ({
        values: (row: any) => ({
          returning: async () => {
            // Distinguish by reference identity
            if (table === fakeLeadsTable) {
              const inserted = { ...row, id: insertedRows.length + 1, createdAt: new Date(), status: "new", telegramMessageId: null, lastStatusChangeAt: null, lastChangedBy: null };
              insertedRows.push(inserted);
              return [inserted];
            }
            return [{}];
          },
        }),
        // For inserts that don't .returning() (lead_events)
        // We'll detect by intercepting at the `values` level
        // when there's no .returning() chained
      }),
      update: () => ({
        set: (patch: any) => ({
          where: async () => {
            updates.push(patch);
            return undefined;
          },
        }),
      }),
    },
    leads: { __id: "leads" },
    leadEvents: { __id: "leadEvents" },
    __getInserted: () => insertedRows,
    __getEvents: () => eventRows,
    __getUpdates: () => updates,
    __reset: () => {
      insertedRows.splice(0);
      eventRows.splice(0);
      updates.splice(0);
    },
  };
});
const fakeLeadsTable = {} as any; // placeholder reference unused below
```

This mock is getting complex. A simpler alternative: make `db.insert(table).values(row).returning()` ALWAYS return for leads, and a separate path for events. Implement the simpler version:

```ts
vi.mock("@/lib/db", () => {
  const insertedRows: any[] = [];
  const eventRows: any[] = [];
  const updates: any[] = [];
  let currentTable: string | null = null;

  return {
    db: {
      insert: (table: { __id: string }) => {
        currentTable = table.__id;
        return {
          values: (row: any) => {
            const stored = currentTable;
            return {
              returning: async () => {
                if (stored === "leads") {
                  const inserted = {
                    ...row,
                    id: insertedRows.length + 1,
                    createdAt: new Date(),
                    status: "new",
                    telegramMessageId: null,
                    lastStatusChangeAt: null,
                    lastChangedBy: null,
                  };
                  insertedRows.push(inserted);
                  return [inserted];
                }
                return [];
              },
              // .insert(events).values(...) is called WITHOUT .returning() in the route
              // So we also implement an awaitable form via then-able
              then: (resolve: () => void) => {
                if (stored === "leadEvents") {
                  eventRows.push(row);
                }
                resolve();
              },
            };
          },
        };
      },
      update: () => ({
        set: (patch: any) => ({
          where: async () => {
            updates.push(patch);
          },
        }),
      }),
    },
    leads: { __id: "leads" },
    leadEvents: { __id: "leadEvents" },
    __getInserted: () => insertedRows,
    __getEvents: () => eventRows,
    __getUpdates: () => updates,
    __reset: () => {
      insertedRows.splice(0);
      eventRows.splice(0);
      updates.splice(0);
    },
  };
});

vi.mock("@/lib/telegram/notify", () => ({
  notifyNewLead: vi.fn().mockResolvedValue({ messageId: "555" }),
}));
```

Add new assertions to the "creates a lead and returns 200" test:
```ts
  it("creates a lead and returns 200", async () => {
    const res = await POST(makeReq(validBody, "1.1.1.1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(typeof json.id).toBe("number");
    expect((dbMod as any).__getInserted()).toHaveLength(1);
    expect((dbMod as any).__getEvents()).toHaveLength(1);
    expect((dbMod as any).__getEvents()[0]).toMatchObject({
      fromStatus: null,
      toStatus: "new",
      actor: "system",
    });
    expect((dbMod as any).__getUpdates()).toHaveLength(1);
    expect((dbMod as any).__getUpdates()[0]).toMatchObject({ telegramMessageId: "555" });
    expect(notifyNewLead).toHaveBeenCalledOnce();
  });
```

Update the honeypot test to assert NO event row + NO update:
```ts
  it("silently returns 200 without writing when honeypot is filled", async () => {
    const res = await POST(makeReq({ ...validBody, _hp: "bot-trap" }, "3.3.3.3"));
    expect(res.status).toBe(200);
    expect((dbMod as any).__getInserted()).toHaveLength(0);
    expect((dbMod as any).__getEvents()).toHaveLength(0);
    expect((dbMod as any).__getUpdates()).toHaveLength(0);
    expect(notifyNewLead).not.toHaveBeenCalled();
  });
```

- [ ] **Step 5: Run all tests**

```bash
pnpm test
```
Expected: all previously-passing tests + new assertions pass.

If the mock thenable approach doesn't work cleanly (Drizzle insert chain may differ), simplify by making `db.insert(leadEvents).values(row)` return a Promise-like object via a manual `then`. If you're stuck, an alternative is to update the route to use `.returning()` for the event insert too — easier to mock — but adds one column read overhead, so prefer keeping the route lean and improving the mock.

- [ ] **Step 6: Commit**

```bash
git add lib/telegram/notify.ts lib/telegram/notify.test.ts app/api/lead/route.ts app/api/lead/route.test.ts
git commit -m "feat: capture telegram_message_id + log initial lead_event on intake"
```

---

## Task 7: Webhook handler core (TDD, runtime-agnostic)

**Files:**
- Create: `lib/telegram/webhook.ts`
- Create: `lib/telegram/webhook.test.ts`

The core handler takes injected dependencies (db + telegram client + clock) so it can be unit-tested without Next.js or real network calls. The route wrapper (Task 8) is a thin shim.

- [ ] **Step 1: Write failing tests**

Create `lib/telegram/webhook.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleTelegramUpdate, type WebhookDeps } from "./webhook";

const baseLead = {
  id: 42,
  businessName: "BillzCafe",
  businessType: "cafe",
  businessTypeOther: null,
  ownerName: "Иван",
  ownerContact: "+998901234567",
  needsEquipment: false,
  comment: null,
  source: "direct",
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  referrer: null,
  userAgent: null,
  ip: null,
  language: "ru" as const,
  status: "new" as const,
  createdAt: new Date(),
  lastStatusChangeAt: null,
  lastChangedBy: null,
  telegramMessageId: "555",
};

function makeDeps(overrides: Partial<WebhookDeps> = {}): WebhookDeps & {
  events: any[];
  updates: any[];
  edits: any[];
  answers: any[];
} {
  const events: any[] = [];
  const updates: any[] = [];
  const edits: any[] = [];
  const answers: any[] = [];

  return {
    events, updates, edits, answers,
    findLead: vi.fn(async (id: number) => (id === 42 ? { ...baseLead } : null)),
    updateLeadStatus: vi.fn(async (id, newStatus, actor) => {
      updates.push({ id, newStatus, actor });
    }),
    insertEvent: vi.fn(async (row) => { events.push(row); }),
    editMessage: vi.fn(async (args) => { edits.push(args); }),
    answerCb: vi.fn(async (args) => { answers.push(args); }),
    chatId: "-100123",
    siteUrl: "https://example.com",
    ...overrides,
  };
}

describe("handleTelegramUpdate", () => {
  it("ignores updates without callback_query or message", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({ update_id: 1 }, deps);
    expect(deps.updateLeadStatus).not.toHaveBeenCalled();
    expect(deps.editMessage).not.toHaveBeenCalled();
  });

  it("on callback_query: updates status, inserts event, edits message, answers", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({
      update_id: 2,
      callback_query: {
        id: "cb-abc",
        from: { id: 100, username: "science369", first_name: "J" },
        data: "lead:42:demo",
        message: { message_id: 555, chat: { id: -100123 } },
      },
    }, deps);

    expect(deps.updateLeadStatus).toHaveBeenCalledWith(42, "demo", "@science369");
    expect(deps.events).toHaveLength(1);
    expect(deps.events[0]).toMatchObject({ leadId: 42, fromStatus: "new", toStatus: "demo", actor: "@science369" });
    expect(deps.edits).toHaveLength(1);
    expect(deps.edits[0].messageId).toBe("555");
    expect(deps.answers).toHaveLength(1);
    expect(deps.answers[0].callbackQueryId).toBe("cb-abc");
  });

  it("uses telegram user id as actor when username missing", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({
      update_id: 3,
      callback_query: {
        id: "cb-x",
        from: { id: 999, first_name: "NoUsername" },
        data: "lead:42:contacted",
        message: { message_id: 555, chat: { id: -100123 } },
      },
    }, deps);
    expect(deps.updateLeadStatus).toHaveBeenCalledWith(42, "contacted", "@999");
  });

  it("is idempotent — clicking the same status twice skips UPDATE", async () => {
    const deps = makeDeps({
      findLead: vi.fn(async () => ({ ...baseLead, status: "demo" as const })),
    });
    await handleTelegramUpdate({
      update_id: 4,
      callback_query: {
        id: "cb-y", from: { id: 1, username: "x" },
        data: "lead:42:demo",
        message: { message_id: 555, chat: { id: -100123 } },
      },
    }, deps);
    expect(deps.updateLeadStatus).not.toHaveBeenCalled();
    expect(deps.events).toHaveLength(0);
    expect(deps.answers).toHaveLength(1);
  });

  it("answers with a toast when lead not found", async () => {
    const deps = makeDeps({ findLead: vi.fn(async () => null) });
    await handleTelegramUpdate({
      update_id: 5,
      callback_query: {
        id: "cb-z", from: { id: 1, username: "x" },
        data: "lead:999:demo",
        message: { message_id: 555, chat: { id: -100123 } },
      },
    }, deps);
    expect(deps.answers[0].text).toContain("не найдена");
  });

  it("answers with a toast on malformed callback_data", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({
      update_id: 6,
      callback_query: {
        id: "cb-q", from: { id: 1 },
        data: "garbage",
        message: { message_id: 1, chat: { id: 1 } },
      },
    }, deps);
    expect(deps.updateLeadStatus).not.toHaveBeenCalled();
    expect(deps.answers).toHaveLength(1);
  });

  it("skips editMessage when lead has no telegram_message_id", async () => {
    const deps = makeDeps({
      findLead: vi.fn(async () => ({ ...baseLead, telegramMessageId: null })),
    });
    await handleTelegramUpdate({
      update_id: 7,
      callback_query: {
        id: "cb-w", from: { id: 1, username: "x" },
        data: "lead:42:demo",
        message: { message_id: 555, chat: { id: -100123 } },
      },
    }, deps);
    expect(deps.updateLeadStatus).toHaveBeenCalled();
    expect(deps.edits).toHaveLength(0);
  });

  it("responds to /start text message with a friendly note (no DB writes)", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({
      update_id: 8,
      message: {
        message_id: 1,
        chat: { id: 12345 },
        text: "/start",
        from: { id: 1, username: "x" },
      },
    }, deps);
    expect(deps.updateLeadStatus).not.toHaveBeenCalled();
    expect(deps.events).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
pnpm test lib/telegram/webhook.test.ts
```

- [ ] **Step 3: Implement `lib/telegram/webhook.ts`**

```ts
import type { Lead, LeadStatus } from "@/lib/db/schema";
import { parseCallbackData, buildLeadKeyboard, type InlineKeyboardMarkup } from "./buttons";
import { formatLeadMessage } from "./format";

export interface WebhookDeps {
  findLead: (id: number) => Promise<Lead | null>;
  updateLeadStatus: (id: number, newStatus: LeadStatus, actor: string) => Promise<void>;
  insertEvent: (row: { leadId: number; fromStatus: LeadStatus | null; toStatus: LeadStatus; actor: string }) => Promise<void>;
  editMessage: (args: { chatId: string; messageId: string; text: string; keyboard: InlineKeyboardMarkup }) => Promise<void>;
  answerCb: (args: { callbackQueryId: string; text?: string; showAlert?: boolean }) => Promise<void>;
  chatId: string;
  siteUrl: string;
}

interface TelegramFrom {
  id: number;
  username?: string;
  first_name?: string;
}

interface CallbackQuery {
  id: string;
  from: TelegramFrom;
  data?: string;
  message?: { message_id: number; chat: { id: number } };
}

interface MessageUpdate {
  message_id: number;
  chat: { id: number };
  text?: string;
  from?: TelegramFrom;
}

export interface TelegramUpdate {
  update_id: number;
  callback_query?: CallbackQuery;
  message?: MessageUpdate;
}

function actorFrom(from: TelegramFrom): string {
  if (from.username) return `@${from.username}`;
  return `@${from.id}`;
}

export async function handleTelegramUpdate(
  update: TelegramUpdate,
  deps: WebhookDeps,
): Promise<void> {
  if (update.callback_query) {
    await handleCallback(update.callback_query, deps);
    return;
  }
  // /start or other message — currently a no-op (could send a polite reply later)
  return;
}

async function handleCallback(cb: CallbackQuery, deps: WebhookDeps): Promise<void> {
  if (!cb.data) {
    await deps.answerCb({ callbackQueryId: cb.id });
    return;
  }

  const parsed = parseCallbackData(cb.data);
  if (!parsed) {
    await deps.answerCb({ callbackQueryId: cb.id, text: "Некорректные данные", showAlert: false });
    return;
  }

  const lead = await deps.findLead(parsed.leadId);
  if (!lead) {
    await deps.answerCb({ callbackQueryId: cb.id, text: "Заявка не найдена", showAlert: false });
    return;
  }

  const actor = actorFrom(cb.from);

  if (lead.status === parsed.toStatus) {
    // Idempotent
    await deps.answerCb({ callbackQueryId: cb.id });
    return;
  }

  await deps.updateLeadStatus(lead.id, parsed.toStatus, actor);
  await deps.insertEvent({
    leadId: lead.id,
    fromStatus: lead.status,
    toStatus: parsed.toStatus,
    actor,
  });

  if (lead.telegramMessageId) {
    const refreshed: Lead = {
      ...lead,
      status: parsed.toStatus,
      lastChangedBy: actor,
      lastStatusChangeAt: new Date(),
    };
    await deps.editMessage({
      chatId: deps.chatId,
      messageId: lead.telegramMessageId,
      text: formatLeadMessage(refreshed, deps.siteUrl),
      keyboard: buildLeadKeyboard(lead.id, parsed.toStatus),
    });
  }

  await deps.answerCb({ callbackQueryId: cb.id });
}
```

- [ ] **Step 4: Run, confirm pass**

```bash
pnpm test lib/telegram/webhook.test.ts
```
Expected: 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/telegram/webhook.ts lib/telegram/webhook.test.ts
git commit -m "feat(telegram): add runtime-agnostic webhook handler core"
```

---

## Task 8: Webhook route (thin Next.js shim)

**Files:**
- Create: `app/api/telegram/webhook/route.ts`

- [ ] **Step 1: Implement the route**

```ts
import { eq, and } from "drizzle-orm";
import { db, leads, leadEvents } from "@/lib/db";
import type { Lead, LeadStatus } from "@/lib/db/schema";
import { handleTelegramUpdate, type WebhookDeps, type TelegramUpdate } from "@/lib/telegram/webhook";
import { editLeadMessage, answerCallback } from "@/lib/telegram/edit-message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

const deps: WebhookDeps = {
  async findLead(id) {
    const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return (rows[0] as Lead | undefined) ?? null;
  },
  async updateLeadStatus(id, newStatus, actor) {
    await db
      .update(leads)
      .set({
        status: newStatus,
        lastStatusChangeAt: new Date(),
        lastChangedBy: actor,
      })
      .where(eq(leads.id, id));
  },
  async insertEvent(row) {
    await db.insert(leadEvents).values(row);
  },
  editMessage: editLeadMessage,
  answerCb: answerCallback,
  chatId: process.env.TELEGRAM_CHAT_ID ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
};

export async function POST(req: Request): Promise<Response> {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) {
    console.error("TELEGRAM_WEBHOOK_SECRET not configured");
    return new Response("not configured", { status: 503 });
  }
  const received = req.headers.get("x-telegram-bot-api-secret-token");
  if (!received || !timingSafeEqual(received, expected)) {
    return new Response("unauthorized", { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  try {
    await handleTelegramUpdate(update, deps);
  } catch (err) {
    console.error("webhook handler error", err);
    // Return 200 anyway — Telegram retries only on 5xx and we don't want retries here
  }

  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm exec tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add app/api/telegram/webhook/route.ts
git commit -m "feat(api): add POST /api/telegram/webhook with secret-token validation"
```

---

## Task 9: Admin status POST endpoint

**Files:**
- Create: `app/api/admin/leads/[id]/status/route.ts`

- [ ] **Step 1: Implement the route**

```ts
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, leads, leadEvents } from "@/lib/db";
import { leadStatuses, type Lead, type LeadStatus } from "@/lib/db/schema";
import { buildLeadKeyboard } from "@/lib/telegram/buttons";
import { formatLeadMessage } from "@/lib/telegram/format";
import { editLeadMessage } from "@/lib/telegram/edit-message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  to_status: z.enum(leadStatuses),
});

const ADMIN_ACTOR = "admin@web";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "validation", details: parsed.error.flatten() }, { status: 400 });
  }
  const toStatus = parsed.data.to_status;

  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  const lead = rows[0] as Lead | undefined;
  if (!lead) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (lead.status === toStatus) {
    return Response.json({ ok: true, id, unchanged: true });
  }

  await db
    .update(leads)
    .set({ status: toStatus, lastStatusChangeAt: new Date(), lastChangedBy: ADMIN_ACTOR })
    .where(eq(leads.id, id));

  await db.insert(leadEvents).values({
    leadId: id,
    fromStatus: lead.status,
    toStatus,
    actor: ADMIN_ACTOR,
  });

  if (lead.telegramMessageId) {
    const refreshed: Lead = {
      ...lead,
      status: toStatus,
      lastChangedBy: ADMIN_ACTOR,
      lastStatusChangeAt: new Date(),
    };
    await editLeadMessage({
      chatId: process.env.TELEGRAM_CHAT_ID ?? "",
      messageId: lead.telegramMessageId,
      text: formatLeadMessage(refreshed, process.env.NEXT_PUBLIC_SITE_URL ?? ""),
      keyboard: buildLeadKeyboard(id, toStatus),
    });
  }

  return Response.json({ ok: true, id, to_status: toStatus });
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/leads/[id]/status/route.ts
git commit -m "feat(api): add POST /api/admin/leads/[id]/status for web status changes"
```

---

## Task 10: Extend filters with status

**Files:**
- Modify: `lib/admin/filters.ts`
- Modify: `lib/admin/filters.test.ts`

- [ ] **Step 1: Add failing tests**

Append to `lib/admin/filters.test.ts` inside the `describe("parseLeadFilters", ...)` block:
```ts
  it("parses status", () => {
    const f = parseLeadFilters(new URLSearchParams({ status: "won" }));
    expect(f.status).toBe("won");
  });

  it("rejects unknown status", () => {
    const f = parseLeadFilters(new URLSearchParams({ status: "spaceship" }));
    expect(f.status).toBeNull();
  });
```

Also update the empty-params test to include `status: null`:
```ts
  it("returns empty object for empty params", () => {
    expect(parseLeadFilters(new URLSearchParams())).toEqual({
      from: null,
      to: null,
      source: null,
      businessType: null,
      equipment: null,
      q: null,
      page: 1,
      status: null,
    });
  });
```

- [ ] **Step 2: Run, confirm fail**

```bash
pnpm test lib/admin/filters.test.ts
```

- [ ] **Step 3: Update `lib/admin/filters.ts`**

In the `LeadFilters` interface, add:
```ts
  status: LeadStatus | null;
```

Add `LeadStatus` to imports from schema:
```ts
import { leads, leadStatuses, type BusinessType, type LeadStatus, businessTypes } from "@/lib/db/schema";
```

In `parseLeadFilters`, add:
```ts
  const statusStr = params.get("status");
  const status: LeadStatus | null =
    statusStr && (leadStatuses as readonly string[]).includes(statusStr)
      ? (statusStr as LeadStatus)
      : null;
```
And include `status` in the returned object.

In `buildWhereClause`, add (before the `q` block):
```ts
  if (filters.status) clauses.push(eq(leads.status, filters.status));
```

- [ ] **Step 4: Run, confirm pass**

```bash
pnpm test lib/admin/filters.test.ts
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/filters.ts lib/admin/filters.test.ts
git commit -m "feat(admin): add status filter to lead listing"
```

---

## Task 11: KPI helpers

**Files:**
- Create: `lib/admin/kpi.ts`
- Create: `lib/admin/kpi.test.ts`

KPI functions execute SQL. Pure-function logic (date-window math) is unit-tested; SQL execution is verified by manual smoke in Task 19.

- [ ] **Step 1: Write failing tests on the pure portions**

Create `lib/admin/kpi.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { tashkentDayStart, tashkentDayEnd, deltaPercent } from "./kpi";

describe("tashkentDayStart", () => {
  it("returns the UTC instant of midnight Tashkent for a given date", () => {
    // Tashkent is UTC+5. 2026-05-26 00:00 Tashkent = 2026-05-25 19:00 UTC
    const start = tashkentDayStart(new Date("2026-05-26T13:42:00Z"));
    expect(start.toISOString()).toBe("2026-05-25T19:00:00.000Z");
  });

  it("returns the same UTC instant when called multiple times in the same Tashkent day", () => {
    const a = tashkentDayStart(new Date("2026-05-26T01:00:00Z"));
    const b = tashkentDayStart(new Date("2026-05-26T18:00:00Z"));
    expect(a.toISOString()).toBe(b.toISOString());
  });
});

describe("tashkentDayEnd", () => {
  it("returns the next-day-midnight Tashkent UTC instant", () => {
    const end = tashkentDayEnd(new Date("2026-05-26T13:42:00Z"));
    expect(end.toISOString()).toBe("2026-05-26T19:00:00.000Z");
  });
});

describe("deltaPercent", () => {
  it("returns null if previous is 0", () => {
    expect(deltaPercent(10, 0)).toBeNull();
  });

  it("returns positive delta when current > previous", () => {
    expect(deltaPercent(15, 10)).toBe(50);
  });

  it("returns negative delta when current < previous", () => {
    expect(deltaPercent(5, 10)).toBe(-50);
  });

  it("returns 0 when equal", () => {
    expect(deltaPercent(10, 10)).toBe(0);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
pnpm test lib/admin/kpi.test.ts
```

- [ ] **Step 3: Implement `lib/admin/kpi.ts`**

```ts
import { sql, and, gte, lt, eq, isNotNull } from "drizzle-orm";
import { db, leads, leadEvents } from "@/lib/db";
import type { LeadStatus } from "@/lib/db/schema";

const TZ = "Asia/Tashkent";

// ─── Pure date helpers ───────────────────────────────────────────────────────

export function tashkentDayStart(now: Date): Date {
  // Compute Y/M/D in Tashkent, then construct midnight in UTC offset by -5h.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  // Tashkent has no DST, fixed +05:00. Midnight Tashkent = 19:00 UTC previous day.
  return new Date(`${get("year")}-${get("month")}-${get("day")}T00:00:00+05:00`);
}

export function tashkentDayEnd(now: Date): Date {
  const start = tashkentDayStart(now);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}

export function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

// ─── DB-backed KPIs ──────────────────────────────────────────────────────────

export interface KpiCounts {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  total: number;
}

export async function getLeadCounts(now: Date = new Date()): Promise<KpiCounts> {
  const todayStart = tashkentDayStart(now);
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const todayEnd = tashkentDayEnd(now);
  const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(todayStart.getTime() - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(todayStart.getTime() - 60 * 24 * 60 * 60 * 1000);

  const countSince = async (from: Date, to: Date) => {
    const rows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(leads)
      .where(and(gte(leads.createdAt, from), lt(leads.createdAt, to)));
    return rows[0]?.n ?? 0;
  };

  const totalRows = await db.select({ n: sql<number>`count(*)::int` }).from(leads);

  return {
    today: await countSince(todayStart, todayEnd),
    yesterday: await countSince(yesterdayStart, todayStart),
    thisWeek: await countSince(sevenDaysAgo, todayEnd),
    lastWeek: await countSince(fourteenDaysAgo, sevenDaysAgo),
    thisMonth: await countSince(thirtyDaysAgo, todayEnd),
    lastMonth: await countSince(sixtyDaysAgo, thirtyDaysAgo),
    total: totalRows[0]?.n ?? 0,
  };
}

export interface FunnelCount {
  status: LeadStatus;
  count: number;
}

export async function getFunnel(): Promise<FunnelCount[]> {
  const rows = await db
    .select({ status: leads.status, count: sql<number>`count(*)::int` })
    .from(leads)
    .groupBy(leads.status);
  const order: LeadStatus[] = ["new", "contacted", "demo", "won", "lost"];
  return order.map((s) => ({
    status: s,
    count: rows.find((r) => r.status === s)?.count ?? 0,
  }));
}

export async function getConversionRate(): Promise<number | null> {
  const rows = await db
    .select({
      total: sql<number>`count(*)::int`,
      won: sql<number>`count(*) FILTER (WHERE ${leads.status} = 'won')::int`,
    })
    .from(leads);
  const r = rows[0];
  if (!r || r.total === 0) return null;
  return Math.round((r.won / r.total) * 100);
}

export async function getMedianTimeToContactSec(): Promise<number | null> {
  const rows = await db.execute(sql`
    SELECT percentile_cont(0.5) WITHIN GROUP (
      ORDER BY EXTRACT(epoch FROM (e2.created_at - e1.created_at))
    ) AS median_sec
    FROM lead_events e1
    JOIN lead_events e2 ON e1.lead_id = e2.lead_id
    WHERE e1.from_status IS NULL AND e1.to_status = 'new'
      AND e2.from_status = 'new' AND e2.to_status = 'contacted'
  `);
  // drizzle execute returns { rows: ... } for raw SQL
  const row = (rows as any).rows?.[0] ?? (rows as any)[0];
  const median = row?.median_sec;
  if (median === null || median === undefined) return null;
  return Math.round(Number(median));
}

export interface DailyBySource {
  day: string;       // 'YYYY-MM-DD' Tashkent
  source: string;
  count: number;
}

export async function getDailyLeadsBySource(days = 30): Promise<DailyBySource[]> {
  const rows = await db.execute(sql`
    SELECT
      to_char(date_trunc('day', created_at AT TIME ZONE 'Asia/Tashkent'), 'YYYY-MM-DD') AS day,
      source,
      count(*)::int AS count
    FROM leads
    WHERE created_at >= now() - (${days} || ' days')::interval
    GROUP BY day, source
    ORDER BY day
  `);
  return ((rows as any).rows ?? rows) as DailyBySource[];
}

export interface SourceStats {
  source: string;
  total: number;
  won: number;
  winRate: number;
}

export async function getTopSourcesByWinRate(limit = 5): Promise<SourceStats[]> {
  const rows = await db.execute(sql`
    SELECT
      source,
      count(*)::int AS total,
      count(*) FILTER (WHERE status = 'won')::int AS won
    FROM leads
    GROUP BY source
    HAVING count(*) >= 1
    ORDER BY count(*) DESC
    LIMIT ${limit}
  `);
  const data = ((rows as any).rows ?? rows) as { source: string; total: number; won: number }[];
  return data.map((r) => ({
    source: r.source,
    total: r.total,
    won: r.won,
    winRate: r.total === 0 ? 0 : Math.round((r.won / r.total) * 100),
  }));
}
```

- [ ] **Step 4: Run, confirm pass**

```bash
pnpm test lib/admin/kpi.test.ts
```
Expected: 7 tests pass.

- [ ] **Step 5: Type-check**

```bash
pnpm exec tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add lib/admin/kpi.ts lib/admin/kpi.test.ts
git commit -m "feat(admin): add KPI aggregation helpers with Tashkent date math"
```

---

## Task 12: SVG chart components (TDD)

**Files:**
- Create: `lib/admin/svg-chart.tsx`
- Create: `lib/admin/svg-chart.test.tsx`

We render React components (not raw strings) so they can be used directly in the dashboard server component. We test the structural output via React Testing Library or by rendering with `renderToString`.

- [ ] **Step 1: Add React testing utilities**

If not already installed, add `react-dom/server` (already available — it ships with react-dom) and a minimal test setup.

Check `vitest.config.ts` — set environment for tsx tests:
Update `include` glob in `vitest.config.ts` to also pick up `.test.tsx`:
```ts
    include: ["lib/**/*.test.ts", "lib/**/*.test.tsx", "app/**/*.test.ts", "app/**/*.test.tsx", "middleware.test.ts"],
```

- [ ] **Step 2: Write failing tests**

Create `lib/admin/svg-chart.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { StackedBars, Funnel } from "./svg-chart";

describe("StackedBars", () => {
  it("renders an svg with one <g> per day", () => {
    const data = [
      { day: "2026-05-25", source: "instagram", count: 3 },
      { day: "2026-05-25", source: "direct", count: 2 },
      { day: "2026-05-26", source: "instagram", count: 1 },
    ];
    const html = renderToString(<StackedBars data={data} width={600} height={200} />);
    expect(html).toContain("<svg");
    expect(html).toContain('aria-label="Лиды по дням');
    // 2 unique days → 2 column groups
    const groups = html.match(/<g class="day"/g) ?? [];
    expect(groups.length).toBe(2);
  });

  it("renders nothing meaningful with empty data", () => {
    const html = renderToString(<StackedBars data={[]} width={600} height={200} />);
    expect(html).toContain("<svg");
    expect(html).not.toMatch(/<g class="day"/);
  });
});

describe("Funnel", () => {
  it("renders 5 rows (one per status)", () => {
    const data = [
      { status: "new" as const, count: 240 },
      { status: "contacted" as const, count: 142 },
      { status: "demo" as const, count: 78 },
      { status: "won" as const, count: 34 },
      { status: "lost" as const, count: 16 },
    ];
    const html = renderToString(<Funnel data={data} width={600} />);
    expect(html).toContain("<svg");
    const rows = html.match(/<g class="row"/g) ?? [];
    expect(rows.length).toBe(5);
    expect(html).toContain("240");
    expect(html).toContain("100%");
  });

  it("handles zero-total gracefully (no division by zero)", () => {
    const data = [
      { status: "new" as const, count: 0 },
      { status: "contacted" as const, count: 0 },
      { status: "demo" as const, count: 0 },
      { status: "won" as const, count: 0 },
      { status: "lost" as const, count: 0 },
    ];
    const html = renderToString(<Funnel data={data} width={600} />);
    expect(html).toContain("0%");
    expect(html).not.toContain("NaN");
  });
});
```

- [ ] **Step 3: Run, confirm fail**

```bash
pnpm test lib/admin/svg-chart.test.tsx
```

- [ ] **Step 4: Implement `lib/admin/svg-chart.tsx`**

```tsx
import type { DailyBySource } from "./kpi";
import type { LeadStatus } from "@/lib/db/schema";
import { STATUS_META } from "./status-meta";

// Brand-aligned color slots for source bars (matches paper/ink/green recipe)
const SOURCE_COLORS = ["#03B73D", "#7ED99A", "#3B4756", "#6B7682", "#E8EBE5"];
const SOURCE_FALLBACK = "#0B1826";

interface StackedBarsProps {
  data: DailyBySource[];
  width: number;
  height: number;
}

export function StackedBars({ data, width, height }: StackedBarsProps) {
  const padding = { top: 16, right: 8, bottom: 24, left: 32 };
  const days = Array.from(new Set(data.map((d) => d.day))).sort();
  const sources = Array.from(new Set(data.map((d) => d.source)));

  const sourceColor = (s: string) => {
    const idx = sources.indexOf(s);
    return idx < SOURCE_COLORS.length ? SOURCE_COLORS[idx] : SOURCE_FALLBACK;
  };

  const totals = days.map((day) =>
    data.filter((d) => d.day === day).reduce((sum, d) => sum + d.count, 0),
  );
  const maxTotal = Math.max(1, ...totals);

  const colWidth = days.length === 0 ? 0 : (width - padding.left - padding.right) / days.length;
  const barWidth = Math.max(2, colWidth - 2);
  const plotHeight = height - padding.top - padding.bottom;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Лиды по дням за последние ${days.length} дн.`}
      className="block"
    >
      {/* Y axis grid lines (4 ticks) */}
      {[0.25, 0.5, 0.75, 1].map((frac, i) => {
        const y = padding.top + plotHeight * (1 - frac);
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y}
              stroke="#E8EBE5" strokeWidth={1} />
            <text x={padding.left - 4} y={y + 3} textAnchor="end"
              fontSize="10" fill="#6B7682" fontFamily="var(--font-body)">
              {Math.round(maxTotal * frac)}
            </text>
          </g>
        );
      })}

      {days.map((day, i) => {
        const dayData = data.filter((d) => d.day === day);
        const x = padding.left + i * colWidth + 1;
        let yCursor = padding.top + plotHeight;
        return (
          <g key={day} className="day">
            {dayData.map((d) => {
              const h = (d.count / maxTotal) * plotHeight;
              yCursor -= h;
              return (
                <rect
                  key={d.source}
                  x={x}
                  y={yCursor}
                  width={barWidth}
                  height={h}
                  fill={sourceColor(d.source)}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

interface FunnelProps {
  data: { status: LeadStatus; count: number }[];
  width: number;
}

export function Funnel({ data, width }: FunnelProps) {
  const total = data[0]?.count ?? 0;
  const rowHeight = 32;
  const gap = 6;
  const labelW = 110;
  const barX = labelW + 8;
  const barW = width - barX - 90;
  const height = data.length * (rowHeight + gap) + 8;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Воронка по статусам лидов"
      className="block"
    >
      {data.map((row, i) => {
        const meta = STATUS_META[row.status];
        const pct = total === 0 ? 0 : Math.round((row.count / total) * 100);
        const w = total === 0 ? 0 : (row.count / total) * barW;
        const y = i * (rowHeight + gap);
        const fill = row.status === "won" ? "#03B73D" : "#3B4756";
        return (
          <g key={row.status} className="row">
            <text x={0} y={y + 20} fontSize="13" fill="#0B1826" fontFamily="var(--font-body)" fontWeight={500}>
              {meta.emoji} {meta.label}
            </text>
            <rect x={barX} y={y + 4} width={barW} height={rowHeight - 4} fill="#F6F7F4" />
            <rect x={barX} y={y + 4} width={w} height={rowHeight - 4} fill={fill} />
            <text x={width - 4} y={y + 20} textAnchor="end" fontSize="13" fill="#0B1826" fontFamily="var(--font-body)">
              {row.count} <tspan fill="#6B7682">({pct}%)</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 5: Run, confirm pass**

```bash
pnpm test lib/admin/svg-chart.test.tsx
```
Expected: 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/admin/svg-chart.tsx lib/admin/svg-chart.test.tsx vitest.config.ts
git commit -m "feat(admin): add hand-rolled SVG StackedBars and Funnel components"
```

---

## Task 13: Admin dashboard page

**Files:**
- Create: `app/admin/dashboard/page.tsx`

- [ ] **Step 1: Implement the page**

```tsx
import {
  getLeadCounts,
  getFunnel,
  getConversionRate,
  getMedianTimeToContactSec,
  getDailyLeadsBySource,
  getTopSourcesByWinRate,
  deltaPercent,
} from "@/lib/admin/kpi";
import { StackedBars, Funnel } from "@/lib/admin/svg-chart";

export const dynamic = "force-dynamic";

function formatDelta(delta: number | null): { label: string; tone: "up" | "down" | "flat" | "na" } {
  if (delta === null) return { label: "—", tone: "na" };
  if (delta > 0) return { label: `↑ ${delta}%`, tone: "up" };
  if (delta < 0) return { label: `↓ ${Math.abs(delta)}%`, tone: "down" };
  return { label: "0%", tone: "flat" };
}

function formatMedianHours(sec: number | null): string {
  if (sec === null) return "—";
  if (sec < 60) return `${sec}с`;
  if (sec < 3600) return `${Math.round(sec / 60)}м`;
  if (sec < 86400) return `${Math.round(sec / 3600)}ч`;
  return `${Math.round(sec / 86400)}д`;
}

interface TileProps {
  eyebrow: string;
  value: string;
  delta?: { label: string; tone: string };
  caption?: string;
}

function Tile({ eyebrow, value, delta, caption }: TileProps) {
  return (
    <div className="rounded-lg border border-mist bg-paper p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{eyebrow}</div>
      <div className="mt-3 font-display text-4xl font-bold text-ink-900">{value}</div>
      {delta && (
        <div className={`mt-1 text-xs ${delta.tone === "up" ? "text-green-700" : delta.tone === "down" ? "text-ink-500" : "text-ink-500"}`}>
          {delta.label}
        </div>
      )}
      {caption && <div className="mt-1 text-xs text-ink-500">{caption}</div>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [counts, funnel, conv, medianSec, daily, topSources] = await Promise.all([
    getLeadCounts(),
    getFunnel(),
    getConversionRate(),
    getMedianTimeToContactSec(),
    getDailyLeadsBySource(30),
    getTopSourcesByWinRate(5),
  ]);

  const todayDelta = formatDelta(deltaPercent(counts.today, counts.yesterday));
  const weekDelta = formatDelta(deltaPercent(counts.thisWeek, counts.lastWeek));
  const monthDelta = formatDelta(deltaPercent(counts.thisMonth, counts.lastMonth));

  return (
    <main className="mx-auto max-w-7xl p-8 font-sans">
      <header className="mb-8 flex flex-wrap items-baseline gap-4">
        <h1 className="font-display text-3xl font-bold text-ink-900">Dashboard</h1>
        <nav className="text-sm text-ink-500">
          <a href="/admin/leads" className="hover:text-ink-900">Leads</a>
          <span className="mx-2">·</span>
          <a href="/admin/leads/export.csv" className="hover:text-ink-900">Export CSV</a>
        </nav>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Tile eyebrow="Сегодня"  value={String(counts.today)}    delta={todayDelta}  caption="от вчера" />
        <Tile eyebrow="Неделя"   value={String(counts.thisWeek)} delta={weekDelta}   caption="от пр. недели" />
        <Tile eyebrow="Месяц"    value={String(counts.thisMonth)} delta={monthDelta} caption="от пр. месяца" />
        <Tile eyebrow="Всего"    value={String(counts.total)} />
        <Tile eyebrow="Конверсия" value={conv === null ? "—" : `${conv}%`} caption="new → won" />
        <Tile eyebrow="Медиана"   value={formatMedianHours(medianSec)} caption="до контакта" />
      </section>

      <section className="mt-12">
        <h2 className="mb-1 font-display text-xl font-semibold text-ink-900">Лиды за 30 дней</h2>
        <p className="mb-4 text-sm text-ink-500">по источникам (stacked)</p>
        <div className="rounded-lg border border-mist bg-paper p-4">
          <StackedBars data={daily} width={1000} height={240} />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-ink-900">Воронка</h2>
          <p className="mb-4 text-sm text-ink-500">по статусам, относительно new</p>
          <div className="rounded-lg border border-mist bg-paper p-4">
            <Funnel data={funnel} width={480} />
          </div>
        </div>
        <div>
          <h2 className="mb-1 font-display text-xl font-semibold text-ink-900">Топ источников</h2>
          <p className="mb-4 text-sm text-ink-500">по объёму и win-rate</p>
          <div className="rounded-lg border border-mist bg-paper p-4 text-sm">
            {topSources.length === 0 && <div className="text-ink-500">Нет данных</div>}
            {topSources.map((s) => (
              <div key={s.source} className="flex items-baseline justify-between border-b border-mist py-2 last:border-b-0">
                <span className="font-medium text-ink-900">{s.source}</span>
                <span className="text-ink-500">{s.total} лидов · {s.winRate}% won</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/dashboard/page.tsx
git commit -m "feat(admin): add /admin/dashboard with tiles, stacked bars, funnel"
```

---

## Task 14: Lead detail page

**Files:**
- Create: `app/admin/leads/[id]/page.tsx`

- [ ] **Step 1: Implement the page**

```tsx
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, leads, leadEvents } from "@/lib/db";
import type { Lead, LeadEvent } from "@/lib/db/schema";
import { STATUS_META } from "@/lib/admin/status-meta";
import { StatusDropdown } from "./status-dropdown";

export const dynamic = "force-dynamic";

function formatTashkent(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  }).format(d);
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const leadRows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  const lead = leadRows[0] as Lead | undefined;
  if (!lead) notFound();

  const events = (await db
    .select()
    .from(leadEvents)
    .where(eq(leadEvents.leadId, id))
    .orderBy(desc(leadEvents.createdAt))) as LeadEvent[];

  const meta = STATUS_META[lead.status];

  return (
    <main className="mx-auto max-w-3xl p-8 font-sans">
      <a href="/admin/leads" className="text-sm text-ink-500 hover:text-ink-900">← К списку</a>

      <header className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Заявка #{lead.id}</div>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">{lead.businessName}</h1>
          <p className="mt-1 text-sm text-ink-500">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${meta.dotClass}`}></span>
            {meta.emoji} {meta.label}
            {lead.lastChangedBy && lead.lastStatusChangeAt && (
              <span className="ml-2 text-ink-500">· {lead.lastChangedBy} · {formatTashkent(lead.lastStatusChangeAt)}</span>
            )}
          </p>
        </div>
        <StatusDropdown leadId={lead.id} currentStatus={lead.status} />
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-mist bg-paper p-5 text-sm sm:grid-cols-2">
        <Detail label="Тип бизнеса" value={lead.businessType === "other" ? lead.businessTypeOther ?? "—" : lead.businessType} />
        <Detail label="Владелец" value={lead.ownerName} />
        <Detail label="Контакт" value={lead.ownerContact} />
        <Detail label="Оборудование" value={lead.needsEquipment ? "Да" : "Нет"} />
        <Detail label="Язык" value={lead.language} />
        <Detail label="Источник" value={lead.source} />
        <Detail label="UTM" value={[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"} />
        <Detail label="Referrer" value={lead.referrer ?? "—"} />
        <Detail label="IP" value={lead.ip ?? "—"} />
        <Detail label="Создано" value={formatTashkent(lead.createdAt)} />
        <Detail label="Telegram msg" value={lead.telegramMessageId ?? "—"} />
        {lead.comment && (
          <div className="sm:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Комментарий</div>
            <div className="mt-1 text-ink-900">«{lead.comment}»</div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink-900">Timeline</h2>
        <ol className="space-y-2 text-sm">
          {events.map((e) => {
            const fromMeta = e.fromStatus ? STATUS_META[e.fromStatus] : null;
            const toMeta = STATUS_META[e.toStatus];
            return (
              <li key={e.id} className="flex items-baseline gap-3 border-l-2 border-mist pl-4">
                <span className="font-mono text-xs text-ink-500">{formatTashkent(e.createdAt)}</span>
                <span className="text-ink-900">
                  {e.actor}:
                  {fromMeta ? ` ${fromMeta.emoji} ${fromMeta.label} → ` : " создан → "}
                  {toMeta.emoji} {toMeta.label}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</div>
      <div className="mt-1 text-ink-900">{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create the client-component `StatusDropdown`**

Create `app/admin/leads/[id]/status-dropdown.tsx`:
```tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/lib/db/schema";
import { STATUS_META } from "@/lib/admin/status-meta";

const STATUSES: LeadStatus[] = ["new", "contacted", "demo", "won", "lost"];

export function StatusDropdown({ leadId, currentStatus }: { leadId: number; currentStatus: LeadStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = async (to: LeadStatus) => {
    if (to === currentStatus) return;
    setError(null);
    const res = await fetch(`/api/admin/leads/${leadId}/status`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to_status: to }),
    });
    if (!res.ok) {
      setError("Не удалось обновить статус");
      return;
    }
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        disabled={pending}
        value={currentStatus}
        onChange={(e) => change(e.target.value as LeadStatus)}
        className="rounded-md border border-mist bg-white px-3 py-2 text-sm font-medium text-ink-900 disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].emoji} {STATUS_META[s].label}
          </option>
        ))}
      </select>
      {error && <div className="text-xs text-stop">{error}</div>}
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/leads/[id]/page.tsx app/admin/leads/[id]/status-dropdown.tsx
git commit -m "feat(admin): add /admin/leads/[id] detail page with timeline + status dropdown"
```

---

## Task 15: Extend /admin/leads with status column + dropdown + filter

**Files:**
- Modify: `app/admin/leads/page.tsx`

- [ ] **Step 1: Read the existing file**

Read `app/admin/leads/page.tsx`. Note the current table columns and filter form structure.

- [ ] **Step 2: Update the file**

Apply these changes:

a) Add imports at top:
```tsx
import { STATUS_META } from "@/lib/admin/status-meta";
import { StatusDropdown } from "./[id]/status-dropdown";
```

b) In the filter form, add a status `<select>` after the "type" select:
```tsx
        <select name="status" defaultValue={searchParams.status as string ?? ""} className="rounded border px-2 py-1">
          <option value="">все статусы</option>
          <option value="new">🆕 Новый</option>
          <option value="contacted">📞 В работе</option>
          <option value="demo">📅 Демо</option>
          <option value="won">🏆 Выигран</option>
          <option value="lost">❌ Проигран</option>
        </select>
```

c) In the table `<thead>`, add a Status column header BEFORE "Источник":
```tsx
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Изм.</th>
```
(adjust column count for the Status + Last-change columns.)

d) In the row rendering, replace the existing `<td>` cells for businessName, ownerName, ownerContact, equipment with the same code, but:
- Change `<td className="border px-2 py-1">{r.id}</td>` to:
  ```tsx
  <td className="border px-2 py-1">
    <a href={`/admin/leads/${r.id}`} className="font-mono text-ink-900 hover:underline">#{r.id}</a>
  </td>
  ```
- AFTER the equipment column and BEFORE the source column, INSERT:
  ```tsx
  <td className="border px-2 py-1">
    <div className="flex items-center gap-2">
      <span className={`inline-block h-2 w-2 rounded-full ${STATUS_META[r.status].dotClass}`} />
      <StatusDropdown leadId={r.id} currentStatus={r.status} />
    </div>
  </td>
  <td className="border px-2 py-1 text-xs text-ink-500">
    {r.lastChangedBy ?? "—"}
  </td>
  ```

e) Also update `app/admin/leads/page.tsx`'s nav header — add a Dashboard link:
```tsx
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">BirLiy · Leads</h1>
          <nav className="text-sm text-ink-500">
            <a href="/admin/dashboard" className="hover:text-ink-900">Dashboard</a>
          </nav>
        </div>
        <a href={exportUrl} ...>Экспорт CSV</a>
      </header>
```

- [ ] **Step 3: Type-check**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/leads/page.tsx
git commit -m "feat(admin): add status column + dropdown + filter to /admin/leads"
```

---

## Task 16: `.env.example` + README updates

**Files:**
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Update `.env.example`**

Add at the bottom:
```
# Webhook secret — set via setWebhook call. Random 32+ char hex string.
# Generate: openssl rand -hex 32
TELEGRAM_WEBHOOK_SECRET=
```

- [ ] **Step 2: Update `README.md`**

Read the current README. Add a new section after "Deploy":

```markdown
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
```

- [ ] **Step 3: Commit**

```bash
git add .env.example README.md
git commit -m "docs: document webhook setup + sales pipeline endpoints"
```

---

## Task 17: Backfill script

**Files:**
- Create: `scripts/backfill-events.ts`

- [ ] **Step 1: Implement**

```ts
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function main() {
  // Insert one 'system → new' event per lead that has no events yet.
  const result = await db.execute(sql`
    INSERT INTO lead_events (lead_id, from_status, to_status, actor, created_at)
    SELECT l.id, NULL, 'new', 'system', l.created_at
    FROM leads l
    WHERE NOT EXISTS (
      SELECT 1 FROM lead_events e WHERE e.lead_id = l.id
    )
  `);
  const rowCount = (result as any).rowCount ?? (result as any).count ?? "?";
  console.log(`Backfill complete. Rows inserted: ${rowCount}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

- [ ] **Step 2: Type-check**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Run the script locally to backfill the Neon DB**

```bash
pnpm tsx scripts/backfill-events.ts
```
Expected: `Backfill complete. Rows inserted: N` where N is the number of pre-Sub-2 leads.

Run a second time to verify idempotency:
```bash
pnpm tsx scripts/backfill-events.ts
```
Expected: `Rows inserted: 0`.

- [ ] **Step 4: Commit**

```bash
git add scripts/backfill-events.ts
git commit -m "feat(scripts): add idempotent backfill of lead_events for pre-Sub-2 leads"
```

---

## Task 18: Set-webhook script (one-shot helper)

**Files:**
- Create: `scripts/set-webhook.ts`

- [ ] **Step 1: Implement**

```ts
import "dotenv/config";

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!token || !secret || !siteUrl) {
    throw new Error("TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL all required");
  }

  const webhookUrl = `${siteUrl.replace(/\/$/, "")}/api/telegram/webhook`;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["callback_query", "message"],
    }),
  });
  const json = await res.json();
  console.log("setWebhook response:", JSON.stringify(json, null, 2));

  const info = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const infoJson = await info.json();
  console.log("getWebhookInfo:", JSON.stringify(infoJson, null, 2));
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/set-webhook.ts
git commit -m "feat(scripts): add set-webhook helper"
```

---

## Task 19: Local smoke test

- [ ] **Step 1: Migrate Neon to Sub-2 schema**

If not already done in Task 1 step 3:
```bash
pnpm db:migrate
```

- [ ] **Step 2: Backfill events**

```bash
pnpm tsx scripts/backfill-events.ts
```

- [ ] **Step 3: Run all tests**

```bash
pnpm test
```
Expected: all tests pass (Sub-1 61 + Sub-2 ~30 = ~91 total).

- [ ] **Step 4: Restart dev server**

```bash
# stop the existing dev process if running, then:
pnpm dev
```

- [ ] **Step 5: Browser smoke**

Visit each:
- `http://localhost:3000/admin/dashboard` — should render tiles + charts (basic auth prompt first time). Even with no historical data, tiles should show 0s and charts should render empty without error.
- `http://localhost:3000/admin/leads` — Status column visible. Try changing status via dropdown for a real lead. After page refresh, status persists, last_changed_by shows `admin@web`.
- `http://localhost:3000/admin/leads/1` (substitute a real lead id) — detail view + timeline showing at least one `system → new` event.

- [ ] **Step 6: Verify in-app status change synced to Telegram**

Submit a brand new lead from the live landing form to receive a Telegram message with inline buttons. Then change the status from the web (`/admin/leads`). The Telegram message should update with the new status + `admin@web` actor.

(If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are correctly set in `.env.local` from Sub-1, this works locally.)

- [ ] **Step 7: No commit — verification only**

If anything failed, go back and fix the relevant earlier task.

---

## Task 20: Manual production deploy

This step requires Jack's hands — not automatable from this session.

- [ ] **Step 1: Generate webhook secret + put in Railway**

```bash
openssl rand -hex 32
```
Copy the output. In Railway → service variables → add `TELEGRAM_WEBHOOK_SECRET = <secret>`.

- [ ] **Step 2: Merge the feature branch and let Railway deploy**

```bash
git push
# wait for Railway build + start (which auto-runs db:migrate)
```

Verify migration applied:
```bash
railway run psql -c "\d lead_events"
```

- [ ] **Step 3: Backfill events on prod**

```bash
railway run pnpm tsx scripts/backfill-events.ts
```

- [ ] **Step 4: Register webhook with Telegram**

Locally (with prod env loaded — Jack copies prod env to `.env.local` temporarily OR uses `railway run`):
```bash
railway run pnpm tsx scripts/set-webhook.ts
```
Verify the output shows `"ok": true` and `pending_update_count: 0`.

- [ ] **Step 5: Live smoke**

Submit a fresh lead from the live landing → tap "Демо" in Telegram → verify message updates and `/admin/dashboard` increments. Tap again → idempotent no-op.

- [ ] **Step 6: No commit — operational task**

---

## Done — Acceptance criteria mapping

| Spec criterion | Task |
|---|---|
| Tapping "Демо" updates DB, inserts event, edits message | T7 + T8 |
| Tapping same status twice is idempotent | T7 |
| Status change from web syncs to Telegram | T9 |
| Dashboard shows 6 tiles | T11 + T13 |
| Stacked-bar chart for 30 days | T12 + T13 |
| Funnel chart with 5 rows | T12 + T13 |
| `/admin/leads/[id]` with timeline | T14 |
| Webhook 401 on bad secret | T8 |
| Backfill idempotent | T17 |
| Times in Asia/Tashkent | T11 (date math) + T3 (message TZ) |
| No new chart libraries | T12 (hand-rolled SVG) |
| Green ≤ 5 places on dashboard | T13 (only `won` funnel bar + delta-up arrows = ≤ 4 instances) |
