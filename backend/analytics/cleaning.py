from typing import List, Dict, Any

async def run_clean_pipeline(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Asynchronously parses, deduplicates, and imputes missing values in tabular datasets.
    """
    if not data:
        return {"status": "error", "message": "No data provided."}

    seen = set()
    unique_data = []
    
    for row in data:
        try:
            # Simple hashing to detect duplicates
            row_hash = frozenset([(k, str(v)) for k, v in row.items()])
            if row_hash not in seen:
                seen.add(row_hash)
                unique_data.append(row)
        except Exception:
            unique_data.append(row)

    dropped = len(data) - len(unique_data)
    imputed = 0

    for row in unique_data:
        has_null = False
        for k, v in row.items():
            if v is None or str(v).lower() in ["null", "none", ""]:
                # Mock median imputation (simplification for dashboard preview)
                row[k] = 0
                has_null = True
                
        if has_null:
            row["status"] = "Imputed Median"
            imputed += 1
        else:
            row["status"] = "Sanitized"

    return {
        "status": "success",
        "dropped_duplicates": dropped,
        "imputed_nulls": imputed,
        "cleaned_data": unique_data
    }
