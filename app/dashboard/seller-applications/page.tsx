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

export default function SellerApplicationsPage() {
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
                value="245" 
                trend="18.6% vs last week" 
                trendType="up"
                icon={ClipboardListIcon}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatsCard 
                title="Pending Review" 
                value="78" 
                subtext="Require your action"
                trendType="neutral"
                icon={ClockIcon}
                iconBgColor="bg-amber-50"
                iconColor="text-amber-500"
              />
              <StatsCard 
                title="Approved" 
                value="142" 
                trend="22.4% vs last week" 
                trendType="up"
                icon={CheckCircle2Icon}
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-500"
              />
              <StatsCard 
                title="Rejected" 
                value="25" 
                trend="8.1% vs last week" 
                trendType="down"
                icon={XCircleIcon}
                iconBgColor="bg-rose-50"
                iconColor="text-rose-500"
              />
            </div>

            {/* Table Section */}
            <ApplicationTable />
          </div>

          {/* Details Sidebar */}
          <ApplicationDetails />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
