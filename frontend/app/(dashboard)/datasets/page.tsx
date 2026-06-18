"use client";

import React, { useState } from "react";
import { Database, FileSpreadsheet, Activity, Zap } from "lucide-react";
import { PageContainer } from "@/components/dashboard/PageContainer";
import UploadView from "@/components/datasets/UploadView";
import ConnectView from "@/components/datasets/ConnectView";
import DataRepository from "@/components/datasets/DataRepository";
import DatasetDetailsView from "@/components/datasets/DatasetDetailsView";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDatasets, deleteDataset, uploadDataset, Dataset, fetchFolders, createFolder } from "@/services/datasetApi";
import { filesize } from "filesize";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

export default function DatasetsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<'repository' | 'upload' | 'connect'>('repository');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const { data: datasets, isLoading, refetch } = useQuery({
    queryKey: ["datasets"],
    queryFn: fetchDatasets,
  });

  const { data: folders, refetch: refetchFolders } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  // 2. Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      setSelectedDataset(null);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDataset(file, currentFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      setActiveWorkspace('repository');
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId?: string | null }) => createFolder(name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast({ type: 'success', title: 'Folder created', message: 'The folder was created successfully.' });
    },
    onError: (error: any) => {
      toast({ type: 'error', title: 'Failed to create folder', message: error.message || 'An error occurred.' });
    }
  });

  // 3. Handlers
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this dataset? This action is permanent.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImportComplete = (dataset: Dataset) => {
    queryClient.setQueryData(["datasets"], (oldData: Dataset[] | undefined) => {
      if (!oldData) return [dataset];
      return [dataset, ...oldData];
    });
    queryClient.invalidateQueries({ queryKey: ["datasets"] });
    setActiveWorkspace('repository');
  };

  const handleDatasetUpdated = (updatedDataset: Dataset) => {
    setSelectedDataset(updatedDataset);
    queryClient.invalidateQueries({ queryKey: ["datasets"] });
  };

  const handleLocalUploadClick = () => {
    setActiveWorkspace('upload');
  };

  const handleFileChange = async (file: File) => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleRemoteConnectionClick = () => {
    setActiveWorkspace('connect');
  };

  const handleCreateFolder = (name: string, parentId?: string | null) => {
    createFolderMutation.mutate({ name, parentId });
  };

  return (
    <PageContainer>
      <div className="space-y-8 flex flex-col h-full w-full max-w-7xl mx-auto pb-10">
        
        {/* SECTION 1: HEADER & METRICS */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                DATA INGESTION COMMAND CENTER
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Index, organize, ingest, and monitor datasets from local and remote sources.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                <Database className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Indexed Files</span>
              </div>
              <h4 className="text-2xl font-bold text-[var(--text-primary)] font-mono">{datasets?.length || 0}</h4>
            </div>

            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Storage Footprint</span>
              </div>
              <h4 className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                {filesize(datasets?.reduce((acc, d) => acc + d.size_bytes, 0) || 0).toString()}
              </h4>
            </div>

            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Aggregated Rows</span>
              </div>
              <h4 className="text-2xl font-bold text-[var(--text-primary)] font-mono">
                {(datasets?.reduce((acc, d) => acc + d.row_count, 0) || 0).toLocaleString()}
              </h4>
            </div>

            <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Ingestion SLA</span>
              </div>
              <h4 className="text-2xl font-bold text-[var(--text-primary)] font-mono flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                99.99%
              </h4>
            </div>
          </div>
        </section>

        {/* Dynamic Content Area */}
        <AnimatePresence mode="wait">
          {selectedDataset ? (
            /* DATASET DETAILS VIEW */
            <motion.section
              key="dataset-details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex-1 min-w-0 flex flex-col h-full"
            >
              <DatasetDetailsView
                dataset={selectedDataset}
                onDatasetUpdated={handleDatasetUpdated}
                onBack={() => setSelectedDataset(null)}
              />
            </motion.section>
          ) : (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 flex-1 flex flex-col"
            >
              {/* WORKSPACE VIEW MANAGER */}
              <AnimatePresence mode="wait">
                {activeWorkspace === 'repository' && (
                  <motion.section
                    key="repository"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-h-[600px]"
                  >
                    <DataRepository 
                      datasets={datasets || []}
                      folders={folders || []}
                      isLoading={isLoading}
                      onRefresh={() => { refetch(); refetchFolders(); }}
                      onUploadClick={handleLocalUploadClick}
                      onConnectClick={handleRemoteConnectionClick}
                      onDeleteDataset={handleDelete}
                      onSelectDataset={setSelectedDataset}
                      onCreateFolder={handleCreateFolder}
                      currentFolderId={currentFolderId}
                      onFolderChange={setCurrentFolderId}
                    />
                  </motion.section>
                )}

                {activeWorkspace === 'upload' && (
                  <motion.section
                    key="upload"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-h-[600px]"
                  >
                    <UploadView 
                      onBack={() => setActiveWorkspace('repository')}
                      onUploadSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["datasets"] });
                        setActiveWorkspace('repository');
                      }}
                      currentFolder={folders?.find(f => f.id === currentFolderId)}
                    />
                  </motion.section>
                )}

                {activeWorkspace === 'connect' && (
                  <motion.section
                    key="connect"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-h-[600px]"
                  >
                    <ConnectView 
                      onBack={() => setActiveWorkspace('repository')}
                      onImportComplete={handleImportComplete}
                      folders={folders || []}
                      currentFolderId={currentFolderId}
                    />
                  </motion.section>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
