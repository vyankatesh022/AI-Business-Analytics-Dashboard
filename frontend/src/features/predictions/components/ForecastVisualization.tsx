'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const mockRevenueData = [
  { month: 'Jan', revenue: 4000, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Feb', revenue: 3000, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Mar', revenue: 2000, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Apr', revenue: 2780, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'May', revenue: 1890, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Jun', revenue: 2390, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Jul', revenue: 3490, forecast: 3490, best_forecast: 3490, worst_forecast: 3490, lower: 3490, upper: 3490 },
  { month: 'Aug', revenue: null, forecast: 3600, best_forecast: 4000, worst_forecast: 3200, lower: 3100, upper: 4100 },
  { month: 'Sep', revenue: null, forecast: 3900, best_forecast: 4400, worst_forecast: 3300, lower: 3200, upper: 4500 },
  { month: 'Oct', revenue: null, forecast: 4200, best_forecast: 4800, worst_forecast: 3500, lower: 3300, upper: 5000 },
  { month: 'Nov', revenue: null, forecast: 4600, best_forecast: 5300, worst_forecast: 3700, lower: 3500, upper: 5500 },
  { month: 'Dec', revenue: null, forecast: 5100, best_forecast: 6000, worst_forecast: 4000, lower: 3700, upper: 6200 },
];

const mockDemandData = [
  { month: 'Jan', revenue: 150, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Feb', revenue: 200, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Mar', revenue: 250, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Apr', revenue: 300, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'May', revenue: 280, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Jun', revenue: 320, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Jul', revenue: 380, forecast: 380, best_forecast: 380, worst_forecast: 380, lower: 380, upper: 380 },
  { month: 'Aug', revenue: null, forecast: 410, best_forecast: 450, worst_forecast: 360, lower: 350, upper: 470 },
  { month: 'Sep', revenue: null, forecast: 450, best_forecast: 500, worst_forecast: 390, lower: 380, upper: 520 },
  { month: 'Oct', revenue: null, forecast: 490, best_forecast: 550, worst_forecast: 410, lower: 400, upper: 580 },
  { month: 'Nov', revenue: null, forecast: 550, best_forecast: 620, worst_forecast: 460, lower: 450, upper: 650 },
  { month: 'Dec', revenue: null, forecast: 620, best_forecast: 700, worst_forecast: 520, lower: 500, upper: 740 },
];

const mockChurnData = [
  { month: 'Jan', revenue: 12, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Feb', revenue: 15, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Mar', revenue: 14, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Apr', revenue: 16, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'May', revenue: 18, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Jun', revenue: 22, forecast: null, best_forecast: null, worst_forecast: null, lower: null, upper: null },
  { month: 'Jul', revenue: 25, forecast: 25, best_forecast: 25, worst_forecast: 25, lower: 25, upper: 25 },
  { month: 'Aug', revenue: null, forecast: 28, best_forecast: 32, worst_forecast: 24, lower: 22, upper: 34 },
  { month: 'Sep', revenue: null, forecast: 32, best_forecast: 38, worst_forecast: 26, lower: 24, upper: 40 },
  { month: 'Oct', revenue: null, forecast: 35, best_forecast: 42, worst_forecast: 28, lower: 25, upper: 45 },
  { month: 'Nov', revenue: null, forecast: 38, best_forecast: 46, worst_forecast: 30, lower: 26, upper: 50 },
  { month: 'Dec', revenue: null, forecast: 42, best_forecast: 52, worst_forecast: 32, lower: 28, upper: 56 },
];

const dataMap: Record<string, any[]> = {
  'Revenue Forecast': mockRevenueData,
  'Demand Forecast': mockDemandData,
  'Churn Risk Projection': mockChurnData,
};

export const ForecastVisualization: React.FC = () => {
  const [selectedView, setSelectedView] = useState('Revenue Forecast');
  const [chartType, setChartType] = useState('Area');
  const activeData = dataMap[selectedView];

  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const handleLoadChart = (e: any) => {
      if (e.detail && dataMap[e.detail]) {
        setSelectedView(e.detail);
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1500);
      }
    };
    window.addEventListener('load-prediction-chart', handleLoadChart);
    return () => window.removeEventListener('load-prediction-chart', handleLoadChart);
  }, []);

  const renderChart = () => {
    const commonProps = {
      data: activeData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };
    
    if (chartType === 'Bar') {
      const { BarChart, Bar } = require('recharts');
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} tickFormatter={(val) => selectedView === 'Revenue Forecast' ? `$${val}` : `${val}`} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar dataKey="revenue" fill="#6366F1" name={`Historical ${selectedView.split(' ')[0]}`} />
          <Bar dataKey="forecast" fill="#8B5CF6" name="Base Case" />
          <Bar dataKey="best_forecast" fill="#10B981" name="Best Case" />
          <Bar dataKey="worst_forecast" fill="#F43F5E" name="Worst Case" />
        </BarChart>
      );
    }
    
    if (chartType === 'Line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} tickFormatter={(val) => selectedView === 'Revenue Forecast' ? `$${val}` : `${val}`} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} name={`Historical ${selectedView.split(' ')[0]}`} />
          <Line type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" name="Base Case" />
          <Line type="monotone" dataKey="best_forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Best Case" />
          <Line type="monotone" dataKey="worst_forecast" stroke="#F43F5E" strokeWidth={2} strokeDasharray="3 3" name="Worst Case" />
        </LineChart>
      );
    }

    // Default Area Chart (using ComposedChart to support mixed Area and Line)
    const { ComposedChart } = require('recharts');
    return (
      <ComposedChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} tickFormatter={(val) => selectedView === 'Revenue Forecast' ? `$${val}` : `${val}`} />
        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={0} name={`Historical ${selectedView.split(' ')[0]}`} activeDot={{ r: 8 }} />
        <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={0} name="Base Case" />
        <Line type="monotone" dataKey="best_forecast" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Best Case" dot={false} />
        <Line type="monotone" dataKey="worst_forecast" stroke="#F43F5E" strokeWidth={2} strokeDasharray="3 3" name="Worst Case" dot={false} />
        <Area type="monotone" dataKey="upper" stroke="none" fill="#8B5CF6" fillOpacity={0.1} name="Confidence Upper" />
        <Area type="monotone" dataKey="lower" stroke="none" fill="#8B5CF6" fillOpacity={0.1} name="Confidence Lower" />
      </ComposedChart>
    );
  };

  return (
    <div className={`bg-white border rounded-2xl p-6 shadow-sm h-full flex flex-col relative group transition-all duration-500 ${highlight ? 'ring-4 ring-indigo-500/30 border-indigo-300' : 'border-slate-200/60'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Forecast & Scenarios
        </h3>
        <div className="flex gap-2">
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Area">Area Chart</option>
            <option value="Line">Line Chart</option>
            <option value="Bar">Bar Chart</option>
          </select>
          <select 
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Revenue Forecast">Revenue</option>
            <option value="Demand Forecast">Demand</option>
            <option value="Churn Risk Projection">Churn</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
