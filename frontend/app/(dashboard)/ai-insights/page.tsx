"use client";

import React, { useState, useRef, useEffect } from "react";
import { Activity, Send, Bot, User, AlertTriangle, Sparkles, Zap, Lock } from "lucide-react";
import { PageContainer } from "@/components/dashboard/PageContainer";
import { sendChatMessage, ChatMessage } from "@/services/aiApi";
import { useAuthStore } from "@/store/useAuthStore";

const AVAILABLE_MODELS = [
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", tier: "Free", icon: Zap },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", tier: "Free", icon: Sparkles },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", tier: "Pro", icon: Activity },
  { id: "gpt-4o", name: "GPT-4o", tier: "Pro", icon: Bot },
];

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { hasRole } = useAuthStore();
  const isProUser = hasRole(["Pro", "Admin", "Super Admin"]); // Backend logic expects Pro/Admin

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, selectedModel);
      setMessages(prev => [...prev, { role: "assistant", content: response.response }]);
    } catch (err: any) {
      setError(err.message || "An error occurred while communicating with the AI.");
      // Optional: remove the user message if it failed, or keep it and show error.
      // We will keep it and just show the error above the input.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col h-[calc(100vh-140px)] space-y-4 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              AI Insights <Activity className="h-5 w-5 text-cyan-400" />
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Chat with your data using multiple AI models.</p>
          </div>
          
          {/* Model Selection */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400">Agent Model:</span>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setError(null);
                }}
                className="appearance-none bg-zinc-900/50 border border-zinc-700 text-sm rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-zinc-200"
              >
                {AVAILABLE_MODELS.map(model => {
                  const isLocked = model.tier === "Pro" && !isProUser;
                  return (
                    <option key={model.id} value={model.id} disabled={isLocked}>
                      {model.name} ({model.tier}) {isLocked ? "🔒" : ""}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden border border-zinc-800/60 bg-zinc-950/20 rounded-2xl flex flex-col relative">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                <Activity className="h-12 w-12 text-cyan-500 mb-4" />
                <h3 className="text-lg font-bold text-zinc-300 mb-2">How can I help you analyze your data today?</h3>
                <p className="text-sm text-zinc-500 max-w-md">
                  Ask me about churn rates, sales anomalies, or basket sizes. I can switch models to best suit your analytical needs.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {AVAILABLE_MODELS.map(m => {
                    const Icon = m.icon;
                    return (
                      <div key={m.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
                        <Icon className="h-3 w-3 text-cyan-500" />
                        {m.name}
                        {m.tier === "Pro" && <span className="ml-1 text-[9px] uppercase tracking-wider text-amber-500 font-bold px-1 rounded bg-amber-500/10 border border-amber-500/20">Pro</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="shrink-0 h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-sm' 
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="shrink-0 h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <Bot className="h-4 w-4 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl text-sm bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800/60">
            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Request Failed</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your AI analyst a question..."
                disabled={isLoading}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 disabled:hover:bg-cyan-500 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-2 text-center flex items-center justify-center gap-1.5">
              <span className="text-[10px] text-zinc-600">Currently using</span>
              <span className="text-[10px] font-bold text-cyan-500">{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
