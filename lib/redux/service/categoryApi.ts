export {
  categoriesApi as categoryApi,
  extractFileId,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useRemoveCategoryIconMutation,
  useUpdateCategoryMutation,
  useUploadCategoryIconMutation,
  useGetCategoryAttributesQuery,
  useCreateCategoryAttributesMutation,
  useUpdateCategoryAttributeMutation,
  useDeleteCategoryAttributeMutation,
} from "@/lib/features/categories/categoriesApi"

export type { FileUploadResult } from "@/lib/features/categories/categoriesApi"
