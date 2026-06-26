import psycopg
from psycopg.rows import dict_row
from typing import List, Optional, Any, Dict
from uuid import UUID

class BillingRepository:
    def __init__(self, dsn: str):
        self.dsn = dsn

    def get_plans(self) -> List[Dict[str, Any]]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM plans ORDER BY price_cents ASC;")
                return cur.fetchall()

    def get_plan_by_razorpay_item_id(self, razorpay_item_id: str) -> Optional[Dict[str, Any]]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM plans WHERE razorpay_item_id = %s;", (razorpay_item_id,))
                return cur.fetchone()

    def get_subscription(self, tenant_id: UUID) -> Optional[Dict[str, Any]]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT s.*, p.name as plan_name, p.limits as plan_limits
                    FROM subscriptions s
                    JOIN plans p ON s.plan_id = p.id
                    WHERE s.tenant_id = %s
                    ORDER BY s.created_at DESC
                    LIMIT 1;
                """, (tenant_id,))
                return cur.fetchone()

    def get_subscription_by_razorpay_id(self, razorpay_subscription_id: str) -> Optional[Dict[str, Any]]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT * FROM subscriptions WHERE razorpay_subscription_id = %s LIMIT 1;
                """, (razorpay_subscription_id,))
                return cur.fetchone()

    def create_or_update_subscription(
        self,
        tenant_id: UUID,
        organization_id: UUID,
        plan_id: UUID,
        razorpay_customer_id: str,
        razorpay_subscription_id: str,
        status: str,
        current_period_start: str,
        current_period_end: str,
        cancel_at_period_end: bool
    ) -> Dict[str, Any]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                # Upsert based on razorpay_subscription_id
                cur.execute("""
                    INSERT INTO subscriptions (
                        tenant_id, organization_id, plan_id, razorpay_customer_id, razorpay_subscription_id,
                        status, current_period_start, current_period_end, cancel_at_period_end
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET -- Note: ID is PK, we would need to check existence if we don't have ID.
                        plan_id = EXCLUDED.plan_id,
                        status = EXCLUDED.status,
                        current_period_start = EXCLUDED.current_period_start,
                        current_period_end = EXCLUDED.current_period_end,
                        cancel_at_period_end = EXCLUDED.cancel_at_period_end,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING *;
                """, (
                    tenant_id, organization_id, plan_id, razorpay_customer_id, razorpay_subscription_id,
                    status, current_period_start, current_period_end, cancel_at_period_end
                ))
                # Wait, ON CONFLICT requires a unique constraint. We don't have a unique constraint on razorpay_subscription_id yet.
                # Let's do a SELECT then INSERT or UPDATE to be safe without altering schema right now.
                pass # Re-writing logic below
                
        # Actually doing a separate transaction
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT id FROM subscriptions WHERE razorpay_subscription_id = %s", (razorpay_subscription_id,))
                existing = cur.fetchone()
                
                if existing:
                    cur.execute("""
                        UPDATE subscriptions SET
                            plan_id = %s,
                            status = %s,
                            current_period_start = %s,
                            current_period_end = %s,
                            cancel_at_period_end = %s,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE razorpay_subscription_id = %s
                        RETURNING *;
                    """, (plan_id, status, current_period_start, current_period_end, cancel_at_period_end, razorpay_subscription_id))
                    conn.commit()
                    return cur.fetchone()
                else:
                    cur.execute("""
                        INSERT INTO subscriptions (
                            tenant_id, organization_id, plan_id, razorpay_customer_id, razorpay_subscription_id,
                            status, current_period_start, current_period_end, cancel_at_period_end
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING *;
                    """, (tenant_id, organization_id, plan_id, razorpay_customer_id, razorpay_subscription_id,
                          status, current_period_start, current_period_end, cancel_at_period_end))
                    conn.commit()
                    return cur.fetchone()

    def record_usage(self, tenant_id: UUID, organization_id: UUID, subscription_id: UUID, metric_name: str, quantity: int):
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO usage_records (tenant_id, organization_id, subscription_id, metric_name, quantity)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING *;
                """, (tenant_id, organization_id, subscription_id, metric_name, quantity))
                conn.commit()
                return cur.fetchone()

    def get_usage(self, tenant_id: UUID, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT metric_name, SUM(quantity) as total_quantity
                    FROM usage_records
                    WHERE tenant_id = %s AND recorded_at >= %s AND recorded_at <= %s
                    GROUP BY metric_name;
                """, (tenant_id, start_date, end_date))
                return cur.fetchall()

    def create_or_update_invoice(self, tenant_id: UUID, organization_id: UUID, subscription_id: UUID, razorpay_invoice_id: str, amount_due_cents: int, amount_paid_cents: int, status: str, invoice_pdf_url: str):
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT id FROM invoices WHERE razorpay_invoice_id = %s", (razorpay_invoice_id,))
                existing = cur.fetchone()
                
                if existing:
                    cur.execute("""
                        UPDATE invoices SET
                            amount_due_cents = %s,
                            amount_paid_cents = %s,
                            status = %s,
                            invoice_pdf_url = %s,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE razorpay_invoice_id = %s
                        RETURNING *;
                    """, (amount_due_cents, amount_paid_cents, status, invoice_pdf_url, razorpay_invoice_id))
                    conn.commit()
                    return cur.fetchone()
                else:
                    cur.execute("""
                        INSERT INTO invoices (
                            tenant_id, organization_id, subscription_id, razorpay_invoice_id,
                            amount_due_cents, amount_paid_cents, status, invoice_pdf_url
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING *;
                    """, (tenant_id, organization_id, subscription_id, razorpay_invoice_id, amount_due_cents, amount_paid_cents, status, invoice_pdf_url))
                    conn.commit()
                    return cur.fetchone()

    def get_invoices(self, tenant_id: UUID) -> List[Dict[str, Any]]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT * FROM invoices
                    WHERE tenant_id = %s
                    ORDER BY created_at DESC;
                """, (tenant_id,))
                return cur.fetchall()

    def log_audit(self, tenant_id: UUID, organization_id: UUID, user_id: UUID, action: str, target_type: str, target_id: str, details: Dict[str, Any]):
        import json
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO billing_audit_logs (
                        tenant_id, organization_id, user_id, action, target_type, target_id, details
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s);
                """, (tenant_id, organization_id, user_id, action, target_type, target_id, json.dumps(details)))
                conn.commit()
