"use client";

import React, { useState, useEffect } from "react";
import { Folder, X } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading: boolean;
}

export default function CreateFolderModal({ isOpen, onClose, onSubmit, isLoading }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFolderName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onSubmit(folderName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-[var(--card-color)] border border-[var(--border-color)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Folder className="w-5 h-5 text-cyan-500" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Create New Folder</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-color)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5">
            <label htmlFor="folderName" className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Folder Name <span className="text-red-500">*</span>
            </label>
            <input
              id="folderName"
              type="text"
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Q3 Marketing Data"
              className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/50 transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-color)] border border-transparent hover:border-[var(--border-color)] rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim() || isLoading}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
