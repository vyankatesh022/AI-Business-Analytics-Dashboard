import pandas as pd
from typing import Dict, Any

class QAAgent:
    """
    QA Agent
    Validates cleaning accuracy and checks edge cases after cleaning operations.
    """

    @classmethod
    def run_qa(cls, original_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Runs quality assurance checks on the cleaned dataframe.
        """
        issues_fixed = True
        notes = []

        orig_missing = int(original_df.isna().sum().sum())
        new_missing = int(cleaned_df.isna().sum().sum())
        
        orig_dups = int(original_df.duplicated().sum())
        new_dups = int(cleaned_df.duplicated().sum())

        if new_missing > 0:
            notes.append(f"Cleaned dataset still has {new_missing} missing values.")
            issues_fixed = False
            
        if new_dups > 0:
            notes.append(f"Cleaned dataset still has {new_dups} duplicate rows.")
            issues_fixed = False

        return {
            "qa_passed": issues_fixed,
            "original_missing": orig_missing,
            "new_missing": new_missing,
            "original_duplicates": orig_dups,
            "new_duplicates": new_dups,
            "notes": notes
        }
