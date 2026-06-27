import os
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import psycopg
from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/postgres"
)
print(f"!!! DATABASE_URL USED BY BACKEND IS: {DATABASE_URL} !!!")

# Initialize the connection pool
try:
    pool = AsyncConnectionPool(
        conninfo=DATABASE_URL,
        min_size=1,
        max_size=10,
        open=False, # We will open it manually or lazily
        kwargs={"row_factory": dict_row}
    )
except Exception as e:
    logger.error(f"Failed to initialize database pool: {e}")
    pool = None

class DatabaseConnectionWrapper:
    def __init__(self, conn: psycopg.AsyncConnection):
        self.conn = conn

    async def execute_and_fetch_all(self, query: str, params: tuple = None):
        cur = await self.conn.execute(query, params)
        return await cur.fetchall()

    async def execute_and_fetch_one(self, query: str, params: tuple = None):
        cur = await self.conn.execute(query, params)
        return await cur.fetchone()

    async def execute(self, query: str, params: tuple = None):
        return await self.conn.execute(query, params)
        
    def cursor(self, **kwargs):
        return self.conn.cursor(**kwargs)
        
    async def commit(self):
        await self.conn.commit()
        
    async def rollback(self):
        await self.conn.rollback()

async def get_db_connection() -> AsyncGenerator[DatabaseConnectionWrapper, None]:
    """
    Yields an asynchronous connection wrapper from the pool.
    """
    if pool is None:
        raise RuntimeError("Database pool is not initialized.")
        
    async with pool.connection() as conn:
        yield DatabaseConnectionWrapper(conn)

async def open_pool():
    if pool:
        await pool.open()

async def close_pool():
    if pool:
        await pool.close()
