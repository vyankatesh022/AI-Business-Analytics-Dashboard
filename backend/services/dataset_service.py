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
from datetime import datetime

LOCAL_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "local-datasets.json")

def _is_mock_mode():
    env = os.getenv("ENVIRONMENT", "development")
    is_template = "your_project_ref" in supabase_url or "[project_ref]" in supabase_url or "localhost" in supabase_url
    return env == "development" and is_template

def _load_mock_db():
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

async def process_and_store_dataset(user_id: str, file: UploadFile) -> dict:
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

        storage_path = f"{user_id}/{file.filename}"
        
        dataset_record = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "filename": storage_path,
            "original_filename": file.filename,
            "size_bytes": size_bytes,
            "row_count": row_count,
            "column_count": column_count,
            "metadata": metadata,
            "status": "processed",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        if _is_mock_mode():
            logger.info(f"Using mock mode for dataset {file.filename}")
            db = _load_mock_db()
            db.insert(0, dataset_record)
            _save_mock_db(db)
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
        new_db = [d for d in db if not (d.get("id") == dataset_id and d.get("user_id") == user_id)]
        if len(db) == len(new_db):
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
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
                d["updated_at"] = datetime.utcnow().isoformat()
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
