"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { 
  PencilIcon, 
  Trash2Icon, 
  PlusIcon, 
  SearchIcon,
  EyeIcon,
  FolderPlusIcon,
  SparklesIcon,
  LayersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpDownIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { CustomSelect } from "@/components/ui/custom-select"
import { cn } from "@/lib/utils"

export interface CategoryDirectoryItem {
  id: string
  name: string
  slug: string
  description?: string
  icon?: React.ReactNode
  iconBg?: string
  iconUrl?: string | null
  count: string
  listingsCountRaw: number
  status: string
  level: number
  sortOrder: number
  parentId: string | null
  parentName?: string | null
}

interface CategoryDirectoryProps {
  categories: CategoryDirectoryItem[]
  selectedId?: string
  onSelect?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onAddSubcategory?: (parentId: string) => void
  onStartCreate?: () => void
  isLoading?: boolean
}

const TABS = [
  { label: "All Categories", value: "ALL" },
  { label: "Root Level", value: "ROOT" },
  { label: "Subcategories", value: "SUB" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
]

export function CategoryDirectory({
  categories,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onAddSubcategory,
  onStartCreate,
  isLoading = false,
}: CategoryDirectoryProps) {
  const [activeTab, setActiveTab] = useState("ALL")
  const [search, setSearch] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [sortBy, setSortBy] = useState<"name" | "listings" | "sortOrder" | "level">("sortOrder")
  const [sortAsc, setSortAsc] = useState(true)

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Tab filter
      if (activeTab === "ROOT" && cat.parentId) return false
      if (activeTab === "SUB" && !cat.parentId) return false
      if (activeTab === "ACTIVE" && cat.status.toLowerCase() !== "active") return false
      if (activeTab === "INACTIVE" && cat.status.toLowerCase() === "active") return false

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchName = cat.name.toLowerCase().includes(q)
        const matchSlug = cat.slug.toLowerCase().includes(q)
        const matchParent = cat.parentName?.toLowerCase().includes(q) ?? false
        const matchDesc = cat.description?.toLowerCase().includes(q) ?? false
        if (!matchName && !matchSlug && !matchParent && !matchDesc) return false
      }

      return true
    })
  }, [categories, activeTab, search])

  // Sort categories
  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "listings") {
        comparison = a.listingsCountRaw - b.listingsCountRaw
      } else if (sortBy === "level") {
        comparison = a.level - b.level
      } else {
        comparison = a.sortOrder - b.sortOrder
      }
      return sortAsc ? comparison : -comparison
    })
  }, [filteredCategories, sortBy, sortAsc])

  // Paginate
  const totalItems = sortedCategories.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedCategories = useMemo(() => {
    const start = currentPage * pageSize
    return sortedCategories.slice(start, start + pageSize)
  }, [sortedCategories, currentPage, pageSize])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(0)
  }

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(field)
      setSortAsc(true)
    }
  }

  const startRow = totalItems === 0 ? 0 : currentPage * pageSize + 1
  const endRow = Math.min(totalItems, (currentPage + 1) * pageSize)

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
      {/* Header & Controls */}
      <div className="p-6 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-gray-900 leading-tight">Category Directory</h4>
            <p className="text-xs text-gray-400 font-medium">
              View, search, and manage all categories and subcategories
            </p>
          </div>

          {onStartCreate && (
            <button
              type="button"
              onClick={onStartCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6338f6] hover:bg-[#532edb] text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
            >
              <PlusIcon size={15} /> Add Category
            </button>
          )}
        </div>

        {/* Tabs & Search Filter Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors",
                  activeTab === tab.value
                    ? "bg-[#6338f6] text-white shadow-xs"
                    : "text-gray-500 hover:bg-gray-100/70"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Page Size */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(0)
                }}
                placeholder="Search categories..."
                className="pl-9 h-9 bg-gray-50/80 border-gray-200/80 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#6338f6]/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            <CustomSelect
              value={String(pageSize)}
              onChange={(val) => {
                setPageSize(Number(val))
                setCurrentPage(0)
              }}
              options={[
                { value: "10", label: "10 / page" },
                { value: "25", label: "25 / page" },
                { value: "50", label: "50 / page" },
              ]}
              triggerClassName="h-9 rounded-xl bg-gray-50/80 border-gray-200/80 text-xs font-bold px-2.5"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              <th
                onClick={() => toggleSort("name")}
                className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-700 select-none"
              >
                <div className="flex items-center gap-1">
                  Category
                  <ArrowUpDownIcon size={11} className="opacity-60" />
                </div>
              </th>
              <th className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Parent
              </th>
              <th
                onClick={() => toggleSort("level")}
                className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-700 select-none"
              >
                <div className="flex items-center gap-1">
                  Level
                  <ArrowUpDownIcon size={11} className="opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("sortOrder")}
                className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-700 select-none"
              >
                <div className="flex items-center gap-1">
                  Order
                  <ArrowUpDownIcon size={11} className="opacity-60" />
                </div>
              </th>
              <th
                onClick={() => toggleSort("listings")}
                className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-700 select-none"
              >
                <div className="flex items-center gap-1">
                  Listings
                  <ArrowUpDownIcon size={11} className="opacity-60" />
                </div>
              </th>
              <th className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="p-4 sm:px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/70">
            {isLoading && categories.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-xs text-gray-400 font-medium" colSpan={7}>
                  Loading categories...
                </td>
              </tr>
            ) : paginatedCategories.length ? (
              paginatedCategories.map((cat) => {
                const isSelected = selectedId === cat.id
                const isActive = cat.status.toLowerCase() === "active"

                return (
                  <tr
                    key={cat.id}
                    className={cn(
                      "transition-colors cursor-pointer group",
                      isSelected ? "bg-[#f8f7ff]" : "hover:bg-gray-50/80"
                    )}
                    onClick={() => onSelect?.(cat.id)}
                  >
                    {/* Icon & Category Title */}
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "size-10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs border",
                            cat.iconBg || "bg-purple-50/80 border-purple-100"
                          )}
                        >
                          {cat.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={cat.iconUrl}
                              alt={cat.name}
                              className="size-full object-contain p-1"
                            />
                          ) : (
                            cat.icon || <SparklesIcon size={16} className="text-[#6338f6]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#6338f6] transition-colors truncate">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono truncate">
                            /{cat.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Parent Category */}
                    <td className="p-4 sm:px-6">
                      {cat.parentName ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700">
                          <LayersIcon size={11} className="text-gray-400" />
                          {cat.parentName}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#6338f6] px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-100">
                          Root
                        </span>
                      )}
                    </td>

                    {/* Level */}
                    <td className="p-4 sm:px-6 text-xs font-semibold text-gray-600">
                      Level {cat.level}
                    </td>

                    {/* Sort Order */}
                    <td className="p-4 sm:px-6 text-xs font-bold text-gray-500 font-mono">
                      #{cat.sortOrder}
                    </td>

                    {/* Listings Count */}
                    <td className="p-4 sm:px-6 text-xs text-gray-600 font-medium">
                      {cat.count}
                    </td>

                    {/* Status */}
                    <td className="p-4 sm:px-6">
                      <Badge
                        variant={isActive ? "success" : "secondary"}
                        className="font-extrabold text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap"
                      >
                        • {cat.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center justify-center gap-1">
                        {onAddSubcategory && (
                          <button
                            title="Add Subcategory"
                            type="button"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338f6] hover:bg-purple-50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddSubcategory(cat.id)
                            }}
                          >
                            <FolderPlusIcon size={15} />
                          </button>
                        )}
                        <button
                          title="Inspect Details"
                          type="button"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelect?.(cat.id)
                          }}
                        >
                          <EyeIcon size={15} />
                        </button>
                        <button
                          title="Edit Category"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#6338f6] hover:bg-purple-50 transition-colors"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit?.(cat.id)
                          }}
                        >
                          <PencilIcon size={15} />
                        </button>
                        <button
                          title="Delete Category"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete?.(cat.id)
                          }}
                        >
                          <Trash2Icon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className="p-8 text-center text-xs text-gray-400 font-medium" colSpan={7}>
                  {search ? "No categories matched your search criteria." : "No categories found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/20">
        <p className="text-xs text-gray-400 font-medium">
          Showing {startRow} - {endRow} of {totalItems} categories
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="size-8 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeftIcon size={15} />
          </button>
          <span className="text-xs font-bold px-3 py-1 bg-white border border-gray-200/80 rounded-xl text-gray-700 shadow-2xs">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="size-8 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronRightIcon size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
