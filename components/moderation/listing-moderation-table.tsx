"use client"

import { SearchIcon, ChevronDownIcon, MoreVerticalIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const listings = [
  { id: 1, name: "iPhone 15 Pro Max", status: "Flagged for Review", seller: "Apple Center KH", category: "Electronics", price: "$1,150.00", submitted: "2m ago", live: true },
  { id: 2, name: "Luxury Condo BKK1", status: "Flagged for Review", seller: "Urban Living Co.", category: "Real Estate", price: "$245,000", submitted: "15m ago", live: true },
  { id: 3, name: "BMW M4 Competition", status: "Flagged for Review", seller: "Sok Auto Imports", category: "Automotive", price: "$128,000", submitted: "42m ago", live: true },
  { id: 4, name: "Limited Nike SB Dunk", status: "Flagged for Review", seller: "Sole Hunter", category: "Fashion", price: "$450.00", submitted: "1h ago", live: true },
  { id: 5, name: "Samsung Galaxy S24 U", status: "Flagged for Review", seller: "Global Tech", category: "Electronics", price: "$1,099.00", submitted: "2h ago", live: true },
  { id: 6, name: "Modern Office Desk", status: "Flagged for Review", seller: "WorkSpace Pro", category: "Furniture", price: "$350.00", submitted: "3h ago", live: true },
  { id: 7, name: "Sony WH-1000XM5", status: "Flagged for Review", seller: "Sound & Vision", category: "Electronics", price: "$399.00", submitted: "4h ago", live: true },
  { id: 8, name: "Professional DSLR Cam", status: "Flagged for Review", seller: "Focus Studio", category: "Photography", price: "$2,100.00", submitted: "5h ago", live: true },
  { id: 9, name: "Men's Leather Boots", status: "Flagged for Review", seller: "Urban Style", category: "Fashion", price: "$145.00", submitted: "6h ago", live: true },
  { id: 10, name: "Electric Scooter X1", status: "Flagged for Review", seller: "EcoDrive KH", category: "Vehicles", price: "$850.00", submitted: "7h ago", live: true },
]

export function ListingModerationTable() {
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
            {listings.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-gray-900/5 group-hover:bg-transparent transition-colors" />
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
                  <Badge variant="success" className="rounded-lg px-3 py-1 text-[10px]">Live</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">Showing 1-10 of 184</p>
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
