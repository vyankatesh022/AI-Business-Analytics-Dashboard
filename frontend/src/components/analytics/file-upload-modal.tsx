"use client";

import React, { useState, useRef } from "react";
import { Upload, X, File, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (data: any) => void;
}

export function FileUploadModal({ isOpen, onClose, onUploadSuccess }: FileUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // In a real app, you would fetch from the actual API endpoint
      // Mocking the request due to missing auth tokens in this scope
      // const res = await fetch("http://localhost:8000/api/v1/analytics/analyze-file", {
      //   method: "POST",
      //   body: formData,
      // });
      
      // Simulating API call latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Temporary mock response since we cannot easily bypass the auth middleware from this client component
      const mockResult = {
        filename: file.name,
        row_count: 5240,
        column_count: 4,
        columns: [
          { name: "Date", type: "categorical", missing_count: 0, unique_count: 30 },
          { name: "Revenue", type: "numeric", missing_count: 12, unique_count: 450 },
          { name: "Users", type: "numeric", missing_count: 0, unique_count: 320 },
          { name: "Category", type: "categorical", missing_count: 5, unique_count: 4 }
        ],
        preview: [
          { Date: "2026-05-01", Revenue: "1200", Users: "45", Category: "Pro" },
          { Date: "2026-05-02", Revenue: "1500", Users: "52", Category: "Enterprise" },
          { Date: "2026-05-03", Revenue: "900", Users: "30", Category: "Starter" },
          { Date: "2026-05-04", Revenue: "2100", Users: "85", Category: "Enterprise" },
          { Date: "2026-05-05", Revenue: "1150", Users: "41", Category: "Pro" }
        ]
      };
      
      onUploadSuccess(mockResult);
      onClose();
      setFile(null);
      
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Data for Analysis</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Drag and drop a CSV file to instantly generate analytics and descriptive statistics.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv"
              onChange={handleFileChange}
            />
            
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div 
                  key="file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                    <File className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-medium text-white">{file.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 text-zinc-400 hover:text-white"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    Remove
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-medium text-white">Click or drag file to this area</h4>
                  <p className="text-xs text-zinc-500 mt-1">Supports only .csv files</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isUploading} className="text-zinc-400 hover:text-white">
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
