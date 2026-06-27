"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Users, DollarSign, UploadCloud, FileText, Activity, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroIntelligence() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-8 shadow-2xl border border-indigo-500/20">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-500/10 rounded-full border border-indigo-500/20">
              Welcome Back 👋
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Acme Corp Analytics
          </h1>
          <p className="text-slate-400 text-lg">
            Here's what's happening in your organization today.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Revenue</p>
                <p className="text-sm font-semibold text-white">+18.4%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Retention</p>
                <p className="text-sm font-semibold text-white">+3.2%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
              <Activity className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Forecast Confidence</p>
                <p className="text-sm font-semibold text-white">94%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-indigo-950/40 backdrop-blur-md border border-indigo-500/30 p-5 rounded-xl max-w-sm w-full"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-100 mb-1">AI Insight</h3>
              <p className="text-sm text-indigo-200/80 leading-relaxed">
                AI detected growth opportunities in the APAC region. Retention metrics show a 12% increase for enterprise clients this quarter.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30 border-none">
                  View Analysis
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Overlay */}
      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-wrap gap-3">
        <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-200">
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload Dataset
        </Button>
        <Button size="sm" variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white">
          <FileText className="w-4 h-4 mr-2" />
          Create Report
        </Button>
        <Button size="sm" variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white">
          <TrendingUp className="w-4 h-4 mr-2" />
          Run Forecast
        </Button>
        <Button size="sm" variant="outline" className="text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20 hover:text-indigo-200">
          <MessageSquare className="w-4 h-4 mr-2" />
          Ask AI
        </Button>
      </div>
    </div>
  )
}
