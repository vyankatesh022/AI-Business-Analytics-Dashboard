"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
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
              <Shield className="h-6 w-6" />
            </div>
            <h1 className={`text-4xl font-display font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>1. Data Collection</h2>
              <p>We collect structural metadata and dataset schemas necessary for providing AI-driven business intelligence. We do not store raw PII (Personally Identifiable Information) unless explicitly configured via enterprise isolated storage settings.</p>
            </section>
            
            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>2. Usage of Information</h2>
              <p>The information we collect is used to train localized ML models, provide anomaly detection, and generate interactive dashboards. Usage logs are retained strictly for 30 days to power the audit trail.</p>
            </section>

            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>3. Third-Party Integrations</h2>
              <p>When you connect webhooks via n8n or payment data via Stripe, your data is processed according to their respective privacy policies. We utilize AES-256 encryption in transit for all external requests.</p>
            </section>

            <section>
              <h2 className={`mb-4 text-2xl font-bold ${isDarkMode ? "text-zinc-100" : "text-slate-800"}`}>4. Your Rights</h2>
              <p>You maintain full ownership of your data. You may request a complete export or permanent deletion of your tenant space at any time from your dashboard settings.</p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
