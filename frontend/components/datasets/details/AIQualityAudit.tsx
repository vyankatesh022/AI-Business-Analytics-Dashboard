"use client";

import React, { useState, useEffect } from "react";
import { Dataset } from "@/services/datasetApi";
import { ShieldAlert, AlertCircle, Copy, Search, Sparkles, TrendingUp, CheckCircle2, Loader2, CheckSquare, Square } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { analyzeDataset, cleanDataset } from "@/services/datasetApi";
import { useToast } from "@/components/ui/Toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AIQualityAuditProps {
  dataset: Dataset;
  onDatasetUpdated?: (updated: Dataset) => void;
}

export default function AIQualityAudit({ dataset, onDatasetUpdated }: AIQualityAuditProps) {
  const { toast } = useToast();
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [initialized, setInitialized] = useState(false);

  const { data: analysis, isLoading, isError, error } = useQuery({
    queryKey: ['dataset-analysis', dataset.id],
    queryFn: () => analyzeDataset(dataset.id, 'heuristic'),
  });

  useEffect(() => {
    if (analysis && (analysis as any).recommendations && !initialized) {
      const newSelected = new Set<number>();
      (analysis as any).recommendations.forEach((rec: any, idx: number) => {
        if (rec.operation) newSelected.add(idx);
      });
      setSelectedIndices(newSelected);
      setInitialized(true);
    }
  }, [analysis, initialized]);

  const cleanMutation = useMutation({
    mutationFn: (operations: any[]) => cleanDataset(dataset.id, operations),
    onSuccess: (res: any) => {
      toast({ type: 'success', title: 'Data Cleaned', message: res.message || 'Dataset cleaned successfully.' });
      if (onDatasetUpdated && res.new_dataset) {
        onDatasetUpdated(res.new_dataset);
      }
    },
    onError: (err: any) => {
      toast({ type: 'error', title: 'Cleaning failed', message: err.message || 'An error occurred during cleaning.' });
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
        <p>Running AI Quality Audit...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
        <h3 className="font-bold flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5" /> Audit Failed</h3>
        <p>{(error as any)?.message || 'An unexpected error occurred.'}</p>
      </div>
    );
  }

  const { validation_report, outlier_report, recommendations } = analysis as any;

  // Derive some metrics
  let anomaliesPercent = "0.0";
  let totalOutliers = 0;
  if (outlier_report) {
     totalOutliers = Object.values(outlier_report).reduce((acc: number, curr: any) => acc + curr.outlier_count, 0);
  }
  let totalRows = validation_report?.total_rows || dataset.row_count || 1; // avoid / 0
  anomaliesPercent = ((totalOutliers / totalRows) * 100).toFixed(1);

  let missingCells = validation_report?.missing_cells || 0;
  let totalCells = totalRows * (validation_report?.total_columns || dataset.column_count || 1);
  let completeness = (((totalCells - missingCells) / totalCells) * 100).toFixed(1);

  // Compute a mock overall score based on missing and anomalies
  const overallScore = Math.max(0, Math.min(100, Math.round(parseFloat(completeness) - parseFloat(anomaliesPercent))));

  // Data for Recharts
  const missingData = validation_report?.columns 
    ? Object.entries(validation_report.columns)
        .filter(([_, stats]: any) => stats.missing_count > 0)
        .map(([col, stats]: any) => ({ name: col, count: stats.missing_count }))
    : [];

  const outlierData = outlier_report
    ? Object.entries(outlier_report)
        .filter(([_, stats]: any) => stats.outlier_count > 0)
        .map(([col, stats]: any) => ({ name: col, count: stats.outlier_count }))
    : [];

  const handleToggle = (idx: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedIndices(newSelected);
  };

  const handleApply = () => {
    const operationsToApply = Array.from(selectedIndices).map(idx => recommendations[idx].operation).filter(Boolean);
    if (operationsToApply.length === 0) {
      toast({ type: 'info', title: 'No operations', message: 'Please select at least one operation to apply.' });
      return;
    }
    cleanMutation.mutate(operationsToApply);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">AI Quality Score</div>
            <div className="text-4xl font-black text-slate-900">{overallScore}<span className="text-lg text-slate-400 font-bold">/100</span></div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-cyan-100 border-t-cyan-500 flex items-center justify-center rotate-45">
            <ShieldAlert className="w-6 h-6 text-cyan-500 -rotate-45" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Anomalies</div>
            <div className="text-4xl font-black text-slate-900">{anomaliesPercent}<span className="text-lg text-slate-400 font-bold">%</span></div>
          </div>
          <Search className="w-8 h-8 text-rose-500/50" />
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Completeness</div>
            <div className="text-4xl font-black text-slate-900">{completeness}<span className="text-lg text-slate-400 font-bold">%</span></div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
        </div>
      </div>

      {/* Charts Section */}
      {(missingData.length > 0 || outlierData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {missingData.length > 0 && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Missing Values by Column</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={missingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Missing Cells" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {outlierData.length > 0 && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Detected Outliers by Column</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={outlierData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Outliers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Identified Issues */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Detected Discrepancies
          </h3>
          <div className="space-y-4">
            {recommendations && recommendations.length > 0 ? (
               recommendations.map((rec: any, idx: number) => {
                 let Icon = AlertCircle;
                 let color = 'text-amber-600';
                 let bg = 'bg-amber-50';
                 let border = 'border-amber-200';
                 
                 if (rec.issue.toLowerCase().includes('duplicate')) {
                   Icon = Copy; color = 'text-blue-600'; bg = 'bg-blue-50'; border = 'border-blue-200';
                 } else if (rec.issue.toLowerCase().includes('outlier')) {
                   Icon = TrendingUp; color = 'text-red-600'; bg = 'bg-red-50'; border = 'border-red-200';
                 }

                 return (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border ${border} ${bg}`}>
                    <div className={`mt-0.5 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${color} mb-1`}>{rec.issue}</h4>
                    </div>
                  </div>
                 )
               })
            ) : (
              <div className="p-4 text-center text-slate-500">No issues found. Dataset is clean!</div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-slate-50 border border-slate-200 shadow-sm rounded-2xl p-6 relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100 blur-3xl rounded-full pointer-events-none" />
          
          <h3 className="text-lg font-bold text-cyan-600 flex items-center gap-2 mb-6 relative z-10">
            <Sparkles className="w-5 h-5" />
            Auto-Repair Pipeline
          </h3>
          
          <div className="space-y-4 relative z-10 flex-1 overflow-y-auto">
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((rec: any, idx: number) => {
                const hasOp = !!rec.operation;
                const isSelected = selectedIndices.has(idx);
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${hasOp ? 'cursor-pointer hover:bg-white' : 'opacity-70'} ${isSelected ? 'border-cyan-300 bg-cyan-50/50' : 'border-transparent'}`}
                    onClick={() => hasOp && handleToggle(idx)}
                  >
                    <div className="mt-0.5 text-cyan-600 shrink-0">
                      {hasOp ? (
                        isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">i</div>
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-slate-800">{rec.action}</p>
                      {rec.confidence && (
                        <p className="text-xs text-slate-500 mt-1">Confidence: {(rec.confidence * 100).toFixed(0)}%</p>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-sm text-slate-500">No automated repairs needed.</div>
            )}
          </div>

          <button 
            onClick={handleApply}
            disabled={cleanMutation.isPending || Array.from(selectedIndices).length === 0}
            className="mt-6 w-full py-3 px-4 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm text-slate-700 hover:text-cyan-600 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            {cleanMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Apply Selected Repairs ({selectedIndices.size})
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
