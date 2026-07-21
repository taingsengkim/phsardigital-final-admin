import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BadgeCheckIcon,
  BanIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StoreIcon,
} from "lucide-react"

const sellers = [
  {
    id: "S-10001",
    name: "Tech Store Cambodia",
    store: "techstore",
    email: "techstore@gmail.com",
    phone: "+855 12 456 678",
    verification: "Verified Pro",
    plan: "Business",
    listings: 120,
    rating: 4.8,
    reviews: 38,
    sales: "$8,450.75",
    status: "ACTIVE",
    avatar: "/avatars/admin.jpg",
    selected: true,
  },
  {
    id: "S-10002",
    name: "Phone World",
    store: "phoneworld",
    email: "phoneworld@gmail.com",
    phone: "+855 10 987 654",
    verification: "Verified Pro",
    plan: "Pro",
    listings: 85,
    rating: 4.6,
    reviews: 14,
    sales: "$6,215.40",
    status: "ACTIVE",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10003",
    name: "Siem Reap Property",
    store: "srproperty",
    email: "srproperty@gmail.com",
    phone: "+855 17 765 432",
    verification: "Pending",
    plan: "Basic",
    listings: 18,
    rating: null,
    reviews: null,
    sales: "$0.00",
    status: "PENDING",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10004",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10005",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10006",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10007",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10008",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10009",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
  {
    id: "S-10010",
    name: "Creative Stuff",
    store: "#S-10008",
    email: "creativestuff@gmail.com",
    phone: "+855 15 777 888",
    verification: "Suspended",
    plan: "Pro",
    listings: 30,
    rating: 2.6,
    reviews: 8,
    sales: "$120.00",
    status: "SUSPENDED",
    avatar: "/avatars/admin.jpg",
  },
]

function SellerFilters() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-130">
        <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by seller name, store name or email..."
          className="h-12 rounded-2xl border-none bg-gray-50 pl-11 shadow-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        <button className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
          <span>All Verification</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </button>
        <button className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
          <span>All Plans</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </button>
        <button className="flex h-11 items-center gap-2 rounded-xl bg-gray-50 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
          <span>All Join Dates</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </button>
        <Button variant="outline" className="h-11 rounded-xl border-gray-200 px-5 font-semibold">
          <FilterIcon size={16} />
          Filters
        </Button>
      </div>
    </div>
  )
}

function SellerTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="w-12 p-6">
                <input type="checkbox" className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]" />
              </th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Seller / Store</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Email / Phone</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Verification</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Plan</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Listings</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Rating</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Sales (30d)</th>
              <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
              <th className="p-6 text-center text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sellers.map((seller) => (
              <tr key={seller.id} className="transition-colors hover:bg-gray-50/80">
                <td className="p-6">
                  <input
                    type="checkbox"
                    defaultChecked={seller.selected}
                    className="size-4 rounded border-gray-300 text-[#6338f6] focus:ring-[#6338f6]"
                  />
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={seller.avatar} />
                      <AvatarFallback>{seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{seller.name}</p>
                      <p className="text-[10px] text-gray-400">{seller.store}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm text-gray-500">{seller.email}</p>
                  <p className="text-xs text-gray-400">{seller.phone}</p>
                </td>
                <td className="p-6">
                  {seller.verification === "Verified Pro" ? (
                    <Badge variant="success" className="gap-1.5 font-bold text-[10px]">
                      <BadgeCheckIcon className="size-3.5" />
                      {seller.verification}
                    </Badge>
                  ) : seller.verification === "Pending" ? (
                    <Badge variant="warning" className="gap-1.5 font-bold text-[10px]">
                      <AlertCircleIcon className="size-3.5" />
                      {seller.verification}
                    </Badge>
                  ) : (
                    <Badge variant="error" className="gap-1.5 font-bold text-[10px]">
                      <BanIcon className="size-3.5" />
                      {seller.verification}
                    </Badge>
                  )}
                </td>
                <td className="p-6">
                  <Badge variant="outline" className="rounded-full border-0 bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-600">
                    {seller.plan}
                  </Badge>
                </td>
                <td className="p-6 text-sm font-medium text-gray-900">{seller.listings}</td>
                <td className="p-6">
                  {seller.rating ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                      <span className="text-amber-400">★</span>
                      <span>{seller.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({seller.reviews})</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-- (0)</span>
                  )}
                </td>
                <td className="p-6 text-sm font-semibold text-gray-900">{seller.sales}</td>
                <td className="p-6">
                  {seller.status === "ACTIVE" ? (
                    <Badge variant="success" className="text-[10px] font-bold">ACTIVE</Badge>
                  ) : seller.status === "PENDING" ? (
                    <Badge variant="warning" className="text-[10px] font-bold">PENDING</Badge>
                  ) : (
                    <Badge variant="error" className="text-[10px] font-bold">SUSPENDED</Badge>
                  )}
                </td>
                <td className="p-6 text-center">
                  <button className="text-gray-400 transition-colors hover:text-gray-600">
                    <MoreHorizontalIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 p-6">
        <p className="text-sm text-gray-400">
          Showing <span className="font-medium text-gray-900">1 to 10</span> of <span className="font-medium text-gray-900">4,209</span> sellers
        </p>

        <div className="flex items-center gap-2">
          <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">&lt;</button>
          <button className="flex size-8 items-center justify-center rounded-lg bg-[#6338f6] text-sm font-bold text-white">1</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">2</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">3</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">4</button>
          <span className="px-1 text-gray-400">...</span>
          <button className="flex size-8 items-center justify-center rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">421</button>
          <button className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  )
}

export default function SellersPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader
          title="Sellers"
          description="Manage sellers, their stores and performance."
        >
          <Button variant="outline" className="h-11 rounded-xl border-gray-200 bg-white px-6 font-semibold">
            <DownloadIcon size={16} />
            Export
          </Button>
        </DashboardHeader>

        <div className="space-y-8 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            <StatsCard
              title="Total Sellers"
              value="4,209"
              trend="15.7% vs last week"
              icon={StoreIcon}
              iconBgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatsCard
              title="Verified Sellers"
              value="2,835"
              trend="12.4% vs last week"
              icon={CheckCircle2Icon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Pending Verification"
              value="326"
              trend="3.8% vs last week"
              icon={AlertCircleIcon}
              iconBgColor="bg-orange-50"
              iconColor="text-orange-600"
            />
            <StatsCard
              title="Suspended Sellers"
              value="38"
              trend="2.1% vs last week"
              trendType="down"
              icon={AlertTriangleIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
            <StatsCard
              title="Banned Sellers"
              value="10"
              trend="1.0% vs last week"
              trendType="down"
              icon={BanIcon}
              iconBgColor="bg-red-50"
              iconColor="text-red-500"
            />
          </div>

          <div className="space-y-6">
            <SellerFilters />
            <SellerTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}