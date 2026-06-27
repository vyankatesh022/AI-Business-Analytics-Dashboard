"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Zap, AlertTriangle, TrendingUp, Mail } from "lucide-react";
import { useRouter } from 'next/navigation';

export function WorkflowTemplates() {
  const router = useRouter();
  const templates = [
    {
      id: 'churn-prevention',
      title: 'Churn Prevention',
      description: 'Automatically alert CSMs and send a specialized offer when an account is marked as high churn risk.',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
    {
      id: 'revenue-risk',
      title: 'Revenue Risk Alert',
      description: 'Notify the executive team if forecasted MRR drops below the defined threshold for the quarter.',
      icon: TrendingUp,
      color: 'text-orange-500',
    },
    {
      id: 'exec-summary',
      title: 'Executive Summary Delivery',
      description: 'Generate an AI summary of weekly performance and email it to stakeholders every Monday morning.',
      icon: Mail,
      color: 'text-blue-500',
    },
    {
      id: 'expansion',
      title: 'Usage Expansion Opportunity',
      description: 'Alert sales when a customer exceeds 80% of their usage quota, suggesting an upgrade.',
      icon: Zap,
      color: 'text-yellow-500',
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Workflow Templates</h2>
        <p className="text-muted-foreground mt-2">
          Quickly launch automations using our pre-built, best-practice templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map(tpl => (
          <Card key={tpl.id} className="flex flex-col hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <tpl.icon className={`h-6 w-6 ${tpl.color}`} />
              </div>
              <CardTitle className="text-lg">{tpl.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {tpl.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={() => router.push(`/workflows/builder?template=${tpl.id}`)}>
                <Plus className="h-4 w-4" />
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
