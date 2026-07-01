"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, AlertTriangle, ArrowUpRight, ShieldCheck } from "lucide-react";

const insights = [
  {
    type: "Revenue Insight",
    title: "MRR Growth Acceleration",
    description: "Enterprise tier expansions contributed to a 14.2% MoM increase in Monthly Recurring Revenue, outperforming the projected 10% target.",
    confidence: "98%",
    impact: "+$124,500 MoM",
    icon: TrendingUp,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    type: "Growth Opportunity",
    title: "Untapped European Mid-Market",
    description: "User signups from DACH region increased by 45%. Reallocating ad spend could capture an estimated $350k in pipeline.",
    confidence: "89%",
    impact: "High Potential",
    icon: Sparkles,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    type: "Risk Alert",
    title: "API Latency Degradation",
    description: "P99 latency on `/v1/query` increased by 120ms during peak hours. Potential impact on SLAs for 4 enterprise tenants.",
    confidence: "95%",
    impact: "Requires Action",
    icon: AlertTriangle,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    type: "Churn Prediction",
    title: "Account Health Warning: Acme Corp",
    description: "Daily active users dropped by 35% over the last 14 days. AI recommends scheduling an executive check-in immediately.",
    confidence: "91%",
    impact: "$85k ARR at risk",
    icon: AlertTriangle,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
];

export function AiInsightsShowcase() {
  return (
    <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
          >
            <Brain className="h-4 w-4" />
            <span>AI Copilot & Diagnostics</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            AI That Explains Your Business
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400"
          >
            Stop staring at raw dashboards. Our AI engine continuously analyzes trillions of data points to deliver proactive executive summaries, risk alerts, and revenue forecasts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {insights.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ scale: 1.01 }}
              className={`p-6 rounded-2xl bg-zinc-800/80 border ${item.color} backdrop-blur-xl flex flex-col justify-between shadow-lg relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-zinc-900/80 text-zinc-300 border border-zinc-700">
                    <ShieldCheck className="h-3 w-3 text-blue-400" />
                    <span>Confidence: {item.confidence}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-700/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 block">Est. Impact</span>
                  <span className="text-sm font-semibold text-zinc-100">{item.impact}</span>
                </div>
                <button className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  View Analysis <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Executive Summary Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 max-w-5xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-zinc-900 border border-blue-500/30 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500 text-white shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Daily Executive Summary Available</h4>
              <p className="text-sm text-zinc-300">
                AI generated a 3-minute read summarizing today&apos;s key KPI movements, anomalies, and action items.
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors shrink-0">
            Read Summary
          </button>
        </motion.div>

      </div>
    </section>
  );
}
