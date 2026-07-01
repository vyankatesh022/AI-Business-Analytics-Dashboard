"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard,
  BarChart3, 
  Database, 
  BrainCircuit, 
  Sparkles, 
  FileText, 
  CreditCard, 
  Building2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Workflow,
  Network,
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Analytics", href: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Workspace", href: "/workspace", icon: <Database className="h-5 w-5" /> },
  { title: "Predictions", href: "/predictions", icon: <BrainCircuit className="h-5 w-5" /> },
  { title: "AI Insights", href: "/ai-insights", icon: <Sparkles className="h-5 w-5" /> },
  { title: "Reporting", href: "/reporting", icon: <FileText className="h-5 w-5" /> },
  { title: "Workflows", href: "/workflows", icon: <Workflow className="h-5 w-5" /> },
]

const settingsMenuItems = [
  { title: "Organizations", href: "/organizations", icon: Building2 },
  { title: "Integrations", href: "/integrations", icon: Network },
  { title: "Developer", href: "/developer", icon: Code },
  { title: "Billing", href: "/billing", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  const isSettingsActive = settingsMenuItems.some(item => pathname.startsWith(item.href))

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white/90 backdrop-blur-xl text-slate-700 transition-all duration-300 ease-in-out shadow-lg",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className={cn(
          "flex h-16 items-center border-b border-slate-200 px-4 shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 font-semibold text-sm tracking-tight cursor-pointer group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                AC
              </div>
              <span className="text-slate-900 group-hover:text-indigo-600 transition-colors">Acme Corp</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 md:flex text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle Collapse</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          <div className="space-y-1.5">
            {!isCollapsed && <p className="px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Overview</p>}
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 overflow-hidden",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.title : undefined}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  )}
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-auto shrink-0 p-4 border-t border-slate-200 bg-slate-50/50">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none",
                isSettingsActive
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 rounded-xl shadow-lg p-2" 
              side={isCollapsed ? "right" : "top"} 
              align={isCollapsed ? "end" : "center"} 
              sideOffset={16}
            >
              <DropdownMenuGroup className="space-y-0.5">
                {settingsMenuItems.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => {
                        router.push(item.href)
                        setIsMobileOpen(false)
                      }}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer rounded-xl px-2.5 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:focus:bg-indigo-500/10 dark:focus:text-indigo-400"
                          : "text-slate-600 focus:bg-slate-100 focus:text-slate-900 dark:text-slate-300 dark:focus:bg-slate-800 dark:focus:text-slate-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}
