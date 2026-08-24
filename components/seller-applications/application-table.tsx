"use client"

import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchIcon, CheckCircle2Icon, XCircleIcon, ClockIcon, DownloadIcon, MapPinIcon, RefreshCwIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SellerApplication } from "@/lib/types/seller-application"

interface ApplicationTableProps {
  applications: SellerApplication[]
  selectedApplicationId: string | null
  onSelectApplication: (application: SellerApplication) => void
  isLoading?: boolean
  onRefresh?: () => void
  onExport?: () => void
  exportDisabled?: boolean
}

type StatusTab = "ALL" | "PENDING" | "APPROVED" | "REJECTED"

export function ApplicationTable({
  applications,
  selectedApplicationId,
  onSelectApplication,
  isLoading,
  onRefresh,
  onExport,
  exportDisabled,
}: ApplicationTableProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      PENDING: applications.filter((a) => a.status.toUpperCase().includes("PENDING")).length,
      APPROVED: applications.filter((a) => a.status.toUpperCase().includes("APPROVED")).length,
      REJECTED: applications.filter((a) => a.status.toUpperCase().includes("REJECTED")).length,
    }
  }, [applications])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Filter by tab
      const statusUpper = app.status.toUpperCase()
      if (activeTab === "PENDING" && !statusUpper.includes("PENDING")) return false
      if (activeTab === "APPROVED" && !statusUpper.includes("APPROVED")) return false
      if (activeTab === "REJECTED" && !statusUpper.includes("REJECTED")) return false

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchName = app.name.toLowerCase().includes(query)
        const matchBusiness = app.businessName.toLowerCase().includes(query)
        const matchEmail = app.email.toLowerCase().includes(query) || app.businessEmail.toLowerCase().includes(query)
        const matchLocation = app.location.toLowerCase().includes(query)
        if (!matchName && !matchBusiness && !matchEmail && !matchLocation) return false
      }

      return true
    })
  }, [applications, activeTab, searchQuery])

  // Pagination calculation
  const totalPages = Math.ceil(filteredApplications.length / pageSize) || 1
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredApplications.slice(start, start + pageSize)
  }, [filteredApplications, currentPage, pageSize])

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs flex flex-col">
      {/* Table controls stay contained and only share a row on very wide screens. */}
      <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-4 sm:p-6">
        {/* Status Filter Tabs */}
        <div className="scrollbar-none flex max-w-full shrink-0 items-center overflow-x-auto rounded-2xl bg-gray-100/80 p-1">
          <button
            type="button"
            onClick={() => handleTabChange("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "ALL"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200 text-gray-700">{counts.ALL}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "PENDING"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-gray-500 hover:text-amber-800"
            }`}
          >
            <ClockIcon size={14} className="text-amber-500" />
            Pending <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">{counts.PENDING}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("APPROVED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "APPROVED"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-gray-500 hover:text-emerald-800"
            }`}
          >
            <CheckCircle2Icon size={14} className="text-emerald-500" />
            Approved <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">{counts.APPROVED}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("REJECTED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "REJECTED"
                ? "bg-white text-rose-800 shadow-xs"
                : "text-gray-500 hover:text-rose-800"
            }`}
          >
            <XCircleIcon size={14} className="text-rose-500" />
            Rejected <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800">{counts.REJECTED}</span>
          </button>
        </div>

        {/* Search & list actions */}
        <div className="flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:items-center 2xl:max-w-2xl">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <Input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search seller, business or city..." 
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:bg-white rounded-xl h-10 text-xs"
            />
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:items-center">
            {onExport && (
              <Button
                variant="outline"
                onClick={onExport}
                disabled={exportDisabled}
                className="h-10 rounded-xl border-gray-200 px-3.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                title="Export the current application dataset"
              >
                <DownloadIcon size={14} />
                Export CSV
              </Button>
            )}

            {onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                className="flex h-10 items-center gap-1.5 rounded-xl border-gray-200 px-3.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
                title="Refresh applications"
              >
                <RefreshCwIcon size={14} className={isLoading ? "animate-spin text-[#6338f6]" : ""} />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Business & Applicant</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Business Type</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Applied Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {isLoading && applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCwIcon className="size-6 animate-spin text-[#6338f6]" />
                    <p className="font-semibold text-sm">Loading seller applications...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedApplications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  <p className="font-semibold text-sm">No seller applications match your criteria.</p>
                  <p className="text-xs text-gray-400 mt-1">Try clearing filters or search parameters.</p>
                </td>
              </tr>
            ) : (
              paginatedApplications.map((app) => {
                const isSelected = selectedApplicationId === app.id
                const isApproved = app.status.toUpperCase().includes("APPROVED")
                const isRejected = app.status.toUpperCase().includes("REJECTED")

                return (
                  <tr 
                    key={app.id} 
                    onClick={() => onSelectApplication(app)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-purple-50/60 font-medium"
                        : "hover:bg-gray-50/80"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border border-gray-100 shadow-2xs">
                          <AvatarImage src={app.logoUri || app.avatar || undefined} />
                          <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xs">
                            {(app.businessName || app.name).substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{app.businessName}</p>
                          <p className="text-xs text-gray-500">{app.name} • <span className="text-gray-400">{app.email}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-700">{app.businessType}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPinIcon size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate max-w-[160px]" title={app.location}>{app.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2Icon size={12} /> Approved
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircleIcon size={12} /> Rejected
                        </span>
                      )}
                      {!isApproved && !isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <ClockIcon size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-semibold text-gray-900">{app.appliedOn}</p>
                      <p className="text-[10px] text-gray-400">{app.appliedAt}</p>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Bar */}
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
        <p className="text-xs text-gray-500">
          Showing <span className="text-gray-900 font-bold">{filteredApplications.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
          <span className="text-gray-900 font-bold">{Math.min(currentPage * pageSize, filteredApplications.length)}</span> of{" "}
          <span className="text-gray-900 font-bold">{filteredApplications.length}</span> applications
        </p>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="rounded-xl border-gray-200 h-8 px-3 text-xs font-semibold"
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`size-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                currentPage === pageNum
                  ? "bg-[#6338f6] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="rounded-xl border-gray-200 h-8 px-3 text-xs font-semibold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
