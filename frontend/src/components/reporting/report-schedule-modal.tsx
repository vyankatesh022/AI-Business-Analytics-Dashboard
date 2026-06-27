"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Clock, Loader2 } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReportScheduleModal({ 
  children,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: { 
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [scheduleType, setScheduleType] = useState("WEEKLY")
  const [internalOpen, setInternalOpen] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen

  const trigger = useMemo(() => {
    return React.isValidElement(children) ? children : (
      <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        <Clock className="mr-2 h-4 w-4" />
        Schedule
      </button>
    )
  }, [children])

  const handleSchedule = () => {
    setIsScheduling(true)
    toast.info("Saving schedule...")
    
    // Simulate API call
    setTimeout(() => {
      setIsScheduling(false)
      setOpen(false)
      toast.success("Report schedule saved successfully!")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? children : <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Delivery</DialogTitle>
          <DialogDescription>
            Configure automated delivery of this report to stakeholders.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={scheduleType} onValueChange={setScheduleType}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="CUSTOM">Custom (Cron)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {scheduleType === "CUSTOM" && (
            <div className="grid gap-2">
              <Label htmlFor="cron">Cron Expression</Label>
              <Input id="cron" placeholder="0 9 * * 1" />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="recipients">Recipients (Email Addresses)</Label>
            <Input id="recipients" placeholder="team@company.com, ceo@company.com" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="delivery">Delivery Method</Label>
            <Select defaultValue="EMAIL">
              <SelectTrigger>
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMAIL">Email Attachment (PDF)</SelectItem>
                <SelectItem value="LINK">Secure Download Link</SelectItem>
                <SelectItem value="WORKSPACE">Workspace Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSchedule} disabled={isScheduling}>
            {isScheduling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Schedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
