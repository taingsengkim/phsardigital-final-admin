import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type AccountStatus = "active" | "suspended" | "banned" | "pending" | string

export interface BuyerRecord {
  id: string
  name: string
  email: string
  phone: string
  status: AccountStatus
  joinDate: string
  joinTime?: string | null
  totalOrders: number
  totalSpent: string
  avatar: string | null
  selected?: boolean
}

export interface SellerRecord {
  id: string
  name: string
  store: string
  email: string
  phone: string
  verification: string
  plan: string
  listings: number
  rating: number | null
  reviews: number | null
  sales: string
  status: string
  avatar: string | null
  selected?: boolean
}

export interface ListingRecord {
  id: string
  name: string
  status: string
  seller: string
  category: string
  price: string
  submitted: string
  live: boolean
  imageUrl: string | null
  description: string
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API ?? "/api").replace(/\/$/, "")

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

function normalizeBuyerStatus(value: unknown): AccountStatus {
  const status = toText(value, "active").toLowerCase()

  if (status === "active" || status === "suspended" || status === "banned" || status === "pending") {
    return status
  }

  return status || "active"
}

function getBuyerId(value: Record<string, unknown>, index: number) {
  return toText(value.id) || toText(value._id) || `${toText(value.name, "buyer")}-${index}`
}

function normalizeBuyer(value: unknown, index = 0): BuyerRecord {
  const record = (value ?? {}) as Record<string, unknown>

  return {
    id: getBuyerId(record, index),
    name: toText(record.name, "Untitled buyer"),
    email: toText(record.email, "No email provided"),
    phone: toText(record.phone, "No phone provided"),
    status: normalizeBuyerStatus(record.status ?? record.state ?? record.isActive),
    joinDate: toText(record.joinDate) || toText(record.createdAt) || toText(record.joinedAt) || "Unknown",
    joinTime: toText(record.joinTime) || null,
    totalOrders: toNumber(record.totalOrders ?? record.ordersCount ?? record.orderCount),
    totalSpent: toText(record.totalSpent) || `$${toNumber(record.totalSpentAmount ?? record.spentAmount).toFixed(2)}`,
    avatar: toText(record.avatar) || toText(record.avatarUrl) || null,
    selected: Boolean(record.selected),
  }
}

function normalizeSellerStatus(value: unknown) {
  const status = toText(value, "active").toUpperCase()

  if (status.includes("ACTIVE") || status.includes("PENDING") || status.includes("SUSPENDED")) {
    return status
  }

  return status || "ACTIVE"
}

function getSellerId(value: Record<string, unknown>, index: number) {
  return toText(value.id) || toText(value._id) || `${toText(value.name, "seller")}-${index}`
}

function normalizeSeller(value: unknown, index = 0): SellerRecord {
  const record = (value ?? {}) as Record<string, unknown>

  return {
    id: getSellerId(record, index),
    name: toText(record.name, "Untitled seller"),
    store: toText(record.store) || toText(record.username) || "-",
    email: toText(record.email, "No email provided"),
    phone: toText(record.phone, "No phone provided"),
    verification: toText(record.verification) || toText(record.verificationStatus) || "Pending",
    plan: toText(record.plan) || toText(record.subscriptionPlan) || "Basic",
    listings: toNumber(record.listings ?? record.listingsCount ?? record.totalListings),
    rating: typeof record.rating === "number" ? record.rating : record.rating ? toNumber(record.rating) : null,
    reviews: typeof record.reviews === "number" ? record.reviews : record.reviews ? toNumber(record.reviews) : null,
    sales: toText(record.sales) || toText(record.totalSales) || "$0.00",
    status: normalizeSellerStatus(record.status ?? record.state ?? record.isActive),
    avatar: toText(record.avatar) || toText(record.avatarUrl) || null,
    selected: Boolean(record.selected),
  }
}

function formatPrice(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const text = toText(value)

  if (!text) {
    return "$0.00"
  }

  if (/^[\d,]+(\.\d+)?$/.test(text)) {
    const parsed = Number(text.replace(/,/g, ""))

    if (Number.isFinite(parsed)) {
      return `$${parsed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  return text
}

function normalizeListingStatus(value: unknown) {
  const status = toText(value, "flagged for review").trim()

  return status || "flagged for review"
}

function getListingId(value: Record<string, unknown>, index: number) {
  return toText(value.id) || toText(value._id) || toText(value.uuid) || `${toText(value.name, "listing")}-${index}`
}

function normalizeListing(value: unknown, index = 0): ListingRecord {
  const record = (value ?? {}) as Record<string, unknown>

  return {
    id: getListingId(record, index),
    name: toText(record.name) || toText(record.title) || toText(record.productName) || "Untitled listing",
    status: normalizeListingStatus(record.status ?? record.state ?? record.moderationStatus ?? record.reviewStatus),
    seller: toText(record.seller) || toText(record.sellerName) || toText(record.ownerName) || toText(record.storeName) || "Unknown seller",
    category: toText(record.category) || toText(record.categoryName) || toText(record.type) || "Uncategorized",
    price: formatPrice(record.price ?? record.listPrice ?? record.salePrice ?? record.amount),
    submitted:
      toText(record.submitted) ||
      toText(record.submittedAt) ||
      toText(record.createdAt) ||
      toText(record.listedAt) ||
      toText(record.updatedAt) ||
      "Unknown",
    live: Boolean(record.live ?? record.isLive ?? record.published ?? record.active),
    imageUrl: toText(record.imageUrl) || toText(record.image) || toText(record.thumbnail) || toText(record.coverImage) || null,
    description: toText(record.description) || toText(record.details) || toText(record.summary) || "No description provided.",
  }
}

function normalizeList<T>(response: unknown, itemNormalizer: (value: unknown, index: number) => T): T[] {
  if (Array.isArray(response)) {
    return response.map(itemNormalizer)
  }

  const record = (response ?? {}) as Record<string, unknown>
  const list =
    (Array.isArray(record.data) && record.data) ||
    (Array.isArray(record.items) && record.items) ||
    (Array.isArray(record.results) && record.results) ||
    (Array.isArray(record.buyers) && record.buyers) ||
    (Array.isArray(record.sellers) && record.sellers) ||
    (Array.isArray(record.listings) && record.listings) ||
    (Array.isArray(record.products) && record.products) ||
    (Array.isArray(record.payload) && record.payload) ||
    []

  return list.map(itemNormalizer)
}

export const marketplaceApi = createApi({
  reducerPath: "marketplaceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")

      return headers
    },
  }),
  tagTypes: ["Buyers", "Sellers", "Listings"],
  endpoints: (builder) => ({
    getBuyers: builder.query<BuyerRecord[], void>({
      query: () => "/buyers",
      transformResponse: (response: unknown) => normalizeList(response, normalizeBuyer),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((buyer) => ({ type: "Buyers" as const, id: buyer.id })),
              { type: "Buyers" as const, id: "LIST" },
            ]
          : [{ type: "Buyers" as const, id: "LIST" }],
    }),
    getSellers: builder.query<SellerRecord[], void>({
      query: () => "/sellers",
      transformResponse: (response: unknown) => normalizeList(response, normalizeSeller),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((seller) => ({ type: "Sellers" as const, id: seller.id })),
              { type: "Sellers" as const, id: "LIST" },
            ]
          : [{ type: "Sellers" as const, id: "LIST" }],
    }),
      getListings: builder.query<ListingRecord[], void>({
        query: () => "/listings",
        transformResponse: (response: unknown) => normalizeList(response, normalizeListing),
        providesTags: (result) =>
          result?.length
            ? [
                ...result.map((listing) => ({ type: "Listings" as const, id: listing.id })),
                { type: "Listings" as const, id: "LIST" },
              ]
            : [{ type: "Listings" as const, id: "LIST" }],
      }),
      updateListing: builder.mutation<ListingRecord, { id: string; data: Partial<ListingRecord> }>({
        query: ({ id, data }) => ({
          url: `/listings/${id}`,
          method: "PATCH",
          body: data,
        }),
        transformResponse: (response: unknown) => {
          const normalized = normalizeList(response, normalizeListing)
          return normalized[0] ?? normalizeListing(response)
        },
        invalidatesTags: [{ type: "Listings", id: "LIST" }],
      }),
  }),
})

export const { 
  useGetBuyersQuery, 
  useGetSellersQuery, 
  useGetListingsQuery,
  useUpdateListingMutation 
} = marketplaceApi