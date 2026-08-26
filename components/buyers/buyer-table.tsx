"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon } from "lucide-react"
import type { Buyer, BuyerPage } from "@/lib/types/buyer"

interface BuyerTableProps {
  page: BuyerPage | undefined
  isLoading?: boolean
  isFetching?: boolean
  onPageChange: (pageNumber: number) => void
}

function formatDate(value: string | null) {
  if (!value) return "Unknown"
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function formatTime(value: string | null) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime())
    ? null
    : parsed.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function statusVariant(status: string) {
  const upper = status.toUpperCase()
  if (upper === "ACTIVE") return "success" as const
  if (upper === "SUSPENDED") return "warning" as const
  if (upper === "BANNED" || upper === "REJECTED") return "destructive" as const
  return "secondary" as const
}

/** A short window of page buttons around the current page. */
function pageWindow(current: number, totalPages: number) {
  const start = Math.max(0, Math.min(current - 2, totalPages - 5))
  return Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index)
}

export function BuyerTable({ page, isLoading, isFetching, onPageChange }: BuyerTableProps) {
  const buyers: Buyer[] = page?.content ?? []
  const pageNumber = page?.page.number ?? 0
  const pageSize = page?.page.size ?? 10
  const totalElements = page?.page.totalElements ?? 0
  const totalPages = page?.page.totalPages ?? 1
  const firstRow = totalElements === 0 ? 0 : pageNumber * pageSize + 1
  const lastRow = Math.min(totalElements, pageNumber * pageSize + buyers.length)

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {isFetching && !isLoading && (
        <div className="px-4 sm:px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 bg-gray-50/50">
          Refreshing…
        </div>
      )}

      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left border-collapse min-w-[320px]">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Buyer</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Phone</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Join Date</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Total Orders</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Total Spent</th>
              <th className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && buyers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-sm text-gray-400 text-center">
                  Loading buyers...
                </td>
              </tr>
            ) : buyers.length ? (
              buyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Avatar className="size-9 sm:size-10 shrink-0">
                        <AvatarImage src={buyer.avatarUrl ?? undefined} />
                        <AvatarFallback>{(buyer.fullName || "?").substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[130px] sm:max-w-[180px] md:max-w-none">{buyer.fullName}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[130px] sm:max-w-[180px]">{buyer.username || buyer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                    <span className="truncate block max-w-[160px] md:max-w-[220px]">{buyer.email}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-500 hidden lg:table-cell">{buyer.phone ?? "—"}</td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <Badge
                      variant={statusVariant(buyer.status)}
                      className="font-bold text-[10px] whitespace-nowrap"
                    >
                      • {buyer.status}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 hidden md:table-cell">
                    <p className="text-xs sm:text-sm text-gray-900">{formatDate(buyer.joinedAt)}</p>
                    {formatTime(buyer.joinedAt) && <p className="text-[10px] text-gray-400">{formatTime(buyer.joinedAt)}</p>}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-900 font-medium hidden xl:table-cell">{buyer.totalOrders.toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-900 font-bold hidden xl:table-cell">{formatCurrency(buyer.totalSpent)}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-center">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <MoreHorizontalIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-sm text-gray-400 text-center">
                  No buyers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-50">
        <p className="text-xs text-gray-400 font-medium text-center sm:text-left">
          Showing {firstRow}-{lastRow} of {totalElements.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full py-1">
          <button
            type="button"
            disabled={pageNumber === 0}
            onClick={() => onPageChange(pageNumber - 1)}
            className="size-7 sm:size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent shrink-0"
          >
            &lt;
          </button>
          {pageWindow(pageNumber, totalPages).map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(index)}
              className={`size-7 sm:size-8 rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-bold transition-colors shrink-0 ${
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
            className="size-7 sm:size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent shrink-0"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
