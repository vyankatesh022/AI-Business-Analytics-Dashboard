import pytest
from httpx import AsyncClient
from uuid import uuid4
import json

# Setup some mock dependencies if possible, or use the test app.
# Assuming standard pytest setup with an async test client and test database.

@pytest.mark.asyncio
async def test_analytics_tenant_isolation(client: AsyncClient, test_user_headers, test_account_id, other_account_id, db_conn):
    """Test that a user can only read analytics for their own account."""
    # Create a dashboard in the test account
    dashboard_data = {
        "name": "Test Dashboard",
        "description": "Tenant Isolation Test",
        "layout": []
    }
    
    # User tries to create dashboard
    response = await client.post("/api/v1/analytics/dashboards", json=dashboard_data, headers=test_user_headers)
    assert response.status_code == 200
    dashboard_id = response.json()["id"]
    
    # Directly modify DB to set it to another account to simulate unauthorized access attempt
    await db_conn.execute("UPDATE dashboards SET account_id = %s WHERE id = %s", (other_account_id, dashboard_id))
    
    # Try to access the dashboard
    response = await client.get(f"/api/v1/analytics/dashboards/{dashboard_id}", headers=test_user_headers)
    assert response.status_code == 404 # Should not be found since it belongs to another account

@pytest.mark.asyncio
async def test_analytics_rbac_enforcement(client: AsyncClient, test_user_headers_no_analytics):
    """Test that user without analytics.read permission cannot access the endpoints."""
    response = await client.get("/api/v1/analytics/dashboards", headers=test_user_headers_no_analytics)
    assert response.status_code == 403
    assert "analytics.read" in response.text

@pytest.mark.asyncio
async def test_analytics_engine_cache(client: AsyncClient, test_user_headers):
    """Test that analytics engine correctly caches queries."""
    # Create a KPI definition
    kpi_data = {
        "name": "Test KPI",
        "dataset_id": str(uuid4()),
        "metric_type": "sum",
        "metric_column": "revenue"
    }
    response = await client.post("/api/v1/analytics/kpis", json=kpi_data, headers=test_user_headers)
    assert response.status_code == 200
    kpi_id = response.json()["id"]
    
    # First request: should take longer and populate cache
    import time
    start_time = time.time()
    res1 = await client.get(f"/api/v1/analytics/kpis/{kpi_id}/calculate", headers=test_user_headers)
    assert res1.status_code == 200
    duration1 = time.time() - start_time
    
    # Second request: should be extremely fast (cache hit)
    start_time = time.time()
    res2 = await client.get(f"/api/v1/analytics/kpis/{kpi_id}/calculate", headers=test_user_headers)
    assert res2.status_code == 200
    duration2 = time.time() - start_time
    
    # The first calculation takes ~0.2s due to our mock asyncio.sleep(0.2)
    # The second should be practically instantaneous < 0.05s
    assert duration2 < duration1
    assert res1.json() == res2.json()

@pytest.mark.asyncio
async def test_analytics_audit_logs_created(client: AsyncClient, test_user_headers, db_conn):
    """Test that analytics reads generate audit logs."""
    # Get initial log count
    initial_logs = await db_conn.execute_and_fetch_all("SELECT id FROM audit_logs WHERE action = 'list_dashboards'")
    initial_count = len(initial_logs)
    
    # Perform read action
    await client.get("/api/v1/analytics/dashboards", headers=test_user_headers)
    
    # Get new log count
    new_logs = await db_conn.execute_and_fetch_all("SELECT id FROM audit_logs WHERE action = 'list_dashboards'")
    assert len(new_logs) == initial_count + 1
