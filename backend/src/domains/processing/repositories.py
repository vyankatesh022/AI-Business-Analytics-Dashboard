import json
from typing import Any, Dict, List, Optional
from uuid import UUID

from psycopg import AsyncConnection
from psycopg.rows import dict_row

from .models import (
    DataQualityReportCreate,
    DatasetSchemaCreate,
    ProcessingJobCreate,
    ProcessingJobStatusUpdate,
    ProcessingTaskCreate,
    ProcessingTaskStatusUpdate,
    ProcessingHistoryCreate,
)


class ProcessingRepository:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn

    # ------------------------------------------------------------------------
    # Dataset Schemas
    # ------------------------------------------------------------------------
    async def create_dataset_schema(
        self, tenant_id: UUID, organization_id: UUID, schema: DatasetSchemaCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO dataset_schemas (
                    tenant_id, organization_id, dataset_id, version, schema_metadata
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    schema.dataset_id,
                    schema.version,
                    json.dumps(schema.schema_metadata),
                ),
            )
            return await cursor.fetchone()

    async def get_dataset_schema(
        self, tenant_id: UUID, dataset_id: UUID, version: Optional[int] = None
    ) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            if version:
                await cursor.execute(
                    """
                    SELECT * FROM dataset_schemas
                    WHERE tenant_id = %s AND dataset_id = %s AND version = %s
                    """,
                    (tenant_id, dataset_id, version),
                )
            else:
                await cursor.execute(
                    """
                    SELECT * FROM dataset_schemas
                    WHERE tenant_id = %s AND dataset_id = %s
                    ORDER BY version DESC
                    LIMIT 1
                    """,
                    (tenant_id, dataset_id),
                )
            return await cursor.fetchone()

    # ------------------------------------------------------------------------
    # Data Quality Reports
    # ------------------------------------------------------------------------
    async def create_data_quality_report(
        self, tenant_id: UUID, organization_id: UUID, report: DataQualityReportCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO data_quality_reports (
                    tenant_id, organization_id, dataset_id, job_id, overall_score,
                    completeness_score, accuracy_score, consistency_score,
                    validity_score, uniqueness_score, timeliness_score,
                    profiling_data, recommendations
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    report.dataset_id,
                    report.job_id,
                    report.overall_score,
                    report.completeness_score,
                    report.accuracy_score,
                    report.consistency_score,
                    report.validity_score,
                    report.uniqueness_score,
                    report.timeliness_score,
                    json.dumps(report.profiling_data) if report.profiling_data else None,
                    json.dumps(report.recommendations) if report.recommendations else None,
                ),
            )
            return await cursor.fetchone()

    async def get_latest_data_quality_report(
        self, tenant_id: UUID, dataset_id: UUID
    ) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM data_quality_reports
                WHERE tenant_id = %s AND dataset_id = %s
                ORDER BY created_at DESC
                LIMIT 1
                """,
                (tenant_id, dataset_id),
            )
            return await cursor.fetchone()

    # ------------------------------------------------------------------------
    # Processing Jobs
    # ------------------------------------------------------------------------
    async def create_processing_job(
        self, tenant_id: UUID, organization_id: UUID, user_id: UUID, job: ProcessingJobCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO processing_jobs (
                    tenant_id, organization_id, dataset_id, name, type, config, created_by
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    job.dataset_id,
                    job.name,
                    job.type,
                    job.config.model_dump_json(),
                    user_id,
                ),
            )
            return await cursor.fetchone()

    async def update_processing_job_status(
        self, tenant_id: UUID, job_id: UUID, update: ProcessingJobStatusUpdate
    ) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            started_at_clause = "started_at = NOW()," if update.status == "RUNNING" else ""
            completed_at_clause = "completed_at = NOW()," if update.status in ["COMPLETED", "FAILED", "CANCELLED"] else ""
            
            query = f"""
                UPDATE processing_jobs
                SET status = %s,
                    error_message = %s,
                    {started_at_clause}
                    {completed_at_clause}
                    updated_at = NOW()
                WHERE id = %s AND tenant_id = %s
                RETURNING *
            """
            await cursor.execute(query, (update.status, update.error_message, job_id, tenant_id))
            return await cursor.fetchone()

    async def get_processing_job(self, tenant_id: UUID, job_id: UUID) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM processing_jobs
                WHERE id = %s AND tenant_id = %s
                """,
                (job_id, tenant_id),
            )
            return await cursor.fetchone()

    async def list_processing_jobs(
        self, tenant_id: UUID, organization_id: UUID, dataset_id: Optional[UUID] = None, limit: int = 50, offset: int = 0
    ) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            query = "SELECT * FROM processing_jobs WHERE tenant_id = %s AND organization_id = %s"
            params = [tenant_id, organization_id]
            if dataset_id:
                query += " AND dataset_id = %s"
                params.append(dataset_id)
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            await cursor.execute(query, tuple(params))
            return await cursor.fetchall()

    # ------------------------------------------------------------------------
    # Processing Tasks
    # ------------------------------------------------------------------------
    async def create_processing_task(
        self, tenant_id: UUID, organization_id: UUID, task: ProcessingTaskCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO processing_tasks (
                    tenant_id, organization_id, job_id, task_name
                )
                VALUES (%s, %s, %s, %s)
                RETURNING *
                """,
                (tenant_id, organization_id, task.job_id, task.task_name),
            )
            return await cursor.fetchone()

    async def update_processing_task_status(
        self, tenant_id: UUID, task_id: UUID, update: ProcessingTaskStatusUpdate
    ) -> Optional[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            started_at_clause = "started_at = NOW()," if update.status == "RUNNING" else ""
            completed_at_clause = "completed_at = NOW()," if update.status in ["COMPLETED", "FAILED", "CANCELLED"] else ""
            
            query = f"""
                UPDATE processing_tasks
                SET status = %s,
                    logs = %s,
                    {started_at_clause}
                    {completed_at_clause}
                    status = status
                WHERE id = %s AND tenant_id = %s
                RETURNING *
            """
            await cursor.execute(
                query,
                (
                    update.status,
                    json.dumps(update.logs) if update.logs else None,
                    task_id,
                    tenant_id,
                ),
            )
            return await cursor.fetchone()

    async def list_processing_tasks(self, tenant_id: UUID, job_id: UUID) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                SELECT * FROM processing_tasks
                WHERE job_id = %s AND tenant_id = %s
                ORDER BY created_at ASC
                """,
                (job_id, tenant_id),
            )
            return await cursor.fetchall()

    # ------------------------------------------------------------------------
    # Processing History
    # ------------------------------------------------------------------------
    async def create_processing_history(
        self, tenant_id: UUID, organization_id: UUID, history: ProcessingHistoryCreate
    ) -> Dict[str, Any]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            await cursor.execute(
                """
                INSERT INTO processing_history (
                    tenant_id, organization_id, job_id, dataset_id, user_id, action, details
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    tenant_id,
                    organization_id,
                    history.job_id,
                    history.dataset_id,
                    history.user_id,
                    history.action,
                    json.dumps(history.details),
                ),
            )
            return await cursor.fetchone()

    async def list_processing_history(
        self, tenant_id: UUID, organization_id: UUID, dataset_id: Optional[UUID] = None, job_id: Optional[UUID] = None, limit: int = 50, offset: int = 0
    ) -> List[Dict[str, Any]]:
        async with self.conn.cursor(row_factory=dict_row) as cursor:
            query = "SELECT * FROM processing_history WHERE tenant_id = %s AND organization_id = %s"
            params = [tenant_id, organization_id]
            if dataset_id:
                query += " AND dataset_id = %s"
                params.append(dataset_id)
            if job_id:
                query += " AND job_id = %s"
                params.append(job_id)
            query += " ORDER BY created_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            await cursor.execute(query, tuple(params))
            return await cursor.fetchall()
