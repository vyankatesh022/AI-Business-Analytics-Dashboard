"use client";

import { motion } from "framer-motion";
import { LineChart, BarChart3, PieChart, Activity, Users, DollarSign } from "lucide-react";

export function AnalyticsShowcase() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-black relative border-t border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            Real-Time Analytics that Drive Action
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            Dive deep into your revenue, retention, and user behavior with sub-second queries powered by our high-performance analytics engine.
          </motion.p>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-6xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
                <button className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 rounded shadow-sm text-zinc-900 dark:text-zinc-100">Overview</button>
                <button className="px-3 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Revenue</button>
                <button className="px-3 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Retention</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-8 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800"></div>
               <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white"><Activity className="h-4 w-4"/></div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-zinc-50/50 dark:bg-zinc-950/50">
            
            {/* KPI Cards */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: "$2.4M", trend: "+12.5%", icon: DollarSign },
                { label: "Active Users", value: "84.2K", trend: "+5.2%", icon: Users },
                { label: "Conversion Rate", value: "3.24%", trend: "-0.4%", icon: Activity },
                { label: "Avg Session", value: "4m 12s", trend: "+1.2%", icon: Activity },
              ].map((kpi, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col justify-between hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{kpi.label}</span>
                    <kpi.icon className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">{kpi.value}</span>
                    <span className={`text-xs font-medium ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{kpi.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Chart */}
            <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl relative min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Revenue Growth</h3>
                  <p className="text-xs text-zinc-500">Trailing 12 months</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1 text-xs text-zinc-500"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Current</div>
                   <div className="flex items-center gap-1 text-xs text-zinc-500"><span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span> Previous</div>
                </div>
              </div>
              
              {/* Fake SVG Chart */}
              <div className="flex-1 relative w-full h-full">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                   <path d="M0,80 Q10,70 20,75 T40,60 T60,50 T80,40 T100,20" fill="none" stroke="#3b82f6" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                   <path d="M0,90 Q10,85 20,88 T40,80 T60,75 T80,70 T100,65" fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                   
                   {/* Gradient Fill under primary line */}
                   <path d="M0,80 Q10,70 20,75 T40,60 T60,50 T80,40 T100,20 L100,100 L0,100 Z" fill="url(#blue-gradient)" opacity="0.2" />
                   <defs>
                     <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#3b82f6" />
                       <stop offset="100%" stopColor="transparent" />
                     </linearGradient>
                   </defs>
                </svg>
              </div>
            </div>

            {/* Sidebar Charts */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Traffic Sources</h3>
                <div className="flex-1 relative flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-[16px] border-blue-500 border-r-purple-500 border-b-emerald-500 border-l-amber-500"></div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Conversion Funnel</h3>
                <div className="flex-1 flex flex-col justify-end gap-2">
                  <div className="w-full h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center px-2 text-xs text-blue-700 dark:text-blue-300">View (100k)</div>
                  <div className="w-4/5 h-8 bg-blue-200 dark:bg-blue-800/40 rounded flex items-center px-2 text-xs text-blue-800 dark:text-blue-200">Signup (40k)</div>
                  <div className="w-2/5 h-8 bg-blue-300 dark:bg-blue-700/50 rounded flex items-center px-2 text-xs text-blue-900 dark:text-blue-100">Activate (15k)</div>
                  <div className="w-1/5 h-8 bg-blue-500 rounded flex items-center px-2 text-xs text-white">Paid (3.2k)</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
