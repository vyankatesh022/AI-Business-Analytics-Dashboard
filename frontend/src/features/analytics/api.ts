import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/lib/api-client';
import { 
  Dashboard, DashboardCard, KPI, KPIResult, 
  Cohort, CohortResultCell, Funnel, FunnelResultStep 
} from './types';

// Dashboards
export const useDashboards = () => {
  return useQuery({
    queryKey: ['dashboards'],
    queryFn: async () => {
      const data = await ApiClient.fetchWithAuth('/api/v1/analytics/dashboards');
      return data as Dashboard[];
    },
  });
};

export const useDashboard = (id: string) => {
  return useQuery({
    queryKey: ['dashboards', id],
    queryFn: async () => {
      const data = await ApiClient.fetchWithAuth(`/api/v1/analytics/dashboards/${id}`);
      return data as Dashboard;
    },
    enabled: !!id,
  });
};

export const useCreateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dashboard: Partial<Dashboard>) => {
      const data = await ApiClient.fetchWithAuth('/api/v1/analytics/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboard)
      });
      return data as Dashboard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
};

export const useUpdateDashboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dashboard }: Partial<Dashboard> & { id: string }) => {
      const data = await ApiClient.fetchWithAuth(`/api/v1/analytics/dashboards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboard)
      });
      return data as Dashboard;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboards', variables.id] });
    },
  });
};

// KPIs
export const useCalculateKPI = (kpiId: string) => {
  return useQuery({
    queryKey: ['kpi', kpiId, 'calculate'],
    queryFn: async () => {
      const data = await ApiClient.fetchWithAuth(`/api/v1/analytics/kpis/${kpiId}/calculate`);
      return data as KPIResult;
    },
    enabled: !!kpiId,
  });
};

// Cohorts
export const useCalculateCohort = (cohortId: string) => {
  return useQuery({
    queryKey: ['cohort', cohortId, 'calculate'],
    queryFn: async () => {
      const data = await ApiClient.fetchWithAuth(`/api/v1/analytics/cohorts/${cohortId}/calculate`);
      return data as CohortResultCell[];
    },
    enabled: !!cohortId,
  });
};

// Funnels
export const useCalculateFunnel = (funnelId: string) => {
  return useQuery({
    queryKey: ['funnel', funnelId, 'calculate'],
    queryFn: async () => {
      const data = await ApiClient.fetchWithAuth(`/api/v1/analytics/funnels/${funnelId}/calculate`);
      return data as FunnelResultStep[];
    },
    enabled: !!funnelId,
  });
};
