import json
from typing import Any, Dict, List, Optional
from uuid import UUID

from psycopg import AsyncConnection
from psycopg.rows import dict_row

from .models import FeatureCreate, FeatureGroupCreate


class FeatureRepository:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn

    # ------------------------------------------------------------------------
    # Feature Groups
    # ------------------------------------------------------------------------
    async def create_feature_group(
        self, tenant_id: UUID, organization_id: UUID, user_id: UUID, feature_group: FeatureGroupCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO feature_groups (
                    tenant_id, organization_id, name, description, entity_type, storage_type, s3_uri, created_by
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    feature_group.name,
                    feature_group.description,
                    feature_group.entity_type,
                    feature_group.storage_type,
                    feature_group.s3_uri,
                    user_id,
                ),
            )
            return await cursor.fetchone()

    async def get_feature_group(self, tenant_id: UUID, group_id: UUID) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM feature_groups
                WHERE id = %s AND tenant_id = %s
                """,
                (group_id, tenant_id),
            )
            return await cursor.fetchone()

    async def list_feature_groups(
        self, tenant_id: UUID, organization_id: UUID, limit: int = 50, offset: int = 0
    ) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM feature_groups
                WHERE tenant_id = %s AND organization_id = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (tenant_id, organization_id, limit, offset),
            )
            return await cursor.fetchall()

    # ------------------------------------------------------------------------
    # Features
    # ------------------------------------------------------------------------
    async def create_feature(
        self, tenant_id: UUID, organization_id: UUID, group_id: UUID, feature: FeatureCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO features (
                    tenant_id, organization_id, feature_group_id, name, description,
                    data_type, feature_type, logic, is_active
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    group_id,
                    feature.name,
                    feature.description,
                    feature.data_type,
                    feature.feature_type,
                    json.dumps(feature.logic) if feature.logic else None,
                    feature.is_active,
                ),
            )
            return await cursor.fetchone()

    async def get_feature(self, tenant_id: UUID, feature_id: UUID) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM features
                WHERE id = %s AND tenant_id = %s
                """,
                (feature_id, tenant_id),
            )
            return await cursor.fetchone()

    async def list_features_by_group(self, tenant_id: UUID, group_id: UUID) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM features
                WHERE feature_group_id = %s AND tenant_id = %s
                ORDER BY name ASC
                """,
                (group_id, tenant_id),
            )
            return await cursor.fetchall()
