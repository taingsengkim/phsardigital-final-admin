"use client"

import { useEffect, useState } from "react"

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
import { useGetBuyersQuery, useGetBuyerSummaryQuery } from "@/lib/redux/service/buyerApi"

const PAGE_SIZE = 10

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export default function BuyersPage() {
  const [status, setStatus] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [pageNumber, setPageNumber] = useState(0)

  const search = useDebounced(searchInput)

  const {
    data: page,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetBuyersQuery({ status: status || undefined, search: search || undefined, pageNumber, pageSize: PAGE_SIZE })

  const {
    data: summary,
    isError: isSummaryError,
  } = useGetBuyerSummaryQuery()

  // Any filter change invalidates the current page offset.
  const changeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPageNumber(0)
  }

  const statValue = (value: number | undefined) =>
    summary ? (value ?? 0).toLocaleString() : isSummaryError ? "—" : "..."

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

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load buyers. <button className="font-semibold underline" onClick={() => refetch()} type="button">Retry</button>
            </div>
          )}

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <StatsCard
              title="Total Buyers"
              value={statValue(summary?.total)}
              trend="Live from API"
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Active Buyers"
              value={statValue(summary?.active)}
              trend="Live from API"
              icon={CheckCircleIcon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard
              title="Suspended Buyers"
              value={statValue(summary?.suspended)}
              trend="Live from API"
              trendType="down"
              icon={AlertTriangleIcon}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-500"
            />
            <StatsCard
              title="Banned Buyers"
              value={statValue(summary?.banned)}
              trend="Live from API"
              trendType="down"
              icon={BanIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
          </div>

          {/* Filters and Table Container */}
          <div>
            <BuyerFilters
              search={searchInput}
              onSearchChange={changeFilter(setSearchInput)}
              status={status}
              onStatusChange={changeFilter(setStatus)}
            />
            <BuyerTable
              page={page}
              isLoading={isLoading}
              isFetching={isFetching}
              onPageChange={setPageNumber}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
