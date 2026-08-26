"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon, SearchIcon, PlusIcon, BanIcon, Edit3Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SellerSubscription, SubscriptionPlan } from "@/lib/types/subscription"
import {
  useGetSellerSubscriptionsQuery,
  useCancelSellerSubscriptionMutation,
} from "@/lib/redux/service/subscriptionApi"
import { GrantSubscriptionModal } from "./grant-subscription-modal"

interface SubscriptionTableProps {
  plans: SubscriptionPlan[]
}

const TABS = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
]

function formatDate(value: string | null) {
  if (!value) return "—"
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function statusVariant(status: string) {
  const upper = status.toUpperCase()
  if (upper === "ACTIVE") return "success" as const
  if (upper === "EXPIRED") return "warning" as const
  if (upper === "CANCELLED") return "destructive" as const
  return "secondary" as const
}

import { showToast } from "@/components/ui/toast-popup"
import { ConfirmModal } from "@/components/ui/confirm-modal"

export function SubscriptionTable({ plans }: SubscriptionTableProps) {
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [pageNumber, setPageNumber] = useState(0)
  const [activeMenuSellerId, setActiveMenuSellerId] = useState<string | null>(null)
  const [selectedSubForGrant, setSelectedSubForGrant] = useState<SellerSubscription | null>(null)
  const [isGrantOpen, setIsGrantOpen] = useState(false)
  const [cancelSellerId, setCancelSellerId] = useState<string | null>(null)
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false)

  const { data, isLoading, isFetching } = useGetSellerSubscriptionsQuery({
    status: status || undefined,
    pageNumber,
    pageSize: 10,
  })

  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSellerSubscriptionMutation()

  const subscriptions = data?.content ?? []
  const totalElements = data?.page.totalElements ?? 0
  const totalPages = data?.page.totalPages ?? 1
  const pageSize = data?.page.size ?? 10
  const firstRow = totalElements === 0 ? 0 : pageNumber * pageSize + 1
  const lastRow = Math.min(totalElements, pageNumber * pageSize + subscriptions.length)

  // Filter client side search by sellerId or planCode if provided
  const filtered = subscriptions.filter((sub) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      sub.sellerId.toLowerCase().includes(q) ||
      sub.planCode.toLowerCase().includes(q) ||
      (sub.planDisplayName && sub.planDisplayName.toLowerCase().includes(q))
    )
  })

  const handleGrant = (sub?: SellerSubscription) => {
    setSelectedSubForGrant(sub || null)
    setIsGrantOpen(true)
    setActiveMenuSellerId(null)
  }

  const promptCancel = (sellerId: string) => {
    setCancelSellerId(sellerId)
    setIsConfirmCancelOpen(true)
    setActiveMenuSellerId(null)
  }

  const handleConfirmCancel = async () => {
    if (!cancelSellerId) return
    try {
      await cancelSubscription(cancelSellerId).unwrap()
      showToast({
        type: "success",
        title: "Subscription Cancelled",
        message: `Subscription for seller ${cancelSellerId} was successfully cancelled.`,
      })
    } catch (err: unknown) {
      showToast({
        type: "error",
        title: "Cancellation Failed",
        message: err instanceof Error ? err.message : "Failed to cancel subscription.",
      })
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <h4 className="text-base sm:text-lg font-bold mr-2 sm:mr-4 whitespace-nowrap">Seller Subscriptions</h4>
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatus(tab.value)
                setPageNumber(0)
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                status === tab.value
                  ? "bg-[#6338f6] text-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by seller ID or plan..." 
              className="pl-10 bg-gray-50/90 border border-gray-200/70 rounded-xl h-10 w-full sm:w-64 text-xs font-medium focus:ring-2 focus:ring-[#6338f6]/30 focus:border-[#6338f6]"
            />
          </div>
          <Button 
            onClick={() => handleGrant()}
            className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] text-white h-10 px-4 flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0"
          >
            <PlusIcon size={14} />
            Grant Subscription
          </Button>
        </div>
      </div>
      
      {isFetching && !isLoading && (
        <div className="px-6 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-100/60">
          Refreshing subscriptions...
        </div>
      )}

      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100/80 bg-gray-50/50">
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Seller ID</th>
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Plan</th>
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest hidden sm:table-cell">Started</th>
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest hidden md:table-cell">Expires</th>
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Listings Used</th>
              <th className="p-4 sm:p-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/60">
            {isLoading && filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-sm text-gray-400 text-center font-medium">
                  Loading seller subscriptions...
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((sub) => (
                <tr key={sub.sellerId} className="hover:bg-gray-50/90 transition-colors group">
                  <td className="p-4 sm:p-6">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[150px] sm:max-w-[200px] group-hover:text-[#6338f6] transition-colors">
                      {sub.sellerId}
                    </p>
                  </td>
                  <td className="p-4 sm:p-6">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-100">
                      {sub.planDisplayName || sub.planCode}
                    </span>
                  </td>
                  <td className="p-4 sm:p-6">
                    <Badge 
                      variant={statusVariant(sub.status)}
                      className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap"
                    >
                      • {sub.status}
                    </Badge>
                  </td>
                  <td className="p-4 sm:p-6 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                    {formatDate(sub.startedAt)}
                  </td>
                  <td className="p-4 sm:p-6 text-xs sm:text-sm text-gray-700 hidden md:table-cell">
                    {formatDate(sub.expiresAt)}
                  </td>
                  <td className="p-4 sm:p-6 text-xs sm:text-sm text-gray-700 font-medium hidden lg:table-cell">
                    {sub.listingsUsed.toLocaleString()} / {sub.listingLimit === null ? "∞" : sub.listingLimit}
                  </td>
                  <td className="p-4 sm:p-6 text-center relative">
                    <button 
                      onClick={() => setActiveMenuSellerId(activeMenuSellerId === sub.sellerId ? null : sub.sellerId)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontalIcon size={18} />
                    </button>

                    {activeMenuSellerId === sub.sellerId && (
                      <div className="absolute right-6 top-12 z-20 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-left">
                        <button
                          onClick={() => handleGrant(sub)}
                          className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit3Icon size={14} className="text-[#6338f6]" />
                          Update / Grant Plan
                        </button>
                        {sub.status === "ACTIVE" && (
                          <button
                            onClick={() => promptCancel(sub.sellerId)}
                            className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-gray-50"
                          >
                            <BanIcon size={14} />
                            Cancel Subscription
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-6 text-sm text-gray-400 text-center">
                  No seller subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-50">
        <p className="text-xs text-gray-400 font-medium text-center sm:text-left">
          Showing {firstRow}-{lastRow} of {totalElements.toLocaleString()} subscriptions
        </p>
        
        <div className="flex items-center gap-1.5">
          <button 
            disabled={pageNumber === 0}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
          >
            &lt;
          </button>
          <span className="text-xs font-bold px-3 py-1 bg-gray-50 rounded-lg text-gray-700">
            Page {pageNumber + 1} of {totalPages}
          </span>
          <button 
            disabled={pageNumber >= totalPages - 1}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal for Granting/Updating Seller Subscription */}
      <GrantSubscriptionModal
        subscription={selectedSubForGrant}
        plans={plans}
        open={isGrantOpen}
        onOpenChange={setIsGrantOpen}
      />

      {/* Popup Confirmation for Cancelling Subscription */}
      <ConfirmModal
        open={isConfirmCancelOpen}
        onOpenChange={setIsConfirmCancelOpen}
        title="Cancel Seller Subscription"
        description={`Are you sure you want to cancel the subscription for seller "${cancelSellerId}"? This action takes effect immediately.`}
        confirmText="Cancel Subscription"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
      />
    </div>
  )
}
