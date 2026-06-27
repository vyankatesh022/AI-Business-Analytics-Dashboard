"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UploadCloud, FileText, TrendingUp, MessageSquare, Plus, Users, LayoutDashboard, Target } from "lucide-react"

const actions = [
  { icon: UploadCloud, title: "Upload Dataset", desc: "Import CSV, JSON, or SQL", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: FileText, title: "Create Report", desc: "Build custom dashboards", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: TrendingUp, title: "Run Forecast", desc: "Predict future metrics", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: MessageSquare, title: "Ask AI", desc: "Query data in natural language", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Users, title: "Invite Team", desc: "Manage workspace access", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Target, title: "Create Segment", desc: "Filter user cohorts", color: "text-amber-400", bg: "bg-amber-500/10" },
]

export function QuickActions() {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6 shadow-sm h-full">
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">Shortcuts to common tasks</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.title}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-start p-4 rounded-xl border border-border/50 bg-background hover:bg-muted/50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className={`p-2 rounded-lg ${action.bg} mb-3`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <h4 className="font-medium text-sm text-foreground">{action.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
