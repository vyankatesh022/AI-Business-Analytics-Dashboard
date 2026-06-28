export type InsightType = 'revenue' | 'growth' | 'retention' | 'churn' | 'operational' | 'risk' | 'anomaly';
export type InsightSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type InsightImpact = 'Low' | 'Medium' | 'High';

export interface InsightCardData {
  id: string;
  title: string;
  summary: string;
  type: InsightType;
  severity?: InsightSeverity;
  impactScore: number; // 0-100
  confidenceScore: number; // 0-100
  generatedTime: string;
  sourceMetrics: string[];
  recommendation?: string;
  accountId: string;
  isSaved?: boolean;
}

export interface BusinessHealthScore {
  overall: number; // 0-100
  categories: {
    revenue: number;
    growth: number;
    engagement: number;
    retention: number;
    operations: number;
  };
  trend: 'up' | 'down' | 'stable';
  accountId: string;
}

export interface ExecutiveSummaryMetrics {
  revenue: number;
  growth: number;
  retention: number;
  churn: number;
  risk: number; // 0-100
  accountId: string;
}

export interface PredictionInsight {
  id: string;
  type: InsightType;
  metric: string;
  currentValue: number;
  forecastValue: number;
  trend: 'up' | 'down' | 'stable';
  confidenceInterval: [number, number];
  explanation: string;
  accountId: string;
}

export interface AnomalyInsight {
  id: string;
  type: InsightType;
  metric: string;
  detectedAt: string;
  expectedRange: [number, number];
  actualValue: number;
  severity: InsightSeverity;
  explanation: string;
  accountId: string;
}

export interface ExecutiveBrief {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  generatedAt: string;
  summary: string;
  keyChanges: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  accountId: string;
}
