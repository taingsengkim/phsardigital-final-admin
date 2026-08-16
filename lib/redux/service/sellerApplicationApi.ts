import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type {
  SellerApplication,
  SellerApplicationQueryParams,
} from "@/lib/types/seller-application"
import { toText } from "./api-utils"

function unwrapRecord(response: unknown): unknown {
  if (!response || typeof response !== "object" || Array.isArray(response)) return response
  const record = response as Record<string, unknown>
  return record.data ?? record.application ?? record.payload ?? response
}

function extractApplications(response: unknown): unknown[] {
  const unwrapped = unwrapRecord(response)
  if (Array.isArray(unwrapped)) return unwrapped
  if (!unwrapped || typeof unwrapped !== "object") return []

  const record = unwrapped as Record<string, unknown>
  const list = record.content ?? record.applications ?? record.items ?? record.results
  return Array.isArray(list) ? list : []
}

function formatApplicationDate(value: unknown) {
  const raw = toText(value)
  if (!raw) return { appliedOn: "Unknown", appliedAt: "" }

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return { appliedOn: raw, appliedAt: "" }

  return {
    appliedOn: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),
    appliedAt: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  }
}

function normalizeApplication(value: unknown, index = 0): SellerApplication {
  const record = (value ?? {}) as Record<string, unknown>
  const user = (record.user ?? record.applicant ?? {}) as Record<string, unknown>
  const business = (record.business ?? record.store ?? {}) as Record<string, unknown>
  const plan = (record.plan ?? record.subscriptionPlan ?? {}) as Record<string, unknown>
  const status = toText(record.status, "PENDING_REVIEW").replaceAll("_", " ")
  const date = formatApplicationDate(record.createdAt ?? record.appliedAt ?? record.submittedAt)

  return {
    id: toText(record.uuid) || toText(record.id) || `application-${index}`,
    name: toText(record.name) || toText(record.fullName) || toText(user.name) || toText(user.fullName) || "Unknown applicant",
    email: toText(record.email) || toText(user.email) || "No email provided",
    avatar: toText(record.avatarUrl) || toText(record.avatar) || toText(user.image) || null,
    businessName: toText(record.businessName) || toText(business.name) || "Not provided",
    businessType: toText(record.businessType) || toText(business.type) || "Not provided",
    phone: toText(record.phone) || toText(record.phoneNumber) || toText(user.phone) || "Not provided",
    businessEmail: toText(record.businessEmail) || toText(business.email) || "Not provided",
    location: toText(record.location) || toText(record.address) || toText(business.location) || "Not provided",
    website: toText(record.website) || toText(record.socialUrl) || toText(business.website) || "",
    description: toText(record.description) || toText(record.aboutBusiness) || "No description provided.",
    status,
    plan: toText(record.planName) || toText(plan.name) || (typeof record.plan === "string" ? record.plan : "Not selected"),
    planColor: "text-purple-600 bg-purple-50",
    ...date,
  }
}

export const sellerApplicationApi = createApi({
  reducerPath: "sellerApplicationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin/seller-applications" }),
  tagTypes: ["SellerApplications"],
  endpoints: (builder) => ({
    getSellerApplications: builder.query<SellerApplication[], SellerApplicationQueryParams | void>({
      query: (params) => ({ url: "", params: params || undefined }),
      transformResponse: (response: unknown) => extractApplications(response).map(normalizeApplication),
      providesTags: (result) => [
        ...(result ?? []).map((application) => ({ type: "SellerApplications" as const, id: application.id })),
        { type: "SellerApplications" as const, id: "LIST" },
      ],
    }),
    getSellerApplication: builder.query<SellerApplication, string>({
      query: (uuid) => `/${uuid}`,
      transformResponse: (response: unknown) => normalizeApplication(unwrapRecord(response)),
      providesTags: (_result, _error, uuid) => [{ type: "SellerApplications", id: uuid }],
    }),
    approveSellerApplication: builder.mutation<SellerApplication, string>({
      query: (uuid) => ({ url: `/${uuid}/approve`, method: "PATCH" }),
      transformResponse: (response: unknown) => normalizeApplication(unwrapRecord(response)),
      invalidatesTags: (_result, _error, uuid) => [
        { type: "SellerApplications", id: uuid },
        { type: "SellerApplications", id: "LIST" },
      ],
    }),
    rejectSellerApplication: builder.mutation<SellerApplication, string>({
      query: (uuid) => ({ url: `/${uuid}/reject`, method: "PATCH" }),
      transformResponse: (response: unknown) => normalizeApplication(unwrapRecord(response)),
      invalidatesTags: (_result, _error, uuid) => [
        { type: "SellerApplications", id: uuid },
        { type: "SellerApplications", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetSellerApplicationsQuery,
  useGetSellerApplicationQuery,
  useApproveSellerApplicationMutation,
  useRejectSellerApplicationMutation,
} = sellerApplicationApi
