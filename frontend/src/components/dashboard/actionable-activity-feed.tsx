"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Database, Brain, Settings, CreditCard, Check, X, ShieldAlert, Zap, Clock, UserCheck, Activity, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ApprovalTask {
  id: string;
  title: string;
  desc: string;
  aiConfidence: string;
  impact: string;
  time: string;
}

interface ActivityEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  badge?: string;
}

const initialTasks: ApprovalTask[] = [
  {
    id: "task-1",
    title: "Approve Q3 Dynamic Pricing Rule (+14% Enterprise Tier)",
    desc: "AI detected low price elasticity among clients with >500 users. Approving will update catalog prices for new contracts.",
    aiConfidence: "97% Confidence",
    impact: "+$42k ARR",
    time: "15 mins ago",
  },
  {
    id: "task-2",
    title: "Authorize Automated Database Cluster Failover Drill",
    desc: "Scheduled maintenance test for secondary EU-Central disaster recovery replica.",
    aiConfidence: "100% Verified",
    impact: "Zero Downtime",
    time: "1 hour ago",
  }
]

const initialActivities: ActivityEvent[] = [
  {
    id: 1,
    type: "ai-action",
    title: "Autonomous Server Auto-Scale Executed",
    description: "System automatically scaled US-East clusters from 4 to 8 nodes during traffic surge.",
    time: "10 mins ago",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    badge: "Autonomous AI",
  },
  {
    id: 2,
    type: "report",
    title: "Q3 Revenue Report & Forecast Generated",
    description: "Sarah Jenkins exported executive analytics package to cloud storage.",
    time: "25 mins ago",
    icon: FileText,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    badge: "User Action",
  },
  {
    id: 3,
    type: "prediction",
    title: "Churn Prediction Model Re-trained",
    description: "AI completed training on 2.4M new telemetry data points. F1 score: 0.94.",
    time: "2 hours ago",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    badge: "System ML",
  },
  {
    id: 4,
    type: "security",
    title: "Rate Limit Shield Activated (APAC)",
    description: "Mitigated 1,400 malformed API requests from unauthorized IPs.",
    time: "3 hours ago",
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
    badge: "Autonomous AI",
  },
  {
    id: 5,
    type: "billing",
    title: "Subscription Tier Upgraded (Acme Corp)",
    description: "Automated billing webhook confirmed transition to Enterprise Tier ($2,400/mo).",
    time: "Yesterday",
    icon: CreditCard,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    badge: "Webhook",
  },
]

export function ActionableActivityFeed() {
  const [tasks, setTasks] = React.useState<ApprovalTask[]>(initialTasks)
  const [activities, setActivities] = React.useState<ActivityEvent[]>(initialActivities)
  const [activeTab, setActiveTab] = React.useState<'approvals' | 'feed'>('approvals')
  const [filter, setFilter] = React.useState<string>('all')

  const handleApprove = (task: ApprovalTask) => {
    toast.success(`Approved & Dispatched: ${task.title}`, {
      description: `Impact: ${task.impact} • Workflow executed via Enterprise API.`
    })
    
    // Add to activity feed
    const newActivity: ActivityEvent = {
      id: Date.now(),
      type: "user-approved",
      title: `[Approved] ${task.title}`,
      description: `Authorized by you. ${task.desc}`,
      time: "Just now",
      icon: UserCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      badge: "User Approved ⚡",
    }

    setActivities((prev) => [newActivity, ...prev])
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  const handleReject = (id: string, title: string) => {
    toast.info("Task dismissed from approval queue", {
      description: `Archived: ${title}`
    })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true
    if (filter === 'ai') return act.badge?.includes("Autonomous") || act.badge?.includes("ML")
    if (filter === 'user') return act.badge?.includes("User")
    return true
  })

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/60 p-6 shadow-md h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold leading-none tracking-tight text-base text-foreground">Actionable Workflow Tracker</h3>
              {tasks.length > 0 && (
                <span className="animate-pulse px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {tasks.length} Awaiting Approval
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Human-in-the-loop governance & real-time telemetry</p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/40 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'approvals'
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Approvals</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20 text-current">
                {tasks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Audit Stream</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Human in the loop approvals */}
        {activeTab === 'approvals' && (
          <div className="space-y-3 mt-2">
            <AnimatePresence mode="popLayout">
              {tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border"
                >
                  <UserCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-bold text-foreground">No Pending Approvals!</p>
                  <p className="text-xs text-muted-foreground mt-1">All AI recommendations have been processed.</p>
                </motion.div>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-slate-900/40 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-white leading-snug">{task.title}</h4>
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 whitespace-nowrap">
                        {task.aiConfidence}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{task.desc}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ⚡ Impact: {task.impact}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(task.id, task.title)}
                          className="h-7 px-2.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(task)}
                          className="h-7 px-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Approve & Execute
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tab 2: Audit Stream */}
        {activeTab === 'feed' && (
          <div>
            {/* Filter chips */}
            <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
              {['all', 'ai', 'user'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg capitalize transition-all ${
                    filter === f
                      ? "bg-secondary text-secondary-foreground border border-border"
                      : "text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  {f === 'all' ? "All Events" : f === 'ai' ? "🤖 AI Autonomous" : "👤 User Actions"}
                </button>
              ))}
            </div>

            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
              {filteredActivities.map((act, idx) => {
                const Icon = act.icon
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/40"
                  >
                    <div className={`p-2 rounded-lg ${act.bg} shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${act.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-xs font-bold text-foreground truncate">{act.title}</h4>
                        <span className="text-[10px] text-muted-foreground shrink-0">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-normal">{act.description}</p>
                      {act.badge && (
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                          {act.badge}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Telemetry Active</span>
        </span>
        <button
          onClick={() => toast.info("Exporting complete audit trail to CSV...")}
          className="text-primary hover:underline font-semibold"
        >
          Export Audit Trail →
        </button>
      </div>
    </div>
  )
}
