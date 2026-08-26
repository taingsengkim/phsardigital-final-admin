export {
  categoriesApi as categoryApi,
  extractFileId,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useRemoveCategoryIconMutation,
  useUpdateCategoryMutation,
  useUploadCategoryIconMutation,
} from "@/lib/features/categories/categoriesApi"

export type { FileUploadResult } from "@/lib/features/categories/categoriesApi"
