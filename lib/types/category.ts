export type CategoryStatus = "active" | "inactive" | string;

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  listingsCount: number;
  parentId: string | null;
  level: number;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
  iconName: string | null;
  iconUrl?: string | null;
  iconFileId?: string | null;
  children?: CategoryRecord[];
}

export interface CategoryTreeResponse {
  uuid: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  description?: string | null;
  level: number;
  children?: CategoryTreeResponse[];
}

/** Mirrors `CategoryRequest` from the upstream OpenAPI schema. */
export interface CreateCategoryInput {
  name: string;
  slug: string;
  iconFileId?: string;
  description?: string;
  sortOrder?: number;
  isActive: boolean;
  parentUuid?: string;
}

/**
 * Mirrors `UpdateCategoryRequest`: every field is optional, and `moveToRoot`
 * is the only way to clear an existing parent - omitting `parentUuid` leaves
 * the current parent untouched.
 */
export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  moveToRoot?: boolean;
}

/** What the category form hands back; `moveToRoot` is ignored on create. */
export type CategoryFormPayload = CreateCategoryInput & {
  moveToRoot?: boolean;
};

export type CategoryAttributeDataType =
  | "TEXT"
  | "NUMBER"
  | "BOOLEAN"
  | "SELECT"
  | "MULTI_SELECT";

export interface CategoryAttributeOptionRequest {
  value: string;
  label?: string;
  sortOrder?: number;
}

export interface CategoryAttributeOptionResponse {
  uuid: string;
  value: string;
  label: string;
  sortOrder: number;
}

export interface CategoryAttributeRequest {
  code: string;
  label: string;
  group?: string;
  dataType: CategoryAttributeDataType;
  unit?: string;
  required?: boolean;
  filterable?: boolean;
  minValue?: number;
  maxValue?: number;
  sortOrder?: number;
  groupSortOrder?: number;
  options?: CategoryAttributeOptionRequest[];
}

export interface UpdateCategoryAttributeRequest {
  code?: string;
  label?: string;
  group?: string;
  dataType?: CategoryAttributeDataType;
  unit?: string;
  clearUnit?: boolean;
  required?: boolean;
  filterable?: boolean;
  minValue?: number;
  clearMinValue?: boolean;
  maxValue?: number;
  clearMaxValue?: boolean;
  sortOrder?: number;
  groupSortOrder?: number;
  options?: CategoryAttributeOptionRequest[];
}

export interface CategoryAttributeResponse {
  uuid: string;
  code: string;
  label: string;
  group: string;
  dataType: CategoryAttributeDataType;
  unit?: string;
  required?: boolean;
  filterable?: boolean;
  minValue?: number;
  maxValue?: number;
  sortOrder: number;
  groupSortOrder: number;
  options?: CategoryAttributeOptionResponse[];
  inherited?: boolean;
  ownerCategoryUuid?: string;
  ownerCategorySlug?: string;
  ownerCategoryName?: string;
}

export interface CategoryAttributeGroupResponse {
  name: string;
  attributes: CategoryAttributeResponse[];
}

export interface CategoryAttributeSchemaResponse {
  categoryUuid: string;
  categorySlug: string;
  categoryName: string;
  groups?: CategoryAttributeGroupResponse[];
  attributes?: CategoryAttributeResponse[];
}
