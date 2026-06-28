import React from 'react';
import { AiInsightsSidebar } from '@/features/ai-insights/components/AiInsightsSidebar';

export default function AiInsightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full -m-4 md:-m-8 md:-mt-6 rounded-tl-2xl overflow-hidden bg-slate-50/50">
      <AiInsightsSidebar className="hidden lg:flex" />
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );
}
