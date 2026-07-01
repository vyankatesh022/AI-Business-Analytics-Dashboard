from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from src.domains.anomaly.models import AnomalyRequest, AnomalyResponse
from src.domains.anomaly.services import AnomalyService
from pydantic import BaseModel

class ExplainResponse(BaseModel):
    explanation: str

router = APIRouter(prefix="/anomaly", tags=["anomaly_detection"])

@router.post("/detect", response_model=AnomalyResponse, status_code=status.HTTP_200_OK)
async def detect_anomalies(
    request: AnomalyRequest,
):
    service = AnomalyService()
    try:
        result = service.detect_anomalies(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to detect anomalies")

@router.post("/explain", response_model=ExplainResponse, status_code=status.HTTP_200_OK)
async def explain_anomalies(
    response_data: AnomalyResponse,
):
    from src.domains.ai.insight_engine import InsightEngine
    engine = InsightEngine()
    try:
        details = [{"timestamp": pt.timestamp.isoformat(), "value": pt.value, "score": pt.anomaly_score} for pt in response_data.data if pt.is_anomaly]
        explanation = await engine.explain_anomaly(response_data.metric_name, response_data.total_anomalies, details)
        return ExplainResponse(explanation=explanation)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to generate explanation: {e}")
