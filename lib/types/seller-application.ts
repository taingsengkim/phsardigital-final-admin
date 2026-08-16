export interface SellerApplication {
  id: string
  name: string
  email: string
  avatar: string | null
  businessName: string
  businessType: string
  phone: string
  businessEmail: string
  location: string
  website: string
  description: string
  status: string
  plan: string
  planColor: string
  appliedOn: string
  appliedAt: string
}

export interface SellerApplicationQueryParams {
  page?: number
  size?: number
  status?: string
  search?: string
}
