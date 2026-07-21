import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontalIcon } from "lucide-react"

const buyers = [
  {
    id: "B-10001",
    name: "Dara Kim",
    email: "dara.kim@gmail.com",
    phone: "+855 12 345 678",
    status: "ACTIVE",
    joinDate: "May 18, 2025",
    joinTime: "10:30 AM",
    totalOrders: 12,
    totalSpent: "$1,240.50",
    avatar: "/avatars/dara.jpg",
    selected: true,
  },
  {
    id: "B-10002",
    name: "Sokchea Nhem",
    email: "sokchea@gmail.com",
    phone: "+855 10 987 654",
    status: "ACTIVE",
    joinDate: "May 17, 2025",
    totalOrders: 8,
    totalSpent: "$880.00",
    avatar: "/avatars/sokchea.jpg",
  },
  {
    id: "B-10004",
    name: "Visal Keo",
    email: "visal.keo@gmail.com",
    phone: "+855 12 654 321",
    status: "SUSPENDED",
    joinDate: "May 15, 2025",
    totalOrders: 3,
    totalSpent: "$210.30",
    avatar: "/avatars/visal.jpg",
  },
  {
    id: "B-10005",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
  // Adding more mock data to match the image
  {
    id: "B-10006",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
  {
    id: "B-10007",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
  {
    id: "B-10008",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
  {
    id: "B-10009",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
  {
    id: "B-10010",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
  {
    id: "B-10011",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    phone: "+855 97 765 432",
    status: "BANNED",
    joinDate: "May 12, 2025",
    totalOrders: 0,
    totalSpent: "$0.00",
    avatar: "/avatars/thyda.jpg",
  },
]

export function BuyerTable() {
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
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <input 
                    type="checkbox" 
                    checked={buyer.selected}
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
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 flex items-center justify-between border-t border-gray-50">
        <p className="text-sm text-gray-400">
          Showing <span className="text-gray-900 font-medium">1 to 10</span> of <span className="text-gray-900 font-medium">24,385</span> buyers
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
