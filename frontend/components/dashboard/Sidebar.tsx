"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  Database, 
  BarChart3, 
  Activity, 
  FileSpreadsheet, 
  CreditCard, 
  Settings,
  TrendingUp,
  Bookmark,
  Sliders
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard", icon: LayoutGrid, roles: ["Super Admin", "Data Analyst", "Reviewer"] },
  { id: "datasets", name: "Datasets", href: "/datasets", icon: Database, roles: ["Super Admin", "Data Analyst", "Reviewer"] },
  { id: "analytics", name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["Super Admin", "Data Analyst"] },
  { id: "ai-insights", name: "AI Insights", href: "/ai-insights", icon: Activity, roles: ["Super Admin", "Data Analyst"] },
  { id: "reports", name: "Reports", href: "/reports", icon: FileSpreadsheet, roles: ["Super Admin", "Data Analyst", "Reviewer"] },
  { id: "billing", name: "Billing", href: "/billing", icon: CreditCard, roles: ["Super Admin"] },
  { id: "settings", name: "Settings", href: "/settings", icon: Settings, roles: ["Super Admin", "Data Analyst", "Reviewer"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isDarkMode, favorites } = useDashboardStore();
  const { hasRole } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter(item => hasRole(item.roles as any));

  return (
    <aside className={`w-64 border-r shrink-0 hidden md:flex flex-col justify-between z-10 transition-colors ${
      isDarkMode ? "bg-[#0b0f19]/80 border-zinc-800/80" : "bg-white border-slate-200"
    }`}>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className={`font-display font-bold text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Vibe Console
          </span>
        </div>

        {/* Quick Access Favorites */}
        <div className="mb-4">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Favorite pinned views</div>
          <div className="flex flex-wrap gap-1">
            {favorites.map(f => {
              const matchedItem = NAV_ITEMS.find(item => item.id === f);
              if (!matchedItem) return null;
              return (
                <Link
                  key={f}
                  href={matchedItem.href}
                  className={`text-[9px] px-2 py-0.5 rounded border capitalize flex items-center gap-0.5 ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800 text-cyan-400 hover:border-zinc-700" : "bg-slate-100 border-slate-200 text-indigo-600"
                  }`}
                >
                  <Bookmark className="h-2.5 w-2.5 fill-cyan-400" />
                  {matchedItem.name}
                </Link>
              );
            })}
            {favorites.length === 0 && <span className="text-[9px] italic text-zinc-650">No bookmarked tabs.</span>}
          </div>
        </div>

        <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-3">Workspace Nav</div>
        <nav className="space-y-1">
          {visibleItems.map(tab => {
            const Icon = tab.icon;
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/10"
                    : isDarkMode ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </span>
                {favorites.includes(tab.id) && <Bookmark className="h-3 w-3 text-cyan-500 fill-cyan-500" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800/40 text-xs">
        <button 
          onClick={() => {}}
          className={`w-full p-2.5 rounded-lg border text-center font-mono flex items-center justify-center gap-1.5 transition-colors ${
            isDarkMode ? "border-zinc-850 bg-zinc-900/20 text-zinc-400 hover:text-white" : "border-slate-200 bg-white text-slate-650"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Shortcuts Guide [Alt+H]</span>
        </button>
      </div>
    </aside>
  );
}
