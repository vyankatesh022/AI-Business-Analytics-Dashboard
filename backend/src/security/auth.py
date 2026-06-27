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

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
):
    """
    Validates the Supabase JWT and updates the security context with supabase_user_id and user_id.
    """
    if not supabase_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase client not configured."
        )

    token = credentials.credentials
    try:
        user_response = supabase_client.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        supabase_user_id = user_response.user.id
        
        context = get_security_context()
        new_context = context.model_copy(update={"supabase_user_id": supabase_user_id})
        set_security_context(new_context)
        
        return user_response.user
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_platform_user(
    supabase_user=Depends(get_current_user),
    db_gen=Depends(get_db_connection)
):
    """
    Retrieves the internal platform user corresponding to the authenticated Supabase user.
    """
    context = get_security_context()
    supabase_user_id = context.supabase_user_id

    # We must use async iteration manually because get_db_connection is an async generator
    async for conn in db_gen:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute("SELECT id FROM users WHERE supabase_user_id = %s", (supabase_user_id,))
            user_record = await cur.fetchone()
            
            if not user_record:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Platform user not found for the given Supabase user.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
                
            user_id = str(user_record["id"])
            new_context = context.model_copy(update={"user_id": user_id})
            set_security_context(new_context)
            
            return user_record
