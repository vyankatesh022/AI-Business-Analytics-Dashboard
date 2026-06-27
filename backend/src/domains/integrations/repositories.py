import psycopg
from psycopg.rows import dict_row
from typing import List, Optional, Any, Dict
from uuid import UUID
import json

class IntegrationRepository:
    def __init__(self, dsn: str):
        self.dsn = dsn

    def create_integration(self, account_id: UUID, data: dict) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO integrations (account_id, provider, category, name, status)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    account_id,
                    data['provider'],
                    data['category'],
                    data['name'],
                    'CONNECTED'
                ))
                integration = cur.fetchone()
                
                # Also insert mock credentials for demo purposes
                if 'credentials' in data:
                    cur.execute("""
                        INSERT INTO integration_credentials (account_id, integration_id, encrypted_access_token)
                        VALUES (%s, %s, %s);
                    """, (account_id, integration['id'], data['credentials'].get('encrypted_access_token')))
                
                conn.commit()
                return integration

    def get_integrations(self, account_id: UUID) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT * FROM integrations
                    WHERE account_id = %s
                    ORDER BY created_at DESC;
                """, (account_id,))
                return cur.fetchall()
                
    def disconnect_integration(self, account_id: UUID, integration_id: UUID) -> bool:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM integrations
                    WHERE account_id = %s AND id = %s;
                """, (account_id, integration_id))
                conn.commit()
                return cur.rowcount > 0

    def get_sync_jobs(self, account_id: UUID) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT * FROM integration_sync_jobs
                    WHERE account_id = %s
                    ORDER BY started_at DESC LIMIT 50;
                """, (account_id,))
                return cur.fetchall()

    def create_sync_job(self, account_id: UUID, integration_id: UUID, sync_type: str) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO integration_sync_jobs (account_id, integration_id, type, status)
                    VALUES (%s, %s, %s, 'PENDING')
                    RETURNING *;
                """, (account_id, integration_id, sync_type))
                conn.commit()
                return cur.fetchone()

    def update_sync_job_status(self, account_id: UUID, job_id: UUID, status: str, records: int = 0) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                completed_at_sql = "CURRENT_TIMESTAMP" if status in ('COMPLETED', 'FAILED') else "NULL"
                cur.execute(f"""
                    UPDATE integration_sync_jobs
                    SET status = %s, records_processed = records_processed + %s, completed_at = {completed_at_sql}
                    WHERE account_id = %s AND id = %s
                    RETURNING *;
                """, (status, records, account_id, job_id))
                conn.commit()
                return cur.fetchone()

    def create_webhook(self, account_id: UUID, user_id: UUID, data: dict, encrypted_secret: str) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO webhooks (account_id, name, url, events, encrypted_secret, created_by)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    account_id,
                    data['name'],
                    data['url'],
                    json.dumps(data.get('events', [])),
                    encrypted_secret,
                    user_id
                ))
                conn.commit()
                return cur.fetchone()

    def get_webhooks(self, account_id: UUID) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT id, account_id, name, url, events, status, created_at, updated_at 
                    FROM webhooks
                    WHERE account_id = %s
                    ORDER BY created_at DESC;
                """, (account_id,))
                return cur.fetchall()

    def create_api_key(self, account_id: UUID, user_id: UUID, data: dict, key_hash: str) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO api_keys (account_id, name, key_hash, permissions, created_by)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    account_id,
                    data['name'],
                    key_hash,
                    json.dumps(data.get('permissions', [])),
                    user_id
                ))
                conn.commit()
                return cur.fetchone()

    def get_api_keys(self, account_id: UUID) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT id, account_id, name, key_hash, permissions, status, last_used_at, expires_at, created_at
                    FROM api_keys
                    WHERE account_id = %s
                    ORDER BY created_at DESC;
                """, (account_id,))
                return cur.fetchall()
                
    def revoke_api_key(self, account_id: UUID, key_id: UUID) -> bool:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE api_keys
                    SET status = 'REVOKED'
                    WHERE account_id = %s AND id = %s;
                """, (account_id, key_id))
                conn.commit()
                return cur.rowcount > 0
