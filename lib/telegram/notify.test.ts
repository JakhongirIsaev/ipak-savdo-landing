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
