"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showToast } from "@/components/ui/toast-popup"
import { getApiErrorMessage } from "@/lib/redux/service/api-utils"
import type { SubscriptionPlan } from "@/lib/types/subscription"
import {
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
} from "@/lib/redux/service/subscriptionApi"

interface EditPlanModalProps {
  plan: SubscriptionPlan | null // null when creating new plan
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Upstream requires an uppercase code matching [A-Z][A-Z0-9_]*, max 30 chars. */
const CODE_PATTERN = /^[A-Z][A-Z0-9_]*$/

export function EditPlanModal({ plan, open, onOpenChange }: EditPlanModalProps) {
  const isEditing = Boolean(plan)

  const [code, setCode] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [priceUsd, setPriceUsd] = useState(0)
  const [durationDays, setDurationDays] = useState(30)
  const [listingLimit, setListingLimit] = useState<number | "">("")
  const [sortOrder, setSortOrder] = useState(0)
  const [freeAcknowledged, setFreeAcknowledged] = useState(false)

  const [createPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation()
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation()

  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (plan) {
      setCode(plan.code || plan.plan || "")
      setDisplayName(plan.displayName || "")
      setPriceUsd(plan.priceUsd ?? 0)
      setDurationDays(plan.durationDays ?? 30)
      setListingLimit(plan.listingLimit === null ? "" : plan.listingLimit)
      setSortOrder(plan.sortOrder ?? 0)
    } else {
      setCode("")
      setDisplayName("")
      setPriceUsd(0)
      setDurationDays(30)
      setListingLimit("")
      setSortOrder(0)
    }
    setFreeAcknowledged(false)
  }, [plan, open])

  const normalizedCode = code.toUpperCase().replace(/\s+/g, "_")
  const codeIsValid = !isEditing ? CODE_PATTERN.test(normalizedCode) : true
  // A price of 0 is a real behaviour change: the plan activates with no payment.
  const isFree = Number(priceUsd) === 0
  const priceChanged = !isEditing || Number(priceUsd) !== (plan?.priceUsd ?? 0)
  const needsFreeConfirmation = isFree && priceChanged && !freeAcknowledged

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEditing && !codeIsValid) {
      showToast({
        type: "warning",
        title: "Invalid Plan Code",
        message: "Use uppercase letters, digits and underscores, starting with a letter.",
      })
      return
    }

    if (needsFreeConfirmation) {
      return
    }

    // The API takes -1 for unlimited; it reads back as null.
    const finalListingLimit = listingLimit === "" ? -1 : Number(listingLimit)

    try {
      if (isEditing && plan) {
        await updatePlan({
          code: plan.code || plan.plan || normalizedCode,
          data: {
            displayName,
            priceUsd: Number(priceUsd),
            durationDays: Number(durationDays),
            listingLimit: finalListingLimit,
            sortOrder: Number(sortOrder),
          },
        }).unwrap()
      } else {
        await createPlan({
          code: normalizedCode,
          displayName,
          priceUsd: Number(priceUsd),
          durationDays: Number(durationDays),
          listingLimit: finalListingLimit,
          sortOrder: Number(sortOrder),
        }).unwrap()
      }

      showToast({
        type: "success",
        title: isEditing ? "Plan Updated" : "Plan Created",
        message: isEditing
          ? `"${displayName}" updated. New pricing applies to new purchases only.`
          : `New plan "${displayName}" created successfully.`,
      })
      onOpenChange(false)
    } catch (err: unknown) {
      console.error("Save plan error:", err)
      showToast({
        type: "error",
        title: "Failed to Save Plan",
        message: getApiErrorMessage(
          err,
          isEditing
            ? "Failed to update subscription plan."
            : "Failed to create subscription plan. The code may already be in use.",
        ),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEditing ? `Edit Plan: ${plan?.displayName}` : "Create Subscription Plan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
              Plan Code
            </Label>
            <Input
              disabled={isEditing}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={() => setCode(normalizedCode)}
              placeholder="e.g. PREMIUM_PRO"
              required
              maxLength={30}
              className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-semibold uppercase disabled:opacity-60"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              {isEditing
                ? "Plan code cannot be changed after creation."
                : "Permanent once saved. Uppercase letters, digits and underscores only."}
            </p>
            {!isEditing && code && !codeIsValid && (
              <p className="text-[11px] text-rose-600 font-semibold mt-1">
                Must start with a letter and use only A-Z, 0-9 and underscores.
              </p>
            )}
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
              Display Name
            </Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Premium Pro Plan"
              required
              maxLength={100}
              className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Price (USD)
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={priceUsd}
                onChange={(e) => {
                  setPriceUsd(parseFloat(e.target.value) || 0)
                  setFreeAcknowledged(false)
                }}
                required
                className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium"
              />
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Duration (Days)
              </Label>
              <Input
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                required
                className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Listing Limit
              </Label>
              <Input
                type="number"
                min="-1"
                placeholder="Empty for Unlimited"
                value={listingLimit}
                onChange={(e) => setListingLimit(e.target.value === "" ? "" : parseInt(e.target.value))}
                className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium"
              />
              <p className="text-[10px] text-gray-400 mt-1">Leave blank or -1 for unlimited.</p>
            </div>
            <div>
              <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                Sort Order
              </Label>
              <Input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium"
              />
            </div>
          </div>

          {isFree && priceChanged && (
            <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={freeAcknowledged}
                onChange={(e) => setFreeAcknowledged(e.target.checked)}
                className="mt-0.5 size-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-[11px] leading-relaxed text-amber-900 font-medium">
                A price of $0.00 makes this plan <strong>free</strong>: sellers get it instantly with
                no KHQR payment at all. Tick to confirm this is intended.
              </span>
            </label>
          )}

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              What changing this does
            </p>
            <ul className="text-[11px] leading-relaxed text-gray-500 space-y-1 list-disc pl-4">
              <li>
                Pricing applies to <strong>new purchases only</strong>. Sellers already subscribed
                keep their expiry, and anyone with a KHQR code open still pays the old price.
              </li>
              <li>Shortening the duration does not cut anyone&apos;s current period short.</li>
              <li>
                Lowering the listing limit never deletes listings — it only stops sellers adding
                more until they are back under the cap.
              </li>
            </ul>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || needsFreeConfirmation || (!isEditing && !codeIsValid)}
              className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 px-6 font-semibold"
            >
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
