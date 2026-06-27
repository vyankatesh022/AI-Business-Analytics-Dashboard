"use client";

import { PlanCard } from "./PlanCard";
import { InvoiceList } from "./InvoiceList";

const availablePlans = [
  {
    name: "Starter",
    price: 5000,
    interval: "month",
    features: ["10GB Storage", "100 Reports", "2 AI Seats", "Basic Support"],
  },
  {
    name: "Growth",
    price: 10000,
    interval: "month",
    status: "active",
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    features: ["100GB Storage", "Unlimited Reports", "10 AI Seats", "Premium Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 15000,
    interval: "month",
    features: ["Unlimited Storage", "Unlimited Reports", "Unlimited AI Seats", "Dedicated Support"],
  }
];

const invoices = [
  { id: "inv_123", date: new Date().toISOString(), amount: 10000, status: "paid", pdfUrl: "#" },
  { id: "inv_122", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), amount: 10000, status: "paid", pdfUrl: "#" },
];

export function BillingDashboard() {
  const handleManageBilling = () => {
    // API call to /api/v1/billing/portal-session
    alert("Redirecting to Razorpay Checkout/Portal...");
  };

  return (
    <div className="space-y-8">
      {/* Plans Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan, i) => (
            <PlanCard key={i} plan={plan} onManageBilling={handleManageBilling} />
          ))}
        </div>
      </div>

      <div>
        <div className="bg-card rounded-xl border border-border/40 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Invoice History</h2>
          <InvoiceList invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
