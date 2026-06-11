import type { SupportSessionStep, Language } from "@/lib/db/schema";

export interface SupportSessionState {
  telegramUserId: string;
  chatId: string;
  step: SupportSessionStep;
  language: Language;
  name: string | null;
  phone: string | null;
  question: string | null;
}

export interface SupportLead {
  name: string;
  phone: string;
  question: string;
  source: string;
  language: Language;
}

export interface SupportMessage {
  from?: { id: number };
  chat: { id: number; type?: string };
  text?: string;
}

// reply_markup passed through to Telegram (reply keyboard or remove_keyboard).
export type SupportKeyboard = unknown;

export interface SupportDeps {
  getSession(userId: string): Promise<SupportSessionState | null>;
  saveSession(s: SupportSessionState): Promise<void>;
  clearSession(userId: string): Promise<void>;
  createLead(data: SupportLead): Promise<number>;
  notifyLead(leadId: number): Promise<void>;
  sendMessage(chatId: string, text: string, keyboard?: SupportKeyboard): Promise<void>;
}

const COPY: Record<Language, {
  greeting: string;
  askPhone: string;
  phoneInvalid: string;
  askQuestion: string;
  questionRequired: string;
  done: string;
}> = {
  ru: {
    greeting:
      "Здравствуйте! Это поддержка BirLiy. Подскажем по кассе, складу, оплате и подключению. Как к вам обращаться?",
    askPhone: "Спасибо! Оставьте номер телефона, чтобы мы могли ответить (например +998 90 123 45 67).",
    phoneInvalid:
      "Не похоже на номер телефона. Напишите, пожалуйста, ваш номер (например +998 90 123 45 67).",
    askQuestion: "Напишите ваш вопрос — что подсказать?",
    questionRequired: "Напишите, пожалуйста, ваш вопрос текстом.",
    done: "Спасибо! Передал вопрос команде — ответим в течение дня. Можно писать сюда же.",
  },
  uz: {
    greeting:
      "Assalomu alaykum! Bu BirLiy qo'llab-quvvatlash xizmati. Kassa, ombor, to'lov va ulanish bo'yicha yordam beramiz. Sizga qanday murojaat qilaylik?",
    askPhone: "Rahmat! Javob berishimiz uchun telefon raqamingizni qoldiring (masalan +998 90 123 45 67).",
    phoneInvalid:
      "Bu telefon raqamiga o'xshamadi. Iltimos, raqamingizni yozing (masalan +998 90 123 45 67).",
    askQuestion: "Savolingizni yozing — nimada yordam beramiz?",
    questionRequired: "Iltimos, savolingizni matn bilan yozing.",
    done: "Rahmat! Savolingizni jamoaga uzatdim — kun davomida javob beramiz. Shu yerga yozishingiz mumkin.",
  },
};

const LANG_PROMPT = "Выберите язык / Tilni tanlang 👇";
const LANG_KEYBOARD = {
  keyboard: [[{ text: "Русский" }, { text: "O'zbek" }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

function parseLanguage(text: string | undefined): Language {
  const t = (text ?? "").toLowerCase();
  // Uzbek button "O'zbek", or any uz/uzbek hint → uz. Default ru.
  if (t.includes("zbek") || t.includes("o'z") || t.includes("oʻz") || t === "uz" || t.includes("ўзб") || t.includes("узб")) {
    return "uz";
  }
  return "ru";
}

function hasDigits(text: string): boolean {
  return /\d/.test(text);
}

function newSession(userId: string, chatId: string): SupportSessionState {
  return {
    telegramUserId: userId,
    chatId,
    step: "lang",
    language: "ru",
    name: null,
    phone: null,
    question: null,
  };
}

function isStart(text: string | undefined): boolean {
  if (!text) return false;
  return text === "/start" || text.startsWith("/start ");
}

export async function handleSupportMessage(msg: SupportMessage, deps: SupportDeps): Promise<void> {
  if (!msg.from) return;
  const userId = String(msg.from.id);
  const chatId = String(msg.chat.id);
  const text = typeof msg.text === "string" ? msg.text.trim() : undefined;

  if (isStart(text)) {
    const session = newSession(userId, chatId);
    await deps.saveSession(session);
    await deps.sendMessage(chatId, LANG_PROMPT, LANG_KEYBOARD);
    return;
  }

  let session = await deps.getSession(userId);
  if (!session) {
    session = newSession(userId, chatId);
    await deps.saveSession(session);
    await deps.sendMessage(chatId, LANG_PROMPT, LANG_KEYBOARD);
    return;
  }

  switch (session.step) {
    case "lang": {
      session.language = parseLanguage(text);
      session.step = "name";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY[session.language].greeting);
      return;
    }
    case "name": {
      if (!text) return;
      session.name = text;
      session.step = "phone";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY[session.language].askPhone);
      return;
    }
    case "phone": {
      if (!text || !hasDigits(text)) {
        await deps.sendMessage(chatId, COPY[session.language].phoneInvalid);
        return;
      }
      session.phone = text;
      session.step = "question";
      await deps.saveSession(session);
      await deps.sendMessage(chatId, COPY[session.language].askQuestion);
      return;
    }
    case "question": {
      if (!text) {
        await deps.sendMessage(chatId, COPY[session.language].questionRequired);
        return;
      }
      const leadId = await deps.createLead({
        name: session.name ?? "",
        phone: session.phone ?? "",
        question: text,
        source: "support",
        language: session.language,
      });
      await deps.notifyLead(leadId);
      await deps.clearSession(userId);
      await deps.sendMessage(chatId, COPY[session.language].done);
      return;
    }
  }
}
