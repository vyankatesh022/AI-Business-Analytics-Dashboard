'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePredictions } from '../context/PredictionsContext';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";

const generateTrendData = (seed: number, isDown: boolean) => {
  return Array.from({ length: 12 }).map((_, i) => ({
    value: isDown 
      ? 100 - (i * 5) + Math.random() * 10 
      : 20 + (i * 5) + Math.random() * 10
  }));
};

export const RecentPredictions: React.FC = () => {
  const { recentPredictions } = usePredictions();

  if (!recentPredictions || recentPredictions.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Predictions
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="pb-3 px-2">Name</th>
              <th className="pb-3 px-2">Data Source</th>
              <th className="pb-3 px-2">Model</th>
              <th className="pb-3 px-2">Horizon</th>
              <th className="pb-3 px-2">Trend</th>
              <th className="pb-3 px-2">Created By</th>
              <th className="pb-3 px-2">Created At</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody 
            className="text-sm"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {recentPredictions.map((pred, idx) => {
              const isDown = pred.name.includes('Churn');
              const strokeColor = pred.status === 'Failed' ? '#F43F5E' : isDown ? '#F59E0B' : '#10B981';
              
              return (
                <motion.tr 
                  key={pred.id} 
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition group"
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <td className="py-3 px-2 font-medium text-slate-800">{pred.name}</td>
                  <td className="py-3 px-2 text-slate-600">{pred.dataSource}</td>
                  <td className="py-3 px-2 text-slate-600">{pred.model}</td>
                  <td className="py-3 px-2 text-slate-600">{pred.horizon}</td>
                  <td className="py-3 px-2">
                    <div className="w-16 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateTrendData(idx, isDown)}>
                          <YAxis domain={['dataMin', 'dataMax']} hide />
                          <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-slate-600">{pred.createdBy}</td>
                  <td className="py-3 px-2 text-slate-600">{pred.createdAt}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      pred.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      pred.status === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {pred.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          let view = 'Revenue Forecast';
                          if (pred.name.includes('Churn')) view = 'Churn Risk Projection';
                          else if (pred.name.includes('LTV')) view = 'Demand Forecast';
                          
                          window.dispatchEvent(new CustomEvent('load-prediction-chart', { detail: view }));
                          document.getElementById('forecast-chart-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          toast.success(`Loaded ${pred.name} into chart view.`);
                        }}
                        className="hover:text-indigo-600 p-1 transition hover:bg-indigo-50 rounded" 
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toast.success('Link copied to clipboard!', { description: `Share link for ${pred.name} generated.` }); }}
                        className="hover:text-indigo-600 p-1 transition hover:bg-indigo-50 rounded" 
                        title="Share"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <Dialog>
                        <DialogTrigger render={
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-indigo-600 p-1 transition hover:bg-indigo-50 rounded" 
                            title="Manage Configuration"
                          />
                        }>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Configuration</DialogTitle>
                            <DialogDescription>
                              Adjust settings for {pred.name}. Changes will apply to future predictions.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Model Engine</label>
                              <select className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                                <option>{pred.model}</option>
                                <option>XGBoost (AutoML)</option>
                                <option>Prophet (Advanced)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Auto-Retraining</label>
                              <select className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Never</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Alert Threshold</label>
                              <input type="number" defaultValue={85} className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                              <p className="text-xs text-slate-500">Notify when confidence drops below this %.</p>
                            </div>
                          </div>

                          <DialogFooter showCloseButton>
                            <button 
                              onClick={() => toast.success('Configuration saved successfully!')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
                            >
                              Save Changes
                            </button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};
