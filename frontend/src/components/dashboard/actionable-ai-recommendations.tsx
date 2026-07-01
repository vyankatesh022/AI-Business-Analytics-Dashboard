"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, ShieldAlert, TrendingUp, Cpu, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionableDashboardStore, ActionableItem } from "@/store/actionable-dashboard-store"
import { toast } from "sonner"

const severityStyles = {
  urgent: {
    badge: "bg-red-500/15 text-red-400 border-red-500/30 animate-pulse",
    border: "border-red-500/30 hover:border-red-500/50",
    glow: "shadow-red-500/10",
    iconColor: "text-red-400",
  },
  high: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    border: "border-amber-500/30 hover:border-amber-500/50",
    glow: "shadow-amber-500/10",
    iconColor: "text-amber-400",
  },
  medium: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    border: "border-blue-500/30 hover:border-blue-500/50",
    glow: "shadow-blue-500/10",
    iconColor: "text-blue-400",
  },
  low: {
    badge: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    border: "border-slate-500/30 hover:border-slate-500/50",
    glow: "shadow-slate-500/10",
    iconColor: "text-slate-400",
  },
}

const categoryIcons = {
  Revenue: TrendingUp,
  Retention: ShieldAlert,
  Infrastructure: Cpu,
  Growth: Zap,
  Security: AlertTriangle,
}

export function ActionableAIRecommendations() {
  const { pendingActions, executedActions, executeAction, dismissAction, revertAction } = useActionableDashboardStore()
  const [expandedLogs, setExpandedLogs] = React.useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = React.useState<'pending' | 'executed'>('pending')

  const handleExecute = async (item: ActionableItem) => {
    toast.info(`Executing AI Action: ${item.title}`, {
      description: "Dispatching autonomous integration workflow..."
    })
    await executeAction(item.id)
    toast.success(`Action Successfully Applied ⚡`, {
      description: `${item.impact} • Verified via production telemetry.`
    })
  }

  const toggleLogs = (id: string) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const displayedItems = activeTab === 'pending' ? pendingActions : executedActions

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-indigo-950/40 rounded-2xl border border-indigo-500/25 p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400 shadow-inner">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Autonomous Decision Queue</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Actionable BI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review, simulate, and execute AI-generated interventions with one click.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Pending Actions</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/30 text-indigo-200">
              {pendingActions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('executed')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'executed'
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Executed History</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/30 text-emerald-200">
              {executedActions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700/60"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-300">
                {activeTab === 'pending' ? "All AI Actions Resolved! 🎉" : "No executed actions yet."}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeTab === 'pending'
                  ? "Your organization is currently operating at peak predicted efficiency. New recommendations will appear here automatically."
                  : "Executed actions and audit logs will be archived here for rollback and compliance."}
              </p>
            </motion.div>
          ) : (
            displayedItems.map((item) => {
              const styles = severityStyles[item.severity] || severityStyles.medium
              const Icon = categoryIcons[item.category] || Sparkles
              const isExecuting = item.status === 'executing'
              const isExecuted = item.status === 'executed'

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-xl border ${styles.border} bg-slate-900/70 p-5 shadow-lg transition-all hover:bg-slate-900/90 ${styles.glow}`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Left Info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className={`p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 mt-0.5 ${styles.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded border ${styles.badge}`}>
                            {item.severity}
                          </span>
                          <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-400 ml-auto sm:ml-0">{item.timestamp}</span>
                        </div>

                        <h3 className="text-base font-bold text-white mb-1 leading-snug">{item.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2.5 max-w-3xl font-normal">
                          <span className="text-slate-400 font-medium">AI Root Cause: </span>
                          {item.reason}
                        </p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Expected Impact: {item.impact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {isExecuting ? (
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold animate-pulse">
                          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          <span>Executing via API...</span>
                        </div>
                      ) : isExecuted ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLogs(item.id)}
                            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 transition-colors"
                          >
                            <span>{expandedLogs[item.id] ? "Hide Logs" : "Audit Logs"}</span>
                            {expandedLogs[item.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              revertAction(item.id)
                              toast.info("Action reverted to pending queue", {
                                description: `Rolled back changes for: ${item.title}`
                              })
                            }}
                            className="h-8 px-3 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                          >
                            <RotateCcw className="w-3 h-3 mr-1.5" />
                            Revert
                          </Button>

                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Executed ✅</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => dismissAction(item.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Dismiss Recommendation"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Button
                            size="sm"
                            onClick={() => handleExecute(item)}
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs px-4 py-5 shadow-md shadow-indigo-500/25 border border-indigo-400/30 transition-all hover:scale-[1.02]"
                          >
                            <Zap className="w-4 h-4 mr-1.5 text-amber-300 fill-amber-300" />
                            {item.actionLabel || "Execute Action ⚡"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expandable Audit Logs for Executed items */}
                  {isExecuted && expandedLogs[item.id] && item.executionLogs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-3 border-t border-slate-800 bg-black/40 rounded-lg p-3 text-xs font-mono text-slate-300 space-y-1.5"
                    >
                      <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1">
                        ⚡ Autonomous Telemetry & Audit Trail
                      </div>
                      {item.executionLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
