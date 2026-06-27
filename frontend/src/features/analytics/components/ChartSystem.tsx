import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

function ChartWrapper({ title, subtitle, children, className }: ChartWrapperProps) {
  return (
    <div className={cn("p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Pre-defined color palette for charts (Modern, vibrant)
const COLORS = {
  primary: '#818cf8', // Indigo 400
  secondary: '#34d399', // Emerald 400
  tertiary: '#f472b6', // Pink 400
  quaternary: '#fbbf24', // Amber 400
  grid: '#27272a', // Zinc 800
  text: '#a1a1aa' // Zinc 400
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
        <p className="text-zinc-300 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};



// To fix children typing issues with ResponsiveContainer, we return the full component directly.
export function ModernAreaChart({ data, title, subtitle, dataKeys, xAxisKey = "name", className }: { 
  data: any[], title: string, subtitle?: string, dataKeys: { key: string, name: string, color: string }[], xAxisKey?: string, className?: string 
}) {
  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      {/* @ts-ignore */}
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {dataKeys.map((dk, idx) => (
            <linearGradient key={dk.key} id={`color${dk.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={dk.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey={xAxisKey} stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        {dataKeys.map((dk, idx) => (
          <Area key={dk.key} type="monotone" dataKey={dk.key} name={dk.name} stroke={dk.color} strokeWidth={2} fillOpacity={1} fill={`url(#color${dk.key})`} />
        ))}
      </AreaChart>
    </ChartWrapper>
  );
}

export function ModernBarChart({ data, title, subtitle, dataKeys, xAxisKey = "name", className }: { 
  data: any[], title: string, subtitle?: string, dataKeys: { key: string, name: string, color: string }[], xAxisKey?: string, className?: string 
}) {
  return (
    <ChartWrapper title={title} subtitle={subtitle} className={className}>
      {/* @ts-ignore */}
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey={xAxisKey} stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={COLORS.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        {dataKeys.map((dk, idx) => (
          <Bar key={dk.key} dataKey={dk.key} name={dk.name} fill={dk.color} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ChartWrapper>
  );
}
