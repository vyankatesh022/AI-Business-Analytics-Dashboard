"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Network, Search, Database, Cloud, Activity, CheckCircle2, XCircle, ArrowRight, Settings2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Initial Mock Data
const initialConnected = [
  { id: "1", name: "Salesforce CRM", provider: "salesforce", category: "CRM", status: "CONNECTED", lastSync: "10 mins ago", records: "1.2M", health: 98 },
  { id: "2", name: "HubSpot Marketing", provider: "hubspot", category: "Marketing", status: "CONNECTED", lastSync: "1 hour ago", records: "450K", health: 100 },
  { id: "3", name: "Zendesk Support", provider: "zendesk", category: "Support", status: "ERROR", lastSync: "Failed (2 hrs ago)", records: "89K", health: 45 },
]

const initialAvailable = [
  { id: "stripe", name: "Stripe", provider: "stripe", category: "Finance", desc: "Sync billing and subscription data", icon: <Database className="w-8 h-8 text-indigo-500" /> },
  { id: "snowflake", name: "Snowflake", provider: "snowflake", category: "Data Warehouse", desc: "Connect your enterprise data warehouse", icon: <Cloud className="w-8 h-8 text-blue-500" /> },
  { id: "slack", name: "Slack", provider: "slack", category: "Productivity", desc: "Send alerts and notifications to channels", icon: <Activity className="w-8 h-8 text-green-500" /> },
  { id: "intercom", name: "Intercom", provider: "intercom", category: "Support", desc: "Sync user conversations and support tickets", icon: <Network className="w-8 h-8 text-purple-500" /> },
]

const initialSyncJobs = [
  { id: "job1", name: "Salesforce Full Sync", time: "10 mins ago", status: "Success", details: "" },
  { id: "job2", name: "Zendesk Incremental Sync", time: "2 hours ago", status: "Failed", details: "Connection timeout" },
]

export default function IntegrationsHubPage() {
  const [connected, setConnected] = React.useState(initialConnected)
  const [available, setAvailable] = React.useState(initialAvailable)
  const [syncJobs, setSyncJobs] = React.useState(initialSyncJobs)
  const [activeTab, setActiveTab] = React.useState("connected")
  const [isConnecting, setIsConnecting] = React.useState<string | null>(null)
  
  // Filtering state
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("All")

  const filteredAvailable = available.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          integration.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || integration.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleConnect = (integration: typeof initialAvailable[0]) => {
    setIsConnecting(integration.id)
    
    // Simulate API delay
    setTimeout(() => {
      setConnected(prev => [
        ...prev, 
        {
          id: Math.random().toString(),
          name: integration.name,
          provider: integration.provider,
          category: integration.category,
          status: "CONNECTED",
          lastSync: "Just now",
          records: "0",
          health: 100
        }
      ])
      
      setAvailable(prev => prev.filter(item => item.id !== integration.id))
      setIsConnecting(null)
      setActiveTab("connected")
    }, 1000)
  }

  const handleRetryJob = (id: string) => {
    setSyncJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status: "Syncing", details: "Retrying..." } : job
    ))
    
    setTimeout(() => {
      setSyncJobs(prev => prev.map(job => 
        job.id === id ? { ...job, status: "Success", details: "Retried successfully", time: "Just now" } : job
      ))
    }, 1500)
  }

  const handleRunManualSync = () => {
    const newJobId = Math.random().toString()
    setSyncJobs(prev => [{ id: newJobId, name: "Manual Global Sync", time: "Just now", status: "Syncing", details: "Starting..." }, ...prev])
    
    setTimeout(() => {
      setSyncJobs(prev => prev.map(job => 
        job.id === newJobId ? { ...job, status: "Success", details: "Completed manually" } : job
      ))
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Network className="w-8 h-8 text-indigo-600" />
            Integration Hub
          </h2>
          <p className="text-slate-500 mt-2">
            Connect external systems, manage data pipelines, and monitor sync health.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger 
              render={
                <Button variant="outline" className="border-slate-200">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Global Settings
                </Button>
              } 
            />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Global Integration Settings</DialogTitle>
                <DialogDescription>
                  Manage default preferences for all connected systems.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="error-alerts" className="flex flex-col space-y-1">
                    <span>Sync Error Alerts</span>
                    <span className="font-normal text-slate-500 text-xs">Notify admins immediately on failure</span>
                  </Label>
                  <Switch id="error-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="rate-limits" className="flex flex-col space-y-1">
                    <span>Enforce Rate Limits</span>
                    <span className="font-normal text-slate-500 text-xs">Throttle background sync jobs</span>
                  </Label>
                  <Switch id="rate-limits" defaultChecked />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Label>Default Sync Frequency</Label>
                  <Select defaultValue="6h">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Every 1 Hour</SelectItem>
                      <SelectItem value="6h">Every 6 Hours</SelectItem>
                      <SelectItem value="12h">Every 12 Hours</SelectItem>
                      <SelectItem value="24h">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data Retention</Label>
                  <Select defaultValue="90d">
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30d">30 Days</SelectItem>
                      <SelectItem value="90d">90 Days</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
                      <SelectItem value="infinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20" onClick={() => setActiveTab("marketplace")}>
            <Plus className="w-4 h-4 mr-2" />
            New Integration
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 shadow-sm rounded-xl">
          <TabsTrigger value="connected" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Connected Apps</TabsTrigger>
          <TabsTrigger value="marketplace" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Marketplace</TabsTrigger>
          <TabsTrigger value="sync-jobs" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Sync Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {connected.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-dashed rounded-2xl border-slate-300">
                <Network className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No Integrations Connected</h3>
                <p className="mt-1">Connect tools from the marketplace to get started.</p>
                <Button className="mt-4" variant="outline" onClick={() => setActiveTab("marketplace")}>Browse Marketplace</Button>
              </div>
            )}
            {connected.map(integration => (
              <Card key={integration.id} className="relative overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all group bg-white/60 backdrop-blur-xl">
                <div className={`absolute top-0 left-0 w-1 h-full ${integration.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-slate-800">{integration.name}</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1 text-slate-500">{integration.category}</CardDescription>
                    </div>
                    {integration.status === 'CONNECTED' ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Connected</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Last Sync</span>
                      <span className="font-medium text-slate-700">{integration.lastSync}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Records Synced</span>
                      <span className="font-medium text-slate-700">{integration.records}</span>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Health Score</span>
                        <span className={`font-medium ${integration.health > 80 ? 'text-emerald-600' : 'text-red-600'}`}>{integration.health}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${integration.health > 80 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                          style={{ width: `${integration.health}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t border-slate-100 mt-4 px-6 py-3 bg-slate-50/50">
                  <Dialog>
                    <DialogTrigger 
                      render={
                        <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          View Details <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      }
                    />
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {integration.name} 
                          <Badge variant="outline" className={integration.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}>
                            {integration.status}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Connection and synchronization details for {integration.provider}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="font-medium text-slate-500">Last Sync</p>
                            <p className="font-semibold text-slate-900">{integration.lastSync}</p>
                          </div>
                          <div className="space-y-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="font-medium text-slate-500">Total Records Synced</p>
                            <p className="font-semibold text-slate-900">{integration.records}</p>
                          </div>
                          <div className="space-y-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="font-medium text-slate-500">Provider Category</p>
                            <p className="font-semibold text-slate-900">{integration.category}</p>
                          </div>
                          <div className="space-y-1 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <p className="font-medium text-slate-500">API Quota Used</p>
                            <p className="font-semibold text-slate-900">42% (2,100 / 5,000)</p>
                          </div>
                        </div>
                        
                        <div>
                           <div className="flex justify-between items-center mb-2">
                             <h4 className="text-sm font-semibold text-slate-900">Sync Health Score</h4>
                             <span className={`text-sm font-bold ${integration.health > 80 ? 'text-emerald-600' : 'text-red-600'}`}>{integration.health}%</span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${integration.health > 80 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                                style={{ width: `${integration.health}%` }}
                              />
                           </div>
                           <p className="text-xs text-slate-500 mt-2">
                             Health is calculated based on recent sync success rates and API latency.
                           </p>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between items-center sm:justify-between border-t border-slate-100 pt-4 mt-2">
                        <Button variant="destructive" size="sm" onClick={() => setConnected(prev => prev.filter(c => c.id !== integration.id))}>Disconnect</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm" size="sm" onClick={() => alert("Syncing now...")}>Force Sync Now</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search connectors..." 
                className="pl-9 border-slate-200 focus-visible:ring-indigo-500" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["All", "CRM", "Finance", "Support", "Productivity"].map(cat => (
                <Badge 
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"} 
                  className={`cursor-pointer ${categoryFilter === cat ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'hover:bg-slate-100'}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredAvailable.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No integrations found matching your criteria.
              </div>
            )}
            {filteredAvailable.map(integration => (
              <Card 
                key={integration.id} 
                className="border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-white relative group"
                onClick={() => handleConnect(integration)}
              >
                <CardHeader className="text-center pt-8 pb-4">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner group-hover:scale-105 transition-transform">
                    {integration.icon}
                  </div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto w-fit mt-2 bg-slate-100 text-slate-600">{integration.category}</Badge>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <p className="text-sm text-slate-500 line-clamp-2">{integration.desc}</p>
                </CardContent>
                <div className={`absolute inset-x-0 bottom-0 p-4 transition-opacity bg-gradient-to-t from-white via-white to-transparent flex justify-center ${isConnecting === integration.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                    disabled={isConnecting === integration.id}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent double firing
                      handleConnect(integration);
                    }}
                  >
                    {isConnecting === integration.id ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sync-jobs">
           <Card className="border-slate-200/60 shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Sync Jobs</CardTitle>
                  <CardDescription>Monitor your data pipelines and background tasks.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSyncJobs([])}>Clear Logs</Button>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleRunManualSync}>Run Global Sync</Button>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="rounded-md border border-slate-200 overflow-hidden">
                  {syncJobs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-50/50">
                      <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p>No recent sync jobs.</p>
                    </div>
                  ) : (
                    syncJobs.map((job, idx) => (
                      <div key={job.id} className={`p-4 flex items-center justify-between ${idx !== syncJobs.length - 1 ? 'border-b border-slate-100' : ''} ${job.status === 'Failed' ? 'bg-red-50/30' : 'bg-slate-50/30'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${job.status === 'Success' ? 'bg-emerald-100' : job.status === 'Failed' ? 'bg-red-100' : 'bg-blue-100'}`}>
                            {job.status === 'Success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                            {job.status === 'Failed' && <XCircle className="w-5 h-5 text-red-600" />}
                            {job.status === 'Syncing' && <Activity className="w-5 h-5 text-blue-600 animate-pulse" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{job.name}</p>
                            <p className="text-sm text-slate-500">
                              {job.status === 'Success' ? `Completed ${job.time}` : job.status === 'Failed' ? `Failed ${job.time} • ${job.details}` : job.details}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {job.status === 'Failed' && (
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => handleRetryJob(job.id)}>
                              Retry
                            </Button>
                          )}
                          <Badge variant="outline" className={job.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : job.status === 'Failed' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
