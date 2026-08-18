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
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog"
import { 
  LayoutGridIcon, 
  LayersIcon, 
  ShoppingBagIcon, 
  StarIcon, 
  SearchIcon,
  DownloadIcon,
  TrendingUpIcon,
  PlusIcon,
  SmartphoneIcon,
  CarIcon,
  HomeIcon,
  ShirtIcon,
  BookOpenIcon,
  Gamepad2Icon,
  SparklesIcon,
  FolderIcon,
  UtensilsIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CategoryRecord, CreateCategoryInput } from "@/lib/types/category"
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/lib/redux/service/categoryApi"

function getCategoryVisuals(name: string) {
  const normalized = name.toLowerCase()

  if (normalized.includes("elect") || normalized.includes("phone") || normalized.includes("tech") || normalized.includes("digital")) {
    return {
      icon: <SmartphoneIcon className="size-5 text-[#6338f6]" />,
      iconBg: "bg-purple-50 border border-purple-100",
    }
  }

  if (normalized.includes("vehicle") || normalized.includes("auto") || normalized.includes("car") || normalized.includes("motor")) {
    return {
      icon: <CarIcon className="size-5 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100",
    }
  }

  if (normalized.includes("property") || normalized.includes("home") || normalized.includes("real") || normalized.includes("house")) {
    return {
      icon: <HomeIcon className="size-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border border-emerald-100",
    }
  }

  if (normalized.includes("fashion") || normalized.includes("cloth") || normalized.includes("wear") || normalized.includes("apparel")) {
    return {
      icon: <ShirtIcon className="size-5 text-pink-600" />,
      iconBg: "bg-pink-50 border border-pink-100",
    }
  }

  if (normalized.includes("book") || normalized.includes("read") || normalized.includes("study")) {
    return {
      icon: <BookOpenIcon className="size-5 text-amber-600" />,
      iconBg: "bg-amber-50 border border-amber-100",
    }
  }

  if (normalized.includes("game") || normalized.includes("toy") || normalized.includes("play")) {
    return {
      icon: <Gamepad2Icon className="size-5 text-indigo-600" />,
      iconBg: "bg-indigo-50 border border-indigo-100",
    }
  }

  if (normalized.includes("food") || normalized.includes("drink") || normalized.includes("eat")) {
    return {
      icon: <UtensilsIcon className="size-5 text-orange-600" />,
      iconBg: "bg-orange-50 border border-orange-100",
    }
  }

  if (normalized.includes("test") || normalized.includes("demo") || normalized.includes("sample")) {
    return {
      icon: <SparklesIcon className="size-5 text-violet-600" />,
      iconBg: "bg-violet-50 border border-violet-100",
    }
  }

  return {
    icon: <FolderIcon className="size-5 text-[#6338f6]" />,
    iconBg: "bg-purple-50/80 border border-purple-100",
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryRecord | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRecord | null>(null)
  
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const flattenedCategories = useMemo(() => flattenCategories(categories), [categories])
  const filteredCategories = useMemo(
    () =>
      flattenedCategories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [flattenedCategories, searchTerm]
  )

  const selectedCategory = selectedCategoryId
    ? filteredCategories.find((category) => category.id === selectedCategoryId) ?? null
    : null

  const treeNodes = useMemo(() => buildTree(filteredCategories), [filteredCategories])

  const directoryItems: CategoryDirectoryItem[] = useMemo(
    () =>
      filteredCategories.map((category) => ({
        id: category.id,
        name: category.name,
        ...getCategoryVisuals(category.name),
        iconUrl: category.iconUrl,
        count: formatListingsCount(category.listingsCount),
        status: category.status,
      })),
    [filteredCategories]
  )

  const totalListings = filteredCategories.reduce((sum, category) => sum + category.listingsCount, 0)
  const popularCategory = [...filteredCategories].sort((left, right) => right.listingsCount - left.listingsCount)[0]
  const handleStartCreate = () => {
    setCategoryToEdit(null)
    setIsModalOpen(true)
  }

  const handleStartEdit = (category: CategoryRecord) => {
    setCategoryToEdit(category)
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
      await refetch()
      return updated
    } catch (error) {
      setCreateError(getErrorMessage(error))
      throw error
    }
  }

  const handleSaveModalCategory = async (payload: CreateCategoryInput, editId?: string) => {
    if (editId) {
      return handleUpdateCategory(editId, payload)
    }
    return handleCreateCategory(payload)
  }

  const handleDeleteRequest = (id: string) => {
    const targetCat = flattenedCategories.find(c => c.id === id)
    if (targetCat) {
      setCategoryToDelete(targetCat)
    }
  }

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return
    try {
      setCreateError(null)
      const slug = categoryToDelete.slug || categoryToDelete.id
      await deleteCategory(slug).unwrap()
      if (selectedCategoryId === categoryToDelete.id) {
        setSelectedCategoryId(undefined)
      }
      setCategoryToDelete(null)
      await refetch()
    } catch (error) {
      setCreateError(getErrorMessage(error))
      setCategoryToDelete(null)
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

          <div className={`grid grid-cols-1 gap-8 ${selectedCategory ? "lg:grid-cols-3" : ""}`}>
            {/* Left Column - Hierarchy and Directory */}
            <div className={selectedCategory ? "space-y-8 lg:col-span-2" : "space-y-8"}>
              <CategoryHierarchy
                key={categories.length ? "category-tree-loaded" : "category-tree-empty"}
                nodes={treeNodes}
                selectedId={selectedCategory?.id}
                onSelect={(id) => {
                  setSelectedCategoryId(id)
                }}
              />
              <CategoryDirectory
                categories={directoryItems}
                selectedId={selectedCategory?.id}
                onSelect={(id) => {
                  setSelectedCategoryId(id)
                }}
                onEdit={(id) => {
                  const targetCat = flattenedCategories.find(c => c.id === id)
                  if (targetCat) {
                    handleStartEdit(targetCat)
                  }
                }}
                onDelete={handleDeleteRequest}
                onStartCreate={handleStartCreate}
                isLoading={isLoading}
              />
            </div>

            {/* Show details only after an admin selects a category. */}
            {selectedCategory && (
              <div className="space-y-8">
                <CategoryDetails
                  category={selectedCategory}
                  onStartEdit={(cat) => handleStartEdit(cat)}
                  onStartDelete={(cat) => setCategoryToDelete(cat)}
                />
              </div>
            )}
          </div>

        </div>
        
        {/* Category Modal Popup (Handles Create & Edit with Icon Photo Upload) */}
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setCategoryToEdit(null)
          }}
          categoryToEdit={categoryToEdit}
          availableCategories={flattenedCategories}
          isSubmitting={isCreating || isUpdating}
          onSubmit={handleSaveModalCategory}
        />

        {/* Delete Category Confirmation Dialog Popup */}
        <DeleteCategoryDialog
          isOpen={Boolean(categoryToDelete)}
          categoryName={categoryToDelete?.name}
          isDeleting={isDeleting}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
        />

        {/* Floating Action Button for Export as shown in bottom right of image */}
        <button className="fixed bottom-8 right-8 size-14 bg-[#6338f6] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#532edb] transition-all z-50">
          <DownloadIcon size={24} />
        </button>
      </SidebarInset>
    </SidebarProvider>
  )
}
