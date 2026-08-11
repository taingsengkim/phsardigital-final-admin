"use client"

import { useMemo, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { CategoryHierarchy, type CategoryTreeNode } from "@/components/categories/category-tree"
import { CategoryDirectory, type CategoryDirectoryItem } from "@/components/categories/category-directory"
import { CategoryDetails } from "@/components/categories/category-details"
import { AddCategoryModal } from "@/components/categories/add-category-modal"
import { CategoryGrowthChart, CategoryListingsBar } from "@/components/categories/category-charts"
import { 
  LayoutGridIcon, 
  LayersIcon, 
  ShoppingBagIcon, 
  StarIcon, 
  SearchIcon,
  DownloadIcon,
  TrendingUpIcon,
  PlusIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  type CategoryRecord,
  type CreateCategoryInput,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/lib/features/categories/categoriesApi"

function getCategoryVisuals(name: string) {
  const normalized = name.toLowerCase()

  if (normalized.includes("elect")) {
    return {
      icon: <span className="size-4 text-purple-600">📱</span>,
      iconBg: "bg-purple-50",
    }
  }

  if (normalized.includes("vehicle") || normalized.includes("auto") || normalized.includes("car")) {
    return {
      icon: <span className="size-4 text-blue-600">🚗</span>,
      iconBg: "bg-blue-50",
    }
  }

  if (normalized.includes("property") || normalized.includes("home") || normalized.includes("real")) {
    return {
      icon: <span className="size-4 text-indigo-600">🏠</span>,
      iconBg: "bg-indigo-50",
    }
  }

  return {
    icon: <span className="size-4 text-slate-600">•</span>,
    iconBg: "bg-slate-50",
  }
}

function flattenCategories(categories: CategoryRecord[], parentId: string | null = null): CategoryRecord[] {
  return categories.flatMap((category) => {
    const currentCategory: CategoryRecord = {
      ...category,
      parentId: category.parentId ?? parentId,
      children: undefined,
    }

    const childCategories = category.children?.length
      ? flattenCategories(category.children, currentCategory.id)
      : []

    return [currentCategory, ...childCategories]
  })
}

function buildTree(categories: CategoryRecord[]): CategoryTreeNode[] {
  const byParent = new Map<string | null, CategoryRecord[]>()

  categories.forEach((category) => {
    const parentKey = category.parentId ?? null
    const siblings = byParent.get(parentKey) ?? []
    siblings.push(category)
    byParent.set(parentKey, siblings)
  })

  const buildNodes = (items: CategoryRecord[]): CategoryTreeNode[] =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      count: `${item.listingsCount.toLocaleString()} listings`,
      icon: getCategoryVisuals(item.name).icon,
      children: buildNodes(byParent.get(item.id) ?? []),
    }))

  return buildNodes(byParent.get(null) ?? categories.filter((category) => !category.parentId))
}

function formatListingsCount(value: number) {
  return value.toLocaleString("en-US")
}

function countChildren(categories: CategoryRecord[]) {
  return categories.filter((category) => category.parentId).length
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (!error || typeof error !== "object") {
    return "Failed to create category"
  }

  const candidate = error as {
    data?: unknown
    error?: unknown
    message?: unknown
    status?: unknown
  }

  const messageSources = [candidate.message, candidate.error, candidate.data]

  for (const source of messageSources) {
    if (typeof source === "string" && source.trim()) {
      return source
    }

    if (source && typeof source === "object") {
      const nested = source as {
        message?: unknown
        error?: unknown
        detail?: unknown
        details?: unknown
      }

      const nestedSources = [nested.message, nested.error, nested.detail, nested.details]

      for (const nestedSource of nestedSources) {
        if (typeof nestedSource === "string" && nestedSource.trim()) {
          return nestedSource
        }
      }

      try {
        const serialized = JSON.stringify(source)

        if (serialized && serialized !== "{}") {
          return serialized
        }
      } catch {
        // fall through to the default message
      }
    }
  }

  if (typeof candidate.status === "number") {
    return `Request failed with status ${candidate.status}`
  }

  return "Failed to create category"
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } = useGetCategoriesQuery()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [createError, setCreateError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const flattenedCategories = useMemo(() => flattenCategories(categories), [categories])
  const filteredCategories = useMemo(
    () =>
      flattenedCategories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [flattenedCategories, searchTerm]
  )

  const activeSelectedCategoryId = selectedCategoryId ?? filteredCategories[0]?.id

  const selectedCategory = filteredCategories.find((category) => category.id === activeSelectedCategoryId) ??
    filteredCategories[0] ??
    null

  const treeNodes = useMemo(() => buildTree(filteredCategories), [filteredCategories])

  const directoryItems: CategoryDirectoryItem[] = useMemo(
    () =>
      filteredCategories.map((category) => ({
        id: category.id,
        name: category.name,
        ...getCategoryVisuals(category.name),
        count: formatListingsCount(category.listingsCount),
        status: category.status,
      })),
    [filteredCategories]
  )

  const totalListings = filteredCategories.reduce((sum, category) => sum + category.listingsCount, 0)
  const popularCategory = [...filteredCategories].sort((left, right) => right.listingsCount - left.listingsCount)[0]
  const topCategories = [...filteredCategories]
    .sort((left, right) => right.listingsCount - left.listingsCount)
    .slice(0, 4)

  const handleStartCreate = () => {
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleCreateCategory = async (payload: CreateCategoryInput) => {
    try {
      setCreateError(null)
      const created = await createCategory(payload).unwrap()
      setSelectedCategoryId(created.id)
      await refetch()
      return created
    } catch (error) {
      setCreateError(getErrorMessage(error))
      throw error
    }
  }

  const handleUpdateCategory = async (id: string, payload: Partial<CreateCategoryInput>) => {
    try {
      setCreateError(null)
      const updated = await updateCategory({ id, data: payload }).unwrap()
      setIsEditing(false)
      await refetch()
      return updated
    } catch (error) {
      setCreateError(getErrorMessage(error))
      throw error
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      setCreateError(null)
      const categoryToDelete = flattenedCategories.find(c => c.id === id)
      const slug = categoryToDelete?.slug || id
      await deleteCategory(slug).unwrap()
      if (selectedCategoryId === id) {
        setSelectedCategoryId(undefined)
        setIsEditing(false)
      }
      await refetch()
    } catch (error) {
      setCreateError(getErrorMessage(error))
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Category Manager" 
          description="Organize and manage your product categories and subcategories."
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
              <Input 
                placeholder="Search categories..." 
                className="pl-10 bg-white border-gray-100 rounded-xl h-11 w-64 shadow-sm"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Button
              onClick={handleStartCreate}
              className="bg-[#6338f6] hover:bg-[#532edb] text-white rounded-xl h-11 px-4 font-bold flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              <PlusIcon size={18} /> Add Category
            </Button>
          </div>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {createError && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 flex justify-between items-center">
              <span>{createError}</span>
              <button className="text-amber-800 font-bold" onClick={() => setCreateError(null)}>×</button>
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load categories. <button className="font-semibold underline" onClick={() => refetch()} type="button">Retry</button>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="TOTAL CATEGORIES" 
              value={isLoading ? "..." : filteredCategories.length} 
              icon={LayoutGridIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <StatsCard 
              title="TOTAL SUBCATEGORIES" 
              value={isLoading ? "..." : countChildren(filteredCategories)} 
              icon={LayersIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <StatsCard 
              title="TOTAL LISTINGS" 
              value={isLoading ? "..." : formatListingsCount(totalListings)} 
              icon={ShoppingBagIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <div className="bg-[#ffffff] p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">POPULAR CATEGORY</p>
                <h4 className="text-lg font-bold text-gray-900">{popularCategory?.name ?? "No data"}</h4>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <TrendingUpIcon size={10} /> {popularCategory ? `${popularCategory.listingsCount.toLocaleString()} listings` : "Waiting for data"}
                </p>
              </div>
              <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <StarIcon size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hierarchy and Directory */}
            <div className="lg:col-span-2 space-y-8">
              <CategoryHierarchy
                key={categories.length ? "category-tree-loaded" : "category-tree-empty"}
                nodes={treeNodes}
                selectedId={selectedCategory?.id}
                onSelect={(id) => {
                  setSelectedCategoryId(id)
                  setIsEditing(false)
                }}
              />
              <CategoryDirectory
                categories={directoryItems}
                selectedId={selectedCategory?.id}
                onSelect={(id) => {
                  setSelectedCategoryId(id)
                  setIsEditing(false)
                }}
                onEdit={(id) => {
                  setSelectedCategoryId(id)
                  setIsEditing(true)
                }}
                onDelete={handleDeleteCategory}
                onStartCreate={handleStartCreate}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column - Details and Charts */}
            <div className="space-y-8">
              <CategoryDetails
                key={`${selectedCategory?.id}-${isEditing ? 'edit' : 'view'}`}
                category={selectedCategory}
                availableCategories={flattenedCategories}
                isCreating={isCreating || isUpdating}
                onCreate={handleCreateCategory}
                isEditing={isEditing}
                onUpdate={handleUpdateCategory}
                onCancelEdit={() => setIsEditing(false)}
                onStartCreate={handleStartCreate}
              />
              
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-6">Listings by Category</h4>
                <div className="space-y-6">
                  {(topCategories.length ? topCategories : filteredCategories.slice(0, 4)).map((category, index) => (
                    <CategoryListingsBar
                      key={category.id}
                      label={category.name}
                      value={category.listingsCount >= 1000 ? `${(category.listingsCount / 1000).toFixed(1)}k` : category.listingsCount.toString()}
                      percentage={Math.max(12, 100 - index * 18)}
                      color={index === 0 ? "#6338f6" : index === 1 ? "#8b5cf6" : index === 2 ? "#a78bfa" : "#1f2937"}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-gray-900">Category Growth Trend</h4>
                  <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <DownloadIcon size={14} />
                  </div>
                </div>
                <CategoryGrowthChart />
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Category Modal Popup */}
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          availableCategories={flattenedCategories}
          isSubmitting={isCreating}
          onSubmit={handleCreateCategory}
        />

        {/* Floating Action Button for Export as shown in bottom right of image */}
        <button className="fixed bottom-8 right-8 size-14 bg-[#6338f6] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#532edb] transition-all z-50">
          <DownloadIcon size={24} />
        </button>
      </SidebarInset>
    </SidebarProvider>
  )
}
