import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { ModerationStatsCard } from "@/components/moderation/listing-stats"
import { ListingModerationTable } from "@/components/moderation/listing-moderation-table"
import { ListingAuditSidebar } from "@/components/moderation/listing-audit-sidebar"
import { 
  ClipboardListIcon, 
  CheckCircle2Icon, 
  XCircleIcon, 
} from "lucide-react"

export default function ListingsModerationPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Listings Moderation" 
          description="Review and manage marketplace listings to ensure safety and quality."
        />
        
        <div className="p-8 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModerationStatsCard 
              title="All Product Listing Item" 
              value="2845 Items" 
              subtext="Requires immediate action" 
              subtextColor="text-emerald-500"
              icon={ClipboardListIcon}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-500"
            />
            <ModerationStatsCard 
              title="Published Today" 
              value="240 items" 
              subtext="↑ 8.3% vs yesterday" 
              subtextColor="text-emerald-500"
              icon={CheckCircle2Icon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <ModerationStatsCard 
              title="Banned" 
              value="42 Items" 
              subtext="Policy violations" 
              subtextColor="text-rose-500"
              icon={XCircleIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
            <ModerationStatsCard 
              title="Banned Today" 
              value="10 items" 
              subtext="Policy violations" 
              subtextColor="text-rose-500"
              icon={XCircleIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ListingModerationTable />
            </div>
            <ListingAuditSidebar />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
