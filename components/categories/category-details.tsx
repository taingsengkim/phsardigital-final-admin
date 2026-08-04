"use client"

import { useState } from "react"
import { SmartphoneIcon, PlusIcon, UploadIcon } from "lucide-react"

import type { CategoryRecord, CreateCategoryInput } from "@/lib/features/categories/categoriesApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CategoryDetailsProps {
  category: CategoryRecord | null
  isCreating?: boolean
  onCreate: (payload: CreateCategoryInput) => Promise<unknown>
}

const initialFormState: CreateCategoryInput = {
  name: "",
  slug: "",
  description: "",
  level: 1,
  isActive: true,
}

export function CategoryDetails({ category, isCreating, onCreate }: CategoryDetailsProps) {
  const [formState, setFormState] = useState<CreateCategoryInput>(initialFormState)

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

    await onCreate({
      name: trimmedName,
      slug: formState.slug.trim() || slugify(trimmedName),
      iconFileId: formState.iconFileId?.trim() || undefined,
      description: formState.description?.trim() || undefined,
      level: Number.isFinite(formState.level) && formState.level > 0 ? formState.level : 1,
      isActive: formState.isActive,
    })

    setFormState(initialFormState)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
        <div className="size-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <SmartphoneIcon size={40} className="text-[#6338f6]" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-1">{category?.name ?? "Select a category"}</h4>
        <p className="text-[10px] font-bold text-[#6338f6] uppercase tracking-widest mb-8">Main Category</p>
        
        <div className="space-y-4 mb-8 text-left">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total Listings</span>
            <span className="font-bold text-gray-900">{category?.listingsCount.toLocaleString() ?? "0"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Created Date</span>
            <span className="font-bold text-gray-900">{category?.createdAt ?? "Not available"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Last Updated</span>
            <span className="text-[#6338f6] font-bold">{category?.updatedAt ?? "Just now"}</span>
          </div>
        </div>
        
        <div className="text-left mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {category?.description ?? "Pick a category to inspect its description and create a related subcategory."}
          </p>
        </div>
        
        <form className="space-y-3 text-left" onSubmit={handleSubmit}>
          <Input
            value={formState.name}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
            placeholder="Category name"
            required
            className="rounded-xl"
          />
          <Input
            value={formState.slug}
            onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))}
            placeholder="Slug (optional)"
            className="rounded-xl"
          />
          <Textarea
            value={formState.description}
            onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
            placeholder="Category description"
            className="rounded-xl min-h-24"
          />
          <Input
            type="number"
            min={1}
            step={1}
            value={formState.level}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                level: Number(event.target.value) || 1,
              }))
            }
            placeholder="Level"
            className="rounded-xl"
          />
          <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Active category</p>
              <p className="text-xs text-gray-500">Toggle whether this category is active.</p>
            </div>
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
              className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
            />
          </label>
          <Button
            className="w-full rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-12 font-bold flex items-center justify-center gap-2"
            type="submit"
            disabled={isCreating || !formState.name.trim()}
          >
            <PlusIcon size={18} />
            {isCreating ? "Creating..." : "Add New Category"}
          </Button>
        </form>
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
