import React from 'react';
import { useCalculateCohort } from '../api';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Activity } from 'lucide-react';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface CohortHeatmapProps {
  id: string;
  title: string;
  className?: string;
}

export function CohortHeatmap({ id, title, className }: CohortHeatmapProps) {
  const { data, isLoading, error } = useCalculateCohort(id);

  if (isLoading) {
    return (
      <div className={cn("p-6 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse", className)}>
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-6"></div>
        <div className="h-40 bg-zinc-800 rounded w-full"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn("p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center", className)}>
        <p className="text-zinc-500 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Failed to load Cohort data
        </p>
      </div>
    );
  }

  // Group data by cohort_date
  const cohorts: Record<string, typeof data> = {};
  data.forEach(item => {
    if (!cohorts[item.cohort_date]) cohorts[item.cohort_date] = [];
    cohorts[item.cohort_date].push(item);
  });

  const cohortDates = Object.keys(cohorts).sort();
  const maxPeriod = Math.max(...data.map(d => d.period));
  const periods = Array.from({ length: maxPeriod + 1 }, (_, i) => i);

  // Color generator based on retention (higher is more blue/indigo)
  const getBackgroundColor = (retention: number) => {
    if (retention >= 90) return 'bg-indigo-500 text-white';
    if (retention >= 70) return 'bg-indigo-500/80 text-white';
    if (retention >= 50) return 'bg-indigo-500/60 text-white';
    if (retention >= 30) return 'bg-indigo-500/40 text-indigo-100';
    if (retention >= 10) return 'bg-indigo-500/20 text-indigo-200';
    return 'bg-indigo-500/5 text-zinc-400';
  };

  return (
    <div className={cn("p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 overflow-x-auto", className)}>
      <h3 className="text-lg font-medium text-white mb-6">{title}</h3>
      
      <table className="w-full text-left text-sm whitespace-nowrap border-spacing-1 border-separate">
        <thead>
          <tr>
            <th className="font-medium text-zinc-400 px-2 py-1 w-32">Cohort</th>
            <th className="font-medium text-zinc-400 px-2 py-1 w-24">Users</th>
            {periods.map(p => (
              <th key={p} className="font-medium text-zinc-400 px-2 py-1 text-center w-16">Day {p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohortDates.map(date => {
            const row = cohorts[date];
            const users = row.find(r => r.period === 0)?.users || 0;
            return (
              <tr key={date}>
                <td className="text-zinc-300 px-2 py-2 font-medium">{date}</td>
                <td className="text-zinc-400 px-2 py-2">{users}</td>
                {periods.map(p => {
                  const cell = row.find(r => r.period === p);
                  if (!cell) return <td key={p} className="px-1 py-1"><div className="w-full h-8 rounded bg-zinc-800/30"></div></td>;
                  return (
                    <td key={p} className="px-1 py-1">
                      <div className={cn("w-full h-8 rounded flex items-center justify-center font-medium", getBackgroundColor(cell.retention_rate))}>
                        {cell.retention_rate.toFixed(1)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
