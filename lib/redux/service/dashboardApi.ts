import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { AdminDashboardSummary } from "@/lib/types/dashboard"

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin/dashboard" }),
  endpoints: (builder) => ({
    getAdminDashboardSummary: builder.query<AdminDashboardSummary, void>({
      query: () => "",
    }),
  }),
})

export const { useGetAdminDashboardSummaryQuery } = dashboardApi
