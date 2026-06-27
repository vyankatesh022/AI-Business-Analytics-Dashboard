'use client';

import React from 'react';
import { usePredictions } from '../context/PredictionsContext';

export const DecisionIntelligenceWidget: React.FC = () => {
  const { decisionIntelligence } = usePredictions();

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Decision Intelligence
      </h3>

      {!decisionIntelligence || decisionIntelligence.signals.length === 0 ? (
        <div className="text-slate-500 text-sm py-4 text-center">No active signals</div>
      ) : (
        <div className="space-y-4">
          {decisionIntelligence.signals.map((signal, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                signal.signal_type === 'CHURN_WARNING'
                  ? 'bg-rose-50 border-rose-100 text-rose-900'
                  : signal.signal_type === 'OPPORTUNITY'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-900'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-sm">{signal.signal_type.replace('_', ' ')}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  signal.impact_level === 'HIGH' ? 'bg-black/10' : 'bg-black/5'
                }`}>
                  {signal.impact_level} IMPACT
                </span>
              </div>
              <p className="text-sm opacity-90 mb-3">{signal.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-black/10">
                <div className="text-xs font-medium">
                  Suggested Action: {signal.action_recommended}
                </div>
                <button className="text-xs px-3 py-1.5 bg-black/5 hover:bg-black/10 rounded font-semibold transition">
                  Execute Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
