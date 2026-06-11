import { describe, it, expect, vi } from "vitest";
import { handleAnketaMessage, type AnketaDeps, type BotSessionState, type AnketaMessage } from "./anketa";

function makeDeps(initial: BotSessionState | null = null): AnketaDeps & {
  store: { session: BotSessionState | null };
  sent: { chatId: string; text: string; keyboard?: string[][] }[];
  createdLeads: any[];
  notified: number[];
} {
  const store: { session: BotSessionState | null } = { session: initial };
  const sent: { chatId: string; text: string; keyboard?: string[][] }[] = [];
  const createdLeads: any[] = [];
  const notified: number[] = [];

  return {
    store, sent, createdLeads, notified,
    getSession: vi.fn(async () => store.session),
    saveSession: vi.fn(async (s) => { store.session = { ...s }; }),
    clearSession: vi.fn(async () => { store.session = null; }),
    createLead: vi.fn(async (data) => { createdLeads.push(data); return 77; }),
    notifyLead: vi.fn(async (id) => { notified.push(id); }),
    sendMessage: vi.fn(async (chatId, text, keyboard) => { sent.push({ chatId, text, keyboard }); }),
  };
}

function textMsg(text: string, userId = 1, chatId = 5000): AnketaMessage {
  return { from: { id: userId }, chat: { id: chatId, type: "private" }, text };
}

function photoMsg(userId = 1, chatId = 5000): AnketaMessage {
  return {
    from: { id: userId },
    chat: { id: chatId, type: "private" },
    photo: [
      { file_id: "small", file_size: 100 },
      { file_id: "large", file_size: 9000 },
    ],
  };
}

describe("handleAnketaMessage", () => {
  it("/start resets to the name step and greets", async () => {
    const deps = makeDeps();
    await handleAnketaMessage(textMsg("/start"), deps);
    expect(deps.store.session?.step).toBe("name");
    expect(deps.sent).toHaveLength(1);
    expect(deps.sent[0].text).toContain("BirLiy");
  });

  it("/start with a payload still resets", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "shop",
      name: "Old", phone: "x", businessType: "shop", city: "c", patentFileId: "p", passportFileId: "pp",
    });
    await handleAnketaMessage(textMsg("/start deeplink"), deps);
    expect(deps.store.session?.step).toBe("name");
    expect(deps.store.session?.name).toBeNull();
  });

  it("a message with no session auto-starts the anketa", async () => {
    const deps = makeDeps();
    await handleAnketaMessage(textMsg("привет"), deps);
    expect(deps.store.session?.step).toBe("name");
    expect(deps.sent[0].text).toContain("BirLiy");
  });

  it("full happy path advances steps and creates the lead on the final photo", async () => {
    const deps = makeDeps();

    await handleAnketaMessage(textMsg("/start"), deps);
    expect(deps.store.session?.step).toBe("name");

    await handleAnketaMessage(textMsg("Магазин у дома"), deps);
    expect(deps.store.session?.step).toBe("phone");
    expect(deps.store.session?.name).toBe("Магазин у дома");

    await handleAnketaMessage(textMsg("+998 90 123 45 67"), deps);
    expect(deps.store.session?.step).toBe("type");
    expect(deps.store.session?.phone).toBe("+998 90 123 45 67");

    await handleAnketaMessage(textMsg("Кафе"), deps);
    expect(deps.store.session?.step).toBe("city");
    expect(deps.store.session?.businessType).toBe("cafe");

    await handleAnketaMessage(textMsg("Ташкент, Чиланзар"), deps);
    expect(deps.store.session?.step).toBe("patent");
    expect(deps.store.session?.city).toBe("Ташкент, Чиланзар");

    await handleAnketaMessage(photoMsg(), deps);
    expect(deps.store.session?.step).toBe("passport");
    expect(deps.store.session?.patentFileId).toBe("large");

    await handleAnketaMessage(photoMsg(), deps);
    expect(deps.store.session?.step).toBe("shop");
    expect(deps.store.session?.passportFileId).toBe("large");

    await handleAnketaMessage(photoMsg(), deps);

    expect(deps.createdLeads).toHaveLength(1);
    expect(deps.createdLeads[0]).toMatchObject({
      name: "Магазин у дома",
      phone: "+998 90 123 45 67",
      businessType: "cafe",
      city: "Ташкент, Чиланзар",
      patentFileId: "large",
      passportFileId: "large",
      shopPhotoFileId: "large",
      source: "telegram_bot",
      language: "ru",
    });
    expect(deps.notified).toEqual([77]);
    expect(deps.store.session).toBeNull();
    expect(deps.sent[deps.sent.length - 1].text).toContain("Заявка принята");
  });

  it("offers a reply keyboard at the business-type step", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "phone",
      name: "X", phone: null, businessType: null, city: null, patentFileId: null, passportFileId: null,
    });
    await handleAnketaMessage(textMsg("+998901234567"), deps);
    const typePrompt = deps.sent[deps.sent.length - 1];
    expect(typePrompt.keyboard).toBeDefined();
    expect(typePrompt.keyboard).toEqual([
      ["Магазин", "Кафе"],
      ["Аптека", "Минимаркет"],
      ["Сервис", "Другое"],
    ]);
  });

  it("rejects a non-numeric phone and re-asks", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "phone",
      name: "X", phone: null, businessType: null, city: null, patentFileId: null, passportFileId: null,
    });
    await handleAnketaMessage(textMsg("нет телефона"), deps);
    expect(deps.store.session?.step).toBe("phone");
    expect(deps.sent[0].text.toLowerCase()).toContain("номер");
  });

  it("patent step rejects text and keeps waiting for a photo", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "patent",
      name: "X", phone: "+998", businessType: "shop", city: "Ташкент", patentFileId: null, passportFileId: null,
    });
    await handleAnketaMessage(textMsg("вот описание"), deps);
    expect(deps.store.session?.step).toBe("patent");
    expect(deps.store.session?.patentFileId).toBeNull();
    expect(deps.sent[0].text).toContain("фото патента");
  });

  it("patent photo advances to the passport step and asks for the passport photo", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "patent",
      name: "X", phone: "+998", businessType: "shop", city: "Ташкент", patentFileId: null, passportFileId: null,
    });
    await handleAnketaMessage(photoMsg(), deps);
    expect(deps.store.session?.step).toBe("passport");
    expect(deps.store.session?.patentFileId).toBe("large");
    expect(deps.sent[0].text).toContain("паспорта");
  });

  it("passport step rejects text and keeps waiting for a photo", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "passport",
      name: "X", phone: "+998", businessType: "shop", city: "Ташкент", patentFileId: "p1", passportFileId: null,
    });
    await handleAnketaMessage(textMsg("вот паспорт текстом"), deps);
    expect(deps.store.session?.step).toBe("passport");
    expect(deps.store.session?.passportFileId).toBeNull();
    expect(deps.sent[0].text).toContain("фото паспорта");
  });

  it("passport photo advances to the shop step", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "passport",
      name: "X", phone: "+998", businessType: "shop", city: "Ташкент", patentFileId: "p1", passportFileId: null,
    });
    await handleAnketaMessage(photoMsg(), deps);
    expect(deps.store.session?.step).toBe("shop");
    expect(deps.store.session?.passportFileId).toBe("large");
    expect(deps.sent[0].text).toContain("ФОТО вашего магазина");
  });

  it("shop step rejects text and does not create a lead", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "shop",
      name: "X", phone: "+998", businessType: "shop", city: "Ташкент", patentFileId: "p1", passportFileId: "pp1",
    });
    await handleAnketaMessage(textMsg("без фото"), deps);
    expect(deps.store.session?.step).toBe("shop");
    expect(deps.createdLeads).toHaveLength(0);
    expect(deps.sent[0].text).toContain("фото магазина");
  });

  it("maps unknown business types to 'other'", async () => {
    const deps = makeDeps({
      telegramUserId: "1", chatId: "5000", step: "type",
      name: "X", phone: "+998", businessType: null, city: null, patentFileId: null, passportFileId: null,
    });
    await handleAnketaMessage(textMsg("Цветочный киоск"), deps);
    expect(deps.store.session?.businessType).toBe("other");
  });

  it("ignores messages without a from field", async () => {
    const deps = makeDeps();
    await handleAnketaMessage({ chat: { id: 5000, type: "private" }, text: "/start" }, deps);
    expect(deps.sent).toHaveLength(0);
    expect(deps.store.session).toBeNull();
  });
});
