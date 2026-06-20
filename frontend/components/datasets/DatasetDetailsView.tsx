"use client";
import React, { useState, useRef, useEffect } from "react";
import { Dataset } from "@/services/datasetApi";
import { X, Table2, Network, ShieldCheck, FileText, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TableView from "./details/TableView";
import SchemaMap from "./details/SchemaMap";
import AIQualityAudit from "./details/AIQualityAudit";
import TableSummary from "./details/TableSummary";
import EDAAnalytics from "./details/EDAAnalytics";

interface DatasetDetailsViewProps {
  dataset: Dataset;
  onDatasetUpdated: (updated: Dataset) => void;
  onBack: () => void;
}

type TabKey = 'summary' | 'table' | 'schema' | 'audit' | 'eda';

export default function DatasetDetailsView({ dataset, onDatasetUpdated, onBack }: DatasetDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const tabs = [
    { id: 'summary' as TabKey, label: 'Table Summary', icon: FileText },
    { id: 'table' as TabKey, label: 'Table View', icon: Table2 },
    { id: 'schema' as TabKey, label: 'Schema Map', icon: Network },
    { id: 'audit' as TabKey, label: 'AI Quality Audit', icon: ShieldCheck },
    { id: 'eda' as TabKey, label: 'EDA Report', icon: BarChart2 },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-240px)] w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header and Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 pt-6 shrink-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {dataset.original_filename || dataset.filename}
              <span className="text-xs font-normal px-2.5 py-1 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-full">
                Workspace
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore data, analyze schema, and review AI-driven quality checks.
            </p>
          </div>
          <button 
            onClick={onBack} 
            className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div 
          className="flex items-center gap-2 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shrink-0 ${
                  isActive 
                    ? 'bg-cyan-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-white scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col h-full"
          >
            {activeTab === 'summary' && <TableSummary dataset={dataset} />}
            {activeTab === 'table' && <TableView dataset={dataset} />}
            {activeTab === 'schema' && <SchemaMap dataset={dataset} />}
            {activeTab === 'audit' && <AIQualityAudit dataset={dataset} onDatasetUpdated={onDatasetUpdated} />}
            {activeTab === 'eda' && <EDAAnalytics dataset={dataset} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
