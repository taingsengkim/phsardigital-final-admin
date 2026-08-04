"use client"

import { ChevronDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ListingRecord } from "@/lib/features/marketplace/marketplaceApi"

interface ListingModerationTableProps {
  listings: ListingRecord[]
  isLoading?: boolean
  selectedListingId?: string | null
  onSelectListing?: (listingId: string) => void
}

export function ListingModerationTable({ listings, isLoading, selectedListingId, onSelectListing }: ListingModerationTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold text-gray-900">Active Listings Monitor</h4>
          <p className="text-sm text-gray-500">Monitoring all active marketplace listings for policy compliance.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
              <span className="text-xs font-bold text-gray-600">All Categories</span>
              <ChevronDownIcon size={14} className="text-gray-400" />
           </div>
           <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
              <span className="text-xs font-bold text-gray-600">Filter by Seller...</span>
              <ChevronDownIcon size={14} className="text-gray-400" />
           </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && listings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-sm text-gray-400">
                  Loading listings...
                </td>
              </tr>
            ) : listings.length ? listings.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectListing?.(item.id)}
                className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer ${selectedListingId === item.id ? "bg-gray-50/70" : ""}`}
              >
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 shrink-0 rounded-xl bg-gray-100 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gray-900/5 group-hover:bg-transparent transition-colors" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{item.name}</p>
                      <p className="text-[10px] font-medium text-gray-400">{item.status}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-bold text-gray-700">{item.seller}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-medium text-gray-500">{item.category}</span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs font-bold text-[#6338f6]">{item.price}</span>
                </td>
                <td className="px-8 py-4 text-xs font-medium text-gray-500">
                  {item.submitted}
                </td>
                <td className="px-8 py-4 text-right">
                  <Badge variant={item.live ? "success" : "warning"} className="rounded-lg px-3 py-1 text-[10px]">
                    {item.live ? "Live" : "Hidden"}
                  </Badge>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-sm text-gray-400">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">Showing 1-{Math.min(10, listings.length || 10)} of {listings.length.toLocaleString()}</p>
        <div className="flex items-center gap-2">
          <button className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors">&lt;</button>
          <button className="size-8 rounded-lg flex items-center justify-center bg-[#6338f6] text-white text-xs font-bold">1</button>
          <button className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors">2</button>
          <button className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors">3</button>
          <button className="size-8 rounded-lg flex items-center justify-center border border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors">&gt;</button>
        </div>
      </div>
    </div>
  )
}
