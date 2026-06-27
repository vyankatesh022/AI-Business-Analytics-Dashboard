'use client';

import React from 'react';
import { usePredictions } from '../context/PredictionsContext';

export const RecentPredictions: React.FC = () => {
  const { recentPredictions } = usePredictions();

  if (!recentPredictions || recentPredictions.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Predictions
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="pb-3 px-2">Name</th>
              <th className="pb-3 px-2">Data Source</th>
              <th className="pb-3 px-2">Model</th>
              <th className="pb-3 px-2">Horizon</th>
              <th className="pb-3 px-2">Created By</th>
              <th className="pb-3 px-2">Created At</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {recentPredictions.map((pred) => (
              <tr key={pred.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                <td className="py-3 px-2 font-medium text-slate-800">{pred.name}</td>
                <td className="py-3 px-2 text-slate-600">{pred.dataSource}</td>
                <td className="py-3 px-2 text-slate-600">{pred.model}</td>
                <td className="py-3 px-2 text-slate-600">{pred.horizon}</td>
                <td className="py-3 px-2 text-slate-600">{pred.createdBy}</td>
                <td className="py-3 px-2 text-slate-600">{pred.createdAt}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    pred.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    pred.status === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {pred.status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-end gap-2 text-slate-400">
                    <button className="hover:text-indigo-600 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button className="hover:text-indigo-600 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    <button className="hover:text-indigo-600 p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
