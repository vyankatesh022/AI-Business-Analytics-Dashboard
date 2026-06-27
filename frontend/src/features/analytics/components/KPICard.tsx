import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useCalculateKPI } from '../api';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface KPICardProps {
  id: string;
  title: string;
  className?: string;
}

// Mock sparkline data since the API just returns the aggregated value
const mockSparklineData = Array.from({ length: 20 }, () => ({
  value: Math.floor(Math.random() * 100) + 50,
}));

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function KPICard({ id, title, className }: KPICardProps) {
  const { data, isLoading, error } = useCalculateKPI(id);

  if (isLoading) {
    return (
      <div className={cn("p-6 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse", className)}>
        <div className="h-4 bg-zinc-800 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-zinc-800 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-zinc-800 rounded w-full"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn("p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center", className)}>
        <p className="text-zinc-500 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Failed to load KPI
        </p>
      </div>
    );
  }

  const isPositive = (data.trend || 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("relative overflow-hidden p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 group hover:border-zinc-700 transition-colors", className)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
        {data.trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(data.trend)}%
          </div>
        )}
      </div>

      <div className="text-3xl font-semibold text-white mb-6">
        {new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(data.value)}
      </div>

      <div className="h-12 w-full opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockSparklineData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#34d399" : "#fb7185"} 
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
