from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class TimeSeriesPoint(BaseModel):
    timestamp: datetime
    value: float

class AnomalyRequest(BaseModel):
    metric_name: str = Field(..., max_length=255)
    data: List[TimeSeriesPoint]
    algorithm: Optional[str] = Field(default="auto", description="'zscore', 'isolation_forest', 'auto'")
    sensitivity: Optional[float] = Field(default=2.0, description="Multiplier for Z-score threshold or contamination factor for IF")

class AnomalyDataPoint(BaseModel):
    timestamp: datetime
    value: float
    is_anomaly: bool
    anomaly_score: Optional[float] = None
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None

class AnomalyResponse(BaseModel):
    metric_name: str
    algorithm_used: str
    total_anomalies: int
    data: List[AnomalyDataPoint]
    created_at: datetime
