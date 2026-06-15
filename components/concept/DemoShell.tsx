"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type NavItem = { id: string; label: string; icon: LucideIcon };

export function DemoShell({
  logo,
  title,
  subtitle,
  userName,
  userRole,
  avatar,
  nav,
  active,
  onNavigate,
  children,
}: {
  logo: ReactNode;
  title: string;
  subtitle: string;
  userName: string;
  userRole: string;
  avatar: string;
  nav: NavItem[];
  active: string;
  onNavigate: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative flex h-[34rem] w-full overflow-hidden rounded-2xl bg-white text-ink-900 md:h-[36rem]">
      <aside className="hidden w-[84px] shrink-0 flex-col items-center gap-1 overflow-y-auto bg-[#0b1826] py-3 md:flex">
        <span className="mb-2">{logo}</span>
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition ${
                isActive ? "bg-green-700 text-white" : "text-white/55 hover:bg-white/8 hover:text-white/80"
              }`}
            >
              <Icon size={20} strokeWidth={1.9} />
              {item.label}
            </button>
          );
        })}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e5ebe6] px-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold sm:text-base">{title}</p>
            <p className="truncate text-xs font-bold text-ink-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-extrabold">{userName}</p>
              <p className="text-xs font-bold text-ink-500">{userRole}</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-green-50 text-sm font-extrabold text-green-700">{avatar}</span>
          </div>
        </div>

        {/* Mobile nav (sidebar is hidden < md). Scrolls horizontally with a
            right edge-fade hinting there is more; 44px touch targets. */}
        <div className="relative shrink-0 border-b border-[#e5ebe6] md:hidden">
          <div
            data-testid="demo-mobile-nav"
            className="flex gap-1.5 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {nav.map((item) => {
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-3.5 text-sm font-semibold transition ${
                    isActive ? "bg-green-700 text-white" : "bg-[#f1f4f1] text-ink-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"
          />
        </div>

        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Kpi({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-[#e5ebe6] bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-normal text-ink-500">{label}</p>
      <p className={`mt-1.5 text-xl font-extrabold tabular-nums ${accent ? "text-green-700" : "text-ink-900"}`}>{value}</p>
    </div>
  );
}

export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-32 items-end gap-1.5">
      {values.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-24 w-full items-end">
            <div className="w-full rounded-t-md bg-green-500/85" style={{ height: `${Math.round((v / max) * 100)}%` }} />
          </div>
          <span className="text-[10px] font-bold text-ink-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-[#e5ebe6] bg-white px-4 py-3 text-left"
    >
      <span className="text-sm font-extrabold">{label}</span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-green-500" : "bg-[#d2dad4]"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
