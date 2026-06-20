import logging
import asyncio
from typing import Dict, Any, List
from fastapi import HTTPException
from backend.ai.llm_integration import LLMIntegration
from backend.ai.insight_generation import InsightGenerationAgent
from backend.ai.risk_detection import RiskDetectionAgent
from backend.ai.security_agent import SecurityAgent
from backend.schemas.insights import FullInsightReport, ExecutiveSummary, TrendInsight, AnomalyInsight, Recommendation, RiskAnalysis

logger = logging.getLogger(__name__)

class AIInsightsAgent:
    def __init__(self):
        self.llm_integration = LLMIntegration()
        self.insight_gen = InsightGenerationAgent(self.llm_integration)
        self.risk_det = RiskDetectionAgent(self.llm_integration)
        self.security = SecurityAgent()

    async def generate_full_report(self, context_data: Dict[str, Any], model_name: str) -> FullInsightReport:
        # 1. Security Validation
        if not self.security.validate_input(str(context_data)):
            raise HTTPException(status_code=400, detail="Security validation failed: Invalid input detected.")

        # 2. Parallel Generation using Sub-Agents
        logger.info(f"Generating full AI insight report using model: {model_name}")
        try:
            results = await asyncio.gather(
                self.insight_gen.generate_executive_summary(context_data, model_name),
                self.insight_gen.generate_trends(context_data, model_name),
                self.insight_gen.generate_anomalies(context_data, model_name),
                self.insight_gen.generate_recommendations(context_data, model_name),
                self.risk_det.generate_risks(context_data, model_name)
            )

            executive_summary = results[0]
            trends = results[1]
            anomalies = results[2]
            recommendations = results[3]
            risks = results[4]

            # 3. Compile Report
            report = FullInsightReport(
                executive_summary=executive_summary,
                trends=trends,
                anomalies=anomalies,
                recommendations=recommendations,
                risks=risks
            )
            
            # Note: We validate input, but validating structured output can be tricky with objects.
            # You might stringify and run it through validate_output, but pydantic schemas usually protect us.
            if not self.security.validate_output(report.model_dump_json()):
                 raise HTTPException(status_code=500, detail="Security validation failed: Output contains sensitive data.")

            return report

        except Exception as e:
            logger.error(f"Failed to generate full AI report: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="AI generation failed.")

    async def generate_executive_summary(self, context_data: Dict[str, Any], model_name: str) -> ExecutiveSummary:
        if not self.security.validate_input(str(context_data)):
             raise HTTPException(status_code=400, detail="Security validation failed.")
        return await self.insight_gen.generate_executive_summary(context_data, model_name)

    async def generate_trends(self, context_data: Dict[str, Any], model_name: str) -> List[TrendInsight]:
        if not self.security.validate_input(str(context_data)):
             raise HTTPException(status_code=400, detail="Security validation failed.")
        return await self.insight_gen.generate_trends(context_data, model_name)

    async def generate_anomalies(self, context_data: Dict[str, Any], model_name: str) -> List[AnomalyInsight]:
        if not self.security.validate_input(str(context_data)):
             raise HTTPException(status_code=400, detail="Security validation failed.")
        return await self.insight_gen.generate_anomalies(context_data, model_name)

    async def generate_recommendations(self, context_data: Dict[str, Any], model_name: str) -> List[Recommendation]:
        if not self.security.validate_input(str(context_data)):
             raise HTTPException(status_code=400, detail="Security validation failed.")
        return await self.insight_gen.generate_recommendations(context_data, model_name)

    async def generate_risks(self, context_data: Dict[str, Any], model_name: str) -> List[RiskAnalysis]:
        if not self.security.validate_input(str(context_data)):
             raise HTTPException(status_code=400, detail="Security validation failed.")
        return await self.risk_det.generate_risks(context_data, model_name)

# Expose a singleton instance
main_agent = AIInsightsAgent()
