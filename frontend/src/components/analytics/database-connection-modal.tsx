"use client";

import React, { useState } from "react";
import { Database, TableProperties, AlertCircle, Loader2, CheckCircle2, Folder, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DatabaseConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionSuccess: (data: any) => void;
}

const MOCK_FOLDERS = [
  {
    name: "public",
    tables: [
      { id: "tbl_1", schema: "public", name: "users_activity", rows: "1.2M", size: "245 MB" },
      { id: "tbl_4", schema: "public", name: "product_catalog", rows: "4.2K", size: "2 MB" }
    ]
  },
  {
    name: "finance",
    tables: [
      { id: "tbl_2", schema: "finance", name: "mrr_history", rows: "52.4K", size: "12 MB" }
    ]
  },
  {
    name: "events",
    tables: [
      { id: "tbl_3", schema: "events", name: "retention_events", rows: "8.4M", size: "1.2 GB" }
    ]
  }
];

export function DatabaseConnectionModal({ isOpen, onClose, onConnectionSuccess }: DatabaseConnectionModalProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["public", "finance"]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(f => f !== folderName)
        : [...prev, folderName]
    );
  };

  const handleConnect = async () => {
    if (!selectedTable) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let tableInfo = null;
      for (const folder of MOCK_FOLDERS) {
        const found = folder.tables.find(t => t.id === selectedTable);
        if (found) {
          tableInfo = found;
          break;
        }
      }
      
      const mockResult = {
        filename: `${tableInfo?.schema}.${tableInfo?.name}`,
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
      
      onConnectionSuccess(mockResult);
      onClose();
      setSelectedTable(null);
      
    } catch (err: any) {
      setError(err.message || "Failed to connect to database");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border-zinc-200 text-zinc-900 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-zinc-900">
            <Database className="w-5 h-5 text-indigo-600" />
            Connect to Database
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Select a table from your enterprise workspace to analyze.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="space-y-1 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {MOCK_FOLDERS.map((folder) => {
              const isExpanded = expandedFolders.includes(folder.name);
              return (
                <div key={folder.name} className="mb-1">
                  <div 
                    onClick={() => toggleFolder(folder.name)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 cursor-pointer text-zinc-700 transition-colors select-none"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400" />
                    )}
                    <Folder className="w-4 h-4 text-indigo-500 fill-indigo-100" />
                    <span className="text-sm font-medium">{folder.name}</span>
                    <span className="text-xs text-zinc-400 ml-auto">{folder.tables.length} tables</span>
                  </div>
                  
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6 pr-1 overflow-hidden flex flex-col gap-1 mt-1"
                      >
                        {folder.tables.map(table => (
                          <div 
                            key={table.id}
                            onClick={() => setSelectedTable(table.id)}
                            className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                              selectedTable === table.id 
                                ? "border-indigo-500 bg-indigo-50" 
                                : "border-transparent hover:border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded bg-white border border-zinc-200 flex items-center justify-center ${selectedTable === table.id ? "text-indigo-600 border-indigo-200" : "text-zinc-500 group-hover:text-zinc-600"}`}>
                                <TableProperties className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-900">{table.name}</h4>
                                <p className="text-xs text-zinc-500 mt-0.5">{table.rows} rows • {table.size}</p>
                              </div>
                            </div>
                            {selectedTable === table.id && (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isConnecting} className="text-zinc-500 hover:text-zinc-900">
            Cancel
          </Button>
          <Button 
            onClick={handleConnect} 
            disabled={!selectedTable || isConnecting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px] shadow-sm"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect & Analyze"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
