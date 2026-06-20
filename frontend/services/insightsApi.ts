export interface Recommendation {
  category: string;
  description: string;
  impact: string;
  effort: string;
}

export interface AnomalyInsight {
  metric: string;
  description: string;
  severity: string;
}

export interface TrendInsight {
  name: string;
  direction: string;
  details: string;
}

export interface RiskAnalysis {
  risk_type: string;
  description: string;
  mitigation_strategy: string;
  risk_level: string;
}

export interface ExecutiveSummary {
  overview: string;
  key_metrics_snapshot: Record<string, string>;
}

export interface FullInsightReport {
  executive_summary: ExecutiveSummary;
  trends: TrendInsight[];
  anomalies: AnomalyInsight[];
  recommendations: Recommendation[];
  risks: RiskAnalysis[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const generateFullInsightsReport = async (datasetContext: any, model: string = "gemini-1.5-pro"): Promise<FullInsightReport> => {
  const res = await fetch(`${API_BASE_URL}/insights/full-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataset_context: datasetContext,
      model,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to generate AI insights');
  }

  return res.json();
};
