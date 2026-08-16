import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import type { Purchase, PurchaseQueryParams } from "@/lib/types/purchase"
import { toNumber, toText } from "./api-utils"

function unwrap(response: unknown): unknown {
  if (!response || typeof response !== "object" || Array.isArray(response)) return response
  const record = response as Record<string, unknown>
  return record.data ?? record.purchase ?? record.payload ?? response
}

function extractPurchases(response: unknown): unknown[] {
  const value = unwrap(response)
  if (Array.isArray(value)) return value
  if (!value || typeof value !== "object") return []
  const record = value as Record<string, unknown>
  const list = record.content ?? record.purchases ?? record.orders ?? record.items ?? record.results
  return Array.isArray(list) ? list : []
}

function formatMoney(value: unknown) {
  return `$${toNumber(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: unknown) {
  const raw = toText(value)
  if (!raw) return "Unknown"
  const date = new Date(raw)
  return Number.isNaN(date.getTime())
    ? raw
    : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date)
}

function normalizePurchase(value: unknown, index = 0): Purchase {
  const record = (value ?? {}) as Record<string, unknown>
  const buyer = (record.buyer ?? record.customer ?? record.user ?? {}) as Record<string, unknown>
  const seller = (record.seller ?? record.store ?? {}) as Record<string, unknown>
  const listing = (record.listing ?? record.product ?? record.item ?? {}) as Record<string, unknown>
  const shipping = (record.shippingAddress ?? record.address ?? {}) as Record<string, unknown>
  const totalAmount = toNumber(record.totalAmount ?? record.total ?? record.amount)

  return {
    id: toText(record.uuid) || toText(record.id) || toText(record.orderNumber) || `purchase-${index}`,
    item: toText(record.itemName) || toText(record.productName) || toText(listing.name) || toText(listing.title) || "Unknown item",
    buyer: toText(record.buyerName) || toText(buyer.name) || toText(buyer.fullName) || "Unknown buyer",
    buyerEmail: toText(record.buyerEmail) || toText(buyer.email) || "Not provided",
    buyerPhone: toText(record.buyerPhone) || toText(buyer.phone) || "Not provided",
    seller: toText(record.sellerName) || toText(record.storeName) || toText(seller.name) || "Unknown seller",
    totalAmount,
    total: formatMoney(totalAmount),
    method: toText(record.paymentMethod) || toText(record.method) || "Unknown",
    status: toText(record.status, "PROCESSING").replaceAll("_", " "),
    date: formatDate(record.createdAt ?? record.orderDate ?? record.purchasedAt),
    quantity: toNumber(record.quantity) || 1,
    price: formatMoney(record.unitPrice ?? record.price ?? totalAmount),
    deliveryFee: formatMoney(record.deliveryFee ?? record.shippingFee),
    shippingAddress: typeof record.shippingAddress === "string"
      ? record.shippingAddress
      : [shipping.street, shipping.city, shipping.province, shipping.country].map((part) => toText(part)).filter(Boolean).join(", ") || "Not provided",
  }
}

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/purchases" }),
  tagTypes: ["Purchases"],
  endpoints: (builder) => ({
    getPurchases: builder.query<Purchase[], PurchaseQueryParams | void>({
      query: (params) => ({ url: "", params: params || undefined }),
      transformResponse: (response: unknown) => extractPurchases(response).map(normalizePurchase),
      providesTags: (result) => [
        ...(result ?? []).map((purchase) => ({ type: "Purchases" as const, id: purchase.id })),
        { type: "Purchases" as const, id: "LIST" },
      ],
    }),
    getPurchase: builder.query<Purchase, string>({
      query: (uuid) => `/${uuid}`,
      transformResponse: (response: unknown) => normalizePurchase(unwrap(response)),
      providesTags: (_result, _error, uuid) => [{ type: "Purchases", id: uuid }],
    }),
    cancelPurchase: builder.mutation<Purchase, string>({
      query: (uuid) => ({ url: `/${uuid}/cancel`, method: "PATCH" }),
      invalidatesTags: (_result, _error, uuid) => [{ type: "Purchases", id: uuid }, { type: "Purchases", id: "LIST" }],
    }),
    completePurchase: builder.mutation<Purchase, string>({
      query: (uuid) => ({ url: `/${uuid}/complete`, method: "PATCH" }),
      invalidatesTags: (_result, _error, uuid) => [{ type: "Purchases", id: uuid }, { type: "Purchases", id: "LIST" }],
    }),
    confirmPurchase: builder.mutation<Purchase, string>({
      query: (uuid) => ({ url: `/${uuid}/confirm`, method: "PATCH" }),
      invalidatesTags: (_result, _error, uuid) => [{ type: "Purchases", id: uuid }, { type: "Purchases", id: "LIST" }],
    }),
  }),
})

export const {
  useGetPurchasesQuery,
  useGetPurchaseQuery,
  useCancelPurchaseMutation,
  useCompletePurchaseMutation,
  useConfirmPurchaseMutation,
} = purchaseApi
