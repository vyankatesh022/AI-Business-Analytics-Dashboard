import os
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import psycopg
from psycopg_pool import AsyncConnectionPool

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/postgres"
)

# Initialize the connection pool
try:
    pool = AsyncConnectionPool(
        conninfo=DATABASE_URL,
        min_size=1,
        max_size=10,
        open=False, # We will open it manually or lazily
    )
except Exception as e:
    logger.error(f"Failed to initialize database pool: {e}")
    pool = None

@asynccontextmanager
async def get_db_connection() -> AsyncGenerator[psycopg.AsyncConnection, None]:
    """
    Yields an asynchronous connection from the pool.
    """
    if pool is None:
        raise RuntimeError("Database pool is not initialized.")
        
    async with pool.connection() as conn:
        yield conn

async def open_pool():
    if pool:
        await pool.open()

async def close_pool():
    if pool:
        await pool.close()
