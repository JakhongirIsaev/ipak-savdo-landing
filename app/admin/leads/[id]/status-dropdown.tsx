"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadStatus } from "@/lib/db/schema";
import { STATUS_META } from "@/lib/admin/status-meta";

const STATUSES: LeadStatus[] = ["new", "contacted", "demo", "won", "lost"];

export function StatusDropdown({ leadId, currentStatus }: { leadId: number; currentStatus: LeadStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = async (to: LeadStatus) => {
    if (to === currentStatus) return;
    setError(null);
    const res = await fetch(`/api/admin/leads/${leadId}/status`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to_status: to }),
    });
    if (!res.ok) {
      setError("Не удалось обновить статус");
      return;
    }
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <select
        aria-label="Изменить статус заявки"
        disabled={pending}
        value={currentStatus}
        onChange={(e) => change(e.target.value as LeadStatus)}
        className="cursor-pointer rounded-full border border-mist bg-white px-3.5 py-1.5 text-sm font-medium text-ink-900 transition-colors duration-200 ease-birliy hover:border-ink-500 focus:outline-none focus:ring-4 focus:ring-[#03B73D]/15 disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].emoji} {STATUS_META[s].label}
          </option>
        ))}
      </select>
      {error && <div className="text-xs text-stop">{error}</div>}
    </div>
  );
}
