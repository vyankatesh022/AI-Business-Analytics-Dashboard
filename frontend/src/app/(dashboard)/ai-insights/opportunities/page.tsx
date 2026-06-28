"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccountStore } from '@/store/account-store';
import { fetchInsights } from '@/features/ai-insights/api/mocks';
import { InsightCardData } from '@/features/ai-insights/types';
import { InsightCard } from '@/features/ai-insights/components/cards/InsightCard';
import { Target } from 'lucide-react';

export default function OpportunitiesPage() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const [insights, setInsights] = useState<InsightCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    fetchInsights(accountId)
      .then(data => setInsights(data.filter(i => ['revenue', 'growth'].includes(i.type))))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeAccount]);

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-slate-200 rounded w-64 mb-8"></div></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Opportunities</h1>
        </div>
        <p className="text-slate-500">AI-identified areas for revenue, growth, and retention improvement.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <InsightCard key={insight.id} insight={insight} index={idx} />
        ))}
        {insights.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No opportunities currently identified.
          </div>
        )}
      </div>
    </div>
  );
}
