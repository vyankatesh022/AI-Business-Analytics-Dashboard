"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Search, Info, FileText, AlertCircle, BarChart3, Database, BrainCircuit, Sparkles, Workflow, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/layout/user-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

const initialNotifications = [
  { id: 1, title: "New user registered", time: "2 hours ago", unread: true, type: "info", icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
  { id: 2, title: "Monthly report generated", time: "5 hours ago", unread: true, type: "success", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
  { id: 3, title: "Server usage alert", time: "1 day ago", unread: false, type: "warning", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Notification State
  const [notifications, setNotifications] = React.useState(initialNotifications)
  const hasUnread = notifications.some(n => n.unread)

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  // Search State
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setSearchOpen(false)
    command()
  }, [])

  // Simple breadcrumb logic based on pathname
  const paths = pathname.split('/').filter(Boolean)

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md transition-all sm:px-6">
        <div className="flex flex-1 items-center gap-4 md:gap-8">
          <div className="hidden md:flex ml-2 lg:ml-0">
            <Breadcrumb>
              <BreadcrumbList className="text-sm font-medium">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-slate-500 hover:text-slate-900 transition-colors">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {paths.map((path, index) => {
                  const isLast = index === paths.length - 1
                  const href = `/${paths.slice(0, index + 1).join('/')}`
                  const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')

                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbSeparator className="text-slate-400" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="text-slate-900 font-semibold">{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href} className="text-slate-500 hover:text-slate-900 transition-colors">{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Search Trigger */}
          <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto lg:w-80">
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="relative h-10 w-full justify-start rounded-xl bg-slate-100/50 border-slate-200/50 text-sm font-normal text-slate-500 shadow-inner hover:bg-slate-100 hover:text-slate-900 transition-all sm:pr-12 md:w-40 lg:w-64"
            >
              <Search className="mr-2 h-4 w-4 text-slate-400" />
              <span className="hidden lg:inline-flex">Search workspace...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.4rem] hidden h-6 select-none items-center gap-1 rounded-md border border-slate-200 bg-white px-2 font-mono text-[10px] font-semibold text-slate-500 shadow-sm opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full h-10 w-10 transition-colors" />}>
              <Bell className="h-5 w-5" />
              {hasUnread && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white"></span>
              )}
              <span className="sr-only">Notifications</span>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50/50">
                <h4 className="font-semibold text-sm">Notifications</h4>
                {hasUnread && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-auto p-0 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-transparent"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="flex flex-col max-h-[320px] overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b ${!notification.unread ? 'opacity-70' : ''}`}
                    >
                      <div className={`h-8 w-8 rounded-full ${notification.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`h-4 w-4 ${notification.color}`} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <p className="text-xs text-slate-500">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="h-2 w-2 bg-indigo-500 rounded-full ml-auto mt-1 shrink-0"></div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="border-t p-2 bg-slate-50/50">
                <Button variant="ghost" className="w-full text-sm text-slate-600 hover:text-slate-900 h-8">
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <UserMenu />
        </div>
      </header>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => runCommand(() => router.push('/analytics'))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/workspace'))}>
              <Database className="mr-2 h-4 w-4" />
              <span>Workspace</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/predictions'))}>
              <BrainCircuit className="mr-2 h-4 w-4" />
              <span>Predictions</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/ai-insights'))}>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI Insights</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/reporting'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Reporting</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/workflows'))}>
              <Workflow className="mr-2 h-4 w-4" />
              <span>Workflows</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push('/profile'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/developer'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Developer Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
