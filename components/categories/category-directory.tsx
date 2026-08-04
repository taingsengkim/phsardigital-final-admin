"use client"

import { Badge } from "@/components/ui/badge"
import { PencilIcon, Trash2Icon } from "lucide-react"
import type { ReactNode } from "react"

export interface CategoryDirectoryItem {
  id: string
  name: string
  icon: ReactNode
  iconBg: string
  count: string
  status: string
}

interface CategoryDirectoryProps {
  categories: CategoryDirectoryItem[]
  selectedId?: string
  onSelect?: (id: string) => void
  isLoading?: boolean
}

export function CategoryDirectory({ categories, selectedId, onSelect, isLoading }: CategoryDirectoryProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50">
        <h4 className="font-bold text-gray-900">Category Directory</h4>
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
                className={`transition-colors ${selectedId === cat.id ? "bg-[#f8f7ff]" : "hover:bg-gray-50"}`}
                onClick={() => onSelect?.(cat.id)}
              >
                <td className="p-6">
                  <div className={`size-10 rounded-xl ${cat.iconBg} flex items-center justify-center`}>
                    {cat.icon}
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
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" type="button">
                      <PencilIcon size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" type="button">
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
