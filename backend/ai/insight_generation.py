import json
from typing import Dict, Any, List
from backend.ai.llm_integration import LLMIntegration
from backend.ai.prompt_engineering import PromptTemplates
from backend.schemas.insights import ExecutiveSummary, TrendInsight, AnomalyInsight, Recommendation

class InsightGenerationAgent:
    def __init__(self, llm_integration: LLMIntegration):
        self.llm = llm_integration

    async def generate_executive_summary(self, context_data: Dict[str, Any], model_name: str) -> ExecutiveSummary:
        context_str = json.dumps(context_data, indent=2)
        agent = self.llm.get_agent(
            role="Business Intelligence",
            system_prompt=PromptTemplates.EXECUTIVE_SUMMARY_PROMPT.format(context=context_str),
            result_type=ExecutiveSummary,
            model_name=model_name
        )
        result = await agent.run("Generate the executive summary based on the provided context.")
        return result.data

    async def generate_trends(self, context_data: Dict[str, Any], model_name: str) -> List[TrendInsight]:
        context_str = json.dumps(context_data, indent=2)
        agent = self.llm.get_agent(
            role="Data Analyst",
            system_prompt=PromptTemplates.TREND_DETECTION_PROMPT.format(context=context_str),
            result_type=List[TrendInsight],
            model_name=model_name
        )
        result = await agent.run("Identify the key trends based on the provided context.")
        return result.data

    async def generate_anomalies(self, context_data: Dict[str, Any], model_name: str) -> List[AnomalyInsight]:
        context_str = json.dumps(context_data, indent=2)
        agent = self.llm.get_agent(
            role="Data Analyst",
            system_prompt=PromptTemplates.ANOMALY_DETECTION_PROMPT.format(context=context_str),
            result_type=List[AnomalyInsight],
            model_name=model_name
        )
        result = await agent.run("Point out anomalies based on the provided context.")
        return result.data

    async def generate_recommendations(self, context_data: Dict[str, Any], model_name: str) -> List[Recommendation]:
        context_str = json.dumps(context_data, indent=2)
        agent = self.llm.get_agent(
            role="Business Consultant",
            system_prompt=PromptTemplates.RECOMMENDATION_PROMPT.format(context=context_str),
            result_type=List[Recommendation],
            model_name=model_name
        )
        result = await agent.run("Generate actionable business recommendations.")
        return result.data
