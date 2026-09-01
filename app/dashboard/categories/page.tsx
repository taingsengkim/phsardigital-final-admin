"use client";

import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardHeader } from "@/components/dashboard/header";
import {
  CategoryHierarchy,
  type CategoryTreeNode,
} from "@/components/categories/category-tree";
import {
  CategoryDirectory,
  type CategoryDirectoryItem,
} from "@/components/categories/category-directory";
import { CategoryDetails } from "@/components/categories/category-details";
import { AddCategoryModal } from "@/components/categories/add-category-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { showToast } from "@/components/ui/toast-popup";
import { getApiErrorMessage } from "@/lib/redux/service/api-utils";
import {
  LayoutGridIcon,
  LayersIcon,
  ShoppingBagIcon,
  CheckCircle2Icon,
  PlusIcon,
  SmartphoneIcon,
  CarIcon,
  HomeIcon,
  ShirtIcon,
  BookOpenIcon,
  Gamepad2Icon,
  SparklesIcon,
  FolderIcon,
  UtensilsIcon,
} from "lucide-react";
import type {
  CategoryFormPayload,
  CategoryRecord,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/types/category";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/lib/redux/service/categoryApi";

function getCategoryVisuals(name: string) {
  const normalized = name.toLowerCase();

  if (
    normalized.includes("elect") ||
    normalized.includes("phone") ||
    normalized.includes("tech") ||
    normalized.includes("digital")
  ) {
    return {
      icon: <SmartphoneIcon className="size-4 text-[#6338f6]" />,
      iconBg: "bg-purple-50 border border-purple-100",
    };
  }

  if (
    normalized.includes("vehicle") ||
    normalized.includes("auto") ||
    normalized.includes("car") ||
    normalized.includes("motor")
  ) {
    return {
      icon: <CarIcon className="size-4 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100",
    };
  }

  if (
    normalized.includes("property") ||
    normalized.includes("home") ||
    normalized.includes("real") ||
    normalized.includes("house")
  ) {
    return {
      icon: <HomeIcon className="size-4 text-emerald-600" />,
      iconBg: "bg-emerald-50 border border-emerald-100",
    };
  }

  if (
    normalized.includes("fashion") ||
    normalized.includes("cloth") ||
    normalized.includes("wear") ||
    normalized.includes("apparel")
  ) {
    return {
      icon: <ShirtIcon className="size-4 text-pink-600" />,
      iconBg: "bg-pink-50 border border-pink-100",
    };
  }

  if (
    normalized.includes("book") ||
    normalized.includes("read") ||
    normalized.includes("study")
  ) {
    return {
      icon: <BookOpenIcon className="size-4 text-amber-600" />,
      iconBg: "bg-amber-50 border border-amber-100",
    };
  }

  if (
    normalized.includes("game") ||
    normalized.includes("toy") ||
    normalized.includes("play")
  ) {
    return {
      icon: <Gamepad2Icon className="size-4 text-indigo-600" />,
      iconBg: "bg-indigo-50 border border-indigo-100",
    };
  }

  if (
    normalized.includes("food") ||
    normalized.includes("drink") ||
    normalized.includes("eat")
  ) {
    return {
      icon: <UtensilsIcon className="size-4 text-orange-600" />,
      iconBg: "bg-orange-50 border border-orange-100",
    };
  }

  if (
    normalized.includes("test") ||
    normalized.includes("demo") ||
    normalized.includes("sample")
  ) {
    return {
      icon: <SparklesIcon className="size-4 text-violet-600" />,
      iconBg: "bg-violet-50 border border-violet-100",
    };
  }

  return {
    icon: <FolderIcon className="size-4 text-[#6338f6]" />,
    iconBg: "bg-purple-50/80 border border-purple-100",
  };
}

function flattenCategories(
  categories: CategoryRecord[],
  parentId: string | null = null,
): CategoryRecord[] {
  return categories.flatMap((category) => {
    const currentCategory: CategoryRecord = {
      ...category,
      parentId: category.parentId ?? parentId,
      children: undefined,
    };

    const childCategories = category.children?.length
      ? flattenCategories(category.children, currentCategory.id)
      : [];

    return [currentCategory, ...childCategories];
  });
}

function buildTreeRecursive(categories: CategoryRecord[]): CategoryTreeNode[] {
  const known = new Set(categories.map((c) => c.id));
  const byParent = new Map<string | null, CategoryRecord[]>();
  const roots: CategoryRecord[] = [];

  categories.forEach((category) => {
    if (!category.parentId || !known.has(category.parentId)) {
      roots.push(category);
      return;
    }

    const siblings = byParent.get(category.parentId) ?? [];
    siblings.push(category);
    byParent.set(category.parentId, siblings);
  });

  const buildNodes = (items: CategoryRecord[]): CategoryTreeNode[] =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      icon: getCategoryVisuals(item.name).icon,
      iconUrl: item.iconUrl,
      count: `${item.listingsCount.toLocaleString()} listings`,
      level: item.level,
      status: item.status,
      parentId: item.parentId,
      children: buildNodes(byParent.get(item.id) ?? []),
    }));

  return buildNodes(roots);
}

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCategoriesQuery();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryRecord | null>(null);
  const [presetParentUuid, setPresetParentUuid] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const flattenedCategories = useMemo(
    () => flattenCategories(categories),
    [categories],
  );

  const categoriesById = useMemo(() => {
    const map = new Map<string, CategoryRecord>();
    flattenedCategories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [flattenedCategories]);

  const selectedCategory = selectedCategoryId
    ? (categoriesById.get(selectedCategoryId) ?? null)
    : null;

  const selectedParentCategory = selectedCategory?.parentId
    ? (categoriesById.get(selectedCategory.parentId) ?? null)
    : null;

  const subcategoriesOfSelected = useMemo(() => {
    if (!selectedCategory) return [];
    return flattenedCategories.filter((cat) => cat.parentId === selectedCategory.id);
  }, [flattenedCategories, selectedCategory]);

  const treeNodes = useMemo(
    () => buildTreeRecursive(flattenedCategories),
    [flattenedCategories],
  );

  const directoryItems: CategoryDirectoryItem[] = useMemo(
    () =>
      flattenedCategories.map((category) => {
        const parent = category.parentId ? categoriesById.get(category.parentId) : null;
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          ...getCategoryVisuals(category.name),
          iconUrl: category.iconUrl,
          count: `${category.listingsCount.toLocaleString()} listings`,
          listingsCountRaw: category.listingsCount,
          status: category.status,
          level: category.level,
          sortOrder: category.sortOrder,
          parentId: category.parentId,
          parentName: parent?.name ?? null,
        };
      }),
    [flattenedCategories, categoriesById],
  );

  // Key KPI stats
  const totalCategories = flattenedCategories.length;
  const rootCategoriesCount = flattenedCategories.filter((c) => !c.parentId).length;
  const subcategoriesCount = flattenedCategories.filter((c) => Boolean(c.parentId)).length;
  const activeCategoriesCount = flattenedCategories.filter(
    (c) => c.status.toLowerCase() === "active",
  ).length;
  const totalListings = flattenedCategories.reduce(
    (sum, cat) => sum + (cat.listingsCount || 0),
    0,
  );

  const handleStartCreate = (parentId?: string) => {
    setCategoryToEdit(null);
    setPresetParentUuid(parentId ?? null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (category: CategoryRecord) => {
    setCategoryToEdit(category);
    setPresetParentUuid(null);
    setIsModalOpen(true);
  };

  const handleSaveModalCategory = async (
    payload: CategoryFormPayload,
    editId?: string,
  ) => {
    try {
      if (editId) {
        const updated = await updateCategory({ id: editId, data: payload }).unwrap();
        showToast({
          type: "success",
          title: "Category Updated",
          message: `Category "${payload.name}" was updated successfully.`,
        });
        await refetch();
        return updated;
      }

      const created = await createCategory(payload).unwrap();
      setSelectedCategoryId(created.id);
      showToast({
        type: "success",
        title: "Category Created",
        message: `Category "${payload.name}" was created successfully.`,
      });
      await refetch();
      return created;
    } catch (error: unknown) {
      showToast({
        type: "error",
        title: "Failed to Save Category",
        message: getApiErrorMessage(error, "Could not save category."),
      });
      throw error;
    }
  };

  const promptDeleteCategory = (cat: CategoryRecord) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteById = (id: string) => {
    const target = categoriesById.get(id);
    if (target) {
      promptDeleteCategory(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const slug = categoryToDelete.slug || categoryToDelete.id;
      await deleteCategory(slug).unwrap();
      showToast({
        type: "success",
        title: "Category Deleted",
        message: `Category "${categoryToDelete.name}" was deleted.`,
      });
      if (selectedCategoryId === categoryToDelete.id) {
        setSelectedCategoryId(undefined);
      }
      setCategoryToDelete(null);
      setIsDeleteModalOpen(false);
      await refetch();
    } catch (error: unknown) {
      showToast({
        type: "error",
        title: "Deletion Failed",
        message: getApiErrorMessage(error, "Failed to delete category."),
      });
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader title="Categories Management" />

        <div className="p-4 sm:p-8 space-y-8">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Category & Schema Directory
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Organize the marketplace hierarchy, manage subcategories, and configure specification schemas
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleStartCreate()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#6338f6] hover:bg-[#532edb] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 shrink-0"
            >
              <PlusIcon size={16} /> Add Root Category
            </button>
          </div>

          {isError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center justify-between">
              <span>Failed to load categories from server.</span>
              <button
                className="font-bold underline text-rose-800"
                onClick={() => refetch()}
                type="button"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            <StatsCard
              title="TOTAL CATEGORIES"
              value={isLoading ? "..." : totalCategories}
              icon={LayoutGridIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <StatsCard
              title="ROOT CATEGORIES"
              value={isLoading ? "..." : rootCategoriesCount}
              icon={LayersIcon}
              iconBgColor="bg-white"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="SUBCATEGORIES"
              value={isLoading ? "..." : subcategoriesCount}
              icon={LayersIcon}
              iconBgColor="bg-white"
              iconColor="text-indigo-600"
            />
            <StatsCard
              title="ACTIVE STATUS"
              value={isLoading ? "..." : activeCategoriesCount}
              icon={CheckCircle2Icon}
              iconBgColor="bg-white"
              iconColor="text-emerald-600"
            />
            <StatsCard
              title="TOTAL LISTINGS"
              value={isLoading ? "..." : totalListings.toLocaleString()}
              icon={ShoppingBagIcon}
              iconBgColor="bg-white"
              iconColor="text-amber-600"
            />
          </div>

          {/* Main 2-Column / 3-Column Content Layout */}
          <div
            className={`grid grid-cols-1 gap-8 ${
              selectedCategory ? "xl:grid-cols-12" : "lg:grid-cols-12"
            }`}
          >
            {/* Left Column: Hierarchy Tree */}
            <div className={selectedCategory ? "xl:col-span-4" : "lg:col-span-4"}>
              <div className="sticky top-6">
                <CategoryHierarchy
                  nodes={treeNodes}
                  selectedId={selectedCategory?.id}
                  onSelect={(id) => setSelectedCategoryId(id)}
                  onAddSubcategory={(parentId) => handleStartCreate(parentId)}
                  onEdit={handleDeleteById}
                  onDelete={handleDeleteById}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Middle Column: Category Directory Table */}
            <div
              className={
                selectedCategory ? "xl:col-span-8 space-y-8" : "lg:col-span-8 space-y-8"
              }
            >
              <CategoryDirectory
                categories={directoryItems}
                selectedId={selectedCategory?.id}
                onSelect={(id) => setSelectedCategoryId(id)}
                onEdit={(id) => {
                  const target = categoriesById.get(id);
                  if (target) handleStartEdit(target);
                }}
                onDelete={handleDeleteById}
                onAddSubcategory={(parentId) => handleStartCreate(parentId)}
                onStartCreate={() => handleStartCreate()}
                isLoading={isLoading}
              />

              {/* Selected Category Details & Attributes Section */}
              {selectedCategory && (
                <div className="pt-2">
                  <CategoryDetails
                    category={selectedCategory}
                    parentCategory={selectedParentCategory}
                    subcategories={subcategoriesOfSelected}
                    onSelectCategory={(id) => setSelectedCategoryId(id)}
                    onStartEdit={(cat) => handleStartEdit(cat)}
                    onStartDelete={(cat) => promptDeleteCategory(cat)}
                    onAddSubcategory={(parentId) => handleStartCreate(parentId)}
                    onClose={() => setSelectedCategoryId(undefined)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Category Modal */}
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCategoryToEdit(null);
            setPresetParentUuid(null);
          }}
          categoryToEdit={categoryToEdit}
          presetParentUuid={presetParentUuid}
          availableCategories={flattenedCategories}
          isSubmitting={isCreating || isUpdating}
          onSubmit={handleSaveModalCategory}
        />

        {/* Delete Category Confirmation Modal */}
        <ConfirmModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete?.name}"? The category will be soft-deleted and removed from active marketplace listings.`}
          confirmText="Delete Category"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
