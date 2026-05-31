"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

export function FAQSection({ isDarkMode }: { isDarkMode: boolean }) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the platform secure my business data?",
      a: "Every upload is isolated via Row-Level Security (RLS) in Supabase and encrypted at rest using AES-256. Our backend contains active checks against Path Traversal, Zip Bombs, and malicious code injection."
    },
    {
      q: "Can I self-host the n8n automation pipelines?",
      a: "Yes. The platform provides full support for custom webhook endpoints, enabling you to integrate either with our hosted n8n platform or connect seamlessly to your own self-hosted n8n infrastructure."
    },
    {
      q: "What AI models are powering the recommendations engine?",
      a: "We natively integrate the Gemini API utilizing context caching, ensuring highly optimized context structures and minimal token wastage for complex datasets and tabular reasoning."
    },
    {
      q: "What is the difference between Pro and Enterprise plans?",
      a: "Pro unlocks standard AI insights, SQL generation, and chat tools. Enterprise activates predictive algorithms (XGBoost, Scikit-learn) for direct model fitting, anomaly alerts, and SLA guarantees."
    }
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-6 py-20 z-10 relative">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`border rounded-xl overflow-hidden transition-all ${isDarkMode ? "bg-zinc-900/30 border-zinc-800/50" : "bg-white border-slate-200"}`}>
              <button 
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-cyan-500/5 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm">
                  <HelpCircle className="h-4.5 w-4.5 text-cyan-500 flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${activeFAQ === idx ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {activeFAQ === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`px-5 pb-5 pt-1 text-sm border-t leading-relaxed ${isDarkMode ? "text-zinc-400 border-zinc-800/30" : "text-slate-650 border-slate-100"}`}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
