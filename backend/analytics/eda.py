import pandas as pd
import numpy as np

def generate_eda_report(df: pd.DataFrame) -> dict:
    """
    Generates a comprehensive EDA report for a given pandas DataFrame.
    """
    if df.empty:
        return {"status": "error", "message": "Dataset is empty."}

    # Basic shape
    row_count = int(df.shape[0])
    col_count = int(df.shape[1])
    
    # Missing data
    missing_data = df.isnull().sum()
    total_cells = row_count * col_count
    total_missing = int(missing_data.sum())
    completeness_score = round(((total_cells - total_missing) / total_cells) * 100, 2) if total_cells > 0 else 0
    
    missing_matrix = {}
    for col, count in missing_data.items():
        missing_matrix[col] = {
            "missing_count": int(count),
            "missing_percentage": round((count / row_count) * 100, 2) if row_count > 0 else 0
        }

    # Datatype distribution
    dtypes_counts = df.dtypes.value_counts()
    datatype_distribution = {str(k): int(v) for k, v in dtypes_counts.items()}
    
    # Numerical and Categorical columns
    numerical_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

    # Numerical Analysis
    numerical_analysis = {}
    for col in numerical_cols:
        col_data = df[col].dropna()
        if not col_data.empty:
            # We must use float/int casting to avoid non-JSON serializable numpy types
            mode_val = col_data.mode()
            mode_result = float(mode_val.iloc[0]) if not mode_val.empty else None
            
            numerical_analysis[col] = {
                "mean": float(col_data.mean()),
                "median": float(col_data.median()),
                "mode": mode_result,
                "variance": float(col_data.var()) if len(col_data) > 1 else 0.0,
                "std_dev": float(col_data.std()) if len(col_data) > 1 else 0.0,
                "min": float(col_data.min()),
                "max": float(col_data.max()),
                "zeros": int((col_data == 0).sum())
            }
        else:
            numerical_analysis[col] = {"mean": None, "median": None, "mode": None, "variance": None, "std_dev": None, "min": None, "max": None, "zeros": 0}

    # Categorical Analysis
    categorical_analysis = {}
    for col in categorical_cols:
        col_data = df[col].astype(str).dropna()
        if not col_data.empty:
            value_counts = col_data.value_counts().head(10) # top 10 for performance/UI
            categorical_analysis[col] = {
                "unique_count": int(col_data.nunique()),
                "top_categories": {str(k): int(v) for k, v in value_counts.items()}
            }
        else:
            categorical_analysis[col] = {"unique_count": 0, "top_categories": {}}

    # Correlation Analysis
    correlation_analysis = {"pearson": {}, "spearman": {}}
    if len(numerical_cols) > 1:
        # compute correlations for numerical columns
        try:
            pearson_corr = df[numerical_cols].corr(method="pearson").round(3)
            spearman_corr = df[numerical_cols].corr(method="spearman").round(3)
            
            # Convert to dictionary format
            pearson_dict = pearson_corr.to_dict()
            spearman_dict = spearman_corr.to_dict()
            
            # Clean up NaNs
            for col1 in pearson_dict:
                for col2 in pearson_dict[col1]:
                    val = pearson_dict[col1][col2]
                    if pd.isna(val):
                        pearson_dict[col1][col2] = None
                    val_s = spearman_dict[col1][col2]
                    if pd.isna(val_s):
                        spearman_dict[col1][col2] = None
                        
            correlation_analysis = {
                "pearson": pearson_dict,
                "spearman": spearman_dict
            }
        except Exception:
            pass

    return {
        "status": "success",
        "summary": {
            "row_count": row_count,
            "column_count": col_count,
            "datatype_distribution": datatype_distribution
        },
        "missing_data": {
            "completeness_score": completeness_score,
            "total_missing": total_missing,
            "missing_matrix": missing_matrix
        },
        "numerical_analysis": numerical_analysis,
        "categorical_analysis": categorical_analysis,
        "correlation_analysis": correlation_analysis
    }
