import pandas as pd
from typing import Dict, Any, List
from fastapi import HTTPException

from .appsec_agent import AppSecAgent
from .validation_agent import ValidationAgent
from .outlier_agent import OutlierAgent
from .cleaning_agent import CleaningAgent
from .recommendation_agent import RecommendationAgent
from .qa_agent import QAAgent

class DataCleaningEngine:
    """
    Data Cleaning Engine
    Orchestrates the data cleaning pipeline using specialized subagents.
    """

    @classmethod
    def analyze(cls, df: pd.DataFrame, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyzes the dataset and returns a cleaning report with recommendations.
        """
        # 1. Security Check
        sec_result = AppSecAgent.validate(df, metadata)
        if not sec_result["passed"]:
            raise HTTPException(status_code=400, detail=f"Security Validation Failed: {sec_result['reason']}")

        # 2. Schema and Quality Validation
        val_report = ValidationAgent.analyze(df)

        # 3. Outlier Detection
        outlier_report = OutlierAgent.detect_outliers(df)

        # 4. Generate Recommendations
        recommendations = RecommendationAgent.generate_recommendations(val_report, outlier_report)

        return {
            "validation_report": val_report,
            "outlier_report": outlier_report,
            "recommendations": recommendations
        }

    @classmethod
    def clean(cls, df: pd.DataFrame, operations: List[Dict[str, Any]], metadata: Dict[str, Any] = None) -> tuple:
        """
        Applies cleaning operations and runs QA checks.
        Returns a tuple of (cleaned_df, qa_report).
        """
        # 1. Security Check
        sec_result = AppSecAgent.validate(df, metadata)
        if not sec_result["passed"]:
            raise HTTPException(status_code=400, detail=f"Security Validation Failed: {sec_result['reason']}")

        # 2. Apply Cleaning Logic
        cleaned_df = CleaningAgent.clean(df, operations)

        # 3. QA Validation
        qa_report = QAAgent.run_qa(df, cleaned_df)

        return cleaned_df, qa_report
