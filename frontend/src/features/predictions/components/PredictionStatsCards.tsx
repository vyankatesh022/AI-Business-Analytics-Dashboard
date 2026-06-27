'use client';

import React from 'react';
import { usePredictions } from '../context/PredictionsContext';
import { TrendingUp, Package, Target, Bell } from 'lucide-react';

export const PredictionStatsCards: React.FC = () => {
  const { stats } = usePredictions();

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Predictions */}
      <div className="bg-indigo-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-indigo-100 font-medium text-sm mb-1">Total Predictions</p>
          <h2 className="text-4xl font-bold mb-4">{stats.totalPredictions.toLocaleString()}</h2>
          <div className="flex items-center text-indigo-100 text-xs font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {stats.totalPredictionsTrend}
          </div>
        </div>
      </div>

      {/* Active Models */}
      <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Package size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-blue-100 font-medium text-sm mb-1">Active Models</p>
          <h2 className="text-4xl font-bold mb-4">{stats.activeModels}</h2>
          <div className="flex items-center text-blue-100 text-xs font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {stats.activeModelsTrend}
          </div>
        </div>
      </div>

      {/* Avg Accuracy */}
      <div className="bg-emerald-400 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Target size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-emerald-100 font-medium text-sm mb-1">Avg. Accuracy</p>
          <h2 className="text-4xl font-bold mb-4">{stats.avgAccuracy}</h2>
          <div className="flex items-center text-emerald-100 text-xs font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {stats.avgAccuracyTrend}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-violet-500 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Bell size={120} />
        </div>
        <div className="relative z-10">
          <p className="text-violet-100 font-medium text-sm mb-1">Alerts</p>
          <h2 className="text-4xl font-bold mb-4">{stats.alerts}</h2>
          <div className="flex items-center text-violet-100 text-xs font-medium">
            <svg className="w-4 h-4 mr-1 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {stats.alertsTrend}
          </div>
        </div>
      </div>
    </div>
  );
};
