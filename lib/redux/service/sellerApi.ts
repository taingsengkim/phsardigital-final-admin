import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { Seller, SellerStatus } from "@/lib/types/seller"
import { extractList, toNumber, toText } from "./api-utils"

function hasUserRole(value: unknown, expectedRole: "BUYER" | "SELLER") {
  const record = (value ?? {}) as Record<string, unknown>
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

  return roleText.includes(expectedRole)
}

function normalizeStatus(value: unknown): SellerStatus {
  if (typeof value === "boolean") return value ? "ACTIVE" : "SUSPENDED"
  return toText(value, "ACTIVE").toUpperCase()
}

function normalizeSeller(value: unknown, index: number): Seller {
  const record = (value ?? {}) as Record<string, unknown>

  return {
    id: toText(record.id) || toText(record.uuid) || toText(record._id) || `seller-${index}`,
    name: toText(record.name) || toText(record.fullName) || "Untitled seller",
    store: toText(record.store) || toText(record.storeName) || toText(record.username) || "-",
    email: toText(record.email, "No email provided"),
    phone: toText(record.phone) || toText(record.phoneNumber) || "No phone provided",
    verification: toText(record.verification) || toText(record.verificationStatus) || "Pending",
    plan: toText(record.plan) || toText(record.subscriptionPlan) || "Basic",
    listings: toNumber(record.listings ?? record.listingsCount ?? record.totalListings),
    rating: record.rating == null ? null : toNumber(record.rating),
    reviews: record.reviews == null ? null : toNumber(record.reviews),
    sales: toText(record.sales) || toText(record.totalSales) || "$0.00",
    status: normalizeStatus(record.status ?? record.state ?? record.isActive),
    avatar: toText(record.avatar) || toText(record.avatarUrl) || null,
    selected: Boolean(record.selected),
  }
}

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/users",
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Sellers"],
  endpoints: (builder) => ({
    getSellers: builder.query<Seller[], void>({
      query: () => "",
      transformResponse: (response: unknown) =>
        extractList(response, "users")
          .filter((user) => hasUserRole(user, "SELLER"))
          .map(normalizeSeller),
      providesTags: (result) => [
        ...(result ?? []).map((seller) => ({ type: "Sellers" as const, id: seller.id })),
        { type: "Sellers" as const, id: "LIST" },
      ],
    }),
  }),
})

export const { useGetSellersQuery } = sellerApi
