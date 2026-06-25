import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from ..security.context import get_security_context, set_security_context

logger = logging.getLogger(__name__)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        return response

class ContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate a unique request ID and correlation ID
        request_id = str(uuid.uuid4())
        correlation_id = request.headers.get("X-Correlation-ID", request_id)
        
        # Initialize context for this request
        context = get_security_context()
        new_context = context.copy(update={
            "request_id": request_id,
            "correlation_id": correlation_id
        })
        set_security_context(new_context)
        
        # We can add request_id to response headers if desired
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
