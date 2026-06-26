from pydantic import BaseModel, ConfigDict
from typing import Optional, Any, Dict
from datetime import datetime
from uuid import UUID

class Plan(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    price_cents: int
    interval: str
    razorpay_plan_id: Optional[str] = None
    razorpay_item_id: Optional[str] = None
    limits: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Subscription(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    plan_id: UUID
    razorpay_customer_id: Optional[str] = None
    razorpay_subscription_id: Optional[str] = None
    status: str
    trial_end: Optional[datetime] = None
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UsageRecord(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    subscription_id: Optional[UUID] = None
    metric_name: str
    quantity: int
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Invoice(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    subscription_id: Optional[UUID] = None
    razorpay_invoice_id: Optional[str] = None
    amount_due_cents: int
    amount_paid_cents: int
    status: str
    invoice_pdf_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BillingAuditLog(BaseModel):
    id: UUID
    tenant_id: UUID
    organization_id: UUID
    user_id: Optional[UUID] = None
    action: str
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    details: Dict[str, Any] = {}
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
