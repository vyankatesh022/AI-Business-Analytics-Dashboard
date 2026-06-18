"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-[#02040a] text-zinc-300" : "bg-[#f8f9fa] text-slate-700"}`}>
      
      <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${isDarkMode ? "border-zinc-800/50 bg-[#02040a]/80" : "border-slate-200/50 bg-white/80"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDarkMode ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"}`}>
              <FileText className="h-6 w-6" />
            </div>
            <h1 className={`text-4xl font-display font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Terms of Service</h1>
          </div>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>1. Acceptance of Terms</h2>
              <p>By accessing or using Vibe Analytics, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
            </section>
            
            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>2. Service Availability</h2>
              <p>We strive to ensure 99.9% uptime. However, we do not guarantee that the service will be uninterrupted or error-free. Scheduled maintenance will be communicated 48 hours in advance.</p>
            </section>

            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>3. Subscription & Billing</h2>
              <p>Enterprise and Startup tiers are billed on a monthly or annual cycle. Usage limits apply based on your tier. Overages in AI token usage or data processing bandwidth will be billed at standard rates.</p>
            </section>

            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>4. Liability Limitations</h2>
              <p>Vibe Analytics provides AI-driven insights strictly for informational purposes. We are not legally liable for business losses, operational disruptions, or revenue deficits resulting from actions taken based on platform recommendations.</p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
