"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  FileSpreadsheet, 
  BrainCircuit, 
  Zap, 
  FolderLock, 
  BarChart3, 
  Bot, 
  Check, 
  HelpCircle,
  Activity,
  ChevronDown,
  Sun,
  Moon,
  Lock,
  DollarSign,
  Clock,
  Award,
  RefreshCw,
  Eye,
  Trash2,
  ListFilter
} from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [dashboardTab, setDashboardTab] = useState<string>("Revenue");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai", text: string, data?: any }>>([
    { sender: "ai", text: "Welcome to Vibe Analytics. I've securely parsed your SaaS database. Ask me any business intelligence questions or choose a quick prompt below." }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Tabular Ingest Simulator state
  const [rawView, setRawView] = useState<boolean>(true);
  const [cleaningActive, setCleaningActive] = useState<boolean>(false);
  const [rawRows, setRawRows] = useState([
    { date: "2026-01", rev: "$12,000", churn: "2.4%", status: "Ok" },
    { date: "2026-02", rev: "Null", churn: "2.8%", status: "Missing Val" },
    { date: "2026-02", rev: "$14,500", churn: "2.8%", status: "Duplicate Row" },
    { date: "2026-03", rev: "$18,200", churn: "12.4%", status: "Anomaly Outlier" }
  ]);
  const [cleanedRows, setCleanedRows] = useState([
    { date: "2026-01", rev: "$12,000", churn: "2.4%", status: "Sanitized" },
    { date: "2026-02", rev: "$13,250", churn: "2.8%", status: "Imputed Median" },
    { date: "2026-03", rev: "$18,200", churn: "2.5%", status: "Outlier Capped" }
  ]);

  // Interactive ROI Calculator State
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000);

  const quickPrompts = [
    "Analyze Customer Churn Risk",
    "Identify EU Revenue Anomaly",
    "Optimize E-commerce Basket Size"
  ];

  const handleQuickPromptClick = (prompt: string) => {
    const nextHistory = [...chatHistory, { sender: "user" as const, text: prompt }];
    setChatHistory(nextHistory);
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      let aiData = null;

      if (prompt.includes("Churn")) {
        aiResponse = "I've run a customer churn correlation audit. We identified 18 high-risk accounts in Tier-2 corporate segments with over 30 days of inactivity. Immediate action proposed: trigger automated re-engagement workflows via n8n.";
        aiData = {
          riskCount: 18,
          potentialLoss: "$12,400/mo",
          actionTrigger: "n8n segment_reengage"
        };
      } else if (prompt.includes("Anomaly")) {
        aiResponse = "Anomaly detected: EU sales segments recorded a +24.8% growth spike on Thursdays between 6 PM and 9 PM. This correlates strongly with our newly launched referral campaign. I suggest scaling server allocations to prevent latency spikes.";
        aiData = {
          anomalySpike: "+24.8%",
          confidence: "98.4%",
          trafficClass: "EU Segment"
        };
      } else {
        aiResponse = "Cart abandonment audit completed. E-commerce metrics reveal a 68.4% cart abandonment rate. Proposal: cross-sell checkout bundles for 'Technical Accessories' to capture an estimated $8,200 in recovered sales.";
        aiData = {
          abandonmentRate: "68.4%",
          recoveryPotential: "$8,200",
          bundleOption: "Tech Packs"
        };
      }

      setChatHistory([...nextHistory, { sender: "ai" as const, text: aiResponse, data: aiData }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCleanPipelineRun = () => {
    setCleaningActive(true);
    setTimeout(() => {
      setCleaningActive(false);
      setRawView(false);
    }, 1000);
  };

  const calculateROI = () => {
    const timeSaved = Math.round((monthlyRevenue / 1000) * 0.4 + 10);
    const recoveredLoss = Math.round(monthlyRevenue * 0.045);
    return { timeSaved, recoveredLoss };
  };

  const { timeSaved, recoveredLoss } = calculateROI();

  const faqs = [
    {
      q: "How does the platform secure my business data?",
      a: "Every upload is isolated via Row-Level Security (RLS) in Supabase and encrypted at rest using AES-256. Our backend contains active checks against Path Traversal, Zip Bombs, and malicious code injection."
    },
    {
      q: "Can I self-host the n8n automation pipelines?",
      a: "Yes. The platform provides full support for custom webhook endpoints, enabling you to integrate either with our hosted n8n platform or connect seamlessly to your own self-hosted n8n infrastructure."
    },
    {
      q: "What AI models are powering the recommendations engine?",
      a: "We natively integrate the Gemini 1.5 Pro API utilizing context caching, ensuring highly optimized context structures and minimal token wastage for complex datasets and tabular reasoning."
    },
    {
      q: "What is the difference between Pro and Premium ML plans?",
      a: "Pro unlocks standard AI insights, SQL generation, and chat tools. Premium ML activates predictive algorithms (XGBoost, Scikit-learn) for direct model fitting, anomaly alerts, and churn forecasting."
    }
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "VP of Growth, RetailFlow",
      quote: "Vibe Analytics caught a 14% cart leakage trend within 3 hours of setup. The automated n8n pipeline was live by that afternoon.",
      growth: "+14.2% Cart Recovery"
    },
    {
      name: "Elena Rostova",
      role: "CTO, SaaSGrow Inc.",
      quote: "The Gemini API grounding and context caching keeps our token usage minimal. Tabular insights are compiled directly and accurately.",
      growth: "80% AI Token Savings"
    },
    {
      name: "Sanjay Patel",
      role: "Head of Operations, FinStream",
      quote: "Zero trust controls are critical for our data. Row-Level Security and secure inputs filters gave our AppSec team complete peace of mind.",
      growth: "Zero Security Vulnerabilities"
    }
  ];

  const renderInteractiveChart = () => {
    const strokeColor = isDarkMode ? "#00f2fe" : "#4f46e5";
    const stopColor = isDarkMode ? "#00f2fe" : "#4f46e5";
    
    if (dashboardTab === "Revenue") {
      return (
        <svg className="w-full h-48 mt-4" viewBox="0 0 500 180">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={stopColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color)" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" />
          <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color)" strokeDasharray="4 4" />
          <path d="M 0 130 Q 80 50, 160 80 T 320 20 T 500 40 L 500 160 L 0 160 Z" fill="url(#chartGlow)" />
          <path d="M 0 130 Q 80 50, 160 80 T 320 20 T 500 40" fill="none" stroke={strokeColor} strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]" />
          <circle cx="160" cy="80" r="5" fill={strokeColor} className="animate-pulse" />
          <circle cx="320" cy="20" r="5" fill={strokeColor} className="animate-pulse" />
        </svg>
      );
    }
    if (dashboardTab === "Users") {
      return (
        <svg className="w-full h-48 mt-4" viewBox="0 0 500 180">
          <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color)" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" />
          <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color)" strokeDasharray="4 4" />
          <rect x="30" y="80" width="30" height="80" rx="4" fill="#b224ef" opacity="0.8" />
          <rect x="110" y="50" width="30" height="110" rx="4" fill={strokeColor} opacity="0.8" />
          <rect x="190" y="100" width="30" height="60" rx="4" fill="#b224ef" opacity="0.8" />
          <rect x="270" y="30" width="30" height="130" rx="4" fill={strokeColor} className="drop-shadow-[0_0_6px_rgba(0,242,254,0.4)]" />
          <rect x="350" y="70" width="30" height="90" rx="4" fill="#4facfe" opacity="0.8" />
          <rect x="430" y="40" width="30" height="120" rx="4" fill="#b224ef" opacity="0.8" />
        </svg>
      );
    }
    return (
      <svg className="w-full h-48 mt-4" viewBox="0 0 500 180">
        <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color)" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" />
        <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color)" strokeDasharray="4 4" />
        <path d="M 0 130 L 100 130 L 100 90 L 250 90 L 250 40 L 400 40 L 400 110 L 500 110" fill="none" stroke="#ff0844" strokeWidth="2.5" />
        <circle cx="250" cy="40" r="4.5" fill="#ff0844" />
      </svg>
    );
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${isDarkMode ? "theme-dark bg-[#05070f] text-zinc-100" : "bg-[#f8fafc] text-slate-800"}`}>
      
      {/* Background grids */}
      <div className="absolute top-0 w-full h-[600px] bg-grid-glow opacity-30 z-0 pointer-events-none" />
      <div className="absolute top-[-200px] left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full glow-blur animate-glow z-0 pointer-events-none" />

      {/* Header Floating Navbar */}
      <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors ${isDarkMode ? "border-zinc-800/40 bg-[#05070f]/75" : "border-slate-200/80 bg-white/75"}`}>
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className={`font-display font-bold text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Vibe Analytics
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#dashboard" className="hover:text-cyan-500 transition-colors">Platform Hub</a>
            <a href="#cleaner-simulator" className="hover:text-cyan-500 transition-colors">Data Ingestion</a>
            <a href="#calculator" className="hover:text-cyan-500 transition-colors">ROI Calculator</a>
            <a href="#features" className="hover:text-cyan-500 transition-colors">AppSec Controls</a>
            <a href="#testimonials" className="hover:text-cyan-500 transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900/60 text-yellow-400" : "border-slate-200 bg-white text-slate-700 shadow-sm"
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <Link 
              href="/login"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <Lock className="h-3.5 w-3.5" /> Client Sign-in
            </Link>

            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 px-4 py-1.5 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md shadow-cyan-500/10"
            >
              Control Tower <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-8 text-center sm:px-8 z-10">
        <div className="mx-auto max-w-3xl">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
            isDarkMode ? "bg-zinc-900/60 border border-zinc-800/80 text-zinc-300" : "bg-slate-200/50 border border-slate-300/40 text-slate-700"
          }`}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Premium Decoupled Clean Architecture
          </div>

          <h1 className={`font-display font-extrabold text-5xl leading-[1.08] tracking-tight sm:text-6xl ${
            isDarkMode 
            ? "text-white bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent" 
            : "text-slate-900"
          }`}>
            Secure Asynchronous Business Intelligence & Analytics
          </h1>

          <p className={`mt-6 text-lg leading-relaxed max-w-2xl mx-auto ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
            Transform structured tabular data files into predictive recommendations, automated cleaning pipelines, and real-time interactive business dashboards.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 px-6 py-3 rounded-lg font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/15"
            >
              Enter Sandbox Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* TRUST BADGE ROW */}
        <div className="mt-16 mx-auto max-w-4xl text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Trusted by Growth Leaders</div>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:opacity-60 transition-opacity">
            <span className="font-display font-bold text-lg">STRIPE</span>
            <span className="font-display font-bold text-lg">VERCEL</span>
            <span className="font-display font-bold text-lg">LINEAR</span>
            <span className="font-display font-bold text-lg">NOTION</span>
            <span className="font-display font-bold text-lg">RETOOL</span>
          </div>
        </div>

        {/* INTERACTIVE DASHBOARD SECTION */}
        <div id="dashboard" className="mt-20 mx-auto max-w-5xl">
          
          <div className={`rounded-2xl border overflow-hidden shadow-2xl relative transition-all ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200"
          }`}>
            {/* Top Bar Decorative Flow */}
            <div className="h-[2px] w-full animate-stream" />

            <div className={`p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDarkMode ? "border-zinc-800/50 bg-zinc-950/20" : "border-slate-100 bg-slate-50/50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className={`text-xs font-mono tracking-widest uppercase ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>Live Analytical Environment</span>
              </div>
              
              {/* Tab options */}
              <div className={`flex items-center rounded-lg p-0.5 border ${isDarkMode ? "bg-zinc-900/80 border-zinc-800/80" : "bg-slate-100 border-slate-200"}`}>
                <button 
                  onClick={() => setDashboardTab("Revenue")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    dashboardTab === "Revenue" ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/10" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Revenue Growth
                </button>
                <button 
                  onClick={() => setDashboardTab("Users")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    dashboardTab === "Users" ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/10" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  User Retention
                </button>
                <button 
                  onClick={() => setDashboardTab("Latency")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    dashboardTab === "Latency" ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/10" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  System Load
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Visual Dashboard */}
              <div className={`lg:col-span-7 p-6 flex flex-col justify-between ${isDarkMode ? "border-r border-zinc-800/50" : "border-r border-slate-100 bg-white"}`}>
                <div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`border p-4 rounded-xl transition-all ${
                      isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-slate-50/50 border-slate-150"
                    }`}>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ARR Forecast</span>
                      <div className={`text-xl font-extrabold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>$428K</div>
                      <div className="text-[10px] text-emerald-500 mt-1 flex items-center gap-0.5 font-bold">
                        <TrendingUp className="h-3 w-3" /> +18.4%
                      </div>
                    </div>
                    <div className={`border p-4 rounded-xl transition-all ${
                      isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-slate-50/50 border-slate-150"
                    }`}>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Churn Probability</span>
                      <div className={`text-xl font-extrabold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>2.4%</div>
                      <div className="text-[10px] text-cyan-500 mt-1 flex items-center gap-0.5 font-bold">
                        <ShieldCheck className="h-3 w-3" /> Secure
                      </div>
                    </div>
                    <div className={`border p-4 rounded-xl transition-all ${
                      isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-slate-50/50 border-slate-150"
                    }`}>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Anomalies</span>
                      <div className={`text-xl font-extrabold mt-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>0</div>
                      <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-0.5">
                        <Activity className="h-3 w-3" /> Stable
                      </div>
                    </div>
                  </div>

                  {/* Render Visual Chart spline */}
                  {renderInteractiveChart()}
                </div>

                <div className={`border-t pt-4 mt-6 flex items-center justify-between text-[11px] ${
                  isDarkMode ? "border-zinc-800/50 text-zinc-500" : "border-slate-100 text-slate-400"
                }`}>
                  <span>Data grounding: 100% verified</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Real-time processing active</span>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Grounding chat interface */}
              <div className={`lg:col-span-5 p-6 flex flex-col justify-between min-h-[380px] ${
                isDarkMode ? "bg-zinc-950/20" : "bg-slate-50/20"
              }`}>
                
                {/* Chat header */}
                <div className={`flex items-center justify-between border-b pb-3 mb-4 ${
                  isDarkMode ? "border-zinc-800/50" : "border-slate-100"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-xs font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-950"}`}>Gemini Analytics Assistant</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isDarkMode ? "text-zinc-500 bg-zinc-900 border-zinc-800/60" : "text-slate-500 bg-slate-100 border-slate-200"
                  }`}>Grounded Mode</span>
                </div>

                {/* Chat window messages */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[220px] text-xs scrollbar-thin">
                  {chatHistory.map((chat, idx) => (
                    <div key={idx} className={`flex flex-col ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                      <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                        chat.sender === "user" 
                        ? "bg-cyan-500 text-zinc-950 font-semibold shadow-sm" 
                        : isDarkMode ? "bg-zinc-900/60 border border-zinc-800/60 text-zinc-300" : "bg-white border border-slate-200 text-slate-700 shadow-sm"
                      }`}>
                        {chat.text}
                      </div>
                      
                      {/* Optional metadata block for AI outputs */}
                      {chat.data && (
                        <div className={`mt-2 w-[85%] p-3 rounded-lg border text-[10px] font-mono grid grid-cols-2 gap-2 ${
                          isDarkMode ? "bg-[#05070f] border-zinc-800/80 text-zinc-400" : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}>
                          {Object.entries(chat.data).map(([k, v]) => (
                            <div key={k}>
                              <span className="text-zinc-500 block capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                              <span className="text-cyan-600 font-semibold">{v as string}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-zinc-500 p-2">
                      <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>

                {/* Quick Prompts list */}
                <div className={`mt-4 border-t pt-4 ${isDarkMode ? "border-zinc-800/40" : "border-slate-100"}`}>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-bold">Quick Insights Audit</div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((p, i) => (
                      <button 
                        key={i}
                        onClick={() => handleQuickPromptClick(p)}
                        className={`px-2.5 py-1.5 rounded-md border text-[10px] font-medium transition-colors text-left ${
                          isDarkMode 
                          ? "border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 text-zinc-400 hover:text-white" 
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* MOCK DATA CLEAN PREVIEW WIDGET - "Add some detail to attract user" */}
        <div id="cleaner-simulator" className="mt-28 border-t border-zinc-900/40 pt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Sanitize & Parse Datasets Instantly
            </h2>
            <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
              Experience our asynchronous clean engine. Click the button below to automatically purge duplicate indices and impute missing cells.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl flex flex-col gap-6 relative overflow-hidden ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}>
            {cleaningActive && (
              <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin mb-4" />
                <div className="text-sm font-semibold text-white">Running outlier filters & duplicates purge...</div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-zinc-850/80 pb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">
                {rawView ? "RAW INGEST DATA PREVIEW" : "CLEANED ANALYTICAL SCHEMA"}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCleanPipelineRun}
                  disabled={!rawView}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    rawView 
                    ? "bg-cyan-500 hover:bg-cyan-600 text-zinc-950 shadow-md shadow-cyan-500/10"
                    : "bg-zinc-800/40 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" /> Execute Clean Audit Pipeline
                </button>

                {!rawView && (
                  <button 
                    onClick={() => setRawView(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      isDarkMode ? "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white" : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    Reset View
                  </button>
                )}
              </div>
            </div>

            {/* Ingest Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-850 text-zinc-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Arr Revenue</th>
                    <th className="py-3 px-4">Gross Churn</th>
                    <th className="py-3 px-4">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/60 font-medium">
                  {rawView ? (
                    rawRows.map((r, i) => (
                      <tr key={i} className={`hover:bg-zinc-900/20 ${r.status !== "Ok" ? "text-amber-500 bg-amber-500/5" : ""}`}>
                        <td className="py-3.5 px-4">{r.date}</td>
                        <td className="py-3.5 px-4">{r.rev}</td>
                        <td className="py-3.5 px-4">{r.churn}</td>
                        <td className="py-3.5 px-4 font-mono font-bold">{r.status}</td>
                      </tr>
                    ))
                  ) : (
                    cleanedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-900/20 text-emerald-400 bg-emerald-500/5">
                        <td className="py-3.5 px-4">{r.date}</td>
                        <td className="py-3.5 px-4">{r.rev}</td>
                        <td className="py-3.5 px-4">{r.churn}</td>
                        <td className="py-3.5 px-4 font-mono font-bold flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5" /> {r.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-zinc-500 leading-relaxed border-t border-zinc-850/40 pt-4 flex gap-2">
              <Award className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              {rawView 
                ? "This raw dataset is flagged with 3 anomalies: missing cells, duplicate record indexes, and out-of-bounds metrics."
                : "Auditing complete: Duplicate indexes successfully dropped. Missing data imputed using statistical median algorithms."
              }
            </div>
          </div>
        </div>

        {/* INTERACTIVE ROI CALCULATOR */}
        <div id="calculator" className="mt-28 border-t border-zinc-900/40 pt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Calculate Your Business ROI
            </h2>
            <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
              Drag the slider to match your current monthly revenue and see estimated growth recovered using our automated AI controls.
            </p>
          </div>

          <div className={`p-8 border rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}>
            {/* Slider Column */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">Monthly Business Revenue</label>
                <div className="flex justify-between items-center">
                  <span className={`text-2xl font-extrabold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    ${monthlyRevenue.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-cyan-500">Scale Slider</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="500000" 
                  step="5000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer mt-4 accent-cyan-500"
                />
              </div>

              <div className="text-xs text-zinc-500 leading-relaxed border-t border-zinc-800/40 pt-4 flex gap-2">
                <Award className="h-4.5 w-4.5 text-cyan-500 flex-shrink-0" />
                Calculated based on standard benchmark indicators: 4.5% churn leakage recovery and 10 hours/mo saved in administrative data cleaning pipelines.
              </div>
            </div>

            {/* Calculations Column */}
            <div className="md:col-span-5 grid grid-cols-1 gap-4">
              <div className="p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Estimated Recovery / mo</div>
                  <div className="text-xl font-extrabold text-cyan-500 mt-0.5">${recoveredLoss.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Data Clean Time Saved</div>
                  <div className="text-xl font-extrabold text-purple-400 mt-0.5">{timeSaved} Hours / mo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div id="features" className="mt-28 border-t border-zinc-900/40 pt-20">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Clean Architecture. Zero Trust Security.
            </h2>
            <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
              Our engineering foundation maps against 63 distinct AppSec validations to ensure absolute data isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            <div className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}>
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 mb-6">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Automated Clean & Parse</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Asynchronously removes duplicates, corrects datatypes, cleans outlier gaps, and intercepts suspicious MIME payloads before storage updates.
              </p>
            </div>

            <div className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}>
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-6">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Interactive EDA Pipelines</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Generate highly fluid distributions, correlations, scatter systems, and heatmaps structured inside reactive client-side dashboard panels.
              </p>
            </div>

            <div className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}>
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 mb-6">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Asynchronous ML Forecasting</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Unlock robust predictive model configurations (XGBoost, Scikit-learn) calculating customer expansion rates and future churn windows.
              </p>
            </div>

          </div>
        </div>

        {/* TESTIMONIALS SECTION */}
        <div id="testimonials" className="mt-28 border-t border-zinc-900/40 pt-20">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Proven Growth Outcomes
            </h2>
            <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
              Read how SaaS developers and growth leaders utilize our asynchronous pipelines to catch leakages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {testimonials.map((t, idx) => (
              <div key={idx} className={`border p-6 rounded-2xl flex flex-col justify-between transition-all ${
                isDarkMode ? "bg-zinc-900/30 border-zinc-800/50" : "bg-white border-slate-150 shadow-sm"
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-cyan-500 bg-cyan-500/5 border border-cyan-500/15 px-2 py-0.5 rounded font-bold">
                      {t.growth}
                    </span>
                    <span className="text-amber-500 text-xs">★★★★★</span>
                  </div>
                  <p className={`text-sm italic leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-slate-650"}`}>
                    "{t.quote}"
                  </p>
                </div>
                
                <div className="mt-6 border-t border-zinc-800/40 pt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-cyan-500">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* FAQs */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${isDarkMode ? "bg-zinc-900/30 border-zinc-800/50" : "bg-white border-slate-200"}`}>
              <button 
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-cyan-500/5 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm">
                  <HelpCircle className="h-4.5 w-4.5 text-cyan-500 flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${activeFAQ === idx ? "rotate-180" : ""}`} />
              </button>
              {activeFAQ === idx && (
                <div className={`px-5 pb-5 pt-1 text-sm border-t leading-relaxed ${isDarkMode ? "text-zinc-400 border-zinc-800/30" : "text-slate-650 border-slate-100"}`}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 text-[10px] text-zinc-500 transition-colors ${isDarkMode ? "border-zinc-900/60 bg-[#02040a]" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 flex items-center justify-center rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <span className="font-display font-bold text-sm">Vibe Analytics</span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">AppSec Audits</a>
          </div>

          <div>
            © {new Date().getFullYear()} Vibe Analytics SaaS Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
