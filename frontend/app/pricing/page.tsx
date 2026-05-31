import { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing | Vibe Analytics",
  description: "Flexible pricing plans for SaaS analytics. Choose between Free, Pro, and Enterprise tiers for your business intelligence needs.",
  openGraph: {
    title: "Pricing | Vibe Analytics",
    description: "Flexible pricing plans for SaaS analytics. Choose between Free, Pro, and Enterprise tiers.",
    url: "https://vibeanalytics.com/pricing",
    type: "website",
  }
};

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for testing the platform with basic telemetry and sample schemas.",
      price: "$0",
      period: "/ month",
      buttonText: "Start for Free",
      buttonLink: "/login",
      features: [
        { text: "Up to 10,000 monthly events", included: true },
        { text: "Standard telemetry dashboard", included: true },
        { text: "1 Admin User", included: true },
        { text: "Community Support", included: true },
        { text: "Automated Data Cleaning", included: false },
        { text: "Predictive ML Forecasting", included: false },
        { text: "Role-Based Access Control", included: false }
      ]
    },
    {
      name: "Pro",
      description: "Ideal for growing SaaS startups needing automated cleaning pipelines.",
      price: "$299",
      period: "/ month",
      isPopular: true,
      buttonText: "Start 14-Day Trial",
      buttonLink: "/login?plan=pro",
      features: [
        { text: "Up to 500,000 monthly events", included: true },
        { text: "Real-time ARR splines", included: true },
        { text: "Up to 5 Team Members", included: true },
        { text: "Email Support", included: true },
        { text: "Automated Data Cleaning", included: true },
        { text: "Predictive ML Forecasting", included: false },
        { text: "Role-Based Access Control", included: false }
      ]
    },
    {
      name: "Enterprise",
      description: "Advanced predictive ML, zero-trust security, and custom integrations.",
      price: "Custom",
      period: "",
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      features: [
        { text: "Unlimited events", included: true },
        { text: "Custom BI dashboards", included: true },
        { text: "Unlimited Team Members", included: true },
        { text: "24/7 Dedicated Support & SLA", included: true },
        { text: "Automated Data Cleaning", included: true },
        { text: "Predictive ML Forecasting", included: true },
        { text: "Role-Based Access Control (RBAC)", included: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070f] text-zinc-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/40 bg-[#05070f]/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Vibe Analytics
            </span>
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors">Sign in</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Transparent pricing for data-driven teams
          </h1>
          <p className="text-lg text-zinc-400">
            Scale your infrastructure securely. Choose a plan that fits your growth trajectory, from testing to enterprise ML deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col p-8 rounded-2xl border ${plan.isPopular ? "border-cyan-500 bg-zinc-900/60 shadow-[0_0_30px_rgba(0,242,254,0.15)]" : "border-zinc-800/60 bg-zinc-950/40"}`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-cyan-500 text-zinc-950 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-zinc-400 h-10">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-zinc-500">{plan.period}</span>}
              </div>

              <Link 
                href={plan.buttonLink} 
                className={`w-full py-3 px-4 rounded-lg text-center font-bold text-sm transition-all mb-8 ${
                  plan.isPopular 
                  ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-md shadow-cyan-500/20" 
                  : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                {plan.buttonText}
              </Link>

              <div className="flex-1">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">What&apos;s included</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-zinc-300" : "text-zinc-500"}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer isDarkMode={true} />
    </div>
  );
}
