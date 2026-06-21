"use client";

import type { SiteEventName } from "./event-types";

type EventDetails = {
  placement?: string;
  reason?: string;
  segment?: string;
  cta_location?: string;
  question_id?: number;
  role?: string;
  step?: string | number;
  from_lang?: string;
  to_lang?: string;
  article_slug?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Mobile vs desktop, derived per call so it follows the device the event
// actually fires on (a resized window or a touch device both count as mobile).
function deviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  try {
    const narrow = window.matchMedia("(max-width: 639px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return narrow || coarse ? "mobile" : "desktop";
  } catch {
    return "desktop";
  }
}

export function trackSiteEvent(event: SiteEventName, details: EventDetails = {}): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const device_type = deviceType();
  const lang = document.documentElement.lang || undefined;

  const payload = JSON.stringify({
    event,
    path: window.location.pathname,
    loc: lang,
    device_type,
    lang,
    placement: details.placement,
    reason: details.reason,
    segment: details.segment,
    cta_location: details.cta_location,
    question_id: details.question_id,
    role: details.role,
    step: details.step,
    from_lang: details.from_lang,
    to_lang: details.to_lang,
    article_slug: details.article_slug,
    source: params.get("source") || undefined,
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/event", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/event", { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    // Marketing analytics must never interrupt the user.
  }

  try {
    window.gtag?.("event", event, {
      event_category: "lead_funnel",
      device_type,
      lang,
      placement: details.placement,
      reason: details.reason,
      segment: details.segment,
      cta_location: details.cta_location,
      question_id: details.question_id,
      role: details.role,
      step: details.step,
      from_lang: details.from_lang,
      to_lang: details.to_lang,
      article_slug: details.article_slug,
    });
  } catch {
    // GA is optional.
  }
}

// ── Lead-funnel helpers ──────────────────────────────────────────────────────
// The funnel is: view -> start -> submit (attempt) -> success | error.
// Each step is sent to /api/event AND to GA under its own accurate name.
//
// `generate_lead` is a GA *conversion* and must fire in EXACTLY one place: a
// real, server-confirmed lead (trackLeadSuccess). Opening the form, typing,
// uploading, clicking submit, hitting a validation error, or an API/network
// failure must never emit it. Keeping the emission in this single function is
// what guarantees that invariant; do not call gtag("event","generate_lead")
// anywhere else.

/** User clicked submit and the form passed native validation (an attempt). */
export function trackLeadSubmitAttempt(): void {
  trackSiteEvent("lead_form_submit");
}

/** /api/lead accepted the request and the lead was saved. The ONLY place the
 *  GA `generate_lead` conversion is emitted. */
export function trackLeadSuccess(): void {
  trackSiteEvent("lead_form_success");
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", "generate_lead", { event_category: "lead_funnel" });
  } catch {
    // GA is optional.
  }
}
