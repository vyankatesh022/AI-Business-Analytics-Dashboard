import * as React from "react"
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { ActionControlBar } from "@/components/dashboard/action-control-bar"
import { ActionableHeroIntelligence } from "@/components/dashboard/actionable-hero-intelligence"
import { WhatIfSimulator } from "@/components/dashboard/what-if-simulator"
import { ActionableAIRecommendations } from "@/components/dashboard/actionable-ai-recommendations"
import { ActionableKPIGrid } from "@/components/dashboard/actionable-kpi-grid"
import { ActionableRevenueChart, ActionableRetentionChart } from "@/components/dashboard/actionable-analytics-charts"
import { ActionableActivityFeed } from "@/components/dashboard/actionable-activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
        {/* Global Action & Time-Horizon Control Bar */}
        <ActionControlBar />

        <StaggerContainer>
          {/* Actionable Hero Banner */}
          <StaggerItem>
            <ActionableHeroIntelligence />
          </StaggerItem>
          
          {/* Interactive What-If Simulator (appears when activated) */}
          <StaggerItem>
            <WhatIfSimulator />
          </StaggerItem>

          {/* Autonomous AI Decision Queue */}
          <StaggerItem>
            <div id="ai-decision-queue" className="scroll-mt-6">
              <ActionableAIRecommendations />
            </div>
          </StaggerItem>
          
          {/* Actionable KPI Grid with Inline Triage Drawers */}
          <StaggerItem>
            <ActionableKPIGrid />
          </StaggerItem>
          
          {/* Actionable Revenue & Retention Charts with Simulation Overlays */}
          <StaggerItem>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-full lg:col-span-4 h-[420px]">
                <ActionableRevenueChart />
              </div>
              <div className="col-span-full lg:col-span-3 h-[420px]">
                <ActionableRetentionChart />
              </div>
            </div>
          </StaggerItem>

          {/* Actionable Workflow Tracker & Quick Shortcuts */}
          <StaggerItem>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-full lg:col-span-4 h-[440px]">
                <ActionableActivityFeed />
              </div>
              <div className="col-span-full lg:col-span-3 h-[440px]">
                <QuickActions />
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
