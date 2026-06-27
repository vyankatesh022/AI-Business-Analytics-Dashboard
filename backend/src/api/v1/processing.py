from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import AsyncConnection

from src.database.connection import get_db
from src.domains.processing.models import (
    DataQualityReportResponse,
    DatasetSchemaResponse,
    ProcessingJobCreate,
    ProcessingJobResponse,
    ProcessingTaskResponse,
)
from src.domains.processing.repositories import ProcessingRepository
from src.domains.processing.services import ProcessingEngine
from src.security.rbac import Role, require_role

router = APIRouter(prefix="/processing", tags=["processing"])


@router.post("/jobs", response_model=ProcessingJobResponse, status_code=status.HTTP_201_CREATED)
async def create_processing_job(
    request: ProcessingJobCreate,
    db: AsyncConnection = Depends(get_db),
    # auth contexts normally provided by a dependency, mocking for now
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
    organization_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
    user_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    engine = ProcessingEngine(db)
    job = await engine.start_processing_job(
        tenant_id=tenant_id,
        organization_id=organization_id,
        user_id=user_id,
        job_request=request,
    )
    return job


@router.get("/jobs", response_model=List[ProcessingJobResponse])
async def list_processing_jobs(
    dataset_id: UUID = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
    organization_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = ProcessingRepository(db)
    jobs = await repo.list_processing_jobs(
        tenant_id=tenant_id, organization_id=organization_id, dataset_id=dataset_id, limit=limit, offset=offset
    )
    return jobs


@router.get("/jobs/{job_id}", response_model=ProcessingJobResponse)
async def get_processing_job(
    job_id: UUID,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = ProcessingRepository(db)
    job = await repo.get_processing_job(tenant_id=tenant_id, job_id=job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Processing job not found")
    return job


@router.get("/jobs/{job_id}/tasks", response_model=List[ProcessingTaskResponse])
async def list_processing_tasks(
    job_id: UUID,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = ProcessingRepository(db)
    tasks = await repo.list_processing_tasks(tenant_id=tenant_id, job_id=job_id)
    return tasks


@router.get("/data-quality/{dataset_id}", response_model=DataQualityReportResponse)
async def get_latest_data_quality_report(
    dataset_id: UUID,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = ProcessingRepository(db)
    report = await repo.get_latest_data_quality_report(tenant_id=tenant_id, dataset_id=dataset_id)
    if not report:
        raise HTTPException(status_code=404, detail="Data quality report not found")
    return report


@router.get("/schema/{dataset_id}", response_model=DatasetSchemaResponse)
async def get_dataset_schema(
    dataset_id: UUID,
    version: int = None,
    db: AsyncConnection = Depends(get_db),
    tenant_id: UUID = Depends(lambda: UUID("00000000-0000-0000-0000-000000000000")),
):
    repo = ProcessingRepository(db)
    schema = await repo.get_dataset_schema(tenant_id=tenant_id, dataset_id=dataset_id, version=version)
    if not schema:
        raise HTTPException(status_code=404, detail="Dataset schema not found")
    return schema
