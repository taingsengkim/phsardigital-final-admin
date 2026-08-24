import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { Seller, SellerStatus } from "@/lib/types/seller"
import { extractList, toNumber, toText } from "./api-utils"

function normalizeStatus(value: unknown): SellerStatus {
  if (typeof value === "boolean") return value ? "ACTIVE" : "SUSPENDED"
  const textVal = toText(value, "ACTIVE").toUpperCase()
  if (textVal === "APPROVED") return "ACTIVE"
  if (textVal === "REJECTED") return "SUSPENDED"
  return textVal as SellerStatus
}

function normalizeSeller(value: unknown, index: number): Seller {
  const record = (value ?? {}) as Record<string, unknown>
  const statusStr = toText(record.status).toUpperCase()
  const city = toText(record.city)
  const province = toText(record.province)
  const completedOrders = toNumber(record.completedOrders)

  return {
    id: toText(record.sellerId) || toText(record.uuid) || toText(record.id) || `seller-${index}`,
    name: toText(record.businessName) || toText(record.fullName) || toText(record.name) || toText(record.username) || "Untitled seller",
    store: toText(record.businessName) || toText(record.store) || toText(record.storeName) || toText(record.username) || "-",
    email: toText(record.email),
    phone: toText(record.phone) || toText(record.phoneNumber),
    verification: statusStr === "PENDING" ? "Pending" : "Verified",
    plan: toText(record.plan) || toText(record.subscriptionPlan) || "—",
    listings: toNumber(record.listings ?? record.listingsCount ?? record.totalListings),
    rating: record.averageRating == null && record.rating == null ? null : toNumber(record.averageRating ?? record.rating),
    reviews: record.reviewCount == null && record.reviews == null ? null : toNumber(record.reviewCount ?? record.reviews),
    sales: toText(record.sales) || toText(record.totalSales) || `${completedOrders.toLocaleString()} orders`,
    status: normalizeStatus(record.status ?? record.state ?? record.isActive ?? true),
    avatar: toText(record.logoUri) || toText(record.avatar) || toText(record.avatarUrl) || null,
    location: [city, province].filter(Boolean).join(", ") || "Not provided",
    completedOrders,
    selected: Boolean(record.selected),
  }
}

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin",
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Sellers"],
  endpoints: (builder) => ({
    getSellers: builder.query<Seller[], void>({
      query: () => "/sellers",
      transformResponse: (response: unknown) => extractList(response, "sellers").map(normalizeSeller),
      providesTags: (result) => [
        ...(result ?? []).map((seller) => ({ type: "Sellers" as const, id: seller.id })),
        { type: "Sellers" as const, id: "LIST" },
      ],
    }),
    suspendSeller: builder.mutation<unknown, { sellerId: string; reason: string }>({
      query: ({ sellerId, reason }) => ({
        url: `/sellers/${sellerId}/suspend`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Sellers"],
    }),
    restoreSeller: builder.mutation<unknown, string>({
      query: (sellerId) => ({
        url: `/sellers/${sellerId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sellers"],
    }),
  }),
})

export const {
  useGetSellersQuery,
  useSuspendSellerMutation,
  useRestoreSellerMutation,
} = sellerApi
