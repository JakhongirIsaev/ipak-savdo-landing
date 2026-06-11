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
  city: null,
  patentFileId: null,
  passportFileId: null,
  shopPhotoFileId: null,
  patentStoragePath: null,
  passportStoragePath: null,
  shopStoragePath: null,
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
    expect(body.reply_markup.inline_keyboard).toHaveLength(4);
    expect(body.reply_markup.inline_keyboard.flat()).toHaveLength(4);
    expect(result.messageId).toBe("555");
  });

  it("bundles patent/passport/shop photos into one media group with an info caption", async () => {
    const withPhotos: Lead = {
      ...lead,
      city: "Ташкент, Чиланзар",
      patentFileId: "PAT",
      passportFileId: "PASS",
      shopPhotoFileId: "SHOP",
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, result: { message_id: 7 } }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    await notifyNewLead(withPhotos);

    // call 1 = sendMessage (card+buttons), call 2 = sendMediaGroup (album)
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const url2 = fetchMock.mock.calls[1][0] as string;
    expect(url2).toContain("/sendMediaGroup");
    const body2 = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body2.media).toHaveLength(3);
    expect(body2.media[0].type).toBe("photo");
    expect(body2.media[0].media).toBe("PAT");
    expect(body2.media[0].parse_mode).toBe("HTML");
    expect(body2.media[0].caption).toContain("Заявка #1");
    expect(body2.media[0].caption).toContain("Ташкент, Чиланзар");
    expect(body2.media[0].caption).toContain("Патент");
    expect(body2.media[1].media).toBe("PASS");
    expect(body2.media[1].caption).toContain("Паспорт");
    expect(body2.media[2].media).toBe("SHOP");
    expect(body2.media[2].caption).toContain("магазин");
  });

  it("sends a single photo (not a media group) when only one document is present", async () => {
    const onePhoto: Lead = { ...lead, patentFileId: "PAT" };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, result: { message_id: 9 } }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    await notifyNewLead(onePhoto);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const url2 = fetchMock.mock.calls[1][0] as string;
    expect(url2).toContain("/sendPhoto");
    const body2 = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(body2.photo).toBe("PAT");
    expect(body2.parse_mode).toBe("HTML");
    expect(body2.caption).toContain("Заявка #1");
    expect(body2.caption).toContain("Патент");
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
