import React, { useState } from "react";
import { ChevronLeft, Cloud, Globe, Database, Link, FileJson, Code, Server, Loader2 } from "lucide-react";
import { Dataset, FolderNode } from "@/services/datasetApi";

interface ConnectViewProps {
  onBack: () => void;
  onImportComplete: (dataset: Dataset) => void;
  folders: FolderNode[];
  currentFolderId: string | null;
}

export default function ConnectView({ onBack, onImportComplete, folders, currentFolderId }: ConnectViewProps) {
  const [selectedSource, setSelectedSource] = useState("s3");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sources = [
    { id: "s3", name: "AWS S3", icon: <Cloud className="w-5 h-5" /> },
    { id: "gcs", name: "Google Cloud", icon: <Cloud className="w-5 h-5" /> },
    { id: "rest", name: "REST API", icon: <Globe className="w-5 h-5" /> },
    { id: "url", name: "HTTP URL", icon: <Link className="w-5 h-5" /> },
    { id: "sql", name: "SQL Database", icon: <Database className="w-5 h-5" /> },
    { id: "ftp", name: "FTP/SFTP", icon: <FileJson className="w-5 h-5" /> },
    { id: "github", name: "GitHub", icon: <Code className="w-5 h-5" /> },
    { id: "azure", name: "Azure Blob", icon: <Cloud className="w-5 h-5" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target as HTMLFormElement;
    const destSelect = form.querySelector('select[name="destination_folder"]') as HTMLSelectElement;
    const destFolderId = destSelect?.value || null;

    setTimeout(() => {
      setIsSubmitting(false);
      onImportComplete({
        id: `imported-${Date.now()}`,
        user_id: "user",
        filename: `Imported_Data_${selectedSource}.csv`,
        original_filename: `Imported_Data_${selectedSource}.csv`,
        size_bytes: 2048000,
        row_count: 15000,
        column_count: 8,
        metadata: { columns: [], dtypes: {}, sample: [] },
        status: "indexed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        folder_id: destFolderId
      });
    }, 1500);
  };

  const renderConfigurationForm = () => {
    switch (selectedSource) {
      case "url":
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Dataset Name</label>
                <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="e.g. Sales_2023" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Source URL</label>
                <input type="url" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="https://example.com/data.csv" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">File Format</label>
                <select className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]">
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>Parquet</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Authentication (Optional)</label>
                <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="Bearer Token or Basic Auth" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-all bg-[var(--card-color)]">
                Test URL
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Connecting...</> : "Import Dataset"}
              </button>
            </div>
          </>
        );
      case "ftp":
        return (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Host</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="ftp.example.com" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Port</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="22" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Username</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Password</label>
                  <input type="password" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Remote Path</label>
                <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="/data/export.csv" required />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-all bg-[var(--card-color)]">
                Test Connection
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Connecting...</> : "Import Dataset"}
              </button>
            </div>
          </>
        );
      case "sql":
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Connection Name</label>
                <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="Production DB" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Host</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="db.example.com" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Port</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="5432" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Database Name</label>
                <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="production_db" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Username</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Password</label>
                  <input type="password" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Schema</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="public" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Table</label>
                  <input type="text" className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]" placeholder="users" required />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-all bg-[var(--card-color)]">
                Test Connection
              </button>
              <button type="button" className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-all bg-[var(--card-color)]">
                Preview Data
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Connecting...</> : "Import Dataset"}
              </button>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="space-y-4">
               <div className="text-sm text-[var(--text-secondary)]">
                 Configuration fields for {selectedSource} will appear here.
               </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Connecting...</> : "Import Dataset"}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden h-full min-h-[500px]">
      
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Repository
        </button>
      </div>

      {/* Split Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane - Source Types */}
        <div className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-color)] overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 px-2">Source Types</div>
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => setSelectedSource(source.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === source.id
                  ? "bg-cyan-500/10 text-cyan-500"
                  : "text-[var(--text-primary)] hover:bg-[var(--card-color)]"
              }`}
            >
              <span className={selectedSource === source.id ? "text-cyan-500" : "text-[var(--text-secondary)]"}>
                {source.icon}
              </span>
              {source.name}
            </button>
          ))}
        </div>

        {/* Right Pane - Configuration */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--card-color)]">
          <div className="mb-6 pb-6 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-500" />
              Connect Data Source
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Configure parameters for {sources.find(s => s.id === selectedSource)?.name}.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {renderConfigurationForm()}
            
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Destination Folder</label>
                <select 
                  name="destination_folder"
                  className="w-full max-w-md bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                  defaultValue={currentFolderId || ""}
                >
                  <option value="">Root Repository</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.parent_id ? `${folders.find(parent => parent.id === f.parent_id)?.name || ''} > ${f.name}` : f.name}
                    </option>
                  ))}
                </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
