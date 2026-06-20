import logging
import time
from typing import Dict, Any, List, Optional
import pandas as pd
from fastapi import HTTPException
from pydantic_ai import Agent, RunContext
from backend.ai.llm_integration import LLMIntegration
from backend.ai.security_agent import SecurityAgent
from backend.schemas.chat import ChatResponse, InsightReference, SuggestedQuestion

logger = logging.getLogger(__name__)

# Define the system prompt for the Chat Agent
CHAT_SYSTEM_PROMPT = """
You are an expert AI Business Analytics Assistant.
Your task is to answer user questions about their uploaded dataset.
You have access to the dataset schema and a sample of the data.
Please provide accurate insights based ONLY on the provided dataset context.
Do not hallucinate data. If the answer cannot be determined from the provided context, state that clearly.

When formulating your response:
1. Be concise, professional, and business-focused.
2. Reference the specific columns you used to derive the insight.
3. Suggest 2-3 logical follow-up questions the user could ask based on the current context.
"""

class DatasetChatAgent:
    def __init__(self):
        self.llm_integration = LLMIntegration()
        self.security = SecurityAgent()

    def _build_context_string(self, df: pd.DataFrame) -> str:
        """Extracts schema and sample data to provide to the LLM."""
        schema_info = []
        for col in df.columns:
            dtype = str(df[col].dtype)
            unique_count = df[col].nunique()
            schema_info.append(f"- {col} ({dtype}), {unique_count} unique values")
            
        schema_str = "\n".join(schema_info)
        
        # Get sample rows
        sample_df = df.head(5)
        sample_str = sample_df.to_csv(index=False)
        
        return f"Dataset Schema:\n{schema_str}\n\nSample Data (First 5 rows):\n{sample_str}"

    async def generate_response(self, message: str, df: pd.DataFrame, model_name: str) -> ChatResponse:
        start_time = time.time()
        
        # 1. Security Validation (Prompt Injection)
        if not self.security.validate_input(message):
            raise HTTPException(status_code=400, detail="Security validation failed: Invalid input detected.")

        # 2. Build Dataset Context
        dataset_context = self._build_context_string(df)
        
        # 3. Formulate Prompt
        full_prompt = f"User Question: {message}\n\n{dataset_context}\n\nPlease analyze this request and return a structured response."

        logger.info(f"Generating chat response using model: {model_name}")
        
        try:
            # 4. Invoke LLM with Pydantic AI
            agent = self.llm_integration.get_agent(
                role="ChatAssistant",
                system_prompt=CHAT_SYSTEM_PROMPT,
                result_type=ChatResponse,
                model_name=model_name
            )
            
            result = await agent.run(full_prompt)
            response_data = result.data
            
            # Post-process: Mask sensitive data in the text response if needed
            response_data.response = self.security.mask_sensitive_data(response_data.response)
            response_data.agent_model = model_name
            response_data.processing_time_ms = int((time.time() - start_time) * 1000)
            
            return response_data

        except Exception as e:
            logger.error(f"Failed to generate chat response: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="AI Chat generation failed.")

# Expose a singleton instance
chat_agent = DatasetChatAgent()
