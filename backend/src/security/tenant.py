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
    conn=Depends(get_db_connection)
):
    """
    Validates the tenant context for the authenticated user and populates
    tenant_id, organization_id, role, and permissions in the SecurityContext.
    """
    context = get_security_context()
    user_id = context.user_id
    
    # Normally the tenant_id might come from a header (e.g., X-Tenant-ID) if a user belongs to multiple,
    # or we just load their default tenant for simplicity.
    requested_tenant_id = request.headers.get("X-Tenant-ID")

    try:
        async with conn.cursor(row_factory=dict_row) as cur:
            # 1. Fetch user role and tenant
            if requested_tenant_id:
                await cur.execute("""
                    SELECT ur.tenant_id, ur.organization_id, r.name as role_name
                    FROM user_roles ur
                    JOIN roles r ON ur.role_id = r.id
                    WHERE ur.user_id = %s AND ur.tenant_id = %s
                """, (user_id, requested_tenant_id))
            else:
                # Get the first/default tenant for the user
                await cur.execute("""
                    SELECT ur.tenant_id, ur.organization_id, r.name as role_name
                    FROM user_roles ur
                    JOIN roles r ON ur.role_id = r.id
                    WHERE ur.user_id = %s
                    LIMIT 1
                """, (user_id,))
            
            user_record = await cur.fetchone()
            if not user_record:
                logger.warning(f"User {user_id} attempted access but has no assigned tenant/role.")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User does not have access to the specified tenant."
                )
            
            tenant_id = user_record["tenant_id"]
            organization_id = user_record["organization_id"]
            role_name = user_record["role_name"]

            # 2. Fetch permissions for the role
            await cur.execute("""
                SELECT p.name
                FROM role_permissions rp
                JOIN roles r ON rp.role_id = r.id
                JOIN permissions p ON rp.permission_id = p.id
                WHERE r.name = %s
            """, (role_name,))
            
            permissions_records = await cur.fetchall()
            permissions = [p["name"] for p in permissions_records]

            # 3. Update the context
            new_context = context.copy(update={
                "tenant_id": str(tenant_id),
                "organization_id": str(organization_id),
                "role": role_name,
                "permissions": permissions
            })
            set_security_context(new_context)
            
            return new_context
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Tenant isolation verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during tenant verification."
        )
