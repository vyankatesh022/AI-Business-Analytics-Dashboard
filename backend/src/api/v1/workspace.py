from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID
import os

from src.domains.workspace.repositories import WorkspaceRepository
from src.domains.workspace.services import WorkspaceService
from src.domains.workspace.models import (
    WorkspaceFolderCreate, WorkspaceFolderUpdate, WorkspaceFolderResponse,
    WorkspaceDatasetCreate, WorkspaceDatasetUpdate, WorkspaceDatasetResponse,
    WorkspaceConnectionCreate, WorkspaceConnectionUpdate, WorkspaceConnectionResponse
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

@router.patch("/folders/{folder_id}", response_model=WorkspaceFolderResponse)
def update_folder(
    folder_id: UUID,
    folder_in: WorkspaceFolderUpdate,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    folder = service.update_folder(context.tenant_id, context.organization_id, context.user_id, folder_id, folder_in)
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return folder

@router.delete("/folders/{folder_id}")
def delete_folder(
    folder_id: UUID,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    success = service.delete_folder(context.tenant_id, context.organization_id, context.user_id, folder_id)
    if not success:
        raise HTTPException(status_code=404, detail="Folder not found")
    return {"message": "Folder deleted"}

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

@router.patch("/datasets/{dataset_id}", response_model=WorkspaceDatasetResponse)
def update_dataset(
    dataset_id: UUID,
    dataset_in: WorkspaceDatasetUpdate,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    dataset = service.update_dataset(context.tenant_id, context.organization_id, context.user_id, dataset_id, dataset_in)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

@router.delete("/datasets/{dataset_id}")
def delete_dataset(
    dataset_id: UUID,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    success = service.delete_dataset(context.tenant_id, context.organization_id, context.user_id, dataset_id)
    if not success:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {"message": "Dataset deleted"}

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

@router.patch("/connections/{connection_id}", response_model=WorkspaceConnectionResponse)
def update_connection(
    connection_id: UUID,
    connection_in: WorkspaceConnectionUpdate,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    connection = service.update_connection(context.tenant_id, context.organization_id, context.user_id, connection_id, connection_in)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    return connection

@router.delete("/connections/{connection_id}")
def delete_connection(
    connection_id: UUID,
    service: WorkspaceService = Depends(get_workspace_service),
    context = Depends(get_security_context)
):
    success = service.delete_connection(context.tenant_id, context.organization_id, context.user_id, connection_id)
    if not success:
        raise HTTPException(status_code=404, detail="Connection not found")
    return {"message": "Connection deleted"}
