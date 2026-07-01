"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sliders, TrendingUp, ShieldAlert, Cpu, Check, RotateCcw, Sparkles, DollarSign, Users, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionableDashboardStore } from "@/store/actionable-dashboard-store"
import { toast } from "sonner"

export function WhatIfSimulator() {
  const { simulationMode, simulationParams, setSimulationParam, resetSimulation, toggleSimulationMode } = useActionableDashboardStore()
  const { discountCap, marketingBudgetDelta, autoScaleNodes } = simulationParams

  // Dynamic calculations based on slider parameters
  const baseMRR = 142300
  const mrrImpact = Math.round((25 - discountCap) * 1150 + marketingBudgetDelta * 420)
  const projectedMRR = baseMRR + mrrImpact
  const mrrGrowthPct = ((mrrImpact / baseMRR) * 100).toFixed(1)

  const baseChurn = 1.80
  const churnImpact = ((discountCap - 10) * -0.06) + ((autoScaleNodes - 8) * -0.03)
  const projectedChurn = Math.max(0.40, Math.min(4.50, baseChurn + churnImpact)).toFixed(2)

  const baseLTV = 42500
  const ltvImpact = Math.round((baseChurn - parseFloat(projectedChurn)) * 8400 + (marketingBudgetDelta * 45))
  const projectedLTV = baseLTV + ltvImpact

  const handleDeploy = () => {
    toast.success("Simulation Parameters Deployed to Production ⚡", {
      description: `Discount Cap: ${discountCap}% • Growth Budget: ${marketingBudgetDelta >= 0 ? "+" : ""}$${marketingBudgetDelta}k • Auto-Scale: ${autoScaleNodes} Nodes`
    })
    toggleSimulationMode()
  }

  if (!simulationMode) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
      className="bg-gradient-to-br from-purple-950/70 via-slate-900/90 to-indigo-950/80 rounded-2xl border-2 border-purple-500/40 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/40 text-purple-300 shadow-inner">
            <Sliders className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight">What-If Decision Simulator Engine 🔮</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Live Scenario AI
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Simulate operational adjustments below. The AI forecast engine dynamically re-models your 90-day trajectory in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={resetSimulation}
            className="h-8 px-3 text-xs bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleDeploy}
            className="h-8 px-4 text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30"
          >
            <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-300 fill-amber-300" />
            Deploy to Production
          </Button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 3 Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider 1: Discount Cap */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <label className="text-sm font-bold text-white">Enterprise Price Discount Cap</label>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm font-extrabold">
                {discountCap}% Max
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={discountCap}
              onChange={(e) => setSimulationParam("discountCap", parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% (Strict Pricing)</span>
              <span>10% (Baseline)</span>
              <span>25% (Aggressive Acquisition)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              💡 <span className="text-slate-300">Impact:</span> Lowering discount caps preserves profit margins (+${((10 - discountCap) * 1.15).toFixed(1)}k/mo) but slightly increases enterprise deal closing cycles.
            </p>
          </div>

          {/* Slider 2: Marketing Budget Delta */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <label className="text-sm font-bold text-white">Growth & Ad Budget Reallocation</label>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm font-extrabold">
                {marketingBudgetDelta >= 0 ? "+" : ""}${marketingBudgetDelta},000
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="200"
              step="5"
              value={marketingBudgetDelta}
              onChange={(e) => setSimulationParam("marketingBudgetDelta", parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>-$50k (Conservative)</span>
              <span>+$25k (Baseline)</span>
              <span>+$200k (Expansion Mode)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              💡 <span className="text-slate-300">Impact:</span> Every +$10k allocated to B2B LinkedIn & Google search yields ~3.8 qualified enterprise demos per week.
            </p>
          </div>

          {/* Slider 3: Auto-Scale Nodes */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <label className="text-sm font-bold text-white">Server Auto-Scale Cluster Limit</label>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-sm font-extrabold">
                {autoScaleNodes} Nodes
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="2"
              value={autoScaleNodes}
              onChange={(e) => setSimulationParam("autoScaleNodes", parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>2 Nodes (Min Cost)</span>
              <span>8 Nodes (Baseline)</span>
              <span>16 Nodes (Max Throughput)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              💡 <span className="text-slate-300">Impact:</span> Higher node thresholds eliminate 99.9th percentile latency spikes during regional checkout peaks.
            </p>
          </div>
        </div>

        {/* Right: Real-Time Projected KPI Impact Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/90 rounded-xl border border-purple-500/30 p-5 shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Simulated 90-Day Trajectory</span>
              </h3>
              <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-mono">
                AI Confidence: 96.4%
              </span>
            </div>

            <div className="space-y-4">
              {/* Metric 1: Projected MRR */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 transition-all">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Projected Monthly Revenue (MRR)</span>
                  <span className={`font-mono font-bold ${mrrImpact >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {mrrImpact >= 0 ? "+" : ""}${mrrImpact.toLocaleString()} ({mrrGrowthPct}%)
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  ${projectedMRR.toLocaleString()}
                </div>
              </div>

              {/* Metric 2: Projected Churn */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 transition-all">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Projected Annualized Churn Risk</span>
                  <span className={`font-mono font-bold ${parseFloat(projectedChurn) <= baseChurn ? "text-emerald-400" : "text-amber-400"}`}>
                    {(parseFloat(projectedChurn) - baseChurn).toFixed(2)}% vs baseline
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
                  <span>{projectedChurn}%</span>
                  {parseFloat(projectedChurn) < 1.5 && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Tier-1 Health 🛡️
                    </span>
                  )}
                </div>
              </div>

              {/* Metric 3: Projected LTV */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 transition-all">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Estimated Enterprise Customer LTV</span>
                  <span className={`font-mono font-bold ${ltvImpact >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {ltvImpact >= 0 ? "+" : ""}${ltvImpact.toLocaleString()}
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  ${projectedLTV.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 bg-purple-950/20 -mx-5 -mb-5 p-5 rounded-b-xl">
            <div className="flex items-start gap-2 text-xs text-purple-200">
              <Award className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Executive Recommendation:</strong> Deploying these parameters is projected to generate an additional <strong>+${(mrrImpact * 3).toLocaleString()}</strong> in Q3 gross revenue while preserving SLA uptime.
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
