import os
import io
import csv
import json
import openpyxl
import httpx
from fastapi import UploadFile, HTTPException, status
from backend.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Supabase HTTP variables
supabase_url: str = settings.SUPABASE_URL if hasattr(settings, 'SUPABASE_URL') else settings.NEXT_PUBLIC_SUPABASE_URL
supabase_key: str = settings.SUPABASE_SERVICE_ROLE_KEY
if not supabase_url or not supabase_key:
    logger.warning("Supabase URL or Key is missing. Dataset storage won't work.")

import uuid
from datetime import datetime, timezone

from typing import Optional
LOCAL_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "temp")
LOCAL_DB_PATH = os.path.join(LOCAL_DB_DIR, "local-datasets.json")
LOCAL_FOLDERS_PATH = os.path.join(LOCAL_DB_DIR, "local-folders.json")

def _load_mock_folders():
    if not os.path.exists(LOCAL_DB_DIR):
        os.makedirs(LOCAL_DB_DIR, exist_ok=True)
    if os.path.exists(LOCAL_FOLDERS_PATH):
        try:
            with open(LOCAL_FOLDERS_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def _save_mock_folders(data):
    with open(LOCAL_FOLDERS_PATH, "w") as f:
        json.dump(data, f, indent=2)

def _is_mock_mode():
    env = os.getenv("ENVIRONMENT", "development")
    is_template = "your_project_ref" in supabase_url or "[project_ref]" in supabase_url or "localhost" in supabase_url
    return env == "development" and is_template

def _load_mock_db():
    if not os.path.exists(LOCAL_DB_DIR):
        os.makedirs(LOCAL_DB_DIR, exist_ok=True)
    if os.path.exists(LOCAL_DB_PATH):
        try:
            with open(LOCAL_DB_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def _save_mock_db(data):
    with open(LOCAL_DB_PATH, "w") as f:
        json.dump(data, f, indent=2)

# Helper to get httpx client with correct headers
def get_supabase_client():
    return httpx.AsyncClient(
        base_url=supabase_url,
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}"
        }
    )

def process_csv(content: bytes) -> tuple:
    text_content = content.decode('utf-8', errors='replace')
    reader = csv.reader(io.StringIO(text_content))
    
    try:
        columns = next(reader)
    except StopIteration:
        columns = []
        
    sample_rows = []
    row_count = 0
    for row in reader:
        if row_count < 5:
            row_dict = {}
            for i, col in enumerate(columns):
                val = row[i] if i < len(row) else None
                if val:
                    try:
                        if '.' in val:
                            val = float(val)
                        else:
                            val = int(val)
                    except ValueError:
                        pass
                row_dict[col] = val
            sample_rows.append(row_dict)
        row_count += 1
        
    dtypes = {}
    if sample_rows:
        for col in columns:
            val = sample_rows[0].get(col)
            if isinstance(val, int):
                dtypes[col] = "int64"
            elif isinstance(val, float):
                dtypes[col] = "float64"
            else:
                dtypes[col] = "object"
                
    return len(columns), row_count, columns, dtypes, sample_rows

def process_xlsx(content: bytes) -> tuple:
    wb = openpyxl.load_workbook(filename=io.BytesIO(content), data_only=True, read_only=True)
    sheet = wb.active
    
    rows_iter = sheet.iter_rows(values_only=True)
    try:
        columns = [str(c) if c is not None else f"Col{i}" for i, c in enumerate(next(rows_iter))]
    except StopIteration:
        columns = []
        
    sample_rows = []
    row_count = 0
    for row in rows_iter:
        if row_count < 5:
            row_dict = {}
            for i, col in enumerate(columns):
                val = row[i] if i < len(row) else None
                row_dict[col] = val
            sample_rows.append(row_dict)
        row_count += 1
        
    dtypes = {}
    if sample_rows:
        for col in columns:
            val = sample_rows[0].get(col)
            if isinstance(val, int):
                dtypes[col] = "int64"
            elif isinstance(val, float):
                dtypes[col] = "float64"
            else:
                dtypes[col] = "object"
                
    wb.close()
    return len(columns), row_count, columns, dtypes, sample_rows

async def process_and_store_dataset(user_id: str, file: UploadFile, folder_id: Optional[str] = None) -> dict:
    try:
        content = await file.read()
        await file.seek(0)
        size_bytes = len(content)

        file_ext = file.filename.rsplit(".", 1)[-1].lower()
        if file_ext == "csv":
            column_count, row_count, columns, dtypes, sample_rows = process_csv(content)
        elif file_ext == "xlsx":
            column_count, row_count, columns, dtypes, sample_rows = process_xlsx(content)
        else:
            raise ValueError(f"Unsupported extension for processing: {file_ext}")
        
        metadata = {
            "columns": columns,
            "dtypes": dtypes,
            "sample": sample_rows
        }

        # Duplicate file check
        if _is_mock_mode():
            db = _load_mock_db()
            if any(d.get("user_id") == user_id and d.get("folder_id") == folder_id and d.get("original_filename") == file.filename for d in db):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A file with this name already exists in the selected folder.")
        else:
            async with get_supabase_client() as client:
                query_url = f"/rest/v1/datasets?user_id=eq.{user_id}&original_filename=eq.{file.filename}"
                if folder_id:
                    query_url += f"&folder_id=eq.{folder_id}"
                else:
                    query_url += "&folder_id=is.null"
                res_check = await client.get(query_url)
                if res_check.status_code < 400 and len(res_check.json()) > 0:
                    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A file with this name already exists in the selected folder.")

        dataset_id = str(uuid.uuid4())
        folder_path = folder_id if folder_id else "root"
        storage_path = f"{user_id}/{folder_path}/{dataset_id}.{file_ext}"
        
        dataset_record = {
            "id": dataset_id,
            "user_id": user_id,
            "filename": storage_path,
            "original_filename": file.filename,
            "size_bytes": size_bytes,
            "row_count": row_count,
            "column_count": column_count,
            "metadata": metadata,
            "status": "processed",
            "folder_id": folder_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }

        if _is_mock_mode():
            logger.info(f"Using mock mode for dataset {file.filename}")
            db = _load_mock_db()
            db.insert(0, dataset_record)
            _save_mock_db(db)
            
            # Store data on local device in mock mode using ORIGINAL filename
            local_storage_dir = os.path.join(LOCAL_DB_DIR, "uploads", user_id, folder_path)
            os.makedirs(local_storage_dir, exist_ok=True)
            local_file_path = os.path.join(local_storage_dir, file.filename)
            with open(local_file_path, "wb") as f:
                f.write(content)
                
            return dataset_record
        
        async with get_supabase_client() as client:
            # Upload to storage
            res_storage = await client.post(
                f"/storage/v1/object/datasets/{storage_path}",
                content=content,
                headers={"Content-Type": file.content_type, "x-upsert": "true"}
            )
            if res_storage.status_code >= 400:
                raise Exception(f"Storage upload failed: {res_storage.text}")

            # Insert metadata into Database
            # remove id, created_at, updated_at to let db handle it
            db_record = dataset_record.copy()
            del db_record["id"]
            del db_record["created_at"]
            del db_record["updated_at"]

            res_db = await client.post(
                "/rest/v1/datasets",
                json=db_record,
                headers={"Prefer": "return=representation"}
            )
            
            if res_db.status_code >= 400:
                raise Exception(f"Database insert failed: {res_db.text}")
                
            return res_db.json()[0]

    except Exception as e:
        logger.error(f"Error processing dataset {file.filename}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing dataset: {str(e)}"
        )


async def get_user_datasets(user_id: str):
    if _is_mock_mode():
        db = _load_mock_db()
        return [d for d in db if d.get("user_id") == user_id]

    async with get_supabase_client() as client:
        res = await client.get(
            f"/rest/v1/datasets?user_id=eq.{user_id}&order=created_at.desc"
        )
        if res.status_code >= 400:
            return []
        return res.json()


async def delete_dataset(user_id: str, dataset_id: str):
    if _is_mock_mode():
        db = _load_mock_db()
        deleted_record = next((d for d in db if d.get("id") == dataset_id and d.get("user_id") == user_id), None)
        new_db = [d for d in db if not (d.get("id") == dataset_id and d.get("user_id") == user_id)]
        if len(db) == len(new_db):
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
            
        if deleted_record and "filename" in deleted_record:
            local_file_path = os.path.join(LOCAL_DB_DIR, "uploads", deleted_record["filename"].replace("/", os.sep))
            if os.path.exists(local_file_path):
                try:
                    os.remove(local_file_path)
                except Exception as e:
                    logger.warning(f"Could not delete local file {local_file_path}: {e}")
                    
        _save_mock_db(new_db)
        return {"message": "Dataset deleted successfully"}

    async with get_supabase_client() as client:
        # Verify ownership
        res_get = await client.get(f"/rest/v1/datasets?id=eq.{dataset_id}&user_id=eq.{user_id}&select=filename")
        data = res_get.json()
        if not data:
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
            
        storage_path = data[0]["filename"]

        # Delete from storage
        await client.request("DELETE", f"/storage/v1/object/datasets/{storage_path}")

        # Delete from DB
        await client.delete(f"/rest/v1/datasets?id=eq.{dataset_id}")
        
    return {"message": "Dataset deleted successfully"}


async def rename_dataset(user_id: str, dataset_id: str, new_name: str):
    if _is_mock_mode():
        db = _load_mock_db()
        for d in db:
            if d.get("id") == dataset_id and d.get("user_id") == user_id:
                d["original_filename"] = new_name
                d["updated_at"] = datetime.now(timezone.utc).isoformat()
                _save_mock_db(db)
                return d
        raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")

    async with get_supabase_client() as client:
        res = await client.patch(
            f"/rest/v1/datasets?id=eq.{dataset_id}&user_id=eq.{user_id}",
            json={"original_filename": new_name},
            headers={"Prefer": "return=representation"}
        )
        data = res.json()
        if not data:
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
        return data[0]


async def move_dataset(user_id: str, dataset_id: str, folder_id: Optional[str]):
    if _is_mock_mode():
        db = _load_mock_db()
        # Verify folder exists or is None
        if folder_id:
            folders = _load_mock_folders()
            if not any(f.get("id") == folder_id and f.get("user_id") == user_id for f in folders):
                raise HTTPException(status_code=404, detail="Folder not found")
        
        for d in db:
            if d.get("id") == dataset_id and d.get("user_id") == user_id:
                d["folder_id"] = folder_id
                d["updated_at"] = datetime.now(timezone.utc).isoformat()
                _save_mock_db(db)
                return d
        raise HTTPException(status_code=404, detail="Dataset not found")

    async with get_supabase_client() as client:
        # Move dataset
        res = await client.patch(
            f"/rest/v1/datasets?id=eq.{dataset_id}&user_id=eq.{user_id}",
            json={"folder_id": folder_id},
            headers={"Prefer": "return=representation"}
        )
        data = res.json()
        if not data:
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
        return data[0]


async def get_user_folders(user_id: str):
    if _is_mock_mode():
        folders = _load_mock_folders()
        return [f for f in folders if f.get("user_id") == user_id]

    async with get_supabase_client() as client:
        res = await client.get(
            f"/rest/v1/folders?user_id=eq.{user_id}"
        )
        if res.status_code >= 400:
            return []
        return res.json()


async def create_folder(user_id: str, name: str, parent_id: Optional[str] = None):
    folder_id = f"folder-{int(datetime.now(timezone.utc).timestamp()*1000)}-{uuid.uuid4().hex[:4]}"
    folder_record = {
        "id": folder_id,
        "user_id": user_id,
        "name": name,
        "parent_id": parent_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    if _is_mock_mode():
        folders = _load_mock_folders()
        # verify parent exists if provided
        if parent_id and not any(f.get("id") == parent_id and f.get("user_id") == user_id for f in folders):
            raise HTTPException(status_code=400, detail="Parent folder not found")
        
        # Check for duplicates
        if any(f.get("name") == name and f.get("user_id") == user_id and f.get("parent_id") == parent_id for f in folders):
            raise HTTPException(status_code=409, detail="A folder with this name already exists here.")

        folders.insert(0, folder_record)
        _save_mock_folders(folders)
        return folder_record

    async with get_supabase_client() as client:
        # Check for duplicates in DB
        query_url = f"/rest/v1/folders?user_id=eq.{user_id}&name=eq.{name}"
        if parent_id:
            query_url += f"&parent_id=eq.{parent_id}"
        else:
            query_url += "&parent_id=is.null"
        
        res_check = await client.get(query_url)
        if res_check.status_code < 400 and len(res_check.json()) > 0:
            raise HTTPException(status_code=409, detail="A folder with this name already exists here.")

        res = await client.post(
            "/rest/v1/folders",
            json=folder_record,
            headers={"Prefer": "return=representation"}
        )
        if res.status_code >= 400:
            raise Exception(f"Database insert folder failed: {res.text}")
        return res.json()[0]


async def rename_folder(user_id: str, folder_id: str, new_name: str):
    if _is_mock_mode():
        folders = _load_mock_folders()
        for f in folders:
            if f.get("id") == folder_id and f.get("user_id") == user_id:
                f["name"] = new_name
                _save_mock_folders(folders)
                return f
        raise HTTPException(status_code=404, detail="Folder not found")

    async with get_supabase_client() as client:
        res = await client.patch(
            f"/rest/v1/folders?id=eq.{folder_id}&user_id=eq.{user_id}",
            json={"name": new_name},
            headers={"Prefer": "return=representation"}
        )
        data = res.json()
        if not data:
            raise HTTPException(status_code=404, detail="Folder not found or unauthorized")
        return data[0]


async def delete_folder(user_id: str, folder_id: str):
    if _is_mock_mode():
        folders = _load_mock_folders()
        folders_filtered = [f for f in folders if not (f.get("id") == folder_id and f.get("user_id") == user_id)]
        if len(folders) == len(folders_filtered):
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # move datasets in this folder to root
        db = _load_mock_db()
        for d in db:
            if d.get("folder_id") == folder_id and d.get("user_id") == user_id:
                d["folder_id"] = None
        _save_mock_db(db)

        # move child folders to root
        for f in folders_filtered:
            if f.get("parent_id") == folder_id and f.get("user_id") == user_id:
                f["parent_id"] = None
        
        _save_mock_folders(folders_filtered)
        return {"message": "Folder deleted successfully"}

    async with get_supabase_client() as client:
        # Reset datasets in this folder
        await client.patch(
            f"/rest/v1/datasets?folder_id=eq.{folder_id}&user_id=eq.{user_id}",
            json={"folder_id": None}
        )
        # Move child folders to root
        await client.patch(
            f"/rest/v1/folders?parent_id=eq.{folder_id}&user_id=eq.{user_id}",
            json={"parent_id": None}
        )
        # Delete folder
        await client.delete(
            f"/rest/v1/folders?id=eq.{folder_id}&user_id=eq.{user_id}"
        )
    return {"message": "Folder deleted successfully"}


async def get_dataset_content(user_id: str, dataset_id: str):
    """
    Retrieves the dataset file content and returns it as a pandas DataFrame.
    Validates ownership of the dataset via user_id.
    """
    import pandas as pd
    import io

    if _is_mock_mode():
        db = _load_mock_db()
        record = next((d for d in db if d.get("id") == dataset_id and d.get("user_id") == user_id), None)
        if not record:
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
        
        filename = record.get("original_filename", record.get("filename"))
        folder_path = record.get("folder_id", "root") if record.get("folder_id") else "root"
        local_file_path = os.path.join(LOCAL_DB_DIR, "uploads", user_id, folder_path, filename)
        
        # Fallback to older storage path style if not found
        if not os.path.exists(local_file_path) and "filename" in record:
             local_file_path = os.path.join(LOCAL_DB_DIR, "uploads", record["filename"].replace("/", os.sep))
             
        if not os.path.exists(local_file_path):
            raise HTTPException(status_code=404, detail="Local dataset file not found")
            
        if filename.endswith(".csv"):
            return pd.read_csv(local_file_path)
        elif filename.endswith(".xlsx"):
            return pd.read_excel(local_file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

    async with get_supabase_client() as client:
        # Verify ownership
        res_get = await client.get(f"/rest/v1/datasets?id=eq.{dataset_id}&user_id=eq.{user_id}&select=filename")
        data = res_get.json()
        if not data:
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
            
        storage_path = data[0]["filename"]

        # Get file from storage
        res_file = await client.get(f"/storage/v1/object/datasets/{storage_path}")
        if res_file.status_code >= 400:
            raise HTTPException(status_code=404, detail="Dataset file could not be downloaded")
            
        content = res_file.content
        if storage_path.endswith(".csv"):
            return pd.read_csv(io.BytesIO(content))
        elif storage_path.endswith(".xlsx"):
            return pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
