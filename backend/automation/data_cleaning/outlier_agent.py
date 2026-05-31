import pandas as pd
import numpy as np
from typing import Dict, Any, List
from scipy import stats

class OutlierAgent:
    """
    Outlier Detection Agent
    Identifies anomalies using IQR, Z-score, and percentile-based methods.
    """

    @classmethod
    def detect_outliers(cls, df: pd.DataFrame, method: str = "iqr", threshold: float = 1.5) -> Dict[str, Any]:
        """
        Detects outliers in numeric columns.
        method: "iqr", "zscore", "percentile"
        """
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        outliers_report = {}

        for col in numeric_cols:
            col_data = df[col].dropna()
            if col_data.empty:
                continue

            outliers_idx = []
            
            if method == "iqr":
                q1 = col_data.quantile(0.25)
                q3 = col_data.quantile(0.75)
                iqr = q3 - q1
                lower_bound = q1 - (threshold * iqr)
                upper_bound = q3 + (threshold * iqr)
                outliers_idx = col_data[(col_data < lower_bound) | (col_data > upper_bound)].index.tolist()
            
            elif method == "zscore":
                # using threshold as the Z-score limit (e.g., 3.0)
                z_scores = np.abs(stats.zscore(col_data))
                outliers_idx = col_data[z_scores > threshold].index.tolist()
                
            elif method == "percentile":
                # threshold is used as the tail percentage (e.g., 0.01 for 1% and 99%)
                lower_bound = col_data.quantile(threshold)
                upper_bound = col_data.quantile(1.0 - threshold)
                outliers_idx = col_data[(col_data < lower_bound) | (col_data > upper_bound)].index.tolist()

            if outliers_idx:
                outliers_report[col] = {
                    "outlier_count": len(outliers_idx),
                    "outlier_indices": outliers_idx,
                    "method_used": method
                }

        return outliers_report
