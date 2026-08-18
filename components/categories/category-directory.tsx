"use client"

import { Badge } from "@/components/ui/badge"
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface CategoryDirectoryItem {
  id: string
  name: string
  icon: ReactNode
  iconBg: string
  iconUrl?: string | null
  count: string
  status: string
}

interface CategoryDirectoryProps {
  categories: CategoryDirectoryItem[]
  selectedId?: string
  onSelect?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onStartCreate?: () => void
  isLoading?: boolean
}

export function CategoryDirectory({ categories, selectedId, onSelect, onEdit, onDelete, onStartCreate, isLoading }: CategoryDirectoryProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h4 className="font-bold text-gray-900">Category Directory</h4>
        {onStartCreate && (
          <button
            type="button"
            onClick={onStartCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6338f6] hover:bg-[#532edb] text-white text-xs font-bold transition-all shadow-sm"
          >
            <PlusIcon size={14} /> Add Category
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Icon</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category Name</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Listings Count</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && categories.length === 0 ? (
              <tr>
                <td className="p-6 text-sm text-gray-400" colSpan={5}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length ? (
              categories.map((cat) => (
              <tr
                key={cat.id}
                className={`transition-colors cursor-pointer ${selectedId === cat.id ? "bg-[#f8f7ff]" : "hover:bg-gray-50"}`}
                onClick={() => onSelect?.(cat.id)}
              >
                <td className="p-6">
                  <div className={`size-10 rounded-xl ${cat.iconBg} flex items-center justify-center overflow-hidden p-1 shadow-sm`}>
                    {cat.iconUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cat.iconUrl} alt={cat.name} className="size-full object-contain" />
                    ) : (
                      cat.icon
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                </td>
                <td className="p-6 text-sm text-gray-500 font-medium">{cat.count}</td>
                <td className="p-6">
                  <Badge 
                    variant={cat.status.toLowerCase() === "active" ? "success" : "secondary"}
                    className="font-bold text-[10px] py-0 h-5"
                  >
                    {cat.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(cat.id);
                      }}
                    >
                      <PencilIcon size={16} />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors" 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(cat.id);
                      }}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-sm text-gray-400" colSpan={5}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
