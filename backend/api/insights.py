from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List
from pydantic import BaseModel
from backend.auth.dependencies import get_current_user
from backend.ai.main_agent import main_agent
from backend.schemas.insights import (
    FullInsightReport,
    ExecutiveSummary,
    TrendInsight,
    AnomalyInsight,
    Recommendation,
    RiskAnalysis
)

insights_router = APIRouter()

class InsightRequest(BaseModel):
    dataset_context: Dict[str, Any]
    model: str = "gemini-1.5-pro"

def get_allowed_model(req: InsightRequest, current_user: dict) -> str:
    app_metadata = current_user.get("app_metadata", {})
    user_role = app_metadata.get("role", "Free")

    pro_models = ["gpt-4o", "gemini-1.5-pro"]
    if req.model in pro_models and user_role not in ["Pro", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"The {req.model} model requires a Pro or Admin subscription."
        )
    return req.model


@insights_router.post("/full-report", response_model=FullInsightReport)
async def get_full_report(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    """Generate a comprehensive AI report for the given dataset context."""
    model = get_allowed_model(req, current_user)
    return await main_agent.generate_full_report(req.dataset_context, model)

@insights_router.post("/executive-summary", response_model=ExecutiveSummary)
async def get_executive_summary(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    """Generate an executive summary."""
    model = get_allowed_model(req, current_user)
    return await main_agent.generate_executive_summary(req.dataset_context, model)

@insights_router.post("/trends", response_model=List[TrendInsight])
async def get_trends(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    """Generate trend analysis."""
    model = get_allowed_model(req, current_user)
    return await main_agent.generate_trends(req.dataset_context, model)

@insights_router.post("/anomalies", response_model=List[AnomalyInsight])
async def get_anomalies(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    """Generate anomaly detection report."""
    model = get_allowed_model(req, current_user)
    return await main_agent.generate_anomalies(req.dataset_context, model)

@insights_router.post("/recommendations", response_model=List[Recommendation])
async def get_recommendations(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    """Generate business recommendations."""
    model = get_allowed_model(req, current_user)
    return await main_agent.generate_recommendations(req.dataset_context, model)

@insights_router.post("/risks", response_model=List[RiskAnalysis])
async def get_risks(req: InsightRequest, current_user: dict = Depends(get_current_user)):
    """Generate risk analysis."""
    model = get_allowed_model(req, current_user)
    return await main_agent.generate_risks(req.dataset_context, model)
