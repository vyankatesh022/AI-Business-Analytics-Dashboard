from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from src.domains.forecasting.models import ForecastRequest, ForecastResponse
from src.domains.forecasting.services import ForecastingService
from pydantic import BaseModel

class ExplainResponse(BaseModel):
    explanation: str

router = APIRouter(prefix="/forecasting", tags=["forecasting"])

@router.post("/generate", response_model=ForecastResponse, status_code=status.HTTP_200_OK)
async def generate_forecast(
    request: ForecastRequest,
):
    service = ForecastingService()
    try:
        result = service.generate_forecast(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate forecast")

@router.post("/explain", response_model=ExplainResponse, status_code=status.HTTP_200_OK)
async def explain_forecast(
    response_data: ForecastResponse,
):
    from src.domains.ai.insight_engine import InsightEngine
    engine = InsightEngine()
    try:
        details = [{"timestamp": pt.timestamp.isoformat(), "value": pt.value} for pt in response_data.predictions]
        explanation = await engine.explain_forecast(response_data.metric_name, response_data.algorithm_used, details)
        return ExplainResponse(explanation=explanation)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to generate explanation: {e}")
