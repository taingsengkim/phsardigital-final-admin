import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"

import {
  ALL_STATUSES,
  LISTING_STATUSES,
  type ListingPage,
  type ListingQuery,
  type ListingRecord,
  type ListingStatusCounts,
} from "@/lib/types/listing"

export type {
  ListingPage,
  ListingQuery,
  ListingRecord,
  ListingStatus,
  ListingStatusCounts,
} from "@/lib/types/listing"

const apiBaseUrl = (process.env.NEXT_PUBLIC_API ?? "/api").replace(/\/$/, "")

/** Upstream caps pageSize at 100. */
const MAX_PAGE_SIZE = 100
/** Bounds the merged "all statuses" sweep. */
const MAX_PAGES = 25

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return fallback
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""))

    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function toOptionalNumber(value: unknown) {
  return value === null || value === undefined ? null : toNumber(value)
}

function normalizeListing(value: unknown, index = 0): ListingRecord {
  const record = (value ?? {}) as Record<string, unknown>
  const seller = (record.sellerProfile ?? {}) as Record<string, unknown>
  const category = (record.category ?? {}) as Record<string, unknown>
  const thumbnail = (record.thumbnailUri ?? {}) as Record<string, unknown>
  const images = Array.isArray(record.images) ? record.images : []
  const firstImage = (images[0] ?? {}) as Record<string, unknown>

  return {
    id: toText(record.uuid) || toText(record.id) || `listing-${index}`,
    title: toText(record.title, "Untitled listing"),
    slug: toText(record.slug),
    description: toText(record.description) || "No description provided.",
    status: toText(record.status, "DRAFT"),
    sellerId: toText(seller.sellerId) || null,
    sellerName: toText(seller.businessName) || "Unknown seller",
    sellerLogoUrl: toText(seller.logoUri) || null,
    categoryName: toText(category.name) || "Uncategorized",
    categorySlug: toText(category.slug),
    fullPrice: toNumber(record.fullPrice),
    discountPrice: toOptionalNumber(record.discountPrice),
    stockQty: toNumber(record.stockQty),
    sold: toNumber(record.sold),
    isFeatured: Boolean(record.isFeatured),
    imageUrl: toText(thumbnail.uri) || toText(firstImage.uri) || null,
    createdAt: toText(record.createdAt) || null,
    lastModifiedAt: toText(record.lastModifiedAt) || null,
    averageRating: toOptionalNumber(record.averageRating),
    reviewCount: toNumber(record.reviewCount),
  }
}

function extractContent(response: unknown): unknown[] {
  if (Array.isArray(response)) {
    return response
  }

  const record = (response ?? {}) as Record<string, unknown>

  return Array.isArray(record.content) ? record.content : []
}

function getPageMeta(response: unknown) {
  const record = (response ?? {}) as Record<string, unknown>
  const page = (record.page ?? {}) as Record<string, unknown>

  return {
    totalElements: toNumber(page.totalElements),
    totalPages: Math.max(toNumber(page.totalPages), 1),
  }
}

function buildSearchParams(query: ListingQuery, overrides: Record<string, string | number> = {}) {
  const params = new URLSearchParams()

  if (query.status && query.status !== ALL_STATUSES) {
    params.set("status", query.status)
  }
  if (query.categorySlug) {
    params.set("categorySlug", query.categorySlug)
  }
  if (query.sellerId) {
    params.set("sellerId", query.sellerId)
  }
  if (query.search?.trim()) {
    params.set("search", query.search.trim())
  }

  for (const [key, value] of Object.entries(overrides)) {
    params.set(key, String(value))
  }

  return params
}

type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
type FetchWithBQ = (arg: string | FetchArgs) => ReturnType<AppBaseQuery>

async function fetchAllPages(fetchWithBQ: FetchWithBQ, query: ListingQuery) {
  const items: unknown[] = []
  let totalPages = 1

  for (let pageNumber = 0; pageNumber < totalPages && pageNumber < MAX_PAGES; pageNumber += 1) {
    const params = buildSearchParams(query, { pageNumber, pageSize: MAX_PAGE_SIZE })
    const result = await fetchWithBQ(`/listings?${params.toString()}`)

    if (result.error) {
      return { items, error: result.error as FetchBaseQueryError }
    }

    items.push(...extractContent(result.data))
    totalPages = getPageMeta(result.data).totalPages
  }

  return { items, error: undefined }
}

/** Newest activity first, which is the order a moderation queue wants. */
function byRecencyDesc(left: ListingRecord, right: ListingRecord) {
  const leftAt = left.lastModifiedAt ?? left.createdAt ?? ""
  const rightAt = right.lastModifiedAt ?? right.createdAt ?? ""

  return rightAt.localeCompare(leftAt)
}

export const listingsApi = createApi({
  reducerPath: "listingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")

      return headers
    },
  }),
  tagTypes: ["Listings"],
  endpoints: (builder) => ({
    /**
     * Upstream only returns ACTIVE listings unless an explicit `status` is
     * passed (that filter is admin-only), so "all statuses" has to be a merge
     * of one sweep per status rather than a single unfiltered request.
     */
    getListings: builder.query<ListingPage, ListingQuery>({
      queryFn: async (arg, _api, _extraOptions, fetchWithBQ) => {
        const pageNumber = Math.max(arg.pageNumber ?? 0, 0)
        const pageSize = Math.min(Math.max(arg.pageSize ?? 10, 1), MAX_PAGE_SIZE)

        if (arg.status && arg.status !== ALL_STATUSES) {
          const params = buildSearchParams(arg, { pageNumber, pageSize })
          const result = await fetchWithBQ(`/listings?${params.toString()}`)

          if (result.error) {
            return { error: result.error as FetchBaseQueryError }
          }

          const meta = getPageMeta(result.data)

          return {
            data: {
              items: extractContent(result.data).map((item, index) => normalizeListing(item, index)),
              pageNumber,
              pageSize,
              totalElements: meta.totalElements,
              totalPages: meta.totalPages,
            },
          }
        }

        const merged: ListingRecord[] = []

        for (const status of LISTING_STATUSES) {
          const { items, error } = await fetchAllPages(fetchWithBQ, { ...arg, status })

          if (error) {
            // Upstream rejects `status` for non-administrators. Rather than
            // blanking the page, fall back to the public view (ACTIVE only).
            if (error.status === 403) {
              const fallback = await fetchAllPages(fetchWithBQ, {
                ...arg,
                status: undefined,
              })

              if (fallback.error) {
                return { error: fallback.error }
              }

              merged.length = 0
              merged.push(
                ...fallback.items.map((item, index) => normalizeListing(item, index))
              )
              break
            }

            return { error }
          }

          merged.push(...items.map((item, index) => normalizeListing(item, index)))
        }

        merged.sort(byRecencyDesc)

        const start = pageNumber * pageSize

        return {
          data: {
            items: merged.slice(start, start + pageSize),
            pageNumber,
            pageSize,
            totalElements: merged.length,
            totalPages: Math.max(Math.ceil(merged.length / pageSize), 1),
          },
        }
      },
      providesTags: (result) =>
        result?.items.length
          ? [
              ...result.items.map((listing) => ({ type: "Listings" as const, id: listing.id })),
              { type: "Listings" as const, id: "LIST" },
            ]
          : [{ type: "Listings" as const, id: "LIST" }],
    }),

    /** One cheap count request per status, so the stat cards are real numbers. */
    getListingStatusCounts: builder.query<ListingStatusCounts, Omit<ListingQuery, "status">>({
      queryFn: async (arg, _api, _extraOptions, fetchWithBQ) => {
        const results = await Promise.all(
          LISTING_STATUSES.map(async (status) => {
            const params = buildSearchParams({ ...arg, status }, { pageNumber: 0, pageSize: 1 })
            const result = await fetchWithBQ(`/listings?${params.toString()}`)

            return { status, result }
          })
        )

        const counts: ListingStatusCounts = {}

        for (const { status, result } of results) {
          if (result.error) {
            return { error: result.error as FetchBaseQueryError }
          }

          counts[status] = getPageMeta(result.data).totalElements
        }

        return { data: counts }
      },
      providesTags: [{ type: "Listings", id: "COUNTS" }],
    }),

    updateListingStatus: builder.mutation<ListingRecord, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/listings/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: unknown) => normalizeListing(response),
      invalidatesTags: [
        { type: "Listings", id: "LIST" },
        { type: "Listings", id: "COUNTS" },
      ],
    }),
  }),
})

export const {
  useGetListingsQuery,
  useGetListingStatusCountsQuery,
  useUpdateListingStatusMutation,
} = listingsApi
