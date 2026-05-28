"use client";

import { useState, useEffect } from "react";
import { type LandingDict } from "@/lib/landing/i18n";

export function Cookie({ t }: { t: LandingDict }) {
  const [show, setShow] = useState(false);
  const [leadVisible, setLeadVisible] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("birliy-cookie-ok") === "true") return;
    const onScroll = () => {
      if (window.scrollY > 200) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallback = setTimeout(() => setShow(true), 4000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const lead = document.getElementById("lead");
    if (!lead) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLeadVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(lead);
    return () => observer.disconnect();
  }, []);

  if (!show || leadVisible) return null;

  const accept = () => {
    localStorage.setItem("birliy-cookie-ok", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-2xl border border-mist bg-white p-4 shadow-[0_8px_32px_rgba(11,24,38,0.08)] md:bottom-6 md:right-auto md:left-6 md:max-w-md">
      <p className="text-sm leading-relaxed text-ink-700">{t.cookie}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors duration-200 ease-birliy hover:bg-ink-700"
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
        >
          {t.later}
        </button>
      </div>
    </div>
  );
}
