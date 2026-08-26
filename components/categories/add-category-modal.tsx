"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { XIcon, PlusIcon, FolderPlusIcon, UploadIcon, Loader2Icon, PencilIcon, SaveIcon } from "lucide-react"

import type { CategoryRecord, CategoryFormPayload } from "@/lib/types/category"
import {
  extractFileId,
  useRemoveCategoryIconMutation,
  useUploadCategoryIconMutation,
} from "@/lib/redux/service/categoryApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categoryToEdit?: CategoryRecord | null
  availableCategories?: CategoryRecord[]
  isSubmitting?: boolean
  onSubmit: (payload: CategoryFormPayload, editId?: string) => Promise<unknown>
}

const initialFormState: CategoryFormPayload = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
  parentUuid: undefined,
  iconFileId: undefined,
}

// Mirrors the maxLength constraints on CategoryRequest upstream.
const NAME_MAX_LENGTH = 100
const SLUG_MAX_LENGTH = 150
const DESCRIPTION_MAX_LENGTH = 1000

/** Upstream validates slugs against ^[a-z0-9]+(?:-[a-z0-9]+)*$. */
const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)

/**
 * A category cannot be reparented under itself or one of its own descendants,
 * so drop that whole subtree from the parent options.
 */
function collectExcludedIds(categories: CategoryRecord[], rootId: string) {
  const excluded = new Set<string>([rootId])
  let grew = true

  while (grew) {
    grew = false

    for (const category of categories) {
      if (!excluded.has(category.id) && category.parentId && excluded.has(category.parentId)) {
        excluded.add(category.id)
        grew = true
      }
    }
  }

  return excluded
}

export function AddCategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  availableCategories = [],
  isSubmitting = false,
  onSubmit,
}: AddCategoryModalProps) {
  const [formState, setFormState] = useState<CategoryFormPayload>(initialFormState)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [iconCleared, setIconCleared] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadIcon, { isLoading: isUploading }] = useUploadCategoryIconMutation()
  const [removeIcon, { isLoading: isRemovingIcon }] = useRemoveCategoryIconMutation()

  const isEditing = Boolean(categoryToEdit)

  const parentOptions = useMemo(() => {
    if (!categoryToEdit) {
      return availableCategories
    }

    const excluded = collectExcludedIds(availableCategories, categoryToEdit.id)

    return availableCategories.filter((category) => !excluded.has(category.id))
  }, [availableCategories, categoryToEdit])

  useEffect(() => {
    if (isOpen && categoryToEdit) {
      setFormState({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        description: categoryToEdit.description || "",
        sortOrder: categoryToEdit.sortOrder,
        isActive: categoryToEdit.status?.toLowerCase() === "active",
        parentUuid: categoryToEdit.parentId || undefined,
        iconFileId: undefined,
      })
      setIconPreview(categoryToEdit.iconUrl || null)
    } else if (isOpen) {
      setFormState(initialFormState)
      setIconPreview(null)
    }
    setIconCleared(false)
    setUploadError(null)
  }, [isOpen, categoryToEdit])

  if (!isOpen) return null

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Set client-side preview
    const previewUrl = URL.createObjectURL(file)
    setIconPreview(previewUrl)
    setIconCleared(false)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const result = await uploadIcon(formData).unwrap()
      const uploadedId = extractFileId(result)

      if (!uploadedId) {
        setUploadError("Upload succeeded but the server did not return a file id.")
        return
      }

      setFormState((prev) => ({ ...prev, iconFileId: uploadedId }))
    } catch (err: unknown) {
      console.error("Failed to upload category icon:", err)
      const detail = err as { data?: { message?: string }; message?: string } | null
      setUploadError(detail?.data?.message || detail?.message || "Failed to upload icon")
    }
  }

  const handleRemoveIcon = () => {
    setIconPreview(null)
    setFormState((prev) => ({ ...prev, iconFileId: undefined }))
    // Only an existing, saved icon needs to be cleared upstream on save.
    setIconCleared(Boolean(categoryToEdit?.iconUrl))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = formState.name.trim()

    if (trimmedName.length < 2) {
      setUploadError("Category name must be at least 2 characters.")
      return
    }

    const slug = slugify(formState.slug || trimmedName)

    if (!slug) {
      setUploadError("Slug must contain at least one letter or number.")
      return
    }

    const payload: CategoryFormPayload = {
      name: trimmedName,
      slug,
      description: formState.description?.trim() || undefined,
      sortOrder: Number(formState.sortOrder) || 0,
      isActive: formState.isActive,
      parentUuid: formState.parentUuid || undefined,
      iconFileId: formState.iconFileId,
    }

    // PATCH ignores an omitted parentUuid, so clearing a parent needs moveToRoot.
    if (isEditing && !payload.parentUuid && categoryToEdit?.parentId) {
      payload.moveToRoot = true
    }

    try {
      if (isEditing && iconCleared && categoryToEdit) {
        await removeIcon(categoryToEdit.id).unwrap()
      }

      await onSubmit(payload, categoryToEdit?.id)
      setFormState(initialFormState)
      setIconPreview(null)
      setIconCleared(false)
      onClose()
    } catch {
      // error is handled by parent component state
    }
  }

  const isBusy = isSubmitting || isUploading || isRemovingIcon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#f8f7ff] shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-purple-100 text-[#6338f6] rounded-2xl flex items-center justify-center shadow-sm">
              {isEditing ? <PencilIcon size={20} /> : <FolderPlusIcon size={20} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {isEditing ? `Edit Category: ${categoryToEdit?.name}` : "Add New Category"}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {isEditing ? "Modify category details and update icon" : "Create a new category or subcategory for your directory"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors border border-gray-100"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left overflow-y-auto grow">
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Category Name *</label>
            <Input
              value={formState.name}
              onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
              placeholder="e.g. Electronics, Vehicles, Real Estate..."
              required
              minLength={2}
              maxLength={NAME_MAX_LENGTH}
              className="rounded-xl h-11 border-gray-200 focus:border-[#6338f6]"
              autoFocus
            />
          </div>

          {/* Icon Upload Field */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Category Icon</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {iconPreview ? (
              <div className="flex items-center justify-between p-3 rounded-2xl border border-purple-200 bg-purple-50/50">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconPreview} alt="Category Icon Preview" className="size-full object-contain" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Icon Selected</p>
                    <p className="text-[10px] text-emerald-600 font-bold">
                      {isUploading ? "Uploading..." : formState.iconFileId ? "Uploaded new icon" : "Current icon"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338f6] hover:bg-purple-100 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-[#6338f6] hover:bg-purple-50/30 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="size-10 rounded-full bg-gray-50 group-hover:bg-purple-100 flex items-center justify-center text-gray-400 group-hover:text-[#6338f6] transition-colors">
                  {isUploading ? <Loader2Icon size={20} className="animate-spin text-[#6338f6]" /> : <UploadIcon size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 group-hover:text-[#6338f6] transition-colors">
                    Click to upload category icon photo
                  </p>
                  <p className="text-[10px] text-gray-400">PNG, JPG, SVG or WEBP (max 5MB)</p>
                </div>
              </div>
            )}

            {iconCleared && (
              <p className="text-[10px] text-gray-400 font-medium mt-1">
                The current icon will be removed when you save.
              </p>
            )}

            {uploadError && (
              <p className="text-xs text-rose-600 font-medium mt-1">{uploadError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">URL Slug (Optional)</label>
              <Input
                value={formState.slug}
                onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))}
                onBlur={(event) =>
                  setFormState((current) => ({ ...current, slug: slugify(event.target.value) }))
                }
                placeholder="auto-generated-slug"
                maxLength={SLUG_MAX_LENGTH}
                className="rounded-xl h-11 border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Parent Category</label>
              <select
                value={formState.parentUuid ?? ""}
                onChange={(event) => setFormState((current) => ({ ...current, parentUuid: event.target.value || undefined }))}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6338f6] font-medium"
              >
                <option value="">None (Top-Level)</option>
                {parentOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Sort Order</label>
            <Input
              type="number"
              min={0}
              value={formState.sortOrder ?? 0}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  sortOrder: Math.max(0, Number(event.target.value) || 0),
                }))
              }
              className="rounded-xl h-11 border-gray-200"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Description</label>
            <Textarea
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              placeholder="Brief description of products in this category..."
              maxLength={DESCRIPTION_MAX_LENGTH}
              className="rounded-xl min-h-20 text-sm border-gray-200"
            />
          </div>

          <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 cursor-pointer hover:bg-gray-50/50 transition-colors">
            <div>
              <p className="text-sm font-bold text-gray-900">Active Status</p>
              <p className="text-xs text-gray-500">Make this category visible in marketplace</p>
            </div>
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
              className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
            />
          </label>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-11 px-5 font-bold border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isBusy || !formState.name.trim()}
              className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              {isBusy ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : isEditing ? (
                <SaveIcon size={16} />
              ) : (
                <PlusIcon size={16} />
              )}
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
