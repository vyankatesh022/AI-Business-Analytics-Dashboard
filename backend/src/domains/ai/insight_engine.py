import logging
from typing import Dict, Any
from .llm_gateway import LLMGateway
from .prompt_orchestrator import PromptOrchestrator

logger = logging.getLogger(__name__)

class InsightEngine:
    def __init__(self):
        self.llm = LLMGateway()
        self.prompt_orchestrator = PromptOrchestrator()

    async def generate_insight(self, query: str, context: Dict[str, Any]) -> str:
        """
        Main method to generate a business insight given a natural language query and context.
        """
        # Additional preprocessing can be done here to route specific queries
        messages = self.prompt_orchestrator.build_prompt(query, context)
        return await self.llm.generate_response(messages)

    async def stream_insight(self, query: str, context: Dict[str, Any]):
        """
        Streams the insight back to the caller for faster perceived performance.
        """
        messages = self.prompt_orchestrator.build_prompt(query, context)
        async for chunk in self.llm.stream_response(messages):
            yield chunk

    async def explain_anomaly(self, metric_name: str, current_value: float, historical_context: Dict[str, Any]) -> str:
        """
        Generates an explanation for an anomaly in a specific metric.
        """
        context = {
            "metric": metric_name,
            "current_value": current_value,
            "historical_data": historical_context
        }
        messages = self.prompt_orchestrator.build_prompt(
            f"Explain why {metric_name} changed significantly to {current_value}.", 
            context
        )
        return await self.llm.generate_response(messages)
