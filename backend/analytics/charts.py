import pandas as pd
import numpy as np
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

def apply_filters(df: pd.DataFrame, filters: List[Dict[str, Any]]) -> pd.DataFrame:
    """
    Applies a list of filters to a pandas DataFrame.
    Format of filter: {"column": "date", "operator": "gte", "value": "2023-01-01"}
    """
    filtered_df = df.copy()
    for f in filters:
        col = f.get("column")
        op = f.get("operator")
        val = f.get("value")

        if col not in filtered_df.columns:
            continue
            
        try:
            if op == "eq":
                filtered_df = filtered_df[filtered_df[col] == val]
            elif op == "neq":
                filtered_df = filtered_df[filtered_df[col] != val]
            elif op == "gt":
                filtered_df = filtered_df[filtered_df[col] > val]
            elif op == "gte":
                filtered_df = filtered_df[filtered_df[col] >= val]
            elif op == "lt":
                filtered_df = filtered_df[filtered_df[col] < val]
            elif op == "lte":
                filtered_df = filtered_df[filtered_df[col] <= val]
            elif op == "in" and isinstance(val, list):
                filtered_df = filtered_df[filtered_df[col].isin(val)]
        except Exception as e:
            logger.warning(f"Failed to apply filter {f} on column {col}: {e}")
            
    return filtered_df

def compute_kpis(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes summary KPIs: Total Records, Total Revenue, Average Sales.
    Uses heuristic column names.
    """
    kpis = {
        "total_records": len(df),
        "total_revenue": 0.0,
        "average_sales": 0.0,
        "revenue_column_found": False
    }
    
    if len(df) == 0:
         return kpis
         
    # Heuristics for revenue/sales columns
    revenue_cols = [c for c in df.columns if str(c).lower() in ["revenue", "sales", "total_amount", "amount", "price"]]
    if revenue_cols:
        rev_col = revenue_cols[0]
        try:
            numeric_series = pd.to_numeric(df[rev_col], errors='coerce')
            kpis["total_revenue"] = float(numeric_series.sum())
            kpis["average_sales"] = float(numeric_series.mean())
            kpis["revenue_column_found"] = True
            kpis["revenue_column_name"] = rev_col
        except Exception as e:
            logger.warning(f"Error computing KPIs on column {rev_col}: {e}")
            
    return kpis

def generate_chart_data(df: pd.DataFrame, query: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates aggregated chart data.
    Query params:
    - type: "line", "bar", "pie", "scatter", "histogram"
    - x_axis: column name
    - y_axis: column name (for scatter/line) or list of columns
    - aggregation: "sum", "mean", "count" (for bar/line/pie)
    """
    chart_type = query.get("type", "bar")
    x_axis = query.get("x_axis")
    y_axis = query.get("y_axis") # can be string or list
    agg_func = query.get("aggregation", "sum")
    
    if chart_type in ["bar", "line", "pie"]:
        if not x_axis:
            return {"error": "x_axis is required for this chart type"}
            
        if not y_axis and chart_type != "pie" and agg_func != "count":
            return {"error": "y_axis is required for this chart type"}
            
        y_cols = y_axis if isinstance(y_axis, list) else [y_axis] if y_axis else []
        
        try:
            # Drop na for grouping
            valid_df = df.dropna(subset=[x_axis])
            if y_cols:
                for y in y_cols:
                    valid_df[y] = pd.to_numeric(valid_df[y], errors='coerce')
                
            if agg_func == "sum":
                grouped = valid_df.groupby(x_axis)[y_cols].sum().reset_index()
            elif agg_func == "mean":
                grouped = valid_df.groupby(x_axis)[y_cols].mean().reset_index()
            else:
                grouped = valid_df.groupby(x_axis).size().reset_index(name="count")
                y_cols = ["count"]
                
            # Sort for line charts or limit for pie charts
            if chart_type == "pie":
                if y_cols:
                    grouped = grouped.sort_values(by=y_cols[0], ascending=False).head(10)
            elif chart_type == "line":
                # Assuming x_axis is date or sortable
                grouped = grouped.sort_values(by=x_axis)
                
            # Replace NaNs/Infs with None for JSON serialization
            grouped = grouped.replace([np.inf, -np.inf], np.nan)
            grouped = grouped.where(pd.notnull(grouped), None)
            
            return {
                "data": grouped.to_dict(orient="records"),
                "x_axis": x_axis,
                "y_axis": y_cols
            }
        except Exception as e:
            logger.error(f"Error generating {chart_type} chart: {e}")
            return {"error": str(e)}

    elif chart_type == "scatter":
        if not x_axis or not y_axis:
             return {"error": "x_axis and y_axis are required for scatter"}
             
        try:
            y_col = y_axis[0] if isinstance(y_axis, list) else y_axis
            valid_df = df[[x_axis, y_col]].dropna()
            
            valid_df[x_axis] = pd.to_numeric(valid_df[x_axis], errors='coerce')
            valid_df[y_col] = pd.to_numeric(valid_df[y_col], errors='coerce')
            valid_df = valid_df.dropna()
            
            # Sample down if too large
            if len(valid_df) > 1000:
                valid_df = valid_df.sample(n=1000, random_state=42)
                
            valid_df = valid_df.replace([np.inf, -np.inf], np.nan).where(pd.notnull(valid_df), None)
            
            return {
                "data": valid_df.to_dict(orient="records"),
                "x_axis": x_axis,
                "y_axis": y_col
            }
        except Exception as e:
            return {"error": str(e)}
            
    elif chart_type == "histogram":
        if not x_axis:
             return {"error": "x_axis is required for histogram"}
             
        try:
            numeric_series = pd.to_numeric(df[x_axis], errors='coerce').dropna()
            if len(numeric_series) == 0:
                return {"error": "No valid numeric data for histogram"}
                
            counts, bins = np.histogram(numeric_series, bins='auto')
            
            # Format for Plotly or Recharts
            hist_data = []
            for i in range(len(counts)):
                hist_data.append({
                    "bin_start": float(bins[i]),
                    "bin_end": float(bins[i+1]),
                    "count": int(counts[i]),
                    "bin_label": f"{bins[i]:.2f} - {bins[i+1]:.2f}"
                })
                
            return {
                "data": hist_data,
                "x_axis": x_axis
            }
        except Exception as e:
            return {"error": str(e)}

    return {"error": f"Unsupported chart type: {chart_type}"}
