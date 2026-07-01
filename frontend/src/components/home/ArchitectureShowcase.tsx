"use client";

import { motion } from "framer-motion";
import { Server, Database, Brain, ArrowDown, Activity, ShieldAlert, Cpu } from "lucide-react";

export function ArchitectureShowcase() {
  return (
    <section id="architecture" className="py-24 bg-white dark:bg-black relative border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-4"
          >
            <Server className="h-4 w-4" />
            <span>Modern Stack</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Enterprise-Grade Architecture
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Built on a highly scalable, multi-tenant microservices architecture designed to process millions of events with sub-second latency.
          </motion.p>
        </div>

        {/* Interactive Architecture Diagram */}
        <div className="max-w-4xl mx-auto relative">
          
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent rounded-3xl -z-10 blur-xl" />

          <div className="flex flex-col items-center gap-6">
            
            {/* Layer 1: Client */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-2/3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm text-center relative"
            >
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">Frontend Client</h3>
              <p className="text-xs text-zinc-500">Next.js 15, React 19, Tailwind CSS</p>
            </motion.div>

            <ArrowDown className="text-zinc-300 dark:text-zinc-600 animate-bounce" />

            {/* Layer 2: Gateway */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-full md:w-3/4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 shadow-sm text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldAlert className="h-4 w-4 text-blue-500" />
                <h3 className="font-bold text-zinc-900 dark:text-white">API Gateway & Auth</h3>
              </div>
              <p className="text-xs text-zinc-500">Rate Limiting, JWT Auth, Request Routing</p>
            </motion.div>

            <ArrowDown className="text-zinc-300 dark:text-zinc-600 animate-bounce" />

            {/* Layer 3: Services Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50"
            >
              <div className="col-span-full mb-2 text-center text-xs font-bold text-zinc-400 uppercase tracking-wider">FastAPI Microservices Cluster</div>
              
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 p-4 rounded-xl text-center shadow-sm">
                <Activity className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Analytics Engine</h4>
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 p-4 rounded-xl text-center shadow-sm">
                <Brain className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">AI Copilot</h4>
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 p-4 rounded-xl text-center shadow-sm">
                <Cpu className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Prediction Engine</h4>
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 p-4 rounded-xl text-center shadow-sm">
                <Server className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-white">Workflow Engine</h4>
              </div>
            </motion.div>

            <ArrowDown className="text-zinc-300 dark:text-zinc-600 animate-bounce" />

            {/* Layer 4: Data Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="w-full md:w-4/5 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-center flex flex-col items-center">
                <Database className="h-6 w-6 text-indigo-500 mb-2" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">PostgreSQL</h4>
                <p className="text-[10px] text-zinc-500">Relational Data & Metadata</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-center flex flex-col items-center">
                <Database className="h-6 w-6 text-rose-500 mb-2" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Redis</h4>
                <p className="text-[10px] text-zinc-500">Caching & Pub/Sub</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-center flex flex-col items-center">
                <Brain className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">SageMaker / S3</h4>
                <p className="text-[10px] text-zinc-500">ML Models & Cold Storage</p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
