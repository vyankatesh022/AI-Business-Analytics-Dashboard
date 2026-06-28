import { 
  InsightCardData, 
  BusinessHealthScore, 
  ExecutiveSummaryMetrics, 
  PredictionInsight, 
  AnomalyInsight, 
  ExecutiveBrief 
} from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockInsights: InsightCardData[] = [
  {
    id: 'insight-1',
    title: 'Revenue Opportunity',
    summary: 'Revenue can increase by 12% if churn drops by 3%.',
    type: 'revenue',
    impactScore: 92,
    confidenceScore: 88,
    generatedTime: new Date().toISOString(),
    sourceMetrics: ['MRR', 'Churn Rate'],
    recommendation: 'Launch targeted re-engagement campaign for enterprise users.',
    accountId: 'tenant-1'
  },
  {
    id: 'insight-2',
    title: 'Retention Decline',
    summary: 'Retention is declining in the Enterprise segment.',
    type: 'retention',
    severity: 'High',
    impactScore: 85,
    confidenceScore: 94,
    generatedTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    sourceMetrics: ['Enterprise Retention', 'Active Users'],
    recommendation: 'Schedule proactive check-ins with accounts > 1 year old.',
    accountId: 'tenant-1'
  },
  {
    id: 'insight-3',
    title: 'Marketing Funnel Drop-off',
    summary: 'Marketing funnel drop-off increased 18% in the last 7 days.',
    type: 'growth',
    severity: 'Medium',
    impactScore: 70,
    confidenceScore: 91,
    generatedTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    sourceMetrics: ['Signups', 'Onboarding Completion'],
    recommendation: 'A/B test the new onboarding flow vs previous version.',
    accountId: 'tenant-1'
  },
  {
    id: 'insight-4',
    title: 'CAC Increase',
    summary: 'Customer acquisition costs increased 22%.',
    type: 'operational',
    severity: 'High',
    impactScore: 88,
    confidenceScore: 95,
    generatedTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    sourceMetrics: ['Ad Spend', 'New Customers'],
    recommendation: 'Pause underperforming ad campaigns in the EU region.',
    accountId: 'tenant-1'
  },
  {
    id: 'insight-5',
    title: 'Upsell Potential',
    summary: '15 accounts show high probability for Enterprise upgrade.',
    type: 'revenue',
    impactScore: 75,
    confidenceScore: 82,
    generatedTime: new Date().toISOString(),
    sourceMetrics: ['Feature Usage', 'Seat Limit Reached'],
    recommendation: 'Trigger automated upsell emails with discount codes.',
    accountId: 'tenant-1'
  }
];

export const mockBusinessHealth: BusinessHealthScore = {
  overall: 82,
  categories: {
    revenue: 88,
    growth: 76,
    engagement: 85,
    retention: 71,
    operations: 90
  },
  trend: 'up',
  accountId: 'tenant-1'
};

export const mockExecutiveSummary: ExecutiveSummaryMetrics = {
  revenue: 1425000,
  growth: 12.4,
  retention: 94.2,
  churn: 2.1,
  risk: 15, // 0-100 (lower is better)
  accountId: 'tenant-1'
};

export const mockPredictions: PredictionInsight[] = [
  {
    id: 'pred-1',
    type: 'revenue',
    metric: 'Monthly Recurring Revenue (MRR)',
    currentValue: 1425000,
    forecastValue: 1580000,
    trend: 'up',
    confidenceInterval: [1520000, 1650000],
    explanation: 'Based on historical Q4 trends and current pipeline velocity, MRR is projected to increase by 10.8%.',
    accountId: 'tenant-1'
  },
  {
    id: 'pred-2',
    type: 'churn',
    metric: 'Logo Churn Rate',
    currentValue: 2.1,
    forecastValue: 1.8,
    trend: 'down',
    confidenceInterval: [1.5, 2.3],
    explanation: 'Recent feature releases have stabilized usage in at-risk accounts, leading to a projected decrease in churn.',
    accountId: 'tenant-1'
  },
  {
    id: 'pred-3',
    type: 'retention',
    metric: 'Net Revenue Retention (NRR)',
    currentValue: 114.5,
    forecastValue: 118.2,
    trend: 'up',
    confidenceInterval: [116.0, 121.5],
    explanation: 'High engagement in new workflows module indicates strong upsell potential for next quarter.',
    accountId: 'tenant-1'
  }
];

export const mockAnomalies: AnomalyInsight[] = [
  {
    id: 'anom-1',
    type: 'traffic',
    metric: 'API Gateway Requests',
    detectedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    expectedRange: [5000, 8000],
    actualValue: 14200,
    severity: 'High',
    explanation: 'Unusual spike in API requests detected from IP range associated with recent enterprise integration rollout.',
    accountId: 'tenant-1'
  },
  {
    id: 'anom-2',
    type: 'revenue',
    metric: 'Failed Transactions',
    detectedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expectedRange: [0, 5],
    actualValue: 24,
    severity: 'Critical',
    explanation: 'Payment gateway timeout cascade resulted in abnormally high transaction failure rate.',
    accountId: 'tenant-1'
  }
];

export const mockExecutiveBrief: ExecutiveBrief = {
  id: 'brief-1',
  type: 'daily',
  generatedAt: new Date().toISOString(),
  summary: 'Overall business health remains strong at 82/100. We are seeing positive momentum in revenue growth, though retention in the Enterprise segment requires immediate attention to meet end-of-quarter targets.',
  keyChanges: [
    'MRR increased by $12,500 (0.9%) since yesterday.',
    'New active users up 4% week-over-week.',
    'Customer Acquisition Cost (CAC) spiked by 22% in EU campaigns.'
  ],
  risks: [
    'Enterprise retention is declining (High Risk).',
    'Unusual spike in API Gateway requests may indicate integration issues.'
  ],
  opportunities: [
    '15 accounts are nearing seat limits and show high upsell probability.',
    'Reducing churn by 3% can increase overall revenue by 12%.'
  ],
  recommendations: [
    'Schedule proactive check-ins with Enterprise accounts over 1 year old.',
    'Pause underperforming ad campaigns in the EU region.',
    'Trigger automated upsell emails with discount codes.'
  ],
  accountId: 'tenant-1'
};

// --- Mock API Services ---

export const fetchInsights = async (accountId: string): Promise<InsightCardData[]> => {
  await delay(800);
  return mockInsights.filter(i => i.accountId === accountId);
};

export const fetchBusinessHealth = async (accountId: string): Promise<BusinessHealthScore> => {
  await delay(500);
  // Simulating tenant isolation check
  if (mockBusinessHealth.accountId === accountId) return mockBusinessHealth;
  throw new Error("Not found");
};

export const fetchExecutiveSummary = async (accountId: string): Promise<ExecutiveSummaryMetrics> => {
  await delay(400);
  if (mockExecutiveSummary.accountId === accountId) return mockExecutiveSummary;
  throw new Error("Not found");
};

export const fetchPredictions = async (accountId: string): Promise<PredictionInsight[]> => {
  await delay(1200);
  return mockPredictions.filter(i => i.accountId === accountId);
};

export const fetchAnomalies = async (accountId: string): Promise<AnomalyInsight[]> => {
  await delay(900);
  return mockAnomalies.filter(i => i.accountId === accountId);
};

export const fetchExecutiveBrief = async (accountId: string, type: 'daily'|'weekly'|'monthly' = 'daily'): Promise<ExecutiveBrief> => {
  await delay(1500);
  if (mockExecutiveBrief.accountId === accountId) return { ...mockExecutiveBrief, type };
  throw new Error("Not found");
};
