import logging
from typing import Dict, Any, List
from src.database.connection import get_db_connection

logger = logging.getLogger(__name__)

class AnalyticsContextBuilder:
    def __init__(self):
        pass

    async def get_dashboard_context(self, account_id: str, dashboard_id: str) -> Dict[str, Any]:
        """
        Fetches the metadata and summary of a dashboard to provide context to the AI.
        Does NOT fetch raw data, only aggregated metadata and widget configs.
        """
        async with get_db_connection() as db:
            dashboard = await db.execute_and_fetch_one(
                "SELECT name, description, layout FROM dashboards WHERE id = %s AND account_id = %s",
                (dashboard_id, account_id)
            )
            
            if not dashboard:
                return {}

            cards = await db.execute_and_fetch_all(
                "SELECT title, type, config FROM dashboard_cards WHERE dashboard_id = %s AND account_id = %s",
                (dashboard_id, account_id)
            )

            return {
                "dashboard_name": dashboard["name"] if isinstance(dashboard, dict) else dashboard[0],
                "dashboard_description": dashboard["description"] if isinstance(dashboard, dict) else dashboard[1],
                "widgets": [{"title": c["title"] if isinstance(c, dict) else c[0], "type": c["type"] if isinstance(c, dict) else c[1], "config": c["config"] if isinstance(c, dict) else c[2]} for c in cards]
            }

    async def get_kpi_context(self, account_id: str) -> List[Dict[str, Any]]:
        """
        Fetches the active KPIs for the account.
        """
        async with get_db_connection() as db:
            kpis = await db.execute_and_fetch_all(
                "SELECT name, description, metric_type FROM kpi_definitions WHERE account_id = %s",
                (account_id,)
            )
            return [{"name": k["name"] if isinstance(k, dict) else k[0], "description": k["description"] if isinstance(k, dict) else k[1], "metric_type": k["metric_type"] if isinstance(k, dict) else k[2]} for k in kpis]
