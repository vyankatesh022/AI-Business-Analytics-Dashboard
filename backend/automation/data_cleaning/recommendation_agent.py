from typing import Dict, Any, List

class RecommendationAgent:
    """
    Recommendation Agent
    Analyzes quality reports and outlier data to generate an issue summary,
    recommended fixes, and a confidence score for each recommendation.
    """

    @classmethod
    def generate_recommendations(cls, validation_report: Dict[str, Any], outliers_report: Dict[str, Any], model: str = "heuristic") -> List[Dict[str, Any]]:
        if model and model != "heuristic":
            # Simulate LLM-based intelligent recommendations
            return cls._simulate_llm_recommendations(validation_report, outliers_report, model)
            
        return cls._generate_heuristic_recommendations(validation_report, outliers_report)

    @classmethod
    def _generate_heuristic_recommendations(cls, validation_report: Dict[str, Any], outliers_report: Dict[str, Any]) -> List[Dict[str, Any]]:
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

    @classmethod
    def _simulate_llm_recommendations(cls, validation_report: Dict[str, Any], outliers_report: Dict[str, Any], model: str) -> List[Dict[str, Any]]:
        """
        Simulates an LLM parsing the validation_report and outliers_report to generate contextual recommendations.
        """
        # Get base heuristic recommendations to start with
        base_recs = cls._generate_heuristic_recommendations(validation_report, outliers_report)
        
        llm_recs = []
        for rec in base_recs:
            # Add an LLM "flair" to the issue and confidence
            new_rec = rec.copy()
            new_rec["issue"] = f"[{model.upper()} Analysis]: {rec['issue']} The model recommends addressing this to prevent downstream ML skew."
            
            # Boost confidence slightly to simulate "smart" detection
            if new_rec.get("confidence"):
                new_rec["confidence"] = min(0.99, new_rec["confidence"] + 0.05)
                
            llm_recs.append(new_rec)
            
        # Add a custom LLM-only recommendation if there are numeric columns
        columns = validation_report.get("columns", {})
        numeric_cols = [c for c, s in columns.items() if s.get("inferred_type") == "numeric"]
        
        if numeric_cols:
            llm_recs.append({
                "issue": f"[{model.upper()} Insight]: Columns {numeric_cols} have varying scales. Consider applying Standard Scaler before model training.",
                "action": "Information only. Contextual note generated by LLM.",
                "confidence": 0.88,
                "operation": None
            })
            
        return llm_recs
