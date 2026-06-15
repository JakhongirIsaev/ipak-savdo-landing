# Ipak Savdo Lead Intake Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Sub-project 1 of the Ipak Savdo lead funnel — form submission → Postgres → Telegram notification → password-protected admin with CSV export. Hosted Railway-only.

**Architecture:** Next.js 14 App Router. POST `/api/lead` validates with zod, writes to Postgres via Drizzle, fires HTML-formatted message to Telegram Bot API via `fetch`. `/admin/leads` is HTTP-basic-auth protected, server-rendered, with URL-encoded filter state. No separate bot worker — bot is one-way notifier.

**Tech Stack:** Next.js 14, TypeScript, Drizzle ORM, `postgres` driver, Postgres (Railway), Zod, Vitest, Tailwind (existing), pnpm.

**Spec reference:** `docs/superpowers/specs/2026-05-25-ipak-savdo-lead-backend-design.md`

---

## File Structure

**New files (in order of creation):**

| Path | Responsibility |
|---|---|
| `vitest.config.ts` | Test runner config |
| `drizzle.config.ts` | Drizzle migration generator config |
| `lib/db/schema.ts` | `leads` table definition (Drizzle) |
| `lib/db/index.ts` | Drizzle client (singleton) |
| `drizzle/0000_*.sql` | Generated initial migration |
| `lib/validators/lead.ts` | Zod schema for `POST /api/lead` body |
| `lib/validators/lead.test.ts` | Validator tests |
| `lib/http/get-ip.ts` | Extract client IP from request headers |
| `lib/http/get-ip.test.ts` | IP extractor tests |
| `lib/rate-limit.ts` | In-memory IP rate limiter |
| `lib/rate-limit.test.ts` | Rate limiter tests |
| `lib/html-escape.ts` | HTML special-char escape for Telegram |
| `lib/html-escape.test.ts` | Escape tests |
| `lib/telegram/format.ts` | Format a `Lead` into HTML message body |
| `lib/telegram/format.test.ts` | Formatter tests |
| `lib/telegram/notify.ts` | Wrap `fetch` to Telegram Bot API |
| `lib/csv.ts` | Serialize array of objects to CSV string |
| `lib/csv.test.ts` | CSV tests |
| `lib/admin/filters.ts` | URL query params → Drizzle where clause |
| `lib/admin/filters.test.ts` | Filter builder tests |
| `app/api/lead/route.ts` | POST handler |
| `app/admin/leads/page.tsx` | Admin table (server component) |
| `app/admin/leads/export.csv/route.ts` | CSV streaming endpoint |
| `middleware.ts` | HTTP Basic Auth for `/admin/*` |
| `.env.example` | Required env var template |

**Modified files:**

| Path | Change |
|---|---|
| `package.json` | Add deps + `test` script + change `start` to run migrations first |
| `components/LeadForm.tsx` | Add `business_name` and `needs_equipment` fields, honeypot, real submit, error display |
| `components/LandingPage.tsx` | Pass captured `source`/`utm_*` query params into `LeadForm` |
| `lib/i18n.ts` | Add new translation keys for form fields and error states (both `ru` and `uz`) |
| `README.md` | Document new architecture, env vars, admin URL |
| `next.config.js` | (verify only — should remain `output: 'standalone'`) |

**Deleted (final cleanup task):**

| Path | Reason |
|---|---|
| `.vercel/` | Vercel project deleted, no longer linked |

---

## Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Add runtime + dev dependencies**

Run:
```bash
pnpm add drizzle-orm postgres zod
pnpm add -D drizzle-kit vitest @vitest/coverage-v8 tsx
```

Expected: `package.json` updated, `pnpm-lock.yaml` updated.

- [ ] **Step 2: Add `test` and migration scripts**

Modify `package.json` `scripts` section so it reads:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "tsx scripts/migrate.ts && next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "tsx scripts/migrate.ts"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["lib/**/*.test.ts", "app/**/*.test.ts", "middleware.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 4: Verify install**

Run:
```bash
pnpm test
```

Expected: `No test files found` (zero tests yet) — exit code 1 is fine, we just want vitest to load without crashing.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "chore: add drizzle, zod, vitest dependencies"
```

---

## Task 2: Define Drizzle schema for `leads`

**Files:**
- Create: `lib/db/schema.ts`
- Create: `drizzle.config.ts`
- Create: `drizzle/` directory (auto-created by drizzle-kit)

- [ ] **Step 1: Create `lib/db/schema.ts`**

```ts
import { pgTable, serial, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const businessTypes = ["shop", "cafe", "restaurant", "market", "beauty", "service", "other"] as const;
export type BusinessType = (typeof businessTypes)[number];

export const languages = ["ru", "uz"] as const;
export type Language = (typeof languages)[number];

export const leadStatuses = ["new", "contacted", "demo", "won", "lost"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    businessName: text("business_name").notNull(),
    businessType: text("business_type", { enum: businessTypes }).notNull(),
    businessTypeOther: text("business_type_other"),
    ownerName: text("owner_name").notNull(),
    ownerContact: text("owner_contact").notNull(),
    needsEquipment: boolean("needs_equipment").notNull().default(false),
    comment: text("comment"),
    source: text("source").notNull().default("direct"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    ip: text("ip"),
    language: text("language", { enum: languages }).notNull(),
    status: text("status", { enum: leadStatuses }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    createdAtIdx: index("leads_created_at_idx").on(t.createdAt),
    sourceIdx: index("leads_source_idx").on(t.source),
    statusIdx: index("leads_status_idx").on(t.status),
  }),
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
```

- [ ] **Step 2: Create `drizzle.config.ts`**

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
```

- [ ] **Step 3: Generate the initial migration**

Run:
```bash
pnpm db:generate
```

Expected: a file `drizzle/0000_*.sql` is created containing `CREATE TABLE leads ...` and the three indexes.

- [ ] **Step 4: Visually inspect generated SQL**

Open `drizzle/0000_*.sql`. Confirm all columns from schema are present, enum constraints expanded, defaults applied.

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.ts drizzle.config.ts drizzle/
git commit -m "feat(db): add leads table schema and initial migration"
```

---

## Task 3: Drizzle client and migration runner

**Files:**
- Create: `lib/db/index.ts`
- Create: `scripts/migrate.ts`

- [ ] **Step 1: Create `lib/db/index.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, { max: 5 });
export const db = drizzle(client, { schema });
export * from "./schema";
```

- [ ] **Step 2: Create `scripts/migrate.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

await migrate(db, { migrationsFolder: "./drizzle" });
await client.end();
console.log("Migrations applied.");
```

- [ ] **Step 3: Smoke-run the migration script locally** (skip if no local Postgres)

If you have a local Postgres or Railway Postgres URL handy:
```bash
DATABASE_URL="postgresql://..." pnpm db:migrate
```
Expected: `Migrations applied.` and `\dt` shows `leads` table.

If you do NOT have a Postgres available right now, skip this step — Task 17 will run it on Railway.

- [ ] **Step 4: Commit**

```bash
git add lib/db/index.ts scripts/migrate.ts
git commit -m "feat(db): add drizzle client and migration runner"
```

---

## Task 4: Zod validator for lead input (TDD)

**Files:**
- Create: `lib/validators/lead.test.ts`
- Create: `lib/validators/lead.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/validators/lead.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { leadInputSchema } from "./lead";

const valid = {
  business_name: "BillzCafe",
  business_type: "cafe",
  owner_name: "Ivan",
  owner_contact: "+998901234567",
  needs_equipment: true,
  language: "ru",
};

describe("leadInputSchema", () => {
  it("accepts a minimal valid payload", () => {
    const result = leadInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects empty business_name", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects business_name shorter than 2 chars", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_name: "X" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown business_type", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_type: "spaceship" });
    expect(result.success).toBe(false);
  });

  it("requires business_type_other when business_type is 'other'", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_type: "other" });
    expect(result.success).toBe(false);
  });

  it("accepts business_type 'other' with business_type_other filled", () => {
    const result = leadInputSchema.safeParse({
      ...valid,
      business_type: "other",
      business_type_other: "Bakery chain",
    });
    expect(result.success).toBe(true);
  });

  it("forbids business_type_other when business_type is not 'other'", () => {
    const result = leadInputSchema.safeParse({
      ...valid,
      business_type_other: "Should not be here",
    });
    expect(result.success).toBe(false);
  });

  it("rejects owner_contact shorter than 5 chars", () => {
    const result = leadInputSchema.safeParse({ ...valid, owner_contact: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects comment longer than 500 chars", () => {
    const result = leadInputSchema.safeParse({ ...valid, comment: "a".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid language", () => {
    const result = leadInputSchema.safeParse({ ...valid, language: "en" });
    expect(result.success).toBe(false);
  });

  it("ignores honeypot when empty", () => {
    const result = leadInputSchema.safeParse({ ...valid, _hp: "" });
    expect(result.success).toBe(true);
  });

  it("accepts honeypot when filled (separate gate handles it)", () => {
    // The schema does not reject _hp; the route handler treats non-empty _hp as silent-200.
    const result = leadInputSchema.safeParse({ ...valid, _hp: "bot" });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

Run:
```bash
pnpm test lib/validators/lead.test.ts
```
Expected: all tests fail with "Cannot find module './lead'".

- [ ] **Step 3: Implement `lib/validators/lead.ts`**

```ts
import { z } from "zod";
import { businessTypes, languages } from "@/lib/db/schema";

export const leadInputSchema = z
  .object({
    business_name: z.string().trim().min(2).max(100),
    business_type: z.enum(businessTypes),
    business_type_other: z.string().trim().min(1).max(50).optional().nullable(),
    owner_name: z.string().trim().min(2).max(50),
    owner_contact: z.string().trim().min(5).max(100),
    needs_equipment: z.boolean(),
    comment: z.string().trim().max(500).optional().nullable(),
    source: z.string().trim().max(50).optional(),
    utm_source: z.string().trim().max(100).optional().nullable(),
    utm_medium: z.string().trim().max(100).optional().nullable(),
    utm_campaign: z.string().trim().max(100).optional().nullable(),
    language: z.enum(languages),
    _hp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.business_type === "other") {
      if (!data.business_type_other || data.business_type_other.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["business_type_other"],
          message: "business_type_other is required when business_type is 'other'",
        });
      }
    } else if (data.business_type_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["business_type_other"],
        message: "business_type_other must be empty unless business_type is 'other'",
      });
    }
  });

export type LeadInput = z.infer<typeof leadInputSchema>;
```

- [ ] **Step 4: Run tests to confirm they pass**

Run:
```bash
pnpm test lib/validators/lead.test.ts
```
Expected: all 12 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/validators/lead.ts lib/validators/lead.test.ts
git commit -m "feat(validators): add lead input zod schema with conditional business_type_other"
```

---

## Task 5: IP extractor (TDD)

**Files:**
- Create: `lib/http/get-ip.test.ts`
- Create: `lib/http/get-ip.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/http/get-ip.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getClientIp } from "./get-ip";

const makeRequest = (headers: Record<string, string>): Request =>
  new Request("http://example.com", { headers });

describe("getClientIp", () => {
  it("returns first IP from X-Forwarded-For", () => {
    const req = makeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("trims whitespace around IP", () => {
    const req = makeRequest({ "x-forwarded-for": "  1.2.3.4  " });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to X-Real-IP when XFF missing", () => {
    const req = makeRequest({ "x-real-ip": "9.9.9.9" });
    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  it("returns null when no IP headers", () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

Run:
```bash
pnpm test lib/http/get-ip.test.ts
```
Expected: all fail with import error.

- [ ] **Step 3: Implement `lib/http/get-ip.ts`**

```ts
export function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}
```

- [ ] **Step 4: Run tests to confirm they pass**

Run:
```bash
pnpm test lib/http/get-ip.test.ts
```
Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/http/get-ip.ts lib/http/get-ip.test.ts
git commit -m "feat(http): add IP extractor with XFF/Real-IP fallback"
```

---

## Task 6: In-memory rate limiter (TDD)

**Files:**
- Create: `lib/rate-limit.test.ts`
- Create: `lib/rate-limit.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/rate-limit.test.ts`:
```ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to N requests in window", () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(true);
  });

  it("blocks the (N+1)th request", () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 });
    limiter.check("ip1");
    limiter.check("ip1");
    limiter.check("ip1");
    expect(limiter.check("ip1")).toBe(false);
  });

  it("isolates limits per key", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip2")).toBe(true);
    expect(limiter.check("ip1")).toBe(false);
  });

  it("allows again after window elapses", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(limiter.check("ip1")).toBe(true);
  });

  it("treats null key as a shared bucket", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check(null)).toBe(true);
    expect(limiter.check(null)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests, confirm fail**

Run:
```bash
pnpm test lib/rate-limit.test.ts
```
Expected: fail with import error.

- [ ] **Step 3: Implement `lib/rate-limit.ts`**

```ts
type Entry = { count: number; resetAt: number };

export interface RateLimiterOptions {
  max: number;
  windowMs: number;
}

export interface RateLimiter {
  check(key: string | null): boolean;
}

export function createRateLimiter({ max, windowMs }: RateLimiterOptions): RateLimiter {
  const store = new Map<string, Entry>();
  return {
    check(key) {
      const k = key ?? "__shared__";
      const now = Date.now();
      const existing = store.get(k);
      if (!existing || existing.resetAt <= now) {
        store.set(k, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (existing.count >= max) {
        return false;
      }
      existing.count += 1;
      return true;
    },
  };
}

export const leadRateLimiter = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });
```

- [ ] **Step 4: Run tests, confirm pass**

Run:
```bash
pnpm test lib/rate-limit.test.ts
```
Expected: all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit.ts lib/rate-limit.test.ts
git commit -m "feat(rate-limit): add in-memory per-key sliding-window limiter"
```

---

## Task 7: HTML escaper (TDD)

**Files:**
- Create: `lib/html-escape.test.ts`
- Create: `lib/html-escape.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/html-escape.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { escapeHtml } from "./html-escape";

describe("escapeHtml", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes &", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes quotes", () => {
    expect(escapeHtml(`"foo" 'bar'`)).toBe("&quot;foo&quot; &#39;bar&#39;");
  });

  it("returns empty string for null/undefined input", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("Hello, world")).toBe("Hello, world");
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test lib/html-escape.test.ts
```

- [ ] **Step 3: Implement `lib/html-escape.ts`**

```ts
export function escapeHtml(input: string | null | undefined): string {
  if (input == null) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test lib/html-escape.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/html-escape.ts lib/html-escape.test.ts
git commit -m "feat(util): add HTML escape helper"
```

---

## Task 8: Telegram message formatter (TDD)

**Files:**
- Create: `lib/telegram/format.test.ts`
- Create: `lib/telegram/format.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/telegram/format.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { formatLeadMessage } from "./format";
import type { Lead } from "@/lib/db/schema";

const baseLead: Lead = {
  id: 42,
  businessName: "BillzCafe",
  businessType: "cafe",
  businessTypeOther: null,
  ownerName: "Иван Иванов",
  ownerContact: "+998 90 123 45 67",
  needsEquipment: true,
  comment: "нужно срочно",
  source: "instagram",
  utmSource: "instagram",
  utmMedium: "bio",
  utmCampaign: "may26",
  referrer: null,
  userAgent: null,
  ip: null,
  language: "ru",
  status: "new",
  createdAt: new Date("2026-05-25T13:42:00Z"),
};

describe("formatLeadMessage", () => {
  it("includes the lead id with hash prefix", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toContain("#42");
  });

  it("includes business name and Russian-labeled business type", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toContain("BillzCafe");
    expect(msg).toContain("кафе");
  });

  it("uses business_type_other when type is 'other'", () => {
    const lead = { ...baseLead, businessType: "other" as const, businessTypeOther: "Пекарня" };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).toContain("Пекарня");
  });

  it("renders 'да' for needs_equipment=true and 'нет' for false", () => {
    expect(formatLeadMessage(baseLead, "https://example.com")).toContain("Оборудование:</b> да");
    expect(formatLeadMessage({ ...baseLead, needsEquipment: false }, "https://example.com")).toContain("Оборудование:</b> нет");
  });

  it("escapes HTML special chars in user-supplied fields", () => {
    const lead = { ...baseLead, ownerName: "<script>alert(1)</script>" };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).toContain("&lt;script&gt;");
    expect(msg).not.toContain("<script>");
  });

  it("formats time in Asia/Tashkent", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toMatch(/25\.05\.2026/);
    expect(msg).toMatch(/18:42/);
  });

  it("includes admin link with lead id", () => {
    const msg = formatLeadMessage(baseLead, "https://example.com");
    expect(msg).toContain("https://example.com/admin/leads?id=42");
  });

  it("omits comment line when comment is null", () => {
    const lead = { ...baseLead, comment: null };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).not.toContain("Комментарий");
  });

  it("omits UTM campaign when null", () => {
    const lead = { ...baseLead, utmCampaign: null };
    const msg = formatLeadMessage(lead, "https://example.com");
    expect(msg).not.toContain("кампания");
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test lib/telegram/format.test.ts
```

- [ ] **Step 3: Implement `lib/telegram/format.ts`**

```ts
import type { Lead, BusinessType } from "@/lib/db/schema";
import { escapeHtml } from "@/lib/html-escape";

const businessTypeLabelsRu: Record<BusinessType, string> = {
  shop: "магазин",
  cafe: "кафе",
  restaurant: "ресторан",
  market: "рынок / точка",
  beauty: "салон красоты",
  service: "сервис",
  other: "другое",
};

function formatTashkentTime(date: Date): string {
  const fmt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}, ${get("hour")}:${get("minute")}`;
}

export function formatLeadMessage(lead: Lead, siteUrl: string): string {
  const typeLabel =
    lead.businessType === "other" && lead.businessTypeOther
      ? escapeHtml(lead.businessTypeOther)
      : businessTypeLabelsRu[lead.businessType];

  const lines: string[] = [
    `🎯 <b>Новая заявка #${lead.id}</b>`,
    "",
    `🏪 <b>Бизнес:</b> ${escapeHtml(lead.businessName)} (${typeLabel})`,
    `👤 <b>Владелец:</b> ${escapeHtml(lead.ownerName)}`,
    `📞 <b>Контакт:</b> ${escapeHtml(lead.ownerContact)}`,
    `🛠 <b>Оборудование:</b> ${lead.needsEquipment ? "да" : "нет"}`,
  ];

  if (lead.comment && lead.comment.trim().length > 0) {
    lines.push(`💬 <b>Комментарий:</b> «${escapeHtml(lead.comment)}»`);
  }

  lines.push("");

  const sourceParts = [`📍 <b>Источник:</b> ${escapeHtml(lead.source)}`];
  if (lead.utmCampaign) sourceParts.push(`кампания: ${escapeHtml(lead.utmCampaign)}`);
  lines.push(sourceParts.join(" · "));

  lines.push(`🕒 ${formatTashkentTime(lead.createdAt)} (Asia/Tashkent)`);
  lines.push("");
  lines.push(`<a href="${siteUrl}/admin/leads?id=${lead.id}">👉 Открыть в админке</a>`);

  return lines.join("\n");
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test lib/telegram/format.test.ts
```
Expected: all 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/telegram/format.ts lib/telegram/format.test.ts
git commit -m "feat(telegram): add lead message formatter with HTML escaping and Tashkent TZ"
```

---

## Task 9: Telegram notify function

**Files:**
- Create: `lib/telegram/notify.ts`
- Create: `lib/telegram/notify.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/telegram/notify.test.ts`:
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

  it("posts to Telegram Bot API with correct shape", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await notifyNewLead(lead);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/bottest-token/sendMessage");
    const body = JSON.parse(init.body);
    expect(body.chat_id).toBe("-100123");
    expect(body.parse_mode).toBe("HTML");
    expect(body.text).toContain("Новая заявка #1");
    expect(body.disable_web_page_preview).toBe(true);
  });

  it("does not throw when fetch returns non-200", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{\"ok\":false}", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(notifyNewLead(lead)).resolves.toBeUndefined();
  });

  it("does not throw on network failure", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("boom"));
    vi.stubGlobal("fetch", fetchMock);
    await expect(notifyNewLead(lead)).resolves.toBeUndefined();
  });

  it("does not throw when env vars are missing — logs and returns", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(notifyNewLead(lead)).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test lib/telegram/notify.test.ts
```

- [ ] **Step 3: Implement `lib/telegram/notify.ts`**

```ts
import type { Lead } from "@/lib/db/schema";
import { formatLeadMessage } from "./format";

export async function notifyNewLead(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  if (!token || !chatId) {
    console.error("Telegram env vars missing — notification skipped for lead", lead.id);
    return;
  }

  const text = formatLeadMessage(lead, siteUrl);
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
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Telegram sendMessage failed", res.status, body);
    }
  } catch (err) {
    console.error("Telegram sendMessage error", err);
  } finally {
    clearTimeout(timeout);
  }
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test lib/telegram/notify.test.ts
```
Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/telegram/notify.ts lib/telegram/notify.test.ts
git commit -m "feat(telegram): add notify wrapper with timeout and silent failure"
```

---

## Task 10: POST /api/lead route

**Files:**
- Create: `app/api/lead/route.ts`
- Create: `app/api/lead/route.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app/api/lead/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks must be hoisted before importing the route.
vi.mock("@/lib/db", () => {
  const insertedRows: any[] = [];
  return {
    db: {
      insert: () => ({
        values: (row: any) => ({
          returning: async () => {
            const inserted = { ...row, id: insertedRows.length + 1, createdAt: new Date() };
            insertedRows.push(inserted);
            return [inserted];
          },
        }),
      }),
    },
    leads: {},
    __getInserted: () => insertedRows,
    __reset: () => insertedRows.splice(0),
  };
});

vi.mock("@/lib/telegram/notify", () => ({
  notifyNewLead: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "./route";
import * as dbMod from "@/lib/db";
import { notifyNewLead } from "@/lib/telegram/notify";

const validBody = {
  business_name: "BillzCafe",
  business_type: "cafe",
  owner_name: "Ivan",
  owner_contact: "+998901234567",
  needs_equipment: true,
  language: "ru",
};

// Each test uses a UNIQUE IP because the rate limiter is a module-level singleton
// that persists state across tests. Using the same IP would cause earlier tests
// to consume the budget that the rate-limit test expects.
const makeReq = (body: unknown, ip: string, headers: Record<string, string> = {}) =>
  new Request("http://example.com/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip, ...headers },
    body: JSON.stringify(body),
  });

describe("POST /api/lead", () => {
  beforeEach(() => {
    (dbMod as any).__reset();
    vi.mocked(notifyNewLead).mockClear();
  });

  it("creates a lead and returns 200", async () => {
    const res = await POST(makeReq(validBody, "1.1.1.1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(typeof json.id).toBe("number");
    expect((dbMod as any).__getInserted()).toHaveLength(1);
    expect(notifyNewLead).toHaveBeenCalledOnce();
  });

  it("returns 400 on validation failure", async () => {
    const res = await POST(makeReq({ ...validBody, business_name: "" }, "2.2.2.2"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe("validation");
  });

  it("silently returns 200 without writing when honeypot is filled", async () => {
    const res = await POST(makeReq({ ...validBody, _hp: "bot-trap" }, "3.3.3.3"));
    expect(res.status).toBe(200);
    expect((dbMod as any).__getInserted()).toHaveLength(0);
    expect(notifyNewLead).not.toHaveBeenCalled();
  });

  it("returns 429 after exceeding rate limit", async () => {
    // The shared module-level limiter is 5 per 10 min, per IP.
    // We use a fresh IP so this test isn't affected by prior tests above.
    const ip = "4.4.4.4";
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeReq(validBody, ip));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeReq(validBody, ip));
    expect(res.status).toBe(429);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test app/api/lead/route.test.ts
```

- [ ] **Step 3: Implement `app/api/lead/route.ts`**

```ts
import { db, leads } from "@/lib/db";
import { leadInputSchema } from "@/lib/validators/lead";
import { leadRateLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/http/get-ip";
import { notifyNewLead } from "@/lib/telegram/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const ip = getClientIp(req);

  if (!leadRateLimiter.check(ip)) {
    return Response.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (data._hp && data._hp.length > 0) {
    return Response.json({ ok: true, id: 0 });
  }

  try {
    const [inserted] = await db
      .insert(leads)
      .values({
        businessName: data.business_name,
        businessType: data.business_type,
        businessTypeOther: data.business_type_other ?? null,
        ownerName: data.owner_name,
        ownerContact: data.owner_contact,
        needsEquipment: data.needs_equipment,
        comment: data.comment ?? null,
        source: data.source ?? "direct",
        utmSource: data.utm_source ?? null,
        utmMedium: data.utm_medium ?? null,
        utmCampaign: data.utm_campaign ?? null,
        referrer: req.headers.get("referer"),
        userAgent: req.headers.get("user-agent"),
        ip,
        language: data.language,
      })
      .returning();

    void notifyNewLead(inserted);

    return Response.json({ ok: true, id: inserted.id });
  } catch (err) {
    console.error("Lead insert failed", err, { raw });
    return Response.json({ ok: false, error: "server" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test app/api/lead/route.test.ts
```
Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/lead/route.ts app/api/lead/route.test.ts
git commit -m "feat(api): add POST /api/lead with validation, rate-limit, honeypot, telegram fire-and-forget"
```

---

## Task 11: Basic auth middleware

**Files:**
- Create: `middleware.ts`
- Create: `middleware.test.ts`
- Create: `lib/admin/auth.ts`
- Create: `lib/admin/auth.test.ts`

We extract the credential-check logic into a pure function so we can test it without Next.js runtime.

- [ ] **Step 1: Write failing auth tests**

Create `lib/admin/auth.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { checkBasicAuth } from "./auth";

describe("checkBasicAuth", () => {
  const expected = { user: "jack", password: "s3cret" };

  it("returns true with correct creds", () => {
    const header = "Basic " + Buffer.from("jack:s3cret").toString("base64");
    expect(checkBasicAuth(header, expected)).toBe(true);
  });

  it("returns false with wrong password", () => {
    const header = "Basic " + Buffer.from("jack:nope").toString("base64");
    expect(checkBasicAuth(header, expected)).toBe(false);
  });

  it("returns false with wrong user", () => {
    const header = "Basic " + Buffer.from("rick:s3cret").toString("base64");
    expect(checkBasicAuth(header, expected)).toBe(false);
  });

  it("returns false with no header", () => {
    expect(checkBasicAuth(null, expected)).toBe(false);
  });

  it("returns false with malformed header", () => {
    expect(checkBasicAuth("Bearer abc", expected)).toBe(false);
    expect(checkBasicAuth("Basic !!!", expected)).toBe(false);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test lib/admin/auth.test.ts
```

- [ ] **Step 3: Implement `lib/admin/auth.ts`**

```ts
export interface ExpectedCreds {
  user: string;
  password: string;
}

export function checkBasicAuth(authHeader: string | null, expected: ExpectedCreds): boolean {
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;
  const b64 = authHeader.slice(6).trim();
  let decoded: string;
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return false;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return false;
  const user = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);
  return user === expected.user && password === expected.password;
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test lib/admin/auth.test.ts
```

- [ ] **Step 5: Create `middleware.ts`**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkBasicAuth } from "@/lib/admin/auth";

export function middleware(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Admin auth not configured", { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  if (checkBasicAuth(authHeader, { user: expectedUser, password: expectedPassword })) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Ipak Savdo Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 6: Commit**

```bash
git add lib/admin/auth.ts lib/admin/auth.test.ts middleware.ts
git commit -m "feat(admin): add basic-auth middleware for /admin routes"
```

---

## Task 12: Admin filters module (TDD) + admin page

**Files:**
- Create: `lib/admin/filters.test.ts`
- Create: `lib/admin/filters.ts`
- Create: `app/admin/leads/page.tsx`

- [ ] **Step 1: Write failing tests for filters**

Create `lib/admin/filters.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { parseLeadFilters } from "./filters";

describe("parseLeadFilters", () => {
  it("returns empty object for empty params", () => {
    expect(parseLeadFilters(new URLSearchParams())).toEqual({
      from: null,
      to: null,
      source: null,
      businessType: null,
      equipment: null,
      q: null,
      page: 1,
    });
  });

  it("parses date range", () => {
    const f = parseLeadFilters(new URLSearchParams({ from: "2026-05-01", to: "2026-05-25" }));
    expect(f.from).toEqual(new Date("2026-05-01T00:00:00Z"));
    expect(f.to).toEqual(new Date("2026-05-25T23:59:59.999Z"));
  });

  it("ignores invalid dates", () => {
    const f = parseLeadFilters(new URLSearchParams({ from: "garbage" }));
    expect(f.from).toBeNull();
  });

  it("parses source and businessType", () => {
    const f = parseLeadFilters(new URLSearchParams({ source: "instagram", type: "cafe" }));
    expect(f.source).toBe("instagram");
    expect(f.businessType).toBe("cafe");
  });

  it("rejects unknown businessType", () => {
    const f = parseLeadFilters(new URLSearchParams({ type: "spaceship" }));
    expect(f.businessType).toBeNull();
  });

  it("parses equipment tristate", () => {
    expect(parseLeadFilters(new URLSearchParams({ equipment: "yes" })).equipment).toBe(true);
    expect(parseLeadFilters(new URLSearchParams({ equipment: "no" })).equipment).toBe(false);
    expect(parseLeadFilters(new URLSearchParams({ equipment: "any" })).equipment).toBeNull();
  });

  it("parses q (search)", () => {
    expect(parseLeadFilters(new URLSearchParams({ q: "billz" })).q).toBe("billz");
  });

  it("parses page, defaults to 1, rejects <1", () => {
    expect(parseLeadFilters(new URLSearchParams({ page: "3" })).page).toBe(3);
    expect(parseLeadFilters(new URLSearchParams({ page: "0" })).page).toBe(1);
    expect(parseLeadFilters(new URLSearchParams({ page: "abc" })).page).toBe(1);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test lib/admin/filters.test.ts
```

- [ ] **Step 3: Implement `lib/admin/filters.ts`**

```ts
import { and, between, eq, gte, ilike, lte, or, type SQL } from "drizzle-orm";
import { leads, type BusinessType, businessTypes } from "@/lib/db/schema";

export interface LeadFilters {
  from: Date | null;
  to: Date | null;
  source: string | null;
  businessType: BusinessType | null;
  equipment: boolean | null;
  q: string | null;
  page: number;
}

export const PAGE_SIZE = 50;

export function parseLeadFilters(params: URLSearchParams): LeadFilters {
  const fromStr = params.get("from");
  const toStr = params.get("to");
  const source = params.get("source");
  const typeStr = params.get("type");
  const equipmentStr = params.get("equipment");
  const q = params.get("q");
  const pageStr = params.get("page");

  const parseDay = (s: string | null, endOfDay = false): Date | null => {
    if (!s) return null;
    const d = new Date(s + (endOfDay ? "T23:59:59.999Z" : "T00:00:00Z"));
    return isNaN(d.getTime()) ? null : d;
  };

  const businessType: BusinessType | null =
    typeStr && (businessTypes as readonly string[]).includes(typeStr)
      ? (typeStr as BusinessType)
      : null;

  let equipment: boolean | null = null;
  if (equipmentStr === "yes") equipment = true;
  else if (equipmentStr === "no") equipment = false;

  const pageRaw = pageStr ? parseInt(pageStr, 10) : 1;
  const page = !pageRaw || pageRaw < 1 || isNaN(pageRaw) ? 1 : pageRaw;

  return {
    from: parseDay(fromStr),
    to: parseDay(toStr, true),
    source: source && source.length > 0 ? source : null,
    businessType,
    equipment,
    q: q && q.length > 0 ? q : null,
    page,
  };
}

export function buildWhereClause(filters: LeadFilters): SQL | undefined {
  const clauses: SQL[] = [];
  if (filters.from && filters.to) clauses.push(between(leads.createdAt, filters.from, filters.to));
  else if (filters.from) clauses.push(gte(leads.createdAt, filters.from));
  else if (filters.to) clauses.push(lte(leads.createdAt, filters.to));
  if (filters.source) clauses.push(eq(leads.source, filters.source));
  if (filters.businessType) clauses.push(eq(leads.businessType, filters.businessType));
  if (filters.equipment !== null) clauses.push(eq(leads.needsEquipment, filters.equipment));
  if (filters.q) {
    const like = `%${filters.q}%`;
    const orClause = or(ilike(leads.businessName, like), ilike(leads.ownerName, like));
    if (orClause) clauses.push(orClause);
  }
  return clauses.length > 0 ? and(...clauses) : undefined;
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test lib/admin/filters.test.ts
```
Expected: all 8 tests pass.

- [ ] **Step 5: Create `app/admin/leads/page.tsx`**

```tsx
import { db, leads } from "@/lib/db";
import { desc } from "drizzle-orm";
import { buildWhereClause, parseLeadFilters, PAGE_SIZE } from "@/lib/admin/filters";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === "string") params.set(k, v);
  }
  const filters = parseLeadFilters(params);
  const where = buildWhereClause(filters);

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt))
    .limit(PAGE_SIZE)
    .offset((filters.page - 1) * PAGE_SIZE);

  const exportParams = new URLSearchParams(params);
  exportParams.delete("page");
  const exportUrl = `/admin/leads/export.csv?${exportParams.toString()}`;

  return (
    <main className="mx-auto max-w-7xl p-6 font-mono text-sm">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Ipak Savdo · Leads</h1>
        <a
          href={exportUrl}
          className="rounded-md bg-[#02691A] px-4 py-2 font-semibold text-white"
        >
          Экспорт CSV
        </a>
      </header>

      <form className="mb-4 flex flex-wrap gap-2 text-xs" method="get">
        <input name="from" type="date" defaultValue={searchParams.from as string} className="rounded border px-2 py-1" />
        <input name="to" type="date" defaultValue={searchParams.to as string} className="rounded border px-2 py-1" />
        <input name="source" placeholder="source" defaultValue={searchParams.source as string} className="rounded border px-2 py-1" />
        <select name="type" defaultValue={searchParams.type as string ?? ""} className="rounded border px-2 py-1">
          <option value="">все типы</option>
          <option value="shop">shop</option>
          <option value="cafe">cafe</option>
          <option value="restaurant">restaurant</option>
          <option value="market">market</option>
          <option value="beauty">beauty</option>
          <option value="service">service</option>
          <option value="other">other</option>
        </select>
        <select name="equipment" defaultValue={searchParams.equipment as string ?? "any"} className="rounded border px-2 py-1">
          <option value="any">оборудование: любое</option>
          <option value="yes">да</option>
          <option value="no">нет</option>
        </select>
        <input name="q" placeholder="поиск" defaultValue={searchParams.q as string} className="rounded border px-2 py-1" />
        <button type="submit" className="rounded bg-slate-800 px-3 py-1 text-white">применить</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Дата</th>
              <th className="border px-2 py-1">Бизнес</th>
              <th className="border px-2 py-1">Тип</th>
              <th className="border px-2 py-1">Владелец</th>
              <th className="border px-2 py-1">Контакт</th>
              <th className="border px-2 py-1">Обор.</th>
              <th className="border px-2 py-1">Источник</th>
              <th className="border px-2 py-1">UTM</th>
              <th className="border px-2 py-1">Lang</th>
              <th className="border px-2 py-1">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="even:bg-slate-50">
                <td className="border px-2 py-1">{r.id}</td>
                <td className="border px-2 py-1 whitespace-nowrap">{r.createdAt.toISOString()}</td>
                <td className="border px-2 py-1">{r.businessName}</td>
                <td className="border px-2 py-1">{r.businessType === "other" ? r.businessTypeOther : r.businessType}</td>
                <td className="border px-2 py-1">{r.ownerName}</td>
                <td className="border px-2 py-1">{r.ownerContact}</td>
                <td className="border px-2 py-1 text-center">{r.needsEquipment ? "✓" : ""}</td>
                <td className="border px-2 py-1">{r.source}</td>
                <td className="border px-2 py-1 text-xs text-slate-500">
                  {[r.utmSource, r.utmMedium, r.utmCampaign].filter(Boolean).join(" / ")}
                </td>
                <td className="border px-2 py-1">{r.language}</td>
                <td className="border px-2 py-1 max-w-xs truncate" title={r.comment ?? ""}>{r.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="mt-4 flex gap-2 text-xs">
        {filters.page > 1 && (
          <a href={`?${new URLSearchParams({ ...searchParamsToObj(searchParams), page: String(filters.page - 1) }).toString()}`} className="rounded border px-3 py-1">← Назад</a>
        )}
        <span className="px-3 py-1">Стр. {filters.page}</span>
        {rows.length === PAGE_SIZE && (
          <a href={`?${new URLSearchParams({ ...searchParamsToObj(searchParams), page: String(filters.page + 1) }).toString()}`} className="rounded border px-3 py-1">Вперёд →</a>
        )}
      </nav>
    </main>
  );
}

function searchParamsToObj(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/admin/filters.ts lib/admin/filters.test.ts app/admin/leads/page.tsx
git commit -m "feat(admin): add leads page with filters, pagination, drizzle queries"
```

---

## Task 13: CSV export route

**Files:**
- Create: `lib/csv.test.ts`
- Create: `lib/csv.ts`
- Create: `app/admin/leads/export.csv/route.ts`

- [ ] **Step 1: Write failing tests for CSV serializer**

Create `lib/csv.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("renders headers and rows", () => {
    const csv = toCsv(["id", "name"], [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
    expect(csv).toBe(`id,name\n1,Alice\n2,Bob\n`);
  });

  it("quotes fields containing commas", () => {
    const csv = toCsv(["a"], [{ a: "1,2,3" }]);
    expect(csv).toBe(`a\n"1,2,3"\n`);
  });

  it("escapes double quotes by doubling them", () => {
    const csv = toCsv(["a"], [{ a: 'say "hi"' }]);
    expect(csv).toBe(`a\n"say ""hi"""\n`);
  });

  it("quotes fields with newlines", () => {
    const csv = toCsv(["a"], [{ a: "line1\nline2" }]);
    expect(csv).toBe(`a\n"line1\nline2"\n`);
  });

  it("serializes null and undefined as empty", () => {
    const csv = toCsv(["a", "b"], [{ a: null, b: undefined }]);
    expect(csv).toBe(`a,b\n,\n`);
  });

  it("serializes Date as ISO string", () => {
    const csv = toCsv(["t"], [{ t: new Date("2026-05-25T13:42:00.000Z") }]);
    expect(csv).toBe(`t\n2026-05-25T13:42:00.000Z\n`);
  });

  it("serializes booleans as true/false", () => {
    const csv = toCsv(["b"], [{ b: true }, { b: false }]);
    expect(csv).toBe(`b\ntrue\nfalse\n`);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run:
```bash
pnpm test lib/csv.test.ts
```

- [ ] **Step 3: Implement `lib/csv.ts`**

```ts
function serializeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? "true" : "false";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T extends Record<string, unknown>>(
  headers: ReadonlyArray<keyof T & string>,
  rows: T[],
): string {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) => headers.map((h) => serializeCell(row[h])).join(","));
  return [headerLine, ...dataLines].join("\n") + "\n";
}
```

- [ ] **Step 4: Run, confirm pass**

Run:
```bash
pnpm test lib/csv.test.ts
```

- [ ] **Step 5: Create `app/admin/leads/export.csv/route.ts`**

```ts
import { db, leads } from "@/lib/db";
import { desc } from "drizzle-orm";
import { buildWhereClause, parseLeadFilters } from "@/lib/admin/filters";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = [
  "id", "createdAt", "businessName", "businessType", "businessTypeOther",
  "ownerName", "ownerContact", "needsEquipment", "comment", "source",
  "utmSource", "utmMedium", "utmCampaign", "referrer", "userAgent", "ip",
  "language", "status",
] as const;

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const filters = parseLeadFilters(url.searchParams);
  const where = buildWhereClause(filters);

  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt));

  const csv = toCsv(HEADERS as unknown as readonly string[], rows as unknown as Record<string, unknown>[]);
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/csv.ts lib/csv.test.ts app/admin/leads/export.csv/route.ts
git commit -m "feat(admin): add CSV export with full lead columns"
```

---

## Task 14: Extend `LeadForm.tsx` with new fields and honeypot

**Files:**
- Modify: `components/LeadForm.tsx`
- Modify: `lib/i18n.ts` (add new keys to `ru` and `uz` dicts)

- [ ] **Step 1: Add translation keys to `lib/i18n.ts`**

**IMPORTANT:** The form code in Step 2 will map `t.businessTypes[i]` → `BUSINESS_TYPE_VALUES[i]` by index. Before touching `lib/i18n.ts`, find the existing `businessTypes` array in both `ru` and `uz` dicts and **verify the order matches** this list exactly: `["shop", "cafe", "restaurant", "market", "beauty", "service", "other"]`. If the order differs, either reorder the i18n array OR change `BUSINESS_TYPE_VALUES` in Step 2 to match — the two arrays MUST stay in sync. Add a comment in `lib/i18n.ts` like `// Order matches BUSINESS_TYPE_VALUES in components/LeadForm.tsx — DO NOT REORDER`.

For each language object (`ru` and `uz`) in `lib/i18n.ts`, add these keys (place them near the existing form keys). For `ru`:
```ts
formBusinessName: "Название бизнеса",
formNeedsEquipment: "Нужно оборудование (касса, принтер, сканер)",
formBusinessTypeOther: "Уточните вид бизнеса",
formSubmitError: "Не удалось отправить. Попробуйте ещё раз или напишите нам в Telegram.",
formRateLimited: "Слишком много заявок с одного устройства. Попробуйте через 10 минут.",
formValidationError: "Проверьте поля и попробуйте ещё раз.",
```
For `uz`:
```ts
formBusinessName: "Biznes nomi",
formNeedsEquipment: "Jihoz kerak (kassa, printer, skaner)",
formBusinessTypeOther: "Biznes turini aniqlang",
formSubmitError: "Yuborib bo'lmadi. Yana urinib ko'ring yoki bizga Telegramda yozing.",
formRateLimited: "Bitta qurilmadan juda ko'p so'rov. 10 daqiqadan keyin urinib ko'ring.",
formValidationError: "Maydonlarni tekshiring va yana urinib ko'ring.",
```

- [ ] **Step 2: Rewrite `components/LeadForm.tsx`**

Replace the entire file with:
```tsx
"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dict, Locale } from "@/lib/i18n";

const BUSINESS_TYPE_VALUES = ["shop", "cafe", "restaurant", "market", "beauty", "service", "other"] as const;
type BusinessTypeValue = (typeof BUSINESS_TYPE_VALUES)[number];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none focus:border-[#02691A] focus:ring-4 focus:ring-[#02691A]/15";

const SELECT_CHEVRON_BG =
  "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23667085%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10";

export interface LeadFormProps {
  t: Dict;
  locale: Locale;
  compact?: boolean;
  attribution?: {
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

type FormState = "idle" | "submitting" | "sent" | "error";

export default function LeadForm({ t, locale, compact, attribution }: LeadFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [extra, setExtra] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessTypeValue | "">("");

  if (state === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-[#CFE6D5] bg-white p-8 text-center text-xl font-semibold text-[#024B13]">
        {t.success}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const body = {
      business_name: String(fd.get("business_name") ?? "").trim(),
      business_type: String(fd.get("business_type") ?? ""),
      business_type_other: fd.get("business_type") === "other" ? String(fd.get("business_type_other") ?? "").trim() : null,
      owner_name: String(fd.get("owner_name") ?? "").trim(),
      owner_contact: String(fd.get("owner_contact") ?? "").trim(),
      needs_equipment: fd.get("needs_equipment") === "on",
      comment: String(fd.get("comment") ?? "").trim() || null,
      language: locale,
      source: attribution?.source,
      utm_source: attribution?.utm_source,
      utm_medium: attribution?.utm_medium,
      utm_campaign: attribution?.utm_campaign,
      _hp: String(fd.get("_hp") ?? ""),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setErrorMsg(t.formRateLimited);
        setState("error");
        return;
      }
      if (res.status === 400) {
        setErrorMsg(t.formValidationError);
        setState("error");
        return;
      }
      if (!res.ok || !json.ok) {
        setErrorMsg(t.formSubmitError);
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setErrorMsg(t.formSubmitError);
      setState("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("mx-auto grid max-w-xl gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm", compact && "shadow-none")}
    >
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <input required name="business_name" placeholder={t.formBusinessName} className={inputClass} />
      <input required name="owner_name" placeholder={t.formName} className={inputClass} />
      <input required name="owner_contact" type="tel" placeholder={t.formPhone} className={inputClass} />
      <select
        required
        name="business_type"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value as BusinessTypeValue | "")}
        className={cn(inputClass, SELECT_CHEVRON_BG)}
      >
        <option value="" disabled>{t.formBusiness}</option>
        {t.businessTypes.map((label, idx) => (
          <option key={BUSINESS_TYPE_VALUES[idx]} value={BUSINESS_TYPE_VALUES[idx]}>
            {label}
          </option>
        ))}
      </select>
      {businessType === "other" && (
        <input required name="business_type_other" placeholder={t.formBusinessTypeOther} className={inputClass} />
      )}

      <label className="flex items-center gap-3 text-sm font-semibold text-[#024B13]">
        <input type="checkbox" name="needs_equipment" className="h-5 w-5 rounded border-slate-300 text-[#02691A]" />
        {t.formNeedsEquipment}
      </label>

      <button
        type="button"
        onClick={() => setExtra(!extra)}
        className="flex items-center gap-2 text-left text-sm font-semibold text-[#024B13]"
      >
        <ChevronDown size={16} className={cn("transition", extra && "rotate-180")} />
        {t.optional}
      </button>
      {extra && (
        <textarea name="comment" placeholder={t.formComment} rows={3} className={cn(inputClass, "resize-none")} maxLength={500} />
      )}

      {state === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#02691A] px-5 py-4 font-semibold text-white disabled:opacity-60"
      >
        <Send size={18} />
        {state === "submitting" ? "..." : t.submit}
      </button>
    </form>
  );
}
```

Note: this rewrite removes the `Modal` and `CookieBar` exports from the bottom of the original file. If those are used elsewhere, **move them to a new file `components/CookieBar.tsx` and `components/Modal.tsx` before rewriting** (verify with `grep -r "CookieBar\|Modal" components app`).

- [ ] **Step 3: Move `CookieBar` and `Modal` exports if needed**

```bash
grep -rn "CookieBar\|from \"@/components/LeadForm\"" components app
```
If either is referenced, copy the original implementation into separate component files and update import sites.

- [ ] **Step 4: Type-check**

Run:
```bash
pnpm exec tsc --noEmit
```
Expected: clean (or only pre-existing errors unrelated to this change).

- [ ] **Step 5: Commit**

```bash
git add components/LeadForm.tsx lib/i18n.ts
# also add any new files from Step 3
git commit -m "feat(form): wire LeadForm to POST /api/lead with new fields, honeypot, error states"
```

---

## Task 15: Capture `?source=` / `?utm_*` in LandingPage and pass to LeadForm

**Files:**
- Modify: `components/LandingPage.tsx`
- Create: `lib/use-attribution.ts`

- [ ] **Step 1: Create the attribution hook**

Create `lib/use-attribution.ts`:
```ts
"use client";

import { useEffect, useState } from "react";

export interface Attribution {
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function useAttribution(): Attribution {
  const [attribution, setAttribution] = useState<Attribution>({});
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      source: params.get("source") || undefined,
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    });
  }, []);
  return attribution;
}
```

- [ ] **Step 2: Update `components/LandingPage.tsx` to use it**

Locate every place where `<LeadForm` is rendered (likely 1-2 sites — `grep -n "LeadForm" components/LandingPage.tsx` to find them).

For each `<LeadForm` usage:
1. Replace `import LeadForm from "@/components/LeadForm"` with an `import` that pulls in `useAttribution` too.
2. Pass `locale={locale}` and `attribution={attribution}` props.

The component must be a client component (`"use client"` directive) or call `useAttribution` inside an inner client component. If `LandingPage.tsx` is already `"use client"`, just add:
```tsx
import { useAttribution } from "@/lib/use-attribution";
// ... inside the component
const attribution = useAttribution();
// ... and update usages:
<LeadForm t={t} locale={locale} attribution={attribution} />
```
If `LandingPage.tsx` is a server component, create a thin client wrapper `components/LeadFormWithAttribution.tsx`:
```tsx
"use client";
import LeadForm from "./LeadForm";
import { useAttribution } from "@/lib/use-attribution";
import type { Dict, Locale } from "@/lib/i18n";

export default function LeadFormWithAttribution({ t, locale, compact }: { t: Dict; locale: Locale; compact?: boolean }) {
  const attribution = useAttribution();
  return <LeadForm t={t} locale={locale} attribution={attribution} compact={compact} />;
}
```
And import this wrapper from `LandingPage.tsx` instead of `LeadForm` directly.

- [ ] **Step 3: Type-check + run dev server briefly**

```bash
pnpm exec tsc --noEmit
pnpm dev
```
Open `http://localhost:3000/?source=instagram&utm_campaign=may26` and verify nothing throws in the console. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add lib/use-attribution.ts components/LandingPage.tsx
# include LeadFormWithAttribution.tsx if created
git commit -m "feat(landing): capture source/utm query params and pass to LeadForm"
```

---

## Task 16: Add `.env.example`

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**

```
# Database — Railway will auto-inject DATABASE_URL via service reference.
# For local dev, fill in your own Postgres URL.
DATABASE_URL=

# Telegram Bot (created via @BotFather, then added to your sales group as admin)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Admin (HTTP Basic Auth for /admin/* routes)
ADMIN_USER=
ADMIN_PASSWORD=

# Public site URL (used in Telegram message link)
NEXT_PUBLIC_SITE_URL=https://ipak-savdo-landing-production.up.railway.app
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: document required env vars"
```

---

## Task 17: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read current README**

```bash
cat README.md
```

- [ ] **Step 2: Replace contents of `README.md` with**

```markdown
# Ipak Savdo Landing

Lead-generation landing page for **Ipak Savdo** — the legacy working name for a POS/cashbox project for SMBs in Uzbekistan.

## Architecture

- **Framework:** Next.js 14 (App Router, single-component `components/LandingPage.tsx`)
- **i18n:** Russian + Uzbek (`lib/i18n.ts`)
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
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for lead-intake architecture"
```

---

## Task 18: Run full test suite + manual local smoke test

**Files:** none modified

- [ ] **Step 1: Run all tests**

```bash
pnpm test
```
Expected: all tests pass (validators, ip extractor, rate limiter, html escape, telegram format, telegram notify, api route, basic auth, filters, csv — ~55 tests total).

- [ ] **Step 2: Smoke test the form locally**

Make sure local Postgres is running and `.env.local` has `DATABASE_URL`, `TELEGRAM_BOT_TOKEN` (use a test bot), `TELEGRAM_CHAT_ID` (your personal chat), `ADMIN_USER`/`ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

```bash
pnpm db:migrate
pnpm dev
```
Open `http://localhost:3000/?source=instagram&utm_campaign=smoke` in browser, fill out form, submit. Verify:
- Form shows "thank you" message
- Telegram message arrives in your test chat with `#1` and `instagram`
- `http://localhost:3000/admin/leads` (basic auth prompts → enter creds) shows the row

If anything fails, stop and fix before moving on.

- [ ] **Step 3: Manual quality check on rate-limit**

In browser DevTools console:
```js
for (let i = 0; i < 7; i++) {
  fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ business_name:"x", business_type:"cafe", owner_name:"x", owner_contact:"+998901112222", needs_equipment:false, language:"ru" }),
  }).then(r => console.log(i, r.status));
}
```
Expected: first 5 return 200, last 2 return 429.

- [ ] **Step 4: Commit nothing** — this task is verification only. If you had to fix anything, that should have been a separate commit on the relevant earlier task.

---

## Task 19: Deploy to Railway (manual, with Jack)

**Files:** none modified locally. This task is operational.

- [ ] **Step 1: Add Postgres service in Railway**

In Railway dashboard → project `ipak-savdo-landing` → "New" → Database → PostgreSQL.

- [ ] **Step 2: Wire `DATABASE_URL` in the landing service**

In the landing service's "Variables" tab, add:
```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
```
Railway substitutes this with the connection string from the Postgres service.

- [ ] **Step 3: Create the Telegram bot** (Jack does this manually)

1. Open Telegram → message `@BotFather` → `/newbot`
2. Pick a display name (e.g. "Ipak Savdo Sales Bot") and username (e.g. `IpakSavdoSalesBot`)
3. Copy the token BotFather returns
4. Create a Telegram group "Ipak Savdo — Заявки" → add the bot as admin
5. Send any message in the group
6. Run locally: `curl "https://api.telegram.org/bot<TOKEN>/getUpdates"` and copy the `chat.id` from the response (a negative integer like `-1001234567890`)

- [ ] **Step 4: Add all env vars to Railway**

In landing service "Variables":
```
TELEGRAM_BOT_TOKEN = <token from BotFather>
TELEGRAM_CHAT_ID = <chat id from getUpdates>
ADMIN_USER = jack
ADMIN_PASSWORD = <generate with: openssl rand -base64 32>
NEXT_PUBLIC_SITE_URL = https://ipak-savdo-landing-production.up.railway.app
```

- [ ] **Step 5: Push the branch and merge to `main`**

```bash
git push origin <branch>
# open and merge PR
```
Railway auto-deploys. Watch the deploy log; the start command runs `pnpm db:migrate` first, so the `leads` table is created on first boot.

- [ ] **Step 6: Verify migration applied**

```bash
railway run psql -c '\dt'
```
Expected: `leads` table listed.

- [ ] **Step 7: Smoke test on live**

Open `https://ipak-savdo-landing-production.up.railway.app/?source=instagram` in incognito. Fill out and submit the form. Verify:
- Telegram message arrives in the production sales group
- Admin URL shows the row

- [ ] **Step 8: Commit nothing** — operational task.

---

## Task 20: Cleanup — remove Vercel project, abandoned Railway service, and `.vercel/`

**Files:**
- Delete: `.vercel/` directory
- Possibly modify: `.gitignore` (ensure `.env.local` is ignored — likely already)

**Pre-requisite:** Task 19 verified working. Do NOT do this task until the new Railway pipeline is confirmed delivering leads.

- [ ] **Step 1: Remove Vercel project**

```bash
pnpm dlx vercel project rm ipak-savdo-landing --yes
```
Or via dashboard: vercel.com → project → Settings → Delete.

- [ ] **Step 2: Remove `.vercel/` from working tree**

```bash
rm -rf .vercel
echo ".vercel/" >> .gitignore
```
(If `.vercel/` was committed, the `rm` removes it from disk; `git add -A` in the next step will stage the deletion.)

- [ ] **Step 3: Delete abandoned `ipaksavdo-production-3f29` Railway service**

In Railway dashboard, find the service, Settings → Delete Service. (Cannot be done via CLI safely; do via web UI.)

- [ ] **Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove vercel deploy + .vercel/ after migration to Railway"
git push
```

- [ ] **Step 5: Final verification**

Open https://ipak-savdo-landing-production.up.railway.app — landing loads. Submit one more lead end-to-end — Telegram + admin still work.

---

## Done

All acceptance criteria from spec Section 13 satisfied:
- ✅ Form submission → DB row + Telegram message within 3s
- ✅ `?source=` and UTM params captured
- ✅ Validation rejects bad input
- ✅ Honeypot silently 200s
- ✅ 6th rapid POST returns 429
- ✅ Telegram message escapes HTML, bold labels
- ✅ `/admin/leads` requires basic auth
- ✅ Filters + CSV export work
- ✅ Vercel + abandoned Railway service removed

Sub-projects 2 and 3 are separate specs/plans for the future.
