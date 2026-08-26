"use client"

import { useEffect, useMemo, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ModerationStatsCard } from "@/components/moderation/listing-stats"
import {
  ListingModerationTable,
  type CategoryOption,
  type SellerOption,
} from "@/components/moderation/listing-moderation-table"
import { ListingAuditSidebar } from "@/components/moderation/listing-audit-sidebar"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  XCircleIcon,
} from "lucide-react"
import {
  useGetListingsQuery,
  useGetListingStatusCountsQuery,
} from "@/lib/features/listings/listingsApi"
import { useGetCategoriesQuery } from "@/lib/redux/service/categoryApi"
import { ALL_STATUSES } from "@/lib/types/listing"

const PAGE_SIZE = 10

/** Debounces the search box so typing does not fire a request per keystroke. */
function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export default function ListingsModerationPage() {
  const [status, setStatus] = useState<string>(ALL_STATUSES)
  const [categorySlug, setCategorySlug] = useState("")
  const [sellerId, setSellerId] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [pageNumber, setPageNumber] = useState(0)
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)

  const search = useDebounced(searchInput)

  const filters = useMemo(
    () => ({ categorySlug, sellerId, search }),
    [categorySlug, sellerId, search]
  )

  const {
    data: page,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetListingsQuery({ ...filters, status, pageNumber, pageSize: PAGE_SIZE })

  const { data: counts, isError: isCountsError } = useGetListingStatusCountsQuery(filters)
  const { data: categories = [] } = useGetCategoriesQuery()

  // Any filter change invalidates the current page offset.
  const changeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPageNumber(0)
  }

  const listings = useMemo(() => page?.items ?? [], [page])

  const selectedListing =
    listings.find((listing) => listing.id === selectedListingId) ?? listings[0] ?? null

  const categoryOptions: CategoryOption[] = useMemo(
    () =>
      categories
        .filter((category) => category.slug)
        .map((category) => ({ slug: category.slug, name: category.name })),
    [categories]
  )

  // Seller options come from the rows on screen - upstream has no admin
  // seller-directory endpoint to enumerate them from.
  const sellerOptions: SellerOption[] = useMemo(() => {
    const seen = new Map<string, string>()

    for (const listing of listings) {
      if (listing.sellerId && !seen.has(listing.sellerId)) {
        seen.set(listing.sellerId, listing.sellerName)
      }
    }

    return [...seen].map(([id, name]) => ({ id, name }))
  }, [listings])

  const totalListings = counts
    ? Object.values(counts).reduce((sum, value) => sum + value, 0)
    : 0
  const liveListings = counts?.ACTIVE ?? 0
  const underReview = counts?.DRAFT ?? 0
  const bannedListings = (counts?.SUSPENDED ?? 0) + (counts?.ARCHIVED ?? 0)

  // Counts need the admin-only status filter; show a dash rather than a
  // permanent spinner if upstream refuses it.
  const statValue = (value: number) =>
    counts ? value.toLocaleString() : isCountsError ? "—" : "..."

  const stats = [
    {
      title: "Total Listings",
      value: statValue(totalListings),
      subtext: "Across every status",
      subtextColor: "text-slate-500",
      icon: ClipboardListIcon,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Live Listings",
      value: statValue(liveListings),
      subtext: "Available in marketplace",
      subtextColor: "text-emerald-500",
      icon: CheckCircle2Icon,
      iconBgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Under Review",
      value: statValue(underReview),
      subtext: "Unpublished as draft",
      subtextColor: "text-amber-500",
      icon: AlertTriangleIcon,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Banned Listings",
      value: statValue(bannedListings),
      subtext: "Suspended or archived",
      subtextColor: "text-rose-500",
      icon: XCircleIcon,
      iconBgColor: "bg-rose-50",
      iconColor: "text-rose-500",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader
          title="Listings Moderation"
          description="Review and manage marketplace listings to ensure safety and quality."
        />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load listings.{" "}
              <button className="font-semibold underline" onClick={() => refetch()} type="button">
                Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat) => (
              <ModerationStatsCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-1 min-w-0">
              <ListingModerationTable
                page={page}
                isLoading={isLoading}
                isFetching={isFetching}
                selectedListingId={selectedListing?.id ?? null}
                onSelectListing={setSelectedListingId}
                status={status}
                onStatusChange={changeFilter(setStatus)}
                categorySlug={categorySlug}
                onCategoryChange={changeFilter(setCategorySlug)}
                categoryOptions={categoryOptions}
                sellerId={sellerId}
                onSellerChange={changeFilter(setSellerId)}
                sellerOptions={sellerOptions}
                search={searchInput}
                onSearchChange={changeFilter(setSearchInput)}
                onPageChange={setPageNumber}
              />
            </div>
            <ListingAuditSidebar listing={selectedListing} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
