"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <footer className={`border-t py-12 text-[10px] text-zinc-500 transition-colors z-10 relative ${isDarkMode ? "border-zinc-900/60 bg-[#02040a]" : "border-slate-200 bg-white"}`}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 flex items-center justify-center rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <span className="font-display font-bold text-sm">Vibe Analytics</span>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/pricing" className="hover:text-zinc-300">Pricing</Link>
          <Link href="/contact" className="hover:text-zinc-300">Contact</Link>
          <Link href="/privacy" className="hover:text-zinc-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-300">Terms of Service</Link>
          <Link href="/cookie-policy" className="hover:text-zinc-300">Cookie Policy</Link>
          <Link href="/appsec" className="hover:text-zinc-300">AppSec Audits</Link>
        </div>

        <div>
          © {new Date().getFullYear()} Vibe Analytics SaaS Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
