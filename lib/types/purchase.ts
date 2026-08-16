export interface Purchase {
  id: string
  item: string
  buyer: string
  buyerEmail: string
  buyerPhone: string
  seller: string
  totalAmount: number
  total: string
  method: string
  status: string
  date: string
  quantity: number
  price: string
  deliveryFee: string
  shippingAddress: string
}

export interface PurchaseQueryParams {
  page?: number
  size?: number
  status?: string
  search?: string
}
