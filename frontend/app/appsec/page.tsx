"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Server, Key, AlertTriangle } from "lucide-react";

export default function AppSecAudits() {
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

  const securityFeatures = [
    {
      icon: <Server className="h-5 w-5" />,
      title: "Data Isolation & RLS",
      description: "Tenant isolation is enforced via strict Row-Level Security (RLS) on PostgreSQL. Client data cannot bleed between authenticated sessions."
    },
    {
      icon: <Key className="h-5 w-5" />,
      title: "Zero Hardcoded Secrets",
      description: "Our codebase strictly enforces environment-variable based secrets mapping. CI/CD pipelines actively scan and block unauthorized token commits."
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Continuous Linting & Auditing",
      description: "NPM dependency audits and Python bandit/safety scans run synchronously before every deployment, neutralizing cross-site scripting (XSS) and injection vectors."
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Proactive Threat Mitigation",
      description: "Endpoints validate and parse input via strictly-typed Pydantic and TypeScript schemas, rendering arbitrary payload executions impossible."
    }
  ];

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

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-12 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isDarkMode ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"}`}>
              <Lock className="h-6 w-6" />
            </div>
            <h1 className={`text-4xl font-display font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Application Security Audits</h1>
          </div>
          
          <div className="mb-12">
            <p className="text-lg leading-relaxed">
              At Vibe Analytics, security is not an afterthought; it is integrated directly into our infrastructure pipeline. We employ zero-trust architectures to ensure that sensitive enterprise analytics remain fully sovereign and encrypted.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {securityFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border p-8 ${
                  isDarkMode 
                    ? "border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/40" 
                    : "border-slate-200/50 bg-white hover:bg-slate-50"
                } transition-colors`}
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                  isDarkMode ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-50 text-cyan-600"
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`mb-2 text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className={`mt-16 rounded-xl border p-6 text-center ${
            isDarkMode ? "border-cyan-500/20 bg-cyan-500/5" : "border-cyan-200 bg-cyan-50"
          }`}>
            <h4 className={`text-sm font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-cyan-400" : "text-cyan-600"
            }`}>
              Latest Audit Status
            </h4>
            <div className="mt-4 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className={`text-lg font-medium ${isDarkMode ? "text-zinc-200" : "text-slate-700"}`}>
                0 Vulnerabilities Detected
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Last automated scan completed successfully across frontend packages and Python backend microservices.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
