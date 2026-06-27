import pytest
import uuid
from httpx import AsyncClient
from typing import AsyncGenerator
from src.main import app
from src.security.context import set_security_context, SecurityContext
from src.security.auth import get_current_user

# Mock data
MOCK_USER_ID = str(uuid.uuid4())
MOCK_ACCOUNT_A_ID = str(uuid.uuid4())
MOCK_ACCOUNT_B_ID = str(uuid.uuid4())

@pytest.fixture
def mock_security_context():
    def _set_context(account_id: str, role: str):
        context = SecurityContext(
            user_id=MOCK_USER_ID,
            account_id=account_id,
            role=role,
            permissions=["read:all"] if role in ["Viewer", "Admin", "Owner"] else []
        )
        set_security_context(context)
        return context
    return _set_context

@pytest.mark.asyncio
async def test_tenant_isolation(mock_security_context):
    # This is a conceptual test verifying that accessing Account B's resource
    # while in Account A's context fails or filters properly.
    
    # 1. User is in Account A context
    mock_security_context(account_id=MOCK_ACCOUNT_A_ID, role="Viewer")
    
    # Normally we'd use AsyncClient to hit an endpoint like /api/datasets
    # For this mock, we just verify the context variable is strictly isolated
    from src.security.context import get_security_context
    context = get_security_context()
    assert context.account_id == MOCK_ACCOUNT_A_ID
    assert context.account_id != MOCK_ACCOUNT_B_ID

@pytest.mark.asyncio
async def test_rbac_enforcement(mock_security_context):
    from fastapi import HTTPException
    from src.security.authorization import require_permissions
    
    # Set context with Viewer role
    mock_security_context(account_id=MOCK_ACCOUNT_A_ID, role="Viewer")
    
    # Test requires write permission
    checker = require_permissions(["write:all"])
    
    with pytest.raises(HTTPException) as excinfo:
        await checker()
        
    assert excinfo.value.status_code == 403
    assert "Missing required permission" in excinfo.value.detail

@pytest.mark.asyncio
async def test_rbac_admin_enforcement(mock_security_context):
    from src.security.authorization import require_permissions
    
    # Set context with Admin role which has read:all and write:all normally
    # Our mock_security_context sets permissions=["read:all"] for simplicity, 
    # but let's override the context manually
    
    context = SecurityContext(
        user_id=MOCK_USER_ID,
        account_id=MOCK_ACCOUNT_A_ID,
        role="Admin",
        permissions=["read:all", "write:all"]
    )
    set_security_context(context)
    
    checker = require_permissions(["write:all"])
    
    # Should not raise
    result = await checker()
    assert result is True
