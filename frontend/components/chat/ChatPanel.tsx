import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, X } from 'lucide-react';
import { getChatHistory, sendChatMessage, ChatMessage as IChatMessage } from '@/services/chatApi';
import ChatMessage from './ChatMessage';

interface ChatPanelProps {
  datasetId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatPanel({ datasetId, isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && datasetId) {
      loadHistory();
    }
  }, [isOpen, datasetId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const history = await getChatHistory(datasetId);
      setMessages(history);
      if (history.length === 0) {
        // Add a welcome message if empty
        setMessages([{
          id: 'welcome',
          role: 'ai',
          content: "Hello! I'm your AI Analyst. I've loaded the dataset context. What would you like to know about your data?",
          created_at: new Date().toISOString(),
          suggested_questions: [
            { question: "What are the key trends in this dataset?", context: "trends" },
            { question: "Are there any anomalies I should look into?", context: "anomalies" }
          ]
        }]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: IChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(datasetId, text);
      const aiMessage: IChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: res.response,
        references: res.references,
        suggested_questions: res.suggested_questions,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: "I'm sorry, I encountered an error while analyzing the dataset. Please try again.",
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-20">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2 text-slate-200">
          <MessageSquare size={18} className="text-indigo-400" />
          <h3 className="font-semibold text-sm">AI Analytics Assistant</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} onSuggestedQuestionClick={handleSend} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl w-fit border border-slate-800">
             <Loader2 size={16} className="text-indigo-400 animate-spin" />
             <span className="text-xs text-slate-400">Analyzing dataset...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this dataset..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
