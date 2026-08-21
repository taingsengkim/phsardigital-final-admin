"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  Clock3Icon,
  DownloadIcon,
  EyeIcon,
  ExternalLinkIcon,
  FileCheck2Icon,
  FileTextIcon,
  FingerprintIcon,
  MapPinIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  SparklesIcon,
  XCircleIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/header"
import { RejectionDialog } from "@/components/seller-applications/rejection-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useApproveSellerApplicationMutation,
  useGetSellerApplicationQuery,
  useRejectSellerApplicationMutation,
} from "@/lib/redux/service/sellerApplicationApi"
import type { ApplicationDocument, SellerApplication } from "@/lib/types/seller-application"
import { cn } from "@/lib/utils"

const BACK_HREF = "/dashboard/sellers"

interface ApplicationDetailsProps {
  applicationId: string
}

function DetailsShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader
        title="Seller application"
        description="Verify the business profile and supporting documents before making a decision."
      >
        <Link
          href={BACK_HREF}
          className="hidden h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:flex"
        >
          <ArrowLeftIcon size={15} />
          Applications
        </Link>
      </DashboardHeader>

      <main className="app-scrollbar flex-1 overflow-y-auto bg-[#f7f7fb] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </>
  )
}

function StatusBadge({ status, large = false }: { status: string; large?: boolean }) {
  const normalized = status.toUpperCase()
  const approved = normalized.includes("APPROVED")
  const rejected = normalized.includes("REJECTED")
  const Icon = approved ? CheckCircle2Icon : rejected ? XCircleIcon : Clock3Icon

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border font-bold",
        large ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]",
        approved && "border-emerald-200 bg-emerald-50 text-emerald-700",
        rejected && "border-rose-200 bg-rose-50 text-rose-700",
        !approved && !rejected && "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      <Icon size={large ? 14 : 12} />
      {approved ? "Approved" : rejected ? "Rejected" : "Pending review"}
    </span>
  )
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
      <div className="flex items-start gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6338f6]">
          <Icon size={17} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs leading-5 text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold leading-5 text-gray-800">{value || "Not provided"}</dd>
    </div>
  )
}

function formatReviewedAt(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

const PREVIEWABLE_DOCUMENT_EXTENSIONS = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "bmp",
  "svg",
  "txt",
  "csv",
  "json",
])

function canPreviewDocument(document: ApplicationDocument) {
  const source = `${document.objectName ?? ""} ${document.uri}`.toLowerCase()
  const extension = source.match(/\.([a-z0-9]+)(?:[?#\s]|$)/)?.[1]
  return extension ? PREVIEWABLE_DOCUMENT_EXTENSIONS.has(extension) : false
}

function DocumentPreviewDialog({
  document,
  onClose,
}: {
  document: ApplicationDocument
  onClose: () => void
}) {
  const title = document.objectName || document.docType.replaceAll("_", " ")
  const [zoom, setZoom] = useState(100)
  const previewScale = zoom / 100
  const previewSize = Math.max(zoom, 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-preview-title"
        className="flex h-[min(88vh,900px)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#6338f6]">Document preview</p>
            <h2 id="document-preview-title" className="mt-0.5 truncate text-sm font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={document.uri}
              download={document.objectName || true}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <DownloadIcon size={14} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close document preview"
              className="flex size-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-2">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(50, value - 25))}
            disabled={zoom === 50}
            aria-label="Zoom out"
            className="flex size-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ZoomOutIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(100)}
            aria-label="Reset zoom to 100 percent"
            className="h-8 min-w-16 rounded-lg border border-gray-200 bg-white px-2 text-[11px] font-bold tabular-nums text-gray-700 transition-colors hover:border-purple-200 hover:text-[#6338f6]"
          >
            {zoom}%
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(200, value + 25))}
            disabled={zoom === 200}
            aria-label="Zoom in"
            className="flex size-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ZoomInIcon size={15} />
          </button>
          <span className="ml-2 hidden text-[11px] text-gray-400 sm:inline">Click the percentage to reset</span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-gray-100 p-2 sm:p-4">
          <div
            className="origin-top-left"
            style={{ width: `${previewSize}%`, height: `${previewSize}%` }}
          >
            <iframe
              src={document.uri}
              title={`Preview of ${title}`}
              className="origin-top-left rounded-xl border border-gray-200 bg-white"
              style={{
                width: `${100 / previewScale}%`,
                height: `${100 / previewScale}%`,
                transform: `scale(${previewScale})`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <DetailsShell>
      <div className="space-y-5" aria-label="Loading seller application">
        <Skeleton className="h-5 w-56 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </DetailsShell>
  )
}

function ReviewChecklist({ details }: { details: SellerApplication }) {
  const hasBusinessProfile = Boolean(details.businessName && details.businessType && details.description)
  const hasLocation = Boolean(details.address && details.address !== "Not provided")
  const hasDocuments = details.documents.length > 0

  const checks = [
    { label: "Business profile provided", complete: hasBusinessProfile },
    { label: "Business location provided", complete: hasLocation },
    { label: "Supporting documents uploaded", complete: hasDocuments },
    { label: "No required documents missing", complete: details.missingDocuments.length === 0 },
  ]

  return (
    <div className="space-y-2.5">
      {checks.map((check) => (
        <div key={check.label} className="flex items-center gap-2.5 text-xs">
          {check.complete ? (
            <CheckCircle2Icon className="size-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircleIcon className="size-4 shrink-0 text-amber-500" />
          )}
          <span className={check.complete ? "text-gray-700" : "font-medium text-amber-800"}>{check.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ApplicationDetails({ applicationId }: ApplicationDetailsProps) {
  const {
    data: details,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetSellerApplicationQuery(applicationId)
  const [approveApplication, { isLoading: isApproving }] = useApproveSellerApplicationMutation()
  const [rejectApplication, { isLoading: isRejecting }] = useRejectSellerApplicationMutation()

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<ApplicationDocument | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  if (isLoading) return <LoadingState />

  if (isError || !details) {
    return (
      <DetailsShell>
        <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <ShieldAlertIcon size={22} />
          </div>
          <h2 className="mt-4 text-base font-bold text-gray-900">Application not found</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            This application may have been removed, or the service may be temporarily unavailable.
          </p>
          <p className="mt-3 break-all rounded-lg bg-gray-50 px-3 py-2 font-mono text-[11px] text-gray-500">{applicationId}</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link
              href={BACK_HREF}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back to applications
            </Link>
            <Button onClick={() => refetch()} className="rounded-xl bg-[#6338f6] hover:bg-[#542bd9]">
              <RefreshCwIcon size={14} /> Retry
            </Button>
          </div>
        </div>
      </DetailsShell>
    )
  }

  const isPending = details.status.toUpperCase().includes("PENDING")
  const reviewedAt = formatReviewedAt(details.reviewedAt)
  const isBusy = isApproving || isRejecting

  const handleApprove = async () => {
    setActionError(null)
    setActionSuccess(null)
    try {
      await approveApplication(details.id).unwrap()
      setActionSuccess("Application approved. The seller can now continue onboarding.")
      await refetch()
    } catch (error: unknown) {
      setActionError(error instanceof Error ? error.message : "The application could not be approved. Please try again.")
    }
  }

  const handleConfirmReject = async (rejectionNote: string) => {
    setActionError(null)
    setActionSuccess(null)
    try {
      await rejectApplication({ uuid: details.id, rejectionNote }).unwrap()
      setIsRejectDialogOpen(false)
      setActionSuccess("Application rejected and the review note was saved.")
      await refetch()
    } catch (error: unknown) {
      setActionError(error instanceof Error ? error.message : "The application could not be rejected. Please try again.")
    }
  }

  return (
    <>
      <DetailsShell>
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href={BACK_HREF} className="font-medium transition-colors hover:text-[#6338f6]">Sellers</Link>
          <ChevronRightIcon size={13} />
          <span className="font-medium text-gray-800">Application review</span>
          {isFetching && <span className="ml-auto flex items-center gap-1.5 text-gray-400"><RefreshCwIcon size={12} className="animate-spin" /> Syncing</span>}
        </nav>

        {(actionSuccess || actionError) && (
          <div
            role={actionError ? "alert" : "status"}
            className={cn(
              "mb-5 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm",
              actionError ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800",
            )}
          >
            <div className="flex items-start gap-2.5">
              {actionError ? <AlertCircleIcon className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />}
              <span>{actionError || actionSuccess}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => { setActionError(null); setActionSuccess(null) }}
              className="rounded-md p-0.5 opacity-70 hover:opacity-100"
            >
              <XIcon size={15} />
            </button>
          </div>
        )}

        <section className="relative mb-5 overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-[0_8px_30px_rgba(68,44,160,0.06)] sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6338f6] via-violet-400 to-fuchsia-300" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="size-20 shrink-0 rounded-2xl border-4 border-white shadow-lg shadow-purple-100">
              <AvatarImage src={details.logoUri || undefined} className="object-cover" />
              <AvatarFallback className="rounded-2xl bg-[#6338f6] text-xl font-bold text-white">
                {details.businessName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={details.status} large />
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">{details.businessType}</span>
              </div>
              <h1 className="mt-3 truncate text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">{details.businessName}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Clock3Icon size={13} /> Submitted {details.appliedOn}{details.appliedAt ? ` at ${details.appliedAt}` : ""}</span>
                <span className="flex items-center gap-1.5"><MapPinIcon size={13} /> {details.city !== "Not provided" ? details.city : details.province}</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 sm:max-w-56">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Application ID</p>
              <p className="mt-1 truncate font-mono text-[11px] font-medium text-gray-700" title={details.id}>{details.id}</p>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {details.rejectionNote && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
                  <ShieldAlertIcon size={17} /> Review note
                </div>
                <p className="mt-2 pl-6 text-sm leading-6 text-rose-700">{details.rejectionNote}</p>
              </div>
            )}

            <SectionCard
              title="Business profile"
              description="Information submitted by the applicant for marketplace verification."
              icon={Building2Icon}
            >
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Legal / trading name" value={details.businessName} />
                <DetailItem label="Business type" value={details.businessType} />
                <DetailItem label="Applicant ID" value={<span className="font-mono text-xs">{details.applicantId}</span>} />
                <DetailItem label="Application status" value={<StatusBadge status={details.status} />} />
              </dl>
              <div className="mt-5">
                <h3 className="text-xs font-bold text-gray-800">About the business</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">{details.description}</p>
              </div>
            </SectionCard>

            <SectionCard
              title="Business location"
              description="Address and map coordinates supplied with the application."
              icon={MapPinIcon}
            >
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Street address" value={details.address} />
                <DetailItem label="City / district" value={details.city} />
                <DetailItem label="Province" value={details.province} />
                <DetailItem
                  label="Coordinates"
                  value={details.latitude !== null && details.longitude !== null
                    ? <span className="font-mono text-xs">{details.latitude}, {details.longitude}</span>
                    : "Not provided"}
                />
              </dl>
              {details.googleMapUrl && (
                <a
                  href={details.googleMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-bold text-[#6338f6] transition-colors hover:bg-purple-100"
                >
                  <MapPinIcon size={14} /> Open in Google Maps <ExternalLinkIcon size={13} />
                </a>
              )}
            </SectionCard>

            <SectionCard
              title="Verification documents"
              description={`${details.documents.length} document${details.documents.length === 1 ? "" : "s"} attached to this application.`}
              icon={FileCheck2Icon}
            >
              {details.documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-5 py-8 text-center">
                  <FileTextIcon className="mx-auto size-7 text-amber-500" />
                  <p className="mt-2 text-sm font-bold text-amber-900">No documents uploaded</p>
                  <p className="mt-1 text-xs text-amber-700">The application does not yet contain supporting files.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {details.documents.map((doc, index) => (
                    <article key={doc.uuid} className="group min-w-0 rounded-xl border border-gray-200 p-3.5 transition-colors hover:border-purple-200 hover:bg-purple-50/30">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-[#6338f6]">
                          <FileTextIcon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-gray-900" title={doc.objectName || doc.docType}>
                            {doc.objectName || `Document ${index + 1}`}
                          </p>
                          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{doc.docType.replaceAll("_", " ")}</p>
                        </div>
                      </div>
                      {doc.uri && (
                        <div className={cn("mt-3 grid gap-2", canPreviewDocument(doc) ? "grid-cols-2" : "grid-cols-1")}>
                          {canPreviewDocument(doc) && (
                            <button
                              type="button"
                              onClick={() => setPreviewDocument(doc)}
                              aria-label={`Preview ${doc.objectName || doc.docType}`}
                              className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 text-[11px] font-bold text-[#6338f6] transition-colors hover:bg-purple-100"
                            >
                              <EyeIcon size={13} /> Preview
                            </button>
                          )}
                          <a
                            href={doc.uri}
                            download={doc.objectName || true}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Download ${doc.objectName || doc.docType}`}
                            className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] font-bold text-gray-600 transition-colors hover:border-purple-200 hover:text-[#6338f6]"
                          >
                            <DownloadIcon size={13} /> Download
                          </a>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}

              {details.missingDocuments.length > 0 && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                  <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-bold">Required documents still missing</p>
                    <p className="mt-1 leading-5">{details.missingDocuments.map((item) => item.replaceAll("_", " ")).join(", ")}</p>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6338f6]">Review summary</p>
                  <h2 className="mt-1 text-base font-bold text-gray-950">Make a decision</h2>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-[#6338f6]">
                  <SparklesIcon size={18} />
                </div>
              </div>

              <div className="my-5 border-y border-gray-100 py-4"><ReviewChecklist details={details} /></div>

              {isPending ? (
                <div className="space-y-2.5">
                  <Button
                    disabled={isBusy}
                    onClick={handleApprove}
                    className="h-11 w-full rounded-xl bg-emerald-600 font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    {isApproving ? <RefreshCwIcon size={16} className="animate-spin" /> : <CheckCircle2Icon size={16} />}
                    {isApproving ? "Approving…" : "Approve application"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => setIsRejectDialogOpen(true)}
                    className="h-11 w-full rounded-xl border-rose-200 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <XCircleIcon size={16} /> Reject application
                  </Button>
                  <p className="pt-1 text-center text-[11px] leading-4 text-gray-400">Review actions are recorded and may notify the applicant.</p>
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-gray-500">Decision</span>
                    <StatusBadge status={details.status} />
                  </div>
                  {reviewedAt && (
                    <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                      <span className="text-xs font-semibold text-gray-500">Reviewed</span>
                      <span className="text-right text-xs font-medium text-gray-700">{reviewedAt}</span>
                    </div>
                  )}
                  <p className="mt-3 text-[11px] leading-5 text-gray-500">This application has completed the review process.</p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <FingerprintIcon size={15} className="text-gray-400" /> Record details
              </div>
              <dl className="mt-4 space-y-3 text-xs">
                <div>
                  <dt className="text-gray-400">Application UUID</dt>
                  <dd className="mt-1 break-all font-mono text-[11px] font-medium leading-5 text-gray-700">{details.id}</dd>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <dt className="text-gray-400">Applicant ID</dt>
                  <dd className="mt-1 break-all font-mono text-[11px] font-medium leading-5 text-gray-700">{details.applicantId}</dd>
                </div>
              </dl>
            </section>

            <Link
              href={BACK_HREF}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeftIcon size={15} /> Back to all applications
            </Link>
          </aside>
        </div>
      </DetailsShell>

      <RejectionDialog
        isOpen={isRejectDialogOpen}
        applicantName={details.applicantId}
        businessName={details.businessName}
        isRejecting={isRejecting}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleConfirmReject}
      />
      {previewDocument && (
        <DocumentPreviewDialog
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </>
  )
}
