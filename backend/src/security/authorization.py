import logging
from fastapi import Request, HTTPException, Depends, status
from psycopg.rows import dict_row

from .context import get_security_context, set_security_context
from .auth import get_platform_user
from ..database.connection import get_db_connection

logger = logging.getLogger(__name__)

# Account-centric permissions mapped to roles
ROLE_PERMISSIONS = {
    "Owner": ["*"],
    "Admin": ["read:all", "write:all", "delete:all", "manage:users"],
    "Manager": ["read:all", "write:all"],
    "Analyst": ["read:all", "write:reports", "read:datasets"],
    "Viewer": ["read:all"]
}

async def require_account_membership(
    request: Request,
    platform_user=Depends(get_platform_user),
    db_gen=Depends(get_db_connection)
):
    """
    Validates that the user is a member of the requested account.
    The account_id is expected in the 'X-Account-ID' header.
    Populates account_id, role, and permissions into SecurityContext.
    """
    context = get_security_context()
    user_id = context.user_id
    
    account_id = request.headers.get("X-Account-ID")
    if not account_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing X-Account-ID header. Account context is required."
        )

    async for conn in db_gen:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute("""
                SELECT role
                FROM memberships
                WHERE user_id = %s AND account_id = %s
            """, (user_id, account_id))
            
            membership = await cur.fetchone()
            if not membership:
                logger.warning(f"User {user_id} attempted access to account {account_id} without membership.")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User does not have access to the specified account."
                )
            
            role = membership["role"]
            permissions = ROLE_PERMISSIONS.get(role, [])

            new_context = context.model_copy(update={
                "account_id": str(account_id),
                "role": role,
                "permissions": permissions
            })
            set_security_context(new_context)
            
            return new_context

def require_permissions(required_permissions: list[str]):
    """
    Dependency generator to enforce specific RBAC permissions.
    """
    async def permission_checker(
        context=Depends(require_account_membership)
    ):
        user_permissions = context.permissions
        if "*" in user_permissions:
            return True
            
        for req_perm in required_permissions:
            if req_perm not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing required permission: {req_perm}"
                )
        return True
    return permission_checker
