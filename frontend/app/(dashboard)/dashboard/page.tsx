"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Database } from "lucide-react";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { Dataset, fetchDatasets, FolderNode, fetchFolders } from "@/services/datasetApi";
import FilterBar from "@/components/dashboard/FilterBar";
import DashboardBuilder from "@/components/dashboard/DashboardBuilder";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function DashboardOverview() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const resetDashboard = useVisualizationStore(state => state.resetDashboard);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const [data, folderData] = await Promise.all([
          fetchDatasets(),
          fetchFolders()
        ]);
        setDatasets(data);
        setFolders(folderData);
        if (data.length > 0) {
          setSelectedDatasetId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load datasets:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDatasets();
  }, []);

  const selectedDataset = datasets.find(d => d.id === selectedDatasetId);
  const columns = selectedDataset?.metadata?.columns || [];

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Interactive Dashboard <Sparkles className="h-5 w-5 text-cyan-400" />
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Real-time analytical pipelines and custom visualizations.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2">
              <Database className="w-4 h-4 text-slate-400" />
              <select 
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 dark:text-zinc-200 min-w-[200px]"
                disabled={isLoading || datasets.length === 0}
              >
                {isLoading ? (
                  <option value="">Loading datasets...</option>
                ) : datasets.length === 0 ? (
                  <option value="">No datasets available</option>
                ) : (
                  <>
                    <optgroup label="Workspace">
                      {datasets.filter(d => !d.folder_id).map(d => (
                        <option key={d.id} value={d.id}>{d.original_filename || d.filename}</option>
                      ))}
                    </optgroup>
                    {folders.map(folder => {
                      const folderDatasets = datasets.filter(d => d.folder_id === folder.id);
                      if (folderDatasets.length === 0) return null;
                      return (
                        <optgroup key={folder.id} label={folder.name}>
                          {folderDatasets.map(d => (
                            <option key={d.id} value={d.id}>{d.original_filename || d.filename}</option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </>
                )}
              </select>
            </div>
            
            <button 
              onClick={resetDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Layout
            </button>
          </div>
        </div>

        {selectedDatasetId ? (
          <div className="w-full flex flex-col space-y-4">
            <FilterBar columns={columns} />
            <DashboardBuilder datasetId={selectedDatasetId} />
          </div>
        ) : (
          !isLoading && (
            <div className="p-12 border border-dashed rounded-2xl border-zinc-800/60 bg-zinc-950/20 text-center flex flex-col items-center justify-center">
              <Database className="h-8 w-8 text-cyan-500/50 mb-3" />
              <h3 className="text-sm font-bold text-zinc-400 mb-1">No Dataset Selected</h3>
              <p className="text-xs text-zinc-600 max-w-sm">
                Please upload a dataset in the Datasets tab to start visualizing data.
              </p>
            </div>
          )
        )}
      </div>
    </PageContainer>
  );
}
