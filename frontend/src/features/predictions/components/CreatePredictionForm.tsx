'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface Filter {
  id: string;
  column: string;
  operator: string;
  value: string;
}

export const CreatePredictionForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filter[]>([]);

  const handleAddFilter = () => {
    setFilters([...filters, { id: Date.now().toString(), column: '', operator: 'equals', value: '' }]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, field: keyof Filter, value: string) => {
    setFilters(filters.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Prediction job started successfully!', {
        description: 'You will be notified when the forecast is ready.'
      });
      setFilters([]); // Reset form filters on success
    }, 1500);
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          Create Prediction from Database
        </h3>
        <span className="ml-auto bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded text-blue-600">New</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Data Source</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>revenue_data</option>
              <option>users_data</option>
              <option>events_table</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Target Column</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>revenue</option>
              <option>churn_status</option>
              <option>ltv_score</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date Column</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>date</option>
              <option>created_at</option>
              <option>timestamp</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Aggregation</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-500">Filters (Optional)</label>
            <button 
              type="button" 
              onClick={handleAddFilter}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Filter
            </button>
          </div>
          
          {filters.length > 0 && (
            <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {filters.map((filter) => (
                <div key={filter.id} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Column..." 
                    value={filter.column}
                    onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                    className="flex-1 min-w-[80px] bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <select 
                    value={filter.operator}
                    onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                    className="bg-white border border-slate-200 rounded-md px-1 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="equals">=</option>
                    <option value="not_equals">!=</option>
                    <option value="greater">&gt;</option>
                    <option value="less">&lt;</option>
                    <option value="contains">In</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Value..." 
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                    className="flex-1 min-w-[80px] bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 bg-white border border-slate-200 rounded-md shadow-sm transition-colors shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Model Type</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Prophet</option>
              <option>XGBoost</option>
              <option>RandomForest</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Horizon</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>6 Months</option>
              <option>3 Months</option>
              <option>12 Months</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Scenario</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Base Case</option>
              <option>Best Case</option>
              <option>Worst Case</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Prediction
            </>
          )}
        </button>
      </form>
    </div>
  );
};
