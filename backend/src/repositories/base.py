import logging
from typing import Any, List, Optional, Dict
from psycopg import AsyncConnection
from psycopg.rows import dict_row
from uuid import UUID

logger = logging.getLogger(__name__)

class BaseRepository:
    def __init__(self, conn: AsyncConnection, account_id: UUID):
        """
        Base repository enforcing account-centric multi-tenancy.
        Every operation MUST be scoped to the account_id.
        """
        self.conn = conn
        self.account_id = account_id
        # By setting row_factory here, we ensure dictionaries are returned
        self.conn.row_factory = dict_row

    async def _execute(self, query: str, params: tuple = ()) -> Any:
        async with self.conn.cursor() as cur:
            await cur.execute(query, params)
            return cur

    async def get_by_id(self, table: str, id: UUID) -> Optional[Dict[str, Any]]:
        query = f"SELECT * FROM {table} WHERE id = %s AND account_id = %s"
        async with self.conn.cursor() as cur:
            await cur.execute(query, (id, self.account_id))
            return await cur.fetchone()

    async def get_all(self, table: str) -> List[Dict[str, Any]]:
        query = f"SELECT * FROM {table} WHERE account_id = %s"
        async with self.conn.cursor() as cur:
            await cur.execute(query, (self.account_id,))
            return await cur.fetchall()

    async def delete_by_id(self, table: str, id: UUID) -> bool:
        query = f"DELETE FROM {table} WHERE id = %s AND account_id = %s RETURNING id"
        async with self.conn.cursor() as cur:
            await cur.execute(query, (id, self.account_id))
            result = await cur.fetchone()
            return result is not None
