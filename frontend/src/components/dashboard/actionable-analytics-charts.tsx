"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts"
import { useActionableDashboardStore } from "@/store/actionable-dashboard-store"
import { Sparkles, TrendingUp, ShieldCheck, Filter } from "lucide-react"

export function ActionableRevenueChart() {
  const { timeHorizon, region, simulationMode, simulationParams } = useActionableDashboardStore()

  // Generate dynamic data responsive to region and simulation parameters
  const baseMultiplier = region === 'nam' ? 0.45 : region === 'emea' ? 0.30 : region === 'apac' ? 0.18 : region === 'latam' ? 0.07 : 1.0
  const simBoost = (25 - simulationParams.discountCap) * 120 + simulationParams.marketingBudgetDelta * 45

  const data = [
    { name: "Jan", revenue: Math.round(4000 * baseMultiplier), target: Math.round(3400 * baseMultiplier), simulated: Math.round((4000 + simBoost * 0.4) * baseMultiplier) },
    { name: "Feb", revenue: Math.round(4800 * baseMultiplier), target: Math.round(4000 * baseMultiplier), simulated: Math.round((4800 + simBoost * 0.6) * baseMultiplier) },
    { name: "Mar", revenue: Math.round(5200 * baseMultiplier), target: Math.round(4800 * baseMultiplier), simulated: Math.round((5200 + simBoost * 0.8) * baseMultiplier) },
    { name: "Apr", revenue: Math.round(6100 * baseMultiplier), target: Math.round(5500 * baseMultiplier), simulated: Math.round((6100 + simBoost * 1.0) * baseMultiplier) },
    { name: "May", revenue: Math.round(7400 * baseMultiplier), target: Math.round(6800 * baseMultiplier), simulated: Math.round((7400 + simBoost * 1.3) * baseMultiplier) },
    { name: "Jun", revenue: Math.round(8900 * baseMultiplier), target: Math.round(8000 * baseMultiplier), simulated: Math.round((8900 + simBoost * 1.6) * baseMultiplier) },
    { name: "Jul", revenue: Math.round(10400 * baseMultiplier), target: Math.round(9200 * baseMultiplier), simulated: Math.round((10400 + simBoost * 2.0) * baseMultiplier) },
  ]

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/60 p-6 shadow-md h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold leading-none tracking-tight text-base">Revenue vs Target Forecast</h3>
            {simulationMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>What-If Simulated</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Region: <strong className="text-foreground uppercase">{region}</strong> • Timeframe: <strong className="text-foreground">{timeHorizon}</strong>
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Actual Revenue</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Target SLA</span>
          </span>
          {simulationMode && (
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
              <span>Simulated Projection</span>
            </span>
          )}
        </div>
      </div>

      <div className="h-[280px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSimulated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#f8fafc' }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
            />
            <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={800} />
            <Area type="monotone" dataKey="target" name="Target SLA" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fill="none" animationDuration={800} />
            {simulationMode && (
              <Area type="monotone" dataKey="simulated" name="Simulated Projection" stroke="#a855f7" strokeWidth={3} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorSimulated)" animationDuration={600} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Projected quarterly beat: <strong className="text-emerald-400 font-mono">+14.2%</strong></span>
        </span>
        <span className="font-mono text-[11px]">Model F1: 0.96</span>
      </div>
    </div>
  )
}

export function ActionableRetentionChart() {
  const { region, simulationMode } = useActionableDashboardStore()

  const data = [
    { name: "Week 1", cohortA: 100, cohortB: 100 },
    { name: "Week 2", cohortA: 88, cohortB: 94 },
    { name: "Week 3", cohortA: 79, cohortB: 91 },
    { name: "Week 4", cohortA: 72, cohortB: 89 },
    { name: "Week 5", cohortA: 66, cohortB: 86 },
    { name: "Week 6", cohortA: 62, cohortB: 85 + (simulationMode ? 4 : 0) },
  ]

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/60 p-6 shadow-md h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold leading-none tracking-tight text-base">Cohort Retention Curves</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise Tier (<span className="text-emerald-400 font-semibold">Cohort B</span>) vs Standard Tier (<span className="text-blue-400 font-semibold">Cohort A</span>)
          </p>
        </div>
        {simulationMode && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            +4.0% SLA Boost
          </span>
        )}
      </div>

      <div className="h-[280px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="%" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
              formatter={(val: number) => [`${val}%`, '']}
            />
            <Bar dataKey="cohortA" name="Standard Tier" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar dataKey="cohortB" name="Enterprise Tier" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Enterprise retention stabilization: <strong className="text-emerald-400 font-mono">85.0%</strong></span>
        </span>
        <span className="text-[11px] text-primary hover:underline cursor-pointer font-semibold">Cohort Drilldown →</span>
      </div>
    </div>
  )
}
