import os
import logging
from typing import Optional
from fastapi import Request, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from pydantic import ValidationError

from .context import SecurityContext, get_security_context, set_security_context

logger = logging.getLogger(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# We initialize the Supabase client if the keys are available
supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Validates the Supabase JWT and updates the security context with the user_id.
    """
    if not supabase_client:
        # In a real setup, missing keys is critical. For dev, we might mock or raise 500.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase client not configured."
        )

    token = credentials.credentials
    try:
        # Validate the token using Supabase GoTrue admin API or getting user
        user_response = supabase_client.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = user_response.user.id
        
        # Update the security context
        context = get_security_context()
        # Create a new context object to ensure immutability in the current async task
        new_context = context.copy(update={"user_id": user_id})
        set_security_context(new_context)
        
        return user_response.user
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
