import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type CategoryStatus = "active" | "inactive" | string

export interface CategoryRecord {
  id: string
  name: string
  description: string
  status: CategoryStatus
  listingsCount: number
  parentId: string | null
  createdAt: string | null
  updatedAt: string | null
  iconName: string | null
  children?: CategoryRecord[]
}

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
  level: number
  isActive: boolean
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API ?? "").replace(/\/$/, "")

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return fallback
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""))

    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function toStatus(value: unknown): CategoryStatus {
  if (typeof value === "boolean") {
    return value ? "active" : "inactive"
  }

  const status = toText(value, "active").toLowerCase()

  if (status === "active" || status === "inactive") {
    return status
  }

  return status || "active"
}

function getCategoryId(value: Record<string, unknown>, index: number) {
  return (
    toText(value.id) ||
    toText(value._id) ||
    toText(value.slug) ||
    toText(value.code) ||
    `${toText(value.name, "category")}-${index}`
  )
}

function getParentId(value: Record<string, unknown>) {
  return (
    toText(value.parentId) ||
    toText(value.parent_id) ||
    toText(value.parentUuid) ||
    toText((value.parent as { id?: unknown } | undefined)?.id) ||
    toText(value.parentCategoryId) ||
    null
  )
}

function getListingsCount(value: Record<string, unknown>) {
  return toNumber(
    value.listingsCount ??
      value.listings_count ??
      value.totalListings ??
      value.total_listings ??
      value.count ??
      value.listingCount
  )
}

function getIconName(value: Record<string, unknown>) {
  return toText(value.iconName) || toText(value.icon) || null
}

function normalizeCategory(value: unknown, index = 0): CategoryRecord {
  const record = (value ?? {}) as Record<string, unknown>
  const nestedChildren = Array.isArray(record.children)
    ? record.children.map((child, childIndex) => normalizeCategory(child, childIndex))
    : undefined

  return {
    id: getCategoryId(record, index),
    name: toText(record.name, "Untitled category"),
    description:
      toText(record.description) || toText(record.details) || "No description provided.",
    status: toStatus(record.status ?? record.state ?? record.isActive),
    listingsCount: getListingsCount(record),
    parentId: getParentId(record),
    createdAt: toText(record.createdAt) || toText(record.created_at) || null,
    updatedAt: toText(record.updatedAt) || toText(record.updated_at) || null,
    iconName: getIconName(record),
    children: nestedChildren,
  }
}

function normalizeCategoryList(response: unknown): CategoryRecord[] {
  if (Array.isArray(response)) {
    return response.map((item, index) => normalizeCategory(item, index))
  }

  const record = (response ?? {}) as Record<string, unknown>
  const list =
    (Array.isArray(record.data) && record.data) ||
    (Array.isArray(record.categories) && record.categories) ||
    (Array.isArray(record.items) && record.items) ||
    (Array.isArray(record.results) && record.results) ||
    (Array.isArray(record.payload) && record.payload) ||
    []

  return list.map((item, index) => normalizeCategory(item, index))
}

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      headers.set("accept", "application/json")

      return headers
    },
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryRecord[], void>({
      query: () => "/categories",
      transformResponse: (response: unknown) => normalizeCategoryList(response),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((category) => ({ type: "Categories" as const, id: category.id })),
              { type: "Categories" as const, id: "LIST" },
            ]
          : [{ type: "Categories" as const, id: "LIST" }],
    }),
    createCategory: builder.mutation<CategoryRecord, CreateCategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => {
        const normalized = normalizeCategoryList(response)

        return normalized[0] ?? normalizeCategory(response)
      },
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),
  }),
})

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoriesApi