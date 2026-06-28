"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccountStore } from '@/store/account-store';
import { fetchBusinessHealth } from '@/features/ai-insights/api/mocks';
import { BusinessHealthScore } from '@/features/ai-insights/types';
import { Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { useAiCopilot } from '@/features/ai-copilot/context/AiCopilotContext';
import { toast } from 'sonner';

export default function BusinessHealthPage() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const { toggleCopilot } = useAiCopilot();
  const [health, setHealth] = useState<BusinessHealthScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    fetchBusinessHealth(accountId)
      .then(setHealth)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeAccount]);

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-slate-200 rounded w-64 mb-8"></div></div>;
  if (!health) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mt-12">
          <Activity className="w-12 h-12 text-indigo-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No health data available</h3>
          <p className="text-slate-500 max-w-sm mt-1">There is no business health score calculated for this workspace yet.</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-6 h-6 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="w-6 h-6 text-rose-500" />;
    return <Minus className="w-6 h-6 text-slate-500" />;
  };

  const chartData = [
    { subject: 'Revenue', A: health.categories.revenue, fullMark: 100 },
    { subject: 'Growth', A: health.categories.growth, fullMark: 100 },
    { subject: 'Engagement', A: health.categories.engagement, fullMark: 100 },
    { subject: 'Retention', A: health.categories.retention, fullMark: 100 },
    { subject: 'Operations', A: health.categories.operations, fullMark: 100 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Health</h1>
        <p className="text-slate-500">Holistic AI assessment of your organization's performance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity className="w-32 h-32" />
            </div>
            <h2 className="text-indigo-100 font-medium uppercase tracking-wider text-sm mb-6">Overall Score</h2>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-7xl font-bold tracking-tighter">{health.overall}</span>
              <span className="text-2xl text-indigo-200 font-medium pb-2">/ 100</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 w-fit backdrop-blur-sm mb-6">
              {getTrendIcon(health.trend)}
              <span className="font-medium">Trending {health.trend}</span>
            </div>
            
            <button 
              onClick={() => {
                toast.info("Generating improvement plan...");
                setTimeout(() => {
                  toggleCopilot();
                  toast.success("Improvement plan ready in AI Copilot");
                }, 500);
              }}
              className="w-full py-3 px-4 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Generate Improvement Plan
            </button>
          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-slate-900 mb-4">Category Breakdown</h3>
            {Object.entries(health.categories).map(([key, val], i) => (
              <div key={key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <span className="capitalize font-medium text-slate-600">{key}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", val >= 80 ? "bg-emerald-500" : val >= 60 ? "bg-amber-500" : "bg-rose-500")}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 w-8 text-right">{val}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-8">Performance Radar</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 14, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
