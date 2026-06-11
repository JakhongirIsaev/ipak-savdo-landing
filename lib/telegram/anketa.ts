import type { BusinessType, BotSessionStep } from "@/lib/db/schema";

export interface BotSessionState {
  telegramUserId: string;
  chatId: string;
  step: BotSessionStep;
  name: string | null;
  phone: string | null;
  businessType: BusinessType | null;
  city: string | null;
  patentFileId: string | null;
  passportFileId: string | null;
}

export interface AnketaLead {
  name: string;
  phone: string;
  businessType: BusinessType;
  city: string;
  patentFileId: string;
  passportFileId: string;
  shopPhotoFileId: string;
  source: string;
  language: "ru";
}

export interface AnketaMessage {
  from?: { id: number };
  chat: { id: number; type?: string };
  text?: string;
  photo?: { file_id: string; file_size?: number }[];
}

export interface AnketaDeps {
  getSession(userId: string): Promise<BotSessionState | null>;
  saveSession(s: BotSessionState): Promise<void>;
  clearSession(userId: string): Promise<void>;
  createLead(data: AnketaLead): Promise<number>;
  notifyLead(leadId: number): Promise<void>;
  sendMessage(chatId: string, text: string, replyKeyboard?: string[][]): Promise<void>;
}

const COPY = {
  greeting:
    "Здравствуйте! Это BirLiy — касса, склад и оплаты в одном приложении. Оставьте заявку за минуту, подключим за день. Как называется ваш бизнес (или как к вам обращаться)?",
  askPhone: "Ваш номер телефона? (например +998 90 123 45 67)",
  phoneInvalid: "Не похоже на номер телефона. Напишите, пожалуйста, ваш номер (например +998 90 123 45 67).",
  askType: "Какой у вас бизнес?",
  askCity: "В каком городе и районе вы находитесь?",
  askPatent: "Пришлите, пожалуйста, ФОТО вашего патента.",
  patentRequired: "Нужно именно фото патента — отправьте картинкой, пожалуйста.",
  askPassport: "Спасибо. Теперь пришлите ФОТО паспорта директора или владельца (страница с фотографией).",
  passportRequired: "Нужно именно фото паспорта (страница с фото) — отправьте картинкой, пожалуйста.",
  askShop: "Спасибо. Теперь пришлите ФОТО вашего магазина (витрина или вход).",
  shopRequired: "Нужно именно фото магазина — отправьте картинкой, пожалуйста.",
  done: "Спасибо! Заявка принята ✅ Свяжемся с вами в течение дня. Если что — пишите сюда же.",
} as const;

const TYPE_KEYBOARD: string[][] = [
  ["Магазин", "Кафе"],
  ["Аптека", "Минимаркет"],
  ["Сервис", "Другое"],
];

function mapBusinessType(text: string): BusinessType {
  const t = text.trim().toLowerCase();
  if (t.includes("магазин")) return "shop";
  if (t.includes("кафе")) return "cafe";
  if (t.includes("ресторан")) return "restaurant";
  if (t.includes("минимаркет") || t.includes("рынок")) return "market";
  if (t.includes("салон") || t.includes("красот")) return "beauty";
  if (t.includes("сервис")) return "service";
  return "other";
}

function hasDigits(text: string): boolean {
  return /\d/.test(text);
}

function largestPhotoFileId(msg: AnketaMessage): string | null {
  if (!msg.photo || msg.photo.length === 0) return null;
  const largest = msg.photo.reduce((best, p) =>
    (p.file_size ?? 0) >= (best.file_size ?? 0) ? p : best,
  );
  return largest.file_id;
}

function newSession(userId: string, chatId: string): BotSessionState {
  return {
    telegramUserId: userId,
    chatId,
    step: "name",
    name: null,
    phone: null,
    businessType: null,
    city: null,
    patentFileId: null,
    passportFileId: null,
  };
}

function isStart(text: string | undefined): boolean {
  if (!text) return false;
  return text === "/start" || text.startsWith("/start ");
}

export async function handleAnketaMessage(msg: AnketaMessage, deps: AnketaDeps): Promise<void> {
  if (!msg.from) return;
  const userId = String(msg.from.id);
  const chatId = String(msg.chat.id);
  const text = typeof msg.text === "string" ? msg.text.trim() : undefined;

  if (isStart(text)) {
    const session = newSession(userId, chatId);
    await deps.saveSession(session);
    await deps.sendMessage(chatId, COPY.greeting);
    return;
  }

  let session = await deps.getSession(userId);
  if (!session) {
    session = newSession(userId, chatId);
    await deps.saveSession(session);
    await deps.sendMessage(chatId, COPY.greeting);
    return;
  }

  switch (session.step) {
    case "name": {
      if (!text) return;
      session.name = text;
      session.step = "phone";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY.askPhone);
      return;
    }
    case "phone": {
      if (!text || !hasDigits(text)) {
        await deps.sendMessage(chatId, COPY.phoneInvalid);
        return;
      }
      session.phone = text;
      session.step = "type";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY.askType, TYPE_KEYBOARD);
      return;
    }
    case "type": {
      if (!text) return;
      session.businessType = mapBusinessType(text);
      session.step = "city";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY.askCity);
      return;
    }
    case "city": {
      if (!text) return;
      session.city = text;
      session.step = "patent";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY.askPatent);
      return;
    }
    case "patent": {
      const fileId = largestPhotoFileId(msg);
      if (!fileId) {
        await deps.sendMessage(chatId, COPY.patentRequired);
        return;
      }
      session.patentFileId = fileId;
      session.step = "passport";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY.askPassport);
      return;
    }
    case "passport": {
      const fileId = largestPhotoFileId(msg);
      if (!fileId) {
        await deps.sendMessage(chatId, COPY.passportRequired);
        return;
      }
      session.passportFileId = fileId;
      session.step = "shop";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY.askShop);
      return;
    }
    case "shop": {
      const fileId = largestPhotoFileId(msg);
      if (!fileId) {
        await deps.sendMessage(chatId, COPY.shopRequired);
        return;
      }
      const leadId = await deps.createLead({
        name: session.name ?? "",
        phone: session.phone ?? "",
        businessType: session.businessType ?? "other",
        city: session.city ?? "",
        patentFileId: session.patentFileId ?? "",
        passportFileId: session.passportFileId ?? "",
        shopPhotoFileId: fileId,
        source: "telegram_bot",
        language: "ru",
      });
      await deps.notifyLead(leadId);
      await deps.clearSession(userId);
      await deps.sendMessage(chatId, COPY.done);
      return;
    }
  }
}
