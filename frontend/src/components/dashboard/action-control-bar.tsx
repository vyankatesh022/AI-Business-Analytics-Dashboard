"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Globe, Clock, Sparkles, RefreshCw, Activity, ShieldCheck, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionableDashboardStore, TimeHorizon, RegionFilter } from "@/store/actionable-dashboard-store"
import { toast } from "sonner"

const timeHorizons: { label: string; value: TimeHorizon }[] = [
  { label: "Real-time", value: "realtime" },
  { label: "24h", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "QTD", value: "qtd" },
  { label: "YTD", value: "ytd" },
]

const regions: { label: string; value: RegionFilter }[] = [
  { label: "Global (All Regions)", value: "global" },
  { label: "North America (NAM)", value: "nam" },
  { label: "Europe (EMEA)", value: "emea" },
  { label: "Asia-Pacific (APAC)", value: "apac" },
  { label: "Latin America (LATAM)", value: "latam" },
]

export function ActionControlBar() {
  const { timeHorizon, setTimeHorizon, region, setRegion, simulationMode, toggleSimulationMode } = useActionableDashboardStore()
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Dashboard synced with enterprise data lake", {
        description: `Loaded latest metrics for ${region.toUpperCase()} • Timeframe: ${timeHorizon}`
      })
    }, 800)
  }

  return (
    <div className="bg-card/80 backdrop-blur-md border border-border/60 rounded-xl p-4 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all">
      {/* Left section: Live status & Region selector */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Activity className="w-3.5 h-3.5 mr-0.5" />
          <span>Live API Stream • 99.9%</span>
        </div>

        <div className="flex items-center gap-2 bg-background/80 border border-border px-3 py-1.5 rounded-lg text-xs font-medium">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <select
            value={region}
            onChange={(e) => {
              const newRegion = e.target.value as RegionFilter
              setRegion(newRegion)
              toast.info(`Filtered dashboard view to ${newRegion.toUpperCase()}`)
            }}
            className="bg-transparent text-foreground focus:outline-none cursor-pointer font-semibold"
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value} className="bg-popover text-popover-foreground">
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center section: Time Horizon Tabs */}
      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/40 overflow-x-auto w-full lg:w-auto max-w-full">
        <Clock className="w-3.5 h-3.5 text-muted-foreground ml-2 mr-1 hidden sm:inline" />
        {timeHorizons.map((th) => {
          const isActive = timeHorizon === th.value
          return (
            <button
              key={th.value}
              onClick={() => setTimeHorizon(th.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap relative ${
                isActive
                  ? "text-foreground bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              {th.label}
              {isActive && (
                <motion.div
                  layoutId="activeHorizon"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20 pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Right section: Simulation Mode Toggle & Refresh */}
      <div className="flex items-center justify-end gap-3 w-full lg:w-auto">
        <button
          onClick={() => {
            toggleSimulationMode()
            if (!simulationMode) {
              toast.message("Entered What-If Simulation Mode 🔮", {
                description: "Adjust decision sliders to predict revenue and churn impacts."
              })
            } else {
              toast.info("Exited Simulation Mode • Returned to live production data")
            }
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
            simulationMode
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-purple-500/20 ring-2 ring-purple-400/30"
              : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-border/80"
          }`}
        >
          <Sliders className={`w-3.5 h-3.5 ${simulationMode ? "animate-pulse" : ""}`} />
          <span>{simulationMode ? "Simulation Mode: ON 🔮" : "Simulate What-If 🔮"}</span>
        </button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8 px-3 text-xs font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          {isRefreshing ? "Syncing..." : "Sync"}
        </Button>
      </div>
    </div>
  )
}
