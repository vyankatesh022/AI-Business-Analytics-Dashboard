"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
  subtitle?: string;
  className?: string;
  index?: number;
  trendLabel?: string;
  invertedTrend?: boolean; // if true, down is good (e.g. churn)
  href?: string;
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  subtitle, 
  className, 
  index = 0,
  trendLabel = 'vs last month',
  invertedTrend = false,
  href
}: MetricCardProps) {
  
  const isPositive = trend !== undefined && trend > 0;
  const isGood = invertedTrend ? !isPositive : isPositive;

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group h-full",
        href && "cursor-pointer hover:border-indigo-200 hover:ring-1 hover:ring-indigo-100",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
        <Icon className="w-24 h-24 text-indigo-900" />
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        </div>
        
        {trend !== undefined && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={cn(
              "font-medium px-2 py-0.5 rounded-full flex items-center",
              isGood ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
            )}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-slate-400">{trendLabel}</span>
          </div>
        )}
        {subtitle && !trend && (
          <div className="mt-2 text-sm text-slate-400 font-medium">
            {subtitle}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
