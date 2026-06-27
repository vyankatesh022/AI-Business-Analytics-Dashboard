from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from .models import WorkflowCreate, WorkflowUpdate, WorkflowResponse, WorkflowExecutionResponse
from .services import WorkflowService
from .repositories import WorkflowRepository
from ...security.auth import get_current_user, require_role
from ...database.connection import get_db_dsn

router = APIRouter(prefix="/workflows", tags=["Workflows"])

def get_workflow_service():
    dsn = get_db_dsn()
    repo = WorkflowRepository(dsn)
    return WorkflowService(repo)

@router.post("", response_model=WorkflowResponse)
async def create_workflow(
    workflow: WorkflowCreate,
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(require_role(["Owner", "Admin", "Manager"]))
):
    account_id = user_context["account_id"]
    user_id = user_context["user_id"]
    return service.create_workflow(account_id, user_id, workflow)

@router.get("", response_model=List[WorkflowResponse])
async def list_workflows(
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(get_current_user)
):
    account_id = user_context["account_id"]
    return service.get_workflows(account_id)

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: UUID,
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(get_current_user)
):
    account_id = user_context["account_id"]
    workflow = service.get_workflow(account_id, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow

@router.patch("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: UUID,
    update_data: WorkflowUpdate,
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(require_role(["Owner", "Admin", "Manager"]))
):
    account_id = user_context["account_id"]
    workflow = service.update_workflow(account_id, workflow_id, update_data)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow

@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: UUID,
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(require_role(["Owner", "Admin"]))
):
    account_id = user_context["account_id"]
    success = service.delete_workflow(account_id, workflow_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return {"message": "Workflow deleted"}

@router.post("/{workflow_id}/trigger")
async def trigger_workflow(
    workflow_id: UUID,
    payload: dict,
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(require_role(["Owner", "Admin", "Manager"]))
):
    account_id = user_context["account_id"]
    try:
        execution = await service.trigger_workflow(account_id, workflow_id, payload)
        return execution
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{workflow_id}/executions", response_model=List[WorkflowExecutionResponse])
async def list_executions(
    workflow_id: UUID,
    service: WorkflowService = Depends(get_workflow_service),
    user_context: dict = Depends(get_current_user)
):
    account_id = user_context["account_id"]
    return service.get_executions(account_id, workflow_id)
