"use client"

import { useState } from "react"
import {
  ClipboardListIcon,
  BanIcon,
  UserXIcon,
  FlagIcon,
  KeyboardIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ListingRecord } from "@/lib/types/listing"
import {
  useUpdateListingStatusMutation,
  useSuspendListingMutation,
  useRestoreListingMutation,
} from "@/lib/features/listings/listingsApi"
import { useSuspendSellerMutation } from "@/lib/redux/service/sellerApi"
import { formatPrice } from "@/components/moderation/listing-moderation-table"

interface ListingAuditSidebarProps {
  listing: ListingRecord | null
}

const NOTES_MAX_LENGTH = 1000

function errorMessage(error: unknown, fallback: string) {
  const candidate = error as
    | { data?: { message?: unknown }; message?: unknown; status?: unknown }
    | null

  if (typeof candidate?.data?.message === "string") {
    return candidate.data.message
  }
  if (typeof candidate?.message === "string") {
    return candidate.message
  }
  if (typeof candidate?.status === "number") {
    return `Request failed with status ${candidate.status}`
  }

  return fallback
}

export function ListingAuditSidebar({ listing }: ListingAuditSidebarProps) {
  const [internalNotes, setInternalNotes] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionResult, setActionResult] = useState<string | null>(null)

  const [updateListingStatus, { isLoading: isUpdatingListing }] = useUpdateListingStatusMutation()
  const [suspendListing, { isLoading: isSuspendingListing }] = useSuspendListingMutation()
  const [restoreListing, { isLoading: isRestoringListing }] = useRestoreListingMutation()
  const [suspendSeller, { isLoading: isSuspendingSeller }] = useSuspendSellerMutation()

  const isBusy = isUpdatingListing || isSuspendingListing || isRestoringListing || isSuspendingSeller

  const handleUpdateStatus = async (status: string, label: string) => {
    if (!listing) return

    setActionError(null)
    setActionResult(null)

    try {
      if (status === "SUSPENDED") {
        await suspendListing({ id: listing.id, reason: internalNotes.trim() || undefined }).unwrap()
      } else if (status === "ACTIVE" && (listing.status === "SUSPENDED" || listing.status === "ARCHIVED")) {
        await restoreListing(listing.id).unwrap()
      } else {
        await updateListingStatus({ id: listing.id, status }).unwrap()
      }
      setActionResult(`${listing.title} — ${label}.`)
    } catch (error) {
      console.error("Failed to update listing status", error)
      setActionError(errorMessage(error, "Failed to update listing status."))
    }
  }

  const handleBanSeller = async () => {
    if (!listing?.sellerId) return

    const reason = internalNotes.trim()

    if (!reason) {
      setActionResult(null)
      setActionError("A suspension reason is required before banning a seller.")
      return
    }

    setActionError(null)
    setActionResult(null)

    try {
      await suspendSeller({ sellerId: listing.sellerId, reason }).unwrap()
      setActionResult(`${listing.sellerName} suspended.`)
      setInternalNotes("")
    } catch (error) {
      console.error("Failed to suspend seller", error)
      setActionError(errorMessage(error, "Failed to suspend seller."))
    }
  }

  return (
    <div className="w-full xl:w-96 shrink-0 flex flex-col gap-6 xl:sticky xl:top-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6338f6]">
            <ClipboardListIcon size={16} />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Listing Audit Panel</h4>
        </div>

        <div className="p-6 space-y-6">
          <div className="aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden relative">
            {listing?.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={listing.imageUrl} alt={listing.title} className="size-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product Name</p>
              <p className="text-xs font-bold text-gray-900">{listing?.title ?? "Select a listing"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
              <p className="text-xs font-bold text-gray-900">{listing?.categoryName ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seller</p>
              <p className="text-xs font-bold text-[#6338f6]">{listing?.sellerName ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
              <p className="text-xs font-bold text-[#6338f6]">
                {listing ? formatPrice(listing.discountPrice ?? listing.fullPrice) : "—"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-xs font-bold text-gray-900">{listing?.status ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock / Sold</p>
              <p className="text-xs font-bold text-gray-900">
                {listing ? `${listing.stockQty} / ${listing.sold}` : "-"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {listing?.description ?? "Select a listing to review its moderation details."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
              Suspension reason (used when banning a seller)
            </p>
            <Textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))}
              placeholder="Explain the policy violation..."
              className="bg-gray-50 border-none rounded-2xl min-h-25 text-xs font-medium placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#6338f6]"
            />
            <p className="text-right text-[10px] text-gray-400 font-medium">
              {internalNotes.length} / {NOTES_MAX_LENGTH} CHARACTERS
            </p>
          </div>

          {actionError && (
            <p className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs font-medium text-rose-700">
              {actionError}
            </p>
          )}
          {actionResult && (
            <p className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
              {actionResult}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Button
              disabled={!listing || isBusy}
              onClick={() => handleUpdateStatus("ACTIVE", "published")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 font-bold flex items-center gap-2"
            >
              {isUpdatingListing ? <Loader2Icon size={16} className="animate-spin" /> : <CheckCircle2Icon size={16} />}
              Approve Product
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                disabled={!listing || isBusy}
                onClick={() => handleUpdateStatus("SUSPENDED", "suspended")}
                className="bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl h-11 font-bold flex items-center gap-2"
              >
                <BanIcon size={16} />
                Ban Product
              </Button>
              <Button
                disabled={!listing?.sellerId || isBusy}
                onClick={handleBanSeller}
                variant="outline"
                className="border-rose-200 text-[#e11d48] hover:bg-rose-50 rounded-xl h-11 font-bold flex items-center gap-2"
              >
                {isSuspendingSeller ? <Loader2Icon size={16} className="animate-spin" /> : <UserXIcon size={16} />}
                Ban Seller
              </Button>
            </div>

            <Button
              disabled={!listing || isBusy}
              onClick={() => handleUpdateStatus("DRAFT", "unpublished for review")}
              variant="outline"
              className="w-full border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl h-11 font-bold flex items-center justify-center gap-2"
            >
              <FlagIcon size={16} />
              Flag for Review
            </Button>

            <Button
              disabled={!listing || isBusy}
              onClick={() => handleUpdateStatus("ARCHIVED", "archived")}
              variant="outline"
              className="w-full border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl h-11 font-bold flex items-center justify-center gap-2"
            >
              Archive Listing
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#f1f5f9] p-6 rounded-3xl flex items-center gap-4 border border-gray-100">
        <div className="size-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
          <KeyboardIcon size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">Flag for Review moves a listing to DRAFT</p>
          <p className="text-[10px] text-gray-500 font-medium">
            It leaves the marketplace until you approve it again.
          </p>
        </div>
      </div>
    </div>
  )
}
