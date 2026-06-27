import React, { useState } from 'react';
import { WorkspaceDataset } from '../types';
import { 
  X, MessageSquare, BarChart2, Table as TableIcon, FileJson, Activity, Network, Zap,
  CheckCircle2, AlertTriangle, Lightbulb, Clock, Hash, Type, FileDigit, Calendar, Database, Sparkles, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DatasetDetailProps {
  dataset: WorkspaceDataset;
  onClose: () => void;
}

export function DatasetDetail({ dataset, onClose }: DatasetDetailProps) {
  const [activeTab, setActiveTab] = useState('eda');

  // Hardcoded EDA mock data to match the design
  const salespersons = [
    { name: 'John', count: 9 },
    { name: 'Sarah', count: 9 },
    { name: 'Mike', count: 8 },
    { name: 'Emma', count: 8 },
    { name: 'David', count: 8 },
    { name: 'Lisa', count: 8 },
  ];

  const products = [
    { name: 'Laptop', count: 8 },
    { name: 'Mouse', count: 7 },
    { name: 'Keyboard', count: 7 },
    { name: 'Monitor', count: 7 },
    { name: 'Printer', count: 7 },
    { name: 'Headset', count: 7 },
    { name: 'Webcam', count: 7 },
  ];

  return (
    <div className="flex flex-col bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-900">{dataset.name}</h2>
            <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border-transparent font-medium px-3 py-0.5 rounded-full">Workspace</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Explore data, analyze schema, and review AI-driven quality checks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 text-slate-400 hover:text-slate-600">
            <MessageSquare size={18} />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 text-slate-400 hover:text-slate-600" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-6 border-b border-slate-100">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent p-0 h-auto gap-8 justify-start w-full overflow-x-auto hide-scrollbar border-b-0">
            <TabsTrigger 
              value="summary" 
              className={`px-0 py-2 rounded-none border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-slate-900 data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'summary' ? '' : 'hover:text-slate-700'}`}
            >
              <FileJson size={16} className="mr-2" />
              Table Summary
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className={`px-0 py-2 rounded-none border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-slate-900 data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'ai-insights' ? '' : 'hover:text-slate-700'}`}
            >
              <Zap size={16} className="mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="table-view" 
              className={`px-0 py-2 rounded-none border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-slate-900 data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'table-view' ? '' : 'hover:text-slate-700'}`}
            >
              <TableIcon size={16} className="mr-2" />
              Table View
            </TabsTrigger>
            <TabsTrigger 
              value="schema-map" 
              className={`px-0 py-2 rounded-none border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-slate-900 data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'schema-map' ? '' : 'hover:text-slate-700'}`}
            >
              <Network size={16} className="mr-2" />
              Schema Map
            </TabsTrigger>
            <TabsTrigger 
              value="quality-audit" 
              className={`px-0 py-2 rounded-none border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-slate-900 data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'quality-audit' ? '' : 'hover:text-slate-700'}`}
            >
              <Activity size={16} className="mr-2" />
              AI Quality Audit
            </TabsTrigger>
            
            {/* The active tab in the screenshot is actually styled differently - like a pill button. */}
            <TabsTrigger 
              value="eda" 
              className={`px-4 py-2 rounded-full border-0 data-[state=active]:bg-[#00bcd4] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-500 data-[state=active]:shadow-md font-medium transition-all hover:text-slate-700 -mt-1`}
            >
              <BarChart2 size={16} className="mr-2" />
              EDA Report
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Body */}
      <div className="flex-1 bg-white p-6">
        {activeTab === 'eda' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: Salesperson */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[1.05rem] font-bold text-slate-800">Salesperson</h3>
                <Badge variant="secondary" className="bg-purple-100/80 text-purple-600 hover:bg-purple-200 border-transparent rounded-full px-3 py-1 font-medium text-xs">6 unique</Badge>
              </div>
              <div className="space-y-5">
                {salespersons.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium text-[0.95rem]">{s.name}</span>
                    <span className="text-slate-500 font-medium text-[0.95rem]">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[1.05rem] font-bold text-slate-800">Product</h3>
                <Badge variant="secondary" className="bg-purple-100/80 text-purple-600 hover:bg-purple-200 border-transparent rounded-full px-3 py-1 font-medium text-xs">7 unique</Badge>
              </div>
              <div className="space-y-5">
                {products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium text-[0.95rem]">{p.name}</span>
                    <span className="text-slate-500 font-medium text-[0.95rem]">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'summary' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-sm border-slate-200/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Hash size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Rows</p>
                    <p className="text-2xl font-bold text-slate-900">142,854</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Network size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Columns</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Database size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">File Size</p>
                    <p className="text-2xl font-bold text-slate-900">{(dataset.sizeBytes ? (dataset.sizeBytes / 1024).toFixed(2) : '2.05')} KB</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Last Updated</p>
                    <p className="text-2xl font-bold text-slate-900">Today</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-sm border-slate-200/60">
              <CardContent className="p-6">
                <h3 className="text-[1.05rem] font-bold text-slate-800 mb-6">Data Types Distribution</h3>
                <div className="flex h-6 rounded-full overflow-hidden mb-4">
                  <div className="bg-indigo-500 w-1/2" title="String (50%)"></div>
                  <div className="bg-emerald-500 w-1/3" title="Numeric (33%)"></div>
                  <div className="bg-amber-500 w-1/6" title="Date (17%)"></div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm font-medium text-slate-600">String (6 cols)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-slate-600">Numeric (4 cols)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm font-medium text-slate-600">Date (2 cols)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'ai-insights' && (
          <div className="flex flex-col gap-4">
            <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <CardContent className="p-6 flex gap-4">
                <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-slate-900">Anomalous Sales Spike Detected</h4>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-transparent text-xs">High Confidence</Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Sales volume for 'Laptop' increased by 314% compared to the 30-day moving average. This anomaly occurred primarily in the 'North America' region between Nov 24 and Nov 27, coinciding with holiday promotions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <CardContent className="p-6 flex gap-4">
                <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-slate-900">Strong Correlation Identified</h4>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent text-xs">Medium Confidence</Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    A strong positive correlation (r = 0.82) was found between 'Marketing Spend' and 'Daily Active Users'. Suggesting that recent ad campaigns have a highly direct impact on user acquisition.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <CardContent className="p-6 flex gap-4">
                <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-bold text-slate-900">Potential Data Quality Issue</h4>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-transparent text-xs">Action Required</Badge>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Found 124 records (0.08% of dataset) where 'Revenue' is negative. Unless representing refunds, this might indicate a logging error in the payment gateway integration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'table-view' && (
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-sm bg-white">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Salesperson</th>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Region</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'TXN-001', date: '2026-06-25', person: 'Sarah', prod: 'Laptop', region: 'North America', amt: '$1,299.00' },
                  { id: 'TXN-002', date: '2026-06-25', person: 'John', prod: 'Keyboard', region: 'Europe', amt: '$129.00' },
                  { id: 'TXN-003', date: '2026-06-25', person: 'Mike', prod: 'Monitor', region: 'Asia Pacific', amt: '$349.00' },
                  { id: 'TXN-004', date: '2026-06-26', person: 'Sarah', prod: 'Mouse', region: 'North America', amt: '$49.00' },
                  { id: 'TXN-005', date: '2026-06-26', person: 'Emma', prod: 'Headset', region: 'Europe', amt: '$199.00' },
                  { id: 'TXN-006', date: '2026-06-26', person: 'David', prod: 'Laptop', region: 'North America', amt: '$1,299.00' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-indigo-600">{row.id}</td>
                    <td className="px-6 py-3 text-slate-600">{row.date}</td>
                    <td className="px-6 py-3 text-slate-600">{row.person}</td>
                    <td className="px-6 py-3 text-slate-600">{row.prod}</td>
                    <td className="px-6 py-3 text-slate-600">{row.region}</td>
                    <td className="px-6 py-3 text-slate-900 font-medium text-right">{row.amt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'schema-map' && (
          <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-sm bg-white">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Column Name</th>
                  <th className="px-6 py-4 font-semibold">Inferred Type</th>
                  <th className="px-6 py-4 font-semibold">Nulls</th>
                  <th className="px-6 py-4 font-semibold">Unique</th>
                  <th className="px-6 py-4 font-semibold">Description (AI Generated)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'transaction_id', type: 'String', nulls: '0%', unique: '100%', desc: 'Primary identifier for the transaction.' },
                  { name: 'date', type: 'DateTime', nulls: '0%', unique: '12%', desc: 'Timestamp when the transaction occurred.' },
                  { name: 'salesperson', type: 'String', nulls: '0%', unique: '< 1%', desc: 'Name of the employee who closed the sale.' },
                  { name: 'product_id', type: 'String', nulls: '0%', unique: '5%', desc: 'SKU or product identifier.' },
                  { name: 'region', type: 'String', nulls: '2.4%', unique: '< 1%', desc: 'Geographic region of the sale.' },
                  { name: 'amount', type: 'Float', nulls: '0%', unique: '45%', desc: 'Total revenue amount for the transaction.' },
                ].map((col, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{col.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 font-normal border-slate-200">{col.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{col.nulls}</td>
                    <td className="px-6 py-4 text-slate-600">{col.unique}</td>
                    <td className="px-6 py-4 text-slate-500 italic">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'quality-audit' && (
          <div className="flex flex-col gap-6">
            <Card className="shadow-sm border-slate-200/60 overflow-hidden relative">
              <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none"></div>
              <CardContent className="p-8 flex items-center gap-8">
                <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="94, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-2xl font-bold text-emerald-600">94</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Excellent Data Quality</h3>
                  <p className="text-slate-500 max-w-xl">
                    This dataset passes most AI quality constraints. It is ready for analytics and machine learning workloads with minimal preprocessing required.
                  </p>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-[1.05rem] font-bold text-slate-800 mt-2">Constraint Checks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
                <CardContent className="p-5 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">No Duplicates</h4>
                    <p className="text-sm text-slate-600">0 exact duplicate rows found across the entire dataset.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
                <CardContent className="p-5 flex items-start gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Missing Values</h4>
                    <p className="text-sm text-slate-600">Found 2.4% missing values in the 'region' column.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
                <CardContent className="p-5 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Format Consistency</h4>
                    <p className="text-sm text-slate-600">Dates and numeric values strictly adhere to expected formats.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
