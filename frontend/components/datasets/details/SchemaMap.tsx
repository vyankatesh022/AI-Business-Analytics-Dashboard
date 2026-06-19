"use client";

import React from "react";
import { Dataset } from "@/services/datasetApi";
import { Type, Fingerprint, Link2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SchemaMapProps {
  dataset: Dataset;
}

export default function SchemaMap({ dataset }: SchemaMapProps) {
  const columns = dataset.metadata?.columns || [];
  const dtypes = dataset.metadata?.dtypes || {};

  // Mocking extended schema statistics for demonstration
  const getMockedStats = (col: string, idx: number) => {
    // Generate deterministic mock data based on index
    const nullPercent = (idx * 3.7) % 15;
    const isUnique = idx === 0 || (idx % 4 === 0 && dtypes[col] !== 'float64');
    const uniqueValues = isUnique ? dataset.row_count : Math.max(2, Math.floor(dataset.row_count / (idx + 2)));
    
    let relationship = null;
    if (col.toLowerCase().includes('id')) {
      relationship = `Foreign Key -> ${col.split('_')[0]}s.id`;
    }

    return { nullPercent, isUnique, uniqueValues, relationship };
  };

  const getDtypeColor = (dtype: string) => {
    if (dtype?.includes('int') || dtype?.includes('float')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (dtype?.includes('datetime') || dtype?.includes('date')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (dtype?.includes('bool')) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          Schema Architecture <span className="text-xs font-normal px-2 py-1 bg-slate-100 text-slate-500 rounded-md ml-2 border border-slate-200">{columns.length} columns mapped</span>
        </h3>
        <p className="text-sm text-slate-500 mt-1">Data types, nullability, and inferred entity relationships.</p>
      </div>

      <div className="grid gap-3">
        {columns.map((col, idx) => {
          const dtype = dtypes[col] || 'unknown';
          const stats = getMockedStats(col, idx);
          const typeStyle = getDtypeColor(dtype);

          return (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-cyan-500 transition-colors gap-4">
              
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className={`p-2 rounded-lg border ${typeStyle}`}>
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{col}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{dtype}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm flex-1 sm:justify-end">
                {/* Null % */}
                <div className="flex items-center gap-2 min-w-[100px]" title="Null Percentage">
                  {stats.nullPercent > 5 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className={stats.nullPercent > 5 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
                    {stats.nullPercent.toFixed(1)}% null
                  </span>
                </div>

                {/* Unique Values */}
                <div className="flex items-center gap-2 min-w-[120px]" title="Unique Values">
                  <Fingerprint className="w-4 h-4 text-cyan-600" />
                  <span className="text-slate-500">
                    {stats.isUnique ? '100% unique' : `${stats.uniqueValues.toLocaleString()} unique`}
                  </span>
                </div>

                {/* Relationships */}
                <div className="flex items-center gap-2 min-w-[160px]">
                  {stats.relationship ? (
                    <>
                      <Link2 className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs text-indigo-600 truncate max-w-[140px] font-mono font-medium">{stats.relationship}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 opacity-0" />
                      <span className="text-xs text-slate-400 italic">No relations mapped</span>
                    </>
                  )}
                </div>
              </div>
              
            </div>
          );
        })}

        {columns.length === 0 && (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            No schema metadata available for this dataset.
          </div>
        )}
      </div>
    </div>
  );
}
