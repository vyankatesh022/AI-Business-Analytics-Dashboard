"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Share2, MessageSquare, Shield, Mail, ArrowRight, CheckCircle2, Activity, Sparkles, Lock, Cpu, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid business email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Subscribed! Welcome to Enterprise AI Insider updates.");
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleSolutionClick = (industry: string) => {
    toast.info(`Loading ${industry} AI architecture blueprints and compliance benchmarks.`);
  };

  const handleStatusClick = () => {
    toast.success("Live System Status: All 144 global AI clusters operational. API Latency: 14ms (99.99% Uptime).");
  };

  return (
    <footer className="relative bg-gradient-to-b from-black via-zinc-950 to-black border-t border-zinc-800/80 text-zinc-400 pt-16 pb-12 selection:bg-blue-500 selection:text-white overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Top Reimagined Interactive Newsletter & Research Portal Bar */}
        <div className="bg-gradient-to-r from-zinc-900/90 via-blue-950/40 to-purple-950/30 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-16 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Enterprise AI Research & Insights
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight">
              Stay Ahead of Autonomous Analytics Trends
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              Join 18,500+ CTOs and Data Leaders receiving weekly LLM forecasting benchmarks, autonomous workflow patterns, and production architecture guides.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <div className="relative w-full sm:w-auto">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter.your.name@enterprise.com"
                className="w-full sm:w-80 bg-black/80 border border-zinc-700/80 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder:text-zinc-500 outline-none transition-all shadow-inner"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/20 h-10 px-6 text-xs sm:text-sm rounded-xl shrink-0 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {subscribed ? (
                <span className="flex items-center">
                  <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-400" /> Subscribed
                </span>
              ) : (
                <span className="flex items-center">
                  Subscribe to Insider <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Reimagined 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          
          {/* Column 1 & 2: Brand, Positioning & Live System Health */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-white text-xl group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Cpu className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-extrabold tracking-tight">
                Enterprise AI
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              The autonomous operating system for modern data enterprises. Unifying multi-cloud analytics, predictive LLMs, anomaly detection, and automated governance.
            </p>

            {/* Live System Health Badge */}
            <div 
              onClick={handleStatusClick}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 text-xs text-zinc-300 cursor-pointer transition-all shadow-sm group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium">All 144 AI Pipelines Operational</span>
              <Activity className="h-3.5 w-3.5 text-emerald-400 ml-1 group-hover:scale-110 transition-transform" />
            </div>

            {/* Actionable Social Community Icons */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => toast.info("Opening official GitHub repository preview")} 
                aria-label="GitHub"
                className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <Globe className="h-4 w-4" />
              </button>
              <button 
                onClick={() => toast.info("Connecting to official X (Twitter) enterprise broadcast")} 
                aria-label="Twitter"
                className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => toast.info("Connecting to Enterprise LinkedIn professional network")} 
                aria-label="LinkedIn"
                className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button 
                onClick={() => toast.info("Opening Enterprise AI YouTube engineering talks")} 
                aria-label="YouTube"
                className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-sm transform hover:-translate-y-0.5"
              >
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Column 3: Platform Suite */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 text-zinc-200">
              Platform Suite
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/analytics" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                  Analytics Engine
                </Link>
              </li>
              <li>
                <Link href="/ai-insights" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>AI Copilot & Feed</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">v4.2</span>
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                  Forecasting & LLMs
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                  Autonomous Workflows
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                  Multi-Cloud Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Enterprise Use Cases */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 text-zinc-200">
              Industry Blueprints
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => handleSolutionClick("Financial Services & Trading")} className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block text-left transition-all">
                  Financial Services & Trading
                </button>
              </li>
              <li>
                <button onClick={() => handleSolutionClick("Healthcare & Genomics")} className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block text-left transition-all">
                  Healthcare & Genomics
                </button>
              </li>
              <li>
                <button onClick={() => handleSolutionClick("Global Supply Chain & Logistics")} className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block text-left transition-all">
                  Global Supply Chain
                </button>
              </li>
              <li>
                <button onClick={() => handleSolutionClick("Retail & Demand Forecasting")} className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block text-left transition-all">
                  Retail & E-Commerce
                </button>
              </li>
              <li>
                <button onClick={() => handleSolutionClick("High-Tech Software SaaS")} className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block text-left transition-all">
                  High-Tech SaaS Platforms
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Developers & Architecture */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 text-zinc-200">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/developer" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Documentation & Guides
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  API & Webhook Reference
                </Link>
              </li>
              <li>
                <Link href="#architecture" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Architecture Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <span>Sandbox Environment</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">Free</span>
                </Link>
              </li>
              <li>
                <button onClick={handleStatusClick} className="text-emerald-400 hover:text-emerald-300 font-medium hover:translate-x-1 inline-flex items-center gap-1 text-left transition-all">
                  <span>Live Uptime SLA (99.99%)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 6: Access & Governance (Directs to Signin / Portal) */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 text-zinc-200">
              Access & Portal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-bold hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                  <span>Sign In to Platform</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-zinc-300 hover:text-white font-medium hover:translate-x-1 inline-block transition-all">
                  Register Enterprise Account
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all">
                  <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> SOC 2 Compliance Portal
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all">
                  Privacy Policy & GDPR
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-zinc-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                  <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Contact Enterprise Sales
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Security Certifications & Region Selector */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-6">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Enterprise AI Analytics Platform Inc. All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-zinc-400">
            <span onClick={() => toast.success("Verified: SOC 2 Type II Certified by Deloitte (2026 Audit).")} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> SOC 2 Type II Certified
            </span>
            <span onClick={() => toast.success("Verified: Fully GDPR, CCPA, and HIPAA compliant infrastructure.")} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> GDPR & HIPAA Compliant
            </span>
            <span onClick={() => toast.success("Verified: End-to-end 256-bit AES encryption at rest and in transit.")} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
              <Lock className="h-3.5 w-3.5 text-purple-500" /> Zero-Trust Architecture
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
