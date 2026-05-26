"use client";

import { useState, useEffect } from "react";
import { type LandingDict } from "@/lib/landing/i18n";

export function Cookie({ t }: { t: LandingDict }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(localStorage.getItem("birliy-cookie-ok") !== "true");
  }, []);
  if (!show) return null;

  const accept = () => {
    localStorage.setItem("birliy-cookie-ok", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-2xl border border-mist bg-white p-5 shadow-[0_8px_32px_rgba(11,24,38,0.08)] md:bottom-6 md:left-auto md:right-6 md:max-w-md">
      <p className="text-sm leading-relaxed text-ink-700">{t.cookie}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors duration-200 ease-birliy hover:bg-ink-700"
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 ease-birliy hover:text-ink-900"
        >
          {t.later}
        </button>
      </div>
    </div>
  );
}
