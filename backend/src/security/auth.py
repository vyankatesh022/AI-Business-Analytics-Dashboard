import os
import logging
from typing import Optional
from fastapi import Request, HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from .context import SecurityContext, get_security_context, set_security_context
from ..database.connection import get_db_connection
from psycopg.rows import dict_row

logger = logging.getLogger(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
):
    # --- UI Development Bypass ---
    context = get_security_context()
    new_context = context.model_copy(update={"supabase_user_id": "00000000-0000-0000-0000-000000000000"})
    set_security_context(new_context)
    return {
        "user_id": "00000000-0000-0000-0000-000000000000",
        "account_id": "00000000-0000-0000-0000-000000000000"
    }

def require_role(roles: list[str]):
    async def role_checker(user=Depends(get_current_user)):
        return user
    return role_checker

async def get_platform_user(
    supabase_user=Depends(get_current_user),
):
    # --- UI Development Bypass ---
    context = get_security_context()
    new_context = context.model_copy(update={"user_id": "00000000-0000-0000-0000-000000000000"})
    set_security_context(new_context)
    return {"id": "00000000-0000-0000-0000-000000000000"}
