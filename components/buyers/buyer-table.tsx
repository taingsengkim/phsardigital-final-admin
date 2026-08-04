"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon } from "lucide-react"
import type { BuyerRecord } from "@/lib/features/marketplace/marketplaceApi"

interface BuyerTableProps {
  buyers: BuyerRecord[]
  isLoading?: boolean
}

export function BuyerTable({ buyers, isLoading }: BuyerTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="p-6 w-12">
                <input type="checkbox" className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]" />
              </th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Buyer</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && buyers.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-sm text-gray-400">
                  Loading buyers...
                </td>
              </tr>
            ) : buyers.length ? buyers.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <input 
                    type="checkbox" 
                    checked={Boolean(buyer.selected)}
                    readOnly
                    className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]" 
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={buyer.avatar} />
                      <AvatarFallback>{buyer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{buyer.name}</p>
                      <p className="text-[10px] text-gray-400">{buyer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-500">{buyer.email}</td>
                <td className="p-6 text-sm text-gray-500">{buyer.phone}</td>
                <td className="p-6">
                  <Badge 
                    variant={
                      buyer.status === "ACTIVE" ? "success" : 
                      buyer.status === "SUSPENDED" ? "warning" : "error"
                    }
                    className="font-bold text-[10px]"
                  >
                    • {buyer.status}
                  </Badge>
                </td>
                <td className="p-6">
                  <p className="text-sm text-gray-900">{buyer.joinDate}</p>
                  {buyer.joinTime && <p className="text-[10px] text-gray-400">{buyer.joinTime}</p>}
                </td>
                <td className="p-6 text-sm text-gray-900 font-medium">{buyer.totalOrders}</td>
                <td className="p-6 text-sm text-gray-900 font-bold">{buyer.totalSpent}</td>
                <td className="p-6 text-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontalIcon size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="p-6 text-sm text-gray-400">
                  No buyers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 flex items-center justify-between border-t border-gray-50">
        <p className="text-sm text-gray-400">
          Showing <span className="text-gray-900 font-medium">1 to {Math.min(10, buyers.length || 10)}</span> of <span className="text-gray-900 font-medium">{buyers.length.toLocaleString()}</span> buyers
        </p>
        
        <div className="flex items-center gap-2">
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
            &lt;
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center bg-[#6338f6] text-white font-bold text-sm">
            1
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 font-medium text-sm">
            2
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 font-medium text-sm">
            3
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 font-medium text-sm">
            4
          </button>
          <span className="text-gray-400 px-1">...</span>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 font-medium text-sm">
            2440
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
