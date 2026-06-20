import React from 'react';
import { User, Bot, Database, Sparkles, ChevronRight } from 'lucide-react';
import { ChatMessage as IChatMessage } from '@/services/chatApi';

interface ChatMessageProps {
  message: IChatMessage;
  onSuggestedQuestionClick?: (question: string) => void;
}

export default function ChatMessage({ message, onSuggestedQuestionClick }: ChatMessageProps) {
  const isAi = message.role === 'ai';

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl ${isAi ? 'bg-indigo-900/20 border border-indigo-500/20' : 'bg-slate-800/50'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isAi ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-300'}`}>
          {isAi ? <Bot size={18} /> : <User size={18} />}
        </div>
        <span className={`font-medium text-sm ${isAi ? 'text-indigo-300' : 'text-slate-300'}`}>
          {isAi ? 'AI Analyst' : 'You'}
        </span>
      </div>
      
      <div className="pl-11 pr-4">
        <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
        
        {isAi && message.references && message.references.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Database size={12} /> Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {message.references.map((ref, idx) => (
                <div key={idx} className="flex items-center gap-1 text-xs bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-md text-slate-300">
                  <span className="text-indigo-400 font-medium">{ref.insight_type}</span>
                  <ChevronRight size={10} className="text-slate-500"/>
                  <span>{ref.columns.join(', ')}</span>
                  {ref.confidence_score !== undefined && (
                    <span className="text-emerald-400 ml-1 bg-emerald-400/10 px-1 rounded">{Math.round(ref.confidence_score * 100)}% conf</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isAi && message.suggested_questions && message.suggested_questions.length > 0 && onSuggestedQuestionClick && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col gap-2">
             <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Suggested
            </h4>
            <div className="flex flex-col gap-2">
              {message.suggested_questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestedQuestionClick(q.question)}
                  className="text-left text-xs bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight size={12} className="text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                  {q.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
