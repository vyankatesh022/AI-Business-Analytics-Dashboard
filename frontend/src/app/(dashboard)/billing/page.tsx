"use client";

import { BillingDashboard } from "@/components/billing/BillingDashboard";

export default function BillingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl py-8 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your enterprise subscription, view usage, and download invoices.
        </p>
      </div>
      <BillingDashboard />
    </div>
  );
}
