"use client"

import * as React from "react"
import { useGetReportsQuery } from "@/lib/redux/service/reportApi"
import type { AdminReport, ReportStatus, ReportTargetType } from "@/lib/types/report"
import { ReportDetailSheet } from "./report-detail-sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  CheckIcon,
  FilterIcon,
  RefreshCwIcon,
  LayersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  CornerDownRightIcon,
  FlagIcon,
} from "lucide-react"
import { showToast } from "@/components/ui/toast-popup"

interface GroupedReportRow {
  groupKey: string
  targetType: ReportTargetType
  targetId: string
  targetLabel: string
  reports: AdminReport[]
}

function truncateUuid(uuid: string) {
  if (!uuid) return "Anonymous"
  if (uuid.length <= 12) return uuid
  return `${uuid.slice(0, 6)}...${uuid.slice(-4)}`
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}

export function ReportQueueTable() {
  // Filters - Default status to OPEN as requested
  const [statusFilter, setStatusFilter] = React.useState<ReportStatus | "ALL">("OPEN")
  const [targetTypeFilter, setTargetTypeFilter] = React.useState<ReportTargetType | "ALL">("ALL")
  const [pageNumber, setPageNumber] = React.useState(0)
  const pageSize = 20

  // Query reports
  const { data, isLoading, isFetching, refetch } = useGetReportsQuery({
    status: statusFilter,
    targetType: targetTypeFilter,
    pageNumber,
    pageSize,
  })

  // Selected report for side sheet
  const [selectedReportUuid, setSelectedReportUuid] = React.useState<string | null>(null)
  const [selectedSiblingReports, setSelectedSiblingReports] = React.useState<AdminReport[]>([])

  // Expandable group keys
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set())

  // Copy indicator state
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const copyReporterId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      showToast({ type: "error", message: "Failed to copy reporter ID" })
    }
  }

  const toggleGroupExpand = (groupKey: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }

  const handleRowClick = (report: AdminReport, groupReports: AdminReport[]) => {
    setSelectedReportUuid(report.uuid)
    setSelectedSiblingReports(groupReports)
  }

  // Group consecutive rows sharing same targetType and targetId
  const groupedRows: GroupedReportRow[] = React.useMemo(() => {
    const content = data?.content ?? []
    const groups: GroupedReportRow[] = []

    for (let i = 0; i < content.length; i++) {
      const report = content[i]
      const lastGroup = groups[groups.length - 1]

      if (
        lastGroup &&
        lastGroup.targetType === report.targetType &&
        lastGroup.targetId === report.targetId
      ) {
        lastGroup.reports.push(report)
      } else {
        groups.push({
          groupKey: `${report.targetType}-${report.targetId}-${i}`,
          targetType: report.targetType,
          targetId: report.targetId,
          targetLabel: report.targetLabel,
          reports: [report],
        })
      }
    }

    return groups
  }, [data?.content])

  const totalElements = data?.page.totalElements ?? 0
  const totalPages = data?.page.totalPages ?? 1

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {(["OPEN", "RESOLVED", "DISMISSED", "ALL"] as const).map((st) => {
              const isActive = statusFilter === st
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st)
                    setPageNumber(0)
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white text-[#6338f6] shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {st === "ALL" ? "All Statuses" : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              )
            })}
          </div>

          {/* "N open" badge next to status filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 rounded-xl text-xs font-extrabold text-amber-900">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {totalElements} {statusFilter === "OPEN" ? "open" : statusFilter.toLowerCase()}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />

          {/* Target Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500">Target:</span>
            <div className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100">
              {(["ALL", "LISTING", "SELLER", "REVIEW"] as const).map((tt) => {
                const isActive = targetTypeFilter === tt
                return (
                  <button
                    key={tt}
                    type="button"
                    onClick={() => {
                      setTargetTypeFilter(tt)
                      setPageNumber(0)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-[#6338f6] shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tt === "ALL"
                      ? "All Types"
                      : tt.charAt(0) + tt.slice(1).toLowerCase() + "s"}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Refresh & stats */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-gray-200 text-gray-700 h-9 px-3 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCwIcon size={13} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Target</th>
                <th className="py-4 px-6">Reason</th>
                <th className="py-4 px-6">Note</th>
                <th className="py-4 px-6">Reporter</th>
                <th className="py-4 px-6">Created At</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="size-6 border-2 border-[#6338f6] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Loading moderation queue...</span>
                    </div>
                  </td>
                </tr>
              ) : groupedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
                        <FlagIcon size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-900">No reports found</p>
                      <p className="text-xs text-gray-500">
                        There are currently no reports matching your active filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                groupedRows.map((group) => {
                  const primary = group.reports[0]
                  const hasMultiple = group.reports.length > 1
                  const isExpanded = expandedGroups.has(group.groupKey)

                  return (
                    <React.Fragment key={group.groupKey}>
                      {/* Primary Row */}
                      <tr
                        onClick={() => handleRowClick(primary, group.reports)}
                        className={`hover:bg-purple-50/30 transition-colors cursor-pointer group ${
                          hasMultiple ? "bg-gray-50/20" : ""
                        }`}
                      >
                        {/* Target Label + TargetType Badge + Multiple Badge */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1.5 max-w-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                                  primary.targetType === "LISTING"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : primary.targetType === "SELLER"
                                    ? "bg-purple-50 text-[#6338f6] border-purple-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {primary.targetType}
                              </Badge>

                              {/* Multi-report badge with expand toggle */}
                              {hasMultiple && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleGroupExpand(group.groupKey, e)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-[#6338f6] hover:bg-purple-200 text-[10px] font-extrabold transition-colors"
                                  title="Multiple reports for this target. Click to expand."
                                >
                                  <LayersIcon size={11} />
                                  <span>{group.reports.length} reports</span>
                                  {isExpanded ? (
                                    <ChevronUpIcon size={12} />
                                  ) : (
                                    <ChevronDownIcon size={12} />
                                  )}
                                </button>
                              )}
                            </div>

                            <span className="font-bold text-gray-900 group-hover:text-[#6338f6] transition-colors truncate">
                              {primary.targetLabel}
                            </span>
                          </div>
                        </td>

                        {/* Reason Chip */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                            {primary.reason}
                          </span>
                        </td>

                        {/* Truncated Note (two lines max) */}
                        <td className="py-4 px-6">
                          <p
                            className="text-xs text-gray-600 line-clamp-2 max-w-xs sm:max-w-sm leading-relaxed"
                            title={primary.note}
                          >
                            {primary.note || (
                              <span className="text-gray-400 italic">No note provided</span>
                            )}
                          </p>
                        </td>

                        {/* Reporter ID (truncated, copyable) */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-xs font-semibold text-gray-700 truncate max-w-[120px]"
                              title={primary.reporterId}
                            >
                              {truncateUuid(primary.reporterId)}
                            </span>
                            {primary.reporterId && (
                              <button
                                type="button"
                                onClick={(e) => copyReporterId(primary.reporterId, e)}
                                className="text-gray-400 hover:text-[#6338f6] p-1 rounded-md transition-colors"
                                title="Copy Reporter UUID"
                              >
                                {copiedId === primary.reporterId ? (
                                  <CheckIcon size={14} className="text-emerald-600" />
                                ) : (
                                  <CopyIcon size={14} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Created At */}
                        <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(primary.createdAt)}
                        </td>

                        {/* Status Pill */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <Badge
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-none ${
                              primary.status === "OPEN"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : primary.status === "RESOLVED"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {primary.status}
                          </Badge>
                        </td>
                      </tr>

                      {/* Expanded Child Rows when multiple reports share the same target */}
                      {hasMultiple &&
                        isExpanded &&
                        group.reports.slice(1).map((child, childIdx) => (
                          <tr
                            key={child.uuid}
                            onClick={() => handleRowClick(child, group.reports)}
                            className="bg-purple-50/20 hover:bg-purple-100/40 transition-colors cursor-pointer border-l-4 border-l-[#6338f6]"
                          >
                            <td className="py-3 px-6 pl-10">
                              <div className="flex items-center gap-2 text-xs text-purple-900 font-semibold">
                                <CornerDownRightIcon size={14} className="text-[#6338f6]" />
                                <span>Report #{childIdx + 2} on same target</span>
                              </div>
                            </td>

                            <td className="py-3 px-6">
                              <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                                {child.reason}
                              </span>
                            </td>

                            <td className="py-3 px-6">
                              <p className="text-xs text-gray-600 line-clamp-2 max-w-xs leading-relaxed">
                                {child.note || (
                                  <span className="text-gray-400 italic">No note provided</span>
                                )}
                              </p>
                            </td>

                            <td className="py-3 px-6">
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-mono text-xs font-semibold text-gray-700 truncate max-w-[120px]"
                                  title={child.reporterId}
                                >
                                  {truncateUuid(child.reporterId)}
                                </span>
                                {child.reporterId && (
                                  <button
                                    type="button"
                                    onClick={(e) => copyReporterId(child.reporterId, e)}
                                    className="text-gray-400 hover:text-[#6338f6] p-1 rounded-md transition-colors"
                                    title="Copy Reporter UUID"
                                  >
                                    {copiedId === child.reporterId ? (
                                      <CheckIcon size={14} className="text-emerald-600" />
                                    ) : (
                                      <CopyIcon size={14} />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(child.createdAt)}
                            </td>

                            <td className="py-3 px-6 text-right whitespace-nowrap">
                              <Badge
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-none ${
                                  child.status === "OPEN"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                    : child.status === "RESOLVED"
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {child.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing page <span className="font-bold text-gray-800">{pageNumber + 1}</span> of{" "}
            <span className="font-bold text-gray-800">{totalPages}</span> ({totalElements} reports total)
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
              disabled={pageNumber <= 0 || isLoading}
              className="rounded-xl h-8 px-3 text-xs border-gray-200"
            >
              <ChevronLeftIcon size={14} className="mr-1" /> Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={pageNumber >= totalPages - 1 || isLoading}
              className="rounded-xl h-8 px-3 text-xs border-gray-200"
            >
              Next <ChevronRightIcon size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Sheet Detail Panel */}
      <ReportDetailSheet
        reportUuid={selectedReportUuid}
        open={Boolean(selectedReportUuid)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedReportUuid(null)
            setSelectedSiblingReports([])
          }
        }}
        siblingReports={selectedSiblingReports}
        onReportsUpdated={() => refetch()}
      />
    </div>
  )
}
