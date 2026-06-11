import { describe, it, expect, vi } from "vitest";
import { handleTelegramUpdate, type WebhookDeps } from "./webhook";

const baseLead = {
  id: 42,
  businessName: "BillzCafe",
  businessType: "cafe" as const,
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
  city: null,
  patentFileId: null,
  passportFileId: null,
  shopPhotoFileId: null,
  patentStoragePath: null,
  passportStoragePath: null,
  shopStoragePath: null,
};

function makeDeps(overrides: Partial<WebhookDeps> = {}): WebhookDeps & {
  events: any[];
  updates: any[];
  edits: any[];
  answers: any[];
  anketaMessages: any[];
} {
  const events: any[] = [];
  const updates: any[] = [];
  const edits: any[] = [];
  const answers: any[] = [];
  const anketaMessages: any[] = [];

  return {
    events, updates, edits, answers, anketaMessages,
    findLead: vi.fn(async (id: number) => (id === 42 ? { ...baseLead } : null)),
    updateLeadStatus: vi.fn(async (id, newStatus, actor) => {
      updates.push({ id, newStatus, actor });
    }),
    insertEvent: vi.fn(async (row) => { events.push(row); }),
    editMessage: vi.fn(async (args) => { edits.push(args); }),
    answerCb: vi.fn(async (args) => { answers.push(args); }),
    chatId: "-100123",
    siteUrl: "https://example.com",
    anketa: {
      getSession: vi.fn(async () => null),
      saveSession: vi.fn(async () => {}),
      clearSession: vi.fn(async () => {}),
      createLead: vi.fn(async () => 1),
      notifyLead: vi.fn(async () => {}),
      sendMessage: vi.fn(async (chatId: string, text: string) => { anketaMessages.push({ chatId, text }); }),
    },
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

  it("routes a private-chat /start to the anketa (no lead status writes)", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({
      update_id: 8,
      message: {
        message_id: 1,
        chat: { id: 12345, type: "private" },
        text: "/start",
        from: { id: 1, username: "x" },
      },
    }, deps);
    expect(deps.updateLeadStatus).not.toHaveBeenCalled();
    expect(deps.events).toHaveLength(0);
    expect(deps.anketa.saveSession).toHaveBeenCalled();
    expect(deps.anketaMessages).toHaveLength(1);
    expect(deps.anketaMessages[0].text).toContain("BirLiy");
  });

  it("does not route group-chat messages to the anketa", async () => {
    const deps = makeDeps();
    await handleTelegramUpdate({
      update_id: 9,
      message: {
        message_id: 1,
        chat: { id: -100123, type: "supergroup" },
        text: "/start",
        from: { id: 1, username: "x" },
      },
    }, deps);
    expect(deps.anketa.saveSession).not.toHaveBeenCalled();
    expect(deps.anketaMessages).toHaveLength(0);
  });
});
