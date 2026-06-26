from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any
from uuid import UUID
from datetime import datetime

class WorkspaceFolderBase(BaseModel):
    name: str
    parent_id: Optional[UUID] = None
    color_label: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = []

class WorkspaceFolderCreate(WorkspaceFolderBase):
    pass

class WorkspaceFolderUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[UUID] = None
    color_label: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class WorkspaceFolderResponse(WorkspaceFolderBase):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class WorkspaceDatasetBase(BaseModel):
    name: str
    folder_id: Optional[UUID] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    status: str = "ACTIVE"
    format: Optional[str] = None

class WorkspaceDatasetCreate(WorkspaceDatasetBase):
    file_path: Optional[str] = None
    size_bytes: Optional[int] = None
    row_count: Optional[int] = None

class WorkspaceDatasetUpdate(BaseModel):
    name: Optional[str] = None
    folder_id: Optional[UUID] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    format: Optional[str] = None
    size_bytes: Optional[int] = None
    row_count: Optional[int] = None
    file_path: Optional[str] = None

class WorkspaceDatasetResponse(WorkspaceDatasetBase):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    owner_id: UUID
    version: int
    size_bytes: Optional[int] = None
    row_count: Optional[int] = None
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class WorkspaceConnectionBase(BaseModel):
    name: str
    folder_id: Optional[UUID] = None
    type: str
    host: Optional[str] = None
    port: Optional[int] = None
    database_name: Optional[str] = None
    username: Optional[str] = None

class WorkspaceConnectionCreate(WorkspaceConnectionBase):
    password: Optional[str] = None

class WorkspaceConnectionUpdate(BaseModel):
    name: Optional[str] = None
    folder_id: Optional[UUID] = None
    type: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

class WorkspaceConnectionResponse(WorkspaceConnectionBase):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
