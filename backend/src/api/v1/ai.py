import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from src.security.rbac import require_permissions
from src.security.context import get_security_context
from src.domains.ai.service import AIService
import time

logger = logging.getLogger(__name__)
router = APIRouter(tags=["ai"])
ai_service = AIService()

class AIChatRequest(BaseModel):
    query: str
    dashboard_id: Optional[str] = None
    conversation_id: Optional[str] = None

@router.post("/ai/chat", dependencies=[Depends(require_permissions(["analytics.read"]))])
async def chat_with_copilot(req: AIChatRequest, request: Request):
    context = get_security_context()
    
    start_time = time.time()
    
    async def generate():
        full_response = ""
        try:
            async for chunk in ai_service.process_chat_query(
                account_id=context.tenant_id,
                user_id=context.user_id,
                query=req.query,
                dashboard_id=req.dashboard_id
            ):
                full_response += chunk
                yield chunk
        finally:
            response_time_ms = int((time.time() - start_time) * 1000)
            # Log audit event after stream finishes
            await ai_service.log_audit_event(
                account_id=context.tenant_id,
                user_id=context.user_id,
                prompt="[MASKED_QUERY]", # Masked for privacy
                token_usage=len(full_response.split()), # Rough estimation for demo
                response_time_ms=response_time_ms
            )

    return StreamingResponse(generate(), media_type="text/plain")
