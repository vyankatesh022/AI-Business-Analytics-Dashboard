import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

import { AiCopilotWrapper } from "@/features/ai-copilot/components/AiCopilotWrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AiCopilotWrapper>
      <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300 ease-in-out h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
            {children}
          </main>
        </div>
      </div>
    </AiCopilotWrapper>
  )
}
