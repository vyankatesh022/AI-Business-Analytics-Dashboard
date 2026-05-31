import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Verify that the health route returns a successful status payload containing environment keys."""
    response = await client.get("/health")

    # Assert status code is 200 OK
    assert response.status_code == 200

    # Assert payload shape
    payload = response.json()
    assert payload["status"] == "healthy"
    assert "environment" in payload
    assert "version" in payload
    assert "timestamp" in payload


@pytest.mark.asyncio
async def test_security_headers(client: AsyncClient):
    """Verify that the HTTP pipeline injects secure AppSec response headers."""
    response = await client.get("/health")
    assert response.status_code == 200

    # Confirm mandatory security headers
    headers = response.headers
    assert headers["X-Frame-Options"] == "DENY"
    assert headers["X-Content-Type-Options"] == "nosniff"
    assert headers["X-XSS-Protection"] == "1; mode=block"
    assert "Content-Security-Policy" in headers
    assert "Strict-Transport-Security" in headers
    assert "X-Process-Time" in headers
