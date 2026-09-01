"use client"

import { useState, useMemo } from "react"
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SearchIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  FolderIcon,
  FolderOpenIcon,
  SparklesIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export interface CategoryTreeNode {
  id: string
  name: string
  slug: string
  icon?: React.ReactNode
  iconUrl?: string | null
  count: string
  level: number
  status: string
  parentId: string | null
  children?: CategoryTreeNode[]
}

interface CategoryHierarchyProps {
  nodes: CategoryTreeNode[]
  selectedId?: string
  onSelect?: (id: string) => void
  onAddSubcategory?: (parentId: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

interface TreeNodeItemProps {
  node: CategoryTreeNode
  depth: number
  selectedId?: string
  expandedIds: Set<string>
  onToggle: (id: string) => void
  onSelect?: (id: string) => void
  onAddSubcategory?: (parentId: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  searchFilter: string
}

function TreeNodeItem({
  node,
  depth,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
  onAddSubcategory,
  onEdit,
  onDelete,
  searchFilter,
}: TreeNodeItemProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const isExpanded = expandedIds.has(node.id) || searchFilter.trim().length > 0
  const isSelected = selectedId === node.id
  const isActive = node.status.toLowerCase() === "active"

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "group relative flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-150 select-none border border-transparent",
          isSelected
            ? "bg-[#f4f0ff] border-purple-200/80 shadow-xs ring-1 ring-[#6338f6]/30 text-gray-900"
            : "hover:bg-gray-50/90 text-gray-700 hover:text-gray-900"
        )}
        style={{ marginLeft: `${depth * 18}px` }}
        onClick={() => onSelect?.(node.id)}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Expand/Collapse Chevron */}
          <button
            type="button"
            className={cn(
              "size-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 transition-colors shrink-0",
              !hasChildren && "invisible pointer-events-none"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? <ChevronDownIcon size={15} /> : <ChevronRightIcon size={15} />}
          </button>

          {/* Category Icon */}
          <div className="size-7 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-center overflow-hidden shrink-0">
            {node.iconUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={node.iconUrl} alt={node.name} className="size-full object-contain p-0.5" />
            ) : hasChildren ? (
              isExpanded ? (
                <FolderOpenIcon size={14} className="text-[#6338f6]" />
              ) : (
                <FolderIcon size={14} className="text-[#6338f6]" />
              )
            ) : (
              node.icon || <SparklesIcon size={14} className="text-[#6338f6]" />
            )}
          </div>

          {/* Category Title & Level */}
          <div className="min-w-0 flex items-center gap-2 flex-1">
            <span className="font-bold text-xs sm:text-sm truncate text-gray-900">
              {node.name}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 font-mono hidden sm:inline-block truncate">
              /{node.slug}
            </span>
            {!isActive && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-gray-100 text-gray-500">
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-[11px] font-medium text-gray-400 group-hover:hidden transition-all">
            {node.count}
          </span>

          {/* Hover Action Buttons */}
          <div className="hidden group-hover:flex items-center gap-1">
            {onAddSubcategory && (
              <button
                type="button"
                title="Add Subcategory"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddSubcategory(node.id)
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-[#6338f6] hover:bg-purple-100/70 transition-colors"
              >
                <PlusIcon size={14} />
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                title="Edit Category"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(node.id)
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-[#6338f6] hover:bg-purple-100/70 transition-colors"
              >
                <PencilIcon size={13} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                title="Delete Category"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(node.id)
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2Icon size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div className="relative pl-2 border-l border-purple-100/80 ml-4 space-y-1">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
              onAddSubcategory={onAddSubcategory}
              onEdit={onEdit}
              onDelete={onDelete}
              searchFilter={searchFilter}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function collectAllNodeIds(nodes: CategoryTreeNode[]): string[] {
  const ids: string[] = []
  const traverse = (items: CategoryTreeNode[]) => {
    for (const item of items) {
      ids.push(item.id)
      if (item.children?.length) {
        traverse(item.children)
      }
    }
  }
  traverse(nodes)
  return ids
}

function filterTree(nodes: CategoryTreeNode[], query: string): CategoryTreeNode[] {
  if (!query.trim()) return nodes

  const lower = query.toLowerCase()

  const filterNodes = (items: CategoryTreeNode[]): CategoryTreeNode[] => {
    const result: CategoryTreeNode[] = []

    for (const item of items) {
      const matchSelf =
        item.name.toLowerCase().includes(lower) || item.slug.toLowerCase().includes(lower)
      const matchingChildren = item.children?.length ? filterNodes(item.children) : []

      if (matchSelf || matchingChildren.length > 0) {
        result.push({
          ...item,
          children: matchingChildren.length > 0 ? matchingChildren : item.children,
        })
      }
    }

    return result
  }

  return filterNodes(nodes)
}

export function CategoryHierarchy({
  nodes,
  selectedId,
  onSelect,
  onAddSubcategory,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryHierarchyProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    nodes.forEach((n) => {
      if (n.children?.length) initial.add(n.id)
    })
    return initial
  })
  const [search, setSearch] = useState("")

  const filteredNodes = useMemo(() => filterTree(nodes, search), [nodes, search])
  const allIds = useMemo(() => collectAllNodeIds(nodes), [nodes])

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleExpandAll = () => {
    setExpandedIds(new Set(allIds))
  }

  const handleCollapseAll = () => {
    setExpandedIds(new Set())
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-purple-50 text-[#6338f6] flex items-center justify-center">
            <FolderTreeIcon size={16} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 leading-tight">Hierarchy Tree</h4>
            <p className="text-[11px] text-gray-400 font-medium">
              Explore categories & subcategories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExpandAll}
            className="text-[11px] font-bold text-gray-500 hover:text-[#6338f6] px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Expand All
          </button>
          <span className="text-gray-200">•</span>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="text-[11px] font-bold text-gray-500 hover:text-[#6338f6] px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tree by name or slug..."
          className="pl-9 h-9 rounded-xl text-xs bg-gray-50/80 border-gray-200/80 font-medium focus:ring-2 focus:ring-[#6338f6]/20"
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

      {/* Tree Content */}
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
        {isLoading && nodes.length === 0 ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 rounded-xl bg-gray-100/70 animate-pulse" />
            ))}
          </div>
        ) : filteredNodes.length > 0 ? (
          filteredNodes.map((node) => (
            <TreeNodeItem
              key={node.id}
              node={node}
              depth={0}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={handleToggle}
              onSelect={onSelect}
              onAddSubcategory={onAddSubcategory}
              onEdit={onEdit}
              onDelete={onDelete}
              searchFilter={search}
            />
          ))
        ) : (
          <div className="py-8 text-center text-xs text-gray-400 font-medium">
            {search ? "No categories matching your filter." : "No categories created yet."}
          </div>
        )}
      </div>
    </div>
  )
}

function FolderTreeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
      <path d="M4 21a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h2.5a1 1 0 0 0 .8-.4l.9-1.2A1 1 0 0 1 9 12h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1Z" />
      <path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 14h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
    </svg>
  )
}
