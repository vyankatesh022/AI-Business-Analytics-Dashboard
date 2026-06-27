from contextvars import ContextVar
from typing import List, Optional
from pydantic import BaseModel, Field

class SecurityContext(BaseModel):
    supabase_user_id: Optional[str] = None
    user_id: Optional[str] = None
    account_id: Optional[str] = None
    role: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
    request_id: Optional[str] = None

# Context variable for safe account isolation across asynchronous requests
security_context_var: ContextVar[SecurityContext] = ContextVar(
    "security_context", default=SecurityContext()
)

def get_security_context() -> SecurityContext:
    return security_context_var.get()

def set_security_context(context: SecurityContext):
    security_context_var.set(context)
