"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert, 
  Sparkles, 
  Loader2, 
  Minus
} from 'lucide-react';
import { Dataset } from '@/services/datasetApi';
import { generateFullInsightsReport, FullInsightReport } from '@/services/insightsApi';

interface AIInsightsTabProps {
  dataset: Dataset;
}

export default function AIInsightsTab({ dataset }: AIInsightsTabProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<FullInsightReport | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real scenario, we'd send meaningful context instead of just the dataset metadata
      // For this demo, we send the dataset schema or sample data if available
      const context = {
        dataset_name: dataset.original_filename || dataset.filename,
        size_bytes: dataset.file_size,
        rows: dataset.rows,
        columns: dataset.columns,
        // Mocking some sample stats since we might not have the raw data readily available
        summary: "This is a structured dataset containing typical business operations data."
      };
      const result = await generateFullInsightsReport(context);
      setInsights(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  if (!insights && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 rounded-xl border border-slate-200/60 shadow-inner">
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20 mb-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 blur-xl group-hover:scale-150 transition-transform duration-500" />
          <BrainCircuit className="w-10 h-10 text-white relative z-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Business Intelligence</h3>
        <p className="text-slate-500 max-w-md mb-8">
          Harness the power of our multi-agent AI to uncover hidden trends, operational risks, and actionable recommendations from your data.
        </p>
        <button
          onClick={handleGenerate}
          className="group relative px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold transition-all overflow-hidden shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/0 via-cyan-400/30 to-cyan-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Run AI Analysis</span>
        </button>
        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">Our AI Agents are analyzing your data...</p>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
      {/* Executive Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700/50 text-white"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Executive Summary</h3>
          </div>
          <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-slate-100">
            {insights.executive_summary.overview}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(insights.executive_summary.key_metrics_snapshot).map(([key, value], i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{key}</p>
                <p className="text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Actionable Recommendations</h3>
          </div>
          <div className="flex flex-col gap-4">
            {insights.recommendations.map((rec, i) => (
              <div key={i} className="group p-4 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 rounded-2xl transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-700 rounded-md">
                    {rec.category}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md">
                      Impact: {rec.impact}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md">
                      Effort: {rec.effort}
                    </span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{rec.description}</p>
              </div>
            ))}
            {insights.recommendations.length === 0 && (
              <p className="text-slate-500 text-sm">No specific recommendations found.</p>
            )}
          </div>
        </motion.div>

        {/* Risks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Risk Analysis</h3>
          </div>
          <div className="flex flex-col gap-4">
            {insights.risks.map((risk, i) => {
              const isHigh = risk.risk_level.toLowerCase() === 'high';
              const isMedium = risk.risk_level.toLowerCase() === 'medium';
              return (
                <div key={i} className={`p-4 border rounded-2xl ${
                  isHigh ? 'bg-rose-50/50 border-rose-100' : isMedium ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold ${isHigh ? 'text-rose-900' : isMedium ? 'text-amber-900' : 'text-slate-900'}`}>
                      {risk.risk_type}
                    </h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      isHigh ? 'bg-rose-100 text-rose-700' : isMedium ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {risk.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm mb-3">{risk.description}</p>
                  <div className="p-3 bg-white/60 rounded-xl text-sm border border-black/5">
                    <span className="font-semibold block mb-1">Mitigation:</span>
                    <span className="text-slate-600">{risk.mitigation_strategy}</span>
                  </div>
                </div>
              );
            })}
            {insights.risks.length === 0 && (
              <p className="text-slate-500 text-sm">No significant risks detected.</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Detected Trends</h3>
          </div>
          <div className="flex flex-col gap-4">
            {insights.trends.map((trend, i) => {
              const isUp = trend.direction.toLowerCase() === 'up';
              const isDown = trend.direction.toLowerCase() === 'down';
              return (
                <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`p-2 rounded-full mt-1 ${isUp ? 'bg-emerald-100 text-emerald-600' : isDown ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'}`}>
                    {isUp ? <TrendingUp className="w-4 h-4" /> : isDown ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{trend.name}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{trend.details}</p>
                  </div>
                </div>
              );
            })}
             {insights.trends.length === 0 && (
              <p className="text-slate-500 text-sm">No significant trends found.</p>
            )}
          </div>
        </motion.div>

        {/* Anomalies */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Anomalies & Spikes</h3>
          </div>
          <div className="flex flex-col gap-4">
            {insights.anomalies.map((anomaly, i) => (
              <div key={i} className="p-4 bg-purple-50/30 border border-purple-100 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-purple-900 bg-white px-2 py-1 rounded-md text-sm shadow-sm border border-purple-100">
                    Metric: {anomaly.metric}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-md uppercase">
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-3">{anomaly.description}</p>
              </div>
            ))}
             {insights.anomalies.length === 0 && (
              <p className="text-slate-500 text-sm">No anomalies detected.</p>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
