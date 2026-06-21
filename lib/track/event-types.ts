export const siteEventNames = [
  "cta_click",
  "product_demo_click",
  "lead_form_view",
  "lead_form_start",
  "lead_form_error",
  "lead_form_submit",
  "lead_form_success",
  "page_view",
  "telegram_click",
  "phone_click",
  "faq_open",
  "demo_interaction",
  "language_switch",
  "blog_click",
] as const;

export type SiteEventName = (typeof siteEventNames)[number];

export function isSiteEventName(value: unknown): value is SiteEventName {
  return typeof value === "string" && (siteEventNames as readonly string[]).includes(value);
}
