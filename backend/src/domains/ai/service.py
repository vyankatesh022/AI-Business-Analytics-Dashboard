import logging
from typing import Dict, Any, List
from .context_builder import AnalyticsContextBuilder
from .insight_engine import InsightEngine
from src.database.connection import get_db_connection

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.context_builder = AnalyticsContextBuilder()
        self.insight_engine = InsightEngine()

    async def log_audit_event(self, account_id: str, user_id: str, prompt: str, token_usage: int, response_time_ms: int):
        # Background task or direct insert for audit logs
        async with get_db_connection() as db:
            await db.execute(
                """
                INSERT INTO ai_audit_logs (account_id, user_id, model, prompt_tokens, response_time_ms)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (account_id, user_id, "gpt-4o", token_usage, response_time_ms) # Masking prompt
            )
            await db.commit()

    async def process_chat_query(self, account_id: str, user_id: str, query: str, dashboard_id: str = None):
        """
        Processes a chat query, fetches context, and streams the AI response.
        """
        context = {}
        if dashboard_id:
            context["dashboard"] = await self.context_builder.get_dashboard_context(account_id, dashboard_id)
        
        # Always fetch global KPIs for baseline knowledge
        context["kpis"] = await self.context_builder.get_kpi_context(account_id)

        # Assuming we stream the result directly back to the API route
        async for chunk in self.insight_engine.stream_insight(query, context):
            yield chunk
