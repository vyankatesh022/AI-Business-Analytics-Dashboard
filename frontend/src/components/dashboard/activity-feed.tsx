"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileText, Database, Brain, Settings, CreditCard, Activity } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "report",
    title: "Q3 Revenue Report Generated",
    description: "Sarah Jenkins generated a new revenue forecast report.",
    time: "10 mins ago",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: 2,
    type: "dataset",
    title: "Customer Churn Dataset Uploaded",
    description: "System completed ingesting 2.4M rows.",
    time: "1 hour ago",
    icon: Database,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: 3,
    type: "prediction",
    title: "Retention Model Updated",
    description: "AI completed training on the latest customer data.",
    time: "3 hours ago",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 4,
    type: "settings",
    title: "Organization Settings Changed",
    description: "Admin updated SSO configuration.",
    time: "Yesterday",
    icon: Settings,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
  {
    id: 5,
    type: "billing",
    title: "Subscription Upgraded",
    description: "Acme Corp upgraded to Enterprise Tier.",
    time: "2 days ago",
    icon: CreditCard,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
]

export function ActivityFeed() {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6 shadow-sm h-full flex flex-col">
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Organization Activity</h3>
        <p className="text-sm text-muted-foreground">Recent events across your workspace</p>
      </div>
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-6 before:absolute before:left-2 before:top-8 before:bottom-[-24px] before:w-px before:bg-border last:before:hidden"
            >
              <div className="absolute left-0 top-1 p-1 bg-background">
                <div className={`w-4 h-4 rounded-full ${activity.bg} flex items-center justify-center ring-4 ring-background`}>
                  <div className={`w-2 h-2 rounded-full bg-current ${activity.color}`} />
                </div>
              </div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
