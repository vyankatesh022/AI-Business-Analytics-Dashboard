"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play, Settings, AlertCircle, CheckCircle, Activity } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function WorkflowDashboard() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState([
    { id: '1', name: 'Churn Risk Alert', active: true, successRate: 98, lastRun: '10m ago' },
    { id: '2', name: 'Weekly Revenue Report', active: true, successRate: 100, lastRun: '2d ago' },
    { id: '3', name: 'High Usage Expansion', active: false, successRate: null, lastRun: 'Never' },
  ]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground mt-2">
            Automate actions based on analytics, AI insights, and predictions.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/workflows/monitor')} className="gap-2">
            <Activity className="h-4 w-4" />
            Monitor
          </Button>
          <Button onClick={() => router.push('/workflows/templates')} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 3 total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Over the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed Executions</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map(wf => (
              <div key={wf.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${wf.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <h4 className="font-semibold">{wf.name}</h4>
                    <p className="text-sm text-muted-foreground">Last run: {wf.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {wf.successRate !== null && (
                    <div className="text-sm font-medium text-muted-foreground">
                      {wf.successRate}% Success
                    </div>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => router.push('/workflows/builder')}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
