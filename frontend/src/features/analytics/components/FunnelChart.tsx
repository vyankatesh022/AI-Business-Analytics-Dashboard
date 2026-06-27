import React from 'react';
import { useCalculateFunnel } from '../api';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface FunnelChartProps {
  id: string;
  title: string;
  className?: string;
}

const COLORS = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'];

export function FunnelChart({ id, title, className }: FunnelChartProps) {
  const { data, isLoading, error } = useCalculateFunnel(id);

  if (isLoading) {
    return (
      <div className={cn("p-6 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse", className)}>
        <div className="h-6 bg-zinc-800 rounded w-1/4 mb-6"></div>
        <div className="h-[300px] bg-zinc-800 rounded w-full"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn("p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center", className)}>
        <p className="text-zinc-500 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Failed to load Funnel
        </p>
      </div>
    );
  }

  // Calculate dropoff
  const enrichedData = data.map((step, index) => {
    const previousUsers = index === 0 ? step.users : data[index - 1].users;
    const dropoff = index === 0 ? 0 : 100 - (step.users / previousUsers) * 100;
    return {
      ...step,
      dropoff: dropoff.toFixed(1)
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 font-medium mb-2">{data.step_name}</p>
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="text-zinc-400">Users:</span>
            <span className="text-white font-medium">{data.users}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="text-zinc-400">Conversion Rate:</span>
            <span className="text-emerald-400 font-medium">{data.conversion_rate.toFixed(1)}%</span>
          </div>
          {Number(data.dropoff) > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-400">Drop-off:</span>
              <span className="text-rose-400 font-medium">{data.dropoff}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50", className)}>
      <h3 className="text-lg font-medium text-white mb-6">{title}</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enrichedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="step_name" type="category" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="users" radius={[0, 4, 4, 0]} barSize={30}>
              {enrichedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
