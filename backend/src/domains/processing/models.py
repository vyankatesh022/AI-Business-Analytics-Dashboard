from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, validator


class ValidationRule(BaseModel):
    rule_type: str = Field(..., description="Type of validation rule, e.g., 'not_null', 'unique', 'regex', 'min_length', 'max_length'")
    column_name: Optional[str] = Field(None, description="Column to apply the rule on. If None, applies to dataset.")
    parameters: Dict[str, Any] = Field(default_factory=dict)


class CleaningRule(BaseModel):
    rule_type: str = Field(..., description="Type of cleaning rule, e.g., 'trim', 'fill_nulls', 'remove_duplicates', 'normalize_case'")
    column_name: Optional[str] = Field(None, description="Column to clean. If None, applies globally if supported.")
    parameters: Dict[str, Any] = Field(default_factory=dict)


class NormalizationRule(BaseModel):
    rule_type: str = Field(..., description="Type of normalization, e.g., 'min_max', 'z_score', 'log_transform', 'decimal_scaling'")
    column_name: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


class FeatureEngineeringRule(BaseModel):
    feature_name: str
    rule_type: str = Field(..., description="'aggregate', 'time_diff', 'categorical_encoding', etc.")
    source_columns: List[str]
    parameters: Dict[str, Any] = Field(default_factory=dict)


class ProcessingJobConfig(BaseModel):
    validation_rules: List[ValidationRule] = Field(default_factory=list)
    cleaning_rules: List[CleaningRule] = Field(default_factory=list)
    normalization_rules: List[NormalizationRule] = Field(default_factory=list)
    feature_rules: List[FeatureEngineeringRule] = Field(default_factory=list)
    generate_profiling: bool = True
    generate_schema: bool = True
    generate_features: bool = False


class ProcessingJobCreate(BaseModel):
    dataset_id: UUID
    name: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., description="'VALIDATION', 'CLEANING', 'PROFILING', 'FEATURE_ENGINEERING', 'PIPELINE'")
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


class ProcessingHistoryCreate(BaseModel):
    job_id: UUID
    dataset_id: UUID
    user_id: UUID
    action: str = Field(..., description="Action taken, e.g. 'VALIDATION_PASSED', 'CLEANING_APPLIED', 'FEATURES_GENERATED'")
    details: Dict[str, Any] = Field(default_factory=dict)


class ProcessingHistoryResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    job_id: UUID
    dataset_id: UUID
    user_id: UUID
    action: str
    details: Dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DataQualityReportCreate(BaseModel):
    dataset_id: UUID
    job_id: Optional[UUID] = None
    overall_score: float = Field(..., ge=0.0, le=100.0)
    completeness_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    accuracy_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    consistency_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    validity_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    uniqueness_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    timeliness_score: Optional[float] = Field(None, ge=0.0, le=100.0)
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
