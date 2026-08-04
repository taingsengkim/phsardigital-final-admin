"use client"

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
import { useGetBuyersQuery } from "@/lib/features/marketplace/marketplaceApi"

export default function BuyersPage() {
  const { data: buyers = [], isLoading, isError, refetch } = useGetBuyersQuery()

  const activeBuyers = buyers.filter((buyer) => buyer.status.toLowerCase() === "active")
  const suspendedBuyers = buyers.filter((buyer) => buyer.status.toLowerCase() === "suspended")
  const bannedBuyers = buyers.filter((buyer) => buyer.status.toLowerCase() === "banned")

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
          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load buyers. <button className="font-semibold underline" onClick={() => refetch()} type="button">Retry</button>
            </div>
          )}

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Buyers" 
              value={isLoading ? "..." : buyers.length.toLocaleString()} 
              trend="Live from API" 
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard 
              title="Active Buyers" 
              value={isLoading ? "..." : activeBuyers.length.toLocaleString()} 
              trend="Live from API" 
              icon={CheckCircleIcon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard 
              title="Suspended Buyers" 
              value={isLoading ? "..." : suspendedBuyers.length.toLocaleString()} 
              trend="Live from API" 
              trendType="down"
              icon={AlertTriangleIcon}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-500"
            />
            <StatsCard 
              title="Banned Buyers" 
              value={isLoading ? "..." : bannedBuyers.length.toLocaleString()} 
              trend="Live from API" 
              trendType="down"
              icon={BanIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
          </div>

          {/* Filters and Table Container */}
          <div>
            <BuyerFilters />
            <BuyerTable buyers={buyers} isLoading={isLoading} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
