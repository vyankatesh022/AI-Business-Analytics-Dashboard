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

    async def explain_anomaly(self, metric_name: str, total_anomalies: int, anomaly_details: list) -> str:
        """
        Generates an explanation for detected anomalies in a specific metric.
        """
        context = {
            "metric": metric_name,
            "total_anomalies": total_anomalies,
            "anomaly_details": anomaly_details
        }
        messages = self.prompt_orchestrator.build_prompt(
            f"We detected {total_anomalies} anomalies in the '{metric_name}' metric. Please provide a brief business explanation or hypotheses for these outliers.", 
            context
        )
        return await self.llm.generate_response(messages)

    async def explain_forecast(self, metric_name: str, algorithm_used: str, forecast_summary: list) -> str:
        """
        Generates a business narrative for a forecast.
        """
        context = {
            "metric": metric_name,
            "algorithm": algorithm_used,
            "forecast": forecast_summary
        }
        messages = self.prompt_orchestrator.build_prompt(
            f"We generated a forecast for the '{metric_name}' metric using {algorithm_used}. Please provide a brief business summary of the predicted trend.", 
            context
        )
        return await self.llm.generate_response(messages)
