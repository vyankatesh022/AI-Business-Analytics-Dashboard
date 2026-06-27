'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Model, DecisionIntelligence, PredictionExplanation, PredictionStats, RecentPrediction } from '../types';

interface PredictionsContextType {
  models: Model[];
  decisionIntelligence: DecisionIntelligence | null;
  stats: PredictionStats;
  recentPredictions: RecentPrediction[];
  loading: boolean;
  error: string | null;
  fetchPredictionExplanation: (predictionId: string) => Promise<PredictionExplanation | null>;
  fetchModels: () => Promise<void>;
  fetchDecisionIntelligence: () => Promise<void>;
  deployModel: (data: { name: string; model_type: string; problem_type: string }) => Promise<void>;
}

const mockStats: PredictionStats = {
  totalPredictions: 128,
  totalPredictionsTrend: '24% vs last 30 days',
  activeModels: 24,
  activeModelsTrend: '12% vs last 30 days',
  avgAccuracy: '92.4%',
  avgAccuracyTrend: '5.6% vs last 30 days',
  alerts: 7,
  alertsTrend: '2 vs last 30 days',
};

const mockRecentPredictions: RecentPrediction[] = [
  {
    id: '1',
    name: 'Revenue Forecast - USA',
    dataSource: 'revenue_data',
    model: 'Prophet',
    horizon: '6 Months',
    createdBy: 'John Doe',
    createdAt: '27/06/2026 10:30 AM',
    status: 'Completed',
  },
  {
    id: '2',
    name: 'Churn Prediction - All',
    dataSource: 'users_data',
    model: 'Churn Prediction v1',
    horizon: '3 Months',
    createdBy: 'Sarah Wilson',
    createdAt: '26/06/2026 04:15 PM',
    status: 'Completed',
  },
  {
    id: '3',
    name: 'LTV Prediction - Enterprise',
    dataSource: 'accounts_data',
    model: 'LTV Prediction v1',
    horizon: '12 Months',
    createdBy: 'John Doe',
    createdAt: '25/06/2026 11:05 AM',
    status: 'Completed',
  }
];

const PredictionsContext = createContext<PredictionsContextType | undefined>(undefined);

export const PredictionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [decisionIntelligence, setDecisionIntelligence] = useState<DecisionIntelligence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/ml/models');
      if (!res.ok) throw new Error('Failed to fetch models');
      const data = await res.json();
      setModels(data);
    } catch (err: any) {
      console.warn('Backend ML models endpoint missing, using mock data:', err.message);
      setModels([
        { id: 'm1', name: 'Revenue Forecast Model', model_type: 'REVENUE_FORECAST', problem_type: 'REGRESSION', created_at: new Date().toISOString() },
        { id: 'm2', name: 'Churn Predictor V2', model_type: 'CHURN_PREDICTION', problem_type: 'CLASSIFICATION', created_at: new Date().toISOString() },
        { id: 'm3', name: 'LTV Estimator', model_type: 'CUSTOMER_LTV', problem_type: 'REGRESSION', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDecisionIntelligence = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/ml/decision-intelligence');
      if (!res.ok) throw new Error('Failed to fetch decision intelligence');
      const data = await res.json();
      setDecisionIntelligence(data);
    } catch (err: any) {
      console.warn('Backend ML decision intelligence endpoint missing, using mock data:', err.message);
      setDecisionIntelligence({
        signals: [
          { signal_type: 'CHURN_WARNING', impact_level: 'HIGH', description: 'Enterprise customers in EU region showing 40% higher churn probability this week.', action_recommended: 'Trigger automated retention offers' },
          { signal_type: 'OPPORTUNITY', impact_level: 'MEDIUM', description: 'Demand for Premium Plan projected to spike in Q3 based on usage trends.', action_recommended: 'Increase Q3 marketing spend' },
          { signal_type: 'ANOMALY', impact_level: 'LOW', description: 'Unusual drop in active users observed on iOS platform.', action_recommended: 'Investigate iOS app performance logs' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictionExplanation = async (predictionId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/ml/explainability/${predictionId}`);
      if (!res.ok) throw new Error('Failed to fetch explanation');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend ML explainability endpoint missing, using mock data:', err.message);
      return {
        confidence_score: 0.92,
        business_explanation: 'Prediction is strongly driven by recent decreases in user login frequency.',
        key_drivers: [
          { feature_name: 'Login Frequency', importance_score: 0.45, impact_direction: 'NEGATIVE' },
          { feature_name: 'Support Tickets', importance_score: 0.25, impact_direction: 'NEGATIVE' },
        ]
      };
    }
  };

  const deployModel = async (data: { name: string; model_type: string; problem_type: string }) => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/ml/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          model_type: data.model_type,
          problem_type: data.problem_type,
        })
      });
      if (!res.ok) throw new Error('Failed to deploy model');
      await fetchModels(); // refresh models list
    } catch (err: any) {
      console.warn('Backend ML deploy endpoint missing, mocking deployment:', err.message);
      setModels(prev => [...prev, {
        id: `m${Date.now()}`,
        name: data.name,
        model_type: data.model_type,
        problem_type: data.problem_type,
        created_at: new Date().toISOString()
      }]);
    }
  };

  useEffect(() => {
    fetchModels();
    fetchDecisionIntelligence();
  }, []);

  return (
    <PredictionsContext.Provider
      value={{
        models,
        decisionIntelligence,
        stats: mockStats,
        recentPredictions: mockRecentPredictions,
        loading,
        error,
        fetchPredictionExplanation,
        fetchModels,
        fetchDecisionIntelligence,
        deployModel,
      }}
    >
      {children}
    </PredictionsContext.Provider>
  );
};

export const usePredictions = () => {
  const context = useContext(PredictionsContext);
  if (context === undefined) {
    throw new Error('usePredictions must be used within a PredictionsProvider');
  }
  return context;
};
