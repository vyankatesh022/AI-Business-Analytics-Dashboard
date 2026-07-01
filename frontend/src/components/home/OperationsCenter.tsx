"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, DollarSign, AlertCircle, Server, CheckCircle2 } from "lucide-react";

export function OperationsCenter() {
  return (
    <section className="py-24 bg-zinc-950 text-white relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4"
          >
            <Activity className="h-4 w-4" />
            <span>Infrastructure Health</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Operations & Observability Center
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400"
          >
            Keep your engineering and operations teams aligned with real-time monitoring, infrastructure cost tracking, and automated reliability scoring.
          </motion.p>
        </div>

        {/* Ops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Monitoring & Reliability */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">System Reliability</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">99.992%</div>
              <p className="text-xs text-zinc-400 mb-6">Uptime SLA across all production clusters (Last 30 days)</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">API Gateway Latency</span>
                <span className="font-semibold text-emerald-400">24ms (P95)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Database CPU Utilization</span>
                <span className="font-semibold text-zinc-200">42%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Active Worker Nodes</span>
                <span className="font-semibold text-zinc-200">128 / 128</span>
              </div>
            </div>
          </div>

          {/* Cost Tracking */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cloud Cost Optimization</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">$14,230</div>
              <p className="text-xs text-zinc-400 mb-6">Current month-to-date cloud spend (AWS + OpenAI)</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Compute (EC2 / EKS)</span>
                <span className="font-semibold text-zinc-200">$8,400</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Database & Storage (RDS / S3)</span>
                <span className="font-semibold text-zinc-200">$3,120</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">AI Tokens (SageMaker / LLM)</span>
                <span className="font-semibold text-emerald-400">$2,710 (-14% YoY)</span>
              </div>
            </div>
          </div>

          {/* Incident Management */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Incident Management</span>
                <AlertCircle className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">0 Active</div>
              <p className="text-xs text-zinc-400 mb-6">All systems operational. No critical incidents detected.</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">MTTR (Mean Time To Resolve)</span>
                <span className="font-semibold text-zinc-200">11 mins</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Auto-Remediated Alerts</span>
                <span className="font-semibold text-blue-400">94.2%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">On-Call Engineer</span>
                <span className="font-semibold text-zinc-200">Alex R. (SRE Tier 2)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
