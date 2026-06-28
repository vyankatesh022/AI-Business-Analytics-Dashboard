"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccountStore } from '@/store/account-store';
import { fetchInsights } from '@/features/ai-insights/api/mocks';
import { InsightCardData } from '@/features/ai-insights/types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAiCopilot } from '@/features/ai-copilot/context/AiCopilotContext';
import { toast } from 'sonner';

export default function RiskCenterPage() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const { toggleCopilot } = useAiCopilot();
  const [risks, setRisks] = useState<InsightCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    fetchInsights(accountId)
      .then(data => setRisks(data.filter(i => i.severity && ['High', 'Critical', 'Medium'].includes(i.severity))))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeAccount]);

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-slate-200 rounded w-64 mb-8"></div></div>;

  const groupedRisks = {
    Critical: risks.filter(r => r.severity === 'Critical'),
    High: risks.filter(r => r.severity === 'High'),
    Medium: risks.filter(r => r.severity === 'Medium'),
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 text-red-700 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI Risk Center</h1>
        </div>
        <p className="text-slate-500">Categorized operational and business risks requiring attention.</p>
      </motion.div>

      <div className="space-y-6">
        {Object.entries(groupedRisks).map(([severity, items]) => {
          if (items.length === 0) return null;
          return (
            <motion.div key={severity} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${severity === 'Critical' ? 'text-red-600' : severity === 'High' ? 'text-orange-500' : 'text-amber-500'}`} />
                <h2 className="font-semibold text-slate-800">{severity} Severity Risks</h2>
                <span className="ml-auto bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
                  {items.length} detected
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map(risk => (
                  <div key={risk.id} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{risk.title}</h3>
                      <p className="text-slate-600 text-sm mb-2">{risk.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {risk.sourceMetrics.map(m => (
                          <span key={m} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        toast.info(`Investigating: ${risk.title}`);
                        setTimeout(() => {
                          toggleCopilot();
                          toast.success("AI Copilot opened with context");
                        }, 500);
                      }}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      Investigate
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
        {risks.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No risks detected</h3>
            <p className="text-slate-500 max-w-sm mt-1">Your business metrics are currently showing no significant risk factors.</p>
          </div>
        )}
      </div>
    </div>
  );
}
