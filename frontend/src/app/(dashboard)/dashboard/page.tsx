import * as React from "react"
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper"
import { HeroIntelligence } from "@/components/dashboard/hero-intelligence"
import { KPIGrid } from "@/components/dashboard/kpi-grid"
import { RevenueChart, RetentionChart } from "@/components/dashboard/analytics-charts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
        <StaggerContainer>
          <StaggerItem>
            <HeroIntelligence />
          </StaggerItem>
          
          <StaggerItem>
            <KPIGrid />
          </StaggerItem>
          
          <StaggerItem>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-full lg:col-span-4 h-[400px]">
                <RevenueChart />
              </div>
              <div className="col-span-full lg:col-span-3 h-[400px]">
                <RetentionChart />
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-full lg:col-span-4 h-[400px]">
                <ActivityFeed />
              </div>
              <div className="col-span-full lg:col-span-3 h-[400px]">
                <QuickActions />
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  )
}
