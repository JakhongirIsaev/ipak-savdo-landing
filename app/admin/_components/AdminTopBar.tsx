"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/dashboard", label: "Сводка", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Заявки", icon: Inbox },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
];

export function AdminTopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0 sm:px-6 lg:px-8">
        <a href="/admin/dashboard" className="flex items-center" aria-label="BirLiy — рабочий кабинет">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/birliy-wordmark.png" alt="BirLiy" width={1216} height={403} className="h-7 w-auto" />
          <span className="ml-3 hidden border-l border-mist pl-3 text-sm font-medium text-ink-500 sm:inline">
            Кабинет
          </span>
        </a>

        <nav className="flex items-center gap-1 self-start rounded-full border border-mist bg-white p-1 sm:self-auto">
          {TABS.map((t) => {
            const active =
              pathname === t.href || (t.href === "/admin/leads" && pathname.startsWith("/admin/leads"));
            const Icon = t.icon;
            return (
              <a
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-birliy sm:gap-2 sm:px-4",
                  active ? "bg-ink-900 text-white" : "text-ink-700 hover:text-ink-900",
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {t.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
