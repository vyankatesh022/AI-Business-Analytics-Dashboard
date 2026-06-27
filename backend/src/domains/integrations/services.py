from uuid import UUID
from typing import List, Optional
from .models import (
    IntegrationCreate, WebhookCreate, APIKeyCreate,
    APIKeyGeneratedResponse
)
from .repositories import IntegrationRepository
from .security import SecretVaultLayer
import logging

logger = logging.getLogger(__name__)

class IntegrationService:
    def __init__(self, repo: IntegrationRepository):
        self.repo = repo
        self.vault = SecretVaultLayer()

    def connect_integration(self, account_id: UUID, data: IntegrationCreate) -> dict:
        """Connects a new integration, mocking an OAuth flow for testing purposes."""
        # For mock purposes, generate dummy encrypted tokens
        dummy_access = self.vault.encrypt_secret("mock_access_token_123")
        dummy_refresh = self.vault.encrypt_secret("mock_refresh_token_456")
        
        integration_data = data.model_dump()
        integration_data['credentials'] = {
            'encrypted_access_token': dummy_access,
            'encrypted_refresh_token': dummy_refresh
        }
        
        return self.repo.create_integration(account_id, integration_data)

    def get_integrations(self, account_id: UUID) -> List[dict]:
        return self.repo.get_integrations(account_id)

    def disconnect_integration(self, account_id: UUID, integration_id: UUID) -> bool:
        return self.repo.disconnect_integration(account_id, integration_id)

    def get_sync_jobs(self, account_id: UUID) -> List[dict]:
        return self.repo.get_sync_jobs(account_id)

    def trigger_sync(self, account_id: UUID, integration_id: UUID, sync_type: str = "FULL") -> dict:
        """Triggers a data synchronization job for an integration."""
        return self.repo.create_sync_job(account_id, integration_id, sync_type)

    def create_webhook(self, account_id: UUID, user_id: UUID, data: WebhookCreate) -> dict:
        """Creates a new webhook with a generated signing secret."""
        secret = self.vault.generate_webhook_secret()
        encrypted_secret = self.vault.encrypt_secret(secret)
        
        webhook = self.repo.create_webhook(account_id, user_id, data.model_dump(), encrypted_secret)
        # Expose the raw secret ONLY upon creation
        webhook['secret'] = secret
        return webhook

    def get_webhooks(self, account_id: UUID) -> List[dict]:
        return self.repo.get_webhooks(account_id)

    def generate_api_key(self, account_id: UUID, user_id: UUID, data: APIKeyCreate) -> APIKeyGeneratedResponse:
        """Generates a new API key, hashes it, and stores the hash."""
        raw_key = self.vault.generate_api_key()
        key_hash = self.vault.hash_api_key(raw_key)
        
        api_key_record = self.repo.create_api_key(account_id, user_id, data.model_dump(), key_hash)
        
        # Return the raw key just once
        return {
            "api_key": raw_key,
            "key_metadata": api_key_record
        }

    def get_api_keys(self, account_id: UUID) -> List[dict]:
        return self.repo.get_api_keys(account_id)

    def revoke_api_key(self, account_id: UUID, key_id: UUID) -> bool:
        return self.repo.revoke_api_key(account_id, key_id)
