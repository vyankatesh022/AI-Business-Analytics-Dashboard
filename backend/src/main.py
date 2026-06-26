import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from .api.middleware import SecurityHeadersMiddleware, ContextMiddleware
from .database.connection import open_pool, close_pool
from .security.auth import get_current_user
from .security.tenant import verify_tenant_isolation
from .security.rbac import require_permissions
from .security.audit import log_audit_event
from .security.context import get_security_context
from .api.v1.billing import router as billing_router
from .api.v1.webhooks import router as webhooks_router
from .api.v1.workspace import router as workspace_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Enterprise AI Platform Backend...")
    await open_pool()
    yield
    # Shutdown
    logger.info("Shutting down Enterprise AI Platform Backend...")
    await close_pool()

app = FastAPI(
    title="Enterprise AI Analytics Platform",
    description="Core API with Authentication, RBAC, and Tenant Isolation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ContextMiddleware)

# Register Routers
app.include_router(billing_router, prefix="/api/v1")
app.include_router(webhooks_router, prefix="/api/v1")
app.include_router(workspace_router, prefix="/api/v1")

# Example Protected Route
@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "message": "Platform is healthy"}

@app.get("/api/v1/analytics", dependencies=[Depends(require_permissions(["analytics.read"]))])
async def get_analytics(request: Request):
    """
    Protected route requiring analytics.read permission and tenant isolation.
    """
    context = get_security_context()
    
    # Audit logging example (non-blocking)
    await log_audit_event(
        action="read_analytics",
        resource="analytics",
        request=request
    )
    
    return {
        "status": "success",
        "data": {
            "tenant_id": context.tenant_id,
            "organization_id": context.organization_id,
            "metrics": "Sample Metrics"
        }
    }
