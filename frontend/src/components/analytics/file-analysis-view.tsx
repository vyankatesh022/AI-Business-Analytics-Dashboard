"use client";

import React from "react";
import { ArrowLeft, FileText, BarChart3, Database, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ColumnMetadata {
  name: string;
  type: string;
  missing_count: number;
  unique_count: number;
  mean?: number | null;
  min?: number | null;
  max?: number | null;
}

interface FileAnalysisResult {
  filename: string;
  row_count: number;
  column_count: number;
  columns: ColumnMetadata[];
  preview: any[];
}

interface FileAnalysisViewProps {
  data: FileAnalysisResult;
  onClose: () => void;
}

export function FileAnalysisView({ data, onClose }: FileAnalysisViewProps) {
  return (
    <div className="flex-1 p-8 pt-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-zinc-100">
            <ArrowLeft className="w-5 h-5 text-zinc-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              {data.filename}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Ad-hoc file analysis report</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Database className="w-4 h-4 mr-2" />
          Save as Dataset
        </Button>
      </div>

      {/* High-level stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Rows</CardDescription>
            <CardTitle className="text-4xl font-light text-zinc-900">{data.row_count.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Columns</CardDescription>
            <CardTitle className="text-4xl font-light text-zinc-900">{data.column_count}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Data Dictionary / Columns */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Column Schema & Statistics
          </CardTitle>
          <CardDescription>Automatically inferred data types and profile for each column.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Column Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium text-right">Unique Values</th>
                  <th className="px-4 py-3 font-medium text-right">Missing</th>
                  <th className="px-4 py-3 font-medium text-center">Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.columns.map((col, idx) => {
                  const fillRate = ((data.row_count - col.missing_count) / data.row_count) * 100;
                  return (
                    <motion.tr 
                      key={col.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-900">{col.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${col.type === 'numeric' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {col.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">{col.unique_count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-zinc-500">{col.missing_count}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-zinc-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${fillRate > 90 ? 'bg-emerald-500' : fillRate > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{ width: `${fillRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500 w-8">{fillRate.toFixed(0)}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Data Preview
          </CardTitle>
          <CardDescription>Showing top 5 rows of the dataset.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                <tr>
                  {data.columns.map((col) => (
                    <th key={col.name} className="px-4 py-3 font-medium whitespace-nowrap">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.preview.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    {data.columns.map((col) => (
                      <td key={`${idx}-${col.name}`} className="px-4 py-3 text-zinc-700 truncate max-w-[200px]">
                        {row[col.name] !== undefined && row[col.name] !== null ? String(row[col.name]) : <span className="text-zinc-400 italic">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
