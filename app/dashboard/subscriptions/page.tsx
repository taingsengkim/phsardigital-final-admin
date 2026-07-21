import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { PlanCard } from "@/components/subscriptions/plan-card"
import { SubscriptionTable } from "@/components/subscriptions/subscription-table"
import { 
  UsersIcon, 
  DollarSignIcon, 
  TrendingDownIcon,
  SettingsIcon,
  PlusIcon,
  ZapIcon,
  CrownIcon,
  BriefcaseIcon,
  DiamondIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscriptionsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Manage Subscriptions" 
          description="Create and manage subscription plans and monitor active subscriptions."
        >
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 font-semibold flex items-center gap-2 bg-white text-gray-700">
              <SettingsIcon size={16} />
              Subscription Settings
            </Button>
            <Button className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-11 px-6 font-semibold flex items-center gap-2">
              <PlusIcon size={16} />
              Create New Plan
            </Button>
          </div>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="ACTIVE SUBSCRIBERS" 
              value="128" 
              trend="+ 12%" 
              trendType="up"
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard 
              title="MONTHLY REVENUE" 
              value="$1,278.72" 
              trend="+ 8.5%" 
              trendType="up"
              icon={DollarSignIcon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard 
              title="CANCELLATION RATE" 
              value="4.2%" 
              trend="- 0.5%" 
              trendType="down"
              icon={TrendingDownIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
          </div>

          {/* Subscription Plans Section */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Subscription Plans</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PlanCard 
                title="Basic Plan"
                description="For new sellers getting started"
                price="$0"
                features={[
                  "Up to 5 active listings",
                  "Basic store profile",
                  "Standard support"
                ]}
                icon={<ZapIcon className="size-6 text-blue-600" />}
                iconBgColor="bg-blue-50"
              />
              <PlanCard 
                title="Pro Plan"
                description="For growing businesses"
                price="$9.99"
                features={[
                  "Up to 50 active listings",
                  "Featured listings (5)",
                  "Custom store profile",
                  "Priority support"
                ]}
                icon={<CrownIcon className="size-6 text-purple-600" />}
                iconBgColor="bg-purple-50"
                isActive={true}
              />
              <PlanCard 
                title="Business Plan"
                description="For established businesses"
                price="$24.99"
                features={[
                  "Unlimited active listings",
                  "Featured listings (20)",
                  "Custom store & branding",
                  "Analytics & insights"
                ]}
                icon={<BriefcaseIcon className="size-6 text-indigo-600" />}
                iconBgColor="bg-indigo-50"
              />
              <PlanCard 
                title="Enterprise Plan"
                description="For large organizations"
                price="$49.99"
                features={[
                  "Everything in Business",
                  "Top placement",
                  "Dedicated account manager",
                  "Custom solutions"
                ]}
                icon={<DiamondIcon className="size-6 text-amber-600" />}
                iconBgColor="bg-amber-50"
              />
            </div>
          </div>

          {/* Table Section */}
          <SubscriptionTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
