from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import AsyncConnection

from src.database.connection import get_db
from src.domains.features.models import (
    FeatureGroupCreate,
    FeatureGroupResponse,
    FeatureGroupWithFeaturesResponse,
)
from src.domains.features.repositories import FeatureRepository
from src.domains.features.services import FeatureEngineeringEngine
from src.security.rbac import Role, require_role

router = APIRouter(prefix="/features", tags=["features"])


@router.post("/groups", response_model=FeatureGroupResponse, status_code=status.HTTP_201_CREATED)
async def create_feature_group(
    request: FeatureGroupCreate,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
    organization_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
    user_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = FeatureRepository(db)
    group = await repo.create_feature_group(
        tenant_id=tenant_id,
        organization_id=organization_id,
        user_id=user_id,
        feature_group=request,
    )
    return group


@router.get("/groups", response_model=List[FeatureGroupResponse])
async def list_feature_groups(
    limit: int = 50,
    offset: int = 0,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
    organization_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = FeatureRepository(db)
    groups = await repo.list_feature_groups(
        tenant_id=tenant_id, organization_id=organization_id, limit=limit, offset=offset
    )
    return groups


@router.get("/groups/{group_id}", response_model=FeatureGroupWithFeaturesResponse)
async def get_feature_group_details(
    group_id: UUID,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    engine = FeatureEngineeringEngine(db)
    group_details = await engine.get_feature_group_details(tenant_id=tenant_id, group_id=group_id)
    if not group_details:
        raise HTTPException(status_code=404, detail="Feature group not found")
    return group_details
