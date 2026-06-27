from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from .models import (
    IntegrationCreate, IntegrationResponse, SyncJobResponse,
    WebhookCreate, WebhookResponse, APIKeyCreate, APIKeyResponse, APIKeyGeneratedResponse
)
from .services import IntegrationService
from .repositories import IntegrationRepository
from ...security.auth import get_current_user, require_role
from ...database.connection import get_db_dsn

router = APIRouter(prefix="/integrations", tags=["Integrations"])

def get_integration_service():
    dsn = get_db_dsn()
    repo = IntegrationRepository(dsn)
    return IntegrationService(repo)

@router.post("/connect", response_model=IntegrationResponse)
async def connect_integration(
    data: IntegrationCreate,
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin", "Manager"]))
):
    account_id = user_context["account_id"]
    return service.connect_integration(account_id, data)

@router.get("", response_model=List[IntegrationResponse])
async def list_integrations(
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(get_current_user)
):
    account_id = user_context["account_id"]
    return service.get_integrations(account_id)

@router.delete("/{integration_id}")
async def disconnect_integration(
    integration_id: UUID,
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    success = service.disconnect_integration(account_id, integration_id)
    if not success:
        raise HTTPException(status_code=404, detail="Integration not found")
    return {"message": "Integration disconnected"}

@router.post("/{integration_id}/sync", response_model=SyncJobResponse)
async def trigger_sync(
    integration_id: UUID,
    sync_type: str = "FULL",
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin", "Manager"]))
):
    account_id = user_context["account_id"]
    return service.trigger_sync(account_id, integration_id, sync_type)

@router.get("/sync-jobs", response_model=List[SyncJobResponse])
async def list_sync_jobs(
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(get_current_user)
):
    account_id = user_context["account_id"]
    return service.get_sync_jobs(account_id)

@router.post("/webhooks")
async def create_webhook(
    data: WebhookCreate,
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    user_id = user_context["user_id"]
    # The response here includes the unencrypted secret ONCE, so no response_model is used
    return service.create_webhook(account_id, user_id, data)

@router.get("/webhooks", response_model=List[WebhookResponse])
async def list_webhooks(
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    return service.get_webhooks(account_id)

@router.post("/api-keys", response_model=APIKeyGeneratedResponse)
async def generate_api_key(
    data: APIKeyCreate,
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    user_id = user_context["user_id"]
    return service.generate_api_key(account_id, user_id, data)

@router.get("/api-keys", response_model=List[APIKeyResponse])
async def list_api_keys(
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    return service.get_api_keys(account_id)

@router.delete("/api-keys/{key_id}")
async def revoke_api_key(
    key_id: UUID,
    service: IntegrationService = Depends(get_integration_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    success = service.revoke_api_key(account_id, key_id)
    if not success:
        raise HTTPException(status_code=404, detail="API Key not found")
    return {"message": "API Key revoked"}
