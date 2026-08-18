import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { SubscriptionPlan } from "@/lib/types/subscription"

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/subscriptions" }),
  tagTypes: ["SubscriptionPlans"],
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => "/plans",
      providesTags: ["SubscriptionPlans"],
    }),
  }),
})

export const { useGetSubscriptionPlansQuery } = subscriptionApi
