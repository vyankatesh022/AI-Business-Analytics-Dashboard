import React from 'react';

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full bg-slate-50/50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
