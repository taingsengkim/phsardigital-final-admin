export type BuyerStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING" | string

export interface Buyer {
  id: string
  name: string
  email: string
  phone: string
  status: BuyerStatus
  joinDate: string
  joinTime: string | null
  totalOrders: number
  totalSpent: string
  avatar: string | null
  selected?: boolean
}
