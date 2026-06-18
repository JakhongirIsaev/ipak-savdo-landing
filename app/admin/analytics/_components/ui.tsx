import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Shared presentational primitives for the admin analytics dashboard. Extracted
// so the per-source sections (Search Growth, Yandex Metrika, Keyword Rank) and
// the main page render identical cards. Server-renderable, no client JS.

export const fmt = (n: number): string => n.toLocaleString("ru-RU");

export const pct = (part: number, whole: number): string =>
  whole === 0 ? "—" : `${Math.round((part / whole) * 100)}%`;

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</span>
        <Icon size={16} strokeWidth={1.5} className="text-ink-500" />
      </div>
      <div className="mt-3 font-display text-4xl font-bold tabular-nums tracking-tightish text-ink-900">{value}</div>
      {hint && <div className="mt-1.5 text-xs text-ink-500">{hint}</div>}
    </div>
  );
}

export function SectionTitle({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tightish text-ink-900">
        <Icon size={18} strokeWidth={1.75} className="text-ink-500" />
        {title}
      </h2>
      {action}
    </div>
  );
}

export function ListCard({ title, rows }: { title: string; rows: { label: ReactNode; value: string }[] }) {
  return (
    <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      <div className="mb-1 text-sm font-semibold text-ink-900">{title}</div>
      {rows.length === 0 ? (
        <div className="py-4 text-sm text-ink-500">Пока нет данных</div>
      ) : (
        <div>
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border-b border-mist py-2.5 last:border-0">
              <span className="min-w-0 truncate text-sm text-ink-700">{r.label}</span>
              <span className="shrink-0 text-sm font-medium tabular-nums text-ink-900">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Dashed-border info/error box used when a data source is not configured or its
// fetch returned null (missing credentials, API error). Never crashes the page.
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-mist bg-white p-6 text-center text-sm text-ink-500">
      {children}
    </div>
  );
}

// A simple bordered card wrapper for charts / custom content.
export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(11,24,38,0.04)]">
      {title && <div className="mb-3 text-sm font-semibold text-ink-900">{title}</div>}
      {children}
    </div>
  );
}
