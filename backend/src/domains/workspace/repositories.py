import psycopg
from psycopg.rows import dict_row
from typing import List, Optional, Any, Dict
from uuid import UUID
import json

class WorkspaceRepository:
    def __init__(self, dsn: str):
        self.dsn = dsn

    def create_folder(self, tenant_id: UUID, organization_id: UUID, owner_id: UUID, folder_data: dict) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO workspace_folders (
                        tenant_id, organization_id, parent_id, name, color_label, description, tags, owner_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    tenant_id, organization_id,
                    folder_data.get('parent_id'),
                    folder_data['name'],
                    folder_data.get('color_label'),
                    folder_data.get('description'),
                    folder_data.get('tags', []),
                    owner_id
                ))
                conn.commit()
                return cur.fetchone()

    def get_folders(self, tenant_id: UUID, organization_id: UUID, parent_id: Optional[UUID] = None) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                if parent_id:
                    cur.execute("""
                        SELECT * FROM workspace_folders
                        WHERE tenant_id = %s AND organization_id = %s AND parent_id = %s AND deleted_at IS NULL
                        ORDER BY name ASC;
                    """, (tenant_id, organization_id, parent_id))
                else:
                    cur.execute("""
                        SELECT * FROM workspace_folders
                        WHERE tenant_id = %s AND organization_id = %s AND parent_id IS NULL AND deleted_at IS NULL
                        ORDER BY name ASC;
                    """, (tenant_id, organization_id))
                return cur.fetchall()

    def update_folder(self, tenant_id: UUID, organization_id: UUID, folder_id: UUID, update_data: dict) -> Optional[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                set_clauses = []
                values = []
                for k, v in update_data.items():
                    set_clauses.append(f"{k} = %s")
                    values.append(v)
                
                if not set_clauses:
                    return None

                set_clauses.append("updated_at = NOW()")
                
                query = f"""
                    UPDATE workspace_folders
                    SET {", ".join(set_clauses)}
                    WHERE id = %s AND tenant_id = %s AND organization_id = %s AND deleted_at IS NULL
                    RETURNING *;
                """
                values.extend([folder_id, tenant_id, organization_id])
                
                cur.execute(query, tuple(values))
                conn.commit()
                return cur.fetchone()

    def delete_folder(self, tenant_id: UUID, organization_id: UUID, folder_id: UUID) -> bool:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE workspace_folders
                    SET deleted_at = NOW()
                    WHERE id = %s AND tenant_id = %s AND organization_id = %s AND deleted_at IS NULL;
                """, (folder_id, tenant_id, organization_id))
                conn.commit()
                return cur.rowcount > 0

    def create_dataset(self, tenant_id: UUID, organization_id: UUID, owner_id: UUID, dataset_data: dict) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO workspace_datasets (
                        tenant_id, organization_id, folder_id, name, description, tags, 
                        status, format, size_bytes, row_count, file_path, owner_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    tenant_id, organization_id,
                    dataset_data.get('folder_id'),
                    dataset_data['name'],
                    dataset_data.get('description'),
                    dataset_data.get('tags', []),
                    dataset_data.get('status', 'ACTIVE'),
                    dataset_data.get('format'),
                    dataset_data.get('size_bytes'),
                    dataset_data.get('row_count'),
                    dataset_data.get('file_path'),
                    owner_id
                ))
                conn.commit()
                return cur.fetchone()

    def get_datasets(self, tenant_id: UUID, organization_id: UUID, folder_id: Optional[UUID] = None) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                if folder_id:
                    cur.execute("""
                        SELECT * FROM workspace_datasets
                        WHERE tenant_id = %s AND organization_id = %s AND folder_id = %s AND deleted_at IS NULL
                        ORDER BY name ASC;
                    """, (tenant_id, organization_id, folder_id))
                else:
                    cur.execute("""
                        SELECT * FROM workspace_datasets
                        WHERE tenant_id = %s AND organization_id = %s AND folder_id IS NULL AND deleted_at IS NULL
                        ORDER BY name ASC;
                    """, (tenant_id, organization_id))
                return cur.fetchall()

    def update_dataset(self, tenant_id: UUID, organization_id: UUID, dataset_id: UUID, update_data: dict) -> Optional[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                set_clauses = []
                values = []
                for k, v in update_data.items():
                    set_clauses.append(f"{k} = %s")
                    values.append(v)
                
                if not set_clauses:
                    return None

                set_clauses.append("updated_at = NOW()")
                
                query = f"""
                    UPDATE workspace_datasets
                    SET {", ".join(set_clauses)}
                    WHERE id = %s AND tenant_id = %s AND organization_id = %s AND deleted_at IS NULL
                    RETURNING *;
                """
                values.extend([dataset_id, tenant_id, organization_id])
                
                cur.execute(query, tuple(values))
                conn.commit()
                return cur.fetchone()

    def delete_dataset(self, tenant_id: UUID, organization_id: UUID, dataset_id: UUID) -> bool:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE workspace_datasets
                    SET deleted_at = NOW()
                    WHERE id = %s AND tenant_id = %s AND organization_id = %s AND deleted_at IS NULL;
                """, (dataset_id, tenant_id, organization_id))
                conn.commit()
                return cur.rowcount > 0

    def create_connection(self, tenant_id: UUID, organization_id: UUID, owner_id: UUID, connection_data: dict) -> dict:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    INSERT INTO workspace_connections (
                        tenant_id, organization_id, folder_id, name, type, 
                        host, port, database_name, username, credentials_encrypted, owner_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING *;
                """, (
                    tenant_id, organization_id,
                    connection_data.get('folder_id'),
                    connection_data['name'],
                    connection_data['type'],
                    connection_data.get('host'),
                    connection_data.get('port'),
                    connection_data.get('database_name'),
                    connection_data.get('username'),
                    connection_data.get('credentials_encrypted'),
                    owner_id
                ))
                conn.commit()
                return cur.fetchone()

    def get_connections(self, tenant_id: UUID, organization_id: UUID, folder_id: Optional[UUID] = None) -> List[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                if folder_id:
                    cur.execute("""
                        SELECT * FROM workspace_connections
                        WHERE tenant_id = %s AND organization_id = %s AND folder_id = %s AND deleted_at IS NULL
                        ORDER BY name ASC;
                    """, (tenant_id, organization_id, folder_id))
                else:
                    cur.execute("""
                        SELECT * FROM workspace_connections
                        WHERE tenant_id = %s AND organization_id = %s AND folder_id IS NULL AND deleted_at IS NULL
                        ORDER BY name ASC;
                    """, (tenant_id, organization_id))
                return cur.fetchall()

    def update_connection(self, tenant_id: UUID, organization_id: UUID, connection_id: UUID, update_data: dict) -> Optional[dict]:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor(row_factory=dict_row) as cur:
                set_clauses = []
                values = []
                for k, v in update_data.items():
                    set_clauses.append(f"{k} = %s")
                    values.append(v)
                
                if not set_clauses:
                    return None

                set_clauses.append("updated_at = NOW()")
                
                query = f"""
                    UPDATE workspace_connections
                    SET {", ".join(set_clauses)}
                    WHERE id = %s AND tenant_id = %s AND organization_id = %s AND deleted_at IS NULL
                    RETURNING *;
                """
                values.extend([connection_id, tenant_id, organization_id])
                
                cur.execute(query, tuple(values))
                conn.commit()
                return cur.fetchone()

    def delete_connection(self, tenant_id: UUID, organization_id: UUID, connection_id: UUID) -> bool:
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE workspace_connections
                    SET deleted_at = NOW()
                    WHERE id = %s AND tenant_id = %s AND organization_id = %s AND deleted_at IS NULL;
                """, (connection_id, tenant_id, organization_id))
                conn.commit()
                return cur.rowcount > 0

    def log_activity(self, tenant_id: UUID, organization_id: UUID, user_id: UUID, entity_type: str, entity_id: UUID, action: str, details: dict):
        with psycopg.connect(self.dsn) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO workspace_activity_log (
                        tenant_id, organization_id, user_id, entity_type, entity_id, action, details
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s);
                """, (tenant_id, organization_id, user_id, entity_type, entity_id, action, json.dumps(details)))
                conn.commit()
