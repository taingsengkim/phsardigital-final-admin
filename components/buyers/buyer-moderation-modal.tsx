"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircleIcon, ShieldAlertIcon } from "lucide-react"
import type { Buyer } from "@/lib/types/buyer"
import {
  useSuspendBuyerMutation,
  useRestoreBuyerMutation,
  useBanBuyerMutation,
} from "@/lib/redux/service/buyerApi"

interface BuyerModerationModalProps {
  buyer: Buyer | null
  actionType: "suspend" | "ban" | "restore" | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MIN_REASON_LENGTH = 10
const MAX_REASON_LENGTH = 500

export function BuyerModerationModal({
  buyer,
  actionType,
  open,
  onOpenChange,
}: BuyerModerationModalProps) {
  const [reason, setReason] = useState("")
  const [touched, setTouched] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [suspendBuyer, { isLoading: isSuspending }] = useSuspendBuyerMutation()
  const [restoreBuyer, { isLoading: isRestoring }] = useRestoreBuyerMutation()
  const [banBuyer, { isLoading: isBanning }] = useBanBuyerMutation()

  const isLoading = isSuspending || isRestoring || isBanning

  useEffect(() => {
    setReason("")
    setTouched(false)
    setValidationError(null)
  }, [buyer, actionType, open])

  if (!buyer || !actionType) return null

  const isReasonRequired = actionType !== "restore"
  const currentLength = reason.trim().length
  const isReasonValid = !isReasonRequired || (currentLength >= MIN_REASON_LENGTH && currentLength <= MAX_REASON_LENGTH)

  const handleReasonChange = (value: string) => {
    const sliced = value.slice(0, MAX_REASON_LENGTH)
    setReason(sliced)

    if (isReasonRequired) {
      if (sliced.trim().length < MIN_REASON_LENGTH) {
        setValidationError(`Reason must be at least ${MIN_REASON_LENGTH} characters explaining the ${actionType}.`)
      } else {
        setValidationError(null)
      }
    }
  }

  const handleBlur = () => {
    setTouched(true)
    if (isReasonRequired && currentLength < MIN_REASON_LENGTH) {
      setValidationError(`Reason must be at least ${MIN_REASON_LENGTH} characters explaining the ${actionType}.`)
    }
  }

  const actionTitle =
    actionType === "suspend"
      ? `Suspend Account: ${buyer.fullName}`
      : actionType === "ban"
      ? `Ban Account: ${buyer.fullName}`
      : `Restore Account: ${buyer.fullName}`

  const actionButtonText =
    actionType === "suspend"
      ? "Suspend Account"
      : actionType === "ban"
      ? "Ban Account"
      : "Restore Account"

  const actionButtonClass =
    actionType === "restore"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
      : "bg-rose-600 hover:bg-rose-700 text-white shadow-xs"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isReasonRequired) {
      setTouched(true)
      if (currentLength < MIN_REASON_LENGTH) {
        setValidationError(`Please enter a detailed reason (at least ${MIN_REASON_LENGTH} characters).`)
        return
      }
    }

    try {
      if (actionType === "suspend") {
        await suspendBuyer({ userId: buyer.id, reason: reason.trim() }).unwrap()
      } else if (actionType === "ban") {
        await banBuyer({ userId: buyer.id, reason: reason.trim() }).unwrap()
      } else if (actionType === "restore") {
        await restoreBuyer(buyer.id).unwrap()
      }
      onOpenChange(false)
    } catch (err: unknown) {
      console.error("Buyer moderation error:", err)
      alert(err instanceof Error ? err.message : "Failed to perform moderation action.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            {actionType !== "restore" && <ShieldAlertIcon className="size-5 text-rose-600" />}
            {actionTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/90 text-xs font-medium space-y-1">
            <p className="text-gray-500">
              User ID: <span className="font-bold text-gray-800">{buyer.id}</span>
            </p>
            <p className="text-gray-500">
              Email: <span className="font-bold text-gray-800">{buyer.email}</span>
            </p>
            <p className="text-gray-500">
              Current Status: <span className="font-bold text-[#6338f6]">{buyer.status}</span>
            </p>
          </div>

          {isReasonRequired ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Moderation Reason <span className="text-rose-500">*</span>
                </Label>
                <span className={`text-[11px] font-bold ${
                  currentLength < MIN_REASON_LENGTH && touched
                    ? "text-rose-500"
                    : currentLength >= MIN_REASON_LENGTH
                    ? "text-emerald-600"
                    : "text-gray-400"
                }`}>
                  {currentLength} / {MAX_REASON_LENGTH} chars (min {MIN_REASON_LENGTH})
                </span>
              </div>

              <Textarea
                value={reason}
                onChange={(e) => handleReasonChange(e.target.value)}
                onBlur={handleBlur}
                placeholder={`Provide a clear, policy-referenced reason for ${actionType}ing this buyer account...`}
                required
                className={`bg-gray-50/90 border rounded-2xl min-h-28 text-xs font-medium focus:bg-white transition-all ${
                  touched && !isReasonValid
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
                    : "border-gray-200/80 focus:border-[#6338f6] focus:ring-[#6338f6]/20"
                }`}
              />

              {touched && validationError && (
                <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold mt-1">
                  <AlertCircleIcon className="size-3.5 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs font-semibold text-gray-600 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              Are you sure you want to restore this buyer account to <span className="font-bold text-emerald-700">ACTIVE</span> status?
            </p>
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
              disabled={isLoading || (isReasonRequired && touched && !isReasonValid)}
              className={`rounded-xl h-11 px-6 font-bold disabled:opacity-50 ${actionButtonClass}`}
            >
              {isLoading ? "Processing..." : actionButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
