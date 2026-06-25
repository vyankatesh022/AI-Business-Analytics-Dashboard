import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.security.context import get_security_context, set_security_context, SecurityContext

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_missing_auth_headers_on_protected_route():
    # Calling the protected route without token
    response = client.get("/api/v1/analytics")
    # Middleware or Depends throws 403 HTTPBearer
    assert response.status_code == 403

def test_security_context_isolation():
    # Test that setting context in one "request" or function doesn't bleed.
    # In a real async test, we would test contextvars concurrency.
    ctx1 = SecurityContext(user_id="user1", tenant_id="tenant1")
    set_security_context(ctx1)
    
    assert get_security_context().user_id == "user1"
    
    ctx2 = SecurityContext(user_id="user2", tenant_id="tenant2")
    set_security_context(ctx2)
    
    # In synchronous sequential flow, it overwrites.
    assert get_security_context().user_id == "user2"

# In a complete test suite, we would mock Supabase client and Database cursor
# to test `verify_tenant_isolation` and `require_permissions` logic.
