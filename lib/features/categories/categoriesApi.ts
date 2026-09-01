import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type {
  CategoryRecord,
  CategoryStatus,
  CategoryTreeResponse,
  CategoryAttributeResponse,
  CategoryAttributeRequest,
  UpdateCategoryAttributeRequest,
  CategoryAttributeSchemaResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/types/category"
import { formatMediaUrl } from "@/lib/media-url"

export type {
  CategoryRecord,
  CategoryStatus,
  CategoryTreeResponse,
  CategoryAttributeResponse,
  CategoryAttributeRequest,
  UpdateCategoryAttributeRequest,
  CategoryAttributeSchemaResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/types/category"

const apiBaseUrl = (process.env.NEXT_PUBLIC_API ?? "/api").replace(/\/$/, "")

/** Upstream caps pageSize at 100 on both /categories and /listings. */
const MAX_PAGE_SIZE = 100
/** Stops a bad totalPages from turning a page load into an unbounded sweep. */
const MAX_PAGES = 25

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export interface FileUploadResult {
  objectName?: string
  uri?: string
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return fallback
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
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

/**
 * The upload endpoint only returns objectName/uri, but CategoryRequest wants
 * iconFileId as a UUID. Stored object names carry the file UUID as a prefix
 * (uuid-original-name.ext), so read it back out of whichever field we get.
 */
export function extractFileId(response: FileUploadResult | null | undefined) {
  for (const candidate of [response?.objectName, response?.uri]) {
    const match = typeof candidate === "string" ? candidate.match(UUID_PATTERN) : null
    if (match) return match[0]
  }
  return undefined
}

function getCategoryId(value: Record<string, unknown>, index: number) {
  return (
    toText(value.uuid) ||
    toText(value.id) ||
    toText(value._id) ||
    toText(value.slug) ||
    toText(value.code) ||
    `${toText(value.name, "category")}-${index}`
  )
}

function getParentId(value: Record<string, unknown>) {
  const parent = value.parent as { uuid?: unknown; id?: unknown } | undefined
  return (
    toText(value.parentUuid) ||
    toText(value.parentId) ||
    toText(value.parent_id) ||
    toText(parent?.uuid) ||
    toText(parent?.id) ||
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
    slug: toText(record.slug) || "",
    description:
      toText(record.description) || toText(record.details) || "No description provided.",
    status: toStatus(record.status ?? record.state ?? record.isActive),
    listingsCount: getListingsCount(record),
    parentId: getParentId(record),
    level: toNumber(record.level) || 1,
    sortOrder: toNumber(record.sortOrder ?? record.sort_order),
    createdAt: toText(record.createdAt) || toText(record.created_at) || null,
    updatedAt:
      toText(record.updatedAt) || toText(record.lastModifiedAt) || toText(record.updated_at) || null,
    iconName: getIconName(record),
    iconUrl: formatMediaUrl(
      toText(record.iconUrl) ||
        toText(record.icon_url) ||
        toText(record.icon) ||
        toText((record.iconUri as any)?.uri) ||
        null
    ),
    iconFileId: toText(record.iconFileId) || toText(record.icon_file_id) || null,
    children: nestedChildren,
  }
}

function extractContent(response: unknown): unknown[] {
  if (Array.isArray(response)) {
    return response
  }

  const record = (response ?? {}) as Record<string, unknown>

  return (
    (Array.isArray(record.content) && record.content) ||
    (Array.isArray(record.data) && record.data) ||
    (Array.isArray(record.categories) && record.categories) ||
    (Array.isArray(record.items) && record.items) ||
    (Array.isArray(record.results) && record.results) ||
    (Array.isArray(record.payload) && record.payload) ||
    []
  )
}

function getTotalPages(response: unknown) {
  const record = (response ?? {}) as Record<string, unknown>
  const page = (record.page ?? {}) as Record<string, unknown>
  const totalPages = toNumber(page.totalPages ?? record.totalPages)
  return totalPages > 0 ? totalPages : 1
}

function normalizeCategoryList(response: unknown): CategoryRecord[] {
  return extractContent(response).map((item, index) => normalizeCategory(item, index))
}

type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>
type FetchWithBQ = (arg: string | FetchArgs) => ReturnType<AppBaseQuery>

/**
 * Both /categories and /listings are paged and default to a page size well
 * below the number of rows an admin needs to see, so walk every page.
 */
async function fetchAllPages(fetchWithBQ: FetchWithBQ, path: string) {
  const items: unknown[] = []
  let totalPages = 1

  for (let pageNumber = 0; pageNumber < totalPages && pageNumber < MAX_PAGES; pageNumber += 1) {
    const separator = path.includes("?") ? "&" : "?"
    const result = await fetchWithBQ(
      `${path}${separator}pageNumber=${pageNumber}&pageSize=${MAX_PAGE_SIZE}`
    )

    if (result.error) {
      return { items, error: result.error as FetchBaseQueryError }
    }

    items.push(...extractContent(result.data))
    totalPages = getTotalPages(result.data)
  }

  return { items, error: undefined }
}

/**
 * Categories carry no listing count of their own, so tally the listings by the
 * category slug each one reports. Best effort: a listings outage leaves the
 * counts at zero rather than breaking the category page.
 */
async function fetchListingCountsBySlug(fetchWithBQ: FetchWithBQ) {
  const counts: Record<string, number> = {}
  try {
    const { items, error } = await fetchAllPages(fetchWithBQ, "/listings")
    if (error) return counts

    for (const item of items) {
      const category = ((item ?? {}) as Record<string, unknown>).category as
        | Record<string, unknown>
        | undefined
      const slug = toText(category?.slug)
      if (!slug) continue
      counts[slug] = (counts[slug] ?? 0) + 1
    }
  } catch {
    // best effort
  }
  return counts
}

const CREATE_FIELDS = [
  "name",
  "slug",
  "iconFileId",
  "description",
  "sortOrder",
  "isActive",
  "parentUuid",
] as const

const UPDATE_FIELDS = [...CREATE_FIELDS, "moveToRoot"] as const

function buildPayload(input: Record<string, unknown>, fields: readonly string[]) {
  const payload: Record<string, unknown> = {}
  for (const field of fields) {
    if (input[field] !== undefined) {
      payload[field] = input[field]
    }
  }
  return payload
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
  tagTypes: ["Categories", "CategoryTree", "CategoryAttributes"],
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryRecord[], void>({
      queryFn: async (_arg, _api, _extraOptions, fetchWithBQ) => {
        const { items, error } = await fetchAllPages(fetchWithBQ, "/categories")

        if (error) {
          return { error }
        }

        const counts = await fetchListingCountsBySlug(fetchWithBQ)

        return {
          data: items.map((item, index) => {
            const category = normalizeCategory(item, index)
            return {
              ...category,
              listingsCount: category.listingsCount || counts[category.slug] || 0,
            }
          }),
        }
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((category) => ({ type: "Categories" as const, id: category.id })),
              { type: "Categories" as const, id: "LIST" },
            ]
          : [{ type: "Categories" as const, id: "LIST" }],
    }),

    getCategoryTree: builder.query<CategoryTreeResponse[], void>({
      query: () => ({
        url: "/categories/tree",
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const normalizeTreeNode = (node: unknown): CategoryTreeResponse => {
          const n = (node ?? {}) as Record<string, unknown>;
          const icon = (n.iconUri ?? {}) as Record<string, unknown>;
          const children = Array.isArray(n.children) ? n.children.map(normalizeTreeNode) : [];
          return {
            uuid: toText(n.uuid) || toText(n.id),
            name: toText(n.name),
            slug: toText(n.slug),
            description: toText(n.description) || null,
            level: toNumber(n.level),
            iconUrl: formatMediaUrl(
              toText(n.iconUrl) ||
                toText(n.icon_url) ||
                toText(n.icon) ||
                toText(icon.uri) ||
                null
            ),
            children,
          };
        };
        return Array.isArray(response) ? response.map(normalizeTreeNode) : [];
      },
      providesTags: [{ type: "CategoryTree", id: "TREE" }],
    }),

    getCategoryById: builder.query<CategoryRecord, string>({
      query: (id) => ({
        url: `/categories/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => normalizeCategory(response),
      providesTags: (_result, _error, id) => [{ type: "Categories", id }],
    }),

    createCategory: builder.mutation<CategoryRecord, CreateCategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body: buildPayload(body as unknown as Record<string, unknown>, CREATE_FIELDS),
      }),
      transformResponse: (response: unknown) => normalizeCategory(response),
      invalidatesTags: [
        { type: "Categories", id: "LIST" },
        { type: "CategoryTree", id: "TREE" },
      ],
    }),

    updateCategory: builder.mutation<CategoryRecord, { id: string; data: UpdateCategoryInput }>({
      query: ({ id, data }) => ({
        url: `/categories/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: buildPayload(data as unknown as Record<string, unknown>, UPDATE_FIELDS),
      }),
      transformResponse: (response: unknown) => normalizeCategory(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Categories", id },
        { type: "Categories", id: "LIST" },
        { type: "CategoryTree", id: "TREE" },
      ],
    }),

    // Upstream soft-deletes by slug, not by uuid.
    deleteCategory: builder.mutation<{ success: boolean; slug: string }, string>({
      query: (slug) => ({
        url: `/categories/${encodeURIComponent(slug)}`,
        method: "DELETE",
      }),
      transformResponse: (_response: unknown, _meta, slug) => ({ success: true, slug }),
      invalidatesTags: [
        { type: "Categories", id: "LIST" },
        { type: "CategoryTree", id: "TREE" },
      ],
    }),

    removeCategoryIcon: builder.mutation<CategoryRecord, string>({
      query: (uuid) => ({
        url: `/categories/${encodeURIComponent(uuid)}/icon`,
        method: "DELETE",
      }),
      transformResponse: (response: unknown) => normalizeCategory(response),
      invalidatesTags: (_result, _error, uuid) => [
        { type: "Categories", id: uuid },
        { type: "Categories", id: "LIST" },
        { type: "CategoryTree", id: "TREE" },
      ],
    }),

    uploadCategoryIcon: builder.mutation<FileUploadResult, FormData>({
      query: (formData) => ({
        url: "/files/upload",
        method: "POST",
        body: formData,
      }),
    }),

    // Category Attributes / Specification Schema
    getCategoryAttributes: builder.query<
      CategoryAttributeSchemaResponse,
      { uuid: string; includeInherited?: boolean }
    >({
      query: ({ uuid, includeInherited = true }) => ({
        url: `/categories/${encodeURIComponent(uuid)}/attributes?includeInherited=${includeInherited}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { uuid }) => [
        { type: "CategoryAttributes", id: uuid },
      ],
    }),

    createCategoryAttributes: builder.mutation<
      CategoryAttributeResponse[],
      { uuid: string; attributes: CategoryAttributeRequest[] }
    >({
      query: ({ uuid, attributes }) => ({
        url: `/categories/${encodeURIComponent(uuid)}/attributes`,
        method: "POST",
        body: attributes,
      }),
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: "CategoryAttributes", id: uuid },
      ],
    }),

    updateCategoryAttribute: builder.mutation<
      CategoryAttributeResponse,
      { uuid: string; attributeUuid: string; data: UpdateCategoryAttributeRequest }
    >({
      query: ({ uuid, attributeUuid, data }) => ({
        url: `/categories/${encodeURIComponent(uuid)}/attributes/${encodeURIComponent(attributeUuid)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: "CategoryAttributes", id: uuid },
      ],
    }),

    deleteCategoryAttribute: builder.mutation<
      { success: boolean },
      { uuid: string; attributeUuid: string }
    >({
      query: ({ uuid, attributeUuid }) => ({
        url: `/categories/${encodeURIComponent(uuid)}/attributes/${encodeURIComponent(attributeUuid)}`,
        method: "DELETE",
      }),
      transformResponse: () => ({ success: true }),
      invalidatesTags: (_result, _error, { uuid }) => [
        { type: "CategoryAttributes", id: uuid },
      ],
    }),
  }),
})

export { normalizeCategory, normalizeCategoryList }

export const {
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRemoveCategoryIconMutation,
  useUploadCategoryIconMutation,
  useGetCategoryAttributesQuery,
  useCreateCategoryAttributesMutation,
  useUpdateCategoryAttributeMutation,
  useDeleteCategoryAttributeMutation,
} = categoriesApi
