import type { LeadStatus } from "@/lib/db/schema";
import { STATUS_META } from "@/lib/admin/status-meta";

// Neutral pill + colored status dot. Green stays reserved for "won" (the dot),
// per the BirLiy Green Rule — no colored fills here.
export function StatusPill({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-mist bg-white px-2.5 py-1 text-xs font-medium text-ink-700">
      <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
