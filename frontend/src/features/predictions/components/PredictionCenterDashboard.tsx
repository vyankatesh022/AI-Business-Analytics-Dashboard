'use client';

import React, { useState } from 'react';
import { usePredictions } from '../context/PredictionsContext';
import { ModelRegistry } from './ModelRegistry';
import { ForecastVisualization } from './ForecastVisualization';
import { DecisionIntelligenceWidget } from './DecisionIntelligenceWidget';
import { PredictionExplainability } from './PredictionExplainability';
import { PredictionStatsCards } from './PredictionStatsCards';
import { CreatePredictionForm } from './CreatePredictionForm';
import { RecentPredictions } from './RecentPredictions';

export const PredictionCenterDashboard: React.FC = () => {
  const { loading, error } = usePredictions();
  const [chartIds, setChartIds] = useState<number[]>([Date.now()]);

  const addChart = () => setChartIds([...chartIds, Date.now()]);
  const removeChart = (idToRemove: number) => setChartIds(chartIds.filter(id => id !== idToRemove));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-2" />
        Loading Prediction Center...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Predictions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Generate AI-powered predictions from your data and make smarter business decisions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Prediction
          </button>
        </div>
      </div>

      {/* Row 1: Stats Cards */}
      <PredictionStatsCards />

      {/* Row 2: Create Form & Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          <CreatePredictionForm />
        </div>
        <div className="lg:col-span-2 space-y-6">
          {chartIds.map((id) => (
            <div key={id} className="relative group">
              <ForecastVisualization />
              {chartIds.length > 1 && (
                <button
                  onClick={() => removeChart(id)}
                  className="absolute top-4 right-4 bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-red-500 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition z-10"
                  title="Remove Chart"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button 
            onClick={addChart}
            className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 text-slate-500 font-medium hover:bg-slate-50 hover:text-indigo-600 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Chart
          </button>
        </div>
      </div>

      {/* Row 3: Small Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DecisionIntelligenceWidget />
        <ModelRegistry />
        <PredictionExplainability />
      </div>

      {/* Row 4: Recent Predictions */}
      <RecentPredictions />
    </div>
  );
};
