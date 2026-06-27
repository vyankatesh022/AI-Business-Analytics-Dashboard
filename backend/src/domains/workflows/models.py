from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime

class WorkflowNodeBase(BaseModel):
    id: str
    type: str # trigger, condition, action, wait, branch
    position: Dict[str, float]
    data: Dict[str, Any]

class WorkflowEdgeBase(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = False
    nodes: List[WorkflowNodeBase] = []
    edges: List[WorkflowEdgeBase] = []
    trigger_type: Optional[str] = None

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    nodes: Optional[List[WorkflowNodeBase]] = None
    edges: Optional[List[WorkflowEdgeBase]] = None
    trigger_type: Optional[str] = None

class WorkflowResponse(WorkflowBase):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class WorkflowExecutionBase(BaseModel):
    workflow_id: UUID
    status: str = "PENDING" # PENDING, RUNNING, COMPLETED, FAILED, RETRYING
    error: Optional[str] = None

class WorkflowExecutionCreate(WorkflowExecutionBase):
    pass

class WorkflowExecutionUpdate(BaseModel):
    status: Optional[str] = None
    error: Optional[str] = None

class WorkflowExecutionResponse(WorkflowExecutionBase):
    id: UUID
    tenant_id: UUID
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class WorkflowAuditLogBase(BaseModel):
    execution_id: UUID
    node_id: str
    status: str # SUCCESS, FAILED
    duration_ms: int
    error_message: Optional[str] = None

class WorkflowAuditLogCreate(WorkflowAuditLogBase):
    pass

class WorkflowAuditLogResponse(WorkflowAuditLogBase):
    id: UUID
    tenant_id: UUID
    executed_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
