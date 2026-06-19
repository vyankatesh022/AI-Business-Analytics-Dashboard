"use client";

import React, { useState, useMemo } from "react";
import { Dataset } from "@/services/datasetApi";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface TableViewProps {
  dataset: Dataset;
}

export default function TableView({ dataset }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const columns = dataset.metadata?.columns || [];
  const rows = dataset.metadata?.sample || [];
  const itemsPerPage = 10;

  // Filter, Sort, Paginate
  const processedData = useMemo(() => {
    let result = [...rows];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rows, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
          />
        </div>
        <div className="text-sm text-slate-500">
          Showing <span className="text-slate-900 font-medium">{paginatedData.length}</span> of <span className="text-slate-900 font-medium">{processedData.length}</span> rows
        </div>
      </div>

      {/* Table Area */}
      <div 
        className="w-full overflow-x-auto p-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {columns.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                {columns.map((col, idx) => (
                  <th 
                    key={idx} 
                    onClick={() => handleSort(col)}
                    className="p-3 font-semibold text-slate-500 border-b border-slate-200 cursor-pointer hover:text-slate-900 transition-colors group"
                  >
                    <div className="flex items-center gap-1">
                      {col}
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig?.key === col ? 'opacity-100 text-cyan-500' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="p-3 text-slate-600">
                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-slate-400 italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors text-slate-500 hover:text-slate-900 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm text-slate-500 flex gap-2">
          Page <span className="text-slate-900 font-medium">{currentPage}</span> of <span className="text-slate-900 font-medium">{totalPages}</span>
        </div>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors text-slate-500 hover:text-slate-900 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
