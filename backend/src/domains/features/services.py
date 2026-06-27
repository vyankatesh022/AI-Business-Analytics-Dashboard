from typing import Any, Dict, List, Optional
from uuid import UUID

from psycopg import AsyncConnection

from .models import FeatureCreate, FeatureGroupCreate
from .repositories import FeatureRepository


class FeatureEngineeringEngine:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn
        self.repository = FeatureRepository(conn)

    async def create_feature_group_with_features(
        self,
        tenant_id: UUID,
        organization_id: UUID,
        user_id: UUID,
        group_data: FeatureGroupCreate,
        features_data: List[FeatureCreate]
    ) -> Dict[str, Any]:
        """
        Creates a new feature group and its associated features.
        """
        group = await self.repository.create_feature_group(
            tenant_id=tenant_id,
            organization_id=organization_id,
            user_id=user_id,
            feature_group=group_data
        )

        group_id = group["id"]
        created_features = []

        for feature_data in features_data:
            feature = await self.repository.create_feature(
                tenant_id=tenant_id,
                organization_id=organization_id,
                group_id=group_id,
                feature=feature_data
            )
            created_features.append(feature)

        return {
            "group": group,
            "features": created_features
        }

    async def get_feature_group_details(self, tenant_id: UUID, group_id: UUID) -> Optional[Dict[str, Any]]:
        """
        Fetches a feature group and all its features.
        """
        group = await self.repository.get_feature_group(tenant_id, group_id)
        if not group:
            return None

        features = await self.repository.list_features_by_group(tenant_id, group_id)
        
        result = dict(group)
        result["features"] = features
        return result
