import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { 
  UserGrowthChart, 
  ListingsOverviewChart, 
  RevenueOverviewChart, 
  TopCategoriesChart 
} from "@/components/dashboard/dashboard-charts"
import { DashboardHeader } from "@/components/dashboard/header"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { 
  UsersIcon, 
  StoreIcon, 
  ShoppingBagIcon, 
  ClipboardListIcon, 
  FileCheckIcon, 
  CreditCardIcon, 
  DollarSignIcon,
  ChevronDownIcon
} from "lucide-react"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader />
        
        <div className="p-8 space-y-8">
          {/* Stats Cards - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Users" 
              value="28,594" 
              trend="12.5% vs last week" 
              icon={UsersIcon}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatsCard 
              title="Buyers" 
              value="24,385" 
              trend="8.3% vs last week" 
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard 
              title="Sellers" 
              value="4,209" 
              trend="15.7% vs last week" 
              icon={StoreIcon}
              iconBgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatsCard 
              title="Active Listings" 
              value="16,842" 
              trend="9.1% vs last week" 
              icon={ShoppingBagIcon}
              iconBgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
          </div>

          {/* Stats Cards - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Pending Applications" 
              value="56" 
              subtext="5 new today" 
              trendType="neutral"
              icon={ClipboardListIcon}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatsCard 
              title="Pending Documents" 
              value="34" 
              subtext="3 new today" 
              trendType="neutral"
              icon={FileCheckIcon}
              iconBgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatsCard 
              title="Total Transactions" 
              value="9,563" 
              trend="11.4% vs last week" 
              icon={CreditCardIcon}
              iconBgColor="bg-violet-50"
              iconColor="text-violet-600"
            />
            <StatsCard 
              title="Total Revenue" 
              value="$38,420.50" 
              trend="14.8% vs last week" 
              icon={DollarSignIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold">User Growth</h4>
                  <button><ChevronDownIcon size={14} className="text-gray-400" /></button>
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-lg flex items-center gap-2">
                  <span className="text-xs font-medium">This Week</span>
                  <ChevronDownIcon size={12} className="text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#6338f6]" />
                  <span className="text-[10px] text-gray-400">New Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-gray-200" />
                  <span className="text-[10px] text-gray-400">Total Users</span>
                </div>
              </div>
              <UserGrowthChart />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Listings Overview</h4>
                <div className="bg-gray-50 px-3 py-1 rounded-lg flex items-center gap-2">
                  <span className="text-xs font-medium">This Week</span>
                  <ChevronDownIcon size={12} className="text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-2 rounded-full bg-[#6338f6]" />
                <span className="text-[10px] text-gray-400">New Listings</span>
              </div>
              <ListingsOverviewChart />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Revenue Overview</h4>
                <div className="bg-gray-50 px-3 py-1 rounded-lg flex items-center gap-2">
                  <span className="text-xs font-medium">This Week</span>
                  <ChevronDownIcon size={12} className="text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-2 rounded-full bg-[#6338f6]" />
                <span className="text-[10px] text-gray-400">Revenue (USD)</span>
              </div>
              <RevenueOverviewChart />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <RecentActivities />
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold">Top Categories</h4>
                <button className="text-sm font-semibold text-[#6338f6] hover:underline">View All</button>
              </div>
              <TopCategoriesChart />
              <div className="grid grid-cols-2 gap-y-3 mt-6">
                <div className="flex items-center justify-between pr-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#6338f6]" />
                    <span className="text-xs text-gray-500">Electronics</span>
                  </div>
                  <span className="text-xs font-bold">35% <span className="text-[10px] text-gray-400 font-normal">(5,894)</span></span>
                </div>
                <div className="flex items-center justify-between pl-4 border-l border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#5356ff]" />
                    <span className="text-xs text-gray-500">Vehicles</span>
                  </div>
                  <span className="text-xs font-bold">25% <span className="text-[10px] text-gray-400 font-normal">(4,210)</span></span>
                </div>
                <div className="flex items-center justify-between pr-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#ff70d2]" />
                    <span className="text-xs text-gray-500">Property</span>
                  </div>
                  <span className="text-xs font-bold">15% <span className="text-[10px] text-gray-400 font-normal">(2,525)</span></span>
                </div>
                <div className="flex items-center justify-between pl-4 border-l border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#ffb340]" />
                    <span className="text-xs text-gray-500">Fashion</span>
                  </div>
                  <span className="text-xs font-bold">12% <span className="text-[10px] text-gray-400 font-normal">(2,020)</span></span>
                </div>
                <div className="flex items-center justify-between pr-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#5ec2ff]" />
                    <span className="text-xs text-gray-500">Services</span>
                  </div>
                  <span className="text-xs font-bold">8% <span className="text-[10px] text-gray-400 font-normal">(1,350)</span></span>
                </div>
                <div className="flex items-center justify-between pl-4 border-l border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#cbd5e1]" />
                    <span className="text-xs text-gray-500">Others</span>
                  </div>
                  <span className="text-xs font-bold">5% <span className="text-[10px] text-gray-400 font-normal">(843)</span></span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <QuickActions />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
