from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
import os

from src.repositories.billing_repository import BillingRepository
from src.services.billing_service import BillingService

router = APIRouter(prefix="/billing", tags=["billing"])

def get_billing_service() -> BillingService:
    dsn = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    repo = BillingRepository(dsn)
    return BillingService(repo)

class CheckoutRequest(BaseModel):
    tenant_id: UUID
    organization_id: UUID
    email: str
    razorpay_plan_id: str

class PortalRequest(BaseModel):
    tenant_id: UUID
    return_url: str

@router.get("/plans")
def get_plans(service: BillingService = Depends(get_billing_service)):
    return service.get_plans()

@router.get("/subscription/{tenant_id}")
def get_subscription(tenant_id: UUID, service: BillingService = Depends(get_billing_service)):
    sub = service.get_subscription(tenant_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub

@router.post("/create-subscription")
def create_subscription(req: CheckoutRequest, service: BillingService = Depends(get_billing_service)):
    try:
        data = service.create_subscription(
            tenant_id=req.tenant_id,
            organization_id=req.organization_id,
            email=req.email,
            razorpay_plan_id=req.razorpay_plan_id
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/portal-session")
def create_portal_session(req: PortalRequest, service: BillingService = Depends(get_billing_service)):
    try:
        url = service.create_billing_portal_session(
            tenant_id=req.tenant_id,
            return_url=req.return_url
        )
        return {"url": url}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
