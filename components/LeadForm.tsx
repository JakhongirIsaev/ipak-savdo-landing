"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";
// Order matches BUSINESS_TYPE_VALUES below — DO NOT REORDER
const BUSINESS_TYPE_VALUES = ["shop", "cafe", "restaurant", "market", "beauty", "service", "other"] as const;
type BusinessTypeValue = (typeof BUSINESS_TYPE_VALUES)[number];

const inputClass =
  "w-full rounded-xl border border-mist bg-white px-4 py-3 text-base font-bold outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/15";

const SELECT_CHEVRON_BG =
  "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23667085%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10";

export type LeadFormLocale = "ru" | "uz";

export interface LeadFormDict {
  formBusinessName: string;
  formName: string;
  formPhone: string;
  formBusiness: string;
  formBusinessTypeOther: string;
  formNeedsEquipment: string;
  formComment: string;
  optional: string;
  submit: string;
  success: string;
  formSubmitError: string;
  formRateLimited: string;
  formValidationError: string;
  businessTypes: readonly string[];
}

export interface LeadFormProps {
  t: LeadFormDict;
  locale?: LeadFormLocale;
  compact?: boolean;
  attribution?: {
    source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

type FormState = "idle" | "submitting" | "sent" | "error";

export default function LeadForm({ t, locale, compact, attribution }: LeadFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [extra, setExtra] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessTypeValue | "">("");

  if (state === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-green-100 bg-white p-8 text-center text-xl font-semibold text-green-800">
        {t.success}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const body = {
      business_name: String(fd.get("business_name") ?? "").trim(),
      business_type: String(fd.get("business_type") ?? ""),
      business_type_other: fd.get("business_type") === "other" ? String(fd.get("business_type_other") ?? "").trim() : null,
      owner_name: String(fd.get("owner_name") ?? "").trim(),
      owner_contact: String(fd.get("owner_contact") ?? "").trim(),
      needs_equipment: fd.get("needs_equipment") === "on",
      comment: String(fd.get("comment") ?? "").trim() || null,
      language: locale,
      source: attribution?.source,
      utm_source: attribution?.utm_source,
      utm_medium: attribution?.utm_medium,
      utm_campaign: attribution?.utm_campaign,
      _hp: String(fd.get("_hp") ?? ""),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setErrorMsg(t.formRateLimited);
        setState("error");
        return;
      }
      if (res.status === 400) {
        setErrorMsg(t.formValidationError);
        setState("error");
        return;
      }
      if (!res.ok || !json.ok) {
        setErrorMsg(t.formSubmitError);
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setErrorMsg(t.formSubmitError);
      setState("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("mx-auto grid max-w-xl gap-4 rounded-lg border border-mist bg-white p-5 shadow-sm", compact && "shadow-none")}
    >
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <input name="business_name" placeholder={t.formBusinessName} className={inputClass} />
      <input required name="owner_name" placeholder={t.formName} className={inputClass} />
      <input required name="owner_contact" type="tel" placeholder={t.formPhone} className={inputClass} />
      <select
        required
        name="business_type"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value as BusinessTypeValue | "")}
        className={cn(inputClass, SELECT_CHEVRON_BG)}
      >
        <option value="" disabled>{t.formBusiness}</option>
        {t.businessTypes.map((label, idx) => (
          <option key={BUSINESS_TYPE_VALUES[idx]} value={BUSINESS_TYPE_VALUES[idx]}>
            {label}
          </option>
        ))}
      </select>
      {businessType === "other" && (
        <input required name="business_type_other" placeholder={t.formBusinessTypeOther} className={inputClass} />
      )}

      <label className="flex items-center gap-3 text-sm font-semibold text-ink-700">
        <input type="checkbox" name="needs_equipment" className="h-5 w-5 rounded border-mist text-green-500" />
        {t.formNeedsEquipment}
      </label>

      <button
        type="button"
        onClick={() => setExtra(!extra)}
        className="flex min-h-11 items-center gap-2 text-left text-sm font-semibold text-ink-700"
      >
        <ChevronDown size={16} className={cn("transition", extra && "rotate-180")} />
        {t.optional}
      </button>
      {extra && (
        <textarea name="comment" placeholder={t.formComment} rows={3} className={cn(inputClass, "resize-none")} maxLength={500} />
      )}

      {state === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-4 font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800 disabled:opacity-60"
      >
        <Send size={18} />
        {state === "submitting" ? "..." : t.submit}
      </button>
    </form>
  );
}
