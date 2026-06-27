import os
import openai
from typing import List, Dict, AsyncGenerator
import logging

logger = logging.getLogger(__name__)

class LLMGateway:
    def __init__(self):
        # Initializing the Async OpenAI client
        # It relies on the OPENAI_API_KEY environment variable by default
        self.client = openai.AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY", "dummy-key-for-local-dev"))
        self.default_model = "gpt-4o"

    async def generate_response(self, messages: List[Dict[str, str]], model: str = None) -> str:
        model_to_use = model or self.default_model
        try:
            response = await self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                temperature=0.7,
                max_tokens=1500
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in LLMGateway: {e}")
            return "I'm sorry, I encountered an error while processing your request."

    async def stream_response(self, messages: List[Dict[str, str]], model: str = None) -> AsyncGenerator[str, None]:
        model_to_use = model or self.default_model
        try:
            stream = await self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                temperature=0.7,
                max_tokens=1500,
                stream=True
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error(f"Error streaming in LLMGateway: {e}")
            yield "Error generating response."
