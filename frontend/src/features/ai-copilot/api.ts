import api from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const aiCopilotApi = {
  chat: async (query: string, dashboardId?: string) => {
    // Note: since this is a streaming endpoint, we use fetch directly to handle the stream
    // assuming api client attaches auth headers, we might need to recreate them here, 
    // but for simplicity we'll assume a standard JSON post for a full response
    // or implement a streaming reader.
    
    // We'll use the native fetch to stream
    const response = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // simple mock
      },
      body: JSON.stringify({ query, dashboard_id: dashboardId }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI response');
    }

    return response.body;
  },
};
