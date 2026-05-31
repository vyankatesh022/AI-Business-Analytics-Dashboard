import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_unauthenticated_clean_access(client: AsyncClient):
    """Verify that unauthenticated requests to /api/clean are rejected with 403 Forbidden."""
    response = await client.post("/api/clean", json={"data": []})
    
    # HTTPBearer dependency raises 403 when no token is provided
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.asyncio
async def test_unauthenticated_chat_access(client: AsyncClient):
    """Verify that unauthenticated requests to /api/ai/chat are rejected with 403 Forbidden."""
    response = await client.post("/api/ai/chat", json={"message": "hello"})
    
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.asyncio
async def test_unauthenticated_ml_forecast_access(client: AsyncClient):
    """Verify that unauthenticated requests to /api/ml/forecast are rejected with 403 Forbidden."""
    response = await client.post("/api/ml/forecast", json={"historical_data": []})
    
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}
