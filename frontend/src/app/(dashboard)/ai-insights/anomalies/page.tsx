"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccountStore } from '@/store/account-store';
import { fetchAnomalies } from '@/features/ai-insights/api/mocks';
import { AnomalyInsight } from '@/features/ai-insights/types';
import { AlertTriangle, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnomaliesPage() {
  const activeAccount = useAccountStore(state => state.accounts.find(a => a.id === state.activeAccountId));
  const [anomalies, setAnomalies] = useState<AnomalyInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accountId = activeAccount?.id || 'tenant-1';
    setIsLoading(true);
    fetchAnomalies(accountId)
      .then(setAnomalies)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [activeAccount]);

  if (isLoading) return <div className="p-8 animate-pulse"><div className="h-8 bg-slate-200 rounded w-64 mb-8"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Anomaly Detection</h1>
        </div>
        <p className="text-slate-500">Statistically significant deviations from expected business patterns.</p>
      </motion.div>

      <div className="space-y-6">
        {anomalies.map((anom, idx) => (
          <motion.div 
            key={anom.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row"
          >
            <div className={cn(
              "p-6 md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100",
              anom.severity === 'Critical' ? "bg-red-50/50" : "bg-amber-50/50"
            )}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className={cn("w-5 h-5", anom.severity === 'Critical' ? "text-red-600" : "text-amber-600")} />
                <span className={cn("font-bold uppercase tracking-widest text-xs", anom.severity === 'Critical' ? "text-red-700" : "text-amber-700")}>
                  {anom.severity} Anomaly
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{anom.metric}</h3>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Clock className="w-4 h-4" />
                {new Date(anom.detectedAt).toLocaleString()}
              </div>
            </div>
            
            <div className="p-6 md:w-2/3 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expected Range</div>
                  <div className="text-lg font-bold text-slate-700">{anom.expectedRange[0]} - {anom.expectedRange[1]}</div>
                </div>
                <div className={cn("p-4 rounded-xl border", anom.severity === 'Critical' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100")}>
                  <div className={cn("text-xs font-semibold uppercase tracking-wider mb-1", anom.severity === 'Critical' ? "text-red-700" : "text-amber-700")}>Actual Value</div>
                  <div className={cn("text-lg font-bold", anom.severity === 'Critical' ? "text-red-900" : "text-amber-900")}>{anom.actualValue}</div>
                </div>
              </div>
              
              <div className="mt-auto">
                <h4 className="text-sm font-bold text-slate-900 mb-2">AI Analysis</h4>
                <p className="text-slate-600">{anom.explanation}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {anomalies.length === 0 && (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No anomalies detected</h3>
            <p className="text-slate-500">All systems and metrics are operating within expected parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
