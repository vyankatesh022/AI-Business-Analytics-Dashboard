"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkflowMonitor() {
  const [executions] = useState([
    { id: 'exec-1', workflowName: 'Churn Risk Alert', status: 'COMPLETED', startedAt: '2026-06-27 10:15:00', duration: '1.2s' },
    { id: 'exec-2', workflowName: 'Weekly Revenue Report', status: 'FAILED', startedAt: '2026-06-27 09:00:00', duration: '4.5s', error: 'Failed to fetch analytics data' },
    { id: 'exec-3', workflowName: 'Churn Risk Alert', status: 'COMPLETED', startedAt: '2026-06-26 14:20:00', duration: '1.1s' },
    { id: 'exec-4', workflowName: 'Revenue Risk Alert', status: 'RUNNING', startedAt: '2026-06-27 15:40:00', duration: '-' },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'FAILED': return <Badge variant="destructive">Failed</Badge>;
      case 'RUNNING': return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">Running</Badge>;
      case 'RETRYING': return <Badge variant="outline" className="text-orange-500 border-orange-500">Retrying</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Execution Monitor</h2>
          <p className="text-muted-foreground mt-2">
            Track workflow runs, view audit logs, and manage failed executions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execution ID</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((exec) => (
                <TableRow key={exec.id}>
                  <TableCell className="font-mono text-xs">{exec.id}</TableCell>
                  <TableCell className="font-medium">{exec.workflowName}</TableCell>
                  <TableCell>{getStatusBadge(exec.status)}</TableCell>
                  <TableCell>{exec.startedAt}</TableCell>
                  <TableCell>{exec.duration}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" size="sm">View Logs</Button>
                    {exec.status === 'FAILED' && (
                      <Button variant="link" size="sm" className="text-blue-500">Retry</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
