from fastapi import APIRouter, Request, HTTPException, Depends
import os
import logging
from src.services.razorpay_service import RazorpayService
from src.services.billing_service import BillingService
from src.repositories.billing_repository import BillingRepository

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/webhooks", tags=["webhooks"])

def get_billing_service() -> BillingService:
    dsn = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    repo = BillingRepository(dsn)
    return BillingService(repo)

@router.post("/razorpay")
async def razorpay_webhook(request: Request, service: BillingService = Depends(get_billing_service)):
    payload = await request.body()
    sig_header = request.headers.get("x-razorpay-signature")
    secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET")

    if not sig_header or not secret:
        raise HTTPException(status_code=400, detail="Missing signature or secret")

    try:
        event = RazorpayService.verify_webhook(payload, sig_header, secret)
    except ValueError as e:
        logger.warning(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    try:
        service.process_webhook(event)
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Error processing event")

    return {"status": "success"}
