"use client";

import React, { useState } from "react";
import { Database, FileSpreadsheet, Trash2, Edit2, Loader2 } from "lucide-react";
import { PageContainer } from "@/components/dashboard/PageContainer";
import DatasetUploader from "@/components/datasets/DatasetUploader";
import DatasetPreview from "@/components/datasets/DatasetPreview";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDatasets, deleteDataset, Dataset } from "@/services/datasetApi";
import { filesize } from "filesize";
import { motion } from "framer-motion";

export default function DatasetsPage() {
  const queryClient = useQueryClient();
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const { data: datasets, isLoading } = useQuery({
    queryKey: ["datasets"],
    queryFn: fetchDatasets,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      if (selectedDataset) setSelectedDataset(null);
    },
  });

  const handleUploadComplete = (dataset: Dataset) => {
    queryClient.invalidateQueries({ queryKey: ["datasets"] });
    setSelectedDataset(dataset);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this dataset?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
              Datasets <Database className="h-5 w-5 text-cyan-400" />
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Upload, manage, and preview your enterprise datasets securely.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          {/* Left Column: Uploader & List */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Uploader Component */}
            <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-4">
              <DatasetUploader onUploadComplete={handleUploadComplete} />
            </div>

            {/* Datasets List */}
            <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-4 flex-1 overflow-hidden flex flex-col">
              <h3 className="text-sm font-semibold text-zinc-300 mb-4 px-2">Your Datasets</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                  </div>
                ) : datasets && datasets.length > 0 ? (
                  datasets.map((ds: Dataset) => (
                    <motion.div
                      key={ds.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedDataset(ds)}
                      className={`group cursor-pointer p-3 rounded-xl border transition-all ${
                        selectedDataset?.id === ds.id 
                          ? 'bg-cyan-500/10 border-cyan-500/30' 
                          : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`p-2 rounded-lg ${selectedDataset?.id === ds.id ? 'bg-cyan-500/20' : 'bg-zinc-800'}`}>
                            <FileSpreadsheet className={`w-4 h-4 ${selectedDataset?.id === ds.id ? 'text-cyan-400' : 'text-zinc-400'}`} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-zinc-200 truncate" title={ds.original_filename}>
                              {ds.original_filename}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {filesize(ds.size_bytes).toString()} • {ds.row_count} rows
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(e, ds.id)}
                          disabled={deleteMutation.isPending}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 px-4 text-zinc-500 text-sm">
                    No datasets found. Upload one to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="col-span-1 lg:col-span-2 flex flex-col h-full bg-zinc-950/40 border border-zinc-800/60 rounded-2xl overflow-hidden">
            <DatasetPreview dataset={selectedDataset} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
