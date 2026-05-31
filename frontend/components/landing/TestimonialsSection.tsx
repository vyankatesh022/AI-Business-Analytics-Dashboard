"use client";

import React from "react";
import { motion } from "framer-motion";

export function TestimonialsSection({ isDarkMode }: { isDarkMode: boolean }) {
  const testimonials = [
    {
      name: "Marcus Vance",
      role: "VP of Growth, RetailFlow",
      quote: "Vibe Analytics caught a 14% cart leakage trend within 3 hours of setup. The automated n8n pipeline was live by that afternoon.",
      growth: "+14.2% Cart Recovery"
    },
    {
      name: "Elena Rostova",
      role: "CTO, SaaSGrow Inc.",
      quote: "The Gemini API grounding and context caching keeps our token usage minimal. Tabular insights are compiled directly and accurately.",
      growth: "80% AI Token Savings"
    },
    {
      name: "Sanjay Patel",
      role: "Head of Operations, FinStream",
      quote: "Zero trust controls are critical for our data. Row-Level Security and secure inputs filters gave our AppSec team complete peace of mind.",
      growth: "Zero Security Vulnerabilities"
    }
  ];

  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10 border-t border-zinc-900/40">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Proven Growth Outcomes
        </h2>
        <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
          Read how SaaS developers and growth leaders utilize our asynchronous pipelines to catch leakages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
        {testimonials.map((t, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -3 }}
            className={`border p-6 rounded-2xl flex flex-col justify-between transition-all ${
              isDarkMode ? "bg-zinc-900/30 border-zinc-800/50" : "bg-white border-slate-150 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-cyan-500 bg-cyan-500/5 border border-cyan-500/15 px-2 py-0.5 rounded font-bold">
                  {t.growth}
                </span>
                <span className="text-amber-500 text-xs">★★★★★</span>
              </div>
              <p className={`text-sm italic leading-relaxed ${isDarkMode ? "text-zinc-300" : "text-slate-650"}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
            
            <div className="mt-6 border-t border-zinc-850 pt-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-cyan-500">
                {t.name[0]}
              </div>
              <div>
                <div className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t.name}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
