"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { InsightCardData } from '../../types';
import { cn } from '@/lib/utils';
import { useInsightsStore } from '../../store/insights-store';
import { Bookmark, Sparkles, TrendingUp, AlertTriangle, ShieldAlert, ArrowRight, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAiCopilot } from '@/features/ai-copilot/context/AiCopilotContext';
import { toast } from 'sonner';

interface InsightCardProps {
  insight: InsightCardData;
  className?: string;
  index?: number;
}

const typeConfig = {
  revenue: { color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: TrendingUp, border: 'border-emerald-200' },
  growth: { color: 'text-blue-600', bg: 'bg-blue-500/10', icon: TrendingUp, border: 'border-blue-200' },
  retention: { color: 'text-indigo-600', bg: 'bg-indigo-500/10', icon: Sparkles, border: 'border-indigo-200' },
  churn: { color: 'text-rose-600', bg: 'bg-rose-500/10', icon: AlertTriangle, border: 'border-rose-200' },
  operational: { color: 'text-amber-600', bg: 'bg-amber-500/10', icon: ShieldAlert, border: 'border-amber-200' },
  risk: { color: 'text-red-600', bg: 'bg-red-500/10', icon: AlertTriangle, border: 'border-red-200' },
  anomaly: { color: 'text-purple-600', bg: 'bg-purple-500/10', icon: Sparkles, border: 'border-purple-200' },
};

export function InsightCard({ insight, className, index = 0 }: InsightCardProps) {
  const { saveInsight, removeSavedInsight, isInsightSaved } = useInsightsStore();
  const { toggleCopilot } = useAiCopilot();
  const saved = isInsightSaved(insight.id);
  
  const config = typeConfig[insight.type] || typeConfig.anomaly;
  const Icon = config.icon;

  const toggleSave = () => {
    if (saved) {
      removeSavedInsight(insight.id);
      toast.success("Insight removed from saved items");
    } else {
      saveInsight(insight);
      toast.success("Insight saved successfully");
    }
  };

  const handleAction = () => {
    toast.info(`Executing action for: ${insight.title}`);
    
    // In a real app, this could open a modal, redirect, or trigger an API.
    // For now, let's open the AI Copilot to discuss this insight.
    setTimeout(() => {
      toggleCopilot();
      toast.success("AI Copilot opened with context");
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-200/60",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex items-start justify-between relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl shadow-sm", config.bg, config.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 leading-none mb-1.5">{insight.title}</h3>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{insight.type}</span>
          </div>
        </div>
        <button 
          onClick={toggleSave}
          className={cn(
            "p-2 rounded-full transition-colors",
            saved ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
          )}
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 mb-6">
        <p className="text-slate-700 font-medium leading-relaxed mb-4">
          {insight.summary}
        </p>
        
        {insight.recommendation && (
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI Recommendation</span>
            </div>
            <p className="text-sm text-indigo-800">{insight.recommendation}</p>
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Impact</div>
            <div className={cn(
              "font-bold text-sm",
              insight.impactScore >= 80 ? "text-emerald-600" : insight.impactScore >= 50 ? "text-amber-600" : "text-slate-600"
            )}>
              {insight.impactScore}/100
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Confidence</div>
            <div className="font-bold text-sm text-slate-700">{insight.confidenceScore}%</div>
          </div>
        </div>
        
        <Button 
          onClick={handleAction}
          variant="ghost" 
          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl px-4 group/btn"
        >
          <span>Action</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
