"use client"

import * as React from "react"
import { KPICard } from "./kpi-card"

// Generate mock sparkline data
const generateData = (trend: 'up' | 'down') => {
  let current = 50
  return Array.from({ length: 15 }).map((_, i) => {
    const change = Math.random() * 10 - (trend === 'up' ? 3 : 7)
    current = Math.max(10, current + change)
    return { value: current }
  })
}

const KPIData = [
  {
    title: "Active Users",
    value: "24,592",
    trend: "up" as const,
    trendValue: "+12.5%",
    trendText: "vs last month",
    data: generateData("up")
  },
  {
    title: "Revenue (MRR)",
    value: "$142,300",
    trend: "up" as const,
    trendValue: "+8.2%",
    trendText: "vs last month",
    data: generateData("up")
  },
  {
    title: "Retention Rate",
    value: "94.2%",
    trend: "up" as const,
    trendValue: "+1.1%",
    trendText: "vs last quarter",
    data: generateData("up")
  },
  {
    title: "Avg. Churn",
    value: "1.8%",
    trend: "down" as const,
    trendValue: "-0.4%",
    trendText: "vs last quarter",
    data: generateData("down") // Churn going down is drawn as a downward line, which we'll map to red or green in reality, but for UI it's fine.
  }
]

export function KPIGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPIData.map((kpi, index) => (
        <KPICard key={kpi.title} {...kpi} index={index} />
      ))}
    </div>
  )
}
