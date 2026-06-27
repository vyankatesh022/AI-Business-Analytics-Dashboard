import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanProps {
  plan: {
    name: string;
    price: number;
    interval: string;
    status?: string;
    currentPeriodEnd?: string;
    features: string[];
    popular?: boolean;
  };
  onManageBilling: () => void;
}

export function PlanCard({ plan, onManageBilling }: PlanProps) {
  const isActive = plan.status === "active";
  
  const endDate = plan.currentPeriodEnd ? new Date(plan.currentPeriodEnd).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : null;

  return (
    <div className={`bg-gradient-to-br from-card to-card/50 rounded-xl border ${plan.popular ? 'border-primary shadow-primary/20' : 'border-primary/20'} p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group h-full flex flex-col`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
          Most Popular
        </div>
      )}

      <div className="flex flex-wrap justify-between items-start gap-y-4 gap-x-2 mb-6">
        <div className="flex-1 min-w-[150px]">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground break-words">{plan.name}</h2>
            {isActive && (
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20 shrink-0">
                {plan.status}
              </span>
            )}
          </div>
          {isActive ? (
            <p className="text-muted-foreground text-sm">
              Your subscription renews on {endDate}.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Perfect for growing businesses.
            </p>
          )}
        </div>
        
        <div className="text-left xl:text-right shrink-0 max-w-full">
          <div className="text-4xl font-extrabold tracking-tight break-all">
            ₹{plan.price}
          </div>
          <div className="text-muted-foreground text-sm font-medium uppercase tracking-widest mt-1">
            per {plan.interval}
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 py-6 mb-6 flex-grow">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-widest text-muted-foreground">Plan Features</h3>
        <ul className="grid grid-cols-1 gap-4">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-4">
        {isActive ? (
          <>
            <p className="text-xs text-muted-foreground flex-1 min-w-[120px]">
              Need more seats or custom limits? Check out our Enterprise plan.
            </p>
            <Button onClick={onManageBilling} size="lg" className="shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform shrink-0 w-full sm:w-auto">
              <Zap className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          </>
        ) : (
          <Button onClick={onManageBilling} size="lg" variant={plan.popular ? "default" : "outline"} className="w-full group-hover:scale-[1.02] transition-transform">
            Upgrade to {plan.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
