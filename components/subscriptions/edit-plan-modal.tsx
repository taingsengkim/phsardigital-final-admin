"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SubscriptionPlan } from "@/lib/types/subscription"
import {
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useActivateSubscriptionPlanMutation,
  useDeactivateSubscriptionPlanMutation,
} from "@/lib/redux/service/subscriptionApi"

interface EditPlanModalProps {
  plan: SubscriptionPlan | null // null when creating new plan
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPlanModal({ plan, open, onOpenChange }: EditPlanModalProps) {
  const isEditing = Boolean(plan)

  const [code, setCode] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [priceUsd, setPriceUsd] = useState(0)
  const [durationDays, setDurationDays] = useState(30)
  const [listingLimit, setListingLimit] = useState<number | "">("")
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const [createPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation()
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation()
  const [activatePlan, { isLoading: isActivating }] = useActivateSubscriptionPlanMutation()
  const [deactivatePlan, { isLoading: isDeactivating }] = useDeactivateSubscriptionPlanMutation()

  const isLoading = isCreating || isUpdating || isActivating || isDeactivating

  useEffect(() => {
    if (plan) {
      setCode(plan.code || plan.plan || "")
      setDisplayName(plan.displayName || "")
      setPriceUsd(plan.priceUsd ?? 0)
      setDurationDays(plan.durationDays ?? 30)
      setListingLimit(plan.listingLimit === null ? "" : plan.listingLimit)
      setSortOrder(plan.sortOrder ?? 0)
      setIsActive(plan.active !== false)
    } else {
      setCode("")
      setDisplayName("")
      setPriceUsd(0)
      setDurationDays(30)
      setListingLimit("")
      setSortOrder(0)
      setIsActive(true)
    }
  }, [plan, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const finalListingLimit = listingLimit === "" ? -1 : Number(listingLimit)

    try {
      if (isEditing && plan) {
        await updatePlan({
          code: plan.code || plan.plan || code,
          data: {
            displayName,
            priceUsd: Number(priceUsd),
            durationDays: Number(durationDays),
            listingLimit: finalListingLimit,
            sortOrder: Number(sortOrder),
          },
        }).unwrap()

        if (isActive !== (plan.active !== false)) {
          if (isActive) {
            await activatePlan(plan.code || plan.plan || code).unwrap()
          } else {
            await deactivatePlan(plan.code || plan.plan || code).unwrap()
          }
        }
      } else {
        await createPlan({
          code: code.toUpperCase().replace(/\s+/g, "_"),
          displayName,
          priceUsd: Number(priceUsd),
          durationDays: Number(durationDays),
          listingLimit: finalListingLimit,
          sortOrder: Number(sortOrder),
        }).unwrap()
      }

      onOpenChange(false)
    } catch (err: unknown) {
      console.error("Save plan error:", err)
      alert(err instanceof Error ? err.message : "Failed to save subscription plan.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 sm:p-8">
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
              placeholder="e.g. PREMIUM_PRO"
              required
              className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-semibold uppercase disabled:opacity-60"
            />
            {isEditing && (
              <p className="text-[11px] text-gray-400 mt-1">Plan code cannot be changed after creation.</p>
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
                onChange={(e) => setPriceUsd(parseFloat(e.target.value) || 0)}
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

          {isEditing && (
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="activeStatus"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
              />
              <label htmlFor="activeStatus" className="text-xs font-bold text-gray-700 cursor-pointer">
                Plan Active (Sellers can subscribe)
              </label>
            </div>
          )}

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
              disabled={isLoading}
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
