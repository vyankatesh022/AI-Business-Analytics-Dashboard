'use client';

import React, { useState } from 'react';
import { usePredictions } from '../context/PredictionsContext';
import { Model } from '../types';

export const ModelRegistry: React.FC = () => {
  const { models, deployModel } = usePredictions();
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'CHURN_PREDICTION' });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    await deployModel({
      name: formData.name || 'New Model',
      model_type: formData.type,
      problem_type: formData.type === 'CHURN_PREDICTION' ? 'CLASSIFICATION' : 'REGRESSION'
    });
    setIsDeploying(false);
    setShowDeployModal(false);
    setFormData({ name: '', type: 'CHURN_PREDICTION' });
  };

  return (
    <>
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Model Registry
          </h3>
          <button 
            onClick={() => setShowDeployModal(true)}
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-medium hover:bg-indigo-100 transition flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Deploy
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="pb-2 font-semibold px-1">Model Name</th>
                <th className="pb-2 font-semibold px-1">Type</th>
                <th className="pb-2 font-semibold px-1 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {models.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-slate-500">No active models.</td>
                </tr>
              ) : (
                models.slice(0, 4).map((model) => (
                  <tr key={model.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition cursor-pointer" onClick={() => setSelectedModel(model)}>
                    <td className="py-2.5 px-1 font-medium text-slate-700 truncate max-w-[100px]">{model.name}</td>
                    <td className="py-2.5 px-1">
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium whitespace-nowrap">
                        {model.model_type.split('_')[0]}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-right font-medium text-slate-600">
                      {(Math.random() * (98 - 85) + 85).toFixed(1)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedModel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-slate-800">Model Details</h3>
                <button onClick={() => setSelectedModel(null)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-slate-800">{selectedModel.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">ID: {selectedModel.id}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Type</p>
                    <p className="font-medium mt-1">{selectedModel.model_type.replace('_', ' ')}</p>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Problem Type</p>
                    <p className="font-medium mt-1">{selectedModel.problem_type}</p>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Endpoint Status</p>
                    <p className="font-medium text-emerald-600 mt-1">IN_SERVICE</p>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Accuracy Score</p>
                    <p className="font-medium mt-1 text-indigo-600">92.4%</p>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-2">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                      Retrain Model
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                      Compare
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeployModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-slate-800">Deploy New Model</h3>
                <button onClick={() => setShowDeployModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleDeploy} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Q3 Revenue Forecast"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="CHURN_PREDICTION">Churn Prediction</option>
                    <option value="REVENUE_FORECAST">Revenue Forecast</option>
                    <option value="ANOMALY_DETECTION">Anomaly Detection</option>
                    <option value="CUSTOMER_LTV">Customer LTV</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeployModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeploying}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeploying ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deploying...
                      </>
                    ) : (
                      'Deploy Model'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
