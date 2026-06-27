import logging
from typing import Optional
from uuid import UUID
from psycopg import AsyncConnection
from datetime import datetime

logger = logging.getLogger(__name__)

class AuditService:
    def __init__(self, conn: AsyncConnection):
        self.conn = conn

    async def log_action(
        self,
        account_id: Optional[UUID],
        actor_id: Optional[UUID],
        action: str,
        resource: str,
        resource_id: Optional[str] = None,
        ip_hash: Optional[str] = None,
        user_agent: Optional[str] = None
    ):
        """
        Logs an audit event to the database.
        """
        query = """
            INSERT INTO audit_logs 
            (account_id, actor, action, resource, resource_id, ip_hash, user_agent, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        try:
            async with self.conn.cursor() as cur:
                await cur.execute(
                    query, 
                    (account_id, actor_id, action, resource, resource_id, ip_hash, user_agent, datetime.utcnow())
                )
        except Exception as e:
            logger.error(f"Failed to write audit log: {e}")
