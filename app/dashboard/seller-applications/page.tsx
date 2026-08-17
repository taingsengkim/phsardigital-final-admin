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
  RefreshCwIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SellerApplication } from "@/lib/types/seller-application"
import { useGetSellerApplicationsQuery } from "@/lib/redux/service/sellerApplicationApi"

export default function SellerApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null)
  const { data: applications = [], isLoading, isError, refetch } = useGetSellerApplicationsQuery()

  const pendingApplications = applications.filter((app) => app.status.toUpperCase().includes("PENDING"))
  const approvedApplications = applications.filter((app) => app.status.toUpperCase().includes("APPROVED"))
  const rejectedApplications = applications.filter((app) => app.status.toUpperCase().includes("REJECTED"))

  const handleExportCSV = () => {
    if (applications.length === 0) return
    const headers = ["ID", "Business Name", "Applicant Name", "Email", "Phone", "Status", "Applied On"]
    const rows = applications.map((app) => [
      app.id,
      `"${app.businessName.replaceAll('"', '""')}"`,
      `"${app.name.replaceAll('"', '""')}"`,
      app.email,
      app.phone,
      app.status,
      app.appliedOn,
    ])

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `seller-applications-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Seller Applications" 
          description="Review, approve, and manage seller registration requests."
        >
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={applications.length === 0}
              className="rounded-xl border-gray-200 h-10 px-4 font-semibold text-xs flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
            >
              <DownloadIcon size={15} />
              Export CSV
            </Button>
            <Button
              onClick={() => refetch()}
              className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-10 px-4 font-semibold text-xs flex items-center gap-2 shadow-sm shadow-purple-500/20"
            >
              <RefreshCwIcon size={15} className={isLoading ? "animate-spin" : ""} />
              Refresh Data
            </Button>
          </div>
        </DashboardHeader>
        
        <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatsCard 
                title="Total Applications" 
                value={isLoading ? "..." : applications.length.toLocaleString()}
                trend="Live Backend API"
                trendType="up"
                icon={ClipboardListIcon}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatsCard 
                title="Pending Review" 
                value={isLoading ? "..." : pendingApplications.length.toLocaleString()}
                subtext="Requires admin decision"
                trendType="neutral"
                icon={ClockIcon}
                iconBgColor="bg-amber-50"
                iconColor="text-amber-600"
              />
              <StatsCard 
                title="Approved" 
                value={isLoading ? "..." : approvedApplications.length.toLocaleString()}
                trend="Active Sellers"
                trendType="up"
                icon={CheckCircle2Icon}
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <StatsCard 
                title="Rejected" 
                value={isLoading ? "..." : rejectedApplications.length.toLocaleString()}
                trend="Declined Requests"
                trendType="down"
                icon={XCircleIcon}
                iconBgColor="bg-rose-50"
                iconColor="text-rose-600"
              />
            </div>

            {/* Error Notification Banner */}
            {isError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center justify-between">
                <span>Failed to connect to seller application service.</span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="font-bold underline hover:text-rose-950"
                >
                  Retry API
                </button>
              </div>
            )}

            {/* Main Application Table Component */}
            <ApplicationTable
              applications={applications}
              isLoading={isLoading}
              selectedApplicationId={selectedApplication?.id ?? null}
              onSelectApplication={setSelectedApplication}
              onRefresh={refetch}
            />
          </div>

          {/* Details Sidebar / Mobile Drawer */}
          {selectedApplication && (
            <div className="lg:static fixed inset-0 z-40 flex justify-end bg-gray-900/40 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none transition-all">
              <ApplicationDetails
                application={selectedApplication}
                onClose={() => setSelectedApplication(null)}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
