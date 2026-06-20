from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.auth.dependencies import get_current_user, require_role
from typing import List, Dict, Any, Optional

from backend.analytics.cleaning import run_clean_pipeline
from backend.ml.models import fit_forecast_model
from backend.api.datasets import datasets_router

api_router = APIRouter()

api_router.include_router(datasets_router, prefix="/datasets", tags=["Datasets"])
from backend.api.data_cleaning import data_cleaning_router
api_router.include_router(data_cleaning_router, prefix="/datasets", tags=["Data Cleaning"])
from backend.api.eda import eda_router
api_router.include_router(eda_router, prefix="/datasets", tags=["EDA Analytics"])
from backend.api.analytics import analytics_router
api_router.include_router(analytics_router, prefix="/datasets", tags=["Analytics"])
from backend.api.insights import insights_router
api_router.include_router(insights_router, prefix="/insights", tags=["AI Insights"])

from backend.services.dataset_service import get_dataset_content
from backend.services.chat_service import get_chat_history, save_chat_message
from backend.ai.chat_agent import chat_agent
from backend.schemas.chat import ChatRequest, ChatResponse, ChatMessage

class CleanRequest(BaseModel):
    data: List[Dict[str, Any]]


class ForecastRequest(BaseModel):
    historical_data: List[Dict[str, Any]]


# Chat schema is now in backend.schemas.chat


@api_router.post("/clean")
async def clean_data(req: CleanRequest, current_user: dict = Depends(get_current_user)):
    """
    Cleans raw uploaded datasets asynchronously.
    """
    result = await run_clean_pipeline(req.data)
    return result



@api_router.post("/ml/forecast")
async def ml_forecast(req: ForecastRequest, current_user: dict = Depends(require_role(["Pro", "Admin"]))):
    """
    Fits prediction models on tabular arrays.
    Requires Pro or Admin role.
    """
    result = await fit_forecast_model(req.historical_data)
    return result

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the current authenticated user's payload.
    """
    return current_user


@api_router.get("/datasets/{dataset_id}/chat/history")
async def fetch_chat_history(dataset_id: str, current_user: dict = Depends(get_current_user)):
    """Fetch chat history for a specific dataset."""
    user_id = current_user.get("id")
    history = await get_chat_history(user_id, dataset_id)
    return {"history": history}

@api_router.post("/datasets/{dataset_id}/chat", response_model=ChatResponse)
async def chat_with_dataset(
    dataset_id: str, 
    req: ChatRequest, 
    current_user: dict = Depends(get_current_user)
):
    """
    Grounded LLM responses based on dataset schemas and natural language questions.
    """
    user_id = current_user.get("id")
    app_metadata = current_user.get("app_metadata", {})
    user_role = app_metadata.get("role", "Free")

    # Define model access rules
    free_models = ["gpt-3.5-turbo", "gemini-1.5-flash"]
    pro_models = ["gpt-4o", "gemini-1.5-pro"]
    
    selected_model = req.model

    if selected_model in pro_models and user_role not in ["Pro", "Admin"]:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"The {selected_model} model requires a Pro or Admin subscription."
        )

    # 1. Save User Message
    user_msg = ChatMessage(role="user", content=req.message)
    await save_chat_message(user_id, dataset_id, user_msg.model_dump())

    # 2. Get Dataset Context
    try:
        df = await get_dataset_content(user_id, dataset_id)
    except Exception as e:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Failed to load dataset: {str(e)}"
        )

    # 3. Generate AI Response
    response_data = await chat_agent.generate_response(req.message, df, selected_model)

    # 4. Save AI Message
    ai_msg = ChatMessage(
        role="ai", 
        content=response_data.response,
        references=[r.model_dump() for r in response_data.references],
        suggested_questions=[q.model_dump() for q in response_data.suggested_questions]
    )
    await save_chat_message(user_id, dataset_id, ai_msg.model_dump())

    return response_data
