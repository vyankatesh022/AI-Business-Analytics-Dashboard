"use client";

import { motion } from "framer-motion";
import { LineChart, BarChart, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

export function PredictionsShowcase() {
  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4" />
              <span>Predictive Intelligence</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
            >
              Predict Outcomes Before They Happen
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-zinc-400 mb-8"
            >
              Move from reactive analytics to proactive strategy. Our forecasting models predict revenue, churn, demand, and growth with statistical confidence intervals.
            </motion.p>

            <motion.ul 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {[
                "Revenue Forecasting (Next 4 Quarters)",
                "Proactive Churn Prediction (90-day window)",
                "Demand Forecasting & Resource Planning",
                "Growth Trajectory Modeling",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-zinc-300">
                  <div className="h-2 w-2 bg-amber-500 rounded-full" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right Visual Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative z-10 backdrop-blur-xl">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold">Revenue Forecast Q3-Q4</h3>
                  <p className="text-sm text-zinc-500">95% Confidence Interval</p>
                </div>
                <div className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded">
                  Prophet Algorithm
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="h-64 w-full relative mb-6">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#3f3f46" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#3f3f46" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#3f3f46" strokeDasharray="2 2" strokeWidth="0.5" />
                  
                  {/* Historical Data (Solid) */}
                  <path d="M0,80 L20,70 L40,65 L50,55" fill="none" stroke="#e4e4e7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  
                  {/* Predicted Data (Dashed) */}
                  <path d="M50,55 L65,45 L80,30 L100,20" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                  
                  {/* Confidence Interval Fill */}
                  <path d="M50,55 L65,35 L80,15 L100,5 L100,35 L80,45 L65,55 Z" fill="#f59e0b" opacity="0.1" />
                  
                  {/* Divider */}
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#71717a" strokeDasharray="4 4" strokeWidth="1" />
                </svg>
                
                <div className="absolute top-0 left-[20%] text-xs text-zinc-500">Historical</div>
                <div className="absolute top-0 left-[60%] text-xs text-amber-500">Predicted</div>
              </div>

              {/* AI Explanation Card */}
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 flex gap-4 items-start">
                <div className="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400 shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">AI Explanation</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Based on current sales pipeline velocity and historical Q3 seasonality, the model predicts an upper bound of $3.2M ARR. Confidence is high (95%) due to low variance in recent enterprise closes.
                  </p>
                </div>
              </div>

            </div>

            {/* Decorative background card */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-zinc-800 rounded-2xl border border-zinc-700 -z-10 opacity-50" />

          </motion.div>

        </div>
      </div>
    </section>
  );
}
