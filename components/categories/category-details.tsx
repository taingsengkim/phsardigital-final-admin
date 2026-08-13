"use client"

import { useState, useEffect } from "react"
import { SmartphoneIcon, PlusIcon, UploadIcon, PencilIcon } from "lucide-react"

import type { CategoryRecord, CreateCategoryInput } from "@/lib/features/categories/categoriesApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CategoryDetailsProps {
  category: CategoryRecord | null
  availableCategories?: CategoryRecord[]
  isCreating?: boolean
  onCreate: (payload: CreateCategoryInput) => Promise<unknown>
  isEditing?: boolean
  onUpdate?: (id: string, payload: Partial<CreateCategoryInput>) => Promise<unknown>
  onCancelEdit?: () => void
  onStartCreate?: () => void
  onStartEdit?: (category: CategoryRecord) => void
}

const initialFormState: CreateCategoryInput = {
  name: "",
  slug: "",
  description: "",
  level: 1,
  sortOrder: 0,
  isActive: true,
  parentUuid: undefined,
}

export function CategoryDetails({
  category,
  availableCategories = [],
  isCreating,
  onCreate,
  isEditing = false,
  onUpdate,
  onCancelEdit,
  onStartCreate,
  onStartEdit,
}: CategoryDetailsProps) {
  const [formState, setFormState] = useState<CreateCategoryInput>(initialFormState)
  const [isAddingNew, setIsAddingNew] = useState(!category || !isEditing)

  useEffect(() => {
    if (isEditing && category) {
      setIsAddingNew(false)
      setFormState({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        level: category.parentId ? 2 : 1,
        isActive: category.status.toLowerCase() === "active",
        parentUuid: category.parentId || undefined,
      })
    } else {
      setFormState(initialFormState)
    }
  }, [category, isEditing])

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/["']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.name.trim()) {
      return
    }

    const trimmedName = formState.name.trim()

    const payload: CreateCategoryInput = {
      name: trimmedName,
      slug: formState.slug.trim() || slugify(trimmedName),
      description: formState.description?.trim() || undefined,
      level: formState.parentUuid ? 2 : (Number.isFinite(formState.level) && (formState.level ?? 1) > 0 ? formState.level : 1),
      sortOrder: Number(formState.sortOrder) || 0,
      isActive: formState.isActive,
      parentUuid: formState.parentUuid || undefined,
    }

    if (isEditing && category && onUpdate) {
      await onUpdate(category.id, payload)
    } else if (onCreate) {
      await onCreate(payload)
      setFormState(initialFormState)
    }
  }

  const handleStartAddCategory = () => {
    setIsAddingNew(true)
    setFormState(initialFormState)
    if (onStartCreate) {
      onStartCreate()
    }
  }

  const showCreateForm = isAddingNew || !category || !isEditing

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-[#6338f6] uppercase tracking-widest bg-purple-50 px-3 py-1.5 rounded-full">
            {isEditing ? "Editing Category" : isAddingNew ? "New Category Form" : "Category Details"}
          </span>
          <div className="flex items-center gap-2">
            {category && onStartEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onStartEdit(category)}
                className="text-xs font-bold rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 h-8 px-2.5 flex items-center gap-1"
              >
                <PencilIcon size={13} /> Edit
              </Button>
            )}
            {!isAddingNew && !isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleStartAddCategory}
                className="text-xs font-bold rounded-xl border-purple-200 text-[#6338f6] hover:bg-purple-50 h-8 px-2.5 flex items-center gap-1"
              >
                <PlusIcon size={13} /> Add
              </Button>
            )}
          </div>
        </div>

        <div className="size-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <SmartphoneIcon size={40} className="text-[#6338f6]" />
        </div>
        
        <h4 className="text-xl font-bold text-gray-900 mb-1">
          {isEditing ? `Edit: ${category?.name}` : isAddingNew ? "Add New Category" : (category?.name ?? "Select a category")}
        </h4>
        
        {!isEditing && !isAddingNew && category && (
          <>
            <div className="space-y-4 my-8 text-left border-y border-gray-50 py-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Slug</span>
                <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{category.slug}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Listings</span>
                <span className="font-bold text-gray-900">{category.listingsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-bold text-xs uppercase px-2 py-0.5 rounded-md ${category.status.toLowerCase() === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {category.status}
                </span>
              </div>
            </div>
            
            <div className="text-left mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {category.description || "No description provided."}
              </p>
            </div>
          </>
        )}
        
        {(isEditing || isAddingNew || !category) && (
          <form className="space-y-4 text-left mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Category Name *</label>
              <Input
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. Electronics, Vehicles..."
                required
                className="rounded-xl h-11"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">URL Slug (Optional)</label>
              <Input
                value={formState.slug}
                onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))}
                placeholder="auto-generated-from-name"
                className="rounded-xl h-11"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Parent Category (Optional)</label>
              <select
                value={formState.parentUuid ?? ""}
                onChange={(event) => setFormState((current) => ({ ...current, parentUuid: event.target.value || undefined }))}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6338f6]"
              >
                <option value="">None (Top-Level Category)</option>
                {availableCategories
                  .filter((cat) => !category || cat.id !== category.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Description</label>
              <Textarea
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                placeholder="Brief summary of what products belong in this category..."
                className="rounded-xl min-h-20 text-sm"
              />
            </div>

            <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">Active status</p>
                <p className="text-xs text-[#808191]">Make visible to buyers</p>
              </div>
              <input
                type="checkbox"
                checked={formState.isActive}
                onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
                className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
              />
            </label>

            <div className="flex gap-3 pt-2">
              {(isEditing || (isAddingNew && category)) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (isEditing && onCancelEdit) {
                      onCancelEdit()
                    }
                    setIsAddingNew(false)
                  }}
                  className="w-full rounded-xl h-12 font-bold"
                >
                  Cancel
                </Button>
              )}
              <Button
                className="w-full rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-12 font-bold flex items-center justify-center gap-2 text-white shadow-md shadow-purple-500/20"
                type="submit"
                disabled={isCreating || !formState.name.trim()}
              >
                {!isEditing && <PlusIcon size={18} />}
                {isCreating ? "Saving..." : isEditing ? "Update Category" : "Save New Category"}
              </Button>
            </div>
          </form>
        )}
      </div>
      
      <div className="bg-[#f8f7ff] rounded-3xl border border-purple-100 p-8 text-center cursor-pointer hover:bg-[#f1efff] transition-colors border-dashed">
        <div className="size-10 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadIcon size={18} className="text-[#6338f6]" />
        </div>
        <h5 className="text-sm font-bold text-gray-900 mb-1">Bulk Import Categories</h5>
        <p className="text-[10px] text-gray-400">Upload CSV or XLSX file</p>
      </div>
    </div>
  )
}
