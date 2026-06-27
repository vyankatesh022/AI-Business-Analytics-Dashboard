"use client";

import React from 'react';
import { AiCopilotProvider, useAiCopilot } from '../context/AiCopilotContext';
import { CopilotSidebar } from './CopilotSidebar';
import { MessageSquarePlus } from 'lucide-react';

const CopilotTrigger = () => {
  const { toggleCopilot } = useAiCopilot();
  
  return (
    <button 
      onClick={toggleCopilot} 
      className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all z-40 flex items-center justify-center group"
      title="Ask AI Copilot"
    >
      <MessageSquarePlus className="w-6 h-6 group-hover:animate-pulse" />
    </button>
  );
};

export const AiCopilotWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AiCopilotProvider>
      {children}
      <CopilotTrigger />
      <CopilotSidebar />
    </AiCopilotProvider>
  );
};
