"use client";

import React, { useState } from 'react';
import { useDashboards, useCreateDashboard } from '@/features/analytics/api';
import { LayoutGrid, Plus, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FilterEngine } from '@/components/analytics/filter-engine';
import { KPICard } from '@/components/analytics/kpi-card';
import { TrendChart, AnalyticsFunnelChart, CohortHeatmap } from '@/components/analytics/chart-system';
import { Button } from '@/components/ui/button';
import { Upload, Database } from 'lucide-react';
import { DatabaseConnectionModal } from '@/components/analytics/database-connection-modal';
import { FileAnalysisView } from '@/components/analytics/file-analysis-view';

export default function AnalyticsOverviewPage() {
  const { data: dashboards, isLoading } = useDashboards();
  const createDashboard = useCreateDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({});
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newDashboard = await createDashboard.mutateAsync({
        name: 'New Custom Dashboard',
        description: 'A new custom dashboard for analytics.',
        layout: []
      });
      router.push(`/analytics/${newDashboard.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Mock data for the overview dashboard
  const revenueData = [
    { date: "Jan", mrr: 40000 },
    { date: "Feb", mrr: 42000 },
    { date: "Mar", mrr: 45000 },
    { date: "Apr", mrr: 48000 },
    { date: "May", mrr: 52000 },
  ];

  const funnelData = [
    { step_name: "Website Visit", users: 10000, conversion_rate: 100 },
    { step_name: "Sign Up", users: 5000, conversion_rate: 50 },
    { step_name: "Complete Profile", users: 3000, conversion_rate: 60 },
    { step_name: "Upgrade Plan", users: 150, conversion_rate: 5 },
  ];

  const cohortData = [
    { cohort_date: "2026-05-01", period: 0, users: 1000, retention_rate: 100.0 },
    { cohort_date: "2026-05-01", period: 1, users: 400, retention_rate: 40.0 },
    { cohort_date: "2026-05-01", period: 2, users: 250, retention_rate: 25.0 },
    { cohort_date: "2026-05-01", period: 3, users: 150, retention_rate: 15.0 },
    { cohort_date: "2026-06-01", period: 0, users: 1200, retention_rate: 100.0 },
    { cohort_date: "2026-06-01", period: 1, users: 540, retention_rate: 45.0 },
    { cohort_date: "2026-06-01", period: 2, users: 300, retention_rate: 25.0 },
    { cohort_date: "2026-07-01", period: 0, users: 1500, retention_rate: 100.0 },
    { cohort_date: "2026-07-01", period: 1, users: 750, retention_rate: 50.0 },
  ];

  if (analysisResult) {
    return <FileAnalysisView data={analysisResult} onClose={() => setAnalysisResult(null)} />;
  }

  return (
    <div className="flex-1 p-8 pt-6 space-y-8">
      {/* Header and Filter Engine */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Analytics Overview</h1>
          <p className="text-muted-foreground text-sm">Centralized intelligence for KPIs, segments, and business metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <FilterEngine onFilterChange={setFilters} />
          <Button 
            variant="outline"
            onClick={() => setIsConnectionModalOpen(true)}
            className="border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
          >
            <Database className="w-4 h-4 mr-2" />
            From Workspace Database
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isCreating ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            New Dashboard
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Monthly Recurring Revenue" 
          value={52000} 
          format="currency" 
          trend={15.2} 
          previousValue="$48,000"
          sparklineData={[{value:40000}, {value:42000}, {value:45000}, {value:48000}, {value:52000}]}
        />
        <KPICard 
          title="Active Users" 
          value={12540} 
          format="number" 
          trend={8.4} 
          previousValue="11,200"
          sparklineData={[{value:10000}, {value:10500}, {value:11200}, {value:12000}, {value:12540}]}
        />
        <KPICard 
          title="Overall Retention Rate" 
          value={65.5} 
          format="percentage" 
          trend={-2.1} 
          previousValue="67.6%"
          sparklineData={[{value:68}, {value:67}, {value:67.6}, {value:66}, {value:65.5}]}
        />
        <KPICard 
          title="CAC" 
          value={125} 
          format="currency" 
          trend={-10.5} 
          previousValue="$140"
          sparklineData={[{value:150}, {value:145}, {value:140}, {value:130}, {value:125}]}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-6 gap-6">
        <TrendChart 
          title="MRR Growth" 
          description="Monthly recurring revenue over time"
          data={revenueData}
          xKey="date"
          series={[{ key: "mrr", name: "MRR", color: "#8b5cf6" }]}
          type="area"
          yAxisFormatter={(val) => `$${val / 1000}k`}
        />
        <AnalyticsFunnelChart 
          title="Conversion Funnel" 
          description="User acquisition drop-offs"
          data={funnelData}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-6 gap-6">
        <CohortHeatmap 
          title="Retention Cohorts" 
          description="User retention rates by monthly cohorts"
          data={cohortData}
        />
        
        {/* Dashboards List */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-zinc-900">Custom Dashboards</h3>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              <div className="h-20 bg-zinc-100 rounded-xl animate-pulse"></div>
            ) : dashboards?.slice(0, 3).map((dashboard, index) => (
              <Link key={dashboard.id} href={`/analytics/${dashboard.id}`}>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-indigo-300 transition-all group cursor-pointer flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 transition-colors">
                        {dashboard.name}
                      </h4>
                      <p className="text-xs text-zinc-500 line-clamp-1">{dashboard.description || 'Custom layout'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600" />
                </motion.div>
              </Link>
            ))}
            
            {dashboards && dashboards.length > 3 && (
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-white">
                View All Dashboards <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <DatabaseConnectionModal 
        isOpen={isConnectionModalOpen} 
        onClose={() => setIsConnectionModalOpen(false)} 
        onConnectionSuccess={(data) => setAnalysisResult(data)} 
      />
    </div>
  );
}
