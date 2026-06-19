import React, { useRef, useState, useCallback } from "react";
import { ChevronLeft, UploadCloud, X, File, AlertCircle } from "lucide-react";
import { filesize } from "filesize";

import { FolderNode, uploadDataset } from "@/services/datasetApi";
import { useToast } from "@/components/ui/Toast";

interface UploadViewProps {
  onBack: () => void;
  onUploadSuccess: () => void;
  currentFolder?: FolderNode;
}

export default function UploadView({ onBack, onUploadSuccess, currentFolder }: UploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = (file: File) => {
    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      toast({ type: 'error', title: 'File too large', message: 'Maximum file size is 50MB' });
      return;
    }
    
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json', 'text/plain'];
    const validExtensions = ['.csv', '.xlsx', '.json', '.parquet', '.txt'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast({ type: 'error', title: 'Invalid format', message: 'Please upload a valid dataset file format.' });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleBrowseClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);

    try {
      await uploadDataset(selectedFile, currentFolder?.id || null, (p) => {
        setProgress(p);
      });
      toast({ type: 'success', title: 'Upload successful', message: `${selectedFile.name} was successfully uploaded.` });
      onUploadSuccess();
    } catch (err: any) {
      toast({ type: 'error', title: 'Upload failed', message: err.message || 'An error occurred during upload.' });
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden h-full min-h-[500px]">
      
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <button 
          onClick={onBack}
          disabled={isUploading}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Repository
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-[600px] flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Upload Dataset</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 text-center">
            {currentFolder ? (
              <span className="flex items-center gap-1.5 text-cyan-500 font-medium">
                Uploading to: Repository <ChevronLeft className="w-3 h-3 rotate-180" /> {currentFolder.name}
              </span>
            ) : (
              "Import files from your local machine to the Root Repository."
            )}
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {["CSV", "XLSX", "JSON", "PARQUET", "TXT"].map((fmt) => (
              <span key={fmt} className="text-xs font-mono px-2 py-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md text-[var(--text-secondary)]">
                {fmt}
              </span>
            ))}
          </div>

          {!selectedFile ? (
            <div
              onClick={handleBrowseClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full min-h-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group bg-[var(--bg-color)] ${
                isDragging ? 'border-cyan-500 bg-cyan-500/5' : 'border-[var(--border-color)] hover:border-cyan-500/50'
              }`}
            >
              <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-cyan-500' : 'text-[var(--text-secondary)] group-hover:text-cyan-500'}`} />
              <p className="text-lg font-medium text-[var(--text-primary)] mb-2">Drag files here</p>
              <p className="text-sm text-[var(--text-secondary)]">or browse files (Max 50MB)</p>
            </div>
          ) : (
            <div className="w-full min-h-[250px] border border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center p-8 bg-[var(--bg-color)]">
              <div className="flex items-center gap-4 bg-[var(--card-color)] border border-[var(--border-color)] p-4 rounded-lg w-full mb-6">
                <File className="w-8 h-8 text-cyan-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{selectedFile.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{filesize(selectedFile.size).toString()}</p>
                </div>
                {!isUploading && (
                  <button onClick={() => setSelectedFile(null)} className="p-1 text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isUploading && (
                <div className="w-full">
                  <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-[var(--card-color)] h-2 rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full mt-6 flex justify-end gap-3">
            <button
              onClick={onBack}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-colors bg-[var(--card-color)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={selectedFile ? handleUpload : handleBrowseClick}
              disabled={isUploading}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
            >
              {selectedFile ? 'Upload File' : 'Browse Files'}
            </button>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".csv,.xlsx,.json,.parquet,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
}
