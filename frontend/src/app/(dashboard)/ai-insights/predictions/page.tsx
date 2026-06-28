"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccountStore } from '@/store/account-store';
import { fetchPredictions } from '@/features/ai-insights/api/mocks';
import { PredictionInsight } from '@/features/ai-insights/types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAiCopilot } from '@/features/ai-copilot/context/AiCopilotContext';
import { toast } from 'sonner';

export default function PredictionsPage() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const { toggleCopilot } = useAiCopilot();
  const [predictions, setPredictions] = useState<PredictionInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    fetchPredictions(accountId)
      .then(setPredictions)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeAccount]);

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-slate-200 rounded w-64 mb-8"></div></div>;

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpRight className="w-5 h-5 text-emerald-500" />;
    if (trend === 'down') return <ArrowDownRight className="w-5 h-5 text-rose-500" />;
    return <Minus className="w-5 h-5 text-slate-500" />;
  };

  // Mock data for the chart to represent a forecast
  const generateChartData = (current: number, forecast: number) => {
    const data = [];
    const diff = (forecast - current) / 6;
    for (let i = 0; i < 6; i++) {
      data.push({ month: `M-${5 - i}`, value: current - diff * (5 - i) });
    }
    data.push({ month: 'Current', value: current });
    for (let i = 1; i <= 3; i++) {
      data.push({ month: `M+${i}`, value: current + diff * i, forecast: true });
    }
    return data;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Prediction Insights</h1>
        </div>
        <p className="text-slate-500">AI-forecasted trends for key business metrics.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {predictions.map((pred, idx) => {
          const chartData = generateChartData(pred.currentValue, pred.forecastValue);
          return (
            <motion.div key={pred.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 text-lg">{pred.metric}</h3>
                  <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    {pred.type}
                  </div>
                </div>
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">
                    {pred.currentValue > 1000 ? `$${(pred.currentValue / 1000).toFixed(1)}k` : pred.currentValue}
                  </span>
                  <div className="flex items-center gap-1 mb-1 bg-slate-50 px-2 py-1 rounded-md">
                    {getTrendIcon(pred.trend)}
                    <span className="text-sm font-medium text-slate-700">
                      Proj: {pred.forecastValue > 1000 ? `$${(pred.forecastValue / 1000).toFixed(1)}k` : pred.forecastValue}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">Confidence Interval: {pred.confidenceInterval[0]} - {pred.confidenceInterval[1]}</p>
              </div>

              <div className="h-48 w-full p-4 bg-slate-50/50">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`colorValue${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill={`url(#colorValue${idx})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-indigo-50/50 mt-auto border-t border-indigo-100 flex items-center justify-between">
                <p className="text-sm text-indigo-900 font-medium leading-relaxed max-w-[70%]">
                  <span className="font-bold mr-2">AI Analysis:</span>
                  {pred.explanation}
                </p>
                <button 
                  onClick={() => {
                    toast.info(`Analyzing prediction model for: ${pred.metric}`);
                    setTimeout(() => {
                      toggleCopilot();
                      toast.success("AI Copilot opened with context");
                    }, 500);
                  }}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap px-4 py-2 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200 shadow-sm"
                >
                  Analyze Model
                </button>
              </div>
            </motion.div>
          );
        })}
        {predictions.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <TrendingUp className="w-12 h-12 text-indigo-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No predictions available</h3>
            <p className="text-slate-500 max-w-sm mt-1">There is not enough historical data to generate accurate AI predictions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
