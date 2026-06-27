import * as React from "react"
import { AlertCircle, WifiOff, ShieldX, ServerCrash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  icon: React.ReactNode
  title: string
  description: string
  onRetry?: () => void
}

export function ErrorState({ icon, title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        {icon}
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-destructive">{title}</h2>
      <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      {onRetry && (
        <Button variant="destructive" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<WifiOff className="h-10 w-10" />}
      title="Connection Error"
      description="We couldn't connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  )
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<ServerCrash className="h-10 w-10" />}
      title="Server Error"
      description="Something went wrong on our end. Our team has been notified. Please try again later."
      onRetry={onRetry}
    />
  )
}

export function PermissionErrorState() {
  return (
    <ErrorState
      icon={<ShieldX className="h-10 w-10" />}
      title="Action Not Allowed"
      description="You don't have permission to perform this action. If you believe this is an error, please contact your administrator."
    />
  )
}

export function UnknownErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon={<AlertCircle className="h-10 w-10" />}
      title="Unexpected Error"
      description="An unexpected error occurred. Please refresh the page or try again."
      onRetry={onRetry}
    />
  )
}
