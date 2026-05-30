"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  FileSpreadsheet, 
  BrainCircuit, 
  Zap, 
  FolderLock, 
  BarChart3, 
  Bot, 
  Check, 
  Activity,
  Sun,
  Moon,
  UploadCloud,
  FileText,
  AlertTriangle,
  Play,
  Terminal,
  RefreshCw,
  Sliders,
  Sparkle
} from "lucide-react";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [cleaningOption, setCleaningOption] = useState<string>("duplicates");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [cleaningCompleted, setCleaningCompleted] = useState<boolean>(false);

  const simulateDataCleaning = () => {
    setIsProcessing(true);
    setProcessingLogs([]);
    setCleaningCompleted(false);

    const logs = [
      "SecOps: Running path traversal audits... SECURE",
      "SecOps: Verifying MIME structure (text/csv)... VERIFIED",
      "Cleaning Engine: Scanning 840 data rows...",
      "Cleaning Engine: Identified 14 duplicate indices.",
      "Cleaning Engine: Identified 6 missing numerical cells.",
      "AI Engine: Mapping data column structures for context grounding...",
      "AI Engine: Successfully generated cached analytical summaries!"
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logs.length) {
        setProcessingLogs(prev => [...prev, logs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setCleaningCompleted(true);
      }
    }, 450);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileUploaded(true);
      setCleaningCompleted(false);
      setProcessingLogs([]);
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${
      isDarkMode ? "theme-dark bg-[#05070f] text-zinc-100" : "bg-[#f8fafc] text-slate-800"
    }`}>
      
      {/* Background elements */}
      <div className="absolute top-0 w-full h-[500px] bg-grid-glow opacity-30 z-0 pointer-events-none" />
      
      {/* Main Nav Header */}
      <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors ${
        isDarkMode ? "border-zinc-800/40 bg-[#05070f]/75" : "border-slate-200/80 bg-white/75"
      }`}>
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className={`font-display font-bold text-lg tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Vibe Analytics
              </span>
            </Link>
            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
              isDarkMode ? "bg-zinc-800 text-zinc-400" : "bg-slate-200 text-slate-600"
            }`}>
              Sandbox Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900/60 text-yellow-400" : "border-slate-200 bg-white text-slate-700 shadow-sm"
              }`}
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <Link 
              href="/" 
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white" : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Landing Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Upload & Data cleaning controllers */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* File Upload Box */}
          <div className={`p-6 border rounded-2xl transition-colors ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h2 className={`font-display text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              1. Secure Data Ingestion
            </h2>
            <p className="text-zinc-500 text-xs mt-1">Upload business CSV/XLSX targets. Size limits: 50MB.</p>
            
            <div className={`mt-6 border-2 border-dashed rounded-xl p-8 text-center relative hover:border-cyan-500 transition-colors ${
              isDarkMode ? "border-zinc-800 bg-zinc-900/20" : "border-slate-200 bg-slate-50/50"
            }`}>
              <input 
                type="file" 
                accept=".csv,.xlsx" 
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-10 w-10 text-zinc-500 mx-auto mb-4" />
              <div className="text-sm font-semibold text-zinc-400">Click to select or drag & drop files</div>
              <div className="text-xs text-zinc-650 mt-1">Accepts strictly CSV or XLSX files</div>
            </div>

            {fileUploaded && (
              <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span className="font-semibold">{fileName}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Staged</span>
              </div>
            )}
          </div>

          {/* Cleaning Configurations */}
          <div className={`p-6 border rounded-2xl transition-colors ${
            isDarkMode ? "bg-zinc-950/40 border-zinc-800/80" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h2 className={`font-display text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              2. Asynchronous Cleaning Filters
            </h2>
            
            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={() => setCleaningOption("duplicates")}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  cleaningOption === "duplicates" 
                  ? "border-cyan-500 bg-cyan-500/5 text-white" 
                  : "border-zinc-800 bg-zinc-900/20 text-zinc-400"
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Clear Duplicate Rows</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Identifies exact hash match coordinates</div>
                </div>
                <Sliders className="h-4 w-4 text-cyan-500" />
              </button>

              <button 
                onClick={() => setCleaningOption("nulls")}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  cleaningOption === "nulls" 
                  ? "border-cyan-500 bg-cyan-500/5 text-white" 
                  : "border-zinc-800 bg-zinc-900/20 text-zinc-400"
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Interpolate Null Cells</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Replaces missing gaps with local column medians</div>
                </div>
                <Sliders className="h-4 w-4 text-cyan-500" />
              </button>
            </div>

            <button 
              disabled={!fileUploaded || isProcessing}
              onClick={simulateDataCleaning}
              className={`mt-6 w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all shadow-md ${
                !fileUploaded 
                ? "bg-zinc-800 text-zinc-600 border border-zinc-800/80 cursor-not-allowed" 
                : "bg-cyan-500 hover:bg-cyan-600 text-zinc-950 shadow-cyan-500/10"
              }`}
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {isProcessing ? "Executing Analytics Core..." : "Run Asynchronous Cleaning Pipeline"}
            </button>
          </div>

        </section>

        {/* Right Side: Terminal Execution & Data logs */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Terminal Console Log */}
          <div className="p-6 bg-[#0c0f17] border border-zinc-850 rounded-2xl relative min-h-[460px] flex flex-col justify-between font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold">
                <Terminal className="h-4 w-4 text-cyan-500" />
                <span>Async Systems Execution Terminal</span>
              </div>
              <span className="text-[10px] text-zinc-600">v0.1.2-beta</span>
            </div>

            {/* Logs stream list */}
            <div className="flex-1 my-6 overflow-y-auto space-y-2 text-xs text-zinc-400 leading-relaxed max-h-[300px] scrollbar-thin">
              {processingLogs.length === 0 ? (
                <div className="text-zinc-650 h-full flex items-center justify-center italic">
                  Waiting for ingest upload or process command execution...
                </div>
              ) : (
                processingLogs.map((log, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <span className="text-cyan-500">&gt;&gt;</span>
                    <span className={log.includes("SECURE") || log.includes("VERIFIED") ? "text-emerald-400" : ""}>{log}</span>
                  </div>
                ))
              )}
            </div>

            {/* Process Success Indicators */}
            {cleaningCompleted && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs leading-relaxed flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">Tabular profiling successfully grounded</div>
                  <p className="text-zinc-500 mt-1">
                    Your sanitized and clean dataset has been prepared. Total ARR risk lowered, and anomalies pruned in analytical arrays.
                  </p>
                </div>
              </div>
            )}
          </div>

        </section>

      </main>

    </div>
  );
}
