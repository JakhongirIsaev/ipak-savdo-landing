"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronRight, ShieldCheck, X } from "lucide-react";
import type { Locale } from "./demoData";
import { useAttribution } from "@/lib/use-attribution";

const BUSINESS_VALUES = ["shop", "cafe", "restaurant", "market", "beauty", "service", "other"] as const;
type FormState = "idle" | "submitting" | "sent" | "error";

const MAX_DOC_BYTES = 10 * 1024 * 1024;
const ALLOWED_DOC_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOC_FIELDS = ["patent", "passport", "shop"] as const;
const COMMENT_MAX = 500; // must match lib/validators/lead.ts comment.max(500)

const STR = {
  ru: {
    eyebrow: "05 / Заявка",
    title: "Первые магазины по пилотной цене. Мест немного.",
    body: "Заполните короткую форму: контакт, тип магазина, что нужно. Мы свяжемся и запустим вместе.",
    openCta: "Оставить заявку",
    modalTitle: "Заявка в пилот",
    close: "Закрыть",
    pricing: {
      badge: "Пилотная программа",
      title: "Успейте по стартовой цене",
      price: "49 000",
      unit: "сум / месяц",
      note: "первые 6 месяцев · далее",
      old: "149 000",
      cta: "Хочу в пилот",
      groups: [
        { title: "Что входит", items: ["Касса и чеки", "Склад и остатки", "QR и 4 способа оплаты", "Отчёты владельца", "Роли и PIN-доступ"] },
        { title: "Без рисков", items: ["Без покупки оборудования сразу", "Запуск за 1 рабочий день", "Помогаем с первым запуском", "Старт с телефона"] },
      ],
    },
    contactsTitle: "Контакты",
    contactsDesc: "Как с вами связаться",
    name: "Имя",
    phone: "Телефон",
    bizTitle: "Бизнес",
    bizDesc: "Пара слов о точке",
    business: "Тип бизнеса",
    businessTypes: ["Магазин", "Кафе", "Ресторан", "Рынок / точка", "Салон красоты", "Сервис", "Другое"],
    businessName: "Название магазина",
    other: "Уточните тип бизнеса",
    equipTitle: "Оборудование",
    equipDesc: "Что нужно для старта (необязательно)",
    equipLabel: "Оборудование",
    equipQr: "Сканер штрих-кодов",
    equipTablet: "Планшет",
    docsTitle: "Документы (по желанию)",
    docsNote: "Если есть под рукой: патент, паспорт владельца и фото магазина. Если нет, соберём позже, при подключении. Передаются по защищённому каналу.",
    docPatent: "Фото патента",
    docPassport: "Фото паспорта директора/владельца",
    docShop: "Фото магазина",
    filePick: "Выбрать фото",
    fileTooBig: "Файл слишком большой: максимум 10 МБ.",
    fileWrongType: "Нужно фото: JPG, PNG или WEBP.",
    filesRequired: "Приложите все три фото: патент, паспорт и магазин.",
    commentTitle: "Комментарий",
    commentDesc: "Необязательно",
    commentPh: "Что важно знать о вашей точке?",
    submit: "Отправить заявку",
    submitting: "Отправляем...",
    successTitle: "Заявка отправлена",
    successBody: "Команда BirLiy свяжется с вами. Спасибо!",
    again: "Отправить ещё одну",
    error: "Не удалось отправить. Попробуйте ещё раз.",
    tooMany: "Слишком много попыток. Подождите пару минут и попробуйте снова.",
    validation: "Проверьте имя, телефон и тип бизнеса: что-то заполнено неверно.",
    aside: {
      title: "Почему BirLiy",
      items: ["Касса, склад и деньги в одном экране", "Запуск за один день, старт с телефона", "Помощь с первым запуском, лично"],
      note: "Документы передаются по защищённому каналу.",
    },
  },
  uz: {
    eyebrow: "05 / Ariza",
    title: "Birinchi do'konlar pilot narxida. O'rin kam.",
    body: "Qisqa formani to'ldiring: aloqa, do'kon turi, nimaga ehtiyoj bor. Biz bog'lanamiz va birga ishga tushiramiz.",
    openCta: "Ariza qoldirish",
    modalTitle: "Pilotga ariza",
    close: "Yopish",
    pricing: {
      badge: "Pilot dasturi",
      title: "Boshlang'ich narxga ulguring",
      price: "49 000",
      unit: "so'm / oy",
      note: "birinchi 6 oy · keyin",
      old: "149 000",
      cta: "Pilotga yozilmoqchiman",
      groups: [
        { title: "Nimalar kiradi", items: ["Kassa va cheklar", "Ombor va qoldiqlar", "QR va 4 to'lov usuli", "Egasi hisobotlari", "Rollar va PIN"] },
        { title: "Xavfsiz boshlash", items: ["Uskunani darhol sotib olishsiz", "1 ish kunida ishga tushirish", "Birinchi startda yordam", "Telefondan start"] },
      ],
    },
    contactsTitle: "Kontaktlar",
    contactsDesc: "Siz bilan qanday bog'lanamiz",
    name: "Ism",
    phone: "Telefon",
    bizTitle: "Biznes",
    bizDesc: "Nuqta haqida ikki og'iz",
    business: "Biznes turi",
    businessTypes: ["Do'kon", "Kafe", "Restoran", "Bozor / nuqta", "Go'zallik saloni", "Servis", "Boshqa"],
    businessName: "Do'kon nomi",
    other: "Biznes turini aniqlang",
    equipTitle: "Jihozlar",
    equipDesc: "Start uchun nima kerak (ixtiyoriy)",
    equipLabel: "Jihozlar",
    equipQr: "Shtrix-kod skaner",
    equipTablet: "Planshet",
    docsTitle: "Hujjatlar (ixtiyoriy)",
    docsNote: "Agar tayyor bo'lsa: patent, egasi pasporti va do'kon fotosi. Bo'lmasa, keyin ulaganda yig'amiz. Himoyalangan kanal orqali yuboriladi.",
    docPatent: "Patent fotosi",
    docPassport: "Direktor/egasi pasporti fotosi",
    docShop: "Do'kon fotosi",
    filePick: "Foto tanlash",
    fileTooBig: "Fayl juda katta: maksimum 10 MB.",
    fileWrongType: "Foto kerak: JPG, PNG yoki WEBP.",
    filesRequired: "Uchta fotoni ham biriktiring: patent, pasport va do'kon.",
    commentTitle: "Izoh",
    commentDesc: "Ixtiyoriy",
    commentPh: "Nuqtangiz haqida nima bilish muhim?",
    submit: "Ariza yuborish",
    submitting: "Yuborilmoqda...",
    successTitle: "Ariza yuborildi",
    successBody: "BirLiy jamoasi siz bilan bog'lanadi. Rahmat!",
    again: "Yana bittasini yuborish",
    error: "Yuborib bo'lmadi. Yana urinib ko'ring.",
    tooMany: "Urinishlar juda ko'p. Bir-ikki daqiqa kuting va qayta urining.",
    validation: "Ism, telefon va biznes turini tekshiring: biror joyi noto'g'ri.",
    aside: {
      title: "Nega BirLiy",
      items: ["Kassa, ombor va pul bitta ekranda", "Bir kunda ishga tushirish, telefondan start", "Birinchi startda shaxsan yordam"],
      note: "Hujjatlar himoyalangan kanal orqali yuboriladi.",
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

function DocInput({ name, label, pickLabel }: { name: string; label: string; pickLabel: string }) {
  const [fileName, setFileName] = useState("");
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#d9e2db] bg-white px-4 py-3 transition hover:border-green-500">
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold text-ink-900">{label}</span>
        {fileName && <span className="truncate text-xs font-bold text-ink-500">{fileName}</span>}
      </span>
      <span className="shrink-0 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">{pickLabel}</span>
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
        className="sr-only"
      />
    </label>
  );
}

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

// Reusable form rendered inside the modal. Submits multipart (with documents).
function LeadForm({ locale }: { locale: Locale }) {
  const t = STR[locale];
  const attribution = useAttribution();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [businessType, setBusinessType] = useState<string>("");
  const [qrScanner, setQrScanner] = useState(false);
  const [tablet, setTablet] = useState(false);

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setFormState("submitting");

    const fd = new FormData(event.currentTarget);
    fd.set("language", locale);
    // Inherit campaign attribution from the URL (?source= / utm_*) like the main
    // form did; with no params the server defaults source to "direct".
    if (attribution.source) fd.set("source", attribution.source);
    if (attribution.utm_source) fd.set("utm_source", attribution.utm_source);
    if (attribution.utm_medium) fd.set("utm_medium", attribution.utm_medium);
    if (attribution.utm_campaign) fd.set("utm_campaign", attribution.utm_campaign);

    const equip = [qrScanner ? t.equipQr : null, tablet ? t.equipTablet : null].filter(Boolean) as string[];
    fd.set("needs_equipment", equip.length > 0 ? "true" : "false");
    // Server caps `comment` at 500 chars and we prepend the equipment label,
    // trim the user's text to the remaining budget so a long comment can never
    // overflow the cap and silently fail server validation (dropping the lead).
    const prefix = equip.length ? `${t.equipLabel}: ${equip.join(", ")}` : "";
    const joiner = prefix ? ": " : "";
    const userComment = String(fd.get("comment") ?? "")
      .trim()
      .slice(0, Math.max(0, COMMENT_MAX - prefix.length - joiner.length));
    fd.set("comment", `${prefix}${joiner}${userComment}`.slice(0, COMMENT_MAX));

    for (const field of DOC_FIELDS) {
      const f = fd.get(field);
      // Documents are optional now; validate only the ones actually attached.
      if (!(f instanceof File) || f.size === 0) continue;
      if (!ALLOWED_DOC_TYPES.includes(f.type)) {
        setErrorMsg(t.fileWrongType);
        setFormState("error");
        return;
      }
      if (f.size > MAX_DOC_BYTES) {
        setErrorMsg(t.fileTooBig);
        setFormState("error");
        return;
      }
    }

    try {
      // No Content-Type header: the browser sets multipart/form-data with the boundary.
      const response = await fetch("/api/lead", { method: "POST", body: fd });
      const json = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; reason?: string };
      if (response.ok && json?.ok) {
        setFormState("sent");
        return;
      }
      // Surface the real reason instead of a generic "try again" dead-end.
      let msg: string = t.error;
      if (response.status === 429) msg = t.tooMany;
      else if (json?.error === "file") {
        msg = json.reason === "size" ? t.fileTooBig : json.reason === "type" ? t.fileWrongType : t.filesRequired;
      } else if (json?.error === "validation") msg = t.validation;
      setErrorMsg(msg);
      setFormState("error");
    } catch {
      setErrorMsg(t.error);
      setFormState("error");
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
        <button type="button" onClick={() => setFormState("idle")} className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-[#d9e2db] px-5 font-extrabold text-ink-700 transition hover:bg-[#f1f4f1]">
          {t.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submitLead} className="grid gap-6">
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <SectionRow title={t.contactsTitle} desc={t.contactsDesc}>
        <input required name="owner_name" maxLength={50} minLength={2} aria-label={t.name} placeholder={t.name} onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)} onInput={(e) => e.currentTarget.setCustomValidity("")} className={inputCls} />
        <input required name="owner_contact" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+() -]{5,}" maxLength={100} minLength={5} aria-label={t.phone} placeholder={t.phone} onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)} onInput={(e) => e.currentTarget.setCustomValidity("")} className={inputCls} />
      </SectionRow>

      <SectionRow title={t.bizTitle} desc={t.bizDesc}>
        <select required name="business_type" aria-label={t.business} value={businessType} onChange={(e) => { setBusinessType(e.target.value); e.currentTarget.setCustomValidity(""); }} onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)} className={`${inputCls} ${businessType === "" ? "text-ink-500" : "text-ink-900"}`}>
          <option value="" disabled>{t.business}</option>
          {t.businessTypes.map((label, i) => (
            <option key={BUSINESS_VALUES[i]} value={BUSINESS_VALUES[i]} className="text-ink-900">{label}</option>
          ))}
        </select>
        {businessType === "other" && <input required name="business_type_other" maxLength={50} aria-label={t.other} placeholder={t.other} onInvalid={(e) => e.currentTarget.setCustomValidity(t.validation)} onInput={(e) => e.currentTarget.setCustomValidity("")} className={inputCls} />}
        <input name="business_name" maxLength={100} aria-label={t.businessName} placeholder={t.businessName} className={inputCls} />
      </SectionRow>

      <SectionRow title={t.equipTitle} desc={t.equipDesc}>
        <div className="grid grid-cols-2 gap-2">
          <EquipToggle label={t.equipQr} on={qrScanner} onClick={() => setQrScanner((v) => !v)} />
          <EquipToggle label={t.equipTablet} on={tablet} onClick={() => setTablet((v) => !v)} />
        </div>
      </SectionRow>

      <SectionRow title={t.docsTitle} desc={t.docsNote}>
        <DocInput name="patent" label={t.docPatent} pickLabel={t.filePick} />
        <DocInput name="passport" label={t.docPassport} pickLabel={t.filePick} />
        <DocInput name="shop" label={t.docShop} pickLabel={t.filePick} />
      </SectionRow>

      <SectionRow title={t.commentTitle} desc={t.commentDesc}>
        <textarea name="comment" aria-label={t.commentPh} placeholder={t.commentPh} rows={3} maxLength={450} onInput={(e) => { if (e.currentTarget.value.length > 450) e.currentTarget.value = e.currentTarget.value.slice(0, 450); }} className="min-h-[96px] w-full resize-none rounded-lg border border-[#d9e2db] bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/15" />
      </SectionRow>

      {formState === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-extrabold text-red-700">{errorMsg || t.error}</p>
      )}

      <button type="submit" disabled={formState === "submitting"} aria-busy={formState === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-5 font-extrabold text-white transition hover:bg-ink-700 disabled:opacity-60">
        {formState === "submitting" ? t.submitting : t.submit}
      </button>
    </form>
  );
}

// Accessible modal wrapping the lead form.
export function LeadModal({ open, onClose, locale = "ru" }: { open: boolean; onClose: () => void; locale?: Locale }) {
  const t = STR[locale];
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
          <LeadForm locale={locale} />
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
