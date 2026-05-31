"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { PageContainer } from "@/components/dashboard/PageContainer";

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Analytics Splines <BarChart3 className="h-5 w-5 text-cyan-400" />
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Deep dive into data segments and custom visual charting.</p>
          </div>
        </div>

        <div className="p-12 border border-dashed rounded-2xl border-zinc-800/60 bg-zinc-950/20 text-center flex flex-col items-center justify-center">
          <BarChart3 className="h-8 w-8 text-cyan-500/50 mb-3" />
          <h3 className="text-sm font-bold text-zinc-400 mb-1">Analytics Framework Shell</h3>
          <p className="text-xs text-zinc-600 max-w-sm">
            Phase 4 Shell deployed. Future iterations will include dynamic splines, cohort analysis, and customized metric builders here.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
