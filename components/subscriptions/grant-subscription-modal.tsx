"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SubscriptionPlan, SellerSubscription } from "@/lib/types/subscription"
import { useGrantSellerSubscriptionMutation } from "@/lib/redux/service/subscriptionApi"

interface GrantSubscriptionModalProps {
  subscription: SellerSubscription | null
  plans: SubscriptionPlan[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GrantSubscriptionModal({
  subscription,
  plans,
  open,
  onOpenChange,
}: GrantSubscriptionModalProps) {
  const [sellerId, setSellerId] = useState("")
  const [planCode, setPlanCode] = useState("")
  const [days, setDays] = useState(30)
  const [extendExisting, setExtendExisting] = useState(false)

  const [grantSubscription, { isLoading }] = useGrantSellerSubscriptionMutation()

  useEffect(() => {
    if (subscription) {
      setSellerId(subscription.sellerId)
      setPlanCode(subscription.planCode)
      setDays(30)
      setExtendExisting(subscription.status === "ACTIVE")
    } else {
      setSellerId("")
      setPlanCode(plans[0]?.code || "BASIC")
      setDays(30)
      setExtendExisting(false)
    }
  }, [subscription, plans, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sellerId.trim()) {
      alert("Please enter a Seller ID.")
      return
    }

    try {
      await grantSubscription({
        sellerId: sellerId.trim(),
        body: {
          planCode,
          days: Number(days),
          extendExisting,
        },
      }).unwrap()

      onOpenChange(false)
    } catch (err: unknown) {
      console.error("Grant subscription error:", err)
      alert(err instanceof Error ? err.message : "Failed to update seller subscription.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {subscription ? `Manage Subscription for ${subscription.sellerId}` : "Grant / Edit Seller Subscription"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
              Seller ID
            </Label>
            <Input
              disabled={Boolean(subscription)}
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              placeholder="e.g. seller-uuid-123"
              required
              className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium disabled:opacity-60"
            />
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
              Subscription Plan
            </Label>
            <select
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl h-11 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6338f6]"
            >
              {plans.map((plan) => (
                <option key={plan.code || plan.plan} value={plan.code || plan.plan}>
                  {plan.displayName} (${plan.priceUsd}/mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
              Duration Days
            </Label>
            <Input
              type="number"
              min="1"
              max="3650"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 30)}
              required
              className="bg-gray-50 border-gray-100 rounded-xl h-11 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="extendExisting"
              checked={extendExisting}
              onChange={(e) => setExtendExisting(e.target.checked)}
              className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
            />
            <label htmlFor="extendExisting" className="text-xs font-bold text-gray-700 cursor-pointer">
              Extend existing active subscription
            </label>
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
              disabled={isLoading}
              className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 px-6 font-semibold"
            >
              {isLoading ? "Saving..." : "Grant / Save Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
