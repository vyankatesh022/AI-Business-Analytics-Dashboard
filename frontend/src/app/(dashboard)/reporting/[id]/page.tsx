"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Download, Printer, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ReportExportModal } from "@/components/reporting/report-export-modal"
import { ReportShareModal } from "@/components/reporting/report-share-modal"

export default function ReportViewerPage() {
  const router = useRouter()
  
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Viewer Header */}
      <header className="flex h-16 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Q3 Executive Summary</h1>
            <p className="text-xs text-muted-foreground">Last updated Oct 1, 2026</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <ReportShareModal />
          <ReportExportModal />
        </div>
      </header>

      {/* Report Content */}
      <main className="flex-1 overflow-auto bg-muted/10 p-8">
        <div className="mx-auto max-w-4xl space-y-8 bg-white dark:bg-card p-10 rounded-xl shadow-sm border">
          <div className="text-center pb-8 border-b">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Q3 Executive Summary</h2>
            <p className="text-muted-foreground">Comprehensive overview of performance metrics for Q3 2026.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,245,000</div>
                <p className="text-xs text-green-500 mt-1">+14% from Q2</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">452</div>
                <p className="text-xs text-green-500 mt-1">+8% from Q2</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
              <span className="text-muted-foreground font-mono">[CHART PLACEHOLDER]</span>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Executive Notes</h3>
            <p className="text-muted-foreground leading-relaxed">
              The third quarter of 2026 showed strong growth across all major product lines. 
              Customer acquisition costs remained stable while average revenue per user increased by 5%.
              We expect this trend to continue into Q4 as new feature rollouts take effect.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
