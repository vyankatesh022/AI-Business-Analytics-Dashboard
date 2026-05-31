import magic
from fastapi import UploadFile, HTTPException, status
import logging

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {"csv", "xlsx"}
ALLOWED_MIME_TYPES = {
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}

# 100 MB Limit
MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024

async def validate_dataset_file(file: UploadFile) -> None:
    """
    Validates an uploaded dataset file against AppSec standards.
    Checks file extension, MIME type, and size limit.
    """
    # 1. Validate extension
    filename = file.filename or ""
    if "." not in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File has no extension"
        )
    
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Extension '{ext}' not allowed. Allowed: {ALLOWED_EXTENSIONS}"
        )
        
    # 2. Validate MIME type using python-magic
    # Read first 2048 bytes for magic numbers
    chunk = await file.read(2048)
    # Reset file pointer
    await file.seek(0)
    
    mime_type = magic.from_buffer(chunk, mime=True)
    if mime_type not in ALLOWED_MIME_TYPES:
        logger.warning(f"Malicious upload attempt: File {filename} claimed to be {ext} but magic detected {mime_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file content type: {mime_type}. Allowed: {ALLOWED_MIME_TYPES}"
        )
        
    # 3. Size validation can be handled by FastAPI's SpooledTemporaryFile or via checking bytes during upload/processing
    # But as a simple check if size is available
    if file.size and file.size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum size of {MAX_FILE_SIZE_BYTES / (1024*1024)} MB"
        )
