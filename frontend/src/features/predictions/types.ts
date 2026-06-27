export interface PredictionExplanation {
  prediction_id: string;
  confidence_score: number;
  business_explanation: string;
  key_drivers: {
    feature_name: string;
    importance_score: number;
    impact_direction: 'POSITIVE' | 'NEGATIVE';
  }[];
}

export interface DecisionSignal {
  signal_type: 'RISK' | 'OPPORTUNITY' | 'GROWTH' | 'CHURN_WARNING';
  description: string;
  action_recommended: string;
  impact_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface DecisionIntelligence {
  tenant_id: string;
  analysis_date: string;
  signals: DecisionSignal[];
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  model_type: 'CHURN_PREDICTION' | 'REVENUE_FORECAST' | 'ANOMALY_DETECTION' | 'CUSTOMER_LTV' | string;
  problem_type: 'CLASSIFICATION' | 'REGRESSION' | 'CLUSTERING' | string;
  created_at: string;
  status?: string;
}

export interface PredictionStats {
  totalPredictions: number;
  totalPredictionsTrend: string;
  activeModels: number;
  activeModelsTrend: string;
  avgAccuracy: string;
  avgAccuracyTrend: string;
  alerts: number;
  alertsTrend: string;
}

export interface RecentPrediction {
  id: string;
  name: string;
  dataSource: string;
  model: string;
  horizon: string;
  createdBy: string;
  createdAt: string;
  status: 'Completed' | 'Failed' | 'In Progress';
}
