"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

interface KPICardProps {
  title: string
  value: string
  trend: "up" | "down" | "neutral"
  trendValue: string
  trendText: string
  data: any[]
  index: number
}

export function KPICard({ title, value, trend, trendValue, trendText, data, index }: KPICardProps) {
  const isUp = trend === "up"
  const isDown = trend === "down"
  const strokeColor = isUp ? "#10b981" : isDown ? "#ef4444" : "#64748b"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-card text-card-foreground rounded-xl border border-border/50 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
        <span className={`flex items-center text-xs font-semibold ${isUp ? 'text-emerald-500' : isDown ? 'text-red-500' : 'text-slate-500'}`}>
          {isUp && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
          {isDown && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
          {trendValue}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{trendText}</p>
      
      <div className="h-12 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={strokeColor} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
