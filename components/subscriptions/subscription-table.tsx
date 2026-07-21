import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontalIcon, SearchIcon, FilterIcon, DownloadIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const subscriptions = [
  {
    id: "S-1001",
    store: "Tech Store Cambodia",
    email: "techstore@gmail.com",
    avatar: "/avatars/tech-store.jpg",
    plan: "Pro Plan",
    planColor: "text-purple-600 bg-purple-50",
    status: "Active",
    startDate: "Apr 18, 2025",
    nextBilling: "May 18, 2025",
    remaining: "in 10 days",
    amount: "$9.99",
    autoRenew: true,
  },
  {
    id: "S-1002",
    store: "Phone World",
    email: "phoneworld@gmail.com",
    avatar: "/avatars/phone-world.jpg",
    plan: "Business Plan",
    planColor: "text-amber-600 bg-amber-50",
    status: "Active",
    startDate: "Apr 10, 2025",
    nextBilling: "May 10, 2025",
    remaining: "in 2 days",
    amount: "$24.99",
    autoRenew: true,
  },
  {
    id: "S-1003",
    store: "Home Comforts",
    email: "comforts@gmail.com",
    avatar: "/avatars/home-comforts.jpg",
    plan: "Pro Plan",
    planColor: "text-purple-600 bg-purple-50",
    status: "Active",
    startDate: "Apr 5, 2025",
    nextBilling: "May 05, 2025",
    remaining: "in 5 days",
    amount: "$9.99",
    autoRenew: true,
  },
  {
    id: "S-1004",
    store: "Fashion Hub",
    email: "fashionhub@gmail.com",
    avatar: "/avatars/fashion-hub.jpg",
    plan: "Basic Plan",
    planColor: "text-blue-600 bg-blue-50",
    status: "Active",
    startDate: "Apr 20, 2025",
    nextBilling: "May 20, 2025",
    remaining: "in 12 days",
    amount: "$0.00",
    autoRenew: false,
  },
  {
    id: "S-1005",
    store: "Motor King",
    email: "motorking@gmail.com",
    avatar: "/avatars/motor-king.jpg",
    plan: "Business Plan",
    planColor: "text-amber-600 bg-amber-50",
    status: "Expiring Soon",
    startDate: "Mar 21, 2025",
    nextBilling: "Apr 21, 2025",
    remaining: "Expires today",
    amount: "$24.99",
    autoRenew: true,
  },
]

const tabs = [
  { name: "All", count: 326, active: true },
  { name: "Active", count: 245 },
  { name: "Expiring Soon", count: 28 },
  { name: "Expired", count: 38 },
  { name: "Cancelled", count: 15 },
]

export function SubscriptionTable() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <h4 className="text-lg font-bold mr-4 whitespace-nowrap">All Subscriptions</h4>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                tab.active 
                  ? "bg-[#6338f6] text-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.name}
              <span className={`text-[10px] ${tab.active ? "text-white/70" : "text-gray-400"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <Input 
              placeholder="Search by seller or email..." 
              className="pl-10 bg-gray-50 border-none rounded-xl h-10 w-64"
            />
          </div>
          <Button variant="outline" className="rounded-xl border-gray-200 h-10 flex items-center gap-2 font-semibold">
            <FilterIcon size={16} />
            Filters
          </Button>
          <Button variant="outline" className="rounded-xl border-gray-200 h-10 flex items-center gap-2 font-semibold">
            <DownloadIcon size={16} />
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seller / Store</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Next Billing</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auto Renew</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 rounded-xl">
                      <AvatarImage src={sub.avatar} />
                      <AvatarFallback className="bg-amber-100 text-amber-700 rounded-xl font-bold">
                        {sub.store.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{sub.store}</p>
                      <p className="text-[10px] text-gray-400">{sub.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${sub.planColor}`}>
                    {sub.plan}
                  </span>
                </td>
                <td className="p-6">
                  <Badge 
                    variant={sub.status === "Active" ? "success" : "warning"}
                    className="font-bold text-[10px] py-0 h-5"
                  >
                    • {sub.status}
                  </Badge>
                </td>
                <td className="p-6 text-sm text-gray-900 font-medium">{sub.startDate}</td>
                <td className="p-6">
                  <p className="text-sm text-gray-900 font-medium">{sub.nextBilling}</p>
                  <p className={`text-[10px] ${sub.remaining.includes('Expires today') ? 'text-rose-500 font-bold' : 'text-emerald-500 font-medium'}`}>
                    {sub.remaining}
                  </p>
                </td>
                <td className="p-6 text-sm text-gray-900 font-bold">{sub.amount}</td>
                <td className="p-6">
                  {sub.amount !== "$0.00" ? (
                    <Switch defaultChecked={sub.autoRenew} />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
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
          Showing <span className="text-gray-900 font-medium">1 to 8</span> of <span className="text-gray-900 font-medium">326</span> subscriptions
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
          <span className="text-gray-400 px-1">...</span>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 font-medium text-sm">
            41
          </button>
          <button className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
