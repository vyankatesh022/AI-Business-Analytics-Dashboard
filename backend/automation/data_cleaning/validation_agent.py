import pandas as pd
from typing import Dict, Any, List

class ValidationAgent:
    """
    Validation Agent
    Responsible for schema validation and data quality checks.
    """

    @classmethod
    def analyze(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyzes the DataFrame for quality issues: missing values, duplicates, and data types.
        """
        report = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": {},
            "duplicate_rows": int(df.duplicated().sum()),
            "missing_cells": int(df.isna().sum().sum()),
        }

        for col in df.columns:
            col_data = df[col]
            missing_count = int(col_data.isna().sum())
            unique_count = int(col_data.nunique(dropna=True))
            dtype = str(col_data.dtype)
            
            # Infer data type class
            if pd.api.types.is_numeric_dtype(col_data):
                inferred_type = "numeric"
            elif pd.api.types.is_datetime64_any_dtype(col_data):
                inferred_type = "datetime"
            elif pd.api.types.is_bool_dtype(col_data):
                inferred_type = "boolean"
            else:
                # Check if it looks like a categorical
                if unique_count > 0 and unique_count / len(df) < 0.05:
                    inferred_type = "categorical"
                else:
                    inferred_type = "text"
            
            report["columns"][col] = {
                "dtype": dtype,
                "inferred_type": inferred_type,
                "missing_count": missing_count,
                "missing_percentage": float(missing_count / len(df)) if len(df) > 0 else 0.0,
                "unique_count": unique_count
            }

        return report
