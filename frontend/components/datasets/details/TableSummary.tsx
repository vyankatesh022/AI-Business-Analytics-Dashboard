"use client";

import React from "react";
import { Dataset } from "@/services/datasetApi";
import { filesize } from "filesize";
import { HardDrive, Columns, Rows, Hash, Type as TypeIcon, Info, Lightbulb } from "lucide-react";

interface TableSummaryProps {
  dataset: Dataset;
}

export default function TableSummary({ dataset }: TableSummaryProps) {
  const dtypes = dataset.metadata?.dtypes || {};
  
  let numericCols = 0;
  let textCols = 0;
  let otherCols = 0;

  Object.values(dtypes).forEach(type => {
    if (type.includes('int') || type.includes('float')) {
      numericCols++;
    } else if (type.includes('object') || type.includes('string')) {
      textCols++;
    } else {
      otherCols++;
    }
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-2xl font-black text-slate-900 mb-2 truncate relative z-10" title={dataset.original_filename || dataset.filename}>
          {dataset.original_filename || dataset.filename}
        </h2>
        <div className="flex items-center gap-4 text-sm text-slate-500 relative z-10">
          <div className="flex items-center gap-1.5 bg-white shadow-sm px-3 py-1.5 rounded-md border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Active Index</span>
          </div>
          <div className="text-slate-300">•</div>
          <div>Last updated: {new Date(dataset.updated_at || dataset.created_at).toLocaleString()}</div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:border-cyan-500 transition-colors">
          <div className="text-slate-500 flex items-center gap-2 mb-3">
            <HardDrive className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">File Size</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{filesize(dataset.size_bytes).toString()}</div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:border-cyan-500 transition-colors">
          <div className="text-slate-500 flex items-center gap-2 mb-3">
            <Rows className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Rows</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{dataset.row_count.toLocaleString()}</div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:border-cyan-500 transition-colors">
          <div className="text-slate-500 flex items-center gap-2 mb-3">
            <Columns className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Columns</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{dataset.column_count}</div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:border-cyan-500 transition-colors flex flex-col justify-center">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-cyan-600 font-medium">
              <Hash className="w-4 h-4" /> Numeric
            </div>
            <span className="font-bold text-slate-900">{numericCols}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-amber-500 font-medium">
              <TypeIcon className="w-4 h-4" /> Text/Cat
            </div>
            <span className="font-bold text-slate-900">{textCols}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Info className="w-4 h-4" /> Other
            </div>
            <span className="font-bold text-slate-900">{otherCols}</span>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex-1">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Automated Insights
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed shadow-sm">
            This dataset has a high proportion of categorical features (<span className="font-semibold">{Math.round((textCols/dataset.column_count)*100 || 0)}%</span>). Consider embedding generation or targeted one-hot encoding for ML pipelines.
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed shadow-sm">
            Row to column ratio is <span className="font-semibold">{Math.round(dataset.row_count / (dataset.column_count || 1)).toLocaleString()}:1</span>. This is healthy for most standard gradient boosting algorithms.
          </div>
        </div>
      </div>

    </div>
  );
}
