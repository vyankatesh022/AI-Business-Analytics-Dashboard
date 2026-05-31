"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { filesize } from 'filesize';
import { uploadDataset, Dataset } from '@/services/datasetApi';
import { motion, AnimatePresence } from 'framer-motion';

interface DatasetUploaderProps {
  onUploadComplete?: (dataset: Dataset) => void;
}

export default function DatasetUploader({ onUploadComplete }: DatasetUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setSuccess(false);

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Quick validation on frontend before uploading
    if (file.size > 100 * 1024 * 1024) {
      setError('File exceeds 100MB size limit.');
      return;
    }

    setIsUploading(true);
    try {
      const dataset = await uploadDataset(file);
      setSuccess(true);
      if (onUploadComplete) {
        onUploadComplete(dataset);
      }
      setTimeout(() => setSuccess(false), 3000); // Reset success after 3s
    } catch (err: any) {
      setError(err.message || 'Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`relative w-full rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
          ${isDragActive ? 'border-primary/80 bg-primary/5' : 'border-neutral-700/50 hover:border-neutral-500 hover:bg-neutral-800/30'}
          ${isDragReject || error ? 'border-red-500/50 bg-red-500/5' : ''}
          ${success ? 'border-green-500/50 bg-green-500/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm text-neutral-300 font-medium">Encrypting & Uploading...</p>
            </motion.div>
          ) : success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-sm text-green-400 font-medium">Dataset Securely Stored!</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="p-4 rounded-full bg-neutral-800/50 border border-neutral-700/50">
                <UploadCloud className="w-8 h-8 text-neutral-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-neutral-200">
                  {isDragActive ? 'Drop dataset here' : 'Click or drag dataset to upload'}
                </p>
                <p className="text-sm text-neutral-500 mt-1">
                  Supports CSV and XLSX formats up to 100MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </motion.div>
      )}
    </div>
  );
}
