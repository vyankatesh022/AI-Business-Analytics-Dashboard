"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { useDashboardStore } from "@/store/useDashboardStore";

import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useDashboardStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("theme-dark");
    } else {
      root.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  return (
    <ToastProvider>
      <div className={`min-h-screen relative flex transition-colors duration-300 font-sans ${
        isDarkMode ? "theme-dark bg-[#05070f] text-zinc-200" : "bg-[#f8fafc] text-slate-800"
      }`}>
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden">
          <TopNav />
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
