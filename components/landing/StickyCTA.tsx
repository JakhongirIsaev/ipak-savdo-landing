"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function StickyCTA({ label, note, scrollTo }: { label: string; note: string; scrollTo: (id: string) => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-paper/95 backdrop-blur transition-transform duration-300 ease-birliy lg:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="section-shell flex items-center justify-between gap-3 py-3">
        <span className="text-xs font-semibold text-ink-700">{note}</span>
        <button
          type="button"
          onClick={() => scrollTo("lead")}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 ease-birliy hover:bg-green-800"
        >
          {label}
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
