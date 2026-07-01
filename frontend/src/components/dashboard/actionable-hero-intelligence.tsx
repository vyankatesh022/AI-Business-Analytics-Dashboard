"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Users, DollarSign, UploadCloud, FileText, Activity, MessageSquare, Sliders, Zap, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionableDashboardStore } from "@/store/actionable-dashboard-store"
import { toast } from "sonner"

export function ActionableHeroIntelligence() {
  const { region, timeHorizon, toggleSimulationMode, simulationMode } = useActionableDashboardStore()

  const handleRunForecast = () => {
    toggleSimulationMode()
    if (!simulationMode) {
      toast.success("Activated What-If Simulation Engine 🔮", {
        description: "Explore scenario parameters in the simulation panel below."
      })
    }
  }

  const handleAskAI = () => {
    toast.message("AI Copilot Ready 🤖", {
      description: "Press Ctrl+K or Cmd+K anytime to query enterprise analytics in natural language."
    })
  }

  const scrollToAIQueue = () => {
    const el = document.getElementById("ai-decision-queue")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      toast.info("Scrolled to Autonomous AI Decision Queue ⚡")
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl border border-indigo-500/30">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      {/* Decorative ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold tracking-wider text-indigo-300 uppercase bg-indigo-500/15 rounded-full border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Welcome Back, Executive 👋
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/10 rounded-md border border-emerald-500/20">
              Region: {region.toUpperCase()} • {timeHorizon}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Acme Corp Actionable Command Center
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Real-time decision intelligence powered by autonomous AI agents. Review recommendations, simulate scenarios, and execute operational workflows instantly.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-sm">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Projected ARR Beat</p>
                <p className="text-sm font-extrabold text-white font-mono">+18.4%</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-sm">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Enterprise Retention</p>
                <p className="text-sm font-extrabold text-white font-mono">94.2%</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-sm">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">AI F1 Frcst F1</p>
                <p className="text-sm font-extrabold text-white font-mono">0.964</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight Highlight Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-900/60 via-slate-900/90 to-indigo-950/80 backdrop-blur-xl border-2 border-indigo-400/40 p-5 rounded-2xl max-w-sm w-full shadow-2xl relative group"
        >
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="animate-pulse w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded">
              High Impact
            </span>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/40 text-indigo-300 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Autonomous AI Opportunity</h3>
              <p className="text-xs text-indigo-200/90 leading-relaxed font-normal">
                AI detected <strong>+$42,500 ARR</strong> growth potential in the APAC infrastructure tier and 3 enterprise renewal risks requiring immediate triage.
              </p>
              <div className="mt-3.5 flex gap-2">
                <Button
                  size="sm"
                  onClick={scrollToAIQueue}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 h-8 shadow-md shadow-indigo-500/20 border border-indigo-400/30 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>Review AI Queue</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actionable Bottom Overlay */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <Button
            size="sm"
            onClick={handleRunForecast}
            className={`text-xs font-bold h-8 transition-all shadow-sm ${
              simulationMode
                ? "bg-purple-600 text-white hover:bg-purple-500 border border-purple-400/50 shadow-purple-500/20"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 mr-1.5 ${simulationMode ? "animate-pulse" : ""}`} />
            {simulationMode ? "Exit What-If Simulation 🔮" : "Simulate What-If Forecast 🔮"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Dataset ingesting pipeline active • Auto-sync every 5 minutes")}
            className="text-xs h-8 text-slate-300 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Ingest Dataset
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Exporting executive summary presentation to PDF...")}
            className="text-xs h-8 text-slate-300 border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:text-white"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Generate Executive Brief
          </Button>
        </div>

        <Button
          size="sm"
          onClick={handleAskAI}
          className="text-xs h-8 font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/20 border border-indigo-400/30"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          Ask AI Copilot
        </Button>
      </div>
    </div>
  )
}
