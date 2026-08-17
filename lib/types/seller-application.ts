export interface ApplicationDocument {
  uuid: string
  docType: "ID_CARD" | "BUSINESS_LICENSE" | "OTHER" | string
  objectName?: string
  uri: string
}

export interface SellerApplication {
  id: string
  applicantId: string
  name: string
  email: string
  avatar: string | null
  logoUri: string | null
  businessName: string
  businessType: string
  phone: string
  businessEmail: string
  address: string
  city: string
  province: string
  location: string
  latitude: number | null
  longitude: number | null
  googleMapUrl: string | null
  website: string
  description: string
  status: string
  rejectionNote: string | null
  reviewedAt: string | null
  documents: ApplicationDocument[]
  missingDocuments: string[]
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

export interface RejectApplicationRequest {
  uuid: string
  rejectionNote: string
}
