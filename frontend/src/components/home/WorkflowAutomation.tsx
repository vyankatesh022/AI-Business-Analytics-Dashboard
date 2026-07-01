"use client";

import { motion } from "framer-motion";
import { Play, CheckCircle2, Bell, Cpu, ArrowRight, Filter, Zap, Activity } from "lucide-react";

export function WorkflowAutomation() {
  return (
    <section className="py-24 bg-white dark:bg-black relative border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Automate Decisions And Actions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Don&apos;t just predict churn or detect anomalies—act on them instantly. Our visual workflow builder connects your data layer directly to business operations.
          </motion.p>
        </div>

        {/* Workflow Visual Builder Mockup */}
        <div className="max-w-5xl mx-auto bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-12 relative overflow-hidden shadow-xl">
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Nodes Pipeline */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 py-8">
            
            {/* Node 1: Trigger */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 w-full md:w-56 shadow-md"
            >
              <div className="flex items-center gap-2 mb-2 text-blue-500">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">1. Trigger</span>
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Anomaly Detected</h4>
              <p className="text-xs text-zinc-500">API error rate &gt; 2.5% over 5m window</p>
            </motion.div>

            <ArrowRight className="h-6 w-6 text-zinc-400 rotate-90 md:rotate-0 shrink-0" />

            {/* Node 2: Condition */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 w-full md:w-56 shadow-md"
            >
              <div className="flex items-center gap-2 mb-2 text-purple-500">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">2. Condition</span>
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Check Tenant Tier</h4>
              <p className="text-xs text-zinc-500">If tenant tier == &apos;Enterprise&apos;</p>
            </motion.div>

            <ArrowRight className="h-6 w-6 text-zinc-400 rotate-90 md:rotate-0 shrink-0" />

            {/* Node 3: Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 w-full md:w-56 shadow-md"
            >
              <div className="flex items-center gap-2 mb-2 text-emerald-500">
                <Cpu className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">3. Action</span>
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Scale Cluster</h4>
              <p className="text-xs text-zinc-500">Auto-provision 2 extra AWS ECS tasks</p>
            </motion.div>

            <ArrowRight className="h-6 w-6 text-zinc-400 rotate-90 md:rotate-0 shrink-0" />

            {/* Node 4: Notification */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 w-full md:w-56 shadow-md"
            >
              <div className="flex items-center gap-2 mb-2 text-amber-500">
                <Bell className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">4. Notify</span>
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Alert SRE Team</h4>
              <p className="text-xs text-zinc-500">Send PagerDuty &amp; Slack incident thread</p>
            </motion.div>

          </div>

          {/* Execution Metrics Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Executions Today", value: "1,429,801", icon: Activity },
              { label: "Avg Latency", value: "48ms", icon: Play },
              { label: "Success Rate", value: "99.99%", icon: CheckCircle2 },
              { label: "Active Workflows", value: "342", icon: Zap },
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <metric.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">{metric.value}</div>
                  <div className="text-xs text-zinc-500">{metric.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
