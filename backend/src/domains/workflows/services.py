from uuid import UUID
from typing import List, Optional
from .models import WorkflowCreate, WorkflowUpdate
from .repositories import WorkflowRepository
from arq import create_pool
from arq.connections import RedisSettings
import os
import json

class WorkflowService:
    def __init__(self, repo: WorkflowRepository):
        self.repo = repo
        redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
        self.redis_settings = RedisSettings.from_dsn(redis_url)

    async def get_redis_pool(self):
        return await create_pool(self.redis_settings)

    def create_workflow(self, account_id: UUID, user_id: UUID, data: WorkflowCreate) -> dict:
        return self.repo.create_workflow(account_id, user_id, data.model_dump())

    def get_workflows(self, account_id: UUID) -> List[dict]:
        return self.repo.get_workflows(account_id)

    def get_workflow(self, account_id: UUID, workflow_id: UUID) -> Optional[dict]:
        return self.repo.get_workflow(account_id, workflow_id)

    def update_workflow(self, account_id: UUID, workflow_id: UUID, data: WorkflowUpdate) -> Optional[dict]:
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            return self.get_workflow(account_id, workflow_id)
        return self.repo.update_workflow(account_id, workflow_id, update_data)

    def delete_workflow(self, account_id: UUID, workflow_id: UUID) -> bool:
        return self.repo.delete_workflow(account_id, workflow_id)

    async def trigger_workflow(self, account_id: UUID, workflow_id: UUID, trigger_payload: dict) -> dict:
        # Check if workflow is active
        wf = self.get_workflow(account_id, workflow_id)
        if not wf or not wf.get('is_active'):
            raise ValueError("Workflow is not active or not found.")

        # Create execution record
        execution = self.repo.create_execution(account_id, workflow_id)
        
        # Enqueue the workflow execution job
        redis = await self.get_redis_pool()
        await redis.enqueue_job(
            'execute_workflow_dag',
            account_id=str(account_id),
            workflow_id=str(workflow_id),
            execution_id=str(execution['id']),
            trigger_payload=trigger_payload
        )
        
        return execution

    def get_executions(self, account_id: UUID, workflow_id: Optional[UUID] = None) -> List[dict]:
        return self.repo.get_executions(account_id, workflow_id)
