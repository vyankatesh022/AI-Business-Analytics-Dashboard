from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FeatureCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    data_type: str = Field(..., description="'INTEGER', 'FLOAT', 'STRING', 'BOOLEAN', 'DATETIME'")
    feature_type: str = Field(..., description="'CATEGORICAL', 'NUMERICAL', 'TIME_SERIES'")
    logic: Optional[Dict[str, Any]] = None
    is_active: bool = True


class FeatureResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    feature_group_id: UUID
    name: str
    description: Optional[str] = None
    data_type: str
    feature_type: str
    logic: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeatureGroupCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    entity_type: str = Field(..., description="'USER', 'PRODUCT', 'DATASET', 'SESSION', 'COHORT'")
    storage_type: str = Field(default="OFFLINE", description="'OFFLINE', 'ONLINE', 'BOTH'")
    s3_uri: Optional[str] = None


class FeatureGroupResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    name: str
    description: Optional[str] = None
    entity_type: str
    storage_type: str
    s3_uri: Optional[str] = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeatureGroupWithFeaturesResponse(FeatureGroupResponse):
    features: List[FeatureResponse]
