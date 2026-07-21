import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { CategoryHierarchy } from "@/components/categories/category-tree"
import { CategoryDirectory } from "@/components/categories/category-directory"
import { CategoryDetails } from "@/components/categories/category-details"
import { CategoryGrowthChart, CategoryListingsBar } from "@/components/categories/category-charts"
import { 
  LayoutGridIcon, 
  LayersIcon, 
  ShoppingBagIcon, 
  StarIcon, 
  SearchIcon,
  DownloadIcon,
  TrendingUpIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CategoriesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Category Manager" 
          description="Organize and manage your product categories and subcategories."
        >
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10 bg-white border-gray-100 rounded-xl h-11 w-72 shadow-sm"
            />
          </div>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="TOTAL CATEGORIES" 
              value="24" 
              icon={LayoutGridIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <StatsCard 
              title="TOTAL SUBCATEGORIES" 
              value="156" 
              icon={LayersIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <StatsCard 
              title="TOTAL LISTINGS" 
              value="16,842" 
              icon={ShoppingBagIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">POPULAR CATEGORY</p>
                <h4 className="text-lg font-bold text-gray-900">Electronics</h4>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <TrendingUpIcon size={10} /> + 12% growth
                </p>
              </div>
              <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                <StarIcon size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hierarchy and Directory */}
            <div className="lg:col-span-2 space-y-8">
              <CategoryHierarchy />
              <CategoryDirectory />
            </div>

            {/* Right Column - Details and Charts */}
            <div className="space-y-8">
              <CategoryDetails />
              
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-6">Listings by Category</h4>
                <div className="space-y-6">
                  <CategoryListingsBar label="Electronics" value="5.9k" percentage={85} color="#6338f6" />
                  <CategoryListingsBar label="Vehicles" value="2.4k" percentage={45} color="#8b5cf6" />
                  <CategoryListingsBar label="Property" value="1.9k" percentage={35} color="#a78bfa" />
                  <CategoryListingsBar label="Home & Living" value="1.2k" percentage={20} color="#1f2937" />
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-gray-900">Category Growth Trend</h4>
                  <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <DownloadIcon size={14} />
                  </div>
                </div>
                <CategoryGrowthChart />
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Action Button for Export as shown in bottom right of image */}
        <button className="fixed bottom-8 right-8 size-14 bg-[#6338f6] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#532edb] transition-all z-50">
          <DownloadIcon size={24} />
        </button>
      </SidebarInset>
    </SidebarProvider>
  )
}
