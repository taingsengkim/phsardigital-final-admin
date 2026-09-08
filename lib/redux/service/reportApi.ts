import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  AdminReport,
  ReportsResponse,
  GetReportsQuery,
  ResolveReportPayload,
  DismissReportPayload,
  SuspendListingPayload,
  RemoveListingPayload,
  SuspendSellerPayload,
  ReportTargetType,
  ReportStatus,
} from "@/lib/types/report"

function normalizeReport(item: unknown, index = 0): AdminReport {
  const r = (item ?? {}) as Record<string, unknown>
  return {
    uuid: String(r.uuid || r.id || `rep-${index}`),
    reporterId: String(r.reporterId || r.userId || ""),
    targetType: String(r.targetType || "LISTING").toUpperCase() as ReportTargetType,
    targetId: String(r.targetId || ""),
    targetLabel: String(r.targetLabel || r.targetName || r.title || "Reported Target"),
    reason: String(r.reason || "OTHER"),
    note: String(r.note || r.description || ""),
    status: String(r.status || "OPEN").toUpperCase() as ReportStatus,
    createdAt: String(r.createdAt || new Date().toISOString()),
    reviewedBy: r.reviewedBy ? String(r.reviewedBy) : null,
    reviewedAt: r.reviewedAt ? String(r.reviewedAt) : null,
    decisionNote: r.decisionNote ? String(r.decisionNote) : null,
  }
}

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/admin",
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")
      return headers
    },
  }),
  tagTypes: ["Reports", "ReportDetails"],
  endpoints: (builder) => ({
    getReports: builder.query<ReportsResponse, GetReportsQuery>({
      query: (params) => {
        const query = new URLSearchParams()
        if (params.status && params.status !== "ALL") {
          query.set("status", params.status)
        }
        if (params.targetType && params.targetType !== "ALL") {
          query.set("targetType", params.targetType)
        }
        if (params.pageNumber !== undefined) {
          query.set("pageNumber", String(params.pageNumber))
        }
        if (params.pageSize !== undefined) {
          query.set("pageSize", String(params.pageSize))
        }
        return `/reports?${query.toString()}`
      },
      transformResponse: (response: unknown) => {
        const res = (response ?? {}) as Record<string, unknown>
        const contentRaw = Array.isArray(res.content) ? res.content : []
        const pageRaw = (res.page ?? {}) as Record<string, unknown>

        const content = contentRaw.map((item, idx) => normalizeReport(item, idx))
        const page = {
          size: Number(pageRaw.size) || 20,
          number: Number(pageRaw.number) || 0,
          totalElements: Number(pageRaw.totalElements) || content.length,
          totalPages: Math.max(Number(pageRaw.totalPages) || 1, 1),
        }

        return { content, page }
      },
      providesTags: (result) => [
        ...(result?.content.map((report) => ({
          type: "Reports" as const,
          id: report.uuid,
        })) ?? []),
        { type: "Reports", id: "LIST" },
      ],
    }),

    getReportById: builder.query<AdminReport, string>({
      query: (uuid) => `/reports/${encodeURIComponent(uuid)}`,
      transformResponse: (response: unknown) => normalizeReport(response),
      providesTags: (_result, _error, uuid) => [{ type: "ReportDetails", id: uuid }],
    }),

    resolveReport: builder.mutation<AdminReport, ResolveReportPayload>({
      query: ({ uuid, note }) => ({
        url: `/reports/${encodeURIComponent(uuid)}/resolve`,
        method: "PATCH",
        body: note?.trim() ? { note: note.trim() } : {},
      }),
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: uuid },
        { type: "ReportDetails", id: uuid },
      ],
    }),

    dismissReport: builder.mutation<AdminReport, DismissReportPayload>({
      query: ({ uuid, note }) => ({
        url: `/reports/${encodeURIComponent(uuid)}/dismiss`,
        method: "PATCH",
        body: note?.trim() ? { note: note.trim() } : {},
      }),
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: uuid },
        { type: "ReportDetails", id: uuid },
      ],
    }),

    // Target Moderation Actions
    suspendListing: builder.mutation<unknown, SuspendListingPayload>({
      query: ({ targetId, reason }) => ({
        url: `/listings/${encodeURIComponent(targetId)}/suspend`,
        method: "PATCH",
        body: { reason },
      }),
    }),

    removeListing: builder.mutation<unknown, RemoveListingPayload>({
      query: ({ targetId, reason }) => ({
        url: `/listings/${encodeURIComponent(targetId)}/remove`,
        method: "PATCH",
        body: reason ? { reason } : undefined,
      }),
    }),

    restoreListing: builder.mutation<unknown, string>({
      query: (targetId) => ({
        url: `/listings/${encodeURIComponent(targetId)}/restore`,
        method: "PATCH",
      }),
    }),

    deleteListing: builder.mutation<unknown, string>({
      query: (targetId) => ({
        url: `/listings/${encodeURIComponent(targetId)}`,
        method: "DELETE",
      }),
    }),

    suspendSeller: builder.mutation<unknown, SuspendSellerPayload>({
      query: ({ targetId, reason }) => ({
        url: `/sellers/${encodeURIComponent(targetId)}/suspend`,
        method: "PATCH",
        body: { reason },
      }),
    }),

    restoreSeller: builder.mutation<unknown, string>({
      query: (targetId) => ({
        url: `/sellers/${encodeURIComponent(targetId)}/restore`,
        method: "PATCH",
      }),
    }),

    deleteReview: builder.mutation<unknown, string>({
      query: (targetId) => ({
        url: `/reviews/${encodeURIComponent(targetId)}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useResolveReportMutation,
  useDismissReportMutation,
  useSuspendListingMutation,
  useRemoveListingMutation,
  useRestoreListingMutation,
  useDeleteListingMutation,
  useSuspendSellerMutation,
  useRestoreSellerMutation,
  useDeleteReviewMutation,
} = reportApi
