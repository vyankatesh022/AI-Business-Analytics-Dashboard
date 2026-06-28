"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInsightsStore } from '@/features/ai-insights/store/insights-store';
import { InsightCard } from '@/features/ai-insights/components/cards/InsightCard';
import { History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InsightHistoryPage() {
  const { insightHistory, clearHistory } = useInsightsStore();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Insight History</h1>
          </div>
          <p className="text-slate-500">A log of all past insights generated for your account.</p>
        </div>

        {insightHistory.length > 0 && (
          <Button onClick={clearHistory} variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightHistory.map((insight, idx) => (
          <InsightCard key={`${insight.id}-${idx}`} insight={insight} index={idx} />
        ))}
        {insightHistory.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No history recorded yet. New insights will appear here when generated.
          </div>
        )}
      </div>
    </div>
  );
}
