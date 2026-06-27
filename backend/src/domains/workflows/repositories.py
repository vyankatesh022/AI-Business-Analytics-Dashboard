import psycopg
from psycopg.rows import dict_row
from typing import List, Optional, Any, Dict
from uuid import UUID
import json

class WorkflowRepository:
    def __init__(self, dsn: str):
        self.dsn = dsn

    def create_workflow(self, account_id: UUID, user_id: UUID, workflow_data: dict) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO workflows (
                        account_id, name, description, trigger_type, is_active, nodes, edges, created_by
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    account_id,
                    workflow_data['name'],
                    workflow_data.get('description'),
                    workflow_data.get('trigger_type'),
                    workflow_data.get('is_active', False),
                    json.dumps(workflow_data.get('nodes', [])),
                    json.dumps(workflow_data.get('edges', [])),
                    user_id
                ))
                conn.commit()
                return cur.fetchone()

    def get_workflows(self, account_id: UUID) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT * FROM workflows
                    WHERE account_id = %s
                    ORDER BY created_at DESC;
                """, (account_id,))
                return cur.fetchall()

    def get_workflow(self, account_id: UUID, workflow_id: UUID) -> Optional[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    SELECT * FROM workflows
                    WHERE account_id = %s AND id = %s;
                """, (account_id, workflow_id))
                return cur.fetchone()

    def update_workflow(self, account_id: UUID, workflow_id: UUID, update_data: dict) -> Optional[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                set_clauses = []
                values = []
                
                if 'name' in update_data:
                    set_clauses.append("name = %s")
                    values.append(update_data['name'])
                if 'description' in update_data:
                    set_clauses.append("description = %s")
                    values.append(update_data['description'])
                if 'trigger_type' in update_data:
                    set_clauses.append("trigger_type = %s")
                    values.append(update_data['trigger_type'])
                if 'is_active' in update_data:
                    set_clauses.append("is_active = %s")
                    values.append(update_data['is_active'])
                if 'nodes' in update_data:
                    set_clauses.append("nodes = %s")
                    values.append(json.dumps(update_data['nodes']))
                if 'edges' in update_data:
                    set_clauses.append("edges = %s")
                    values.append(json.dumps(update_data['edges']))
                    
                set_clauses.append("updated_at = CURRENT_TIMESTAMP")
                
                if not set_clauses:
                    return self.get_workflow(account_id, workflow_id)
                    
                query = f"""
                    UPDATE workflows
                    SET {", ".join(set_clauses)}
                    WHERE account_id = %s AND id = %s
                    RETURNING *;
                """
                values.extend([account_id, workflow_id])
                
                cur.execute(query, tuple(values))
                conn.commit()
                return cur.fetchone()

    def delete_workflow(self, account_id: UUID, workflow_id: UUID) -> bool:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    DELETE FROM workflows
                    WHERE account_id = %s AND id = %s;
                """, (account_id, workflow_id))
                conn.commit()
                return cur.rowcount > 0

    def create_execution(self, account_id: UUID, workflow_id: UUID) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO workflow_executions (account_id, workflow_id, status)
                    VALUES (%s, %s, 'PENDING')
                    RETURNING *;
                """, (account_id, workflow_id))
                conn.commit()
                return cur.fetchone()
                
    def update_execution(self, account_id: UUID, execution_id: UUID, status: str, error: Optional[str] = None) -> Optional[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                completed_at_sql = "CURRENT_TIMESTAMP" if status in ('COMPLETED', 'FAILED') else "NULL"
                cur.execute(f"""
                    UPDATE workflow_executions
                    SET status = %s, error = %s, completed_at = {completed_at_sql}
                    WHERE account_id = %s AND id = %s
                    RETURNING *;
                """, (status, error, account_id, execution_id))
                conn.commit()
                return cur.fetchone()

    def get_executions(self, account_id: UUID, workflow_id: Optional[UUID] = None) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                if workflow_id:
                    cur.execute("""
                        SELECT * FROM workflow_executions
                        WHERE account_id = %s AND workflow_id = %s
                        ORDER BY started_at DESC;
                    """, (account_id, workflow_id))
                else:
                    cur.execute("""
                        SELECT * FROM workflow_executions
                        WHERE account_id = %s
                        ORDER BY started_at DESC LIMIT 100;
                    """, (account_id,))
                return cur.fetchall()

    def log_audit(self, account_id: UUID, execution_id: UUID, node_id: str, status: str, duration_ms: int, error_message: Optional[str] = None):
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO workflow_audit_logs (
                        account_id, execution_id, node_id, status, duration_ms, error_message
                    ) VALUES (%s, %s, %s, %s, %s, %s);
                """, (account_id, execution_id, node_id, status, duration_ms, error_message))
                conn.commit()
