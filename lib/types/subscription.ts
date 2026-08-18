export interface SubscriptionPlan {
  plan: "BASIC" | "STANDARD" | "PREMIUM" | string
  displayName: string
  priceUsd: number
  durationDays: number
  listingLimit: number | null
}
