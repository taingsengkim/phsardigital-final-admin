"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { ReportQueueTable } from "@/components/reports/report-queue-table"
import { useGetReportsQuery } from "@/lib/redux/service/reportApi"
import { 
  AlertCircleIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  ShieldAlertIcon,
  RotateCcwIcon,
} from "lucide-react"

export default function ReportsPage() {
  // Query summary counts
  const { data: openReportsData } = useGetReportsQuery({ status: "OPEN", pageSize: 1 })
  const { data: resolvedReportsData } = useGetReportsQuery({ status: "RESOLVED", pageSize: 1 })
  const { data: dismissedReportsData } = useGetReportsQuery({ status: "DISMISSED", pageSize: 1 })
  const { data: allReportsData } = useGetReportsQuery({ status: "ALL", pageSize: 1 })

  const openCount = openReportsData?.page.totalElements ?? 0
  const resolvedCount = resolvedReportsData?.page.totalElements ?? 0
  const dismissedCount = dismissedReportsData?.page.totalElements ?? 0
  const totalCount = allReportsData?.page.totalElements ?? (openCount + resolvedCount + dismissedCount)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc] flex flex-col h-full overflow-y-auto">
        <DashboardHeader 
          title="Moderation Queue" 
          description="Review user reports, take action on reported targets, and manage platform safety."
        />
        
        <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard 
              title="Open Reports" 
              value={openCount.toLocaleString()} 
              subtext="Requires Admin Attention"
              trendType="up"
              icon={ClockIcon}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-600"
            />
            <StatsCard 
              title="Resolved" 
              value={resolvedCount.toLocaleString()} 
              subtext="Corrective Action Taken"
              trendType="neutral"
              icon={CheckCircle2Icon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatsCard 
              title="Dismissed" 
              value={dismissedCount.toLocaleString()} 
              subtext="No Violation Found"
              trendType="neutral"
              icon={RotateCcwIcon}
              iconBgColor="bg-gray-100"
              iconColor="text-gray-600"
            />
            <StatsCard 
              title="Total Incident Reports" 
              value={totalCount.toLocaleString()} 
              subtext="Platform Lifetime"
              trendType="neutral"
              icon={AlertCircleIcon}
              iconBgColor="bg-purple-50"
              iconColor="text-[#6338f6]"
            />
          </div>

          {/* Queue Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Reports Working Set</h3>
                <p className="text-xs text-gray-500">
                  Click any row to open the investigation panel, review accusations, and act on the reported target.
                </p>
              </div>
            </div>

            <ReportQueueTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
