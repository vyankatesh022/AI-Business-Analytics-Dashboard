import json
from typing import Any, Dict, List, Optional
from uuid import UUID

from psycopg import AsyncConnection
from psycopg.rows import dict_row

from .models import ModelCreate, ModelVersionCreate, SageMakerEndpointCreate


class MLRepository:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn

    # ------------------------------------------------------------------------
    # Models
    # ------------------------------------------------------------------------
    async def create_model(
        self, tenant_id: UUID, organization_id: UUID, user_id: UUID, model: ModelCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO models (
                    tenant_id, organization_id, name, description, model_type, problem_type, created_by
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    model.name,
                    model.description,
                    model.model_type,
                    model.problem_type,
                    user_id,
                ),
            )
            return await cursor.fetchone()

    async def list_models(
        self, tenant_id: UUID, organization_id: UUID, limit: int = 50, offset: int = 0
    ) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM models
                WHERE tenant_id = %s AND organization_id = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
                """,
                (tenant_id, organization_id, limit, offset),
            )
            return await cursor.fetchall()

    # ------------------------------------------------------------------------
    # Model Versions
    # ------------------------------------------------------------------------
    async def create_model_version(
        self, tenant_id: UUID, organization_id: UUID, version: ModelVersionCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO model_versions (
                    tenant_id, organization_id, model_id, version, training_job_name,
                    training_dataset_id, feature_group_id, hyperparameters
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    version.model_id,
                    version.version,
                    version.training_job_name,
                    version.training_dataset_id,
                    version.feature_group_id,
                    json.dumps(version.hyperparameters) if version.hyperparameters else None,
                ),
            )
            return await cursor.fetchone()

    async def update_model_version_status(
        self, tenant_id: UUID, version_id: UUID, status: str, metrics: Optional[Dict[str, Any]] = None, artifacts_uri: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            query = """
                UPDATE model_versions
                SET status = %s,
                    metrics = COALESCE(%s, metrics),
                    s3_model_artifacts_uri = COALESCE(%s, s3_model_artifacts_uri)
                WHERE id = %s AND tenant_id = %s
                RETURNING *
            """
            await cursor.execute(
                query, (status, json.dumps(metrics) if metrics else None, artifacts_uri, version_id, tenant_id)
            )
            return await cursor.fetchone()

    async def list_model_versions(self, tenant_id: UUID, model_id: UUID) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM model_versions
                WHERE model_id = %s AND tenant_id = %s
                ORDER BY created_at DESC
                """,
                (model_id, tenant_id),
            )
            return await cursor.fetchall()

    # ------------------------------------------------------------------------
    # SageMaker Endpoints
    # ------------------------------------------------------------------------
    async def create_endpoint(
        self, tenant_id: UUID, organization_id: UUID, endpoint: SageMakerEndpointCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO sagemaker_endpoints (
                    tenant_id, organization_id, model_version_id, endpoint_name, instance_type
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    endpoint.model_version_id,
                    endpoint.endpoint_name,
                    endpoint.instance_type,
                ),
            )
            return await cursor.fetchone()

    async def update_endpoint_status(
        self, tenant_id: UUID, endpoint_id: UUID, status: str
    ) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            deployed_at_clause = "deployed_at = NOW()," if status == "IN_SERVICE" else ""
            query = f"""
                UPDATE sagemaker_endpoints
                SET status = %s,
                    {deployed_at_clause}
                    updated_at = NOW()
                WHERE id = %s AND tenant_id = %s
                RETURNING *
            """
            await cursor.execute(query, (status, endpoint_id, tenant_id))
            return await cursor.fetchone()

    async def get_endpoint_by_name(self, tenant_id: UUID, endpoint_name: str) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM sagemaker_endpoints
                WHERE endpoint_name = %s AND tenant_id = %s
                """,
                (endpoint_name, tenant_id),
            )
            return await cursor.fetchone()
