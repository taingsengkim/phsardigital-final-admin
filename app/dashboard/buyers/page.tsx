import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { BuyerFilters } from "@/components/buyers/buyer-filters"
import { BuyerTable } from "@/components/buyers/buyer-table"
import { 
  UsersIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  BanIcon,
  DownloadIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BuyersPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Buyers" 
          description="Manage and monitor all buyer accounts."
        >
          <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 font-semibold flex items-center gap-2 bg-white">
            <DownloadIcon size={16} />
            Export
          </Button>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Buyers" 
              value="24,385" 
              trend="8.3% vs last week" 
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard 
              title="Active Buyers" 
              value="22,145" 
              trend="6.7% vs last week" 
              icon={CheckCircleIcon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard 
              title="Suspended Buyers" 
              value="198" 
              trend="2.1% vs last week" 
              trendType="down"
              icon={AlertTriangleIcon}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-500"
            />
            <StatsCard 
              title="Banned Buyers" 
              value="42" 
              trend="1.3% vs last week" 
              trendType="down"
              icon={BanIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
          </div>

          {/* Filters and Table Container */}
          <div>
            <BuyerFilters />
            <BuyerTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
