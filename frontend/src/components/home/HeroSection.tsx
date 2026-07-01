"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Database, Brain, Workflow, LineChart, Shield, Zap, TrendingUp, Activity, CheckCircle2, Sparkles, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-black pt-24 pb-32 xl:pt-36 xl:pb-40">
      {/* Premium Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50rem] bg-gradient-to-b from-blue-500/20 via-purple-500/10 to-transparent dark:from-blue-500/10 dark:via-purple-500/5 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50/50 px-3 py-1 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            Enterprise AI Analytics Platform
          </motion.div>

          {/* Headlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl space-y-4"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white">
              Built for Modern <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Data-Driven Teams
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Unify analytics, reporting, AI insights, predictions, workflows, and governance into a single intelligent platform.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <Button render={<Link href="/auth/register" />} nativeButton={false} size="lg" className="rounded-full px-8 h-12 text-base w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-0">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base w-full sm:w-auto dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
              <Play className="mr-2 h-4 w-4" /> Live Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 font-medium"
          >
            <Link href="#architecture" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">View Architecture</Link>
            <span className="h-4 w-px bg-zinc-300 dark:bg-zinc-800"></span>
            <Link href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Explore Features</Link>
          </motion.div>

          {/* Hero Visual - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-6xl mt-16 relative"
          >
            <div className="relative rounded-xl md:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
              {/* Fake Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 h-[400px] md:h-[600px] bg-zinc-50 dark:bg-zinc-950 rounded-b-lg">
                
                {/* Sidebar */}
                <div className="hidden md:flex col-span-2 flex-col gap-4 border-r border-zinc-200 dark:border-zinc-800 pr-4">
                  {[
                    { icon: LineChart, label: "Analytics", active: true },
                    { icon: Brain, label: "AI Insights" },
                    { icon: Zap, label: "Predictions" },
                    { icon: Workflow, label: "Workflows" },
                    { icon: Database, label: "Data Sources" },
                    { icon: Shield, label: "Governance" },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-sm font-medium ${item.active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="col-span-1 md:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  {/* Top Stats */}
                  <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 shadow-sm hover:border-blue-500/30 transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        <span>Total ARR</span>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mt-1">$2,480,500</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                        <TrendingUp className="h-3 w-3" /> +18.4% vs last Q
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 shadow-sm hover:border-blue-500/30 transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        <span>Active AI Pipelines</span>
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mt-1">142 / 144</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 font-medium">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping mr-1"></span> 99.9% Uptime
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 shadow-sm hover:border-blue-500/30 transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        <span>System Anomalies</span>
                        <CheckCircle2 className="h-4 w-4 text-teal-500" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mt-1">0 Detected</div>
                      <div className="text-xs text-teal-600 dark:text-teal-400 flex items-center gap-1 mt-1 font-medium">
                        Optimal health
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 shadow-sm hover:border-blue-500/30 transition-all">
                      <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        <span>Forecast Accuracy</span>
                        <Brain className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mt-1">98.7%</div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1 font-medium">
                        <Sparkles className="h-3 w-3" /> AI Model v4.2
                      </div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="md:col-span-2 bg-white dark:bg-zinc-900/90 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
                     <div className="flex items-center justify-between mb-4 relative z-10">
                       <div>
                         <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                           Revenue Forecast vs Actuals
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">Live Stream</span>
                         </h4>
                         <p className="text-xs text-zinc-500 dark:text-zinc-400">AI predictions with 95% confidence interval</p>
                       </div>
                       <div className="flex gap-2 text-xs font-medium">
                         <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Actual</span>
                         <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Forecast</span>
                       </div>
                     </div>

                     {/* High Fidelity Interactive Chart SVG */}
                     <div className="relative h-48 w-full my-2">
                       <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 150">
                         <defs>
                           <linearGradient id="actualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                             <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                           </linearGradient>
                           <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                             <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                             <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                           </linearGradient>
                         </defs>
                         
                         {/* Grid Lines */}
                         <line x1="0" y1="30" x2="400" y2="30" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeDasharray="4 4" />
                         <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeDasharray="4 4" />
                         <line x1="0" y1="120" x2="400" y2="120" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeDasharray="4 4" />

                         {/* Actual Area & Line */}
                         <path d="M 0 130 Q 50 110 100 115 T 200 80 T 260 50 L 260 150 L 0 150 Z" fill="url(#actualGradient)" />
                         <path d="M 0 130 Q 50 110 100 115 T 200 80 T 260 50" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                         
                         {/* Forecast Area & Line */}
                         <path d="M 260 50 Q 310 25 350 35 T 400 15 L 400 150 L 260 150 Z" fill="url(#forecastGradient)" />
                         <path d="M 260 50 Q 310 25 350 35 T 400 15" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" />

                         {/* Data Points / Glowing Markers */}
                         <circle cx="100" cy="115" r="4" className="fill-white stroke-blue-500 stroke-2" />
                         <circle cx="200" cy="80" r="4" className="fill-white stroke-blue-500 stroke-2" />
                         <circle cx="260" cy="50" r="5" className="fill-blue-500 animate-pulse" />
                         <circle cx="350" cy="35" r="4" className="fill-white stroke-purple-500 stroke-2" />
                         <circle cx="400" cy="15" r="5" className="fill-purple-500 animate-pulse" />
                       </svg>

                       {/* Interactive Tooltip Card inside chart */}
                       <div className="absolute top-2 right-12 bg-white/95 dark:bg-zinc-800/95 backdrop-blur border border-purple-500/30 p-2.5 rounded-lg shadow-xl text-[11px] animate-bounce duration-1000">
                         <div className="font-semibold text-purple-600 dark:text-purple-300 flex items-center gap-1">
                           <Sparkles className="h-3 w-3" /> Forecasted High
                         </div>
                         <div className="text-zinc-700 dark:text-zinc-200 font-bold mt-0.5">$312,400 (Q3 Target)</div>
                       </div>
                     </div>

                     <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                       <span>Jan 1</span>
                       <span>Feb 1</span>
                       <span>Mar 1 (Today)</span>
                       <span>Apr 1 (Est)</span>
                       <span>May 1 (Est)</span>
                     </div>
                  </div>

                  {/* AI Insights Sidebar Feed */}
                  <div className="md:col-span-1 bg-gradient-to-b from-blue-50/60 to-white dark:from-blue-950/20 dark:to-zinc-900/90 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100 dark:border-blue-900/40">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Live AI Copilot</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="space-y-2.5 overflow-hidden text-left">
                      <div className="p-2.5 bg-white dark:bg-zinc-800/90 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 text-xs shadow-sm">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold">Alert</span>
                          Churn Risk Auto-Mitigated
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          3 enterprise accounts flagged for usage drop. Automated re-engagement sequence sent.
                        </p>
                      </div>

                      <div className="p-2.5 bg-white dark:bg-zinc-800/90 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 text-xs shadow-sm">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold">Action</span>
                          Query Index Optimized
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          AWS RDS latency reduced by <strong className="text-emerald-600 dark:text-emerald-400">34ms</strong> automatically via autonomous index tuning.
                        </p>
                      </div>

                      <div className="p-2.5 bg-white dark:bg-zinc-800/90 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 text-xs shadow-sm">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold">Insight</span>
                          Q3 Forecast Revised Up
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          North America pipeline velocity indicates <strong className="text-purple-600 dark:text-purple-400">+12.5%</strong> YoY growth.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Element - Prediction Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 md:-right-8 top-1/4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl w-48 md:w-64 hidden sm:block backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Churn Prediction</span>
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">8.4%</div>
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  ↓ 2.1% improvement
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
