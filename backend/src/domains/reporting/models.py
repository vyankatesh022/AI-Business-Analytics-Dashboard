from enum import Enum
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

class ReportType(str, Enum):
    EXECUTIVE = "EXECUTIVE"
    REVENUE = "REVENUE"
    KPI = "KPI"
    RETENTION = "RETENTION"
    CHURN = "CHURN"
    FUNNEL = "FUNNEL"
    COHORT = "COHORT"
    PRODUCT = "PRODUCT"
    MARKETING = "MARKETING"
    SUBSCRIPTION = "SUBSCRIPTION"
    OPERATIONAL = "OPERATIONAL"
    CUSTOM = "CUSTOM"

class ReportStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class ExportFormat(str, Enum):
    CSV = "CSV"
    XLSX = "XLSX"
    PDF = "PDF"

class ExportStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class ScheduleType(str, Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    CUSTOM = "CUSTOM"

class ShareType(str, Enum):
    ORGANIZATION = "ORGANIZATION"
    TEAM = "TEAM"
    USER = "USER"
    ROLE = "ROLE"
    PUBLIC_LINK = "PUBLIC_LINK"

class ReportBlock(BaseModel):
    id: str
    type: str  # kpi_card, table, chart, text, etc.
    config: Dict[str, Any] = Field(default_factory=dict)
    layout: Dict[str, Any] = Field(default_factory=dict)

class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None
    report_type: ReportType = ReportType.CUSTOM
    blocks: List[ReportBlock] = Field(default_factory=list)

class ReportCreate(ReportBase):
    pass

class ReportUpdate(ReportBase):
    status: Optional[ReportStatus] = None

class ReportResponse(ReportBase):
    id: UUID
    account_id: UUID
    author_id: UUID
    status: ReportStatus
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReportVersion(BaseModel):
    id: UUID
    report_id: UUID
    account_id: UUID
    author_id: UUID
    version_num: int
    title: str
    description: Optional[str]
    blocks: List[ReportBlock]
    created_at: datetime

class ReportScheduleCreate(BaseModel):
    schedule_type: ScheduleType
    cron_expression: Optional[str] = None
    recipients: List[str] = Field(default_factory=list)
    delivery_methods: List[str] = Field(default_factory=list)

class ReportScheduleResponse(ReportScheduleCreate):
    id: UUID
    report_id: UUID
    account_id: UUID
    creator_id: UUID
    is_active: bool
    last_run_at: Optional[datetime] = None
    next_run_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class ReportExportCreate(BaseModel):
    format: ExportFormat

class ReportExportResponse(BaseModel):
    id: UUID
    report_id: UUID
    account_id: UUID
    requester_id: UUID
    format: ExportFormat
    status: ExportStatus
    s3_key: Optional[str] = None
    error_message: Optional[str] = None
    expires_at: Optional[datetime] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

class ReportShareCreate(BaseModel):
    share_type: ShareType
    target_id: Optional[UUID] = None
    permission_level: str = "VIEW"
    expires_at: Optional[datetime] = None

class ReportShareResponse(ReportShareCreate):
    id: UUID
    report_id: UUID
    account_id: UUID
    creator_id: UUID
    created_at: datetime
