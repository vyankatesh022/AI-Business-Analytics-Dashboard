import { create } from 'zustand';
import { Layout } from 'react-grid-layout';

export interface DashboardFilter {
  id: string;
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
  value: any;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'histogram';
export type WidgetType = 'kpi' | 'chart';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  // Chart-specific
  chartType?: ChartType;
  xAxis?: string;
  yAxis?: string | string[];
  aggregation?: 'sum' | 'mean' | 'count';
  // KPI-specific
  kpiMetric?: 'total_records' | 'total_revenue' | 'average_sales';
}

interface VisualizationState {
  filters: DashboardFilter[];
  layouts: { [P: string]: Layout[] };
  widgets: WidgetConfig[];
  
  // Actions
  setFilters: (filters: DashboardFilter[]) => void;
  addFilter: (filter: DashboardFilter) => void;
  removeFilter: (id: string) => void;
  
  setLayouts: (layouts: { [P: string]: Layout[] }) => void;
  
  addWidget: (widget: WidgetConfig, layout: Layout) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, config: Partial<WidgetConfig>) => void;
  
  resetDashboard: () => void;
}

const defaultLayouts = {
  lg: [
    { i: 'kpi-records', x: 0, y: 0, w: 3, h: 2 },
    { i: 'kpi-revenue', x: 3, y: 0, w: 3, h: 2 },
    { i: 'kpi-sales', x: 6, y: 0, w: 3, h: 2 },
    { i: 'chart-distribution', x: 0, y: 2, w: 6, h: 6 },
  ]
};

const defaultWidgets: WidgetConfig[] = [
  { id: 'kpi-records', type: 'kpi', title: 'Total Records', kpiMetric: 'total_records' },
  { id: 'kpi-revenue', type: 'kpi', title: 'Total Revenue', kpiMetric: 'total_revenue' },
  { id: 'kpi-sales', type: 'kpi', title: 'Avg Sales', kpiMetric: 'average_sales' },
  { id: 'chart-distribution', type: 'chart', title: 'Distribution', chartType: 'bar', xAxis: 'category', aggregation: 'count' }
];

export const useVisualizationStore = create<VisualizationState>((set) => ({
  filters: [],
  layouts: defaultLayouts,
  widgets: defaultWidgets,
  
  setFilters: (filters) => set({ filters }),
  addFilter: (filter) => set((state) => ({ filters: [...state.filters, filter] })),
  removeFilter: (id) => set((state) => ({ filters: state.filters.filter(f => f.id !== id) })),
  
  setLayouts: (layouts) => set({ layouts }),
  
  addWidget: (widget, layout) => set((state) => {
    // Add to lg layout by default
    const newLgLayout = [...(state.layouts.lg || []), layout];
    return {
      widgets: [...state.widgets, widget],
      layouts: { ...state.layouts, lg: newLgLayout }
    };
  }),
  
  removeWidget: (id) => set((state) => ({
    widgets: state.widgets.filter(w => w.id !== id),
    layouts: Object.keys(state.layouts).reduce((acc, bp) => {
      acc[bp] = state.layouts[bp].filter(l => l.i !== id);
      return acc;
    }, {} as { [P: string]: Layout[] })
  })),
  
  updateWidget: (id, config) => set((state) => ({
    widgets: state.widgets.map(w => w.id === id ? { ...w, ...config } : w)
  })),
  
  resetDashboard: () => set({ layouts: defaultLayouts, widgets: defaultWidgets, filters: [] })
}));
