from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from src.domains.forecasting.models import ForecastRequest, ForecastResponse
from src.domains.forecasting.services import ForecastingService

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
