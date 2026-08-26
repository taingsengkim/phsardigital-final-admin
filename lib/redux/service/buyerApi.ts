import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { Buyer, BuyerPage, BuyerSummary } from "@/lib/types/buyer"

interface GetBuyersParams {
  status?: string
  search?: string
  joinedFrom?: string
  joinedTo?: string
  pageNumber?: number
  pageSize?: number
}

export const buyerApi = createApi({
  reducerPath: "buyerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin/buyers",
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Buyers", "BuyerSummary"],
  endpoints: (builder) => ({
    getBuyers: builder.query<BuyerPage, GetBuyersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams()

        if (params.status) searchParams.set("status", params.status)
        if (params.search) searchParams.set("search", params.search)
        if (params.joinedFrom) searchParams.set("joinedFrom", params.joinedFrom)
        if (params.joinedTo) searchParams.set("joinedTo", params.joinedTo)
        if (params.pageNumber !== undefined) searchParams.set("pageNumber", String(params.pageNumber))
        if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize))

        const qs = searchParams.toString()
        return qs ? `?${qs}` : ""
      },
      transformResponse: (response: unknown): BuyerPage => {
        const record = (response ?? {}) as Record<string, unknown>
        const content = Array.isArray(record.content) ? record.content : []
        const page = (record.page ?? {}) as Record<string, unknown>

        return {
          content: content.map(normalizeBuyer),
          page: {
            size: Number(page.size ?? 10),
            number: Number(page.number ?? 0),
            totalElements: Number(page.totalElements ?? 0),
            totalPages: Number(page.totalPages ?? 1),
          },
        }
      },
      providesTags: (result) => [
        ...(result?.content ?? []).map((buyer) => ({ type: "Buyers" as const, id: buyer.id })),
        { type: "Buyers" as const, id: "LIST" },
      ],
    }),

    getBuyerSummary: builder.query<BuyerSummary, void>({
      query: () => "/summary",
      transformResponse: (response: unknown): BuyerSummary => {
        const record = (response ?? {}) as Record<string, unknown>
        return {
          total: Number(record.total ?? 0),
          active: Number(record.active ?? 0),
          suspended: Number(record.suspended ?? 0),
          banned: Number(record.banned ?? 0),
        }
      },
      providesTags: [{ type: "BuyerSummary" as const, id: "SUMMARY" }],
    }),

    suspendBuyer: builder.mutation<unknown, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/${userId}/suspend`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Buyers", "BuyerSummary"],
    }),

    restoreBuyer: builder.mutation<unknown, string>({
      query: (userId) => ({
        url: `/${userId}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["Buyers", "BuyerSummary"],
    }),

    banBuyer: builder.mutation<unknown, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/${userId}/ban`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Buyers", "BuyerSummary"],
    }),
  }),
})

function toStr(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function normalizeBuyer(value: unknown): Buyer {
  const r = (value ?? {}) as Record<string, unknown>
  return {
    id: toStr(r.id) ?? "",
    username: toStr(r.username) ?? "",
    fullName: toStr(r.fullName) ?? toStr(r.name) ?? "Unknown",
    email: toStr(r.email) ?? "",
    emailVerified: r.emailVerified === true,
    phone: toStr(r.phone),
    avatarUrl: toStr(r.avatarUrl),
    status: (toStr(r.status) ?? "ACTIVE").toUpperCase(),
    moderatedBy: toStr(r.moderatedBy),
    moderatedAt: toStr(r.moderatedAt),
    moderationReason: toStr(r.moderationReason),
    joinedAt: toStr(r.joinedAt),
    totalOrders: typeof r.totalOrders === "number" ? r.totalOrders : 0,
    totalSpent: typeof r.totalSpent === "number" ? r.totalSpent : 0,
  }
}

export const {
  useGetBuyersQuery,
  useGetBuyerSummaryQuery,
  useSuspendBuyerMutation,
  useRestoreBuyerMutation,
  useBanBuyerMutation,
} = buyerApi
