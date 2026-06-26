import os
from uuid import UUID
from typing import List, Dict, Any, Optional
from cryptography.fernet import Fernet
from .repositories import WorkspaceRepository
from .models import (
    WorkspaceFolderCreate, WorkspaceDatasetCreate, WorkspaceConnectionCreate
)

# For dev purposes, if ENCRYPTION_KEY is not set, we use a default key.
# In production, this must be injected securely.
DEFAULT_KEY = Fernet.generate_key()
ENCRYPTION_KEY = os.environ.get("WORKSPACE_ENCRYPTION_KEY", DEFAULT_KEY)
fernet = Fernet(ENCRYPTION_KEY)

class WorkspaceService:
    def __init__(self, repository: WorkspaceRepository):
        self.repo = repository

    def _encrypt(self, text: str) -> str:
        if not text:
            return text
        return fernet.encrypt(text.encode('utf-8')).decode('utf-8')

    def _decrypt(self, encrypted_text: str) -> str:
        if not encrypted_text:
            return encrypted_text
        return fernet.decrypt(encrypted_text.encode('utf-8')).decode('utf-8')

    def create_folder(self, tenant_id: UUID, organization_id: UUID, owner_id: UUID, folder_in: WorkspaceFolderCreate) -> dict:
        folder_data = folder_in.model_dump()
        folder = self.repo.create_folder(tenant_id, organization_id, owner_id, folder_data)
        self.repo.log_activity(
            tenant_id, organization_id, owner_id, 
            entity_type="FOLDER", entity_id=folder['id'], action="CREATED", 
            details={"name": folder['name']}
        )
        return folder

    def get_folders(self, tenant_id: UUID, organization_id: UUID, parent_id: Optional[UUID] = None) -> List[dict]:
        return self.repo.get_folders(tenant_id, organization_id, parent_id)

    def create_dataset(self, tenant_id: UUID, organization_id: UUID, owner_id: UUID, dataset_in: WorkspaceDatasetCreate) -> dict:
        dataset_data = dataset_in.model_dump()
        dataset = self.repo.create_dataset(tenant_id, organization_id, owner_id, dataset_data)
        self.repo.log_activity(
            tenant_id, organization_id, owner_id, 
            entity_type="DATASET", entity_id=dataset['id'], action="CREATED", 
            details={"name": dataset['name']}
        )
        return dataset

    def get_datasets(self, tenant_id: UUID, organization_id: UUID, folder_id: Optional[UUID] = None) -> List[dict]:
        return self.repo.get_datasets(tenant_id, organization_id, folder_id)

    def create_connection(self, tenant_id: UUID, organization_id: UUID, owner_id: UUID, connection_in: WorkspaceConnectionCreate) -> dict:
        connection_data = connection_in.model_dump()
        # Encrypt password
        if connection_data.get('password'):
            connection_data['credentials_encrypted'] = self._encrypt(connection_data['password'])
            del connection_data['password']

        connection = self.repo.create_connection(tenant_id, organization_id, owner_id, connection_data)
        
        # Don't return encrypted credentials to the frontend
        if 'credentials_encrypted' in connection:
            del connection['credentials_encrypted']

        self.repo.log_activity(
            tenant_id, organization_id, owner_id, 
            entity_type="CONNECTION", entity_id=connection['id'], action="CREATED", 
            details={"name": connection['name'], "type": connection['type']}
        )
        return connection

    def get_connections(self, tenant_id: UUID, organization_id: UUID, folder_id: Optional[UUID] = None) -> List[dict]:
        connections = self.repo.get_connections(tenant_id, organization_id, folder_id)
        # Strip credentials before returning
        for conn in connections:
            if 'credentials_encrypted' in conn:
                del conn['credentials_encrypted']
        return connections
