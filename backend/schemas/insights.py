from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class Recommendation(BaseModel):
    category: str = Field(description="Category of the recommendation, e.g., Pricing, Inventory, Marketing.")
    description: str = Field(description="Detailed explanation of the recommendation.")
    impact: str = Field(description="Expected business impact if implemented.")
    effort: str = Field(description="Level of effort required (Low, Medium, High).")

class AnomalyInsight(BaseModel):
    metric: str = Field(description="The metric that experienced the anomaly.")
    description: str = Field(description="What the anomaly is and why it happened.")
    severity: str = Field(description="Severity of the anomaly (Low, Medium, High).")

class TrendInsight(BaseModel):
    name: str = Field(description="Name of the trend, e.g., 'Revenue Spiking in Q3'")
    direction: str = Field(description="Direction of the trend (Up, Down, Flat).")
    details: str = Field(description="Detailed explanation of the trend.")

class RiskAnalysis(BaseModel):
    risk_type: str = Field(description="Type of risk, e.g., 'Churn', 'Revenue Decline', 'Dependency'.")
    description: str = Field(description="Explanation of the risk detected.")
    mitigation_strategy: str = Field(description="Recommended steps to mitigate this risk.")
    risk_level: str = Field(description="Level of risk (Low, Medium, High).")

class ExecutiveSummary(BaseModel):
    overview: str = Field(description="High-level summary of the dataset and business performance.")
    key_metrics_snapshot: Dict[str, str] = Field(description="A dictionary of 3-5 key metrics with their values.")

class FullInsightReport(BaseModel):
    executive_summary: ExecutiveSummary
    trends: List[TrendInsight]
    anomalies: List[AnomalyInsight]
    recommendations: List[Recommendation]
    risks: List[RiskAnalysis]
