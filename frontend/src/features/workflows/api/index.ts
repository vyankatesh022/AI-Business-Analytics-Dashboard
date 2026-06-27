import { Workflow, WorkflowExecution } from '../types';

const API_BASE = '/api/v1/workflows';

// Helper for making API calls with standard error handling
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const workflowsApi = {
  getWorkflows: () => fetchApi<Workflow[]>(API_BASE),
  
  getWorkflow: (id: string) => fetchApi<Workflow>(`${API_BASE}/${id}`),
  
  createWorkflow: (data: Partial<Workflow>) => 
    fetchApi<Workflow>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  updateWorkflow: (id: string, data: Partial<Workflow>) =>
    fetchApi<Workflow>(`${API_BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  deleteWorkflow: (id: string) =>
    fetchApi<{ message: string }>(`${API_BASE}/${id}`, { method: 'DELETE' }),
    
  triggerWorkflow: (id: string, payload: any) =>
    fetchApi<WorkflowExecution>(`${API_BASE}/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  getExecutions: (workflowId: string) =>
    fetchApi<WorkflowExecution[]>(`${API_BASE}/${workflowId}/executions`),
};
