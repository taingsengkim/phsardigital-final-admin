"use client"

import { FolderIcon, PencilIcon, Trash2Icon, UploadIcon } from "lucide-react"

import type { CategoryRecord } from "@/lib/types/category"
import { Button } from "@/components/ui/button"

interface CategoryDetailsProps {
  category: CategoryRecord | null
  parentCategory?: CategoryRecord | null
  onStartEdit?: (category: CategoryRecord) => void
  onStartDelete?: (category: CategoryRecord) => void
}

export function CategoryDetails({ category, parentCategory, onStartEdit, onStartDelete }: CategoryDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6338f6]">
            Category Details
          </span>
          {category && (
            <div className="flex items-center gap-2">
              {onStartEdit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onStartEdit(category)}
                  className="flex h-8 items-center gap-1 rounded-xl border-gray-200 px-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  <PencilIcon size={13} /> Edit
                </Button>
              )}
              {onStartDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onStartDelete(category)}
                  className="flex h-8 items-center gap-1 rounded-xl border-rose-200 bg-rose-50 px-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                >
                  <Trash2Icon size={13} /> Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto mb-4 flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-purple-50 p-2">
          {category?.iconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={category.iconUrl} alt={category.name} className="size-full object-contain" />
          ) : (
            <FolderIcon size={40} className="text-[#6338f6]" />
          )}
        </div>

        <h4 className="mb-1 text-xl font-bold text-gray-900">
          {category?.name ?? "Select a category"}
        </h4>

        {category ? (
          <>
            <div className="my-8 space-y-4 border-y border-gray-50 py-6 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Slug</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-bold text-gray-700">
                  {category.slug}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Listings</span>
                <span className="font-bold text-gray-900">{category.listingsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Parent</span>
                <span className="font-bold text-gray-900">
                  {parentCategory?.name ?? (category.parentId ? "Unknown" : "Top level")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Level</span>
                <span className="font-bold text-gray-900">{category.level}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Sort Order</span>
                <span className="font-bold text-gray-900">{category.sortOrder}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase ${category.status.toLowerCase() === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                  {category.status}
                </span>
              </div>
            </div>

            <div className="text-left">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</p>
              <p className="text-xs leading-relaxed text-gray-500">
                {category.description || "No description provided."}
              </p>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-gray-400">Choose a category from the hierarchy or directory.</p>
        )}
      </div>

      <div className="cursor-pointer rounded-3xl border border-dashed border-purple-100 bg-[#f8f7ff] p-8 text-center transition-colors hover:bg-[#f1efff]">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
          <UploadIcon size={18} className="text-[#6338f6]" />
        </div>
        <h5 className="mb-1 text-sm font-bold text-gray-900">Bulk Import Categories</h5>
        <p className="text-[10px] text-gray-400">Upload CSV or XLSX file</p>
      </div>
    </div>
  )
}
