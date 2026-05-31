"use client";

import React from "react";
import { Sparkles, TrendingUp, Users, ShieldCheck, Zap } from "lucide-react";
import { PageContainer } from "@/components/dashboard/PageContainer";

export default function DashboardOverview() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Executive Analytics Hub <Sparkles className="h-5 w-5 text-cyan-400" />
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Real-time analytical pipelines and ML forecasts dashboard.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-cascade">
          {/* KPI 1 */}
          <div className="p-5 border rounded-2xl bg-zinc-950/40 border-zinc-800/80 flex flex-col justify-between h-28 hover:border-cyan-500 transition-colors">
            <div className="flex justify-between items-start text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
              <span>Annual Recurring (ARR)</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold mt-1">$1,248,300</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">▲ +14.2% YoY segment expansion</div>
          </div>

          {/* KPI 2 */}
          <div className="p-5 border rounded-2xl bg-zinc-950/40 border-zinc-800/80 flex flex-col justify-between h-28 hover:border-cyan-500 transition-colors" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-between items-start text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
              <span>Active Tenant Nodes</span>
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold mt-1">8,420</div>
            <div className="text-[10px] text-cyan-400 font-bold mt-1">▲ +8.6% MoM usage velocity</div>
          </div>

          {/* KPI 3 */}
          <div className="p-5 border rounded-2xl bg-zinc-950/40 border-zinc-800/80 flex flex-col justify-between h-28 hover:border-cyan-500 transition-colors" style={{ animationDelay: '200ms' }}>
            <div className="flex justify-between items-start text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
              <span>Net Revenue Retention</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold mt-1">112.4%</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">▲ Stable above 110% benchmark</div>
          </div>

          {/* KPI 4 */}
          <div className="p-5 border rounded-2xl bg-zinc-950/40 border-zinc-800/80 flex flex-col justify-between h-28 hover:border-cyan-500 transition-colors" style={{ animationDelay: '300ms' }}>
            <div className="flex justify-between items-start text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
              <span>Clean Telemetry Latency</span>
              <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-2xl font-extrabold mt-1">124 ms</div>
            <div className="text-[10px] text-cyan-500 font-bold mt-1">▼ -12% asynchronous load drop</div>
          </div>
        </div>
        
        <div className="p-12 border border-dashed rounded-2xl border-zinc-800/60 bg-zinc-950/20 text-center flex flex-col items-center justify-center">
          <Sparkles className="h-8 w-8 text-cyan-500/50 mb-3" />
          <h3 className="text-sm font-bold text-zinc-400 mb-1">Analytics Engine Foundation</h3>
          <p className="text-xs text-zinc-600 max-w-sm">
            Phase 4 Shell deployed. Future iterations will mount the interactive real-time splines, retention heatmaps, and ML data grids here.
          </p>
        </div>

      </div>
    </PageContainer>
  );
}
