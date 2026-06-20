

export interface InsightReference {
  columns: string[];
  insight_type: string;
  confidence_score?: number;
}

export interface SuggestedQuestion {
  question: string;
  context: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
  references?: InsightReference[];
  suggested_questions?: SuggestedQuestion[];
}

export interface ChatResponse {
  response: string;
  references: InsightReference[];
  suggested_questions: SuggestedQuestion[];
  agent_model: string;
  processing_time_ms: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const getChatHistory = async (datasetId: string): Promise<ChatMessage[]> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/chat/history`, { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.history || [];
};

export const sendChatMessage = async (datasetId: string, message: string, model: string = "gemini-1.5-flash"): Promise<ChatResponse> => {
  const res = await fetch(`${API_BASE_URL}/datasets/${datasetId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, dataset_id: datasetId, model }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to send chat message');
  }
  return res.json();
};
