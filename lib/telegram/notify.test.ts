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
