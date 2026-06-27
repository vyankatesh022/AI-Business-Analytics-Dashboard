'use client';

import React from 'react';

const mockDrivers = [
  { name: 'Usage Frequency', percentage: 28 },
  { name: 'Plan Type', percentage: 22 },
  { name: 'Account Age', percentage: 18 },
  { name: 'Support Tickets', percentage: 14 },
  { name: 'Login Count', percentage: 10 },
];

export const PredictionExplainability: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Explainability
        </h3>
      </div>
      
      <p className="text-xs font-semibold text-slate-800 mb-4">Top Drivers for Prediction</p>

      <div className="space-y-4">
        {mockDrivers.map((driver, idx) => (
          <div key={idx} className="flex items-center text-xs">
            <span className="w-28 font-medium text-slate-600 truncate mr-2">{driver.name}</span>
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: `${driver.percentage}%` }}
              />
            </div>
            <span className="w-8 text-right font-medium text-slate-700 ml-3">{driver.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
