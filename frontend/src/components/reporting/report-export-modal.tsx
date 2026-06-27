"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Download, FileText, FileSpreadsheet, FileIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function ReportExportModal({ children }: { children?: React.ReactNode }) {
  const [format, setFormat] = useState("PDF")
  const [open, setOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const trigger = useMemo(() => {
    return React.isValidElement(children) ? children : (
      <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </button>
    )
  }, [children])

  const handleExport = () => {
    setIsExporting(true)
    toast.info(`Preparing ${format} export...`)
    
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false)
      setOpen(false)
      toast.success(`${format} report exported successfully!`)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Choose a format to export your report. Exports are generated in the background.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={format} onValueChange={setFormat} className="space-y-4">
            <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${format === "PDF" ? "bg-muted/50 border-primary" : "hover:bg-muted/50"}`} onClick={() => setFormat("PDF")}>
              <RadioGroupItem value="PDF" id="r1" />
              <Label htmlFor="r1" className="flex items-center flex-1 cursor-pointer">
                <FileIcon className="h-5 w-5 mr-3 text-red-500" />
                <div>
                  <p className="font-medium">PDF Document</p>
                  <p className="text-sm text-muted-foreground">Best for printing and sharing.</p>
                </div>
              </Label>
            </div>
            <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${format === "XLSX" ? "bg-muted/50 border-primary" : "hover:bg-muted/50"}`} onClick={() => setFormat("XLSX")}>
              <RadioGroupItem value="XLSX" id="r2" />
              <Label htmlFor="r2" className="flex items-center flex-1 cursor-pointer">
                <FileSpreadsheet className="h-5 w-5 mr-3 text-green-500" />
                <div>
                  <p className="font-medium">Excel Spreadsheet</p>
                  <p className="text-sm text-muted-foreground">Best for data analysis.</p>
                </div>
              </Label>
            </div>
            <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${format === "CSV" ? "bg-muted/50 border-primary" : "hover:bg-muted/50"}`} onClick={() => setFormat("CSV")}>
              <RadioGroupItem value="CSV" id="r3" />
              <Label htmlFor="r3" className="flex items-center flex-1 cursor-pointer">
                <FileText className="h-5 w-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">CSV File</p>
                  <p className="text-sm text-muted-foreground">Raw data format.</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              `Generate ${format}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
