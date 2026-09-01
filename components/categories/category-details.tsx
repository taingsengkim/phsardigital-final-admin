"use client"

import { useState } from "react"
import { 
  FolderIcon, 
  PencilIcon, 
  Trash2Icon, 
  PlusIcon,
  LayersIcon,
  SlidersIcon,
  TagIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ChevronRightIcon,
  XIcon,
} from "lucide-react"
import type { 
  CategoryRecord,
  CategoryAttributeResponse,
  CategoryAttributeRequest,
} from "@/lib/types/category"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  useGetCategoryAttributesQuery,
  useCreateCategoryAttributesMutation,
  useUpdateCategoryAttributeMutation,
  useDeleteCategoryAttributeMutation,
} from "@/lib/redux/service/categoryApi"
import { CategoryAttributeModal } from "./category-attribute-modal"
import { showToast } from "@/components/ui/toast-popup"
import { getApiErrorMessage } from "@/lib/redux/service/api-utils"

interface CategoryDetailsProps {
  category: CategoryRecord | null
  parentCategory?: CategoryRecord | null
  subcategories?: CategoryRecord[]
  onSelectCategory?: (id: string) => void
  onStartEdit?: (category: CategoryRecord) => void
  onStartDelete?: (category: CategoryRecord) => void
  onAddSubcategory?: (parentId: string) => void
  onClose?: () => void
}

export function CategoryDetails({
  category,
  parentCategory,
  subcategories = [],
  onSelectCategory,
  onStartEdit,
  onStartDelete,
  onAddSubcategory,
  onClose,
}: CategoryDetailsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "attributes" | "subcategories">("overview")
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false)
  const [attributeToEdit, setAttributeToEdit] = useState<CategoryAttributeResponse | null>(null)

  // Query attributes for this category
  const {
    data: attributeSchema,
    isLoading: isLoadingAttributes,
    refetch: refetchAttributes,
  } = useGetCategoryAttributesQuery(
    { uuid: category?.id ?? "" },
    { skip: !category?.id }
  )

  const [createAttributes, { isLoading: isCreatingAttribute }] = useCreateCategoryAttributesMutation()
  const [updateAttribute, { isLoading: isUpdatingAttribute }] = useUpdateCategoryAttributeMutation()
  const [deleteAttribute, { isLoading: isDeletingAttribute }] = useDeleteCategoryAttributeMutation()

  if (!category) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm space-y-4">
        <div className="size-16 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6338f6] mx-auto">
          <FolderIcon size={32} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-base">No Category Selected</h4>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Click on any category in the tree or directory table to view its details, subcategories, and specification schema.
          </p>
        </div>
      </div>
    )
  }

  const isActive = category.status.toLowerCase() === "active"
  const attributesList = attributeSchema?.attributes ?? []
  const attributeGroups = attributeSchema?.groups ?? []

  const handleOpenAddAttribute = () => {
    setAttributeToEdit(null)
    setIsAttributeModalOpen(true)
  }

  const handleOpenEditAttribute = (attr: CategoryAttributeResponse) => {
    setAttributeToEdit(attr)
    setIsAttributeModalOpen(true)
  }

  const handleSubmitAttribute = async (attrData: CategoryAttributeRequest) => {
    try {
      if (attributeToEdit) {
        await updateAttribute({
          uuid: category.id,
          attributeUuid: attributeToEdit.uuid,
          data: attrData,
        }).unwrap()
        showToast({
          type: "success",
          title: "Attribute Updated",
          message: `Attribute "${attrData.label}" was updated successfully.`,
        })
      } else {
        await createAttributes({
          uuid: category.id,
          attributes: [attrData],
        }).unwrap()
        showToast({
          type: "success",
          title: "Attribute Added",
          message: `Attribute "${attrData.label}" was added to ${category.name}.`,
        })
      }
      refetchAttributes()
    } catch (err: unknown) {
      showToast({
        type: "error",
        title: "Attribute Error",
        message: getApiErrorMessage(err, "Failed to save category attribute."),
      })
      throw err
    }
  }

  const handleDeleteAttribute = async (attributeUuid: string, label: string) => {
    if (!confirm(`Are you sure you want to delete the attribute "${label}"?`)) return
    try {
      await deleteAttribute({
        uuid: category.id,
        attributeUuid,
      }).unwrap()
      showToast({
        type: "success",
        title: "Attribute Deleted",
        message: `Attribute "${label}" was removed.`,
      })
      refetchAttributes()
    } catch (err: unknown) {
      showToast({
        type: "error",
        title: "Failed to Delete Attribute",
        message: getApiErrorMessage(err, "Failed to delete attribute."),
      })
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-2xl bg-purple-50/90 border border-purple-100 flex items-center justify-center overflow-hidden shrink-0 shadow-xs p-1">
            {category.iconUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={category.iconUrl} alt={category.name} className="size-full object-contain" />
            ) : (
              <FolderIcon size={26} className="text-[#6338f6]" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-lg text-gray-900 leading-tight truncate">
                {category.name}
              </h4>
              <Badge
                variant={isActive ? "success" : "secondary"}
                className="font-extrabold text-[9px] px-2 py-0.5"
              >
                {category.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">/{category.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onStartEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onStartEdit(category)}
              className="h-8 px-2.5 rounded-xl border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              <PencilIcon size={12} className="mr-1" /> Edit
            </Button>
          )}
          {onStartDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onStartDelete(category)}
              className="h-8 px-2.5 rounded-xl border-rose-200 bg-rose-50/50 text-xs font-bold text-rose-600 hover:bg-rose-100/70"
            >
              <Trash2Icon size={12} className="mr-1" /> Delete
            </Button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors ml-1"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-xl transition-all",
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-2xs"
              : "text-gray-500 hover:text-gray-800"
          )}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("subcategories")}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-xl transition-all",
            activeTab === "subcategories"
              ? "bg-white text-gray-900 shadow-2xs"
              : "text-gray-500 hover:text-gray-800"
          )}
        >
          Subcategories ({subcategories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("attributes")}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-xl transition-all",
            activeTab === "attributes"
              ? "bg-white text-gray-900 shadow-2xs"
              : "text-gray-500 hover:text-gray-800"
          )}
        >
          Attributes ({attributesList.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50/60 border border-gray-100">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">
                Total Listings
              </span>
              <p className="text-base font-extrabold text-gray-900">
                {category.listingsCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50/60 border border-gray-100">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">
                Hierarchy Level
              </span>
              <p className="text-base font-extrabold text-[#6338f6]">
                Level {category.level}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Parent Category</span>
              {parentCategory ? (
                <button
                  type="button"
                  onClick={() => onSelectCategory?.(parentCategory.id)}
                  className="font-bold text-[#6338f6] hover:underline flex items-center gap-1"
                >
                  <LayersIcon size={12} /> {parentCategory.name}
                </button>
              ) : (
                <span className="font-bold text-gray-700">Root Category (None)</span>
              )}
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Sort Order</span>
              <span className="font-bold font-mono text-gray-700">#{category.sortOrder}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Subcategories Count</span>
              <span className="font-bold text-gray-900">{subcategories.length}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Specification Attributes</span>
              <span className="font-bold text-gray-900">{attributesList.length} fields</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
              Description
            </span>
            <div className="p-3.5 rounded-2xl bg-gray-50/60 border border-gray-100 text-xs text-gray-600 leading-relaxed">
              {category.description || "No description provided."}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2">
            {onAddSubcategory && (
              <Button
                type="button"
                onClick={() => onAddSubcategory(category.id)}
                className="w-full h-10 rounded-xl bg-[#6338f6] hover:bg-[#532edb] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PlusIcon size={14} /> Add Subcategory Under {category.name}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tab: Subcategories */}
      {activeTab === "subcategories" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              Direct Subcategories ({subcategories.length})
            </span>
            {onAddSubcategory && (
              <button
                type="button"
                onClick={() => onAddSubcategory(category.id)}
                className="text-xs font-bold text-[#6338f6] hover:underline flex items-center gap-1"
              >
                <PlusIcon size={13} /> Add Subcategory
              </button>
            )}
          </div>

          {subcategories.length > 0 ? (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {subcategories.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectCategory?.(sub.id)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-purple-200 bg-white hover:bg-purple-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#6338f6] overflow-hidden shrink-0">
                      {sub.iconUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={sub.iconUrl} alt={sub.name} className="size-full object-contain p-0.5" />
                      ) : (
                        <FolderIcon size={15} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-[#6338f6] transition-colors truncate">
                        {sub.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">/{sub.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold text-gray-400">
                      {sub.listingsCount} listings
                    </span>
                    <ChevronRightIcon size={14} className="text-gray-400 group-hover:text-[#6338f6]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200 text-center space-y-2">
              <p className="text-xs text-gray-400 font-medium">No subcategories under {category.name}.</p>
              {onAddSubcategory && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onAddSubcategory(category.id)}
                  className="rounded-xl h-8 bg-purple-50 text-[#6338f6] hover:bg-purple-100 border border-purple-200 text-xs font-bold"
                >
                  <PlusIcon size={12} className="mr-1" /> Create First Subcategory
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Attributes (Schema) */}
      {activeTab === "attributes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Listing Specifications Schema</span>
              <span className="text-[10px] text-gray-400 font-medium">
                Dynamic fields for products in this category
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAddAttribute}
              className="h-8 rounded-xl bg-[#6338f6] hover:bg-[#532edb] text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <PlusIcon size={13} /> Add Attribute
            </Button>
          </div>

          {isLoadingAttributes ? (
            <div className="space-y-2 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-2xl bg-gray-100/70 animate-pulse" />
              ))}
            </div>
          ) : attributesList.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {attributesList.map((attr) => (
                <div
                  key={attr.uuid}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 transition-all space-y-2 group shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{attr.label}</span>
                        <span className="text-[10px] font-mono text-gray-400">({attr.code})</span>
                        {attr.inherited && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100">
                            Inherited
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 h-4 bg-purple-50/60 text-purple-700 border-purple-100">
                          {attr.dataType}
                        </Badge>
                        {attr.unit && (
                          <span className="text-[10px] text-gray-500 font-medium">Unit: {attr.unit}</span>
                        )}
                        {attr.group && (
                          <span className="text-[10px] text-gray-400 font-medium">Group: {attr.group}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAttribute(attr)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338f6] hover:bg-purple-50 transition-colors"
                      >
                        <PencilIcon size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttribute(attr.uuid, attr.label)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2Icon size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Options badges */}
                  {attr.options && attr.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {attr.options.map((opt) => (
                        <span
                          key={opt.uuid || opt.value}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700"
                        >
                          {opt.label || opt.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium pt-1 border-t border-gray-50">
                    <span className={attr.required ? "text-emerald-600 font-bold" : ""}>
                      {attr.required ? "• Required field" : "• Optional field"}
                    </span>
                    <span className={attr.filterable ? "text-purple-600 font-bold" : ""}>
                      {attr.filterable ? "• Filterable in search" : "• Not filterable"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200 text-center space-y-2">
              <SlidersIcon size={24} className="text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-bold">No Attributes Defined</p>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                Define specifications (e.g. Brand, Model, Storage, Color) so sellers can add structured details to listings.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleOpenAddAttribute}
                className="rounded-xl h-8 bg-[#6338f6] hover:bg-[#532edb] text-white text-xs font-bold mt-2"
              >
                <PlusIcon size={12} className="mr-1" /> Add Specification Attribute
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Attribute Add/Edit Modal */}
      <CategoryAttributeModal
        isOpen={isAttributeModalOpen}
        onClose={() => {
          setIsAttributeModalOpen(false)
          setAttributeToEdit(null)
        }}
        categoryName={category.name}
        attributeToEdit={attributeToEdit}
        isSubmitting={isCreatingAttribute || isUpdatingAttribute}
        onSubmit={handleSubmitAttribute}
      />
    </div>
  )
}
