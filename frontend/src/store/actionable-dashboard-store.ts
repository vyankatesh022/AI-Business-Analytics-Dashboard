import { create } from 'zustand';

export type TimeHorizon = 'realtime' | '24h' | '7d' | '30d' | 'qtd' | 'ytd';
export type RegionFilter = 'global' | 'nam' | 'emea' | 'apac' | 'latam';
export type ActionStatus = 'pending' | 'executing' | 'executed' | 'dismissed';

export interface ActionableItem {
  id: string;
  title: string;
  impact: string;
  category: 'Revenue' | 'Infrastructure' | 'Growth' | 'Security' | 'Retention';
  severity: 'urgent' | 'high' | 'medium' | 'low';
  reason: string;
  status: ActionStatus;
  timestamp: string;
  actionLabel: string;
  executionLogs?: string[];
}

export interface SimulationParams {
  discountCap: number; // 0 to 25 percentage
  marketingBudgetDelta: number; // -50 to 200 ($k)
  autoScaleNodes: number; // 2 to 16 nodes
}

interface ActionableDashboardState {
  timeHorizon: TimeHorizon;
  region: RegionFilter;
  simulationMode: boolean;
  simulationParams: SimulationParams;
  pendingActions: ActionableItem[];
  executedActions: ActionableItem[];
  
  // Actions
  setTimeHorizon: (horizon: TimeHorizon) => void;
  setRegion: (region: RegionFilter) => void;
  toggleSimulationMode: () => void;
  setSimulationParam: (key: keyof SimulationParams, value: number) => void;
  resetSimulation: () => void;
  executeAction: (id: string) => Promise<void>;
  dismissAction: (id: string) => void;
  revertAction: (id: string) => void;
}

const initialActions: ActionableItem[] = [
  {
    id: 'act-1',
    title: 'Auto-Rebalance Server Clusters in Tokyo Region',
    impact: '+$14,200 Monthly Margin • 3.4x ROI',
    category: 'Infrastructure',
    severity: 'high',
    reason: 'Detected 28% idle compute capacity during APAC off-peak hours while EU traffic spikes.',
    status: 'pending',
    timestamp: '12 mins ago',
    actionLabel: 'Rebalance Clusters ⚡',
  },
  {
    id: 'act-2',
    title: 'Approve 12% Renewal Discount for Stripe Enterprise',
    impact: 'Prevents 85% Churn Risk ($180,000 ARR)',
    category: 'Retention',
    severity: 'urgent',
    reason: 'AI detected sentiment drop in support tickets + rate limit friction in billing APIs.',
    status: 'pending',
    timestamp: '28 mins ago',
    actionLabel: 'Deploy Discount Package 🛡️',
  },
  {
    id: 'act-3',
    title: 'Reallocate $25k Budget from Broad Display to B2B LinkedIn',
    impact: '+42 Enterprise MQLs Projected This Month',
    category: 'Growth',
    severity: 'medium',
    reason: 'B2B LinkedIn CAC dropped by 18% over the past 7 days with higher conversion velocity.',
    status: 'pending',
    timestamp: '1 hour ago',
    actionLabel: 'Reallocate Budget 📈',
  },
  {
    id: 'act-4',
    title: 'Enable Automated Anomaly Rerouting for Payment Gateway',
    impact: 'Reduces Checkout Latency by 180ms',
    category: 'Security',
    severity: 'high',
    reason: 'Stripe NA-East endpoint experiencing intermittent 420ms latency spikes.',
    status: 'pending',
    timestamp: '2 hours ago',
    actionLabel: 'Activate Backup Gateway 🔄',
  }
];

export const useActionableDashboardStore = create<ActionableDashboardState>((set, get) => ({
  timeHorizon: '30d',
  region: 'global',
  simulationMode: false,
  simulationParams: {
    discountCap: 10,
    marketingBudgetDelta: 25,
    autoScaleNodes: 8,
  },
  pendingActions: initialActions,
  executedActions: [
    {
      id: 'exec-1',
      title: 'Auto-Scaled Database Read Replicas (US-West)',
      impact: 'Prevented Database Overload during Product Launch',
      category: 'Infrastructure',
      severity: 'high',
      reason: 'Query throughput exceeded 12,000 QPS threshold.',
      status: 'executed',
      timestamp: '3 hours ago',
      actionLabel: 'Executed Automatically',
      executionLogs: [
        '11:42 AM - Threshold breached (12,410 QPS detected)',
        '11:42 AM - Dispatched AWS RDS auto-scale API command',
        '11:43 AM - 2 read replicas initialized and verified active'
      ]
    },
    {
      id: 'exec-2',
      title: 'Dispatched Personalized Churn Intervention to 4 Cohorts',
      impact: '+$64,000 ARR Saved in Q3',
      category: 'Retention',
      severity: 'urgent',
      reason: 'Usage engagement dropped >15% over 14 consecutive days.',
      status: 'executed',
      timestamp: 'Yesterday',
      actionLabel: 'Executed via Email AI',
      executionLogs: [
        '09:15 AM - Cohort analysis flagged 4 enterprise accounts',
        '09:16 AM - Generated custom executive usage breakdown reports',
        '09:17 AM - Customer Success manager notified & discount pre-approved'
      ]
    }
  ],

  setTimeHorizon: (horizon) => set({ timeHorizon: horizon }),
  setRegion: (region) => set({ region }),
  toggleSimulationMode: () => set((state) => ({ simulationMode: !state.simulationMode })),
  
  setSimulationParam: (key, value) => set((state) => ({
    simulationParams: {
      ...state.simulationParams,
      [key]: value
    }
  })),

  resetSimulation: () => set({
    simulationParams: {
      discountCap: 10,
      marketingBudgetDelta: 25,
      autoScaleNodes: 8,
    }
  }),

  executeAction: async (id) => {
    // Set to executing
    set((state) => ({
      pendingActions: state.pendingActions.map((item) =>
        item.id === id ? { ...item, status: 'executing' } : item
      )
    }));

    // Simulate real-time API execution latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Move from pending to executed
    const state = get();
    const action = state.pendingActions.find((a) => a.id === id);
    if (!action) return;

    const executedItem: ActionableItem = {
      ...action,
      status: 'executed',
      timestamp: 'Just now',
      executionLogs: [
        `[${new Date().toLocaleTimeString()}] - AI agent validated credentials & security rules`,
        `[${new Date().toLocaleTimeString()}] - API payload dispatched to enterprise integration hub`,
        `[${new Date().toLocaleTimeString()}] - Execution verified with status 200 OK ⚡`
      ]
    };

    set((state) => ({
      pendingActions: state.pendingActions.filter((item) => item.id !== id),
      executedActions: [executedItem, ...state.executedActions]
    }));
  },

  dismissAction: (id) => set((state) => ({
    pendingActions: state.pendingActions.filter((item) => item.id !== id)
  })),

  revertAction: (id) => {
    const state = get();
    const action = state.executedActions.find((a) => a.id === id);
    if (!action) return;

    const revertedItem: ActionableItem = {
      ...action,
      status: 'pending',
      timestamp: 'Reverted just now',
      actionLabel: action.actionLabel || 'Re-execute Action ⚡'
    };

    set((state) => ({
      executedActions: state.executedActions.filter((item) => item.id !== id),
      pendingActions: [revertedItem, ...state.pendingActions]
    }));
  }
}));
