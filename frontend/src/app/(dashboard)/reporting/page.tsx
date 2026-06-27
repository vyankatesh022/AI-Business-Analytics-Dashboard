"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  FileText, Plus, Search, Calendar, 
  Share2, Download, MoreVertical, 
  Clock, CheckCircle, XCircle
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ReportShareModal } from "@/components/reporting/report-share-modal"
import { ReportExportModal } from "@/components/reporting/report-export-modal"
import { ReportScheduleModal } from "@/components/reporting/report-schedule-modal"

// Mock data
const mockReports = [
  { id: "1", title: "Q3 Executive Summary", type: "EXECUTIVE", status: "PUBLISHED", date: "2026-10-01", author: "Sarah Connor" },
  { id: "2", title: "Monthly Revenue Analysis", type: "REVENUE", status: "PUBLISHED", date: "2026-10-05", author: "John Smith" },
  { id: "3", title: "User Retention Cohorts", type: "COHORT", status: "DRAFT", date: "2026-10-12", author: "Alice Chen" },
]

const mockExports = [
  { id: "e1", report: "Q3 Executive Summary", format: "PDF", status: "COMPLETED", date: "2026-10-02" },
  { id: "e2", report: "Monthly Revenue Analysis", format: "XLSX", status: "PROCESSING", date: "2026-10-05" },
  { id: "e3", report: "Marketing Funnel", format: "CSV", status: "FAILED", date: "2026-09-28" },
]

const mockScheduled = [
  { id: "s1", reportId: "1", title: "Q3 Executive Summary", frequency: "Weekly (Monday)", recipients: "executive@company.com", status: "ACTIVE", nextRun: "2026-10-18" },
  { id: "s2", reportId: "2", title: "Monthly Revenue Analysis", frequency: "Monthly (1st)", recipients: "finance@company.com", status: "ACTIVE", nextRun: "2026-11-01" },
]

function ReportCard({ report, idx, router }: { report: any, idx: number, router: any }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const shareTrigger = useMemo(() => (
    <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-muted-foreground hover:text-foreground")}>
      <Share2 className="h-4 w-4" />
    </button>
  ), []);
  
  const exportTrigger = useMemo(() => (
    <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-muted-foreground hover:text-foreground")}>
      <Download className="h-4 w-4" />
    </button>
  ), []);

  const menuTrigger = useMemo(() => (
    <button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-muted-foreground hover:text-foreground")}>
      <MoreVertical className="h-4 w-4" />
    </button>
  ), []);



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.1 }}
    >
      <Card 
        className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden group"
        onClick={() => router.push(`/reporting/${report.id}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <Badge variant={report.status === "PUBLISHED" ? "default" : "secondary"}>
              {report.status}
            </Badge>
          </div>
          <CardTitle className="mt-4">{report.title}</CardTitle>
          <CardDescription>{report.type} • By {report.author}</CardDescription>
        </CardHeader>
        <CardFooter className="pt-4 border-t bg-muted/20 flex justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {report.date}
          </div>
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            <ReportShareModal>
              {shareTrigger}
            </ReportShareModal>
            
            <ReportExportModal>
              {exportTrigger}
            </ReportExportModal>

            <DropdownMenu>
              <DropdownMenuTrigger render={menuTrigger} />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/reporting/${report.id}`)}>
                  View Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/reporting/builder?id=${report.id}`)}>
                  Edit Report
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsScheduleOpen(true)}>
                  Schedule Delivery
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Delete Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ReportScheduleModal open={isScheduleOpen} onOpenChange={setIsScheduleOpen} />
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function ScheduledCard({ schedule }: { schedule: any }) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const menuTrigger = useMemo(() => (
    <button className={buttonVariants({ variant: "ghost", size: "icon" })}>
      <MoreVertical className="h-4 w-4" />
    </button>
  ), []);



  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{schedule.title}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-2">
            <span>{schedule.frequency}</span>
            <span>•</span>
            <span>To: {schedule.recipients}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <div className="text-right text-sm">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
            {schedule.status}
          </Badge>
          <p className="text-muted-foreground mt-1 text-xs">Next run: {schedule.nextRun}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={menuTrigger} />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsScheduleOpen(true)}>
              Edit Schedule
            </DropdownMenuItem>
            <DropdownMenuItem>Pause Delivery</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Delete Schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ReportScheduleModal open={isScheduleOpen} onOpenChange={setIsScheduleOpen} />
      </div>
    </div>
  )
}

export default function ReportingDashboard() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Enterprise Reporting
          </h2>
          <p className="text-muted-foreground mt-1">
            Build, schedule, and share automated business reports.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/reporting/builder")} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="reports" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Reports</TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Scheduled</TabsTrigger>
          <TabsTrigger value="exports" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Exports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8 bg-background/50 border-muted focus-visible:ring-primary/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockReports.map((report, idx) => (
              <ReportCard key={report.id} report={report} idx={idx} router={router} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Deliveries</CardTitle>
              <CardDescription>Manage automated report distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScheduled.map((schedule) => (
                  <ScheduledCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exports">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Status of your background export jobs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExports.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      {exp.status === "COMPLETED" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {exp.status === "PROCESSING" && <Clock className="h-5 w-5 text-blue-500 animate-pulse" />}
                      {exp.status === "FAILED" && <XCircle className="h-5 w-5 text-red-500" />}
                      <div>
                        <p className="font-medium">{exp.report}</p>
                        <p className="text-sm text-muted-foreground">{exp.date} • {exp.format}</p>
                      </div>
                    </div>
                    <div>
                      {exp.status === "COMPLETED" ? (
                        <Button variant="outline" size="sm">Download</Button>
                      ) : (
                        <Badge variant="outline">{exp.status}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
