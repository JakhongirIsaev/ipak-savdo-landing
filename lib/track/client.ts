"use client";

import type { SiteEventName } from "./event-types";

type EventDetails = {
  placement?: string;
  reason?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackSiteEvent(event: SiteEventName, details: EventDetails = {}): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const payload = JSON.stringify({
    event,
    path: window.location.pathname,
    loc: document.documentElement.lang || undefined,
    placement: details.placement,
    reason: details.reason,
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
      placement: details.placement,
      reason: details.reason,
    });
  } catch {
    // GA is optional.
  }
}
