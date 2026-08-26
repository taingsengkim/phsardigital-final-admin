import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  SubscriptionPlan,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
  SellerSubscriptionPage,
  GrantSubscriptionRequest,
} from "@/lib/types/subscription"

interface GetSellerSubscriptionsParams {
  status?: string
  planCode?: string
  pageNumber?: number
  pageSize?: number
}

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin",
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["SubscriptionPlans", "SellerSubscriptions"],
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => "/subscription-plans",
      transformResponse: (response: unknown): SubscriptionPlan[] => {
        const list = Array.isArray(response) ? response : []
        return list.map((item: Record<string, unknown>) => ({
          code: String(item.code || item.plan || ""),
          displayName: String(item.displayName || item.code || item.plan || "Plan"),
          priceUsd: Number(item.priceUsd ?? 0),
          durationDays: Number(item.durationDays ?? 30),
          listingLimit: item.listingLimit === null || item.listingLimit === undefined ? null : Number(item.listingLimit),
          active: item.active !== false,
          sortOrder: Number(item.sortOrder ?? 0),
          plan: String(item.code || item.plan || ""),
        }))
      },
      providesTags: ["SubscriptionPlans"],
    }),

    createSubscriptionPlan: builder.mutation<SubscriptionPlan, CreateSubscriptionPlanRequest>({
      query: (body) => ({
        url: "/subscription-plans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPlans"],
    }),

    updateSubscriptionPlan: builder.mutation<
      SubscriptionPlan,
      { code: string; data: UpdateSubscriptionPlanRequest }
    >({
      query: ({ code, data }) => ({
        url: `/subscription-plans/${encodeURIComponent(code)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SubscriptionPlans"],
    }),

    activateSubscriptionPlan: builder.mutation<SubscriptionPlan, string>({
      query: (code) => ({
        url: `/subscription-plans/${encodeURIComponent(code)}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["SubscriptionPlans"],
    }),

    deactivateSubscriptionPlan: builder.mutation<SubscriptionPlan, string>({
      query: (code) => ({
        url: `/subscription-plans/${encodeURIComponent(code)}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["SubscriptionPlans"],
    }),

    getSellerSubscriptions: builder.query<SellerSubscriptionPage, GetSellerSubscriptionsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.status) searchParams.set("status", params.status)
        if (params.planCode) searchParams.set("planCode", params.planCode)
        if (params.pageNumber !== undefined) searchParams.set("pageNumber", String(params.pageNumber))
        if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize))

        const qs = searchParams.toString()
        return `/subscriptions${qs ? `?${qs}` : ""}`
      },
      transformResponse: (response: unknown): SellerSubscriptionPage => {
        const record = (response ?? {}) as Record<string, unknown>
        const content = Array.isArray(record.content) ? record.content : []
        const page = (record.page ?? {}) as Record<string, unknown>

        return {
          content: content.map((item: unknown) => {
            const r = (item ?? {}) as Record<string, unknown>
            return {
              sellerId: String(r.sellerId || ""),
              planCode: String(r.planCode || r.plan || ""),
              planDisplayName: r.planDisplayName ? String(r.planDisplayName) : undefined,
              status: String(r.status || "ACTIVE").toUpperCase(),
              startedAt: r.startedAt ? String(r.startedAt) : null,
              expiresAt: r.expiresAt ? String(r.expiresAt) : null,
              listingsUsed: Number(r.listingsUsed ?? 0),
              listingLimit: r.listingLimit === null || r.listingLimit === undefined ? null : Number(r.listingLimit),
              canPostListing: r.canPostListing === true,
              canChat: r.canChat === true,
            }
          }),
          page: {
            size: Number(page.size ?? 10),
            number: Number(page.number ?? 0),
            totalElements: Number(page.totalElements ?? 0),
            totalPages: Number(page.totalPages ?? 1),
          },
        }
      },
      providesTags: ["SellerSubscriptions"],
    }),

    grantSellerSubscription: builder.mutation<
      unknown,
      { sellerId: string; body: GrantSubscriptionRequest }
    >({
      query: ({ sellerId, body }) => ({
        url: `/subscriptions/${encodeURIComponent(sellerId)}/grant`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SellerSubscriptions"],
    }),

    cancelSellerSubscription: builder.mutation<unknown, string>({
      query: (sellerId) => ({
        url: `/subscriptions/${encodeURIComponent(sellerId)}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["SellerSubscriptions"],
    }),
  }),
})

export const {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useActivateSubscriptionPlanMutation,
  useDeactivateSubscriptionPlanMutation,
  useGetSellerSubscriptionsQuery,
  useGrantSellerSubscriptionMutation,
  useCancelSellerSubscriptionMutation,
} = subscriptionApi
