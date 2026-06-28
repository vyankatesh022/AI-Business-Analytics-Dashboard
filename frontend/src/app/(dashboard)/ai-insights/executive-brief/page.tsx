"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccountStore } from '@/store/account-store';
import { fetchExecutiveBrief } from '@/features/ai-insights/api/mocks';
import { ExecutiveBrief } from '@/features/ai-insights/types';
import { FileText, ArrowUpRight, AlertCircle, Target, Sparkles, MessageSquare } from 'lucide-react';
import { useAiCopilot } from '@/features/ai-copilot/context/AiCopilotContext';
import { toast } from 'sonner';

export default function ExecutiveBriefPage() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const { toggleCopilot } = useAiCopilot();
  const [brief, setBrief] = useState<ExecutiveBrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    fetchExecutiveBrief(accountId, 'daily')
      .then(setBrief)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeAccount]);

  if (isLoading) {
    return <div className="p-8 animate-pulse"><div className="h-8 bg-slate-200 rounded w-64 mb-8"></div></div>;
  }

  if (!brief) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mt-12">
          <FileText className="w-12 h-12 text-indigo-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No executive brief available</h3>
          <p className="text-slate-500 max-w-sm mt-1">There is no brief generated for this workspace today.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Executive Brief</h1>
        </div>
        <p className="text-slate-500">Generated {new Date(brief.generatedAt).toLocaleDateString()}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
        
        <div className="flex items-start justify-between">
          <section className="flex-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Summary</h2>
            <p className="text-lg text-slate-800 leading-relaxed font-medium pr-8">{brief.summary}</p>
          </section>
          
          <button 
            onClick={() => {
              toast.info("Preparing executive brief context...");
              setTimeout(() => {
                toggleCopilot();
                toast.success("Ready to discuss brief in AI Copilot");
              }, 500);
            }}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg font-medium transition-colors border border-indigo-100"
          >
            <MessageSquare className="w-4 h-4" />
            Discuss Brief
          </button>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Changes</h2>
          </div>
          <ul className="space-y-3">
            {brief.keyChanges.map((change, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Risks</h2>
          </div>
          <ul className="space-y-3">
            {brief.risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Opportunities</h2>
          </div>
          <ul className="space-y-3">
            {brief.opportunities.map((opp, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">AI Recommendations</h2>
          </div>
          <ul className="space-y-4">
            {brief.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-indigo-800 font-medium bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                <span className="text-indigo-400 font-bold">{i + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        
      </motion.div>
    </div>
  );
}
