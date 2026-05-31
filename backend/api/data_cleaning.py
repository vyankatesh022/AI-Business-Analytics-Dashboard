from fastapi import APIRouter, Depends, HTTPException, status, UploadFile
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Literal
import pandas as pd
import io

from backend.auth.dependencies import get_current_user
from backend.services.dataset_service import get_supabase_client, _is_mock_mode, _load_mock_db, process_and_store_dataset
from backend.automation.data_cleaning.engine import DataCleaningEngine

data_cleaning_router = APIRouter()

class ApplyCleaningRequest(BaseModel):
    operations: List[Dict[str, Any]]

class AnalyzeRequest(BaseModel):
    model: Literal["heuristic", "gemini-1.5-flash", "gpt-4o"] = "heuristic"

async def fetch_dataset_df(user_id: str, dataset_id: str) -> tuple:
    """Helper to fetch dataset as a DataFrame."""
    if _is_mock_mode():
        db = _load_mock_db()
        dataset = next((d for d in db if d.get("id") == dataset_id and d.get("user_id") == user_id), None)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        # Generate mock dataframe based on metadata
        sample_data = dataset.get("metadata", {}).get("sample", [])
        if not sample_data:
            df = pd.DataFrame()
        else:
            df = pd.DataFrame(sample_data)
        return df, dataset
        
    async with get_supabase_client() as client:
        res = await client.get(f"/rest/v1/datasets?id=eq.{dataset_id}&user_id=eq.{user_id}")
        data = res.json()
        if not data:
            raise HTTPException(status_code=404, detail="Dataset not found or unauthorized")
        dataset = data[0]
        storage_path = dataset["filename"]
        
        # Enforce max size limit (50MB) before downloading/parsing into Pandas
        size_bytes = dataset.get("size_bytes", 0)
        if size_bytes > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Dataset is too large to be processed (Max 50MB)")
            
        # Download from storage
        res_file = await client.get(f"/storage/v1/object/datasets/{storage_path}")
        if res_file.status_code >= 400:
             raise HTTPException(status_code=500, detail="Failed to download dataset file")
             
        file_ext = storage_path.rsplit(".", 1)[-1].lower()
        if file_ext == "csv":
            df = pd.read_csv(io.BytesIO(res_file.content))
        elif file_ext == "xlsx":
            df = pd.read_excel(io.BytesIO(res_file.content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
            
        return df, dataset

@data_cleaning_router.post("/{dataset_id}/cleaning/analyze")
async def analyze_dataset_for_cleaning(
    dataset_id: str, 
    req: AnalyzeRequest = AnalyzeRequest(), 
    current_user: dict = Depends(get_current_user)
):
    """
    Analyzes the dataset and returns a cleaning quality report and recommendations.
    """
    user_id = current_user.get("id")
    df, dataset = await fetch_dataset_df(user_id, dataset_id)
    
    metadata = {
        "enforce_auth": True,
        "user_id": user_id,
        "model": req.model
    }
    
    report = DataCleaningEngine.analyze(df, metadata)
    return report

@data_cleaning_router.post("/{dataset_id}/cleaning/apply")
async def apply_cleaning_operations(dataset_id: str, req: ApplyCleaningRequest, current_user: dict = Depends(get_current_user)):
    """
    Applies the selected cleaning operations and creates a new dataset version.
    """
    user_id = current_user.get("id")
    df, dataset = await fetch_dataset_df(user_id, dataset_id)
    
    metadata = {
        "enforce_auth": True,
        "user_id": user_id
    }
    
    cleaned_df, qa_report = DataCleaningEngine.clean(df, req.operations, metadata)
    
    # Save the new cleaned dataset back
    # Convert cleaned_df back to CSV
    csv_buffer = io.BytesIO()
    cleaned_df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    # Create UploadFile mock
    orig_name = dataset.get("original_filename", "dataset.csv")
    base_name = orig_name.rsplit(".", 1)[0]
    new_name = f"{base_name}_cleaned.csv"
    
    class MockUploadFile:
        def __init__(self, filename, content):
            self.filename = filename
            self.content_type = "text/csv"
            self._content = content
        async def read(self):
            return self._content
        async def seek(self, pos):
            pass
            
    mock_file = MockUploadFile(new_name, csv_buffer.getvalue())
    new_dataset = await process_and_store_dataset(user_id, mock_file)
    
    return {
        "message": "Dataset cleaned successfully",
        "new_dataset": new_dataset,
        "qa_report": qa_report
    }
