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
