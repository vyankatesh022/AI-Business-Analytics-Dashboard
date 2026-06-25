from typing import List, Callable
from fastapi import HTTPException, Depends, status

from .context import SecurityContext, get_security_context
from .tenant import verify_tenant_isolation

def require_permissions(required_permissions: List[str]) -> Callable:
    """
    Dependency factory to check if the current user's role has the required permissions.
    Must be used AFTER verify_tenant_isolation.
    """
    async def permission_checker(
        context: SecurityContext = Depends(verify_tenant_isolation)
    ):
        user_permissions = context.permissions
        
        # Check if all required permissions are present in the user's permissions
        missing_permissions = [p for p in required_permissions if p not in user_permissions]
        
        if missing_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Missing required permissions: {', '.join(missing_permissions)}"
            )
        
        return context
        
    return permission_checker
