import React from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function PageContainer({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDashboardStore();
  
  return (
    <main className="flex-1 p-6 overflow-y-auto z-10 relative">
      {/* Background elements */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 left-0 w-full h-[600px] bg-grid-glow opacity-30 z-0 pointer-events-none" />
          <div className="absolute top-[-250px] left-1/4 w-[700px] h-[700px] bg-cyan-500/10 rounded-full glow-blur animate-glow z-0 pointer-events-none" />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}
