"use client"

import { FilterIcon, DownloadIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const history = [
  {
    id: 1,
    date: "Oct 24, 2023",
    time: "02:30 PM",
    title: "New Seller Policy Update",
    target: "Sellers",
    status: "SENT",
    performance: 65,
  },
  {
    id: 2,
    date: "Oct 26, 2023",
    time: "09:00 AM",
    title: "Weekend Flash Sale",
    target: "All Buyers",
    status: "SCHEDULED",
    performance: 0,
  },
]

export function NotificationHistory() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900">Sent Notifications History</h4>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
            <FilterIcon size={18} />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
            <DownloadIcon size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date & Time</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Audience</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-gray-900">{item.date}</p>
                  <p className="text-[10px] font-medium text-gray-400 uppercase">{item.time}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-gray-900">{item.title}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.target}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <Badge 
                    variant={item.status === 'SENT' ? 'success' : 'info'} 
                    className="rounded-lg px-3 py-1 text-[10px] font-bold"
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="px-8 py-6">
                  {item.status === 'SENT' ? (
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#6338f6] rounded-full" 
                          style={{ width: `${item.performance}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">{item.performance}% Open</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-medium text-gray-400">Awaiting dispatch</span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
                    <MoreVerticalIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-50 flex items-center justify-between">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Showing 1-10 of 1,240 notifications</p>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
            <ChevronLeftIcon size={16} />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
