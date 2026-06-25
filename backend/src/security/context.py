from contextvars import ContextVar
from typing import List, Optional
from pydantic import BaseModel, Field

class SecurityContext(BaseModel):
    user_id: Optional[str] = None
    tenant_id: Optional[str] = None
    organization_id: Optional[str] = None
    role: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
    request_id: Optional[str] = None
    correlation_id: Optional[str] = None

# Context variable for safe multi-tenant isolation across asynchronous requests
security_context_var: ContextVar[SecurityContext] = ContextVar(
    "security_context", default=SecurityContext()
)

def get_security_context() -> SecurityContext:
    return security_context_var.get()

def set_security_context(context: SecurityContext):
    security_context_var.set(context)
