"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronRight, Send, ShieldCheck, X } from "lucide-react";
import type { Locale } from "./demoData";
import { useAttribution } from "@/lib/use-attribution";
import { trackSiteEvent, trackLeadSubmitAttempt, trackLeadSuccess } from "@/lib/track/client";

// Public Telegram contact, mirrors copy.footer.telegramHref in ConceptLanding.
// Used on the success screen.
const TELEGRAM_HREF = "https://t.me/bir_liy";

// +998 phone mask. Keeps only digits, drops a leading 998/8/9->normalises, then
// formats as "+998 90 123 45 67". Shop owners type in many shapes; this gives
// one predictable display while owner_contact still posts the formatted string
// (the server regex ^[+()0-9\s-]+$ and the 5-100 length both accept it).
function formatUzPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  // A lone leading 0 (e.g. "0 90 ...") is a local habit; drop it.
  if (digits.startsWith("0")) digits = digits.slice(1);
  digits = digits.slice(0, 9); // 9 national digits after +998
  const parts = ["+998"];
  if (digits.length > 0) parts.push(digits.slice(0, 2));
  if (digits.length > 2) parts.push(digits.slice(2, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 7));
  if (digits.length > 7) parts.push(digits.slice(7, 9));
  return parts.join(" ").trim();
}

// Public dropdown positions BirLiy for shops, minimarkets, pharmacies and market
// points; it intentionally omits cafe/restaurant/salon (marketing positioning).
// The backend enum in lib/db/schema.ts still accepts those legacy values for
// compatibility with existing leads and the Telegram intake. This array is the
// form-offered subset, indexed in parallel with t.businessTypes.
const BUSINESS_VALUES = ["shop", "minimarket", "pharmacy", "market", "service", "other"] as const;
type FormState = "idle" | "submitting" | "sent" | "error";

const COMMENT_MAX = 500; // must match lib/validators/lead.ts comment.max(500)

// 12 large Uzbek cities, Tashkent first (shared order for both locales). The
// city is an OPTIONAL real `city` field now (not folded into comment). The last
// option ("other") reveals a free-text input so an owner can type a small city
// we intentionally do not pre-list. Labels are localized below via CITY_LABELS.
const CITY_OPTIONS = [
  "tashkent",
  "samarkand",
  "namangan",
  "andijan",
  "fergana",
  "bukhara",
  "nukus",
  "karshi",
  "kokand",
  "margilan",
  "jizzakh",
  "urgench",
] as const;

const CITY_LABELS: Record<"ru" | "uz", string[]> = {
  ru: ["Ташкент", "Самарканд", "Наманган", "Андижан", "Фергана", "Бухара", "Нукус", "Карши", "Коканд", "Маргилан", "Джизак", "Ургенч"],
  uz: ["Toshkent", "Samarqand", "Namangan", "Andijon", "Farg'ona", "Buxoro", "Nukus", "Qarshi", "Qo'qon", "Marg'ilon", "Jizzax", "Urganch"],
};

const STR = {
  ru: {
    eyebrow: "05 / Заявка",
    title: "Стартовая цена для магазинов у дома и минимаркетов.",
    body: "Оставьте контакты, и менеджер свяжется с вами. Уточним точку, оборудование и удобное время подключения.",
    openCta: "Оставить заявку",
    modalTitle: "Заявка",
    close: "Закрыть",
    pricing: {
      badge: "Стартовая цена",
      title: "Начните с телефона",
      price: "49 000",
      unit: "сум / месяц",
      note: "первые 6 месяцев · далее",
      old: "149 000",
      cta: "Подать заявку",
      groups: [
        { title: "Что входит", items: ["Касса и чеки", "Склад и остатки", "QR и 4 способа оплаты", "Отчёты владельца", "Роли и PIN-доступ"] },
        { title: "Без рисков", items: ["Без покупки оборудования сразу", "Запуск за 1 рабочий день", "Помогаем с первым запуском", "Старт с телефона"] },
      ],
    },
    step1Label: "Заявка",
    step1Title: "Контакты",
    step1Desc: "Оставьте контакты, и менеджер свяжется с вами",
    contactsTitle: "Контакты",
    contactsDesc: "Как с вами связаться",
    name: "Имя",
    phone: "Телефон",
    phoneHint: "Формат: +998 90 123 45 67",
    bizTitle: "Бизнес",
    bizDesc: "Пара слов о точке",
    business: "Тип бизнеса",
    businessOptional: "Тип бизнеса (необязательно)",
    businessTypes: ["Магазин", "Минимаркет", "Аптека", "Рынок / точка", "Сервис", "Другое"],
    businessName: "Название магазина",
    cityTitle: "Город / район",
    cityDesc: "Где находится точка",
    city: "Город",
    cityPlaceholder: "Выберите город (необязательно)",
    cityOther: "Другой город",
    cityOtherPh: "Введите ваш город",
    other: "Уточните тип бизнеса",
    sendContacts: "Отправить заявку",
    equipTitle: "Оборудование",
    equipDesc: "Если нужен полный комплект, отметьте одним нажатием",
    equipLabel: "Оборудование",
    equipBundle: "Нужен комплект: планшет, сканер и чековый принтер",
    commentTitle: "Комментарий",
    commentDesc: "Необязательно",
    commentPh: "Что важно знать о вашей точке?",
    submit: "Отправить заявку",
    submitting: "Отправляем...",
    successTitle: "Заявка принята",
    successBody: "Заявка принята. Менеджер свяжется и поможет подключить магазин.",
    successTg: "Можно сразу написать нам в Telegram",
    again: "Отправить ещё одну",
    error: "Не удалось отправить. Попробуйте ещё раз.",
    tooMany: "Слишком много попыток. Подождите пару минут и попробуйте снова.",
    validation: "Проверьте имя и телефон: что-то заполнено неверно.",
    aside: {
      title: "Почему BirLiy",
      items: ["Касса, склад и деньги в одном экране", "Запуск за один день, старт с телефона", "Помощь с первым запуском, лично"],
      note: "Ваши данные используем только для подключения и связи с вами.",
    },
  },
  uz: {
    eyebrow: "05 / Ariza",
    title: "Uy yonidagi do'kon va minimarketlar uchun start narx.",
    body: "Kontaktlarni qoldiring, menejer siz bilan bog'lanadi. Nuqta, kerakli jihoz va ulash vaqtini aniqlaymiz.",
    openCta: "Ariza qoldirish",
    modalTitle: "Ariza",
    close: "Yopish",
    pricing: {
      badge: "Start narxi",
      title: "Telefondan boshlang",
      price: "49 000",
      unit: "so'm / oy",
      note: "birinchi 6 oy · keyin",
      old: "149 000",
      cta: "Ariza topshirish",
      groups: [
        { title: "Nimalar kiradi", items: ["Kassa va cheklar", "Ombor va qoldiqlar", "QR va 4 to'lov usuli", "Egasi hisobotlari", "Rollar va PIN"] },
        { title: "Xavfsiz boshlash", items: ["Uskunani darhol sotib olishsiz", "1 ish kunida ishga tushirish", "Birinchi startda yordam", "Telefondan start"] },
      ],
    },
    step1Label: "Ariza",
    step1Title: "Kontaktlar",
    step1Desc: "Kontakt qoldiring, menejer siz bilan bog'lanadi",
    contactsTitle: "Kontaktlar",
    contactsDesc: "Siz bilan qanday bog'lanamiz",
    name: "Ism",
    phone: "Telefon",
    phoneHint: "Format: +998 90 123 45 67",
    bizTitle: "Biznes",
    bizDesc: "Nuqta haqida ikki og'iz",
    business: "Biznes turi",
    businessOptional: "Biznes turi (ixtiyoriy)",
    businessTypes: ["Do'kon", "Minimarket", "Dorixona", "Bozor / nuqta", "Servis", "Boshqa"],
    businessName: "Do'kon nomi",
    cityTitle: "Shahar / tuman",
    cityDesc: "Nuqta qayerda joylashgan",
    city: "Shahar",
    cityPlaceholder: "Shaharni tanlang (ixtiyoriy)",
    cityOther: "Boshqa shahar",
    cityOtherPh: "Shahringizni kiriting",
    other: "Biznes turini aniqlang",
    sendContacts: "Ariza yuborish",
    equipTitle: "Jihozlar",
    equipDesc: "Kerak bo'lsa, to'liq to'plamni bir marta belgilang",
    equipLabel: "Jihoz",
    equipBundle: "Menga jihoz kerak: planshet, skaner va chek printeri",
    commentTitle: "Izoh",
    commentDesc: "Ixtiyoriy",
    commentPh: "Nuqtangiz haqida nima bilish muhim?",
    submit: "Ariza yuborish",
    submitting: "Yuborilmoqda...",
    successTitle: "Ariza qabul qilindi",
    successBody: "Ariza qabul qilindi. Menejer bog'lanib, do'konni ulashga yordam beradi.",
    successTg: "Istasangiz, darrov Telegramga yozing",
    again: "Yana bittasini yuborish",
    error: "Yuborib bo'lmadi. Yana urinib ko'ring.",
    tooMany: "Urinishlar juda ko'p. Bir-ikki daqiqa kuting va qayta urining.",
    validation: "Ism va telefonni tekshiring: biror joyi noto'g'ri.",
    aside: {
      title: "Nega BirLiy",
      items: ["Kassa, ombor va pul bitta ekranda", "Bir kunda ishga tushirish, telefondan start", "Birinchi startda shaxsan yordam"],
      note: "Ma'lumotlaringiz faqat ulash va aloqa uchun ishlatiladi.",
    },
  },
} as const;

function SectionRow({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-[#e5ebe6] pt-6 first:border-t-0 first:pt-0 md:grid-cols-[0.32fr_0.68fr]">
      <div>
        <p className="text-base font-extrabold tracking-normal">{title}</p>
        <p className="mt-1 text-sm font-bold text-ink-500">{desc}</p>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

const inputCls =
  "min-h-12 w-full rounded-lg border border-[#d9e2db] bg-white px-4 text-base font-bold outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15";

function EquipToggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-extrabold transition ${on ? "border-green-500 bg-green-50 text-green-800" : "border-[#d9e2db] bg-white text-ink-700 hover:bg-[#f1f4f1]"}`}
    >
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${on ? "border-green-500 bg-green-500 text-white" : "border-[#cfdad4] bg-white"}`}>
        {on && <Check size={13} strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

// Lead form (BR-04). A shop owner can submit with contact info only, plus an
// optional equipment bundle flag. `segment` is the segment card that opened the
// modal, carried into the comment for attribution.
function LeadForm({ locale, segment, initialNeedsEquipment = false }: { locale: Locale; segment?: string; initialNeedsEquipment?: boolean }) {
  const t = STR[locale];
  const attribution = useAttribution();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [businessType, setBusinessType] = useState<string>("");
  // City selector: `cityChoice` holds the select value (one of CITY_OPTIONS,
  // "other", or "" for unset); `cityOtherText` holds the free text when "other"
  // is chosen. Resolved to a single optional `city` string via a hidden input.
  const [cityChoice, setCityChoice] = useState<string>("");
  const [cityOtherText, setCityOtherText] = useState<string>("");
  const cityLabels = CITY_LABELS[locale];
  const cityIndex = CITY_OPTIONS.indexOf(cityChoice as (typeof CITY_OPTIONS)[number]);
  // The value posted as `city`: the localized label for a listed city, the typed
  // text for "other", else empty (field stays optional end to end).
  const resolvedCity =
    cityChoice === "other"
      ? cityOtherText.trim()
      : cityIndex >= 0
        ? cityLabels[cityIndex]
        : "";
  const [equipmentBundle, setEquipmentBundle] = useState(initialNeedsEquipment);
  const [phone, setPhone] = useState("");
  const startedRef = useRef(false);
  const invalidTrackedRef = useRef(false);
  const fieldsRef = useRef<HTMLDivElement>(null);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackSiteEvent("lead_form_start");
  };

  const fieldsAreValid = (): boolean => {
    const fields = fieldsRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
      "input[name],select[name]",
    );
    if (!fields) return true;
    for (const field of fields) {
      if (!field.reportValidity()) return false;
    }
    return true;
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fieldsAreValid()) return;
    setErrorMsg("");
    setFormState("submitting");
    // Submit attempt: the form passed validation and we are about to call the API.
    // NOT a conversion yet.
    trackLeadSubmitAttempt();

    const fd = new FormData(event.currentTarget);
    fd.set("language", locale);
    // Inherit campaign attribution from the URL (?source= / utm_*) like the main
    // form did; with no params the server defaults source to "direct".
    if (attribution.source) fd.set("source", attribution.source);
    if (attribution.utm_source) fd.set("utm_source", attribution.utm_source);
    if (attribution.utm_medium) fd.set("utm_medium", attribution.utm_medium);
    if (attribution.utm_campaign) fd.set("utm_campaign", attribution.utm_campaign);

    const equip = [equipmentBundle ? t.equipBundle : null].filter(Boolean) as string[];
    fd.set("needs_equipment", equip.length > 0 ? "true" : "false");
    // City is now a real, optional server field (its own `city` column), carried
    // by the hidden `city` input below — no longer folded into comment. The
    // equipment flag and the segment card still have no column, so they are
    // folded into `comment` (the only free text the server stores). The server
    // caps `comment` at 500; build the prefix from equipment + segment, then trim
    // the user's text to the remaining budget so it can never overflow and
    // silently fail server validation (which would drop the lead).
    const tags = [
      equip.length ? `${t.equipLabel}: ${equip.join(", ")}` : null,
      segment ? `segment: ${segment}` : null,
    ].filter(Boolean) as string[];
    const prefix = tags.join(" · ");
    const joiner = prefix ? " · " : "";
    const userComment = String(fd.get("comment") ?? "")
      .trim()
      .slice(0, Math.max(0, COMMENT_MAX - prefix.length - joiner.length));
    fd.set("comment", `${prefix}${joiner}${userComment}`.slice(0, COMMENT_MAX));

    try {
      // No Content-Type header: the browser sets multipart/form-data with the boundary.
      const response = await fetch("/api/lead", { method: "POST", body: fd });
      const json = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; reason?: string };
      if (response.ok && json?.ok) {
        setFormState("sent");
        // Server confirmed the lead was saved: emit success + the GA
        // `generate_lead` conversion (the only place it fires).
        trackLeadSuccess();
        return;
      }
      // Surface the real reason instead of a generic "try again" dead-end.
      let msg: string = t.error;
      if (response.status === 429) msg = t.tooMany;
      else if (json?.error === "validation") msg = t.validation;
      setErrorMsg(msg);
      setFormState("error");
      trackSiteEvent("lead_form_error", { reason: json?.error || `http_${response.status}` });
    } catch {
      setErrorMsg(t.error);
      setFormState("error");
      trackSiteEvent("lead_form_error", { reason: "network" });
    }
  };

  if (formState === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-green-50 text-green-700">
          <Check size={30} strokeWidth={2.5} />
        </div>
        <p className="mt-4 text-2xl font-extrabold text-green-800">{t.successTitle}</p>
        <p className="mt-2 max-w-sm leading-7 text-ink-700">{t.successBody}</p>
        <a
          href={TELEGRAM_HREF}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSiteEvent("telegram_click", { cta_location: "lead_success" })}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-green-700 px-5 font-extrabold text-white transition hover:bg-green-800"
        >
          <Send size={17} />
          {t.successTg}
        </a>
        <button type="button" onClick={() => { setFormState("idle"); }} className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-[#d9e2db] px-5 font-extrabold text-ink-700 transition hover:bg-[#f1f4f1]">
          {t.again}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitLead}
      onChangeCapture={markStarted}
      onInvalidCapture={() => {
        if (invalidTrackedRef.current) return;
        invalidTrackedRef.current = true;
        trackSiteEvent("lead_form_error", { reason: "browser_validation" });
      }}
      className="grid gap-6"
    >
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-extrabold uppercase tracking-normal text-green-700">{t.step1Label}</p>
      </div>

      <div ref={fieldsRef} className="grid gap-6">
        <div>
          <p className="text-lg font-extrabold">{t.step1Title}</p>
          <p className="mt-1 text-sm font-bold text-ink-500">{t.step1Desc}</p>
        </div>

        <SectionRow title={t.contactsTitle} desc={t.contactsDesc}>
          <input required name="owner_name" maxLength={50} minLength={2} aria-label={t.name} placeholder={t.name} onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)} onInput={(e) => e.currentTarget.setCustomValidity("")} className={inputCls} />
          <input
            required
            name="owner_contact"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            // Parens and hyphen are escaped so the pattern is valid under the
            // /v (unicodeSets) regex engine current Chrome uses for the HTML
            // pattern attribute; the unescaped form threw "Invalid character in
            // character class" when reportValidity() ran on step advance. Mirrors
            // the server regex ^[+()0-9\s-]+$.
            pattern="[0-9 +\(\)\-]{5,}"
            maxLength={100}
            minLength={5}
            aria-label={t.phone}
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => { setPhone(formatUzPhone(e.target.value)); e.currentTarget.setCustomValidity(""); }}
            onFocus={(e) => { if (!e.currentTarget.value) setPhone("+998 "); }}
            onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)}
            className={inputCls}
          />
          <p className="text-xs font-bold text-ink-500">{t.phoneHint}</p>
        </SectionRow>

        <SectionRow title={t.bizTitle} desc={t.bizDesc}>
          {/* business_type is OPTIONAL (BR-04): the empty option stays selectable
              so an owner can skip it; the server folds an empty type to "other"
              with a "not specified" label. Only name + phone + city are required. */}
          <select name="business_type" aria-label={t.business} value={businessType} onChange={(e) => setBusinessType(e.target.value)} className={`${inputCls} ${businessType === "" ? "text-ink-500" : "text-ink-900"}`}>
            <option value="">{t.businessOptional}</option>
            {t.businessTypes.map((label, i) => (
              <option key={BUSINESS_VALUES[i]} value={BUSINESS_VALUES[i]} className="text-ink-900">{label}</option>
            ))}
          </select>
          {businessType === "other" && <input required name="business_type_other" maxLength={50} aria-label={t.other} placeholder={t.other} onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)} onInput={(e) => e.currentTarget.setCustomValidity("")} className={inputCls} />}
          <input name="business_name" maxLength={100} aria-label={t.businessName} placeholder={t.businessName} className={inputCls} />
        </SectionRow>

        <SectionRow title={t.cityTitle} desc={t.cityDesc}>
          {/* OPTIONAL city selector. The select + "other" text are controlled
              (no `name`, so they are never force-validated and never double-post);
              the resolved value rides a single hidden `city` field to the server,
              where it lands in the real `city` column. */}
          <select
            aria-label={t.city}
            value={cityChoice}
            onChange={(e) => setCityChoice(e.target.value)}
            className={`${inputCls} ${cityChoice === "" ? "text-ink-500" : "text-ink-900"}`}
          >
            <option value="">{t.cityPlaceholder}</option>
            {CITY_OPTIONS.map((value, i) => (
              <option key={value} value={value} className="text-ink-900">{cityLabels[i]}</option>
            ))}
            <option value="other" className="text-ink-900">{t.cityOther}</option>
          </select>
          {cityChoice === "other" && (
            <input
              aria-label={t.cityOther}
              placeholder={t.cityOtherPh}
              maxLength={80}
              value={cityOtherText}
              onChange={(e) => setCityOtherText(e.target.value)}
              className={inputCls}
            />
          )}
          {/* Single source of truth posted to the server (optional). */}
          <input type="hidden" name="city" value={resolvedCity} />
        </SectionRow>

        <SectionRow title={t.equipTitle} desc={t.equipDesc}>
          <EquipToggle label={t.equipBundle} on={equipmentBundle} onClick={() => setEquipmentBundle((v) => !v)} />
        </SectionRow>

        <SectionRow title={t.commentTitle} desc={t.commentDesc}>
          <textarea name="comment" aria-label={t.commentPh} placeholder={t.commentPh} rows={3} maxLength={450} onInput={(e) => { if (e.currentTarget.value.length > 450) e.currentTarget.value = e.currentTarget.value.slice(0, 450); }} className="min-h-[96px] w-full resize-none rounded-lg border border-[#d9e2db] bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15" />
        </SectionRow>

        {formState === "error" && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-extrabold text-red-700">{errorMsg || t.error}</p>
        )}

        <button type="submit" disabled={formState === "submitting"} aria-busy={formState === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-5 font-extrabold text-white transition hover:bg-green-800 active:scale-[0.98] disabled:opacity-60 motion-reduce:active:scale-100">
          {formState === "submitting" ? t.submitting : t.sendContacts}
          {formState !== "submitting" && <Send size={18} />}
        </button>
      </div>
    </form>
  );
}

// Accessible modal wrapping the lead form. `segment` is the segment card that
// opened it (BR-09), forwarded into the form for attribution.
export function LeadModal({
  open,
  onClose,
  locale = "ru",
  segment,
  initialNeedsEquipment = false,
}: {
  open: boolean;
  onClose: () => void;
  locale?: Locale;
  segment?: string;
  initialNeedsEquipment?: boolean;
}) {
  const t = STR[locale];
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return el.tabIndex >= 0 && style.display !== "none" && style.visibility !== "hidden";
      });

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) trackSiteEvent("lead_form_view");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#0b1826]/65 p-0 sm:items-center sm:p-6 sm:backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Mobile: full-screen sheet pinned to the viewport edges (no dvh math,
          which in-app browsers like Telegram miscalculate). Desktop: card. */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t.modalTitle}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full max-w-none flex-col overflow-hidden rounded-none bg-white text-ink-900 shadow-2xl outline-none sm:h-auto sm:max-h-[calc(100dvh-3rem)] sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#e5ebe6] bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-green-700">{t.eyebrow}</p>
            <p className="text-lg font-extrabold">{t.modalTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#d9e2db] text-ink-700 transition hover:bg-[#f1f4f1]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch] sm:px-8">
          {/* Key by segment so each open starts a fresh form at step 1 and
              carries the right segment without stale internal state. */}
          <LeadForm
            key={`${segment ?? "default"}-${initialNeedsEquipment ? "equipment" : "plain"}`}
            locale={locale}
            segment={segment}
            initialNeedsEquipment={initialNeedsEquipment}
          />
        </div>
      </div>
    </div>
  );
}

// Pricing + value section. CTAs open the lead modal via onOpenForm.
export function LeadSection({ locale = "ru", onOpenForm }: { locale?: Locale; onOpenForm: () => void }) {
  const t = STR[locale];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {t.eyebrow}
        </p>
        <h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">{t.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink-700">{t.body}</p>
      </div>

      {/* Pricing card */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-[#d9e2db] bg-white shadow-[0_24px_70px_-50px_rgba(11,24,38,0.5)]">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col justify-between gap-6 bg-green-700 p-6 text-white lg:w-[38%] lg:p-8">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-normal">{t.pricing.badge}</span>
              <p className="mt-5 text-xl font-extrabold">{t.pricing.title}</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-extrabold leading-none">{t.pricing.price}</span>
                <span className="pb-1 text-sm font-semibold text-white/85">{t.pricing.unit}</span>
              </div>
              <p className="mt-2 text-sm font-bold text-white/80">
                {t.pricing.note} <span className="line-through">{t.pricing.old}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenForm}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 font-extrabold text-green-700 transition hover:bg-green-50 active:scale-[0.97] motion-reduce:active:scale-100"
            >
              {t.pricing.cta}
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:flex-1 lg:p-8">
            {t.pricing.groups.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-sm font-extrabold text-ink-900">{group.title}</p>
                <ul className="grid gap-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-bold text-ink-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-green-700" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Value band + CTA */}
      <div className="mt-8 grid gap-6 rounded-2xl border border-[#d9e2db] bg-[#0b1826] p-6 text-white sm:p-8 lg:grid-cols-[1.45fr_0.55fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-green-300">
            <ShieldCheck size={20} />
            <p className="text-sm font-semibold uppercase tracking-normal">{t.aside.title}</p>
          </div>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {t.aside.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm font-semibold leading-6 text-white/86">
                <Check size={16} className="mt-0.5 shrink-0 text-green-300" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-bold text-white/55">{t.aside.note}</p>
        </div>
        <button
          type="button"
          onClick={onOpenForm}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 font-extrabold text-white shadow-[0_18px_42px_-22px_rgba(3,183,61,0.88)] transition hover:bg-green-800 active:scale-[0.97] motion-reduce:active:scale-100"
        >
          {t.openCta}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
