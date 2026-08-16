export type CategoryStatus = "active" | "inactive" | string

export interface CategoryRecord {
  id: string
  name: string
  slug: string
  description: string
  status: CategoryStatus
  listingsCount: number
  parentId: string | null
  createdAt: string | null
  updatedAt: string | null
  iconName: string | null
  iconUrl?: string | null
  iconFileId?: string | null
  children?: CategoryRecord[]
}

export interface CreateCategoryInput {
  name: string
  slug: string
  iconFileId?: string
  description?: string
  level?: number
  sortOrder?: number
  isActive: boolean
  parentUuid?: string
}
