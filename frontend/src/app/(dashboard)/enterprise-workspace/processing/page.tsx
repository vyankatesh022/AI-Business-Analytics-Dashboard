"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Database,
  Box,
  Layers,
  Cpu
} from "lucide-react";

// Mock Data
const activeJobs = [
  { id: "job-1", name: "User Events Cleansing", type: "CLEANING", status: "RUNNING", progress: 68 },
  { id: "job-2", name: "Q3 Revenue Features", type: "FEATURE_ENGINEERING", status: "RUNNING", progress: 42 },
  { id: "job-3", name: "Churn Model Retraining", type: "TRAINING", status: "PENDING", progress: 0 },
];

const dataQualityTrends = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 88 },
  { month: "Mar", score: 86 },
  { month: "Apr", score: 92 },
  { month: "May", score: 95 },
  { month: "Jun", score: 98 },
];

const jobsStats = [
  { status: "Completed", count: 142 },
  { status: "Failed", count: 8 },
  { status: "Running", count: 2 },
];

const historyJobs = [
  { id: "job-101", name: "Q1 Data Cleaning", type: "CLEANING", status: "COMPLETED", date: "2026-06-25", duration: "45s" },
  { id: "job-102", name: "User Base Profiling", type: "PROFILING", status: "COMPLETED", date: "2026-06-26", duration: "1m 12s" },
  { id: "job-103", name: "Retention Features Gen", type: "FEATURE_ENGINEERING", status: "FAILED", date: "2026-06-26", duration: "22s" },
  { id: "job-104", name: "Daily Revenue Sync", type: "PIPELINE", status: "COMPLETED", date: "2026-06-27", duration: "3m 40s" },
];

const featureStore = [
  { id: "feat-1", group: "User Features", name: "days_since_last_login", type: "INTEGER", status: "ONLINE" },
  { id: "feat-2", group: "Revenue Features", name: "avg_order_value_30d", type: "FLOAT", status: "BOTH" },
  { id: "feat-3", group: "Retention Features", name: "is_churn_risk", type: "BOOLEAN", status: "OFFLINE" },
  { id: "feat-4", group: "Cohort Features", name: "signup_cohort_month", type: "STRING", status: "ONLINE" },
];

const modelRegistry = [
  { id: "mod-1", name: "Churn Predictor v2", type: "CLASSIFICATION", status: "IN_SERVICE", endpoint: "ep-churn-v2", accuracy: "94.2%" },
  { id: "mod-2", name: "Revenue Forecast Q3", type: "REGRESSION", status: "TRAINING", endpoint: "-", accuracy: "-" },
  { id: "mod-3", name: "Anomaly Detector", type: "CLUSTERING", status: "STOPPED", endpoint: "-", accuracy: "89.5%" },
];

export default function ProcessingDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "features" | "models">("overview");

  return (
    <div className="p-6 max-w-7xl mx-auto text-white space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Enterprise Processing
          </h1>
          <p className="text-gray-400 mt-2">Data pipelines, feature engineering, and ML operations.</p>
        </div>
        <div className="flex space-x-2 bg-gray-800/50 p-1 rounded-xl backdrop-blur-md border border-gray-700/50">
          {(["overview", "jobs", "features", "models"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Active Jobs" value="3" subtitle="2 running, 1 pending" icon={<Activity className="text-blue-400" />} />
            <KpiCard title="Success Rate" value="94.7%" subtitle="Last 30 days" icon={<CheckCircle className="text-emerald-400" />} />
            <KpiCard title="Feature Store" value="1,240" subtitle="Active features" icon={<Database className="text-purple-400" />} />
            <KpiCard title="Active Models" value="8" subtitle="Deployed to SageMaker" icon={<Cpu className="text-orange-400" />} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            
            {/* Data Quality Chart */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-400" />
                Data Quality Trends
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataQualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={[60, 100]} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#818CF8" strokeWidth={3} dot={{ r: 4, fill: '#818CF8' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Jobs Queue */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl flex flex-col">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Active Processing Queue
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4">
                {activeJobs.map(job => (
                  <div key={job.id} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-200">{job.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        job.status === "RUNNING" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span>{job.type}</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Processing Job History Tab */}
      {activeTab === "jobs" && (
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center mb-6">
            <Layers className="w-6 h-6 text-indigo-400 mr-3" />
            <h2 className="text-xl font-medium">Processing Job History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Job Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {historyJobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 text-gray-200 font-medium">{job.name}</td>
                    <td className="py-4 text-gray-400">{job.type}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        job.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{job.date}</td>
                    <td className="py-4 text-gray-400">{job.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feature Store Tab */}
      {activeTab === "features" && (
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-xl font-medium">Enterprise Feature Store</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Feature Name</th>
                  <th className="pb-3 font-medium">Group</th>
                  <th className="pb-3 font-medium">Data Type</th>
                  <th className="pb-3 font-medium">Storage</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {featureStore.map((feat) => (
                  <tr key={feat.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 text-gray-200 font-medium">{feat.name}</td>
                    <td className="py-4 text-gray-400">{feat.group}</td>
                    <td className="py-4 text-gray-400">{feat.type}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        feat.status === 'ONLINE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        feat.status === 'BOTH' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {feat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Model Registry Tab */}
      {activeTab === "models" && (
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center mb-6">
            <Cpu className="w-6 h-6 text-orange-400 mr-3" />
            <h2 className="text-xl font-medium">Model Registry & Endpoints</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Model Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Endpoint</th>
                  <th className="pb-3 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {modelRegistry.map((mod) => (
                  <tr key={mod.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 text-gray-200 font-medium">{mod.name}</td>
                    <td className="py-4 text-gray-400">{mod.type}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mod.status === 'IN_SERVICE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        mod.status === 'TRAINING' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {mod.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{mod.endpoint}</td>
                    <td className="py-4 text-indigo-400">{mod.accuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable KPI Component
function KpiCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 backdrop-blur-xl flex flex-col justify-between hover:bg-gray-800/60 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-gray-900/50 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-100">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      </div>
    </div>
  );
}
