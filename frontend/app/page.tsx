"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  Send,
  UploadCloud,
  FileText,
  AlertTriangle,
  Play,
  Pause
} from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [dashboardTab, setDashboardTab] = useState<string>("Revenue");
  
  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [carouselPlaying, setCarouselPlaying] = useState<boolean>(true);

  // Carousel auto-rotation timer
  useEffect(() => {
    if (!carouselPlaying) return;
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselPlaying]);

  // Interactive Chat State
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai", text: string, data?: any }>>([
    { sender: "ai", text: "Welcome to Vibe Analytics. I've securely parsed your SaaS database. Ask me any business intelligence questions or choose a quick prompt below." }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Tabular Ingest Simulator state
  const [rawView, setRawView] = useState<boolean>(true);
  const [cleaningActive, setCleaningActive] = useState<boolean>(false);
  const [ingestFileStaged, setIngestFileStaged] = useState<boolean>(false);
  const [ingestProgress, setIngestProgress] = useState<number>(0);
  const [stagedFileName, setStagedFileName] = useState<string>("");

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
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(120000);

  const quickPrompts = [
    "Analyze Customer Churn Risk",
    "Identify EU Revenue Anomaly",
    "Optimize E-commerce Basket Size"
  ];

  // Smart keyword-based AI responder
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const nextHistory = [...chatHistory, { sender: "user" as const, text: userText }];
    setChatHistory(nextHistory);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      let aiData = null;
      const cleanText = userText.toLowerCase();

      if (cleanText.includes("churn") || cleanText.includes("retention")) {
        aiResponse = "I've run a customer churn correlation audit. We identified 18 high-risk accounts in Tier-2 corporate segments with over 30 days of inactivity. Immediate action proposed: trigger automated re-engagement workflows via n8n.";
        aiData = {
          riskCount: 18,
          potentialLoss: `$${Math.round(monthlyRevenue * 0.025).toLocaleString()}/mo`,
          actionTrigger: "n8n segment_reengage"
        };
      } else if (cleanText.includes("anomaly") || cleanText.includes("outlier") || cleanText.includes("spike")) {
        aiResponse = "Anomaly detected: EU sales segments recorded a +24.8% growth spike on Thursdays between 6 PM and 9 PM. This correlates strongly with our newly launched referral campaign. I suggest scaling server allocations to prevent latency spikes.";
        aiData = {
          anomalySpike: "+24.8%",
          confidence: "98.4%",
          trafficClass: "EU Segment"
        };
      } else if (cleanText.includes("basket") || cleanText.includes("size") || cleanText.includes("checkout")) {
        aiResponse = "Cart abandonment audit completed. E-commerce metrics reveal a 68.4% cart abandonment rate. Proposal: cross-sell checkout bundles for 'Technical Accessories' to capture an estimated recovery.";
        aiData = {
          abandonmentRate: "68.4%",
          recoveryPotential: `$${Math.round(monthlyRevenue * 0.045).toLocaleString()}`,
          bundleOption: "Tech Packs"
        };
      } else if (cleanText.includes("security") || cleanText.includes("isolated") || cleanText.includes("db")) {
        aiResponse = "Security audit pass: Row-Level Security (RLS) is actively enforced. Client datasets are parsed asynchronously in isolated processes. Path traversal filters intercepted zero warning events.";
        aiData = {
          securityLevel: "AES-256 RLS",
          vulnerabilities: "0",
          sslCert: "Active"
        };
      } else if (cleanText.includes("n8n") || cleanText.includes("pipeline") || cleanText.includes("webhook")) {
        aiResponse = "Platform automations: We detect active connection hooks to both hosted and self-hosted n8n configurations. Manual sync commands take average 48ms under full tenant load.";
        aiData = {
          webhookPing: "48ms",
          triggersActive: "3 Active",
          connector: "SAML SSO"
        };
      } else {
        aiResponse = `I have grounding rules active for your monthly revenue segment ($${monthlyRevenue.toLocaleString()}). Predictive ML forecasts indicate stable ARR trajectories over Q3. Let's scale automated webhook triggers to secure cart leakages.`;
        aiData = {
          monthlySegment: `$${monthlyRevenue.toLocaleString()}`,
          arrGrowthEst: "+14.2%",
          riskAssessment: "Low Risk"
        };
      }

      setChatHistory([...nextHistory, { sender: "ai" as const, text: aiResponse, data: aiData }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickPromptClick = (prompt: string) => {
    setChatInput(prompt);
  };

  // Mock Dropzone upload
  const triggerMockUpload = () => {
    setIngestFileStaged(true);
    setStagedFileName("Corporate_Transactions_May2026.csv");
    setRawView(true);
    setCleaningActive(false);
    setIngestProgress(0);
    
    const interval = setInterval(() => {
      setIngestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 120);
  };

  const handleCleanPipelineRun = () => {
    setCleaningActive(true);
    setTimeout(() => {
      setCleaningActive(false);
      setRawView(false);
    }, 1000);
  };

  const calculateROI = () => {
    const timeSaved = Math.round((monthlyRevenue / 1000) * 0.12 + 8);
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

  // Dynamic Chart SVG scaled reactively with the Monthly Revenue Slider
  const renderInteractiveChart = () => {
    const strokeColor = isDarkMode ? "#00f2fe" : "#4f46e5";
    const stopColor = isDarkMode ? "#00f2fe" : "#4f46e5";
    
    // Scale amplitude factor based on monthlyRevenue
    const scaleFactor = Math.min(1.8, Math.max(0.4, monthlyRevenue / 150000));
    const h1 = Math.round(130 - 80 * scaleFactor);
    const h2 = Math.round(130 - 50 * scaleFactor);
    const h3 = Math.round(130 - 110 * scaleFactor);
    const h4 = Math.round(130 - 90 * scaleFactor);
    
    if (dashboardTab === "Revenue") {
      return (
        <div className="relative animate-fadeIn">
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
            <path d={`M 0 130 Q 80 ${h1}, 160 ${h2} T 320 ${h3} T 500 ${h4} L 500 160 L 0 160 Z`} fill="url(#chartGlow)" className="transition-all duration-300" />
            <path d={`M 0 130 Q 80 ${h1}, 160 ${h2} T 320 ${h3} T 500 ${h4}`} fill="none" stroke={strokeColor} strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(0,242,254,0.3)] transition-all duration-300" />
            <circle cx="160" cy={h2} r="5" fill={strokeColor} className="animate-pulse transition-all duration-300" />
            <circle cx="320" cy={h3} r="5" fill={strokeColor} className="animate-pulse transition-all duration-300" />
          </svg>
          <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-400 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800 animate-pulse">
            Chart scales with ROI Monthly Revenue slider
          </div>
        </div>
      );
    }
    if (dashboardTab === "Users") {
      return (
        <svg className="w-full h-48 mt-4" viewBox="0 0 500 180">
          <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color)" strokeDasharray="4 4" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" />
          <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color)" strokeDasharray="4 4" />
          <rect x="30" y={h1} width="30" height={180 - h1} rx="4" fill="#b224ef" opacity="0.8" className="transition-all duration-300" />
          <rect x="110" y={h2} width="30" height={180 - h2} rx="4" fill={strokeColor} opacity="0.8" className="transition-all duration-300" />
          <rect x="190" y={h4} width="30" height={180 - h4} rx="4" fill="#b224ef" opacity="0.8" className="transition-all duration-300" />
          <rect x="270" y={h3} width="30" height={180 - h3} rx="4" fill={strokeColor} className="drop-shadow-[0_0_6px_rgba(0,242,254,0.4)] transition-all duration-300" />
          <rect x="350" y={h2} width="30" height={180 - h2} rx="4" fill="#4facfe" opacity="0.8" className="transition-all duration-300" />
          <rect x="430" y={h1} width="30" height={180 - h1} rx="4" fill="#b224ef" opacity="0.8" className="transition-all duration-300" />
        </svg>
      );
    }
    return (
      <svg className="w-full h-48 mt-4" viewBox="0 0 500 180">
        <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color)" strokeDasharray="4 4" />
        <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeDasharray="4 4" />
        <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border-color)" strokeDasharray="4 4" />
        <path d={`M 0 130 L 100 130 L 100 ${h2} L 250 ${h2} L 250 ${h3} L 400 ${h3} L 400 ${h4} L 500 ${h4}`} fill="none" stroke="#ff0844" strokeWidth="2.5" className="transition-all duration-300" />
        <circle cx="250" cy={h3} r="4.5" fill="#ff0844" className="transition-all duration-300" />
      </svg>
    );
  };

  // Entrance variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${isDarkMode ? "theme-dark bg-[#05070f] text-zinc-100" : "bg-[#f8fafc] text-slate-800"}`}>
      
      {/* Background grids and floating visual node connections */}
      <div className="absolute top-0 w-full h-[600px] bg-grid-glow opacity-30 z-0 pointer-events-none" />
      <div className="absolute top-[-200px] left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full glow-blur animate-glow z-0 pointer-events-none" />

      {/* Cyber animated node particles in hero background */}
      <div className="absolute top-20 right-10 w-96 h-96 z-0 opacity-20 pointer-events-none hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle cx="40" cy="50" r="3" fill="#00f2fe" className="animate-ping" />
          <circle cx="140" cy="40" r="3" fill="#b224ef" className="animate-ping" style={{ animationDelay: "1s" }} />
          <circle cx="90" cy="120" r="3" fill="#00f2fe" className="animate-pulse" />
          <line x1="40" y1="50" x2="90" y2="120" stroke="#00f2fe" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="140" y1="40" x2="90" y2="120" stroke="#b224ef" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Header Floating Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors ${isDarkMode ? "border-zinc-800/40 bg-[#05070f]/75" : "border-slate-200/80 bg-white/75"}`}
      >
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
      </motion.header>

      {/* Hero & Image Illustration Split Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 sm:px-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Synchronized Hero Text Carousel */}
        <div className="lg:col-span-7 text-left flex flex-col justify-center min-h-[380px]">
          <AnimatePresence mode="wait">
            {carouselIndex === 0 && (
              <motion.div
                key="left-slide-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 animate-fadeIn"
              >
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-zinc-900/60 border border-zinc-800/80 text-zinc-300" : "bg-slate-200/50 border border-slate-300/40 text-slate-700"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyan-500 animate-pulse" />
                  Decoupled Architecture • Live Telemetry
                </div>

                <h1
                  className={`font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight ${
                    isDarkMode 
                    ? "text-white bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent" 
                    : "text-slate-900"
                  }`}
                >
                  Scale ARR Spline & Telemetry Real-time
                </h1>

                <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${isDarkMode ? "text-zinc-400" : "text-slate-650"}`}>
                  Transform structured financial data files into predictive recommendations, automated cleaning pipelines, and real-time interactive business dashboards.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/15 text-center"
                  >
                    Enter Control Tower <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a 
                    href="#calculator" 
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm sm:text-base border transition-all ${
                      isDarkMode ? "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-750"
                    }`}
                  >
                    Assess ROI Savings
                  </a>
                </div>
              </motion.div>
            )}

            {carouselIndex === 1 && (
              <motion.div
                key="left-slide-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 animate-fadeIn"
              >
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-zinc-900/60 border border-zinc-800/80 text-zinc-300" : "bg-slate-200/50 border border-slate-300/40 text-slate-700"
                  }`}
                >
                  <Activity className="h-3.5 w-3.5 text-cyan-500 animate-pulse" />
                  Ingestion Pipelines • Auto-Sanitize
                </div>

                <h1
                  className={`font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight ${
                    isDarkMode 
                    ? "text-white bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent" 
                    : "text-slate-900"
                  }`}
                >
                  Asynchronous Ingest & Automated Clean
                </h1>

                <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${isDarkMode ? "text-zinc-400" : "text-slate-650"}`}>
                  Fit dataset schemas instantly. Trigger client-side outlier capping filters, drop duplicate index lists, and impute median null cell markers safely without background thread leakage.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a 
                    href="#cleaner-simulator" 
                    className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/15 text-center"
                  >
                    Simulate CSV Ingest <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link 
                    href="/dashboard"
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm sm:text-base border transition-all ${
                      isDarkMode ? "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-750"
                    }`}
                  >
                    View System Jobs
                  </Link>
                </div>
              </motion.div>
            )}

            {carouselIndex === 2 && (
              <motion.div
                key="left-slide-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 animate-fadeIn"
              >
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-zinc-900/60 border border-zinc-800/80 text-zinc-300" : "bg-slate-200/50 border border-slate-300/40 text-slate-700"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-500 animate-pulse" />
                  Enterprise SecOps • Zero-Trust Gateway
                </div>

                <h1
                  className={`font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight ${
                    isDarkMode 
                    ? "text-white bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent" 
                    : "text-slate-900"
                  }`}
                >
                  Decoupled Compliance With Row-Level Security
                </h1>

                <p className={`text-base sm:text-lg leading-relaxed max-w-xl ${isDarkMode ? "text-zinc-400" : "text-slate-650"}`}>
                  Govern team configurations seamlessly. Prevent directory path traversals, verify certificate signatures, and allocate fine-grained RBAC permission matrix states in real time.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link 
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-zinc-950 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/15 text-center"
                  >
                    Configure Access Matrix <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link 
                    href="/login"
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm sm:text-base border transition-all ${
                      isDarkMode ? "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-750"
                    }`}
                  >
                    Client Authentication
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Interactive Carousel UI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.3 }}
          className="lg:col-span-5 relative flex flex-col justify-center items-center w-full min-h-[420px]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/15 rounded-3xl glow-blur filter blur-2xl z-0 pointer-events-none" />
          
          <div className="relative w-full h-[360px] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl border border-zinc-850 bg-[#0d111d]/50 backdrop-blur-md p-4 transition-all duration-300 hover:border-cyan-500/40 z-10">
            <AnimatePresence mode="wait">
              {carouselIndex === 0 && (
                <motion.div
                  key="slide-0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/5 px-2 py-0.5 border border-cyan-500/15 rounded">Slide 1: Grounded Telemetry</span>
                    <span className="text-[9px] text-zinc-500">Live ARR Chart</span>
                  </div>
                  <div className="flex-1 relative flex items-center justify-center rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950/40">
                    <Image 
                      src="/hero_dashboard_illustration.png"
                      alt="Glow Data Analytics illustration"
                      width={480}
                      height={240}
                      priority
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-2.5">
                    Real-time business Arr forecast spline projections grounded using Gemini API context caching indicators.
                  </p>
                </motion.div>
              )}

              {carouselIndex === 1 && (
                <motion.div
                  key="slide-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/5 px-2 py-0.5 border border-cyan-500/15 rounded">Slide 2: Asynchronous Cleaning</span>
                    <span className="text-[9px] text-zinc-500">Active Ingest Terminal</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/80 font-mono text-[9px] leading-relaxed">
                    <div className="space-y-1 text-zinc-400">
                      <div><span className="text-cyan-500">&gt;&gt;</span> Ingesting dataset target file...</div>
                      <div><span className="text-cyan-500">&gt;&gt;</span> Running traversal audits... <span className="text-emerald-400">SECURE</span></div>
                      <div><span className="text-cyan-500">&gt;&gt;</span> Dropped 14 duplicate indices.</div>
                      <div><span className="text-cyan-500">&gt;&gt;</span> Imputed 6 missing median nulls.</div>
                      <div><span className="text-cyan-500">&gt;&gt;</span> Fitting ML forecasts... <span className="text-emerald-400 font-bold">SUCCESS</span></div>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850 mt-2">
                      <div className="h-full bg-cyan-400 animate-pulse" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-2.5">
                    Click execution triggers under Ingest simulator to see duplicate indices pruners and statistical median pruners run.
                  </p>
                </motion.div>
              )}

              {carouselIndex === 2 && (
                <motion.div
                  key="slide-2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center border-b border-zinc-850 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/5 px-2 py-0.5 border border-cyan-500/15 rounded">Slide 3: AppSec Governance</span>
                    <span className="text-[9px] text-zinc-500">Access Matrix</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center p-4 rounded-xl border border-zinc-900 bg-zinc-950/80 font-sans text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wide">
                      <ShieldCheck className="h-4.5 w-4.5" /> Zero Trust SecOps
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Every database transaction and API key credential check isolation is enforced via Supabase Row-Level Security parameters.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-zinc-850 font-mono text-[9px]">
                      <div className="p-1.5 bg-zinc-900 border border-zinc-850 rounded">
                        <span className="text-zinc-500 block">ENCRYPTION</span>
                        <span className="text-cyan-400 font-bold">AES-256 RLS</span>
                      </div>
                      <div className="p-1.5 bg-zinc-900 border border-zinc-850 rounded">
                        <span className="text-zinc-500 block">SECURITY</span>
                        <span className="text-emerald-455 font-bold">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-2.5">
                    Manage multi-tier permission matrix configurations and copy active credential keys in security viewports.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Carousel Navigation dots and arrows with Play/Pause button */}
          <div className="flex items-center gap-3.5 mt-4 z-10">
            <button 
              onClick={() => setCarouselIndex(prev => (prev - 1 + 3) % 3)}
              className="p-1.5 bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white rounded-lg hover:border-zinc-700 transition-colors text-xs cursor-pointer"
              title="Previous slide"
            >
              ◀
            </button>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(idx => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    carouselIndex === idx ? "w-4 bg-cyan-400" : "w-2 bg-zinc-800"
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCarouselIndex(prev => (prev + 1) % 3)}
              className="p-1.5 bg-zinc-900/60 border border-zinc-850 text-zinc-400 hover:text-white rounded-lg hover:border-zinc-700 transition-colors text-xs cursor-pointer"
              title="Next slide"
            >
              ▶
            </button>
            
            <div className="h-4 w-[1px] bg-zinc-800 mx-0.5" />
            
            <button
              onClick={() => setCarouselPlaying(!carouselPlaying)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                carouselPlaying 
                ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20" 
                : "bg-zinc-900/60 border-zinc-850 text-zinc-400 hover:text-white"
              }`}
              title={carouselPlaying ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
            >
              {carouselPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
          </div>

        </motion.div>

      </section>



      {/* INTERACTIVE DASHBOARD SECTION */}
      <section id="dashboard" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10">
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className={`rounded-2xl border overflow-hidden shadow-2xl relative transition-all ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200"
          }`}
        >
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
              {["Revenue", "Users", "Latency"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setDashboardTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    dashboardTab === tab ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/10" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab === "Revenue" ? "Revenue Growth" : tab === "Users" ? "User Retention" : "System Load"}
                </button>
              ))}
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
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[200px] text-xs scrollbar-thin">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                      chat.sender === "user" 
                      ? "bg-cyan-500 text-zinc-950 font-semibold shadow-sm animate-fadeIn" 
                      : isDarkMode ? "bg-zinc-900/60 border border-zinc-800/60 text-zinc-300 animate-fadeIn" : "bg-white border border-slate-200 text-slate-700 shadow-sm animate-fadeIn"
                    }`}>
                      {chat.text}
                    </div>
                    
                    {/* Optional metadata block for AI outputs */}
                    {chat.data && (
                      <div className={`mt-2 w-[85%] p-3 rounded-lg border text-[10px] font-mono grid grid-cols-2 gap-2 animate-fadeIn ${
                        isDarkMode ? "bg-[#05070f] border-zinc-800/80 text-zinc-400" : "bg-slate-100 border-slate-200 text-slate-650"
                      }`}>
                        {Object.entries(chat.data).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-zinc-500 block capitalize text-[9px]">{k.replace(/([A-Z])/g, " $1")}</span>
                            <span className="text-cyan-600 font-semibold">{v as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Prompts list */}
              <div className={`mt-4 border-t pt-3 ${isDarkMode ? "border-zinc-800/40" : "border-slate-100"}`}>
                <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2 font-bold">Quick Insights Audit</div>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p, i) => (
                    <button 
                      key={i}
                      onClick={() => handleQuickPromptClick(p)}
                      className={`px-2 py-1 rounded border text-[9px] font-medium transition-colors text-left ${
                        isDarkMode 
                        ? "border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 text-zinc-400 hover:text-white" 
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-650 hover:text-slate-900 shadow-sm"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input form bar (Fully operational AI handler) */}
              <form onSubmit={handleChatSubmit} className="mt-3 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask Gemini analytics question (e.g. security, n8n)..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-0 ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800 text-white focus:border-cyan-500" : "bg-white border-slate-250 text-slate-900 focus:border-indigo-500"
                  }`}
                />
                <button 
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-zinc-950 font-bold text-xs flex items-center justify-center hover:bg-cyan-600"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

            </div>

          </div>
        </motion.div>
      </section>

      {/* MOCK DATA CLEAN PREVIEW WIDGET */}
      <section id="cleaner-simulator" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10 border-t border-zinc-900/40">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Sanitize & Parse Datasets Instantly
          </h2>
          <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
            Experience our asynchronous clean engine. Click the dropzone to stage a mock corporate CSV template and trigger pipeline filters.
          </p>
        </div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className={`p-6 border rounded-2xl flex flex-col gap-6 relative overflow-hidden ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
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
                disabled={!rawView || !ingestFileStaged || ingestProgress < 100}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rawView && ingestFileStaged && ingestProgress === 100
                  ? "bg-cyan-500 hover:bg-cyan-600 text-zinc-950 shadow-md shadow-cyan-500/10"
                  : "bg-zinc-800/40 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                <Activity className="h-3.5 w-3.5" /> Execute Clean Audit Pipeline
              </button>

              {!rawView && (
                <button 
                  onClick={() => { setRawView(true); setIngestFileStaged(false); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    isDarkMode ? "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white" : "border-slate-200 bg-white text-slate-650"
                  }`}
                >
                  Reset View
                </button>
              )}
            </div>
          </div>

          {/* Interactive dropzone or progress bar */}
          {!ingestFileStaged ? (
            <button 
              onClick={triggerMockUpload}
              className={`border-2 border-dashed rounded-xl p-10 text-center hover:border-cyan-500/50 transition-colors ${
                isDarkMode ? "border-zinc-850 bg-zinc-900/20" : "border-slate-200 bg-slate-50/50"
              }`}
            >
              <UploadCloud className="h-10 w-10 text-zinc-500 mx-auto mb-4" />
              <div className="text-sm font-semibold text-zinc-400">Click here to stage "Corporate_Transactions_May2026.csv"</div>
              <div className="text-[10px] text-zinc-650 mt-1">Simulates uploading an uncleaned client financial table</div>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-cyan-500/5 border border-cyan-500/15 rounded flex items-center justify-between text-xs text-zinc-300">
                <span className="font-semibold flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-cyan-450" /> {stagedFileName}</span>
                <span className="text-[9px] uppercase font-bold text-cyan-400">{ingestProgress < 100 ? `Staging ${ingestProgress}%` : "Staged"}</span>
              </div>
              {ingestProgress < 100 && (
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                  <div className="h-full bg-cyan-400 transition-all duration-150" style={{ width: `${ingestProgress}%` }} />
                </div>
              )}
            </div>
          )}

          {/* Ingest Table View */}
          {ingestFileStaged && ingestProgress === 100 && (
            <div className="overflow-x-auto animate-fadeIn">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-850 text-zinc-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Arr Revenue</th>
                    <th className="py-3 px-4">Gross Churn</th>
                    <th className="py-3 px-4">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850/60 font-medium text-zinc-300">
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
                      <tr key={i} className="hover:bg-zinc-900/20 text-emerald-400 bg-emerald-500/5 animate-fadeIn">
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
          )}

          <div className="text-[10px] text-zinc-500 leading-relaxed border-t border-zinc-850/40 pt-4 flex gap-2">
            <Award className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            {!ingestFileStaged 
              ? "Click on the dropzone to start the interactive tabular parse simulation."
              : rawView 
                ? "This raw dataset is flagged with anomalies: missing cells, duplicate record indexes, and out-of-bounds metrics. Click Execute Clean Audit Pipeline above to sanitize."
                : "Auditing complete: Duplicate indexes successfully dropped. Missing data imputed using statistical median algorithms."
            }
          </div>
        </motion.div>
      </section>

      {/* INTERACTIVE ROI CALCULATOR */}
      <section id="calculator" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10 border-t border-zinc-900/40">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Calculate Your Business ROI
          </h2>
          <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
            Drag the slider to match your current monthly revenue and see estimated growth recovered using our automated AI controls.
          </p>
        </div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className={`p-8 border rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
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
                min="10000" 
                max="500000" 
                step="10000"
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
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10 border-t border-zinc-900/40">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Clean Architecture. Zero Trust Security.
          </h2>
          <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
            Our engineering foundation maps against distinct AppSec validations to ensure absolute data isolation.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 mb-6">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Automated Clean & Parse</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Asynchronously removes duplicates, corrects datatypes, cleans outlier gaps, and intercepts suspicious MIME payloads before storage updates.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-6">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Interactive EDA Pipelines</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Generate highly fluid distributions, correlations, scatter systems, and heatmaps structured inside reactive client-side dashboard panels.
            </p>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 mb-6">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Asynchronous ML Forecasting</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Unlock robust predictive model configurations (XGBoost, Scikit-learn) calculating customer expansion rates and future churn windows.
            </p>
          </motion.div>

        </motion.div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10 border-t border-zinc-900/40">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Proven Growth Outcomes
          </h2>
          <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
            Read how SaaS developers and growth leaders utilize our asynchronous pipelines to catch leakages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
              className={`border p-6 rounded-2xl flex flex-col justify-between transition-all ${
                isDarkMode ? "bg-zinc-900/30 border-zinc-800/50" : "bg-white border-slate-150 shadow-sm"
              }`}
            >
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
              
              <div className="mt-6 border-t border-zinc-850 pt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-cyan-500">
                  {t.name[0]}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 z-10 relative">
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
              <AnimatePresence initial={false}>
                {activeFAQ === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`px-5 pb-5 pt-1 text-sm border-t leading-relaxed ${isDarkMode ? "text-zinc-400 border-zinc-800/30" : "text-slate-650 border-slate-100"}`}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 text-[10px] text-zinc-500 transition-colors z-10 relative ${isDarkMode ? "border-zinc-900/60 bg-[#02040a]" : "border-slate-200 bg-white"}`}>
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
