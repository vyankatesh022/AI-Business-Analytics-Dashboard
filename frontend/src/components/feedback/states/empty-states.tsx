import * as React from "react"
import { FolderX, Inbox, ShieldAlert, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function NoDataState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Inbox className="h-10 w-10 text-muted-foreground" />}
      title="No data available"
      description="You haven't generated any data for this view yet. Start by creating your first entry."
      action={onAction ? { label: "Create Entry", onClick: onAction } : undefined}
    />
  )
}

export function NoResultsState() {
  return (
    <EmptyState
      icon={<FolderX className="h-10 w-10 text-muted-foreground" />}
      title="No results found"
      description="We couldn't find any results matching your search criteria. Try adjusting your filters."
    />
  )
}

export function NoPermissionsState() {
  return (
    <EmptyState
      icon={<ShieldAlert className="h-10 w-10 text-destructive" />}
      title="Access Denied"
      description="You don't have the necessary permissions to view this resource. Contact your organization administrator if you believe this is a mistake."
    />
  )
}

export function NoOrganizationState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Building2 className="h-10 w-10 text-muted-foreground" />}
      title="No Organization"
      description="You need to be part of an organization to access these features. Create a new one or ask for an invite."
      action={onAction ? { label: "Create Organization", onClick: onAction } : undefined}
    />
  )
}
