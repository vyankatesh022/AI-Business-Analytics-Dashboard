import asyncio
import logging
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from .models import (
    ReportCreate, ReportUpdate, ReportResponse,
    ReportScheduleCreate, ReportScheduleResponse,
    ReportExportCreate, ReportExportResponse, ExportFormat, ExportStatus,
    ReportShareCreate, ReportShareResponse
)
from .repositories import ReportRepository

logger = logging.getLogger(__name__)

class ReportingService:
    def __init__(self, repository: ReportRepository):
        self.repository = repository

    async def create_report(self, account_id: UUID, author_id: UUID, data: ReportCreate) -> ReportResponse:
        return await self.repository.create_report(account_id, author_id, data)

    async def get_report(self, account_id: UUID, report_id: UUID) -> Optional[ReportResponse]:
        return await self.repository.get_report(account_id, report_id)

    async def list_reports(self, account_id: UUID, skip: int = 0, limit: int = 50) -> List[ReportResponse]:
        return await self.repository.list_reports(account_id, skip, limit)

    async def update_report(self, account_id: UUID, report_id: UUID, data: ReportUpdate, author_id: UUID) -> Optional[ReportResponse]:
        return await self.repository.update_report(account_id, report_id, data, author_id)
        
    async def delete_report(self, account_id: UUID, report_id: UUID) -> bool:
        return await self.repository.delete_report(account_id, report_id)

    # Exports
    async def request_export(self, account_id: UUID, report_id: UUID, requester_id: UUID, data: ReportExportCreate, background_tasks) -> ReportExportResponse:
        # Create pending export record
        export = await self.repository.create_export(account_id, report_id, requester_id, data.format.value)
        
        # Enqueue background job to generate export
        background_tasks.add_task(self._generate_export_worker, account_id, report_id, export.id, data.format)
        
        return export

    async def _generate_export_worker(self, account_id: UUID, report_id: UUID, export_id: UUID, format: ExportFormat):
        try:
            # Mark processing
            await self.repository.update_export_status(export_id, ExportStatus.PROCESSING.value)
            
            # Simulate generation time
            await asyncio.sleep(2)
            
            # Fetch report data (In a real system, we'd render this data)
            report = await self.repository.get_report(account_id, report_id)
            if not report:
                raise Exception("Report not found for export generation")
                
            # Simulate saving to S3
            s3_key = f"accounts/{account_id}/exports/{report_id}_{export_id}.{format.value.lower()}"
            
            # Update as completed
            await self.repository.update_export_status(export_id, ExportStatus.COMPLETED.value, s3_key=s3_key)
            logger.info(f"Export {export_id} completed successfully.")
            
        except Exception as e:
            logger.error(f"Failed to generate export {export_id}: {str(e)}")
            await self.repository.update_export_status(export_id, ExportStatus.FAILED.value, error_message=str(e))
            
    async def get_report_exports(self, account_id: UUID, report_id: UUID) -> List[ReportExportResponse]:
        return await self.repository.get_exports_by_report(account_id, report_id)

    # Schedules
    async def create_schedule(self, account_id: UUID, report_id: UUID, creator_id: UUID, data: ReportScheduleCreate) -> ReportScheduleResponse:
        return await self.repository.create_schedule(account_id, report_id, creator_id, data)
        
    async def list_schedules(self, account_id: UUID, report_id: UUID) -> List[ReportScheduleResponse]:
        return await self.repository.list_schedules(account_id, report_id)

    # Shares
    async def share_report(self, account_id: UUID, report_id: UUID, creator_id: UUID, data: ReportShareCreate) -> ReportShareResponse:
        return await self.repository.create_share(account_id, report_id, creator_id, data)

def get_reporting_service(repository: ReportRepository) -> ReportingService:
    return ReportingService(repository)
