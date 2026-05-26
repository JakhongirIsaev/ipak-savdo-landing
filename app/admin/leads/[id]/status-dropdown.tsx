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
    <div className="flex flex-col items-end gap-1">
      <select
        disabled={pending}
        value={currentStatus}
        onChange={(e) => change(e.target.value as LeadStatus)}
        className="rounded-md border border-mist bg-white px-3 py-2 text-sm font-medium text-ink-900 disabled:opacity-50"
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
