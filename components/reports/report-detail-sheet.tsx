"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { showToast } from "@/components/ui/toast-popup"
import {
  useGetReportByIdQuery,
  useResolveReportMutation,
  useDismissReportMutation,
  useSuspendListingMutation,
  useRemoveListingMutation,
  useRestoreListingMutation,
  useDeleteListingMutation,
  useSuspendSellerMutation,
  useRestoreSellerMutation,
  useDeleteReviewMutation,
} from "@/lib/redux/service/reportApi"
import type { AdminReport, ReportTargetType } from "@/lib/types/report"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CopyIcon,
  CheckIcon,
  ShieldAlertIcon,
  BanIcon,
  Trash2Icon,
  RotateCcwIcon,
  UserIcon,
  ClockIcon,
  ExternalLinkIcon,
  MessageSquareIcon,
  LayersIcon,
} from "lucide-react"

interface ReportDetailSheetProps {
  reportUuid: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  siblingReports?: AdminReport[]
  onReportsUpdated?: () => void
}

type TargetActionType =
  | "SUSPEND_LISTING"
  | "REMOVE_LISTING"
  | "RESTORE_LISTING"
  | "DELETE_LISTING"
  | "SUSPEND_SELLER"
  | "RESTORE_SELLER"
  | "DELETE_REVIEW"

export function ReportDetailSheet({
  reportUuid,
  open,
  onOpenChange,
  siblingReports = [],
  onReportsUpdated,
}: ReportDetailSheetProps) {
  // Fetch single report details via GET /api/v1/admin/reports/{uuid}
  const {
    data: fetchedReport,
    isLoading,
    refetch,
  } = useGetReportByIdQuery(reportUuid ?? "", {
    skip: !reportUuid || !open,
  })

  // Sibling reports that share this target (excluding current report if resolved)
  const report = fetchedReport

  // Mutations
  const [resolveReport, { isLoading: isResolving }] = useResolveReportMutation()
  const [dismissReport, { isLoading: isDismissing }] = useDismissReportMutation()
  const [suspendListing, { isLoading: isSuspendingListing }] = useSuspendListingMutation()
  const [removeListing, { isLoading: isRemovingListing }] = useRemoveListingMutation()
  const [restoreListing, { isLoading: isRestoringListing }] = useRestoreListingMutation()
  const [deleteListing, { isLoading: isDeletingListing }] = useDeleteListingMutation()
  const [suspendSeller, { isLoading: isSuspendingSeller }] = useSuspendSellerMutation()
  const [restoreSeller, { isLoading: isRestoringSeller }] = useRestoreSellerMutation()
  const [deleteReview, { isLoading: isDeletingReview }] = useDeleteReviewMutation()

  // Copy state
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  // Target action dialog state
  const [activeAction, setActiveAction] = React.useState<TargetActionType | null>(null)
  const [actionReason, setActionReason] = React.useState("")
  const [actionReasonError, setActionReasonError] = React.useState("")

  // Close report dialog state (resolve or dismiss)
  const [closeType, setCloseType] = React.useState<"RESOLVE" | "DISMISS" | null>(null)
  const [decisionNote, setDecisionNote] = React.useState("")
  const [resolveAllSiblings, setResolveAllSiblings] = React.useState(false)

  // Post-action prompt state: "Resolve the report too?"
  const [postActionPromptOpen, setPostActionPromptOpen] = React.useState(false)
  const [performedActionLabel, setPerformedActionLabel] = React.useState("")

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      showToast({ type: "error", message: "Failed to copy to clipboard" })
    }
  }

  // Handle 409 conflict helper
  const handleMutationError = (error: unknown, fallbackMessage: string) => {
    const err = error as { status?: number; data?: { message?: string } }
    if (err?.status === 409) {
      const message =
        err.data?.message || "This report was already reviewed by another administrator."
      showToast({
        type: "warning",
        title: "Conflict (409)",
        message,
      })
      refetch()
      onReportsUpdated?.()
      return true
    }
    showToast({
      type: "error",
      title: "Action Failed",
      message: err.data?.message || fallbackMessage,
    })
    return false
  }

  // Submit target action
  const handleExecuteTargetAction = async () => {
    if (!report || !activeAction) return

    // Suspend and remove require reason
    const requiresReason =
      activeAction === "SUSPEND_LISTING" ||
      activeAction === "REMOVE_LISTING" ||
      activeAction === "SUSPEND_SELLER"

    if (requiresReason && !actionReason.trim()) {
      setActionReasonError("Please provide a reason. The seller will see this.")
      return
    }

    if (actionReason.length > 1000) {
      setActionReasonError("Reason must be 1000 characters or fewer.")
      return
    }

    try {
      let actionLabel = ""
      if (activeAction === "SUSPEND_LISTING") {
        actionLabel = "Listing suspended"
        await suspendListing({ targetId: report.targetId, reason: actionReason.trim() }).unwrap()
      } else if (activeAction === "REMOVE_LISTING") {
        actionLabel = "Listing removed"
        await removeListing({ targetId: report.targetId, reason: actionReason.trim() }).unwrap()
      } else if (activeAction === "RESTORE_LISTING") {
        actionLabel = "Listing restored"
        await restoreListing(report.targetId).unwrap()
      } else if (activeAction === "DELETE_LISTING") {
        actionLabel = "Listing deleted"
        await deleteListing(report.targetId).unwrap()
      } else if (activeAction === "SUSPEND_SELLER") {
        actionLabel = "Seller suspended"
        await suspendSeller({ targetId: report.targetId, reason: actionReason.trim() }).unwrap()
      } else if (activeAction === "RESTORE_SELLER") {
        actionLabel = "Seller restored"
        await restoreSeller(report.targetId).unwrap()
      } else if (activeAction === "DELETE_REVIEW") {
        actionLabel = "Review deleted"
        await deleteReview(report.targetId).unwrap()
      }

      showToast({
        type: "success",
        title: "Target Updated",
        message: `${actionLabel} successfully.`,
      })

      setActiveAction(null)
      setActionReason("")
      setActionReasonError("")

      // If report is still OPEN, prompt: "Resolve the report too?"
      if (report.status === "OPEN") {
        setPerformedActionLabel(actionLabel)
        setPostActionPromptOpen(true)
      }
    } catch (err: unknown) {
      const is409 = handleMutationError(err, "Failed to execute moderation action on target.")
      if (is409) {
        setActiveAction(null)
      }
    }
  }

  // Closing report (Resolve or Dismiss)
  const handleExecuteCloseReport = async () => {
    if (!report || !closeType) return

    if (decisionNote.length > 1000) {
      showToast({ type: "error", message: "Decision note cannot exceed 1000 characters." })
      return
    }

    const note = decisionNote.trim() || undefined
    const isResolve = closeType === "RESOLVE"

    // Target list of reports to close
    const targetsToClose: string[] = [report.uuid]
    if (resolveAllSiblings && siblingReports.length > 0) {
      siblingReports.forEach((s) => {
        if (s.uuid !== report.uuid && s.status === "OPEN" && !targetsToClose.includes(s.uuid)) {
          targetsToClose.push(s.uuid)
        }
      })
    }

    let successCount = 0
    let conflictCount = 0

    for (const uuid of targetsToClose) {
      try {
        if (isResolve) {
          await resolveReport({ uuid, note }).unwrap()
        } else {
          await dismissReport({ uuid, note }).unwrap()
        }
        successCount++
      } catch (err: unknown) {
        const errObj = err as { status?: number; data?: { message?: string } }
        if (errObj?.status === 409) {
          conflictCount++
          showToast({
            type: "warning",
            title: "Report Already Closed",
            message:
              errObj.data?.message || `Report ${uuid.slice(0, 8)} was already closed by another admin.`,
          })
        } else {
          showToast({
            type: "error",
            title: "Failed to close report",
            message: errObj?.data?.message || `Could not close report ${uuid.slice(0, 8)}.`,
          })
        }
      }
    }

    if (successCount > 0) {
      showToast({
        type: "success",
        title: isResolve ? "Report Resolved" : "Report Dismissed",
        message:
          targetsToClose.length > 1
            ? `Successfully updated ${successCount} report(s).`
            : isResolve
            ? "Report resolved successfully."
            : "Report dismissed successfully.",
      })
    }

    setCloseType(null)
    setDecisionNote("")
    setResolveAllSiblings(false)
    refetch()
    onReportsUpdated?.()
  }

  // Quick resolve from post-action prompt
  const handleQuickResolveFromPostAction = async (resolveAll: boolean) => {
    setPostActionPromptOpen(false)
    if (!report) return

    const note = `Resolved after target action: ${performedActionLabel}`
    const targetsToClose: string[] = [report.uuid]

    if (resolveAll && siblingReports.length > 0) {
      siblingReports.forEach((s) => {
        if (s.uuid !== report.uuid && s.status === "OPEN" && !targetsToClose.includes(s.uuid)) {
          targetsToClose.push(s.uuid)
        }
      })
    }

    let successCount = 0
    for (const uuid of targetsToClose) {
      try {
        await resolveReport({ uuid, note }).unwrap()
        successCount++
      } catch (err: unknown) {
        const errObj = err as { status?: number; data?: { message?: string } }
        if (errObj?.status === 409) {
          showToast({
            type: "warning",
            title: "Report Already Closed",
            message:
              errObj.data?.message || `Report ${uuid.slice(0, 8)} was already closed by another admin.`,
          })
        }
      }
    }

    if (successCount > 0) {
      showToast({
        type: "success",
        title: "Report(s) Resolved",
        message:
          targetsToClose.length > 1
            ? `Resolved ${successCount} reports for this target.`
            : "Report resolved.",
      })
    }

    refetch()
    onReportsUpdated?.()
  }

  const openSiblingsCount = siblingReports.filter(
    (s) => s.uuid !== report?.uuid && s.status === "OPEN"
  ).length

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl md:max-w-2xl bg-white p-0 flex flex-col h-full shadow-2xl border-l border-gray-100 overflow-hidden"
        >
          {isLoading && !report ? (
            <div className="flex-1 flex items-center justify-center p-8 text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="size-8 border-3 border-[#6338f6] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading report details...</span>
              </div>
            </div>
          ) : !report ? (
            <div className="p-8 text-center text-gray-500">
              Report not found or unable to load details.
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-lg ${
                      report.targetType === "LISTING"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : report.targetType === "SELLER"
                        ? "bg-purple-50 text-[#6338f6] border-purple-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {report.targetType}
                  </Badge>

                  <Badge
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                      report.status === "OPEN"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : report.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {report.status}
                  </Badge>

                  {openSiblingsCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-[#6338f6] border-purple-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <LayersIcon size={12} />
                      +{openSiblingsCount} other open reports for target
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{report.targetLabel}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>Report ID: <span className="font-mono text-gray-700 font-semibold">{report.uuid.slice(0, 8)}...</span></span>
                  <span>•</span>
                  <span>Target ID: <span className="font-mono text-gray-700 font-semibold">{report.targetId}</span></span>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Accusation Block */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <AlertTriangleIcon size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">The Accusation</h4>
                        <p className="text-[11px] text-gray-500">What the reporter submitted</p>
                      </div>
                    </div>

                    <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {report.reason}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Reporter Note
                      </p>
                      <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-800 leading-relaxed italic border border-gray-100/80">
                        {report.note ? `"${report.note}"` : <span className="text-gray-400 not-italic">No note provided by the reporter.</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Reporter UUID
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-semibold text-gray-700 truncate" title={report.reporterId}>
                            {report.reporterId || "Anonymous"}
                          </span>
                          {report.reporterId && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(report.reporterId, "reporterId")}
                              className="text-gray-400 hover:text-[#6338f6] transition-colors p-1 rounded-md"
                              title="Copy Reporter UUID"
                            >
                              {copiedField === "reporterId" ? (
                                <CheckIcon size={14} className="text-emerald-600" />
                              ) : (
                                <CopyIcon size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Reported At
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <ClockIcon size={14} className="text-gray-400 shrink-0" />
                          <span>{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Decision Block (only once closed) */}
                {report.status !== "OPEN" ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-8 rounded-xl flex items-center justify-center ${
                            report.status === "RESOLVED"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {report.status === "RESOLVED" ? (
                            <CheckCircle2Icon size={16} />
                          ) : (
                            <XCircleIcon size={16} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">The Decision</h4>
                          <p className="text-[11px] text-gray-500">Administrative outcome</p>
                        </div>
                      </div>

                      <Badge
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          report.status === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Decision Note
                        </p>
                        <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-800 leading-relaxed border border-gray-100/80">
                          {report.decisionNote || (
                            <span className="text-gray-400 italic">No decision note recorded.</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Reviewed By
                          </p>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                            <UserIcon size={14} className="text-gray-400" />
                            <span>{report.reviewedBy || "Administrator"}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Reviewed At
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                            <ClockIcon size={14} className="text-gray-400 shrink-0" />
                            <span>
                              {report.reviewedAt
                                ? new Date(report.reviewedAt).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50/50 rounded-2xl border border-blue-100/80 p-4 text-xs text-blue-900 flex items-start gap-3">
                    <ShieldAlertIcon size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Pending Review:</span> This report is currently OPEN. Closing the report does not automatically touch the target item. Make any moderation actions below first.
                    </div>
                  </div>
                )}

                {/* 3. Act on the Target Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900">Act on the Target</h4>
                      <span className="text-[11px] font-mono text-gray-500">
                        {report.targetType} #{report.targetId}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Closing a report does NOT touch the reported item. Perform moderation actions below directly using target ID.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {/* Actions for LISTING */}
                    {report.targetType === "LISTING" && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveAction("SUSPEND_LISTING")
                            setActionReason("")
                            setActionReasonError("")
                          }}
                          className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <BanIcon size={14} /> Suspend Listing
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveAction("REMOVE_LISTING")
                            setActionReason("")
                            setActionReasonError("")
                          }}
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <Trash2Icon size={14} /> Remove Listing
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveAction("RESTORE_LISTING")
                            setActionReason("")
                            setActionReasonError("")
                          }}
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <RotateCcwIcon size={14} /> Restore Listing
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveAction("DELETE_LISTING")
                            setActionReason("")
                            setActionReasonError("")
                          }}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <Trash2Icon size={14} /> Delete Listing
                        </Button>
                      </>
                    )}

                    {/* Actions for SELLER */}
                    {report.targetType === "SELLER" && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveAction("SUSPEND_SELLER")
                            setActionReason("")
                            setActionReasonError("")
                          }}
                          className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <BanIcon size={14} /> Suspend Seller
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setActiveAction("RESTORE_SELLER")
                            setActionReason("")
                            setActionReasonError("")
                          }}
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                        >
                          <RotateCcwIcon size={14} /> Restore Seller
                        </Button>
                      </>
                    )}

                    {/* Actions for REVIEW */}
                    {report.targetType === "REVIEW" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setActiveAction("DELETE_REVIEW")
                          setActionReason("")
                          setActionReasonError("")
                        }}
                        className="col-span-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 rounded-xl h-10 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <Trash2Icon size={14} /> Delete Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer: Close the report buttons */}
              <div className="p-5 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl h-11 px-5 text-gray-700 font-semibold text-xs"
                >
                  Close Panel
                </Button>

                {report.status === "OPEN" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCloseType("DISMISS")
                        setDecisionNote("")
                        setResolveAllSiblings(false)
                      }}
                      className="border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl h-11 px-4 font-bold text-xs"
                    >
                      Dismiss Report
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setCloseType("RESOLVE")
                        setDecisionNote("")
                        setResolveAllSiblings(openSiblingsCount > 0)
                      }}
                      className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 px-5 font-bold text-xs shadow-md"
                    >
                      Resolve Report
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 font-medium">
                    This report is already <span className="font-bold">{report.status.toLowerCase()}</span>.
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Target Action Confirmation Modal */}
      <Dialog
        open={Boolean(activeAction)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setActiveAction(null)
            setActionReason("")
            setActionReasonError("")
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {activeAction === "SUSPEND_LISTING" && "Suspend Listing"}
              {activeAction === "REMOVE_LISTING" && "Remove Listing"}
              {activeAction === "RESTORE_LISTING" && "Restore Listing"}
              {activeAction === "DELETE_LISTING" && "Delete Listing"}
              {activeAction === "SUSPEND_SELLER" && "Suspend Seller"}
              {activeAction === "RESTORE_SELLER" && "Restore Seller"}
              {activeAction === "DELETE_REVIEW" && "Delete Review"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {activeAction === "SUSPEND_LISTING" &&
                "The listing will be suspended and hidden from public search until reviewed."}
              {activeAction === "REMOVE_LISTING" &&
                "The listing will be removed from the marketplace."}
              {activeAction === "RESTORE_LISTING" &&
                "This listing will be restored back to active state."}
              {activeAction === "DELETE_LISTING" &&
                "This will permanently delete the listing. This action cannot be undone."}
              {activeAction === "SUSPEND_SELLER" &&
                "The seller account and all associated listings will be suspended."}
              {activeAction === "RESTORE_SELLER" &&
                "The seller account will be restored to active standing."}
              {activeAction === "DELETE_REVIEW" &&
                "This review will be permanently deleted from the marketplace."}
            </DialogDescription>
          </DialogHeader>

          {/* Reason input when required (suspend, remove) */}
          {(activeAction === "SUSPEND_LISTING" ||
            activeAction === "REMOVE_LISTING" ||
            activeAction === "SUSPEND_SELLER") && (
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900">
                  The seller will see this. <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-gray-400 font-mono">
                  {actionReason.length} / 1000
                </span>
              </div>
              <Textarea
                rows={4}
                value={actionReason}
                onChange={(e) => {
                  setActionReason(e.target.value)
                  if (actionReasonError) setActionReasonError("")
                }}
                maxLength={1000}
                placeholder="Explain the policy violation or reason for suspension..."
                className={`rounded-xl text-xs bg-gray-50/50 resize-none ${
                  actionReasonError ? "border-rose-400 ring-1 ring-rose-400" : ""
                }`}
              />
              {actionReasonError && (
                <p className="text-[11px] text-rose-500 font-medium">{actionReasonError}</p>
              )}
            </div>
          )}

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveAction(null)}
              className="rounded-xl h-11 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleExecuteTargetAction}
              disabled={
                isSuspendingListing ||
                isRemovingListing ||
                isRestoringListing ||
                isDeletingListing ||
                isSuspendingSeller ||
                isRestoringSeller ||
                isDeletingReview
              }
              className={`rounded-xl h-11 px-5 text-xs font-bold text-white ${
                activeAction === "RESTORE_LISTING" || activeAction === "RESTORE_SELLER"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isSuspendingListing ||
              isRemovingListing ||
              isRestoringListing ||
              isDeletingListing ||
              isSuspendingSeller ||
              isRestoringSeller ||
              isDeletingReview
                ? "Processing..."
                : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Report (Resolve or Dismiss) Dialog */}
      <Dialog
        open={Boolean(closeType)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCloseType(null)
            setDecisionNote("")
            setResolveAllSiblings(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {closeType === "RESOLVE" ? "Resolve Report" : "Dismiss Report"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {closeType === "RESOLVE"
                ? "Record that corrective action was taken and close this report."
                : "Record that no violation was found or no action was needed."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900">Decision Note</label>
                <span className="text-[10px] text-gray-400 font-mono">
                  {decisionNote.length} / 1000
                </span>
              </div>
              <Textarea
                rows={3}
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                maxLength={1000}
                placeholder="What did you do, and why?"
                className="rounded-xl text-xs bg-gray-50/50 resize-none"
              />
              <p className="text-[11px] text-gray-400 leading-normal">
                This note will be visible to other admins when this shop or item is reported again.
              </p>
            </div>

            {/* If sibling reports exist for the same target */}
            {openSiblingsCount > 0 && closeType === "RESOLVE" && (
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resolveAllSiblings}
                  onChange={(e) => setResolveAllSiblings(e.target.checked)}
                  className="mt-0.5 rounded border-purple-300 text-[#6338f6] focus:ring-[#6338f6]"
                />
                <div className="text-xs">
                  <span className="font-bold text-purple-900">
                    Also resolve {openSiblingsCount} other open report(s) for this target
                  </span>
                  <p className="text-[11px] text-purple-700 mt-0.5">
                    Applies this resolution note to all sibling reports on the same item.
                  </p>
                </div>
              </label>
            )}
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCloseType(null)}
              className="rounded-xl h-11 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleExecuteCloseReport}
              disabled={isResolving || isDismissing}
              className={`rounded-xl h-11 px-5 text-xs font-bold text-white ${
                closeType === "RESOLVE"
                  ? "bg-[#6338f6] hover:bg-[#532edb]"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              {isResolving || isDismissing
                ? "Closing..."
                : closeType === "RESOLVE"
                ? "Confirm Resolution"
                : "Confirm Dismissal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Action Prompt Dialog: "Resolve the report too?" */}
      <Dialog open={postActionPromptOpen} onOpenChange={setPostActionPromptOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl p-6">
          <DialogHeader>
            <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2Icon size={20} />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Resolve the report too?
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              You just performed: <strong className="text-gray-900">{performedActionLabel}</strong>. Closing the report now ensures your queue stays up to date.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex-col sm:flex-col gap-2">
            {openSiblingsCount > 0 && (
              <Button
                type="button"
                onClick={() => handleQuickResolveFromPostAction(true)}
                className="w-full bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 font-bold text-xs"
              >
                Resolve All {openSiblingsCount + 1} Reports on Target
              </Button>
            )}

            <Button
              type="button"
              onClick={() => handleQuickResolveFromPostAction(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-bold text-xs"
            >
              Resolve This Report
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setPostActionPromptOpen(false)}
              className="w-full rounded-xl h-11 font-semibold text-xs text-gray-600"
            >
              Keep Report Open for Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
