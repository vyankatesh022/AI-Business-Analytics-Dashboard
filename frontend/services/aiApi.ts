export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  response: string;
  data?: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const sendChatMessage = async (message: string, model: string = "gemini-1.5-flash", context?: unknown): Promise<ChatResponse> => {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      model,
      context,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to communicate with AI agent');
  }

  return res.json();
};
