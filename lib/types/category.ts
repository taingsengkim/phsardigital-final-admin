export type CategoryStatus = "active" | "inactive" | string

export interface CategoryRecord {
  id: string
  name: string
  slug: string
  description: string
  status: CategoryStatus
  listingsCount: number
  parentId: string | null
  level: number
  sortOrder: number
  createdAt: string | null
  updatedAt: string | null
  iconName: string | null
  iconUrl?: string | null
  iconFileId?: string | null
  children?: CategoryRecord[]
}

/** Mirrors `CategoryRequest` from the upstream OpenAPI schema. */
export interface CreateCategoryInput {
  name: string
  slug: string
  iconFileId?: string
  description?: string
  sortOrder?: number
  isActive: boolean
  parentUuid?: string
}

/**
 * Mirrors `UpdateCategoryRequest`: every field is optional, and `moveToRoot`
 * is the only way to clear an existing parent - omitting `parentUuid` leaves
 * the current parent untouched.
 */
export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  moveToRoot?: boolean
}

/** What the category form hands back; `moveToRoot` is ignored on create. */
export type CategoryFormPayload = CreateCategoryInput & { moveToRoot?: boolean }
