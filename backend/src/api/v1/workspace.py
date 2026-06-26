from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID
import os

from src.domains.workspace.repositories import WorkspaceRepository
from src.domains.workspace.services import WorkspaceService
from src.domains.workspace.models import (
    WorkspaceFolderCreate, WorkspaceFolderResponse,
    WorkspaceDatasetCreate, WorkspaceDatasetResponse,
    WorkspaceConnectionCreate, WorkspaceConnectionResponse
)
from src.security.context import get_security_context

router = APIRouter(prefix="/workspace", tags=["workspace"])

def get_workspace_service() -> WorkspaceService:
    dsn = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    repo = WorkspaceRepository(dsn)
    return WorkspaceService(repo)

# --- Folders ---

@router.post("/folders", response_model=WorkspaceFolderResponse)
def create_folder(
    folder_in: WorkspaceFolderCreate,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    try:
        return service.create_folder(context.tenant_id, context.organization_id, context.user_id, folder_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/folders", response_model=List[WorkspaceFolderResponse])
def get_folders(
    parent_id: Optional[UUID] = Query(None),
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    return service.get_folders(context.tenant_id, context.organization_id, parent_id)

# --- Datasets ---

@router.post("/datasets", response_model=WorkspaceDatasetResponse)
def create_dataset(
    dataset_in: WorkspaceDatasetCreate,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    try:
        return service.create_dataset(context.tenant_id, context.organization_id, context.user_id, dataset_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/datasets", response_model=List[WorkspaceDatasetResponse])
def get_datasets(
    folder_id: Optional[UUID] = Query(None),
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    return service.get_datasets(context.tenant_id, context.organization_id, folder_id)

# --- Connections ---

@router.post("/connections", response_model=WorkspaceConnectionResponse)
def create_connection(
    connection_in: WorkspaceConnectionCreate,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    try:
        return service.create_connection(context.tenant_id, context.organization_id, context.user_id, connection_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/connections", response_model=List[WorkspaceConnectionResponse])
def get_connections(
    folder_id: Optional[UUID] = Query(None),
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    return service.get_connections(context.tenant_id, context.organization_id, folder_id)
