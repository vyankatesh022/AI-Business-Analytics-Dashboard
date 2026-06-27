from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

class DashboardCardBase(BaseModel):
    type: str = Field(..., description="'kpi', 'chart', 'cohort', 'funnel'")
    title: str
    config: Dict[str, Any]
    position: Dict[str, int] = Field(..., description="x, y, w, h for grid layout")

class DashboardCardCreate(DashboardCardBase):
    pass

class DashboardCardResponse(DashboardCardBase):
    id: UUID
    dashboard_id: UUID
    account_id: UUID
    created_at: datetime
    updated_at: datetime

class DashboardBase(BaseModel):
    name: str
    description: Optional[str] = None
    layout: List[Dict[str, Any]] = Field(default_factory=list)

class DashboardCreate(DashboardBase):
    cards: Optional[List[DashboardCardCreate]] = None

class DashboardResponse(DashboardBase):
    id: UUID
    account_id: UUID
    created_at: datetime
    updated_at: datetime
    cards: Optional[List[DashboardCardResponse]] = None

class KPIBase(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_id: UUID
    metric_type: str = Field(..., description="'count', 'sum', 'average', 'distinct_count'")
    metric_column: Optional[str] = None
    filters: List[Dict[str, Any]] = Field(default_factory=list)

class KPICreate(KPIBase):
    pass

class KPIResponse(KPIBase):
    id: UUID
    account_id: UUID
    created_at: datetime
    updated_at: datetime

class CohortBase(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_id: UUID
    start_event: str
    return_event: str
    time_window: str = Field(..., description="PostgreSQL INTERVAL format string, e.g., '30 days'")

class CohortCreate(CohortBase):
    pass

class CohortResponse(CohortBase):
    id: UUID
    account_id: UUID
    created_at: datetime
    updated_at: datetime

class FunnelBase(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_id: UUID
    steps: List[str]
    conversion_window: str = Field(..., description="PostgreSQL INTERVAL format string, e.g., '7 days'")

class FunnelCreate(FunnelBase):
    pass

class FunnelResponse(FunnelBase):
    id: UUID
    account_id: UUID
    created_at: datetime
    updated_at: datetime

class SegmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    dataset_id: UUID
    rules: Dict[str, Any]

class SegmentCreate(SegmentBase):
    pass

class SegmentResponse(SegmentBase):
    id: UUID
    account_id: UUID
    created_at: datetime
    updated_at: datetime

# Analytical Result Models
class KPIResult(BaseModel):
    value: float
    previous_value: Optional[float] = None
    trend: Optional[float] = None # Percentage change

class CohortResultCell(BaseModel):
    cohort_date: str
    period: int
    users: int
    retention_rate: float

class FunnelResultStep(BaseModel):
    step_name: str
    users: int
    conversion_rate: float

class SegmentResult(BaseModel):
    segment_size: int
    percentage_of_total: float

class RevenueTrendDataPoint(BaseModel):
    date: str
    revenue: float
    mrr: Optional[float] = None
    arr: Optional[float] = None

class RevenueTrendResult(BaseModel):
    current_mrr: float
    mrr_growth_rate: float
    data: List[RevenueTrendDataPoint]

class RetentionCurveDataPoint(BaseModel):
    day: int
    retention_rate: float

class RetentionCurveResult(BaseModel):
    overall_retention_rate: float
    curve: List[RetentionCurveDataPoint]

class ColumnMetadata(BaseModel):
    name: str
    type: str
    missing_count: int
    unique_count: int
    mean: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None

class FileAnalysisResult(BaseModel):
    filename: str
    row_count: int
    column_count: int
    columns: List[ColumnMetadata]
    preview: List[Dict[str, Any]]
