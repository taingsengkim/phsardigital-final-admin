"use client"

import Link from "next/link"
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
import { useGetAdminDashboardSummaryQuery } from "@/lib/redux/service/dashboardApi"
import { useGetCategoriesQuery } from "@/lib/redux/service/categoryApi"
import { useGetSellerApplicationsQuery } from "@/lib/redux/service/sellerApplicationApi"

const categoryColors = ['#6338f6', '#5356ff', '#ff70d2', '#ffb340', '#5ec2ff', '#cbd5e1']

const defaultCategories = [
  { name: 'Electronics', count: 5894, pct: 35, color: '#6338f6' },
  { name: 'Vehicles', count: 4210, pct: 25, color: '#5356ff' },
  { name: 'Property', count: 2525, pct: 15, color: '#ff70d2' },
  { name: 'Fashion', count: 2020, pct: 12, color: '#ffb340' },
  { name: 'Services', count: 1350, pct: 8, color: '#5ec2ff' },
  { name: 'Others', count: 843, pct: 5, color: '#cbd5e1' },
]

export default function Page() {
  const { data: summary, isLoading, isError, refetch } = useGetAdminDashboardSummaryQuery()
  const { data: categories = [] } = useGetCategoriesQuery()
  const { data: applications = [] } = useGetSellerApplicationsQuery({ page: 0, size: 50 })

  const value = (amount?: number) => isLoading ? "..." : (amount ?? 0).toLocaleString()

  // Calculate pending documents from applications
  const pendingDocsCount = applications.filter(
    (app) => app.documents && app.documents.length > 0 && app.status.includes("PENDING")
  ).length

  // Calculate top categories data
  const totalCategoryListings = categories.reduce((sum, c) => sum + (c.listingsCount || 0), 0)
  
  const formattedCategoryItems = categories.length > 0
    ? categories.slice(0, 6).map((cat, idx) => {
        const count = cat.listingsCount || 0
        const pct = totalCategoryListings > 0 ? Math.round((count / totalCategoryListings) * 100) : 0
        return {
          name: cat.name,
          value: pct > 0 ? pct : 1,
          count,
          color: categoryColors[idx % categoryColors.length],
        }
      })
    : defaultCategories.map((c) => ({
        name: c.name,
        value: c.pct,
        count: c.count,
        color: c.color,
      }))

  const chartData = formattedCategoryItems.map((c) => ({
    name: c.name,
    value: c.value,
    count: c.count,
    color: c.color,
  }))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader />
        
        <div className="p-8 space-y-8">
          {isError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              Failed to load dashboard summary. <button type="button" onClick={() => refetch()} className="font-semibold underline">Retry</button>
            </div>
          )}
          {/* Stats Cards - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Users" 
              value={value(summary?.totalUsers)}
              trend="Live from API"
              icon={UsersIcon}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatsCard 
              title="Buyers" 
              value={value(summary?.totalBuyers)}
              trend="Live from API"
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard 
              title="Sellers" 
              value={value(summary?.totalSellers)}
              trend="Live from API"
              icon={StoreIcon}
              iconBgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatsCard 
              title="Active Listings" 
              value={value(summary?.activeListings)}
              trend="Live from API"
              icon={ShoppingBagIcon}
              iconBgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
          </div>

          {/* Stats Cards - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Pending Applications" 
              value={value(summary?.pendingApplications)}
              subtext="Live from API"
              trendType="neutral"
              icon={ClipboardListIcon}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatsCard 
              title="Pending Documents" 
              value={isLoading ? "..." : (pendingDocsCount > 0 ? pendingDocsCount.toString() : (summary?.pendingDocuments ?? 0).toString())}
              subtext="Live from applications"
              trendType="neutral"
              icon={FileCheckIcon}
              iconBgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <StatsCard 
              title="Total Transactions" 
              value={value(summary?.totalTransactions)}
              trend="Live from API"
              icon={CreditCardIcon}
              iconBgColor="bg-violet-50"
              iconColor="text-violet-600"
            />
            <StatsCard 
              title="Total Revenue" 
              value={isLoading ? "..." : `$${(summary?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              trend="Live from API"
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
                <Link href="/dashboard/categories" className="text-sm font-semibold text-[#6338f6] hover:underline">
                  View All
                </Link>
              </div>
              <TopCategoriesChart data={chartData} totalListings={totalCategoryListings || summary?.activeListings} />
              <div className="grid grid-cols-2 gap-y-3 mt-6">
                {formattedCategoryItems.map((item, index) => (
                  <div key={item.name} className={`flex items-center justify-between ${index % 2 === 0 ? 'pr-4' : 'pl-4 border-l border-gray-100'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-500 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap ml-1">
                      {item.value}% <span className="text-[10px] text-gray-400 font-normal">({item.count.toLocaleString()})</span>
                    </span>
                  </div>
                ))}
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
