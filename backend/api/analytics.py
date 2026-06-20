from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.auth.dependencies import get_current_user
from backend.services.dataset_service import get_dataset_content
from backend.analytics.charts import apply_filters, compute_kpis, generate_chart_data
from backend.utils.logging import logger

analytics_router = APIRouter()

class FilterDefinition(BaseModel):
    column: str
    operator: str
    value: Any

class ChartQuery(BaseModel):
    filters: Optional[List[FilterDefinition]] = []
    kpis_only: Optional[bool] = False
    chart_config: Optional[Dict[str, Any]] = None

@analytics_router.post("/{dataset_id}/query", tags=["Analytics"])
async def query_dataset_analytics(dataset_id: str, query: ChartQuery, current_user: dict = Depends(get_current_user)):
    """
    Query dataset for KPIs and Chart visualizations.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    try:
        df = await get_dataset_content(user_id, dataset_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error retrieving dataset for analytics: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load dataset: {str(e)}"
        )

    try:
        # Apply filters
        filters_dict = [f.dict() for f in query.filters] if query.filters else []
        filtered_df = apply_filters(df, filters_dict)
        
        response = {}
        
        # Always return KPIs for the filtered dataset
        response["kpis"] = compute_kpis(filtered_df)
        
        if query.kpis_only:
            return response
            
        # Generate chart data if requested
        if query.chart_config:
            x_axis = query.chart_config.get("x_axis")
            y_axis = query.chart_config.get("y_axis")
            
            # Fallback x_axis if missing or invalid
            if not x_axis or x_axis not in filtered_df.columns:
                query.chart_config["x_axis"] = filtered_df.columns[0] if len(filtered_df.columns) > 0 else None
                
            # Fallback y_axis if missing or invalid
            agg_func = query.chart_config.get("aggregation", "sum")
            chart_type = query.chart_config.get("type", "bar")
            
            if chart_type != "pie" and agg_func != "count":
                if not y_axis or (isinstance(y_axis, str) and y_axis not in filtered_df.columns):
                    numeric_cols = filtered_df.select_dtypes(include=['number']).columns.tolist()
                    query.chart_config["y_axis"] = numeric_cols[0] if len(numeric_cols) > 0 else filtered_df.columns[-1]
                elif isinstance(y_axis, list):
                    valid_y = [y for y in y_axis if y in filtered_df.columns]
                    query.chart_config["y_axis"] = valid_y if valid_y else None
                
            chart_res = generate_chart_data(filtered_df, query.chart_config)
            if "error" in chart_res:
                response["chart_error"] = chart_res["error"]
            else:
                response["chart_data"] = chart_res
                
        return response

    except Exception as e:
        logger.error(f"Error generating analytics: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating analytics: {str(e)}"
        )
