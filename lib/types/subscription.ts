export interface SubscriptionPlan {
  code: string
  displayName: string
  priceUsd: number
  durationDays: number
  listingLimit: number | null
  active?: boolean
  sortOrder?: number
  plan?: string
}

export interface CreateSubscriptionPlanRequest {
  code: string
  displayName: string
  priceUsd: number
  durationDays?: number
  listingLimit?: number
  sortOrder?: number
}

export interface UpdateSubscriptionPlanRequest {
  displayName?: string
  priceUsd?: number
  durationDays?: number
  listingLimit?: number
  sortOrder?: number
}

export interface SellerSubscription {
  sellerId: string
  planCode: string
  planDisplayName?: string
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | string
  startedAt: string | null
  expiresAt: string | null
  listingsUsed: number
  listingLimit: number | null
  canPostListing?: boolean
  canChat?: boolean
}

export interface SellerSubscriptionPage {
  content: SellerSubscription[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface GrantSubscriptionRequest {
  planCode: string
  days?: number
  extendExisting?: boolean
}
