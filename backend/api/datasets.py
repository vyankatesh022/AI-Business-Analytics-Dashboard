from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import httpx
import pandas as pd
import io
import urllib.parse

from backend.auth.dependencies import get_current_user
from backend.services.dataset_service import (
    process_and_store_dataset, get_user_datasets, delete_dataset, rename_dataset,
    move_dataset, get_user_folders, create_folder, rename_folder, delete_folder
)
from backend.security.file_validator import validate_dataset_file

datasets_router = APIRouter()

class RenameRequest(BaseModel):
    new_name: str

class MoveRequest(BaseModel):
    folder_id: Optional[str] = None

class FolderCreateRequest(BaseModel):
    name: str
    parent_id: Optional[str] = None

class FolderRenameRequest(BaseModel):
    name: str

class ImportRequest(BaseModel):
    source_type: Optional[str] = "http"
    filename: Optional[str] = None
    folder_id: Optional[str] = None
    
    # HTTP / REST API settings
    url: Optional[str] = None
    method: Optional[str] = "GET"
    headers: Optional[Any] = None
    body: Optional[str] = None
    
    # AWS S3 settings
    s3_bucket: Optional[str] = None
    s3_key: Optional[str] = None
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region: Optional[str] = None
    
    # GCS settings
    gcs_bucket: Optional[str] = None
    gcs_blob: Optional[str] = None
    gcs_service_account_json: Optional[str] = None
    
    # FTP / SFTP settings
    ftp_host: Optional[str] = None
    ftp_port: Optional[int] = None
    ftp_username: Optional[str] = None
    ftp_password: Optional[str] = None
    ftp_path: Optional[str] = None
    ftp_use_sftp: Optional[bool] = False
    
    # Database settings
    db_type: Optional[str] = None
    db_host: Optional[str] = None
    db_port: Optional[int] = None
    db_username: Optional[str] = None
    db_password: Optional[str] = None
    db_name: Optional[str] = None
    db_query: Optional[str] = None
    
    # GitHub settings
    github_repo: Optional[str] = None
    github_path: Optional[str] = None
    github_branch: Optional[str] = "main"
    github_token: Optional[str] = None

@datasets_router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    folder_id: Optional[str] = Form(None),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload a new dataset. Validates file, extracts metadata, 
    stores in Supabase, and creates a database record.
    """
    # Security Validation
    await validate_dataset_file(file)
    
    # Processing and Storage
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")
        
    dataset_record = await process_and_store_dataset(user_id, file, folder_id)
    return dataset_record

@datasets_router.get("")
async def list_datasets(current_user: dict = Depends(get_current_user)):
    """List all datasets for the authenticated user."""
    user_id = current_user.get("id")
    datasets = await get_user_datasets(user_id)
    return {"datasets": datasets}

@datasets_router.delete("/{dataset_id}")
async def remove_dataset(dataset_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a dataset and its storage object."""
    user_id = current_user.get("id")
    return await delete_dataset(user_id, dataset_id)

@datasets_router.patch("/{dataset_id}/rename")
async def modify_dataset_name(
    dataset_id: str, 
    req: RenameRequest, 
    current_user: dict = Depends(get_current_user)
):
    """Rename the original filename of a dataset."""
    user_id = current_user.get("id")
    return await rename_dataset(user_id, dataset_id, req.new_name)

@datasets_router.post("/import")
async def import_remote_dataset(
    req: ImportRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Import a dataset from a remote source. Fetches the dataset via
    the ingestion service, validates structure, and stores it in the
    database or local mock storage.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    # 1. Fetch remote content using our ingestion service
    from backend.services.ingestion_service import fetch_remote_dataset
    try:
        file_path, target_filename = await fetch_remote_dataset(req.model_dump())
    except ImportError as ie:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ie)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error fetching remote source: {str(e)}"
        )

    # 2. Setup mock UploadFile for validation & storage
    content_type = "text/csv"
    ext = target_filename.rsplit(".", 1)[-1].lower() if "." in target_filename else ""
    if ext == "xlsx":
        content_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    import os
    class MockUploadFile(UploadFile):
        def __init__(self, filename: str, path: str, content_type: str):
            from starlette.datastructures import Headers
            headers = Headers({"content-type": content_type})
            self._file_path = path
            self._file_obj = open(path, "rb")
            super().__init__(file=self._file_obj, filename=filename, size=os.path.getsize(path), headers=headers)

        async def read(self, size: int = -1) -> bytes:
            if size == -1:
                return self.file.read()
            return self.file.read(size)

        async def seek(self, offset: int) -> None:
            self.file.seek(offset)
            
        async def close(self) -> None:
            self.file.close()
            if os.path.exists(self._file_path):
                try:
                    os.remove(self._file_path)
                except Exception:
                    pass
            await super().close()

    mock_file = MockUploadFile(target_filename, file_path, content_type)

    # 3. Security Validation
    try:
        await validate_dataset_file(mock_file)
    except HTTPException as he:
        await mock_file.close()
        raise he
    except Exception as e:
        await mock_file.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File validation failed: {str(e)}"
        )

    # 4. Process and store
    try:
        dataset_record = await process_and_store_dataset(user_id, mock_file, req.folder_id)
        return dataset_record
    finally:
        await mock_file.close()


@datasets_router.patch("/{dataset_id}/move")
async def move_dataset_endpoint(
    dataset_id: str,
    req: MoveRequest,
    current_user: dict = Depends(get_current_user)
):
    """Move a dataset to a folder (or root if None)."""
    user_id = current_user.get("id")
    return await move_dataset(user_id, dataset_id, req.folder_id)


@datasets_router.get("/folders")
async def list_folders(current_user: dict = Depends(get_current_user)):
    """List all folders for the authenticated user."""
    user_id = current_user.get("id")
    folders = await get_user_folders(user_id)
    return {"folders": folders}


@datasets_router.post("/folders")
async def create_new_folder(
    req: FolderCreateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a new folder."""
    user_id = current_user.get("id")
    return await create_folder(user_id, req.name, req.parent_id)


@datasets_router.patch("/folders/{folder_id}")
async def modify_folder_name(
    folder_id: str,
    req: FolderRenameRequest,
    current_user: dict = Depends(get_current_user)
):
    """Rename a folder."""
    user_id = current_user.get("id")
    return await rename_folder(user_id, folder_id, req.name)


@datasets_router.delete("/folders/{folder_id}")
async def remove_folder(
    folder_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a folder and update its content references."""
    user_id = current_user.get("id")
    return await delete_folder(user_id, folder_id)
