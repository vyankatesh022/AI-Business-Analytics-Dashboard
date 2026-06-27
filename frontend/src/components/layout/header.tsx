"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/layout/user-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Header() {
  const pathname = usePathname()
  
  // Simple breadcrumb logic based on pathname
  const paths = pathname.split('/').filter(Boolean)

  return (
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
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full h-10 w-10 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        <UserMenu />
      </div>
    </header>
  )
}
