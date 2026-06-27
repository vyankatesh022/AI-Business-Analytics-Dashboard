"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, LayoutGrid, FileDown, Clock, Settings, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ReportBuilderCanvas } from "@/components/reporting/report-builder"
import { ReportBlocksPalette } from "@/components/reporting/report-blocks"
import { ReportExportModal } from "@/components/reporting/report-export-modal"
import { ReportScheduleModal } from "@/components/reporting/report-schedule-modal"
import { ReportShareModal } from "@/components/reporting/report-share-modal"

export default function ReportBuilderPage() {
  const router = useRouter()
  const [title, setTitle] = useState("Untitled Report")
  const [isSaving, setIsSaving] = useState(false)
  
  const handleSave = () => {
    setIsSaving(true)
    toast.info("Saving report...")
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Report saved successfully!")
      router.push("/reporting")
    }, 1500)
  }
  
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Builder Header */}
      <header className="flex h-16 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 w-[300px] border-none bg-transparent text-lg font-semibold focus-visible:ring-0 px-0"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Settings className="mr-2 h-4 w-4" />
            Options
          </Button>
          <ReportShareModal />
          <ReportScheduleModal />
          <ReportExportModal />
          <Button size="sm" className="bg-primary text-primary-foreground shadow-sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Report
          </Button>
        </div>
      </header>

      {/* Builder Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Blocks Palette */}
        <aside className="w-64 border-r bg-muted/20 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm flex items-center">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Building Blocks
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ReportBlocksPalette />
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 overflow-auto bg-muted/10 p-8">
          <div className="mx-auto max-w-5xl">
            <ReportBuilderCanvas />
          </div>
        </main>
      </div>
    </div>
  )
}
