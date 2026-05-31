import pandas as pd
import numpy as np
import re
from typing import Dict, Any, List

class CleaningAgent:
    """
    Cleaning Logic Agent
    Executes cleaning operations: missing values, duplicates, datatypes, invalid data.
    """

    @classmethod
    def clean(cls, df: pd.DataFrame, operations: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Applies a list of cleaning operations to the DataFrame.
        Each operation is a dict, e.g.:
        {
            "action": "handle_missing",
            "column": "Age",
            "method": "interpolate" # or "remove", "replace_mean", "replace_median", "replace_mode", "replace_value"
            "value": 0 # if method is replace_value
        }
        """
        # Create a copy to avoid SettingWithCopyWarning and mutating the original directly if not desired
        df_cleaned = df.copy()

        for op in operations:
            action = op.get("action")
            col = op.get("column")
            
            if action == "remove_duplicates":
                subset = op.get("subset", None) # if None, exact duplicates. If list, partial duplicates.
                df_cleaned.drop_duplicates(subset=subset, inplace=True)
                
            elif action == "handle_missing":
                if col not in df_cleaned.columns:
                    continue
                method = op.get("method")
                
                if method == "remove":
                    df_cleaned.dropna(subset=[col], inplace=True)
                elif method == "interpolate":
                    if pd.api.types.is_numeric_dtype(df_cleaned[col]):
                        df_cleaned[col] = df_cleaned[col].interpolate()
                elif method == "replace_mean":
                    if pd.api.types.is_numeric_dtype(df_cleaned[col]):
                        df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].mean())
                elif method == "replace_median":
                    if pd.api.types.is_numeric_dtype(df_cleaned[col]):
                        df_cleaned[col] = df_cleaned[col].fillna(df_cleaned[col].median())
                elif method == "replace_mode":
                    mode_val = df_cleaned[col].mode()
                    if not mode_val.empty:
                        df_cleaned[col] = df_cleaned[col].fillna(mode_val[0])
                elif method == "replace_value":
                    val = op.get("value")
                    if val is not None:
                        df_cleaned[col] = df_cleaned[col].fillna(val)

            elif action == "correct_datatype":
                if col not in df_cleaned.columns:
                    continue
                target_type = op.get("target_type")
                try:
                    if target_type == "numeric":
                        df_cleaned[col] = pd.to_numeric(df_cleaned[col], errors='coerce')
                    elif target_type == "datetime":
                        df_cleaned[col] = pd.to_datetime(df_cleaned[col], errors='coerce')
                    elif target_type == "string":
                        df_cleaned[col] = df_cleaned[col].astype(str)
                except Exception:
                    pass # Keep as is if conversion completely fails

            elif action == "remove_invalid":
                if col not in df_cleaned.columns:
                    continue
                invalid_type = op.get("invalid_type")
                if invalid_type == "email":
                    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
                    mask = df_cleaned[col].astype(str).str.match(pattern, na=False) | df_cleaned[col].isna()
                    df_cleaned.loc[~mask, col] = np.nan
                elif invalid_type == "phone":
                    # Simple regex for phone numbers (adjust as needed)
                    pattern = r'^\+?1?\d{9,15}$'
                    # Remove spaces/dashes for checking
                    temp_col = df_cleaned[col].astype(str).str.replace(r'[\s\-\(\)]', '', regex=True)
                    mask = temp_col.str.match(pattern, na=False) | df_cleaned[col].isna()
                    df_cleaned.loc[~mask, col] = np.nan
                    
        return df_cleaned
