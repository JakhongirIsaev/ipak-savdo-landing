"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// First-party page-view beacon. Fires once per page/route change to /api/hit,
// which counts the visit in our own DB (no Google, no cookie banner needed —
// the cookie set is a strictly-functional first-party visitor id).
export function VisitorBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const payload = JSON.stringify({
      path: window.location.pathname,
      loc: document.documentElement.lang || undefined,
      ref: document.referrer || undefined,
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/hit", new Blob([payload], { type: "application/json" }));
      } else {
        void fetch("/api/hit", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      // Tracking must never break the page.
    }
  }, [pathname]);

  return null;
}
