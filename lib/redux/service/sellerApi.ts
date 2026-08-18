import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { Seller, SellerStatus } from "@/lib/types/seller"
import { extractList, toNumber, toText } from "./api-utils"

function isSellerRecord(value: unknown): boolean {
  const record = (value ?? {}) as Record<string, unknown>
  
  if (record.businessName || record.businessType || record.logoUri || record.logoObjectName) {
    return true
  }

  const roles = Array.isArray(record.roles) ? record.roles : []
  const roleText = [
    record.role,
    record.type,
    record.userType,
    record.accountType,
    ...roles.map((role) =>
      role && typeof role === "object" ? (role as Record<string, unknown>).name : role
    ),
  ]
    .map((role) => toText(role).toUpperCase())
    .join(" ")

  if (roleText.includes("SELLER")) return true
  if (record.isSeller === true) return true

  return false
}

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

  return {
    id: toText(record.uuid) || toText(record.id) || toText(record.sellerId) || `seller-${index}`,
    name: toText(record.businessName) || toText(record.fullName) || toText(record.name) || toText(record.username) || "Untitled seller",
    store: toText(record.businessName) || toText(record.store) || toText(record.storeName) || toText(record.username) || "-",
    email: toText(record.email, "No email provided"),
    phone: toText(record.phone) || toText(record.phoneNumber) || "No phone provided",
    verification: statusStr === "APPROVED" || statusStr === "ACTIVE" ? "Verified" : statusStr === "PENDING" ? "Pending" : "Unverified",
    plan: toText(record.plan) || toText(record.subscriptionPlan) || "Standard",
    listings: toNumber(record.listings ?? record.listingsCount ?? record.totalListings),
    rating: record.rating == null ? null : toNumber(record.rating),
    reviews: record.reviews == null ? null : toNumber(record.reviews),
    sales: toText(record.sales) || toText(record.totalSales) || "$0.00",
    status: normalizeStatus(record.status ?? record.state ?? record.isActive),
    avatar: toText(record.logoUri) || toText(record.avatar) || toText(record.avatarUrl) || null,
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
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBaseQuery) {
        const [usersRes, appsRes] = await Promise.all([
          fetchWithBaseQuery("/users"),
          fetchWithBaseQuery("/seller-applications"),
        ])

        const sellers: Seller[] = []
        const seenIds = new Set<string>()

        if (usersRes.data) {
          const rawUsers = extractList(usersRes.data, "users")
          const filtered = rawUsers.filter(isSellerRecord)
          for (let i = 0; i < filtered.length; i++) {
            const normalized = normalizeSeller(filtered[i], i)
            if (!seenIds.has(normalized.id)) {
              seenIds.add(normalized.id)
              sellers.push(normalized)
            }
          }
        }

        if (appsRes.data) {
          const rawApps = extractList(appsRes.data, "applications")
          for (let i = 0; i < rawApps.length; i++) {
            const normalized = normalizeSeller(rawApps[i], sellers.length + i)
            if (!seenIds.has(normalized.id)) {
              seenIds.add(normalized.id)
              sellers.push(normalized)
            }
          }
        }

        return { data: sellers }
      },
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
