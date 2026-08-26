/** The status enum shared by ListingResponse and UpdateListingRequest. */
export type ListingStatus =
  | "DRAFT"
  | "ACTIVE"
  | "SOLD_OUT"
  | "ARCHIVED"
  | "SUSPENDED"

export const LISTING_STATUSES: ListingStatus[] = [
  "ACTIVE",
  "DRAFT",
  "SOLD_OUT",
  "ARCHIVED",
  "SUSPENDED",
]

/** Sentinel for "no status filter" - see the note in listingsApi. */
export const ALL_STATUSES = "ALL"

export interface ListingRecord {
  id: string
  title: string
  slug: string
  description: string
  status: ListingStatus | string
  sellerId: string | null
  sellerName: string
  sellerLogoUrl: string | null
  categoryName: string
  categorySlug: string
  fullPrice: number
  discountPrice: number | null
  stockQty: number
  sold: number
  isFeatured: boolean
  imageUrl: string | null
  createdAt: string | null
  lastModifiedAt: string | null
  averageRating: number | null
  reviewCount: number
}

export interface ListingQuery {
  status?: string
  categorySlug?: string
  sellerId?: string
  search?: string
  pageNumber?: number
  pageSize?: number
}

export interface ListingPage {
  items: ListingRecord[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
}

export type ListingStatusCounts = Record<string, number>
