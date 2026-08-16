export type SellerStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING" | string

export interface Seller {
  id: string
  name: string
  store: string
  email: string
  phone: string
  verification: string
  plan: string
  listings: number
  rating: number | null
  reviews: number | null
  sales: string
  status: SellerStatus
  avatar: string | null
  selected?: boolean
}
