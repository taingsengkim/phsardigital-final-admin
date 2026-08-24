"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatsCard } from "@/components/dashboard/stats-card"
import {
  ChevronDownIcon,
  DownloadIcon,
  FilterIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  SearchIcon,
  ShoppingBagIcon,
  StarIcon,
  StoreIcon,
} from "lucide-react"

import type { Seller } from "@/lib/types/seller"

export function SellerStats({ sellers, isLoading }: { sellers: Seller[]; isLoading?: boolean }) {
  const rated = sellers.filter((seller) => seller.rating !== null && seller.rating > 0)
  const averageRating = rated.length
    ? rated.reduce((total, seller) => total + (seller.rating ?? 0), 0) / rated.length
    : 0
  const totalReviews = sellers.reduce((total, seller) => total + (seller.reviews ?? 0), 0)
  const completedOrders = sellers.reduce((total, seller) => total + seller.completedOrders, 0)

  return (
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
        title="Rated Sellers"
        value={isLoading ? "..." : rated.length.toLocaleString()}
        trend="With customer ratings"
        icon={StarIcon}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatsCard
        title="Average Rating"
        value={isLoading ? "..." : averageRating.toFixed(1)}
        trend="Seller directory average"
        icon={StarIcon}
        iconBgColor="bg-orange-50"
        iconColor="text-orange-600"
      />
      <StatsCard
        title="Customer Reviews"
        value={isLoading ? "..." : totalReviews.toLocaleString()}
        trend="Across listed sellers"
        icon={MessageSquareTextIcon}
        iconBgColor="bg-violet-50"
        iconColor="text-violet-600"
      />
      <StatsCard
        title="Completed Orders"
        value={isLoading ? "..." : completedOrders.toLocaleString()}
        trend="All-time seller orders"
        icon={ShoppingBagIcon}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />
    </div>
  )
}

export function SellerFilters({
  onExport,
  onRefresh,
  isLoading,
  exportDisabled,
}: {
  onExport: () => void
  onRefresh: () => void
  isLoading?: boolean
  exportDisabled?: boolean
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-130">
          <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by business name or location..."
            className="h-11 rounded-xl border-none bg-gray-50 pl-11 shadow-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onExport}
            disabled={exportDisabled}
            className="h-10 flex-1 rounded-xl border-gray-200 px-3.5 text-xs font-semibold text-gray-600 hover:text-gray-900 sm:flex-none"
          >
            <DownloadIcon size={14} /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="h-10 flex-1 rounded-xl border-gray-200 px-3.5 text-xs font-semibold text-gray-600 hover:text-gray-900 sm:flex-none"
          >
            <RefreshCwIcon size={14} className={isLoading ? "animate-spin text-[#6338f6]" : ""} /> Refresh data
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">Filter sellers</span>
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

export function SellerTable({ sellers, isLoading }: { sellers: Seller[]; isLoading?: boolean }) {
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
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Location</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Rating</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Reviews</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Completed Orders</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && sellers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-sm text-gray-400">
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
                      <p className="max-w-44 truncate font-mono text-[10px] text-gray-400" title={seller.id}>{seller.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPinIcon size={13} className="shrink-0 text-gray-400" />
                    <span className="max-w-48 truncate" title={seller.location}>{seller.location}</span>
                  </div>
                </td>
                <td className="p-6">
                  {seller.rating ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <StarIcon size={14} className="fill-amber-400 text-amber-400" />
                      <span>{seller.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Not rated</span>
                  )}
                </td>
                <td className="p-6 text-sm font-medium text-gray-700">{(seller.reviews ?? 0).toLocaleString()}</td>
                <td className="p-6 text-sm font-semibold text-gray-900">{seller.completedOrders.toLocaleString()}</td>
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
                <td colSpan={8} className="p-6 text-sm text-gray-400">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-50 p-6">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-gray-900">{sellers.length.toLocaleString()}</span> sellers from the live seller directory
        </p>
      </div>
    </div>
  )
}
