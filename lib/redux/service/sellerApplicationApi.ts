import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type {
  ApplicationDocument,
  RejectApplicationRequest,
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

function parseDocuments(value: unknown): ApplicationDocument[] {
  if (!Array.isArray(value)) return []
  return value.map((doc, idx) => {
    const item = (doc ?? {}) as Record<string, unknown>
    return {
      uuid: toText(item.uuid) || `doc-${idx}`,
      docType: toText(item.docType) || "OTHER",
      objectName: toText(item.objectName),
      uri: toText(item.uri),
    }
  })
}

function parseMissingDocuments(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => toText(item)).filter(Boolean)
}

function normalizeApplication(value: unknown, index = 0): SellerApplication {
  const record = (value ?? {}) as Record<string, unknown>
  const user = (record.user ?? record.applicant ?? {}) as Record<string, unknown>
  const business = (record.business ?? record.store ?? {}) as Record<string, unknown>
  const plan = (record.plan ?? record.subscriptionPlan ?? {}) as Record<string, unknown>
  
  const rawStatus = toText(record.status, "PENDING").toUpperCase()
  const status = rawStatus.replaceAll("_", " ")

  const date = formatApplicationDate(record.createdAt ?? record.appliedAt ?? record.submittedAt)

  const logoUri = toText(record.logoUri) || toText(record.logoObjectName) || null
  const avatar = toText(record.avatarUrl) || toText(record.avatar) || toText(user.image) || logoUri || null

  const address = toText(record.address) || toText(business.address)
  const city = toText(record.city) || toText(business.city)
  const province = toText(record.province) || toText(business.province)
  
  const locationParts = [address, city, province].filter(Boolean)
  const location = locationParts.length > 0 ? locationParts.join(", ") : toText(record.location, "Not provided")

  const lat = typeof record.latitude === "number" ? record.latitude : null
  const lng = typeof record.longitude === "number" ? record.longitude : null

  let planColor = "text-purple-600 bg-purple-50"
  if (status.includes("APPROVED")) {
    planColor = "text-emerald-700 bg-emerald-50 border border-emerald-200"
  } else if (status.includes("REJECTED")) {
    planColor = "text-rose-700 bg-rose-50 border border-rose-200"
  }

  return {
    id: toText(record.uuid) || toText(record.id) || `application-${index}`,
    applicantId: toText(record.applicantId) || toText(user.id) || "N/A",
    name: toText(record.name) || toText(record.fullName) || toText(user.name) || toText(user.fullName) || toText(record.businessName) || "Unknown applicant",
    email: toText(record.email) || toText(user.email) || "No email provided",
    avatar,
    logoUri,
    businessName: toText(record.businessName) || toText(business.name) || "Not provided",
    businessType: toText(record.businessType) || toText(business.type) || "Not provided",
    phone: toText(record.phone) || toText(record.phoneNumber) || toText(user.phone) || "Not provided",
    businessEmail: toText(record.businessEmail) || toText(business.email) || "Not provided",
    address: address || "Not provided",
    city: city || "Not provided",
    province: province || "Not provided",
    location,
    latitude: lat,
    longitude: lng,
    googleMapUrl: toText(record.googleMapUrl) || (lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : null),
    website: toText(record.website) || toText(record.socialUrl) || toText(business.website) || "",
    description: toText(record.description) || toText(record.aboutBusiness) || "No description provided.",
    status,
    rejectionNote: toText(record.rejectionNote) || null,
    reviewedAt: toText(record.reviewedAt) || null,
    documents: parseDocuments(record.documents),
    missingDocuments: parseMissingDocuments(record.missingDocuments),
    plan: toText(record.planName) || toText(plan.name) || (typeof record.plan === "string" ? record.plan : "Standard Plan"),
    planColor,
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
    rejectSellerApplication: builder.mutation<SellerApplication, RejectApplicationRequest>({
      query: ({ uuid, rejectionNote }) => ({
        url: `/${uuid}/reject`,
        method: "PATCH",
        body: { rejectionNote },
      }),
      transformResponse: (response: unknown) => normalizeApplication(unwrapRecord(response)),
      invalidatesTags: (_result, _error, { uuid }) => [
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
