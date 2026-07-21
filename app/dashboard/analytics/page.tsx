import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { 
  UserGrowthBarChart, 
  BuyerSellerDonutChart, 
  RevenueTrendChart,
  AnalyticsListingsBar
} from "@/components/analytics/analytics-charts"
import { 
  CalendarIcon, 
  ChevronDownIcon, 
  DownloadIcon, 
  FileTextIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  InfoIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Analytics" 
          description="Comprehensive overview of platform performance and user engagement."
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm cursor-pointer">
              <CalendarIcon size={16} className="text-gray-400" />
              <span className="text-sm font-medium">Oct 01, 2023 - Oct 31, 2023</span>
              <ChevronDownIcon size={14} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm cursor-pointer">
              <span className="text-xs text-gray-400">Category</span>
              <span className="text-sm font-medium">All Categories</span>
              <ChevronDownIcon size={14} className="text-gray-400" />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-100 shadow-sm font-bold text-[#6338f6] h-10">
              Export Excel
            </Button>
            <Button className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] shadow-sm font-bold h-10">
              Download PDF
            </Button>
          </div>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Users</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold">24.8k</h4>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUpIcon size={10} /> 12%
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Sellers</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold">1,240</h4>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUpIcon size={10} /> 5%
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Active Listings</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold">8.4k</h4>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingDownIcon size={10} /> 2%
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Transactions</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold">9,563</h4>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUpIcon size={10} /> 11%
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Revenue</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold">$42.1k</h4>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUpIcon size={10} /> 18%
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Approval Rate</p>
              <div className="flex items-end justify-between">
                <h4 className="text-2xl font-bold">94.2%</h4>
                <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                  Stable
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Growth Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">User Growth</h4>
                  <p className="text-xs text-gray-400">Daily active users vs new signups</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-[#6338f6]" />
                    <span className="text-xs font-bold">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-gray-100" />
                    <span className="text-xs font-bold text-gray-400">New</span>
                  </div>
                </div>
              </div>
              <UserGrowthBarChart />
            </div>

            {/* Buyer vs Seller Donut */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-8">Buyer vs Seller</h4>
              <BuyerSellerDonutChart />
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-[#6338f6]" />
                    <span className="text-xs font-bold text-gray-900">Active Buyers</span>
                  </div>
                  <span className="text-sm font-bold">20.4k</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-gray-100" />
                    <span className="text-xs font-bold text-gray-400">Active Sellers</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">4.4k</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listings by Category */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-bold text-gray-900">Listings by Category</h4>
                <button className="text-xs font-bold text-[#6338f6] hover:underline">View Detailed Report</button>
              </div>
              <div className="space-y-6">
                <AnalyticsListingsBar label="Electronics" value="3,240" percentage={38} color="#6338f6" />
                <AnalyticsListingsBar label="Vehicles" value="1,820" percentage={22} color="#6338f6" />
                <AnalyticsListingsBar label="Jobs & Services" value="1,100" percentage={13} color="#6338f6" />
                <AnalyticsListingsBar label="Real Estate" value="950" percentage={11} color="#6338f6" />
              </div>
            </div>

            {/* Top Viewed Listings */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 mb-8">Top Viewed Listings</h4>
              <div className="space-y-6">
                {[
                  { name: "MacBook Pro M2 - 512GB", category: "Electronics", price: "$1,299", views: "12.4k" },
                  { name: "Toyota Prius 2022 Hybrid", category: "Vehicles", price: "$28,500", views: "9.8k" },
                  { name: "Modern Villa with Pool", category: "Real Estate", price: "$450k", views: "8.2k" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 bg-gray-100 rounded-xl overflow-hidden relative">
                         <div className="absolute inset-0 bg-gray-900/5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">{item.name}</h5>
                        <p className="text-[10px] text-gray-400 font-medium">{item.category} • {item.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">{item.views}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud & Safety + Trust Score */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-6 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                    <InfoIcon size={14} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Fraud & Safety</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fraud Reports</p>
                    <h5 className="text-xl font-bold text-rose-500">24</h5>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suspended</p>
                    <h5 className="text-xl font-bold text-gray-900">112</h5>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Most Reported Categories</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">Electronics</span>
                  <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">Vehicles</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-6">Trust Score Distribution</h4>
                <div className="space-y-4">
                  {[
                    { label: "90+", value: 65, color: "bg-emerald-400" },
                    { label: "70+", value: 25, color: "bg-[#6338f6]" },
                    { label: "< 70", value: 10, color: "bg-rose-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400 w-8">{item.label}</span>
                      <div className="h-2 flex-1 bg-gray-50 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trend Row */}
          <div className="bg-[#6338f6] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
              <div className="max-w-md">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Revenue Trend (MTD)</p>
                <h2 className="text-5xl font-bold mb-4">$148,290.00</h2>
                <div className="flex items-center gap-2 text-emerald-300 font-bold mb-12">
                  <TrendingUpIcon size={18} />
                  <span>+24% from last month</span>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Pro Subscriptions</p>
                    <p className="text-lg font-bold">$94,500</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Ad Revenue</p>
                    <p className="text-lg font-bold">$32,140</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Transaction Fees</p>
                    <p className="text-lg font-bold">$21,650</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-end">
                   <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-right border border-white/10">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Projection</p>
                      <p className="text-xl font-bold">$192k Year End</p>
                   </div>
                </div>
                <RevenueTrendChart />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
