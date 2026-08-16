"use client"

import { SearchIcon, ArrowUpDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Purchase } from "@/lib/types/purchase"

interface PurchaseTableProps {
  purchases: Purchase[]
  selectedId: string | null
  isLoading?: boolean
  onSelect: (purchase: Purchase) => void
}

export function PurchaseTable({ purchases, selectedId, isLoading, onSelect }: PurchaseTableProps) {
  const getStatusVariant = (status: string): React.ComponentProps<typeof Badge>["variant"] => {
    switch (status) {
      case 'Shipped': return 'info'
      case 'Processing': return 'warning'
      case 'Delivered': return 'success'
      case 'Cancelled': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <Input 
            placeholder="Search by Order ID, Buyer, or Item" 
            className="pl-10 bg-gray-50 border-none rounded-xl h-10"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-1 cursor-pointer">
                  Order ID <ArrowUpDownIcon size={10} />
                </div>
              </th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && purchases.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-sm text-gray-400">Loading purchases...</td></tr>
            ) : purchases.length === 0 ? (
              <tr><td colSpan={8} className="p-6 text-sm text-gray-400">No purchases found.</td></tr>
            ) : purchases.map((order) => (
              <tr 
                key={order.id}
                onClick={() => onSelect(order)}
                className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group ${selectedId === order.id ? "bg-purple-50/40" : ""}`}
              >
                <td className="p-6 text-xs font-bold text-gray-900 group-hover:text-[#6338f6]">{order.id}</td>
                <td className="p-6 text-xs text-gray-500">{order.item}</td>
                <td className="p-6 text-xs text-gray-500">{order.buyer}</td>
                <td className="p-6 text-xs text-gray-400 leading-tight max-w-[120px]">
                  {order.seller}
                </td>
                <td className="p-6 text-xs font-bold text-gray-900">{order.total}</td>
                <td className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.method}</td>
                <td className="p-6">
                  <Badge 
                    variant={getStatusVariant(order.status)}
                    className="rounded-lg text-[10px] px-3 py-1 font-bold shadow-sm"
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="p-6 text-xs text-gray-400">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
