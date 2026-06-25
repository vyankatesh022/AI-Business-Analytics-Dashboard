import logging
import hashlib
from fastapi import Request
from .context import get_security_context
from ..database.connection import get_db_connection

logger = logging.getLogger(__name__)

async def log_audit_event(
    action: str,
    resource: str,
    request: Request,
    resource_id: str = None
):
    """
    Logs an audit event to the database. Does NOT store passwords, tokens, etc.
    """
    context = get_security_context()
    
    # We require an actor (user_id) for an audit event
    if not context.user_id:
        logger.warning(f"Audit log skipped for {action} on {resource} (No actor context)")
        return

    # Hash the IP address
    ip_address = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(ip_address.encode('utf-8')).hexdigest()
    
    user_agent = request.headers.get("User-Agent", "unknown")

    try:
        async with get_db_connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("""
                    INSERT INTO audit_logs 
                    (actor, action, resource, resource_id, tenant_id, organization_id, ip_hash, user_agent)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    context.user_id,
                    action,
                    resource,
                    resource_id,
                    context.tenant_id,
                    context.organization_id,
                    ip_hash,
                    user_agent
                ))
                await conn.commit()
    except Exception as e:
        # We don't fail the request if audit logging fails, but we must log it heavily
        logger.critical(f"Failed to write audit log: {e}")
