"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BadgeCheckIcon,
  BanIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StoreIcon,
} from "lucide-react"

import { useGetSellersQuery, type SellerRecord } from "@/lib/features/marketplace/marketplaceApi"

function SellerFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-130">
        <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by seller name, store name or email..."
          className="h-12 rounded-2xl border-none bg-gray-50 pl-11 shadow-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <button className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
          <span>All Verification</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </button>
        <button className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
          <span>All Plans</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </button>
        <button className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
          <span>All Join Dates</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </button>
        <Button variant="outline" className="h-11 rounded-xl border-gray-200 px-5 font-semibold">
          <FilterIcon size={16} />
          Filters
        </Button>
      </div>
    </div>
  )
}

function SellerTable({ sellers, isLoading }: { sellers: SellerRecord[]; isLoading?: boolean }) {
  const getVerificationBadge = (verification: string) => {
    if (verification.toLowerCase().includes("verified")) {
      return (
        <Badge variant="success" className="gap-1.5 font-bold text-[10px]">
          <BadgeCheckIcon className="size-3.5" />
          {verification}
        </Badge>
      )
    }

    if (verification.toLowerCase().includes("pending")) {
      return (
        <Badge variant="warning" className="gap-1.5 font-bold text-[10px]">
          <AlertCircleIcon className="size-3.5" />
          {verification}
        </Badge>
      )
    }

    return (
      <Badge variant="error" className="gap-1.5 font-bold text-[10px]">
        <BanIcon className="size-3.5" />
        {verification}
      </Badge>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="w-12 p-6">
                <input type="checkbox" className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]" />
              </th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Seller / Store</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Email / Phone</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Verification</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Plan</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Listings</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Rating</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Sales (30d)</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && sellers.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-sm text-gray-400">
                  Loading sellers...
                </td>
              </tr>
            ) : sellers.length ? sellers.map((seller) => (
              <tr key={seller.id} className="transition-colors hover:bg-gray-50/80">
                <td className="p-6">
                  <input
                    type="checkbox"
                    checked={Boolean(seller.selected)}
                    readOnly
                    className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={seller.avatar ?? undefined} />
                      <AvatarFallback>{seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{seller.name}</p>
                      <p className="text-[10px] text-gray-400">{seller.store}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm text-gray-500">{seller.email}</p>
                  <p className="text-xs text-gray-400">{seller.phone}</p>
                </td>
                <td className="p-6">
                  {getVerificationBadge(seller.verification)}
                </td>
                <td className="p-6">
                  <Badge variant="outline" className="rounded-full border-0 bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-600">
                    {seller.plan}
                  </Badge>
                </td>
                <td className="p-6 text-sm font-medium text-gray-900">{seller.listings}</td>
                <td className="p-6">
                  {seller.rating ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <span className="text-amber-400">★</span>
                      <span>{seller.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({seller.reviews})</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-- (0)</span>
                  )}
                </td>
                <td className="p-6 text-sm font-semibold text-gray-900">{seller.sales}</td>
                <td className="p-6">
                  {seller.status.toUpperCase() === "ACTIVE" ? (
                    <Badge variant="success" className="text-[10px] font-bold">ACTIVE</Badge>
                  ) : seller.status.toUpperCase() === "PENDING" ? (
                    <Badge variant="warning" className="text-[10px] font-bold">PENDING</Badge>
                  ) : (
                    <Badge variant="error" className="text-[10px] font-bold">SUSPENDED</Badge>
                  )}
                </td>
                <td className="p-6 text-center">
                  <button className="text-gray-400 transition-colors hover:text-gray-600">
                    <MoreHorizontalIcon size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={10} className="p-6 text-sm text-gray-400">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 p-6">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-gray-900">1 to {Math.min(10, sellers.length || 10)}</span> of <span className="font-medium text-gray-900">{sellers.length.toLocaleString()}</span> sellers
        </p>

        <div className="flex items-center gap-2">
          <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">&lt;</button>
          <button className="flex size-8 items-center justify-center rounded-lg bg-[#6338f6] text-sm font-bold text-white">1</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">2</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">3</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">4</button>
          <span className="px-1 text-gray-400">...</span>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">421</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  )
}

export default function SellersPage() {
  const { data: sellers = [], isLoading, isError, refetch } = useGetSellersQuery()

  const verifiedSellers = sellers.filter((seller) => seller.verification.toLowerCase().includes("verified"))
  const pendingSellers = sellers.filter((seller) => seller.verification.toLowerCase().includes("pending"))
  const suspendedSellers = sellers.filter((seller) => seller.status.toUpperCase() === "SUSPENDED")
  const bannedSellers = sellers.filter((seller) => seller.status.toUpperCase() === "BANNED")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader
          title="Sellers"
          description="Manage sellers, their stores and performance."
        >
          <Button variant="outline" className="h-11 rounded-xl border-gray-200 bg-white px-6 font-semibold">
            <DownloadIcon size={16} />
            Export
          </Button>
        </DashboardHeader>

        <div className="space-y-8 p-8">
          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load sellers. <button className="font-semibold underline" onClick={() => refetch()} type="button">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            <StatsCard
              title="Total Sellers"
              value={isLoading ? "..." : sellers.length.toLocaleString()}
              trend="Live from API"
              icon={StoreIcon}
              iconBgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatsCard
              title="Verified Sellers"
              value={isLoading ? "..." : verifiedSellers.length.toLocaleString()}
              trend="Live from API"
              icon={CheckCircle2Icon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Pending Verification"
              value={isLoading ? "..." : pendingSellers.length.toLocaleString()}
              trend="Live from API"
              icon={AlertCircleIcon}
              iconBgColor="bg-orange-50"
              iconColor="text-orange-600"
            />
            <StatsCard
              title="Suspended Sellers"
              value={isLoading ? "..." : suspendedSellers.length.toLocaleString()}
              trend="Live from API"
              trendType="down"
              icon={AlertTriangleIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
            <StatsCard
              title="Banned Sellers"
              value={isLoading ? "..." : bannedSellers.length.toLocaleString()}
              trend="Live from API"
              trendType="down"
              icon={BanIcon}
              iconBgColor="bg-red-50"
              iconColor="text-red-500"
            />
          </div>

          <div className="space-y-6">
            <SellerFilters />
            <SellerTable sellers={sellers} isLoading={isLoading} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}