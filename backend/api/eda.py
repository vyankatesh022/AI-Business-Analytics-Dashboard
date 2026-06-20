from fastapi import APIRouter, Depends, HTTPException, status
from backend.auth.dependencies import get_current_user
from backend.services.dataset_service import get_dataset_content
from backend.analytics.eda import generate_eda_report
from backend.utils.logging import logger

eda_router = APIRouter()

@eda_router.get("/{dataset_id}/eda", tags=["EDA"])
async def get_dataset_eda(dataset_id: str, current_user: dict = Depends(get_current_user)):
    """
    Generate an Exploratory Data Analysis (EDA) report for a given dataset.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    try:
        # Retrieve dataset safely using dataset service
        df = await get_dataset_content(user_id, dataset_id)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error retrieving dataset for EDA: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load dataset: {str(e)}"
        )

    try:
        # Generate the EDA report
        report = generate_eda_report(df)
        
        if report.get("status") == "error":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=report.get("message", "Failed to generate EDA report.")
            )
            
        return report
    except Exception as e:
        logger.error(f"Error generating EDA report: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating EDA report: {str(e)}"
        )
