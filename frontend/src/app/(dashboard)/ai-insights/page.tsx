"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MetricCard } from '@/features/ai-insights/components/cards/MetricCard';
import { InsightCard } from '@/features/ai-insights/components/cards/InsightCard';
import { useAccountStore } from '@/store/account-store';
import { fetchExecutiveSummary, fetchInsights } from '@/features/ai-insights/api/mocks';
import { ExecutiveSummaryMetrics, InsightCardData } from '@/features/ai-insights/types';
import { DollarSign, TrendingUp, Users, AlertTriangle, Activity } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AiInsightsCenter() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const [summary, setSummary] = useState<ExecutiveSummaryMetrics | null>(null);
  const [insights, setInsights] = useState<InsightCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    Promise.all([
      fetchExecutiveSummary(accountId),
      fetchInsights(accountId)
    ])
    .then(([s, i]) => {
      setSummary(s);
      setInsights(i.slice(0, 4)); // top 4 insights
    })
    .catch(console.error)
    .finally(() => setIsLoading(false));
    
  }, [activeAccount]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-96 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Insights Center</h1>
          <p className="text-slate-500 font-medium">AI-powered business intelligence and recommendations</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={() => {
              toast.promise(
                new Promise(resolve => setTimeout(resolve, 2000)),
                {
                  loading: 'Generating AI Insights Report...',
                  success: 'Report generated successfully!',
                  error: 'Failed to generate report'
                }
              );
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200"
          >
            Generate Report
          </Button>
        </motion.div>
      </div>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-800">Executive Summary</h2>
        {!summary ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <Activity className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No summary data available</h3>
            <p className="text-slate-500 max-w-sm mt-1">We couldn't generate a summary for this workspace at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
              title="Revenue"
              value={`$${(summary.revenue || 0).toLocaleString()}`}
              icon={DollarSign}
              trend={12.4}
              index={0}
              href="/ai-insights/opportunities"
            />
            <MetricCard
              title="Growth"
              value={`${summary.growth || 0}%`}
              icon={TrendingUp}
              trend={2.1}
              index={1}
              href="/ai-insights/opportunities"
            />
            <MetricCard
              title="Retention"
              value={`${summary.retention || 0}%`}
              icon={Users}
              trend={0.5}
              index={2}
              href="/ai-insights/recommendations"
            />
            <MetricCard
              title="Churn"
              value={`${summary.churn || 0}%`}
              icon={AlertTriangle}
              trend={-0.3}
              invertedTrend
              index={3}
              href="/ai-insights/risk-center"
            />
            <MetricCard
              title="Risk Score"
              value={summary.risk || 0}
              icon={Activity}
              subtitle="0-100 scale (lower is better)"
              index={4}
              href="/ai-insights/business-health"
            />
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Top Insights</h2>
          <Link 
            href="/ai-insights/recommendations" 
            className={buttonVariants({ variant: "ghost", className: "text-indigo-600 font-medium" })}
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight, idx) => (
            <InsightCard key={insight.id} insight={insight} index={idx} />
          ))}
          {insights.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <Activity className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No top insights</h3>
              <p className="text-slate-500 max-w-sm mt-1">Check back later or generate a report to analyze your current data.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
