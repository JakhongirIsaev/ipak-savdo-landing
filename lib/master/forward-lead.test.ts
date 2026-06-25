import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { forwardLeadToMaster } from "./forward-lead";
import type { Lead } from "@/lib/db/schema";

function makeLead(over: Partial<Lead> = {}): Lead {
  return {
    id: 7,
    businessName: "Baraka",
    businessType: "shop",
    businessTypeOther: null,
    ownerName: "Test Owner",
    ownerContact: "+998900000000",
    needsEquipment: true,
    comment: null,
    source: "direct",
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    referrer: null,
    userAgent: null,
    ip: null,
    language: "uz",
    status: "new",
    createdAt: new Date("2026-06-25T11:47:28.000Z"),
    lastStatusChangeAt: null,
    lastChangedBy: null,
    telegramMessageId: null,
    city: null,
    patentFileId: null,
    passportFileId: null,
    shopPhotoFileId: null,
    patentStoragePath: null,
    passportStoragePath: null,
    shopStoragePath: null,
    ...over,
  } as Lead;
}

describe("forwardLeadToMaster", () => {
  const realEnv = process.env;
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...realEnv };
  });
  afterEach(() => {
    process.env = realEnv;
  });

  it("POSTs to the master intake with the token and a camelCase payload", async () => {
    process.env.MASTER_LEAD_INTAKE_URL = "https://master.test/api/leads/intake";
    process.env.MASTER_LEAD_INTAKE_TOKEN = "secret-token";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ id: "x", created: true }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    await forwardLeadToMaster(makeLead());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }];
    expect(url).toBe("https://master.test/api/leads/intake");
    expect(opts.method).toBe("POST");
    expect(opts.headers["x-lead-intake-token"]).toBe("secret-token");
    const body = JSON.parse(opts.body as string);
    expect(body.businessType).toBe("shop");
    expect(body.ownerName).toBe("Test Owner");
    expect(body.ownerContact).toBe("+998900000000");
    expect(body.language).toBe("uz");
    expect(body.needsEquipment).toBe(true);
    expect(body.createdAt).toBe("2026-06-25T11:47:28.000Z");
  });

  it("no-ops (never calls fetch) when the master env is not configured", async () => {
    delete process.env.MASTER_LEAD_INTAKE_URL;
    delete process.env.MASTER_LEAD_INTAKE_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await forwardLeadToMaster(makeLead());

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("logs loudly and does NOT throw when the master rejects the lead", async () => {
    process.env.MASTER_LEAD_INTAKE_URL = "https://master.test/api/leads/intake";
    process.env.MASTER_LEAD_INTAKE_TOKEN = "secret-token";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad_input", { status: 400 })));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(forwardLeadToMaster(makeLead())).resolves.toBeUndefined();
    expect(errSpy).toHaveBeenCalled();
  });

  it("logs and does NOT throw when fetch itself fails (master down)", async () => {
    process.env.MASTER_LEAD_INTAKE_URL = "https://master.test/api/leads/intake";
    process.env.MASTER_LEAD_INTAKE_TOKEN = "secret-token";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(forwardLeadToMaster(makeLead())).resolves.toBeUndefined();
    expect(errSpy).toHaveBeenCalled();
  });
});
