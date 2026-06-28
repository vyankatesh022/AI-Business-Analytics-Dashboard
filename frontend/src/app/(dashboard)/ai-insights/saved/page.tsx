"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInsightsStore } from '@/features/ai-insights/store/insights-store';
import { InsightCard } from '@/features/ai-insights/components/cards/InsightCard';
import { Bookmark } from 'lucide-react';

export default function SavedInsightsPage() {
  const { savedInsights } = useInsightsStore();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <Bookmark className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Saved Insights</h1>
        </div>
        <p className="text-slate-500">Your bookmarked and saved AI insights for quick access.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedInsights.map((insight, idx) => (
          <InsightCard key={insight.id} insight={insight} index={idx} />
        ))}
        {savedInsights.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No saved insights. Click the bookmark icon on any insight card to save it here.
          </div>
        )}
      </div>
    </div>
  );
}
