import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, aiCopilotApi } from '../api';

interface AiCopilotContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleCopilot: () => void;
  messages: ChatMessage[];
  sendMessage: (query: string, dashboardId?: string) => Promise<void>;
  isLoading: boolean;
}

const AiCopilotContext = createContext<AiCopilotContextProps | undefined>(undefined);

export const AiCopilotProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCopilot = () => setIsOpen(!isOpen);

  const sendMessage = async (query: string, dashboardId?: string) => {
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);
    
    // Add placeholder for assistant message
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const stream = await aiCopilotApi.chat(query, dashboardId);
      if (stream) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.content += chunkValue;
            }
            return newMessages;
          });
        }
      }
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.content = 'Sorry, I encountered an error.';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AiCopilotContext.Provider value={{ isOpen, setIsOpen, toggleCopilot, messages, sendMessage, isLoading }}>
      {children}
    </AiCopilotContext.Provider>
  );
};

export const useAiCopilot = () => {
  const context = useContext(AiCopilotContext);
  if (context === undefined) {
    throw new Error('useAiCopilot must be used within an AiCopilotProvider');
  }
  return context;
};
