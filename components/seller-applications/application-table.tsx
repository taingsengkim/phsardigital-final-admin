import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, FilterIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const applications = [
  {
    id: "APP-2401",
    name: "Dara Kim",
    email: "dara.kim@gmail.com",
    avatar: "/avatars/dara.jpg",
    businessName: "Tech Store Cambodia",
    plan: "Pro Plan",
    planColor: "text-purple-600 bg-purple-50",
    appliedOn: "May 18, 2025",
    appliedAt: "10:30 AM",
    selected: true,
  },
  {
    id: "APP-2402",
    name: "Sokchea Nhem",
    email: "sokchea@gmail.com",
    avatar: "/avatars/sokchea.jpg",
    businessName: "Phone World",
    plan: "Business Plan",
    planColor: "text-amber-600 bg-amber-50",
    appliedOn: "May 17, 2025",
    appliedAt: "08:15 AM",
  },
  {
    id: "APP-2403",
    name: "Visal Keo",
    email: "visal.keo@gmail.com",
    avatar: "/avatars/visal.jpg",
    businessName: "Fashion Hub",
    plan: "Pro Plan",
    planColor: "text-purple-600 bg-purple-50",
    appliedOn: "May 15, 2025",
    appliedAt: "11:20 AM",
  },
  {
    id: "APP-2404",
    name: "Thyda Marady",
    email: "marady.thyda@gmail.com",
    avatar: "/avatars/thyda.jpg",
    businessName: "Siem Reap Property",
    plan: "Pro Plan",
    planColor: "text-purple-600 bg-purple-50",
    appliedOn: "May 12, 2025",
    appliedAt: "03:10 PM",
  },
]

export function ApplicationTable() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <Input 
            placeholder="Search by name, email or phone..." 
            className="pl-10 bg-gray-50 border-none rounded-xl h-11"
          />
        </div>
        
        <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 font-semibold flex items-center gap-2">
          <FilterIcon size={16} />
          Filters
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="p-6 w-12">
                <input type="checkbox" className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]" />
              </th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Applicant</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Business Name</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Plan</th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Applied On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map((app) => (
              <tr 
                key={app.id} 
                className={app.selected ? "bg-blue-50/30" : "hover:bg-gray-50 transition-colors cursor-pointer"}
              >
                <td className="p-6">
                  <input 
                    type="checkbox" 
                    checked={app.selected}
                    readOnly
                    className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]" 
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={app.avatar} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                        {app.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{app.name}</p>
                      <p className="text-[10px] text-gray-400">{app.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-900 font-medium">{app.businessName}</td>
                <td className="p-6">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${app.planColor}`}>
                    {app.plan}
                  </span>
                </td>
                <td className="p-6">
                  <p className="text-sm text-gray-900 font-medium">{app.appliedOn}</p>
                  <p className="text-[10px] text-gray-400">{app.appliedAt}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 flex items-center justify-between border-t border-gray-50">
        <p className="text-sm text-gray-400">
          Showing <span className="text-gray-900 font-medium">1 to 10</span> of <span className="text-gray-900 font-medium">78</span> applications
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
            8
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
