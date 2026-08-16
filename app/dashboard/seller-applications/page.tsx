"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { ApplicationTable } from "@/components/seller-applications/application-table"
import { ApplicationDetails } from "@/components/seller-applications/application-details"
import { 
  ClipboardListIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  XCircleIcon,
  DownloadIcon,
  SettingsIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SellerApplication } from "@/lib/types/seller-application"
import { useGetSellerApplicationsQuery } from "@/lib/redux/service/sellerApplicationApi"

export default function SellerApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null)
  const { data: applications = [], isLoading, isError, refetch } = useGetSellerApplicationsQuery()
  const pendingApplications = applications.filter((application) => application.status.toUpperCase().includes("PENDING"))
  const approvedApplications = applications.filter((application) => application.status.toUpperCase().includes("APPROVED"))
  const rejectedApplications = applications.filter((application) => application.status.toUpperCase().includes("REJECTED"))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Seller Applications" 
          description="Review and manage new seller registration applications."
        >
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 font-semibold flex items-center gap-2 bg-white text-gray-700">
              <DownloadIcon size={16} />
              Export
            </Button>
            <Button className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-11 px-6 font-semibold flex items-center gap-2">
              <SettingsIcon size={16} />
              Application Settings
            </Button>
          </div>
        </DashboardHeader>
        
        <div className="flex h-[calc(100vh-80px)] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Applications" 
                value={isLoading ? "..." : applications.length.toLocaleString()}
                trend="Live from API"
                trendType="up"
                icon={ClipboardListIcon}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatsCard 
                title="Pending Review" 
                value={isLoading ? "..." : pendingApplications.length.toLocaleString()}
                subtext="Require your action"
                trendType="neutral"
                icon={ClockIcon}
                iconBgColor="bg-amber-50"
                iconColor="text-amber-500"
              />
              <StatsCard 
                title="Approved" 
                value={isLoading ? "..." : approvedApplications.length.toLocaleString()}
                trend="Live from API"
                trendType="up"
                icon={CheckCircle2Icon}
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-500"
              />
              <StatsCard 
                title="Rejected" 
                value={isLoading ? "..." : rejectedApplications.length.toLocaleString()}
                trend="Live from API"
                trendType="down"
                icon={XCircleIcon}
                iconBgColor="bg-rose-50"
                iconColor="text-rose-500"
              />
            </div>

            {/* Table Section */}
            {isError && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                Failed to load seller applications. <button type="button" onClick={() => refetch()} className="font-semibold underline">Retry</button>
              </div>
            )}
            <ApplicationTable
              applications={applications}
              isLoading={isLoading}
              selectedApplicationId={selectedApplication?.id ?? null}
              onSelectApplication={setSelectedApplication}
            />
          </div>

          {/* Details Sidebar */}
          {selectedApplication && (
            <ApplicationDetails
              application={selectedApplication}
              onClose={() => setSelectedApplication(null)}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
