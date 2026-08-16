"use client"

import { useState, useRef, useEffect } from "react"
import { XIcon, PlusIcon, FolderPlusIcon, UploadIcon, Loader2Icon, PencilIcon, SaveIcon } from "lucide-react"

import type { CategoryRecord, CreateCategoryInput } from "@/lib/types/category"
import { useUploadCategoryIconMutation } from "@/lib/redux/service/categoryApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categoryToEdit?: CategoryRecord | null
  availableCategories?: CategoryRecord[]
  isSubmitting?: boolean
  onSubmit: (payload: CreateCategoryInput, editId?: string) => Promise<unknown>
}

const initialFormState: CreateCategoryInput = {
  name: "",
  slug: "",
  description: "",
  level: 1,
  sortOrder: 0,
  isActive: true,
  parentUuid: undefined,
  iconFileId: undefined,
}

export function AddCategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  availableCategories = [],
  isSubmitting = false,
  onSubmit,
}: AddCategoryModalProps) {
  const [formState, setFormState] = useState<CreateCategoryInput>(initialFormState)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadIcon, { isLoading: isUploading }] = useUploadCategoryIconMutation()

  const isEditing = Boolean(categoryToEdit)

  useEffect(() => {
    if (isOpen && categoryToEdit) {
      setFormState({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        description: categoryToEdit.description || "",
        level: categoryToEdit.parentId ? 2 : 1,
        sortOrder: 0,
        isActive: categoryToEdit.status?.toLowerCase() === "active",
        parentUuid: categoryToEdit.parentId || undefined,
        iconFileId: undefined,
      })
      setIconPreview(categoryToEdit.iconUrl || null)
    } else if (isOpen) {
      setFormState(initialFormState)
      setIconPreview(null)
    }
    setUploadError(null)
  }, [isOpen, categoryToEdit])

  if (!isOpen) return null

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/["']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Set client-side preview
    const previewUrl = URL.createObjectURL(file)
    setIconPreview(previewUrl)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadIcon(formData).unwrap()
      const uploadedId = result.id || result.uuid || result.objectName
      
      if (uploadedId) {
        setFormState((prev) => ({ ...prev, iconFileId: uploadedId }))
      }
    } catch (err: any) {
      console.error("Failed to upload category icon:", err)
      setUploadError(err?.message || err?.data?.message || "Failed to upload icon")
    }
  }

  const handleRemoveIcon = () => {
    setIconPreview(null)
    setFormState((prev) => ({ ...prev, iconFileId: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.name.trim()) return

    const trimmedName = formState.name.trim()

    const payload: CreateCategoryInput = {
      name: trimmedName,
      slug: formState.slug.trim() || slugify(trimmedName),
      description: formState.description?.trim() || undefined,
      level: formState.parentUuid ? 2 : (Number.isFinite(formState.level) && (formState.level ?? 1) > 0 ? formState.level : 1),
      sortOrder: Number(formState.sortOrder) || 0,
      isActive: formState.isActive,
      parentUuid: formState.parentUuid || undefined,
      iconFileId: formState.iconFileId,
    }

    try {
      await onSubmit(payload, categoryToEdit?.id)
      setFormState(initialFormState)
      setIconPreview(null)
      onClose()
    } catch {
      // error is handled by parent component state
    }
  }

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
                placeholder="auto-generated-slug"
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
                {availableCategories
                  .filter((cat) => !categoryToEdit || cat.id !== categoryToEdit.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1.5 block">Description</label>
            <Textarea
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              placeholder="Brief description of products in this category..."
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
              disabled={isSubmitting || isUploading || !formState.name.trim()}
              className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              {isUploading || isSubmitting ? (
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
