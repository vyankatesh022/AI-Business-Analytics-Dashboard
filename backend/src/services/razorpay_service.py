import razorpay
import os
import logging
import hmac
import hashlib
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Initialize Razorpay
razorpay_key_id = os.environ.get("RAZORPAY_KEY_ID")
razorpay_key_secret = os.environ.get("RAZORPAY_KEY_SECRET")

client = None
if razorpay_key_id and razorpay_key_secret:
    client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

class RazorpayService:
    @staticmethod
    def create_customer(email: str, name: str, contact: str = "", notes: Dict[str, str] = None) -> str:
        try:
            if not client:
                raise ValueError("Razorpay client not initialized")
            customer = client.customer.create({
                "name": name,
                "email": email,
                "contact": contact,
                "notes": notes or {}
            })
            return customer['id']
        except Exception as e:
            logger.error(f"Failed to create Razorpay customer: {e}")
            raise

    @staticmethod
    def create_subscription(
        plan_id: str,
        total_count: int,
        customer_id: str,
        notes: Dict[str, str] = None
    ) -> Dict[str, Any]:
        try:
            if not client:
                raise ValueError("Razorpay client not initialized")
            subscription = client.subscription.create({
                "plan_id": plan_id,
                "total_count": total_count,
                "customer_notify": 1,
                "customer_id": customer_id,
                "notes": notes or {}
            })
            return subscription
        except Exception as e:
            logger.error(f"Failed to create Razorpay subscription: {e}")
            raise

    @staticmethod
    def verify_webhook(payload: bytes, sig_header: str, secret: str) -> Dict[str, Any]:
        """
        Verifies Razorpay webhook signature and returns the payload if valid.
        """
        import json
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_signature, sig_header):
            raise ValueError("Invalid signature")
        
        return json.loads(payload.decode('utf-8'))
