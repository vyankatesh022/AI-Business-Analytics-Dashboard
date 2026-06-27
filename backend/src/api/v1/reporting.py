from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status

from backend.src.security.auth import get_current_user
from backend.src.api.middleware import require_role
from backend.src.domains.reporting.models import (
    ReportCreate, ReportUpdate, ReportResponse,
    ReportScheduleCreate, ReportScheduleResponse,
    ReportExportCreate, ReportExportResponse,
    ReportShareCreate, ReportShareResponse
)
from backend.src.domains.reporting.repositories import get_report_repository
from backend.src.domains.reporting.services import get_reporting_service, ReportingService

router = APIRouter(prefix="/accounts/{account_id}/reports", tags=["reporting"])

def get_service(repo = Depends(get_report_repository)) -> ReportingService:
    return get_reporting_service(repo)

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    account_id: UUID,
    data: ReportCreate,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst"])),
    service: ReportingService = Depends(get_service)
):
    """Create a new report in the report builder."""
    return await service.create_report(account_id, user.id, data)

@router.get("", response_model=List[ReportResponse])
async def list_reports(
    account_id: UUID,
    skip: int = 0,
    limit: int = 50,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst", "Viewer"])),
    service: ReportingService = Depends(get_service)
):
    """List reports for the account."""
    return await service.list_reports(account_id, skip, limit)

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    account_id: UUID,
    report_id: UUID,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst", "Viewer"])),
    service: ReportingService = Depends(get_service)
):
    """Get a specific report."""
    report = await service.get_report(account_id, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.put("/{report_id}", response_model=ReportResponse)
async def update_report(
    account_id: UUID,
    report_id: UUID,
    data: ReportUpdate,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst"])),
    service: ReportingService = Depends(get_service)
):
    """Update a report (creates a new version)."""
    report = await service.update_report(account_id, report_id, data, user.id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    account_id: UUID,
    report_id: UUID,
    user=Depends(require_role(["Owner", "Admin", "Manager"])),
    service: ReportingService = Depends(get_service)
):
    """Delete a report."""
    deleted = await service.delete_report(account_id, report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found")

# --- Exports ---
@router.post("/{report_id}/exports", response_model=ReportExportResponse, status_code=status.HTTP_202_ACCEPTED)
async def export_report(
    account_id: UUID,
    report_id: UUID,
    data: ReportExportCreate,
    background_tasks: BackgroundTasks,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst", "Viewer"])),
    service: ReportingService = Depends(get_service)
):
    """Trigger a report export (runs in background)."""
    return await service.request_export(account_id, report_id, user.id, data, background_tasks)

@router.get("/{report_id}/exports", response_model=List[ReportExportResponse])
async def list_report_exports(
    account_id: UUID,
    report_id: UUID,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst", "Viewer"])),
    service: ReportingService = Depends(get_service)
):
    """List exports for a report."""
    return await service.get_report_exports(account_id, report_id)

# --- Schedules ---
@router.post("/{report_id}/schedules", response_model=ReportScheduleResponse)
async def create_schedule(
    account_id: UUID,
    report_id: UUID,
    data: ReportScheduleCreate,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst"])),
    service: ReportingService = Depends(get_service)
):
    """Schedule a report delivery."""
    return await service.create_schedule(account_id, report_id, user.id, data)

@router.get("/{report_id}/schedules", response_model=List[ReportScheduleResponse])
async def list_schedules(
    account_id: UUID,
    report_id: UUID,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst"])),
    service: ReportingService = Depends(get_service)
):
    """List schedules for a report."""
    return await service.list_schedules(account_id, report_id)

# --- Shares ---
@router.post("/{report_id}/shares", response_model=ReportShareResponse)
async def share_report(
    account_id: UUID,
    report_id: UUID,
    data: ReportShareCreate,
    user=Depends(require_role(["Owner", "Admin", "Manager", "Analyst"])),
    service: ReportingService = Depends(get_service)
):
    """Share a report."""
    return await service.share_report(account_id, report_id, user.id, data)
