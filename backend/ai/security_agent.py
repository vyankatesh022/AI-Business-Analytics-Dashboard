import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class SecurityAgent:
    """
    Validates inputs and outputs for the AI insights engine to prevent prompt injection
    and ensure system safety.
    """
    
    @staticmethod
    def validate_input(user_input: str) -> bool:
        """
        Check for common prompt injection patterns.
        Returns False if malicious input is detected, True otherwise.
        """
        malicious_patterns = [
            "ignore all previous instructions",
            "system prompt",
            "jailbreak",
            "disregard previous",
            "you are now",
            "forget everything"
        ]
        
        normalized_input = user_input.lower()
        for pattern in malicious_patterns:
            if pattern in normalized_input:
                logger.warning(f"Prompt injection attempt detected! Matched pattern: {pattern}")
                return False
        return True

    @staticmethod
    def validate_output(output_content: str) -> bool:
        """
        Check AI output for severe hallucinations or exposure of internal constraints.
        Returns False if the output is unsafe, True otherwise.
        """
        # Basic check to ensure it doesn't leak secrets or system patterns
        sensitive_keywords = [
            "sk-", # OpenAI key prefix
            "AIza", # Google key prefix
            "SYSTEM PROMPT EXPOSED"
        ]
        
        for keyword in sensitive_keywords:
            if keyword in output_content:
                logger.error("AI Output validation failed: Sensitive information detected.")
                return False
        return True
