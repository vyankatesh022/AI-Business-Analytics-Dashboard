from typing import Dict, Any, List

class RecommendationAgent:
    """
    Recommendation Agent
    Analyzes quality reports and outlier data to generate an issue summary,
    recommended fixes, and a confidence score for each recommendation.
    """

    @classmethod
    def generate_recommendations(cls, validation_report: Dict[str, Any], outliers_report: Dict[str, Any]) -> List[Dict[str, Any]]:
        recommendations = []

        # Check for duplicate rows
        duplicate_rows = validation_report.get("duplicate_rows", 0)
        if duplicate_rows > 0:
            recommendations.append({
                "issue": f"Found {duplicate_rows} duplicate rows.",
                "action": "remove_duplicates",
                "confidence": 0.95,
                "operation": {
                    "action": "remove_duplicates",
                    "subset": None
                }
            })

        # Check columns for missing values and data type issues
        columns = validation_report.get("columns", {})
        total_rows = validation_report.get("total_rows", 0)

        for col, stats in columns.items():
            missing_count = stats.get("missing_count", 0)
            missing_pct = stats.get("missing_percentage", 0.0)
            dtype = stats.get("dtype", "")
            inferred_type = stats.get("inferred_type", "")

            # Missing values recommendations
            if missing_count > 0:
                if missing_pct > 0.5:
                    recommendations.append({
                        "issue": f"Column '{col}' is missing >50% of its values.",
                        "action": f"Remove column '{col}'.",
                        "confidence": 0.85,
                        "operation": {
                            "action": "drop_column",
                            "column": col
                        }
                    })
                elif inferred_type == "numeric":
                    recommendations.append({
                        "issue": f"Column '{col}' has {missing_count} missing numeric values.",
                        "action": "Impute with median.",
                        "confidence": 0.90,
                        "operation": {
                            "action": "handle_missing",
                            "column": col,
                            "method": "replace_median"
                        }
                    })
                elif inferred_type == "categorical":
                    recommendations.append({
                        "issue": f"Column '{col}' has {missing_count} missing categorical values.",
                        "action": "Impute with mode.",
                        "confidence": 0.88,
                        "operation": {
                            "action": "handle_missing",
                            "column": col,
                            "method": "replace_mode"
                        }
                    })
                else:
                    recommendations.append({
                        "issue": f"Column '{col}' has {missing_count} missing values.",
                        "action": "Remove rows with missing values.",
                        "confidence": 0.70,
                        "operation": {
                            "action": "handle_missing",
                            "column": col,
                            "method": "remove"
                        }
                    })

            # Check for incorrect data types
            if dtype == "object" and inferred_type == "numeric":
                recommendations.append({
                    "issue": f"Column '{col}' is stored as string but looks numeric.",
                    "action": "Convert to numeric.",
                    "confidence": 0.92,
                    "operation": {
                        "action": "correct_datatype",
                        "column": col,
                        "target_type": "numeric"
                    }
                })
            
            # Check for invalid emails (simple heuristic based on col name for demo purposes)
            if "email" in col.lower() and inferred_type in ["text", "categorical"]:
                recommendations.append({
                    "issue": f"Column '{col}' might contain invalid emails.",
                    "action": "Remove invalid email formats (replace with NaN).",
                    "confidence": 0.85,
                    "operation": {
                        "action": "remove_invalid",
                        "column": col,
                        "invalid_type": "email"
                    }
                })

        # Outliers recommendations
        for col, stats in outliers_report.items():
            outlier_count = stats.get("outlier_count", 0)
            if outlier_count > 0:
                recommendations.append({
                    "issue": f"Column '{col}' has {outlier_count} outliers.",
                    "action": "Review or handle outliers (not automatically removed by default).",
                    "confidence": 0.60,
                    "operation": None # Informational, or could have a specific operation
                })

        return recommendations
