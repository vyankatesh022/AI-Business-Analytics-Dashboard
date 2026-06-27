from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ModelCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    model_type: str = Field(..., description="'CHURN_PREDICTION', 'REVENUE_FORECAST', 'ANOMALY_DETECTION'")
    problem_type: str = Field(..., description="'CLASSIFICATION', 'REGRESSION', 'CLUSTERING'")


class ModelResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    name: str
    description: Optional[str] = None
    model_type: str
    problem_type: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ModelVersionCreate(BaseModel):
    model_id: UUID
    version: str = Field(..., max_length=50)
    training_job_name: Optional[str] = None
    training_dataset_id: Optional[UUID] = None
    feature_group_id: Optional[UUID] = None
    hyperparameters: Optional[Dict[str, Any]] = None


class ModelVersionResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    model_id: UUID
    version: str
    training_job_name: Optional[str] = None
    training_dataset_id: Optional[UUID] = None
    feature_group_id: Optional[UUID] = None
    metrics: Optional[Dict[str, Any]] = None
    status: str
    s3_model_artifacts_uri: Optional[str] = None
    hyperparameters: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SageMakerEndpointCreate(BaseModel):
    model_version_id: UUID
    endpoint_name: str = Field(..., max_length=255)
    instance_type: str = Field(..., max_length=50)


class SageMakerEndpointResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    model_version_id: UUID
    endpoint_name: str
    status: str
    instance_type: str
    deployed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PredictionRequest(BaseModel):
    endpoint_name: str
    payload: Dict[str, Any]


class PredictionResponse(BaseModel):
    endpoint_name: str
    predictions: Any
    latency_ms: float
