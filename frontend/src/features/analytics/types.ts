export interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardCard {
  id: string;
  dashboard_id: string;
  type: 'kpi' | 'chart' | 'cohort' | 'funnel';
  title: string;
  config: Record<string, any>;
  position: Position;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: Position[];
  cards?: DashboardCard[];
}

export interface KPI {
  id: string;
  name: string;
  description?: string;
  dataset_id: string;
  metric_type: string;
  metric_column?: string;
}

export interface KPIResult {
  value: number;
  previous_value?: number;
  trend?: number;
}

export interface Cohort {
  id: string;
  name: string;
  dataset_id: string;
  start_event: string;
  return_event: string;
  time_window: string;
}

export interface CohortResultCell {
  cohort_date: string;
  period: number;
  users: number;
  retention_rate: number;
}

export interface Funnel {
  id: string;
  name: string;
  dataset_id: string;
  steps: string[];
}

export interface FunnelResultStep {
  step_name: string;
  users: number;
  conversion_rate: number;
}
