import time
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.config.settings import settings
from backend.utils.logging import logger
from backend.api.router import api_router

# Initialize production-grade FastAPI application
app = FastAPI(
    title="AI Business Analytics Dashboard Backend",
    description="Asynchronous core analytical services for SaaS Business Intelligence.",
    version="0.1.0",
    docs_url=None if settings.ENVIRONMENT == "production" else "/docs",
    redoc_url=None if settings.ENVIRONMENT == "production" else "/redoc"
)

# Mount main API router
app.include_router(api_router, prefix="/api")

# Apply global CORS configuration boundaries
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600
)

@app.middleware("http")
async def add_security_headers_and_timing(request: Request, call_next):
    """Global middleware enforcing AppSec response headers and processing performance timers."""
    start_time = time.time()
    
    # Process request boundary
    try:
        response = await call_next(request)
    except Exception as exc:
        logger.error(f"Unhandled system error in HTTP pipeline: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "An internal system error occurred. Our engineers are investigating."}
        )
        
    process_time = time.time() - start_time
    
    # Inject secure hardening HTTP headers
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    
    return response

# Centralized global exception handler preventing stack leaks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception intercepted: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A critical system event occurred. Please contact technical support."}
    )

@app.get("/health", tags=["System System Monitoring"])
async def health_check():
    """Unrestricted system status and dependency health endpoint."""
    logger.info("Health check boundary invoked.")
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": "0.1.0",
        "timestamp": time.time()
    }
