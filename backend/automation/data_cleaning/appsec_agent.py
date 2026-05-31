import pandas as pd
from typing import Dict, Any, Optional

class AppSecAgent:
    """
    AppSec Agent
    Responsible for checking dataset security before processing.
    """
    MAX_ROWS = 1_000_000
    MAX_COLS = 1_000
    MAX_MEMORY_MB = 500

    @classmethod
    def validate(cls, df: pd.DataFrame, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Validates the DataFrame against security policies.
        Returns a dictionary with 'passed' and 'reason' if failed.
        """
        if df is None or df.empty:
            return {"passed": False, "reason": "Dataset is empty or malformed."}
        
        # Check rows and cols limit
        rows, cols = df.shape
        if rows > cls.MAX_ROWS:
            return {"passed": False, "reason": f"Dataset exceeds maximum allowed rows ({cls.MAX_ROWS})."}
        if cols > cls.MAX_COLS:
            return {"passed": False, "reason": f"Dataset exceeds maximum allowed columns ({cls.MAX_COLS})."}
            
        # Check memory exhaustion
        mem_usage_bytes = df.memory_usage(deep=True).sum()
        mem_usage_mb = mem_usage_bytes / (1024 * 1024)
        if mem_usage_mb > cls.MAX_MEMORY_MB:
            return {"passed": False, "reason": f"Dataset memory usage ({mem_usage_mb:.2f} MB) exceeds limit ({cls.MAX_MEMORY_MB} MB)."}
            
        # Authorization is typically handled by the API layer before passing to the engine
        # But if metadata contains user/dataset verification, we can check it
        if metadata and metadata.get("enforce_auth", False):
            if not metadata.get("user_id"):
                return {"passed": False, "reason": "Missing authorization: user_id."}

        return {"passed": True, "reason": ""}
