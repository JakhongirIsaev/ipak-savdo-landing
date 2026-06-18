"use client";

import { useState, useTransition } from "react";
import { refreshSerpRanksAction } from "../actions";

// Triggers the server action that fetches fresh SerpApi ranks and snapshots them.
// Calls the action inside a transition (not a <form action>) so we can surface
// the {ok, message} result. The action is server-only and runs inside the
// Basic-Auth-protected /admin tree; the API key never reaches the browser.
export function SerpRefreshButton() {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="text-xs text-ink-500">{msg}</span>}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMsg(null);
            const res = await refreshSerpRanksAction();
            setMsg(res.message);
          })
        }
        className="rounded-lg border border-mist bg-white px-3 py-1.5 text-xs font-medium text-ink-700 shadow-[0_1px_2px_rgba(11,24,38,0.04)] transition-colors duration-150 hover:border-ink-400 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Обновляем…" : "Обновить позиции"}
      </button>
    </div>
  );
}
