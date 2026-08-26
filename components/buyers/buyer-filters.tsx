import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BUYER_STATUSES } from "@/lib/types/buyer"

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
  REJECTED: "Rejected",
  BANNED: "Banned",
}

const selectClass =
  "bg-gray-50 px-4 h-10 rounded-xl text-xs font-bold text-gray-600 border border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6338f6] transition-colors"

interface BuyerFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
}

export function BuyerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: BuyerFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-gray-100 mb-4 sm:mb-6">
      <div className="relative w-full sm:w-80 lg:w-96">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="pl-10 bg-gray-50 border-none rounded-xl h-10 sm:h-11 text-xs font-medium w-full"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`${selectClass} w-full sm:w-auto`}
        >
          <option value="">All statuses</option>
          {BUYER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s] ?? s}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
