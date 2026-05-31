from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from backend.auth.dependencies import get_current_user
from backend.services.dataset_service import process_and_store_dataset, get_user_datasets, delete_dataset, rename_dataset
from backend.security.file_validator import validate_dataset_file

datasets_router = APIRouter()

class RenameRequest(BaseModel):
    new_name: str

@datasets_router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
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
        
    dataset_record = await process_and_store_dataset(user_id, file)
    return dataset_record

@datasets_router.get("/")
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
