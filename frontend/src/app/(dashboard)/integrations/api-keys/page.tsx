"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Webhook, Plus, Copy, Trash2, Eye, EyeOff, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Data
const initialApiKeys = [
  { id: "1", name: "Production API Key", keySnippet: "sk_prod_...8f92", permissions: ["Read", "Write"], lastUsed: "2 mins ago", status: "Active" },
  { id: "2", name: "Staging Testing Key", keySnippet: "sk_test_...3a1c", permissions: ["Read"], lastUsed: "5 days ago", status: "Active" },
]

const initialWebhooks = [
  { id: "1", name: "User Signup Alerts", url: "https://api.acme.com/webhooks/signup", events: ["user.created"], status: "Active", lastDelivery: "Success" },
  { id: "2", name: "Sync Failure Notifier", url: "https://api.acme.com/webhooks/sync-fail", events: ["sync.failed"], status: "Failing", lastDelivery: "Failed (403)" },
]

export default function DeveloperSettingsPage() {
  const [shownKeys, setShownKeys] = React.useState<Set<string>>(new Set())
  const [keys, setKeys] = React.useState(initialApiKeys)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [webhooksState, setWebhooksState] = React.useState(initialWebhooks)

  const toggleKeyVisibility = (id: string) => {
    setShownKeys(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleGenerateKey = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newKeyId = Math.random().toString()
      const newKey = {
        id: newKeyId,
        name: `New API Key (${new Date().toLocaleDateString()})`,
        keySnippet: "sk_live_..." + Math.random().toString(36).substring(2, 6),
        permissions: ["Read", "Write"],
        lastUsed: "Never",
        status: "Active"
      }
      setKeys(prev => [newKey, ...prev])
      setIsGenerating(false)
    }, 600)
  }

  const handleDeleteKey = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id))
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Code className="w-8 h-8 text-indigo-600" />
            Developer Settings
          </h2>
          <p className="text-slate-500 mt-2">
            Manage API keys and configure Webhooks for custom integrations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 shadow-sm rounded-xl">
          <TabsTrigger value="api-keys" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 flex items-center gap-2">
            <Key className="w-4 h-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 flex items-center gap-2">
            <Webhook className="w-4 h-4" /> Webhooks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-indigo-900">Keep your keys secure</h4>
                <p className="text-sm text-indigo-700">Never share your API keys or expose them in client-side code.</p>
              </div>
            </div>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 shadow-md"
              onClick={handleGenerateKey}
              disabled={isGenerating}
            >
              <Plus className="w-4 h-4 mr-2" /> {isGenerating ? "Generating..." : "Generate New Key"}
            </Button>
          </div>

          <div className="grid gap-4">
            {keys.length === 0 && (
              <div className="text-center py-8 text-slate-500 bg-white border border-dashed rounded-xl border-slate-300">
                <Key className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p>No API keys generated yet.</p>
              </div>
            )}
            {keys.map(key => (
              <Card key={key.id} className="border-slate-200 shadow-sm bg-white hover:border-indigo-200 transition-colors">
                <div className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{key.name}</h3>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{key.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1 font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {shownKeys.has(key.id) ? "sk_prod_59f81a38f92" : key.keySnippet}
                      </span>
                      <span>Last used: {key.lastUsed}</span>
                      <span>Permissions: {key.permissions.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(key.id)} className="text-slate-400 hover:text-indigo-600">
                      {shownKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600" onClick={() => handleCopy("sk_prod_59f81a38f92")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(key.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div>
              <h4 className="font-medium text-slate-900">Configured Webhooks</h4>
              <p className="text-sm text-slate-500">Receive real-time HTTP POST payloads when events occur.</p>
            </div>
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50" onClick={() => alert("Opening Add Webhook Modal...")}>
              <Plus className="w-4 h-4 mr-2" /> Add Webhook Endpoint
            </Button>
          </div>

          <div className="grid gap-4">
            {webhooksState.map(wh => (
              <Card key={wh.id} className="border-slate-200 shadow-sm bg-white hover:border-indigo-200 transition-colors">
                <div className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-800">{wh.name}</h3>
                      {wh.status === 'Active' ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failing</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="font-mono text-indigo-600 truncate max-w-[300px]">{wh.url}</span>
                      <span>Events: {wh.events.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Last Delivery</p>
                      <p className={`text-sm font-medium ${wh.lastDelivery === 'Success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {wh.lastDelivery}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 mx-2" />
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900" onClick={() => alert(`Editing webhook: ${wh.name}`)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
