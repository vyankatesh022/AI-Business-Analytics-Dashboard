from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone
import uuid

class InsightReference(BaseModel):
    columns: List[str] = Field(default_factory=list, description="List of dataset columns referenced.")
    insight_type: str = Field(description="e.g., 'correlation', 'anomaly', 'trend'")
    confidence_score: Optional[float] = Field(None, description="Confidence score from 0.0 to 1.0")
    
class SuggestedQuestion(BaseModel):
    question: str
    context: str

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str = Field(description="'user' or 'ai'")
    content: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    references: Optional[List[InsightReference]] = None
    suggested_questions: Optional[List[SuggestedQuestion]] = None
    
class ChatRequest(BaseModel):
    message: str
    dataset_id: str
    model: str = "gemini-1.5-flash"

class ChatResponse(BaseModel):
    response: str
    references: List[InsightReference] = Field(default_factory=list)
    suggested_questions: List[SuggestedQuestion] = Field(default_factory=list)
    agent_model: str
    processing_time_ms: int = 0
