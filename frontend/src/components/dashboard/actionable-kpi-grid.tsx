"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Users, DollarSign, ShieldCheck, Activity, ChevronRight, Zap, Mail, PhoneCall, CheckCircle2, Sparkles } from "lucide-react"
import { useActionableDashboardStore, TimeHorizon, RegionFilter } from "@/store/actionable-dashboard-store"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface KPICardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendText: string;
  icon: React.ElementType;
  color: string;
  actionBadge: string;
  actionTitle: string;
  actionDesc: string;
  actionBtnText: string;
  onExecuteAction: () => void;
  index: number;
}

function ActionableKPICard({
  title,
  value,
  trend,
  trendValue,
  trendText,
  icon: Icon,
  color,
  actionBadge,
  actionTitle,
  actionDesc,
  actionBtnText,
  onExecuteAction,
  index,
}: KPICardProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isResolved, setIsResolved] = React.useState(false)

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    onExecuteAction()
    setIsResolved(true)
    setTimeout(() => {
      setIsOpen(false)
    }, 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="bg-card text-card-foreground rounded-xl border border-border/60 p-5 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative group overflow-hidden"
    >
      {/* Top info */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground">{title}</span>
          <div className={`p-2 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-foreground">
            {value}
          </span>
          <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
            trend === 'up' ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span>{trendValue}</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">{trendText}</p>
      </div>

      {/* Action Trigger Badge */}
      <div className="mt-4 pt-3 border-t border-border/40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            isResolved
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/25"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {isResolved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            <span>{isResolved ? "Action Resolved ✅" : actionBadge}</span>
          </span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* Expandable Action Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-dashed border-border overflow-hidden text-xs space-y-2.5 bg-muted/40 -mx-5 -mb-5 p-4 rounded-b-xl"
          >
            <div className="font-bold text-foreground flex items-center justify-between">
              <span>{actionTitle}</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">AI Triage</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">{actionDesc}</p>
            
            <div className="flex justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-7 px-2.5 text-[11px]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAction}
                disabled={isResolved}
                className="h-7 px-3 text-[11px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Zap className="w-3 h-3 mr-1 text-amber-300" />
                {isResolved ? "Executed" : actionBtnText}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ActionableKPIGrid() {
  const { timeHorizon, region } = useActionableDashboardStore()

  // Dynamic values responsive to store selection
  const getMultiplier = (th: TimeHorizon, reg: RegionFilter) => {
    let factor = 1.0
    if (th === 'realtime') factor = 0.05
    if (th === '24h') factor = 0.15
    if (th === '7d') factor = 0.40
    if (th === 'qtd') factor = 1.80
    if (th === 'ytd') factor = 4.20

    if (reg === 'nam') factor *= 0.45
    if (reg === 'emea') factor *= 0.30
    if (reg === 'apac') factor *= 0.18
    if (reg === 'latam') factor *= 0.07

    return factor
  }

  const mult = getMultiplier(timeHorizon, region)

  const activeUsers = Math.round(24592 * mult).toLocaleString()
  const revenue = Math.round(142300 * mult).toLocaleString()
  const retention = (94.2 + (region === 'apac' ? 1.4 : 0)).toFixed(1) + "%"
  const churn = (1.8 - (timeHorizon === 'realtime' ? 0.3 : 0)).toFixed(2) + "%"

  const kpis: KPICardProps[] = [
    {
      title: "Active Enterprise Users",
      value: activeUsers,
      trend: "up",
      trendValue: "+12.5%",
      trendText: `in ${region.toUpperCase()} (${timeHorizon})`,
      icon: Users,
      color: "text-blue-400 bg-blue-500",
      actionBadge: "💡 4 Upsell Cohorts Ready",
      actionTitle: "Expand Enterprise Seats",
      actionDesc: "4 client organizations are exceeding 90% seat capacity. Send automated tier-upgrade proposals with 5% annual incentive.",
      actionBtnText: "Send Upgrade Offers 📩",
      onExecuteAction: () => toast.success("Dispatched 4 automated seat-expansion proposals to workspace admins!"),
      index: 0,
    },
    {
      title: "Revenue Velocity (MRR)",
      value: `$${revenue}`,
      trend: "up",
      trendValue: "+8.2%",
      trendText: `in ${region.toUpperCase()} (${timeHorizon})`,
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500",
      actionBadge: "⚡ 2 Overdue Invoices ($14.2k)",
      actionTitle: "Automate Payment Recovery",
      actionDesc: "2 corporate invoices are 5 days overdue due to credit card authorization expired. Trigger automated smart dunning email + link.",
      actionBtnText: "Trigger Dunning Flow 💳",
      onExecuteAction: () => toast.success("Smart dunning sequence initiated for 2 enterprise accounts!"),
      index: 1,
    },
    {
      title: "Net Retention Rate",
      value: retention,
      trend: "up",
      trendValue: "+1.1%",
      trendText: `vs regional benchmark`,
      icon: ShieldCheck,
      color: "text-purple-400 bg-purple-500",
      actionBadge: "⚠️ 3 VIP Accounts at Risk",
      actionTitle: "Schedule Executive Check-In",
      actionDesc: "AI sentiment analysis detected frustration in support ticket #4492 regarding custom SSO mapping. Dispatch calendar link to CS Lead.",
      actionBtnText: "Book CS Check-In 📞",
      onExecuteAction: () => toast.success("Priority check-in invitation sent to Customer Success Executive!"),
      index: 2,
    },
    {
      title: "System Churn Velocity",
      value: churn,
      trend: "down",
      trendValue: "-0.4%",
      trendText: `vs last period`,
      icon: Activity,
      color: "text-amber-400 bg-amber-500",
      actionBadge: "🔧 Billing Friction Anomaly",
      actionTitle: "Apply Checkout Fallback Rule",
      actionDesc: "European credit card SCA authentication failed for 8 users today. Automatically enable Apple Pay & Adyen backup gateway.",
      actionBtnText: "Enable Fallback Rule ⚡",
      onExecuteAction: () => toast.success("Enabled Adyen fallback checkout rule for European currency transactions!"),
      index: 3,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <ActionableKPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
