from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class TimeSeriesPoint(BaseModel):
    timestamp: datetime
    value: float

class ForecastRequest(BaseModel):
    metric_name: str = Field(..., max_length=255)
    historical_data: List[TimeSeriesPoint]
    forecast_periods: int = Field(default=30, ge=1, le=365)
    algorithm: Optional[str] = Field(default="auto", description="e.g. 'arima', 'exponential_smoothing', 'auto'")

class ForecastDataPoint(BaseModel):
    timestamp: datetime
    predicted_value: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None

class ForecastResponse(BaseModel):
    metric_name: str
    algorithm_used: str
    forecast_data: List[ForecastDataPoint]
    created_at: datetime
