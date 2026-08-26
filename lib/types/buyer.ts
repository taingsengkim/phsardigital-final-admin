export type BuyerStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "REJECTED" | "BANNED" | string

export const BUYER_STATUSES = ["ACTIVE", "PENDING", "SUSPENDED", "REJECTED", "BANNED"] as const

export interface Buyer {
  id: string
  username: string
  fullName: string
  email: string
  emailVerified: boolean
  phone: string | null
  avatarUrl: string | null
  status: BuyerStatus
  moderatedBy: string | null
  moderatedAt: string | null
  moderationReason: string | null
  joinedAt: string | null
  totalOrders: number
  totalSpent: number
}

export interface BuyerPage {
  content: Buyer[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface BuyerSummary {
  total: number
  active: number
  suspended: number
  banned: number
}
