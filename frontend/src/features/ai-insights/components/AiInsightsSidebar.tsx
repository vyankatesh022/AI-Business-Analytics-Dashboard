"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Lightbulb, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Sparkles, 
  History, 
  Bookmark 
} from 'lucide-react';
import { useAiCopilot } from '@/features/ai-copilot/context/AiCopilotContext';

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  onClick?: () => void;
  isExternal?: boolean;
}

export function AiInsightsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { toggleCopilot } = useAiCopilot();

  const navGroups: { label: string; items: SidebarItem[] }[] = [
    {
      label: 'Intelligence',
      items: [
        { title: 'Overview', href: '/ai-insights', icon: LayoutDashboard },
        { title: 'Executive Brief', href: '/ai-insights/executive-brief', icon: FileText },
        { title: 'Business Health', href: '/ai-insights/business-health', icon: Activity },
      ]
    },
    {
      label: 'Insights',
      items: [
        { title: 'Recommendations', href: '/ai-insights/recommendations', icon: Lightbulb },
        { title: 'Opportunities', href: '/ai-insights/opportunities', icon: Target },
        { title: 'Risk Center', href: '/ai-insights/risk-center', icon: ShieldAlert },
        { title: 'Predictions', href: '/ai-insights/predictions', icon: TrendingUp },
        { title: 'Anomalies', href: '/ai-insights/anomalies', icon: AlertTriangle },
      ]
    },
    {
      label: 'Tools & History',
      items: [
        { title: 'AI Copilot', icon: Sparkles, onClick: toggleCopilot, isExternal: true },
        { title: 'Insight History', href: '/ai-insights/history', icon: History },
        { title: 'Saved Insights', href: '/ai-insights/saved', icon: Bookmark },
      ]
    }
  ];

  return (
    <aside className={cn("flex flex-col w-64 border-r border-slate-200 bg-white/90 backdrop-blur-xl h-full flex-shrink-0", className)}>
      <div className="flex h-16 items-center border-b border-slate-200 px-6 shrink-0 bg-gradient-to-r from-indigo-50/50 to-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-900 tracking-tight text-sm">AI Insights</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1.5">
            <p className="px-2 text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = item.href ? (item.href === '/ai-insights' ? pathname === item.href : pathname.startsWith(item.href)) : false;

              const LinkComponent = item.href ? Link : 'button';
              const linkProps = item.href ? { href: item.href } : { onClick: item.onClick };

              return (
                <LinkComponent
                  key={item.title}
                  {...linkProps}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                  <span>{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  )}
                </LinkComponent>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
