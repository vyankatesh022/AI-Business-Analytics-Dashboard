import React, { useState } from 'react';
import { useVisualizationStore, DashboardFilter } from '@/store/useVisualizationStore';
import { Filter, X, Plus } from 'lucide-react';

interface FilterBarProps {
  columns: string[];
}

export default function FilterBar({ columns }: FilterBarProps) {
  const { filters, addFilter, removeFilter } = useVisualizationStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newColumn, setNewColumn] = useState(columns[0] || '');
  const [newOperator, setNewOperator] = useState<'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'>('eq');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (!newColumn || !newValue) return;
    
    const filter: DashboardFilter = {
      id: Math.random().toString(36).substr(2, 9),
      column: newColumn,
      operator: newOperator,
      value: isNaN(Number(newValue)) ? newValue : Number(newValue)
    };
    
    addFilter(filter);
    setIsAdding(false);
    setNewValue('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-slate-800">Dataset Filters</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {filters.length === 0 && <span className="text-sm text-slate-500 italic">No active filters. Showing all data.</span>}
        {filters.map(f => (
          <div key={f.id} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-100">
            <span className="font-medium mr-1">{f.column}</span>
            <span className="text-blue-400 mr-1">{f.operator}</span>
            <span className="font-mono">{f.value}</span>
            <button onClick={() => removeFilter(f.id)} className="ml-2 hover:bg-blue-200 rounded-full p-0.5">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-3 border-t border-slate-100">
          <select 
            value={newColumn} 
            onChange={e => setNewColumn(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {columns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <select
            value={newOperator}
            onChange={e => setNewOperator(e.target.value as any)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="eq">Equals</option>
            <option value="neq">Not Equals</option>
            <option value="gt">Greater Than</option>
            <option value="gte">Greater or Equal</option>
            <option value="lt">Less Than</option>
            <option value="lte">Less or Equal</option>
          </select>
          
          <input 
            type="text" 
            placeholder="Value..."
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          <button 
            onClick={() => setIsAdding(false)}
            className="text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Filter
        </button>
      )}
    </div>
  );
}
