import React from "react";
import { Dataset } from "@/services/datasetApi";
import { useQuery } from "@tanstack/react-query";
import { fetchDatasetEDA } from "@/services/datasetApi";
import { Activity, AlertCircle, Database, FileDigit, Network, Percent, Hash } from "lucide-react";
import { motion } from "framer-motion";

interface EDAAnalyticsProps {
  dataset: Dataset;
}

export default function EDAAnalytics({ dataset }: EDAAnalyticsProps) {
  const { data: eda, isLoading, error } = useQuery({
    queryKey: ["dataset_eda", dataset.id],
    queryFn: () => fetchDatasetEDA(dataset.id),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Activity className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">Generating EDA Report</h3>
        <p className="text-sm">Crunching numbers, computing correlations, and building profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold">Failed to Generate EDA Report</h3>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  if (!eda || eda.status === "error") {
    return (
      <div className="bg-amber-50 text-amber-700 p-6 rounded-xl border border-amber-100 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold">Could not analyze dataset</h3>
          <p className="text-sm mt-1">{eda?.message || "Dataset might be empty or improperly formatted."}</p>
        </div>
      </div>
    );
  }

  const { summary, missing_data, numerical_analysis, categorical_analysis, correlation_analysis } = eda;

  return (
    <div className="space-y-8 pb-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Database className="w-4 h-4" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Shape</h4>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {summary.row_count.toLocaleString()} <span className="text-sm text-slate-500 font-sans">rows</span>
          </div>
          <div className="text-sm text-slate-600 font-mono mt-1">
            {summary.column_count} <span className="text-xs text-slate-500 font-sans">columns</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Percent className="w-4 h-4" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Completeness</h4>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {missing_data.completeness_score}%
          </div>
          <div className="text-sm text-slate-600 font-mono mt-1">
            {missing_data.total_missing.toLocaleString()} <span className="text-xs text-slate-500 font-sans">missing cells</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <FileDigit className="w-4 h-4" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Numerical Features</h4>
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono">
            {Object.keys(numerical_analysis).length}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Hash className="w-4 h-4" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">Categorical Features</h4>
          </div>
          <div className="text-2xl font-bold text-purple-600 font-mono">
            {Object.keys(categorical_analysis).length}
          </div>
        </motion.div>
      </div>

      {/* Numerical Analysis */}
      {Object.keys(numerical_analysis).length > 0 && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileDigit className="w-5 h-5 text-blue-500" />
              Numerical Distribution
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Feature</th>
                  <th className="px-6 py-3">Mean</th>
                  <th className="px-6 py-3">Median</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3">Std Dev</th>
                  <th className="px-6 py-3">Min</th>
                  <th className="px-6 py-3">Max</th>
                  <th className="px-6 py-3">Zeros</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(numerical_analysis).map(([col, stats]: [string, any]) => (
                  <tr key={col} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">{col}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{stats.mean?.toFixed(2) ?? '-'}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{stats.median?.toFixed(2) ?? '-'}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{stats.mode?.toFixed(2) ?? '-'}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{stats.std_dev?.toFixed(2) ?? '-'}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{stats.min?.toFixed(2) ?? '-'}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{stats.max?.toFixed(2) ?? '-'}</td>
                    <td className="px-6 py-3 font-mono text-amber-600">{stats.zeros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Categorical Analysis */}
      {Object.keys(categorical_analysis).length > 0 && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-500" />
              Categorical Frequencies
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(categorical_analysis).map(([col, stats]: [string, any]) => (
              <div key={col} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-slate-800">{col}</h4>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {stats.unique_count} unique
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats.top_categories).map(([cat, count]: [string, any]) => (
                    <div key={cat} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 truncate pr-4" title={cat}>{cat}</span>
                      <span className="font-mono text-slate-500">{count}</span>
                    </div>
                  ))}
                  {Object.keys(stats.top_categories).length === 0 && (
                    <div className="text-slate-400 text-sm italic">No valid categories</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Correlation Matrix */}
      {correlation_analysis?.pearson && Object.keys(correlation_analysis.pearson).length > 1 && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-500" />
              Pearson Correlation Matrix
            </h3>
            <span className="text-xs text-slate-500">Numeric features only</span>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-sm text-center">
              <thead>
                <tr>
                  <th className="p-2 border-b-2 border-slate-200 bg-white sticky left-0 z-10"></th>
                  {Object.keys(correlation_analysis.pearson).map(col => (
                    <th key={col} className="p-2 font-medium text-slate-600 border-b-2 border-slate-200 whitespace-nowrap">
                      {col.substring(0, 10)}{col.length > 10 ? '...' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(correlation_analysis.pearson).map(row => (
                  <tr key={row}>
                    <td className="p-2 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-100 text-left whitespace-nowrap">
                      {row}
                    </td>
                    {Object.keys(correlation_analysis.pearson).map(col => {
                      const val = correlation_analysis.pearson[row][col];
                      // Determine background color based on correlation strength
                      let bgColor = 'bg-white';
                      let textColor = 'text-slate-400';
                      
                      if (val !== null && row !== col) {
                        textColor = 'text-slate-900';
                        if (val >= 0.7) bgColor = 'bg-emerald-200';
                        else if (val >= 0.4) bgColor = 'bg-emerald-100';
                        else if (val <= -0.7) bgColor = 'bg-rose-200';
                        else if (val <= -0.4) bgColor = 'bg-rose-100';
                        else bgColor = 'bg-slate-50';
                      }

                      return (
                        <td key={`${row}-${col}`} className={`p-2 font-mono text-xs ${bgColor} border border-slate-50/50`}>
                          {val !== null ? <span className={textColor}>{val.toFixed(2)}</span> : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
}
