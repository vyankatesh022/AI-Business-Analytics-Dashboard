import json
from typing import List, Optional
from uuid import UUID
from backend.src.database.connection import pool
from .models import (
    ReportCreate, ReportUpdate, ReportResponse, ReportVersion,
    ReportScheduleCreate, ReportScheduleResponse,
    ReportExportCreate, ReportExportResponse,
    ReportShareCreate, ReportShareResponse,
    ExportStatus
)
from pydantic import parse_obj_as

class ReportRepository:
    def __init__(self, pool):
        self.pool = pool

    async def create_report(self, account_id: UUID, author_id: UUID, data: ReportCreate) -> ReportResponse:
        async with self.pool.acquire() as conn:
            blocks_json = json.dumps([b.dict() for b in data.blocks])
            row = await conn.fetchrow(
                """
                INSERT INTO reports (account_id, author_id, title, description, report_type, blocks)
                VALUES ($1, $2, $3, $4, $5, $6::jsonb)
                RETURNING id, account_id, author_id, title, description, report_type, status, version, blocks, created_at, updated_at
                """,
                account_id, author_id, data.title, data.description, data.report_type.value, blocks_json
            )
            return self._map_report_row(row)

    async def get_report(self, account_id: UUID, report_id: UUID) -> Optional[ReportResponse]:
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT * FROM reports WHERE id = $1 AND account_id = $2",
                report_id, account_id
            )
            if row:
                return self._map_report_row(row)
            return None

    async def list_reports(self, account_id: UUID, skip: int = 0, limit: int = 50) -> List[ReportResponse]:
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM reports WHERE account_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3",
                account_id, skip, limit
            )
            return [self._map_report_row(r) for r in rows]

    async def update_report(self, account_id: UUID, report_id: UUID, data: ReportUpdate, author_id: UUID) -> Optional[ReportResponse]:
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Get current report for versioning
                current = await conn.fetchrow(
                    "SELECT * FROM reports WHERE id = $1 AND account_id = $2",
                    report_id, account_id
                )
                if not current:
                    return None
                
                # Insert into report_versions
                await conn.execute(
                    """
                    INSERT INTO report_versions (report_id, account_id, author_id, version_num, title, description, blocks)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    """,
                    current['id'], current['account_id'], current['author_id'],
                    current['version'], current['title'], current['description'], current['blocks']
                )

                # Update report and increment version
                blocks_json = json.dumps([b.dict() for b in data.blocks])
                status_val = data.status.value if data.status else current['status']
                
                row = await conn.fetchrow(
                    """
                    UPDATE reports
                    SET title = $1, description = $2, report_type = $3, blocks = $4::jsonb, status = $5, version = version + 1
                    WHERE id = $6 AND account_id = $7
                    RETURNING *
                    """,
                    data.title, data.description, data.report_type.value, blocks_json, status_val, report_id, account_id
                )
                return self._map_report_row(row)
                
    async def delete_report(self, account_id: UUID, report_id: UUID) -> bool:
        async with self.pool.acquire() as conn:
            result = await conn.execute(
                "DELETE FROM reports WHERE id = $1 AND account_id = $2",
                report_id, account_id
            )
            return result == "DELETE 1"

    # --- Exports ---
    
    async def create_export(self, account_id: UUID, report_id: UUID, requester_id: UUID, format_type: str) -> ReportExportResponse:
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO report_exports (report_id, account_id, requester_id, format)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                """,
                report_id, account_id, requester_id, format_type
            )
            return self._map_export_row(row)
            
    async def update_export_status(self, export_id: UUID, status: str, s3_key: str = None, error_message: str = None) -> Optional[ReportExportResponse]:
        async with self.pool.acquire() as conn:
            if status == ExportStatus.COMPLETED.value:
                query = "UPDATE report_exports SET status = $1, s3_key = $2, completed_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *"
                args = (status, s3_key, export_id)
            elif status == ExportStatus.FAILED.value:
                query = "UPDATE report_exports SET status = $1, error_message = $2, completed_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *"
                args = (status, error_message, export_id)
            else:
                query = "UPDATE report_exports SET status = $1 WHERE id = $2 RETURNING *"
                args = (status, export_id)
                
            row = await conn.fetchrow(query, *args)
            if row:
                return self._map_export_row(row)
            return None
            
    async def get_exports_by_report(self, account_id: UUID, report_id: UUID) -> List[ReportExportResponse]:
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM report_exports WHERE report_id = $1 AND account_id = $2 ORDER BY created_at DESC",
                report_id, account_id
            )
            return [self._map_export_row(r) for r in rows]

    # --- Schedules ---
    
    async def create_schedule(self, account_id: UUID, report_id: UUID, creator_id: UUID, data: ReportScheduleCreate) -> ReportScheduleResponse:
        async with self.pool.acquire() as conn:
            recipients_json = json.dumps(data.recipients)
            delivery_json = json.dumps(data.delivery_methods)
            row = await conn.fetchrow(
                """
                INSERT INTO report_schedules (report_id, account_id, creator_id, schedule_type, cron_expression, recipients, delivery_methods)
                VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
                RETURNING *
                """,
                report_id, account_id, creator_id, data.schedule_type.value, data.cron_expression, recipients_json, delivery_json
            )
            return self._map_schedule_row(row)
            
    async def list_schedules(self, account_id: UUID, report_id: UUID) -> List[ReportScheduleResponse]:
        async with self.pool.acquire() as conn:
            rows = await conn.fetch(
                "SELECT * FROM report_schedules WHERE report_id = $1 AND account_id = $2 ORDER BY created_at DESC",
                report_id, account_id
            )
            return [self._map_schedule_row(r) for r in rows]

    # --- Shares ---
    
    async def create_share(self, account_id: UUID, report_id: UUID, creator_id: UUID, data: ReportShareCreate) -> ReportShareResponse:
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO report_shares (report_id, account_id, creator_id, share_type, target_id, permission_level, expires_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
                """,
                report_id, account_id, creator_id, data.share_type.value, data.target_id, data.permission_level, data.expires_at
            )
            return self._map_share_row(row)

    # --- Mappers ---
    def _map_report_row(self, row) -> ReportResponse:
        d = dict(row)
        if isinstance(d.get('blocks'), str):
            d['blocks'] = json.loads(d['blocks'])
        return ReportResponse(**d)
        
    def _map_export_row(self, row) -> ReportExportResponse:
        return ReportExportResponse(**dict(row))
        
    def _map_schedule_row(self, row) -> ReportScheduleResponse:
        d = dict(row)
        if isinstance(d.get('recipients'), str):
            d['recipients'] = json.loads(d['recipients'])
        if isinstance(d.get('delivery_methods'), str):
            d['delivery_methods'] = json.loads(d['delivery_methods'])
        return ReportScheduleResponse(**d)
        
    def _map_share_row(self, row) -> ReportShareResponse:
        return ReportShareResponse(**dict(row))

def get_report_repository() -> ReportRepository:
    return ReportRepository(pool)
