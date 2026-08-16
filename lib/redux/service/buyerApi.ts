import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { Buyer, BuyerStatus } from "@/lib/types/buyer"
import { apiBaseUrl, extractList, toNumber, toText } from "./api-utils"

function normalizeStatus(value: unknown): BuyerStatus {
  if (typeof value === "boolean") return value ? "ACTIVE" : "SUSPENDED"
  return toText(value, "ACTIVE").toUpperCase()
}

function normalizeBuyer(value: unknown, index: number): Buyer {
  const record = (value ?? {}) as Record<string, unknown>
  const totalSpent = record.totalSpent ?? record.totalSpentAmount ?? record.spentAmount

  return {
    id: toText(record.id) || toText(record.uuid) || toText(record._id) || `buyer-${index}`,
    name: toText(record.name) || toText(record.fullName) || "Untitled buyer",
    email: toText(record.email, "No email provided"),
    phone: toText(record.phone) || toText(record.phoneNumber) || "No phone provided",
    status: normalizeStatus(record.status ?? record.state ?? record.isActive),
    joinDate: toText(record.joinDate) || toText(record.createdAt) || toText(record.joinedAt) || "Unknown",
    joinTime: toText(record.joinTime) || null,
    totalOrders: toNumber(record.totalOrders ?? record.ordersCount ?? record.orderCount),
    totalSpent: typeof totalSpent === "string" && totalSpent.startsWith("$")
      ? totalSpent
      : `$${toNumber(totalSpent).toFixed(2)}`,
    avatar: toText(record.avatar) || toText(record.avatarUrl) || null,
    selected: Boolean(record.selected),
  }
}

export const buyerApi = createApi({
  reducerPath: "buyerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Buyers"],
  endpoints: (builder) => ({
    getBuyers: builder.query<Buyer[], void>({
      query: () => "/buyers",
      transformResponse: (response: unknown) =>
        extractList(response, "buyers").map(normalizeBuyer),
      providesTags: (result) => [
        ...(result ?? []).map((buyer) => ({ type: "Buyers" as const, id: buyer.id })),
        { type: "Buyers" as const, id: "LIST" },
      ],
    }),
  }),
})

export const { useGetBuyersQuery } = buyerApi
