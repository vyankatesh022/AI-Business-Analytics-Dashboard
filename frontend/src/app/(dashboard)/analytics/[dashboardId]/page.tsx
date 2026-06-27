"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardBuilder } from '@/features/analytics/components/DashboardBuilder';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardViewPage() {
  const params = useParams();
  const router = useRouter();
  const dashboardId = params.dashboardId as string;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Top Navigation Bar for Dashboard */}
      <div className="h-14 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 shrink-0 shadow-sm">
        <Link 
          href="/analytics"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analytics
        </Link>
      </div>

      {/* Dashboard Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <DashboardBuilder dashboardId={dashboardId} />
      </div>
    </div>
  );
}
