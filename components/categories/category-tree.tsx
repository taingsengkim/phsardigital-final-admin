"use client"

import { useState } from "react"
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SmartphoneIcon, 
  CarIcon, 
  HomeIcon,
  LaptopIcon,
  TabletIcon,
  SmartphoneIcon as PhoneIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface CategoryTreeNode {
  id: string
  name: string
  icon: React.ReactNode
  count: string
  children?: CategoryTreeNode[]
}

interface CategoryHierarchyProps {
  nodes: CategoryTreeNode[]
  selectedId?: string
  onSelect?: (id: string) => void
}

const treeData = [
  {
    id: "electronics",
    name: "Electronics",
    icon: <SmartphoneIcon size={18} className="text-[#6338f6]" />,
    count: "5,894 listings",
    children: [
      { id: "phones", name: "Phones", icon: <PhoneIcon size={16} /> },
      { id: "laptops", name: "Laptops", icon: <LaptopIcon size={16} /> },
      { id: "tablets", name: "Tablets", icon: <TabletIcon size={16} /> },
    ]
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: <CarIcon size={18} className="text-[#6338f6]" />,
    count: "2,412 listings",
  },
  {
    id: "property",
    name: "Property",
    icon: <HomeIcon size={18} className="text-[#6338f6]" />,
    count: "1,890 listings",
  },
]

export function CategoryHierarchy({ nodes, selectedId, onSelect }: CategoryHierarchyProps) {
  const [expanded, setExpanded] = useState<string[]>(() =>
    nodes.filter((node) => node.children?.length).map((node) => node.id)
  )

  const sourceNodes = nodes.length ? nodes : treeData

  const expandAll = () => {
    setExpanded(sourceNodes.filter((node) => node.children?.length).map((node) => node.id))
  }

  const toggle = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const [showTree, setShowTree] = useState(false)

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <div className={cn("flex items-center justify-between", showTree && "mb-6")}>
        <h4 className="font-bold text-gray-900">Hierarchy Tree</h4>
        <div className="flex items-center gap-4">
          {showTree && (
            <button className="text-xs font-semibold text-gray-500 hover:underline" type="button" onClick={expandAll}>
              Expand All
            </button>
          )}
          <button 
            className="text-xs font-semibold text-[#6338f6] hover:underline bg-purple-50 px-3 py-1.5 rounded-lg transition-colors" 
            type="button" 
            onClick={() => setShowTree(!showTree)}
          >
            {showTree ? "Hide Tree" : "Show Tree"}
          </button>
        </div>
      </div>
      
      {showTree && (
        <div className="space-y-4">
        {sourceNodes.map((node) => (
          <div key={node.id} className="space-y-2">
            <div 
              className={cn(
                "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                selectedId === node.id
                  ? "bg-[#f8f7ff] ring-1 ring-[#6338f6]/10"
                  : expanded.includes(node.id)
                    ? "bg-[#f8f7ff]"
                    : "hover:bg-gray-50"
              )}
              onClick={() => {
                if (node.children?.length) {
                  toggle(node.id)
                }

                onSelect?.(node.id)
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-400">
                  {node.children ? (
                    expanded.includes(node.id) ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />
                  ) : (
                    <ChevronRightIcon size={16} className="opacity-50" />
                  )}
                </div>
                {node.icon}
                <span className="font-bold text-sm text-gray-900">{node.name}</span>
              </div>
              <span className="text-xs text-gray-400">{node.count}</span>
            </div>
            
            {node.children && expanded.includes(node.id) && (
              <div className="ml-12 space-y-2 border-l border-gray-100 pl-4">
                {node.children.map((child) => (
                  <div
                    key={child.id}
                    className={cn(
                      "flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer",
                      selectedId === child.id && "bg-[#f8f7ff]"
                    )}
                    onClick={() => onSelect?.(child.id)}
                  >
                    <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                      {child.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{child.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  )
}
