"use client"

import { SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { ListingPage, ListingRecord } from "@/lib/types/listing"
import { ALL_STATUSES, LISTING_STATUSES } from "@/lib/types/listing"

export interface CategoryOption {
  slug: string
  name: string
}

export interface SellerOption {
  id: string
  name: string
}

interface ListingModerationTableProps {
  page: ListingPage | undefined
  isLoading?: boolean
  isFetching?: boolean
  selectedListingId?: string | null
  onSelectListing?: (listingId: string) => void
  status: string
  onStatusChange: (status: string) => void
  categorySlug: string
  onCategoryChange: (slug: string) => void
  categoryOptions: CategoryOption[]
  sellerId: string
  onSellerChange: (sellerId: string) => void
  sellerOptions: SellerOption[]
  search: string
  onSearchChange: (search: string) => void
  onPageChange: (pageNumber: number) => void
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Live",
  DRAFT: "Draft",
  SOLD_OUT: "Sold out",
  ARCHIVED: "Archived",
  SUSPENDED: "Suspended",
}

function statusVariant(status: string) {
  if (status === "ACTIVE") return "success" as const
  if (status === "SUSPENDED" || status === "ARCHIVED") return "destructive" as const
  return "warning" as const
}

export function formatPrice(value: number | null) {
  if (value === null) {
    return "—"
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown"
  }

  const parsed = new Date(value)

  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

/** A short window of page buttons around the current page. */
function pageWindow(current: number, totalPages: number) {
  const start = Math.max(0, Math.min(current - 2, totalPages - 5))

  return Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index)
}

const selectClass =
  "bg-gray-50 px-4 h-10 rounded-xl text-xs font-bold text-gray-600 border border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6338f6] transition-colors"

export function ListingModerationTable({
  page,
  isLoading,
  isFetching,
  selectedListingId,
  onSelectListing,
  status,
  onStatusChange,
  categorySlug,
  onCategoryChange,
  categoryOptions,
  sellerId,
  onSellerChange,
  sellerOptions,
  search,
  onSearchChange,
  onPageChange,
}: ListingModerationTableProps) {
  const listings: ListingRecord[] = page?.items ?? []
  const pageNumber = page?.pageNumber ?? 0
  const pageSize = page?.pageSize ?? 10
  const totalElements = page?.totalElements ?? 0
  const totalPages = page?.totalPages ?? 1
  const firstRow = totalElements === 0 ? 0 : pageNumber * pageSize + 1
  const lastRow = Math.min(totalElements, pageNumber * pageSize + listings.length)

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900">Active Listings Monitor</h4>
            <p className="text-sm text-gray-500">
              Monitoring all marketplace listings for policy compliance.
            </p>
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search listings..."
              className="pl-10 h-10 w-full md:w-64 rounded-xl border-gray-100 bg-gray-50 text-xs font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className={selectClass}
          >
            <option value={ALL_STATUSES}>All statuses</option>
            {LISTING_STATUSES.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option] ?? option}
              </option>
            ))}
          </select>

          <select
            value={categorySlug}
            onChange={(event) => onCategoryChange(event.target.value)}
            className={selectClass}
          >
            <option value="">All categories</option>
            {categoryOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.name}
              </option>
            ))}
          </select>

          <select
            value={sellerId}
            onChange={(event) => onSellerChange(event.target.value)}
            className={selectClass}
          >
            <option value="">All sellers</option>
            {sellerOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>

          {isFetching && !isLoading && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Refreshing…
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-sm text-gray-400">
                  Loading listings...
                </td>
              </tr>
            ) : listings.length ? (
              listings.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectListing?.(item.id)}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer ${selectedListingId === item.id ? "bg-gray-50/70" : ""}`}
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 shrink-0 rounded-xl bg-gray-100 overflow-hidden relative">
                        {item.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.imageUrl} alt={item.title} className="size-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gray-900/5 group-hover:bg-transparent transition-colors" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{item.title}</p>
                        <p className="text-[10px] font-medium text-gray-400">
                          {item.stockQty} in stock · {item.sold} sold
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-bold text-gray-700">{item.sellerName}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-medium text-gray-500">{item.categoryName}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#6338f6]">
                        {formatPrice(item.discountPrice ?? item.fullPrice)}
                      </span>
                      {item.discountPrice !== null && (
                        <span className="text-[10px] font-medium text-gray-400 line-through">
                          {formatPrice(item.fullPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-xs font-medium text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <Badge variant={statusVariant(item.status)} className="rounded-lg px-3 py-1 text-[10px]">
                      {STATUS_LABELS[item.status] ?? item.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-sm text-gray-400">
                  No listings match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          Showing {firstRow}-{lastRow} of {totalElements.toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pageNumber === 0}
            onClick={() => onPageChange(pageNumber - 1)}
            className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            &lt;
          </button>
          {pageWindow(pageNumber, totalPages).map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(index)}
              className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                index === pageNumber
                  ? "bg-[#6338f6] text-white"
                  : "border border-gray-100 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={pageNumber >= totalPages - 1}
            onClick={() => onPageChange(pageNumber + 1)}
            className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
