"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SellerSubscription } from "@/lib/types/subscription"
import { formatMediaUrl } from "@/lib/media-url"
import {
  StoreIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  CreditCardIcon,
  PackageIcon,
  Edit3Icon,
} from "lucide-react"
import Link from "next/link"

interface SellerProfileModalProps {
  subscription: SellerSubscription | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onGrantPlan?: (sub: SellerSubscription) => void
}

function formatDate(value: string | null | undefined) {
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

export function SellerProfileModal({
  subscription,
  open,
  onOpenChange,
  onGrantPlan,
}: SellerProfileModalProps) {
  const [copied, setCopied] = useState(false)

  if (!subscription) return null

  const seller = subscription.seller
  const businessName = seller?.businessName || "Untitled Store"
  const sellerId = subscription.sellerId
  const logoUrl = seller?.logoUri ? formatMediaUrl(seller.logoUri) : null
  const isUnlimited = subscription.listingLimit === null || subscription.listingLimit < 0
  const limitNumber = isUnlimited ? Infinity : Number(subscription.listingLimit ?? 0)
  const usedNumber = Number(subscription.listingsUsed ?? 0)
  const usagePct = isUnlimited ? 0 : limitNumber > 0 ? Math.min(100, Math.round((usedNumber / limitNumber) * 100)) : 0

  const handleCopyId = () => {
    navigator.clipboard.writeText(sellerId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] rounded-3xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{businessName} Profile</DialogTitle>
        </DialogHeader>

        {/* Profile Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-white p-5 border border-purple-100/60 relative mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-[#6338f6] font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden border border-purple-100 shadow-sm">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={businessName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none"
                  }}
                />
              ) : (
                <span>{businessName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-gray-900 truncate">{businessName}</h3>
                {seller?.isActive !== false ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="size-1.5 rounded-full bg-emerald-500"></span> Active Seller
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-100">
                    <span className="size-1.5 rounded-full bg-rose-500"></span> Suspended
                  </span>
                )}
              </div>

              {/* Seller ID with copy button */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-gray-400 font-mono bg-white/80 px-2 py-0.5 rounded-md border border-gray-100 truncate max-w-[220px]">
                  {sellerId}
                </span>
                <button
                  onClick={handleCopyId}
                  title="Copy Seller ID"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
                >
                  {copied ? <CheckIcon size={14} className="text-emerald-600" /> : <CopyIcon size={14} />}
                </button>
              </div>

              {/* Quick info tags */}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                {seller?.city && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon size={13} className="text-gray-400" />
                    {seller.city}
                  </span>
                )}
                {seller?.phoneNumber && (
                  <a
                    href={`tel:${seller.phoneNumber}`}
                    className="flex items-center gap-1 text-[#6338f6] hover:underline"
                  >
                    <PhoneIcon size={13} />
                    {seller.phoneNumber}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details Section */}
        <div className="space-y-4">
          <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCardIcon size={16} className="text-[#6338f6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Current Subscription
                </span>
              </div>
              <Badge variant={statusVariant(subscription.status)} className="text-[10px] font-extrabold">
                • {subscription.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {subscription.planDisplayName || subscription.planCode}
                </p>
                <p className="text-xs text-gray-400">Plan Code: {subscription.planCode}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-100">
                {subscription.planDisplayName || subscription.planCode}
              </span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Started Date</p>
                <p className="text-xs font-medium text-gray-800 mt-0.5 flex items-center gap-1">
                  <CalendarIcon size={12} className="text-gray-400" />
                  {formatDate(subscription.startedAt)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Expiration Date</p>
                <p className="text-xs font-medium text-gray-800 mt-0.5 flex items-center gap-1">
                  <CalendarIcon size={12} className="text-gray-400" />
                  {formatDate(subscription.expiresAt)}
                </p>
              </div>
            </div>

            {/* Listings Quota Progress */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-gray-700 flex items-center gap-1">
                  <PackageIcon size={13} className="text-gray-400" /> Listings Quota
                </span>
                <span className="font-bold text-gray-900">
                  {usedNumber.toLocaleString()} / {isUnlimited ? "Unlimited" : limitNumber.toLocaleString()} used
                </span>
              </div>
              {!isUnlimited && (
                <div className="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      usagePct >= 90 ? "bg-rose-500" : usagePct >= 75 ? "bg-amber-500" : "bg-[#6338f6]"
                    }`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
              )}
            </div>

            {/* Permissions / Entitlements */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-1.5">
                {subscription.canPostListing !== false ? (
                  <CheckCircle2Icon size={14} className="text-emerald-600" />
                ) : (
                  <XCircleIcon size={14} className="text-rose-500" />
                )}
                <span className={subscription.canPostListing !== false ? "text-gray-700" : "text-gray-400 line-through"}>
                  Post Listings
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {subscription.canChat !== false ? (
                  <CheckCircle2Icon size={14} className="text-emerald-600" />
                ) : (
                  <XCircleIcon size={14} className="text-rose-500" />
                )}
                <span className={subscription.canChat !== false ? "text-gray-700" : "text-gray-400 line-through"}>
                  Buyer Messaging
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-gray-100 mt-5">
          <Link
            href="/dashboard/sellers?tab=sellers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6338f6] hover:underline"
          >
            <StoreIcon size={14} />
            View in Sellers Directory
            <ExternalLinkIcon size={12} />
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-10 px-4 text-xs font-semibold"
            >
              Close
            </Button>

            {onGrantPlan && (
              <Button
                onClick={() => {
                  onOpenChange(false)
                  onGrantPlan(subscription)
                }}
                className="bg-[#6338f6] hover:bg-[#5228e0] text-white rounded-xl h-10 px-4 text-xs font-semibold gap-1.5 shadow-sm"
              >
                <Edit3Icon size={14} />
                Update Plan
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
