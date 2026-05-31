import React from 'react';
import { Dataset } from '@/services/datasetApi';
import { Table, FileSpreadsheet, Database, Type } from 'lucide-react';
import { filesize } from 'filesize';
import { motion } from 'framer-motion';

interface DatasetPreviewProps {
  dataset: Dataset | null;
}

export default function DatasetPreview({ dataset }: DatasetPreviewProps) {
  if (!dataset) {
    return (
      <div className="w-full h-full min-h-[300px] rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
        <FileSpreadsheet className="w-12 h-12 mb-4 opacity-50" />
        <p>Select a dataset to view its schema and preview data</p>
      </div>
    );
  }

  const { metadata } = dataset;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full rounded-2xl border border-neutral-800 bg-neutral-900 flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80">
        <div>
          <h3 className="text-lg font-semibold text-neutral-200">{dataset.original_filename}</h3>
          <p className="text-sm text-neutral-500 mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {filesize(dataset.size_bytes).toString()}</span>
            <span>•</span>
            <span>{dataset.row_count.toLocaleString()} rows</span>
            <span>•</span>
            <span>{dataset.column_count} columns</span>
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
          {dataset.status === 'processed' ? 'Processed' : 'Processing'}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
          {/* Schema Sidebar */}
          <div className="col-span-1 border-r border-neutral-800 bg-neutral-950/50 p-6 overflow-y-auto">
            <h4 className="text-sm font-medium text-neutral-400 mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" /> Schema Definition
            </h4>
            <div className="flex flex-col gap-2">
              {metadata.columns.map((col) => (
                <div key={col} className="flex justify-between items-center p-2 rounded-md hover:bg-neutral-800/50 transition-colors">
                  <span className="text-sm text-neutral-300 font-medium truncate max-w-[150px]" title={col}>
                    {col}
                  </span>
                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
                    {metadata.dtypes[col] || 'unknown'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          <div className="col-span-2 p-0 overflow-x-auto bg-neutral-900">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-950 border-b border-neutral-800 sticky top-0">
                <tr>
                  {metadata.columns.map((col) => (
                    <th key={col} className="px-4 py-3 font-medium whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metadata.sample.map((row, idx) => (
                  <tr key={idx} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    {metadata.columns.map((col) => (
                      <td key={`${idx}-${col}`} className="px-4 py-3 text-neutral-300 whitespace-nowrap truncate max-w-[200px]" title={String(row[col])}>
                        {row[col] !== null ? String(row[col]) : <span className="text-neutral-600 italic">null</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {metadata.sample.length === 0 && (
              <div className="p-8 text-center text-neutral-500">
                No sample data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
