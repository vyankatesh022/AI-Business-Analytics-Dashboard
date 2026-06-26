from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ValidationRule(BaseModel):
    rule_type: str = Field(..., description="Type of validation rule, e.g., 'not_null', 'unique', 'regex'")
    column_name: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)


class CleaningRule(BaseModel):
    rule_type: str = Field(..., description="Type of cleaning rule, e.g., 'trim', 'fill_nulls', 'remove_duplicates'")
    column_name: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)


class NormalizationRule(BaseModel):
    rule_type: str = Field(..., description="Type of normalization, e.g., 'min_max', 'z_score'")
    column_name: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class ProcessingJobConfig(BaseModel):
    validation_rules: List[ValidationRule] = Field(default_factory=list)
    cleaning_rules: List[CleaningRule] = Field(default_factory=list)
    normalization_rules: List[NormalizationRule] = Field(default_factory=list)
    generate_profiling: bool = True
    generate_schema: bool = True
    generate_features: bool = False


class ProcessingJobCreate(BaseModel):
    dataset_id: UUID
    name: str
    type: str = Field(..., description="'VALIDATION', 'CLEANING', 'PROFILING', 'FEATURE_ENGINEERING'")
    config: ProcessingJobConfig


class ProcessingJobResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    dataset_id: UUID
    name: str
    type: str
    status: str
    config: ProcessingJobConfig
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProcessingJobStatusUpdate(BaseModel):
    status: str
    error_message: Optional[str] = None


class ProcessingTaskCreate(BaseModel):
    job_id: UUID
    task_name: str


class ProcessingTaskResponse(BaseModel):
    id: UUID
    job_id: UUID
    task_name: str
    status: str
    logs: Optional[Dict[str, Any]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProcessingTaskStatusUpdate(BaseModel):
    status: str
    logs: Optional[Dict[str, Any]] = None


class DataQualityReportCreate(BaseModel):
    dataset_id: UUID
    job_id: Optional[UUID] = None
    overall_score: float
    completeness_score: Optional[float] = None
    accuracy_score: Optional[float] = None
    consistency_score: Optional[float] = None
    validity_score: Optional[float] = None
    uniqueness_score: Optional[float] = None
    timeliness_score: Optional[float] = None
    profiling_data: Optional[Dict[str, Any]] = None
    recommendations: Optional[Dict[str, Any]] = None


class DataQualityReportResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    dataset_id: UUID
    job_id: Optional[UUID] = None
    overall_score: float
    completeness_score: Optional[float] = None
    accuracy_score: Optional[float] = None
    consistency_score: Optional[float] = None
    validity_score: Optional[float] = None
    uniqueness_score: Optional[float] = None
    timeliness_score: Optional[float] = None
    profiling_data: Optional[Dict[str, Any]] = None
    recommendations: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DatasetSchemaCreate(BaseModel):
    dataset_id: UUID
    version: int = 1
    schema_metadata: Dict[str, Any]


class DatasetSchemaResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    dataset_id: UUID
    version: int
    schema_metadata: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
