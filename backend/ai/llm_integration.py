import os
from typing import Dict, Any, Optional
from pydantic_ai import Agent, RunContext
from backend.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class LLMIntegration:
    """
    Handles initialization and routing between OpenAI and Gemini.
    """
    def __init__(self, default_model: str = "gemini-1.5-pro"):
        self.default_model = default_model

    def get_agent(self, role: str, system_prompt: str, result_type: Any, model_name: Optional[str] = None) -> Agent:
        """
        Creates and configures a pydantic-ai Agent with the specified model and schema.
        """
        target_model = model_name or self.default_model

        if target_model.startswith("gpt"):
            # Set OpenAI Key via environment since pydantic-ai expects it or passing it in
            os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
            model_id = f"openai:{target_model}"
        elif target_model.startswith("gemini"):
            # Set Gemini Key
            os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
            model_id = f"google-gla:{target_model}"
        else:
            logger.warning(f"Unsupported model {target_model}, defaulting to gemini-1.5-flash")
            os.environ["GEMINI_API_KEY"] = settings.GEMINI_API_KEY
            model_id = "google-gla:gemini-1.5-flash"

        agent = Agent(
            model=model_id,
            result_type=result_type,
            system_prompt=system_prompt,
            retries=3
        )
        return agent
