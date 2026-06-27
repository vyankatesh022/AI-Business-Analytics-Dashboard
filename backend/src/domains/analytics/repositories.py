from typing import List, Optional
from uuid import UUID
import json
from ...database.connection import get_db_connection
from .models import (
    DashboardCreate, DashboardResponse,
    KPICreate, KPIResponse,
    CohortCreate, CohortResponse,
    FunnelCreate, FunnelResponse,
    SegmentCreate, SegmentResponse
)

class AnalyticsRepository:
    """Repository for Analytics Engine Definitions."""
    
    async def create_dashboard(self, account_id: UUID, data: DashboardCreate) -> DashboardResponse:
        async with get_db_connection() as conn:
            # Create dashboard
            query = """
                INSERT INTO dashboards (account_id, name, description, layout)
                VALUES (%s, %s, %s, %s)
                RETURNING id, account_id, name, description, layout, created_at, updated_at
            """
            row = await conn.execute_and_fetch_one(
                query, 
                (account_id, data.name, data.description, json.dumps(data.layout))
            )
            
            dashboard = DashboardResponse(**row)
            
            # Create cards if any
            if data.cards:
                cards = []
                for card in data.cards:
                    card_query = """
                        INSERT INTO dashboard_cards (dashboard_id, account_id, type, title, config, position)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id, dashboard_id, account_id, type, title, config, position, created_at, updated_at
                    """
                    card_row = await conn.execute_and_fetch_one(
                        card_query,
                        (dashboard.id, account_id, card.type, card.title, json.dumps(card.config), json.dumps(card.position))
                    )
                    cards.append(card_row)
                dashboard.cards = cards
            else:
                dashboard.cards = []
                
            return dashboard

    async def get_dashboards(self, account_id: UUID) -> List[DashboardResponse]:
        async with get_db_connection() as conn:
            query = """
                SELECT id, account_id, name, description, layout, created_at, updated_at
                FROM dashboards
                WHERE account_id = %s
                ORDER BY created_at DESC
            """
            rows = await conn.execute_and_fetch_all(query, (account_id,))
            return [DashboardResponse(**row) for row in rows]

    async def get_dashboard_by_id(self, account_id: UUID, dashboard_id: UUID) -> Optional[DashboardResponse]:
        async with get_db_connection() as conn:
            query = """
                SELECT id, account_id, name, description, layout, created_at, updated_at
                FROM dashboards
                WHERE account_id = %s AND id = %s
            """
            row = await conn.execute_and_fetch_one(query, (account_id, dashboard_id))
            if not row:
                return None
            
            dashboard = DashboardResponse(**row)
            
            cards_query = """
                SELECT id, dashboard_id, account_id, type, title, config, position, created_at, updated_at
                FROM dashboard_cards
                WHERE account_id = %s AND dashboard_id = %s
            """
            cards = await conn.execute_and_fetch_all(cards_query, (account_id, dashboard_id))
            dashboard.cards = cards
            
            return dashboard

    async def create_kpi(self, account_id: UUID, data: KPICreate) -> KPIResponse:
        async with get_db_connection() as conn:
            query = """
                INSERT INTO kpi_definitions (account_id, name, description, dataset_id, metric_type, metric_column, filters)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, account_id, name, description, dataset_id, metric_type, metric_column, filters, created_at, updated_at
            """
            row = await conn.execute_and_fetch_one(
                query,
                (account_id, data.name, data.description, data.dataset_id, data.metric_type, data.metric_column, json.dumps(data.filters))
            )
            return KPIResponse(**row)

    async def create_cohort(self, account_id: UUID, data: CohortCreate) -> CohortResponse:
        async with get_db_connection() as conn:
            query = """
                INSERT INTO cohort_definitions (account_id, name, description, dataset_id, start_event, return_event, time_window)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id, account_id, name, description, dataset_id, start_event, return_event, time_window, created_at, updated_at
            """
            # typecasting the interval is handled by postgres if string is passed appropriately, or we can just pass string.
            row = await conn.execute_and_fetch_one(
                query,
                (account_id, data.name, data.description, data.dataset_id, data.start_event, data.return_event, data.time_window)
            )
            # Ensure time_window is string in response
            if 'time_window' in row and not isinstance(row['time_window'], str):
                 row['time_window'] = str(row['time_window'])
            return CohortResponse(**row)

    async def create_funnel(self, account_id: UUID, data: FunnelCreate) -> FunnelResponse:
        async with get_db_connection() as conn:
            query = """
                INSERT INTO funnel_definitions (account_id, name, description, dataset_id, steps, conversion_window)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, account_id, name, description, dataset_id, steps, conversion_window, created_at, updated_at
            """
            row = await conn.execute_and_fetch_one(
                query,
                (account_id, data.name, data.description, data.dataset_id, json.dumps(data.steps), data.conversion_window)
            )
            if 'conversion_window' in row and not isinstance(row['conversion_window'], str):
                 row['conversion_window'] = str(row['conversion_window'])
            return FunnelResponse(**row)

    async def create_segment(self, account_id: UUID, data: SegmentCreate) -> SegmentResponse:
        async with get_db_connection() as conn:
            query = """
                INSERT INTO segment_definitions (account_id, name, description, dataset_id, rules)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, account_id, name, description, dataset_id, rules, created_at, updated_at
            """
            row = await conn.execute_and_fetch_one(
                query,
                (account_id, data.name, data.description, data.dataset_id, json.dumps(data.rules))
            )
            return SegmentResponse(**row)

    async def get_segments(self, account_id: UUID) -> List[SegmentResponse]:
        async with get_db_connection() as conn:
            query = """
                SELECT id, account_id, name, description, dataset_id, rules, created_at, updated_at
                FROM segment_definitions
                WHERE account_id = %s
                ORDER BY created_at DESC
            """
            rows = await conn.execute_and_fetch_all(query, (account_id,))
            return [SegmentResponse(**row) for row in rows]

    async def get_segment_by_id(self, account_id: UUID, segment_id: UUID) -> Optional[SegmentResponse]:
        async with get_db_connection() as conn:
            query = """
                SELECT id, account_id, name, description, dataset_id, rules, created_at, updated_at
                FROM segment_definitions
                WHERE account_id = %s AND id = %s
            """
            row = await conn.execute_and_fetch_one(query, (account_id, segment_id))
            if not row:
                return None
            return SegmentResponse(**row)
