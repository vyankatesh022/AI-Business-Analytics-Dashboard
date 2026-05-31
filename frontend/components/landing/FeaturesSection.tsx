"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, BarChart3, BrainCircuit } from "lucide-react";

export function FeaturesSection({ isDarkMode }: { isDarkMode: boolean }) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-12 sm:px-8 z-10 border-t border-zinc-900/40">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Clean Architecture. Zero Trust Security.
        </h2>
        <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm">
          Our engineering foundation maps against distinct AppSec validations to ensure absolute data isolation.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4 }}
          className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 mb-6">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Automated Clean & Parse</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Asynchronously removes duplicates, corrects datatypes, cleans outlier gaps, and intercepts suspicious MIME payloads before storage updates.
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4 }}
          className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 mb-6">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Interactive EDA Pipelines</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Generate highly fluid distributions, correlations, scatter systems, and heatmaps structured inside reactive client-side dashboard panels.
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          whileHover={{ y: -4 }}
          className={`border p-8 rounded-2xl text-left transition-all ${isDarkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 mb-6">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">Asynchronous ML Forecasting</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Unlock robust predictive model configurations (XGBoost, Scikit-learn) calculating customer expansion rates and future churn windows.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
