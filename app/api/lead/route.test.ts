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

vi.mock("@/lib/supabase/storage", () => ({
  uploadLeadDoc: vi.fn(async (id: number, kind: string) => `leads/${id}/${kind}.jpg`),
}));

vi.mock("@/lib/telegram/send-docs", () => ({
  sendLeadDocsAlbum: vi.fn(async (_t: string, _c: string, _lead: unknown, items: unknown[]) =>
    items.map((_, i) => `fid${i}`),
  ),
}));

import { POST } from "./route";
import * as dbMod from "@/lib/db";
import { notifyNewLead } from "@/lib/telegram/notify";
import { uploadLeadDoc } from "@/lib/supabase/storage";
import { sendLeadDocsAlbum } from "@/lib/telegram/send-docs";

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
    const res = await POST(makeReq({ ...validBody, business_type: "spaceship" }, "2.2.2.2"));
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

  // Real JPEG magic bytes (FF D8 FF) so the server's magic-byte sniff accepts it.
  const imgFile = (name: string) =>
    new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])], name, { type: "image/jpeg" });

  const makeMultipart = (ip: string, opts: { withFiles?: boolean } = {}) => {
    const fd = new FormData();
    fd.set("business_type", "cafe");
    fd.set("owner_name", "Ivan");
    fd.set("owner_contact", "+998901234567");
    fd.set("needs_equipment", "on");
    fd.set("language", "ru");
    if (opts.withFiles ?? true) {
      fd.set("patent", imgFile("patent.jpg"));
      fd.set("passport", imgFile("passport.jpg"));
      fd.set("shop", imgFile("shop.jpg"));
    }
    return new Request("http://example.com/api/lead", {
      method: "POST",
      headers: { "x-forwarded-for": ip },
      body: fd,
    });
  };

  it("multipart: creates a lead, backs up to storage, sends album, stores file_ids + paths", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "tok";
    process.env.TELEGRAM_CHAT_ID = "-100";

    const res = await POST(makeMultipart("5.5.5.1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);

    expect((dbMod as any).__getInserted()).toHaveLength(1);
    expect(notifyNewLead).toHaveBeenCalledOnce();
    expect(uploadLeadDoc).toHaveBeenCalledTimes(3);
    expect(sendLeadDocsAlbum).toHaveBeenCalledOnce();

    const update = (dbMod as any).__getUpdates()[0];
    expect(update).toMatchObject({
      telegramMessageId: "555",
      patentFileId: "fid0",
      passportFileId: "fid1",
      shopPhotoFileId: "fid2",
      patentStoragePath: "leads/1/patent.jpg",
      passportStoragePath: "leads/1/passport.jpg",
      shopStoragePath: "leads/1/shop.jpg",
    });
  });

  it("multipart: succeeds with no documents (documents are optional)", async () => {
    const res = await POST(makeMultipart("5.5.5.2", { withFiles: false }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect((dbMod as any).__getInserted()).toHaveLength(1);
  });

  it("multipart: rejects a non-image masquerading as image/jpeg (magic-byte sniff)", async () => {
    const fd = new FormData();
    fd.set("business_type", "cafe");
    fd.set("owner_name", "Ivan");
    fd.set("owner_contact", "+998901234567");
    fd.set("needs_equipment", "on");
    fd.set("language", "ru");
    fd.set("patent", new File([new TextEncoder().encode("totally not an image")], "patent.jpg", { type: "image/jpeg" }));
    const res = await POST(
      new Request("http://example.com/api/lead", { method: "POST", headers: { "x-forwarded-for": "5.5.5.7" }, body: fd }),
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("file");
    expect(json.reason).toBe("type");
    expect((dbMod as any).__getInserted()).toHaveLength(0);
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
