"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircleIcon, XIcon, XCircleIcon, SparklesIcon } from "lucide-react"

interface RejectionDialogProps {
  isOpen: boolean
  applicantName: string
  businessName: string
  isRejecting: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
}

const PRESET_REASONS = [
  "Incomplete or unreadable ID Card / Business License.",
  "Business details could not be verified.",
  "Invalid business location or contact information.",
  "Duplicate registration attempt.",
]

export function RejectionDialog({
  isOpen,
  applicantName,
  businessName,
  isRejecting,
  onClose,
  onConfirm,
}: RejectionDialogProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError("Please provide a rejection reason before confirming.")
      return
    }
    setError(null)
    try {
      await onConfirm(reason.trim())
      setReason("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject application."
      setError(msg)
    }
  }

  const handleSelectPreset = (preset: string) => {
    setReason((prev) => (prev ? `${prev}\n${preset}` : preset))
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <XCircleIcon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Reject Application</h3>
              <p className="text-xs text-gray-500">{businessName} • {applicantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRejecting}
            type="button"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs leading-relaxed">
            <AlertCircleIcon size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <p>
              This action will mark the application as <strong>REJECTED</strong>. The rejection note provided below will be logged for administrative record and sent to the applicant.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Rejection Reason / Note <span className="text-rose-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError(null)
              }}
              placeholder="State clear reason why this seller application is being rejected..."
              className="rounded-2xl border-gray-200 min-h-[110px] text-sm focus-visible:ring-rose-500"
              required
            />
            {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
          </div>

          {/* Quick presets */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
              <SparklesIcon size={14} className="text-purple-500" />
              <span>Quick Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-[11px] font-medium bg-gray-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 transition-all text-left"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isRejecting}
              className="rounded-xl border-gray-200 font-semibold px-5 h-11 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isRejecting || !reason.trim()}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 h-11 shadow-md shadow-rose-500/20 flex items-center gap-2"
            >
              <XCircleIcon size={18} />
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
