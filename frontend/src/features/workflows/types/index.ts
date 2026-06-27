export type WorkflowNodeType = 'trigger' | 'condition' | 'action' | 'wait' | 'branch';

export interface WorkflowNodeData {
  label: string;
  config?: Record<string, any>;
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger_type?: string;
  is_active: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
  error?: string;
  started_at: string;
  completed_at?: string;
}
