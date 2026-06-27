"use client"

import * as React from "react"
import { useMemo } from "react"
import { Share2 } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ReportShareModal({ children }: { children?: React.ReactNode }) {
  const trigger = useMemo(() => {
    return React.isValidElement(children) ? children : (
      <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </button>
    )
  }, [children])

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Grant access to other members of your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Share With</Label>
            <Select defaultValue="ORGANIZATION">
              <SelectTrigger>
                <SelectValue placeholder="Select who can access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORGANIZATION">Entire Organization</SelectItem>
                <SelectItem value="ROLE">Specific Roles</SelectItem>
                <SelectItem value="USER">Specific Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Permission Level</Label>
            <Select defaultValue="VIEW">
              <SelectTrigger>
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW">Can View</SelectItem>
                <SelectItem value="EDIT">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t mt-2">
            <Switch id="public-link" />
            <Label htmlFor="public-link">Enable Public Link (Expiring)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Update Sharing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
