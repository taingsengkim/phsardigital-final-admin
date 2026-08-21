"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { ApplicationTable } from "@/components/seller-applications/application-table"
import { SellerFilters, SellerStats, SellerTable } from "@/components/sellers/seller-directory"
import { cn } from "@/lib/utils"
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  DownloadIcon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react"

import { useGetSellerApplicationsQuery } from "@/lib/redux/service/sellerApplicationApi"
import { useGetSellersQuery } from "@/lib/redux/service/sellerApi"

const TABS = [
  { key: "applications", label: "Applications" },
  { key: "sellers", label: "Sellers" },
] as const

type TabKey = (typeof TABS)[number]["key"]

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/** Quote a value for CSV so embedded commas and quotes survive. */
function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export function SellersWorkspace() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // "applications" is the review queue and the reason an admin usually lands
  // here, so it is the default tab. The tab lives in the URL to keep it
  // linkable and to let /dashboard/seller-applications redirect straight in.
  const tab: TabKey = searchParams.get("tab") === "sellers" ? "sellers" : "applications"

  const {
    data: applications = [],
    isLoading: applicationsLoading,
    isError: applicationsError,
    refetch: refetchApplications,
  } = useGetSellerApplicationsQuery()

  const {
    data: sellers = [],
    isLoading: sellersLoading,
    isError: sellersError,
    refetch: refetchSellers,
  } = useGetSellersQuery()

  const pending = applications.filter((app) => app.status.toUpperCase().includes("PENDING"))
  const approved = applications.filter((app) => app.status.toUpperCase().includes("APPROVED"))
  const rejected = applications.filter((app) => app.status.toUpperCase().includes("REJECTED"))

  function selectTab(next: TabKey) {
    const params = new URLSearchParams(searchParams.toString())
    if (next === "applications") {
      params.delete("tab")
    } else {
      params.set("tab", next)
    }
    const query = params.toString()
    router.replace(`/dashboard/sellers${query ? `?${query}` : ""}`, { scroll: false })
  }

  const isLoading = tab === "applications" ? applicationsLoading : sellersLoading
  const refetch = tab === "applications" ? refetchApplications : refetchSellers

  function handleExport() {
    if (tab === "applications") {
      if (applications.length === 0) return
      downloadCsv(
        "seller-applications",
        ["ID", "Business Name", "Applicant Name", "Email", "Phone", "Status", "Applied On"],
        applications.map((app) => [
          app.id,
          csvCell(app.businessName),
          csvCell(app.name),
          app.email,
          app.phone,
          app.status,
          app.appliedOn,
        ]),
      )
      return
    }

    if (sellers.length === 0) return
    downloadCsv(
      "sellers",
      ["ID", "Name", "Store", "Email", "Phone", "Verification", "Plan", "Listings", "Status"],
      sellers.map((seller) => [
        seller.id,
        csvCell(seller.name),
        csvCell(seller.store),
        seller.email,
        seller.phone,
        seller.verification,
        seller.plan,
        String(seller.listings),
        seller.status,
      ]),
    )
  }

  const exportDisabled = tab === "applications" ? applications.length === 0 : sellers.length === 0

  const tabCounts: Record<TabKey, number> = {
    applications: pending.length,
    sellers: sellers.length,
  }

  return (
    <>
      <DashboardHeader
        title="Sellers"
        description="Review seller applications and manage active sellers."
      >
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportDisabled}
            className="rounded-xl border-gray-200 h-10 px-4 font-semibold text-xs flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
          >
            <DownloadIcon size={15} />
            Export CSV
          </Button>
          <Button
            onClick={() => refetch()}
            className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-10 px-4 font-semibold text-xs flex items-center gap-2 shadow-sm shadow-purple-500/20"
          >
            <RefreshCwIcon size={15} className={isLoading ? "animate-spin" : ""} />
            Refresh Data
          </Button>
        </div>
      </DashboardHeader>

      <div className="border-b border-gray-100 bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1" role="tablist" aria-label="Seller views">
          {TABS.map((entry) => {
            const active = tab === entry.key
            return (
              <button
                key={entry.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(entry.key)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-colors",
                  active ? "text-[#6338f6]" : "text-gray-500 hover:text-gray-900",
                )}
              >
                {entry.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold",
                    active ? "bg-[#6338f6]/10 text-[#6338f6]" : "bg-gray-100 text-gray-500",
                  )}
                >
                  {tabCounts[entry.key]}
                </span>
                {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#6338f6]" />}
              </button>
            )
          })}
        </div>
      </div>

      {tab === "applications" ? (
        <div className="flex flex-1 h-[calc(100vh-137px)] overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatsCard
                title="Total Applications"
                value={applicationsLoading ? "..." : applications.length.toLocaleString()}
                trend="Live Backend API"
                trendType="up"
                icon={ClipboardListIcon}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatsCard
                title="Pending Review"
                value={applicationsLoading ? "..." : pending.length.toLocaleString()}
                subtext="Requires admin decision"
                trendType="neutral"
                icon={ClockIcon}
                iconBgColor="bg-amber-50"
                iconColor="text-amber-600"
              />
              <StatsCard
                title="Approved"
                value={applicationsLoading ? "..." : approved.length.toLocaleString()}
                trend="Active Sellers"
                trendType="up"
                icon={CheckCircle2Icon}
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <StatsCard
                title="Rejected"
                value={applicationsLoading ? "..." : rejected.length.toLocaleString()}
                trend="Declined Requests"
                trendType="down"
                icon={XCircleIcon}
                iconBgColor="bg-rose-50"
                iconColor="text-rose-600"
              />
            </div>

            {applicationsError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 flex items-center justify-between">
                <span>Failed to connect to seller application service.</span>
                <button type="button" onClick={() => refetchApplications()} className="font-bold underline hover:text-rose-950">
                  Retry API
                </button>
              </div>
            )}

            <ApplicationTable
              applications={applications}
              isLoading={applicationsLoading}
              selectedApplicationId={null}
              onSelectApplication={(app) => router.push(`/dashboard/sellers/applications/${app.id}`)}
              onRefresh={refetchApplications}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8 p-8">
          {sellersError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load sellers.{" "}
              <button className="font-semibold underline" onClick={() => refetchSellers()} type="button">
                Retry
              </button>
            </div>
          )}

          <SellerStats sellers={sellers} isLoading={sellersLoading} />

          <div className="space-y-6">
            <SellerFilters />
            <SellerTable sellers={sellers} isLoading={sellersLoading} />
          </div>
        </div>
      )}
    </>
  )
}
