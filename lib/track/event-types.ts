export const siteEventNames = [
  "cta_click",
  "product_demo_click",
  "lead_form_view",
  "lead_form_start",
  "lead_form_error",
  "lead_form_submit",
] as const;

export type SiteEventName = (typeof siteEventNames)[number];

export function isSiteEventName(value: unknown): value is SiteEventName {
  return typeof value === "string" && (siteEventNames as readonly string[]).includes(value);
}
