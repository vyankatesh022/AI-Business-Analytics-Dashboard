import json
from typing import Dict, Any, List
from backend.ai.llm_integration import LLMIntegration
from backend.ai.prompt_engineering import PromptTemplates
from backend.schemas.insights import RiskAnalysis

class RiskDetectionAgent:
    def __init__(self, llm_integration: LLMIntegration):
        self.llm = llm_integration

    async def generate_risks(self, context_data: Dict[str, Any], model_name: str) -> List[RiskAnalysis]:
        context_str = json.dumps(context_data, indent=2)
        agent = self.llm.get_agent(
            role="Risk Mitigation",
            system_prompt=PromptTemplates.RISK_ANALYSIS_PROMPT.format(context=context_str),
            result_type=List[RiskAnalysis],
            model_name=model_name
        )
        result = await agent.run("Evaluate the provided context for any potential business risks.")
        return result.data
