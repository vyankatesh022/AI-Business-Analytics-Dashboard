"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts"

const mockRevenueData = [
  { name: "Jan", revenue: 4000, target: 2400 },
  { name: "Feb", revenue: 3000, target: 1398 },
  { name: "Mar", revenue: 2000, target: 9800 },
  { name: "Apr", revenue: 2780, target: 3908 },
  { name: "May", revenue: 1890, target: 4800 },
  { name: "Jun", revenue: 2390, target: 3800 },
  { name: "Jul", revenue: 3490, target: 4300 },
]

export function RevenueChart() {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6 shadow-sm">
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Revenue vs Target</h3>
        <p className="text-sm text-muted-foreground">Monthly revenue performance across all regions</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1500} />
            <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="none" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const mockRetentionData = [
  { name: "Week 1", cohortA: 100, cohortB: 100 },
  { name: "Week 2", cohortA: 85, cohortB: 92 },
  { name: "Week 3", cohortA: 75, cohortB: 88 },
  { name: "Week 4", cohortA: 65, cohortB: 85 },
  { name: "Week 5", cohortA: 55, cohortB: 80 },
  { name: "Week 6", cohortA: 45, cohortB: 78 },
]

export function RetentionChart() {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border/50 p-6 shadow-sm">
      <div className="flex flex-col space-y-1.5 mb-6">
        <h3 className="font-semibold leading-none tracking-tight">Retention Curves</h3>
        <p className="text-sm text-muted-foreground">Cohort analysis over 6 weeks</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockRetentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
              cursor={{fill: '#1e293b', opacity: 0.4}}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="cohortA" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
            <Bar dataKey="cohortB" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
