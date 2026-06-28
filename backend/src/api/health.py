import os
from fastapi import APIRouter, Depends, Response, status

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check(response: Response):
    """
    Basic health check endpoint for Docker and Load Balancers.
    """
    response.status_code = status.HTTP_200_OK
    return {
        "status": "healthy",
        "environment": os.getenv("ENV", "local")
    }
