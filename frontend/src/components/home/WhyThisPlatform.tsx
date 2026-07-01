"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const comparisons = [
  { feature: "Core Architecture", traditional: "Siloed tools duct-taped together", platform: "Unified Experience (Analytics + AI + Ops)" },
  { feature: "Intelligence", traditional: "Bolt-on AI afterthoughts", platform: "AI Native (Built for LLMs from day one)" },
  { feature: "Data Governance", traditional: "Basic RBAC, manual compliance", platform: "Enterprise Ready (SOC2, HIPAA, Lineage)" },
  { feature: "Scalability", traditional: "Single-tenant bottlenecks", platform: "Multi-Tenant (True cloud-native K8s)" },
  { feature: "Performance", traditional: "Minutes to run complex queries", platform: "Sub-second OLAP query execution" },
];

export function WhyThisPlatform() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 relative">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Why Choose This Platform?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            See how our unified architecture compares against the fragmented traditional data stack.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            
            {/* Header Row */}
            <div className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="p-4 md:p-6 bg-zinc-50 dark:bg-zinc-950/50">
                <span className="font-semibold text-zinc-500">Feature</span>
              </div>
              <div className="p-4 md:p-6 bg-zinc-50 dark:bg-zinc-950/50 text-center border-l border-zinc-200 dark:border-zinc-800">
                <span className="font-bold text-zinc-900 dark:text-zinc-300">Traditional Stack</span>
              </div>
              <div className="p-4 md:p-6 bg-blue-50 dark:bg-blue-900/10 text-center border-l border-blue-100 dark:border-blue-900/30">
                <span className="font-bold text-blue-600 dark:text-blue-400">Our Platform</span>
              </div>
            </div>

            {/* Comparison Rows */}
            {comparisons.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                <div className="p-4 md:p-6 flex items-center">
                  <span className="font-semibold text-zinc-900 dark:text-white">{row.feature}</span>
                </div>
                <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center border-l border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <X className="h-5 w-5 text-rose-500 mb-2" />
                  <span className="text-sm">{row.traditional}</span>
                </div>
                <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center border-l border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/5">
                  <Check className="h-5 w-5 text-emerald-500 mb-2" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{row.platform}</span>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
