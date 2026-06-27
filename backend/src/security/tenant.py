import logging
from fastapi import Request, HTTPException, Depends, status
from pydantic import BaseModel

from .context import SecurityContext, get_security_context, set_security_context
from .auth import get_current_user
from ..database.connection import get_db_connection
from psycopg.rows import dict_row

logger = logging.getLogger(__name__)

async def verify_tenant_isolation(
    request: Request,
    user=Depends(get_current_user),
    # conn=Depends(get_db_connection) 
):
    context = get_security_context()
    
    # --- UI Development Bypass ---
    new_context = context.model_copy(update={
        "tenant_id": "00000000-0000-0000-0000-000000000000",
        "organization_id": "00000000-0000-0000-0000-000000000000",
        "role": "admin",
        "permissions": ["analytics.read", "analytics.write"]
    })
    set_security_context(new_context)
    return new_context
    # -----------------------------
