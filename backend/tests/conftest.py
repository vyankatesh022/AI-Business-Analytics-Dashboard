import asyncio
import pytest
import pytest_asyncio
from typing import AsyncGenerator, Generator
from httpx import ASGITransport, AsyncClient
from backend.main import app


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create a unified session-scoped event loop for async unit checks."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="module")
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Provide a secure asynchronous test HTTP client targeting the main FastAPI instance."""
    # Wrapping app using ASGITransport as mandated in HTTPX 0.28+
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as async_client:
        yield async_client
