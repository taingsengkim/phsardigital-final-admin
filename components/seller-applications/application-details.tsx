"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  XIcon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  RotateCcwIcon, 
  FileTextIcon,
  ExternalLinkIcon,
  MapPinIcon,
  GlobeIcon,
  Building2Icon,
  PhoneIcon,
  MailIcon,
  ShieldAlertIcon,
  DownloadIcon
} from "lucide-react"
import type { SellerApplication } from "@/lib/types/seller-application"
import {
  useApproveSellerApplicationMutation,
  useGetSellerApplicationQuery,
  useRejectSellerApplicationMutation,
} from "@/lib/redux/service/sellerApplicationApi"
import { RejectionDialog } from "./rejection-dialog"

interface ApplicationDetailsProps {
  application: SellerApplication
  onClose: () => void
}

export function ApplicationDetails({ application, onClose }: ApplicationDetailsProps) {
  const { data: applicationDetails, isFetching, refetch } = useGetSellerApplicationQuery(application.id)
  const [approveApplication, { isLoading: isApproving }] = useApproveSellerApplicationMutation()
  const [rejectApplication, { isLoading: isRejecting }] = useRejectSellerApplicationMutation()
  
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const details = applicationDetails ?? application

  const isPending = details.status.toUpperCase().includes("PENDING")
  const isApproved = details.status.toUpperCase().includes("APPROVED")
  const isRejected = details.status.toUpperCase().includes("REJECTED")

  const handleApprove = async () => {
    setActionError(null)
    try {
      await approveApplication(details.id).unwrap()
      setActionSuccess("Application approved successfully!")
      refetch()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve application."
      setActionError(msg)
    }
  }

  const handleConfirmReject = async (rejectionNote: string) => {
    setActionError(null)
    try {
      await rejectApplication({ uuid: details.id, rejectionNote }).unwrap()
      setIsRejectDialogOpen(false)
      setActionSuccess("Application rejected.")
      refetch()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject application."
      setActionError(msg)
    }
  }

  return (
    <>
      <div className="w-full lg:w-[420px] xl:w-[460px] bg-white border-l border-gray-100 flex flex-col h-full overflow-hidden shadow-xl z-20 transition-all duration-300">
        {/* Top Header Bar */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
            <p className="text-xs text-gray-400">UUID: {details.id}</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="size-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>
        
        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Success / Error Notifications */}
          {actionSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center justify-between">
              <span>{actionSuccess}</span>
              <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
                <XIcon size={14} />
              </button>
            </div>
          )}
          {actionError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center justify-between">
              <span>{actionError}</span>
              <button onClick={() => setActionError(null)} className="text-rose-600 hover:text-rose-800">
                <XIcon size={14} />
              </button>
            </div>
          )}

          {/* Applicant & Business Card */}
          <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-purple-50/60 to-white rounded-3xl border border-purple-100/60 shadow-xs relative">
            <Avatar className="size-24 mb-4 border-4 border-white shadow-md">
              <AvatarImage src={details.logoUri || details.avatar || undefined} className="object-cover" />
              <AvatarFallback className="bg-purple-600 text-white text-2xl font-bold">
                {(details.businessName || details.name).substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h4 className="text-xl font-bold text-gray-900 tracking-tight">{details.businessName}</h4>
            <p className="text-sm font-medium text-gray-500 mb-3">{details.name}</p>

            <div className="flex items-center gap-2 mb-2">
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  <CheckCircle2Icon size={14} /> APPROVED
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                  <XCircleIcon size={14} /> REJECTED
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  • PENDING REVIEW
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-400">
              {isFetching ? "Syncing live details..." : `Submitted on ${details.appliedOn} ${details.appliedAt ? `at ${details.appliedAt}` : ""}`}
            </p>
          </div>

          {/* Rejection Note Alert if previously rejected */}
          {details.rejectionNote && (
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <ShieldAlertIcon size={16} />
                <span>Rejection Reason</span>
              </div>
              <p className="text-rose-700 leading-relaxed font-medium pl-6">
                "{details.rejectionNote}"
              </p>
            </div>
          )}

          {/* Business Information Section */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Building2Icon size={14} /> Business & Contact Info
            </h5>
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 grid grid-cols-1 gap-3.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <span className="text-gray-400 font-medium">Business Type</span>
                <span className="font-bold text-gray-900 text-right">{details.businessType}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-t border-gray-100/60 pt-3">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <PhoneIcon size={12} /> Phone
                </span>
                <span className="font-bold text-gray-900 text-right">{details.phone}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-t border-gray-100/60 pt-3">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <MailIcon size={12} /> Business Email
                </span>
                <span className="font-bold text-gray-900 text-right truncate max-w-[200px]">{details.businessEmail || details.email}</span>
              </div>
              <div className="flex items-start justify-between gap-2 border-t border-gray-100/60 pt-3">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <MapPinIcon size={12} /> Address / City
                </span>
                <span className="font-bold text-gray-900 text-right">{details.location}</span>
              </div>
              {details.website && (
                <div className="flex items-start justify-between gap-2 border-t border-gray-100/60 pt-3">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <GlobeIcon size={12} /> Website
                  </span>
                  <a
                    href={details.website.startsWith("http") ? details.website : `https://${details.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#6338f6] hover:underline flex items-center gap-1 text-right truncate max-w-[200px]"
                  >
                    {details.website}
                    <ExternalLinkIcon size={12} />
                  </a>
                </div>
              )}
              {details.googleMapUrl && (
                <div className="pt-2 border-t border-gray-100/60">
                  <a
                    href={details.googleMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MapPinIcon size={14} /> View Location on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FileTextIcon size={14} /> Verification Documents ({details.documents.length})
            </h5>

            {details.documents.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs text-gray-400 text-center">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="space-y-2">
                {details.documents.map((doc) => (
                  <div
                    key={doc.uuid}
                    className="bg-white rounded-2xl p-3.5 border border-gray-200/80 shadow-xs flex items-center justify-between gap-3 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-purple-50 text-[#6338f6] flex items-center justify-center shrink-0 font-bold text-xs">
                        <FileTextIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {doc.objectName || `${doc.docType.replaceAll("_", " ")}`}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          {doc.docType.replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>
                    {doc.uri && (
                      <a
                        href={doc.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-gray-50 hover:bg-[#6338f6] hover:text-white text-gray-600 rounded-xl font-bold transition-all text-xs shrink-0 flex items-center gap-1"
                        title="View Document"
                      >
                        <ExternalLinkIcon size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {details.missingDocuments && details.missingDocuments.length > 0 && (
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-3 text-xs text-amber-800 flex items-center gap-2">
                <ShieldAlertIcon size={16} className="text-amber-600 shrink-0" />
                <span>Missing: <strong>{details.missingDocuments.join(", ")}</strong></span>
              </div>
            )}
          </div>

          {/* About / Description */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">About Business</h5>
            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
              {details.description}
            </p>
          </div>
        </div>
        
        {/* Bottom Action Bar */}
        <div className="p-6 border-t border-gray-100 bg-white space-y-2.5 shrink-0">
          <Button
            disabled={isApproving || isRejecting}
            onClick={handleApprove}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
          >
            <CheckCircle2Icon size={18} />
            {isApproving ? "Approving Application..." : isApproved ? "Re-Approve Application" : "Approve Application"}
          </Button>

          <Button
            disabled={isApproving || isRejecting}
            onClick={() => setIsRejectDialogOpen(true)}
            className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl h-12 font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <XCircleIcon size={18} />
            {isRejecting ? "Rejecting..." : "Reject Application"}
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-gray-200 text-gray-600 rounded-xl h-11 font-semibold flex items-center justify-center gap-2"
          >
            Close Panel
          </Button>
        </div>
      </div>

      {/* Rejection Modal Dialog */}
      <RejectionDialog
        isOpen={isRejectDialogOpen}
        applicantName={details.name}
        businessName={details.businessName}
        isRejecting={isRejecting}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleConfirmReject}
      />
    </>
  )
}
