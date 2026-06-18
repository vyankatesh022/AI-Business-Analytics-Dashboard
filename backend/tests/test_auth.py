import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_unauthenticated_clean_access(client: AsyncClient):
    """Verify that unauthenticated requests to /api/clean are rejected with 401 Unauthorized."""
    response = await client.post("/api/clean", json={"data": []})
    
    # Custom get_current_user dependency raises 401 when no credentials are provided
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.asyncio
async def test_unauthenticated_chat_access(client: AsyncClient):
    """Verify that unauthenticated requests to /api/ai/chat are rejected with 401 Unauthorized."""
    response = await client.post("/api/ai/chat", json={"message": "hello"})
    
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

@pytest.mark.asyncio
async def test_unauthenticated_ml_forecast_access(client: AsyncClient):
    """Verify that unauthenticated requests to /api/ml/forecast are rejected with 401 Unauthorized."""
    response = await client.post("/api/ml/forecast", json={"historical_data": []})
    
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}
