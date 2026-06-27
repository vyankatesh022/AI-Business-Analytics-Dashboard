from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class IntegrationBase(BaseModel):
    provider: str
    category: str
    name: str

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationResponse(IntegrationBase):
    id: UUID
    account_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SyncJobBase(BaseModel):
    integration_id: UUID
    type: str

class SyncJobCreate(SyncJobBase):
    pass

class SyncJobResponse(SyncJobBase):
    id: UUID
    account_id: UUID
    status: str
    records_processed: int
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class WebhookBase(BaseModel):
    name: str
    url: str
    events: List[str]

class WebhookCreate(WebhookBase):
    pass

class WebhookResponse(WebhookBase):
    id: UUID
    account_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class APIKeyBase(BaseModel):
    name: str
    permissions: List[str]

class APIKeyCreate(APIKeyBase):
    pass

class APIKeyResponse(APIKeyBase):
    id: UUID
    account_id: UUID
    key_hash: str
    status: str
    last_used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class APIKeyGeneratedResponse(BaseModel):
    api_key: str
    key_metadata: APIKeyResponse
