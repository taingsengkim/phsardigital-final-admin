"use client"

import { useMemo, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ModerationStatsCard } from "@/components/moderation/listing-stats"
import { ListingModerationTable } from "@/components/moderation/listing-moderation-table"
import { ListingAuditSidebar } from "@/components/moderation/listing-audit-sidebar"
import { 
  AlertTriangleIcon,
  CheckCircle2Icon, 
  ClipboardListIcon, 
  XCircleIcon, 
} from "lucide-react"
import { useGetListingsQuery } from "@/lib/features/marketplace/marketplaceApi"

export default function ListingsModerationPage() {
  const { data: listings = [], isLoading, isError, refetch } = useGetListingsQuery()
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)

  const selectedListing = listings.find((listing) => listing.id === selectedListingId) ?? listings[0] ?? null

  const totalListings = listings.length
  const liveListings = listings.filter((listing) => listing.live).length
  const flaggedListings = listings.filter((listing) => /flag|review|pending/i.test(listing.status)).length
  const bannedListings = listings.filter((listing) => /ban|reject|removed/i.test(listing.status)).length

  const stats = useMemo(
    () => [
      {
        title: "Total Listings",
        value: isLoading ? "..." : totalListings.toLocaleString(),
        subtext: "Fetched from API",
        subtextColor: "text-slate-500",
        icon: ClipboardListIcon,
        iconBgColor: "bg-amber-50",
        iconColor: "text-amber-500",
      },
      {
        title: "Live Listings",
        value: isLoading ? "..." : liveListings.toLocaleString(),
        subtext: "Available in marketplace",
        subtextColor: "text-emerald-500",
        icon: CheckCircle2Icon,
        iconBgColor: "bg-emerald-50",
        iconColor: "text-emerald-500",
      },
      {
        title: "Under Review",
        value: isLoading ? "..." : flaggedListings.toLocaleString(),
        subtext: "Needs moderation",
        subtextColor: "text-amber-500",
        icon: AlertTriangleIcon,
        iconBgColor: "bg-amber-50",
        iconColor: "text-amber-500",
      },
      {
        title: "Banned Listings",
        value: isLoading ? "..." : bannedListings.toLocaleString(),
        subtext: "Policy violations",
        subtextColor: "text-rose-500",
        icon: XCircleIcon,
        iconBgColor: "bg-rose-50",
        iconColor: "text-rose-500",
      },
    ],
    [bannedListings, flaggedListings, isLoading, liveListings, totalListings]
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Listings Moderation" 
          description="Review and manage marketplace listings to ensure safety and quality."
        />
        
        <div className="p-8 space-y-8">
          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load listings. <button className="font-semibold underline" onClick={() => refetch()} type="button">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <ModerationStatsCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ListingModerationTable
                listings={listings}
                isLoading={isLoading}
                selectedListingId={selectedListing?.id ?? null}
                onSelectListing={setSelectedListingId}
              />
            </div>
            <ListingAuditSidebar listing={selectedListing} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
