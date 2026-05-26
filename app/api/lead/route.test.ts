import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks must be hoisted before importing the route.
vi.mock("@/lib/db", () => {
  const insertedRows: any[] = [];
  const eventRows: any[] = [];
  const updates: any[] = [];

  const insertChain = (table: { __id: string }) => ({
    values: (row: any) => {
      const out: any = {
        returning: async () => {
          if (table.__id === "leads") {
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
          if (table.__id === "leadEvents") {
            eventRows.push(row);
            return [];
          }
          return [];
        },
        then: (resolve: (v: undefined) => void) => {
          if (table.__id === "leadEvents") {
            eventRows.push(row);
          }
          resolve(undefined);
        },
      };
      return out;
    },
  });

  return {
    db: {
      insert: insertChain,
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
    expect((dbMod as any).__getEvents()).toHaveLength(1);
    expect((dbMod as any).__getEvents()[0]).toMatchObject({
      fromStatus: null,
      toStatus: "new",
      actor: "system",
    });
    expect((dbMod as any).__getUpdates()).toHaveLength(1);
    expect((dbMod as any).__getUpdates()[0]).toMatchObject({ telegramMessageId: "555" });
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
    expect((dbMod as any).__getEvents()).toHaveLength(0);
    expect((dbMod as any).__getUpdates()).toHaveLength(0);
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
