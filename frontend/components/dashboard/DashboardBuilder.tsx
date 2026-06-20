import React, { useMemo } from 'react';
import { ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useVisualizationStore, WidgetConfig } from '@/store/useVisualizationStore';
import KPIWidget from './KPIWidget';
import ChartWidget from './ChartWidget';
import { useQuery } from '@tanstack/react-query';
import { fetchDatasetAnalytics } from '@/services/datasetApi';

interface DashboardBuilderProps {
  datasetId: string;
}

const WidgetWrapper = ({ widget, datasetId }: { widget: WidgetConfig; datasetId: string }) => {
  const filters = useVisualizationStore(state => state.filters);
  
  // Prepare query payload based on widget type
  const queryPayload = useMemo(() => {
    return {
      filters: filters.map(f => ({ column: f.column, operator: f.operator, value: f.value })),
      kpis_only: widget.type === 'kpi',
      chart_config: widget.type === 'chart' ? {
        type: widget.chartType,
        x_axis: widget.xAxis,
        y_axis: widget.yAxis,
        aggregation: widget.aggregation
      } : undefined
    };
  }, [filters, widget]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', datasetId, widget.id, queryPayload],
    queryFn: () => fetchDatasetAnalytics(datasetId, queryPayload),
    staleTime: 60 * 1000,
  });

  if (widget.type === 'kpi') {
    const kpiVal = data?.kpis?.[widget.kpiMetric || ''] || 0;
    return <KPIWidget title={widget.title} metric={widget.kpiMetric as any} value={kpiVal} isLoading={isLoading} />;
  }

  if (widget.type === 'chart') {
    if (data?.chart_error) {
      return (
        <div className="w-full h-full bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm flex items-center justify-center text-center">
          Chart Error: {data.chart_error}
        </div>
      );
    }
    return (
      <ChartWidget 
        title={widget.title} 
        type={widget.chartType as any} 
        data={data?.chart_data?.data || []} 
        xAxis={data?.chart_data?.x_axis || widget.xAxis}
        yAxis={data?.chart_data?.y_axis || widget.yAxis}
        isLoading={isLoading} 
      />
    );
  }

  return null;
};

export default function DashboardBuilder({ datasetId }: DashboardBuilderProps) {
  const { layouts, widgets, setLayouts } = useVisualizationStore();

  const handleLayoutChange = (layout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  return (
    <div className="w-full bg-slate-50 min-h-[600px] p-4 rounded-xl border border-slate-200">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        isResizable={true}
      >
        {widgets.map(w => (
          <div key={w.id} className="group relative">
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded cursor-move drag-handle p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
            </div>
            <WidgetWrapper widget={w} datasetId={datasetId} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
