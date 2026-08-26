"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { PlanCard } from "@/components/subscriptions/plan-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import {
  UsersIcon,
  DollarSignIcon,
  TrendingDownIcon,
  SettingsIcon,
  PlusIcon,
  ZapIcon,
  CrownIcon,
  BriefcaseIcon,
  DiamondIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSubscriptionPlansQuery } from "@/lib/redux/service/subscriptionApi";
import { useGetAdminDashboardSummaryQuery } from "@/lib/redux/service/dashboardApi";

export default function SubscriptionsPage() {
  const {
    data: plans = [],
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = useGetSubscriptionPlansQuery();
  const { data: summary, isLoading: isSummaryLoading } =
    useGetAdminDashboardSummaryQuery();

  const activeSubscribers = summary?.activeSubscriptions ?? 0;
  const monthlyRevenue =
    summary?.completedSalesValue ?? summary?.totalRevenue ?? 0;

  const getPlanIcon = (planName: string) => {
    const name = planName.toUpperCase();
    if (name.includes("BASIC"))
      return <ZapIcon className="size-6 text-blue-600" />;
    if (name.includes("STANDARD") || name.includes("PRO"))
      return <CrownIcon className="size-6 text-purple-600" />;
    if (name.includes("PREMIUM") || name.includes("BUSINESS"))
      return <BriefcaseIcon className="size-6 text-indigo-600" />;
    return <DiamondIcon className="size-6 text-amber-600" />;
  };

  const getPlanBg = (planName: string) => {
    const name = planName.toUpperCase();
    if (name.includes("BASIC")) return "bg-blue-50";
    if (name.includes("STANDARD") || name.includes("PRO"))
      return "bg-purple-50";
    if (name.includes("PREMIUM") || name.includes("BUSINESS"))
      return "bg-indigo-50";
    return "bg-amber-50";
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader title="Manage Subscriptions">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => refetchPlans()}
              className="rounded-xl border-gray-200 h-11 px-4 font-semibold flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
            >
              <RefreshCwIcon
                size={16}
                className={isPlansLoading ? "animate-spin" : ""}
              />
              Refresh Plans
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-gray-200 h-11 px-6 font-semibold flex items-center gap-2 bg-white text-gray-700"
            >
              <SettingsIcon size={16} />
              Subscription Settings
            </Button>
            <Button className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-11 px-6 font-semibold flex items-center gap-2 shadow-sm shadow-purple-500/20">
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
              value={
                isSummaryLoading ? "..." : activeSubscribers.toLocaleString()
              }
              trend="Live from API"
              trendType="up"
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="MONTHLY REVENUE"
              value={isSummaryLoading ? "..." : `$${monthlyRevenue.toFixed(2)}`}
              trend="Live from API"
              trendType="up"
              icon={DollarSignIcon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard
              title="CANCELLATION RATE"
              value="0.0%"
              trend="Standard"
              trendType="neutral"
              icon={TrendingDownIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
          </div>

          {/* Subscription Plans Section */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
              Subscription Plans
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isPlansLoading && plans.length === 0 ? (
                <div className="col-span-full p-8 text-center text-sm text-gray-400">
                  Loading subscription plans from API...
                </div>
              ) : (
                plans.map((planItem) => {
                  const limitText =
                    planItem.listingLimit === null
                      ? "Unlimited active listings"
                      : `Up to ${planItem.listingLimit} active listings`;

                  return (
                    <PlanCard
                      key={planItem.plan}
                      title={`${planItem.displayName} Plan`}
                      description={`Valid for ${planItem.durationDays} days`}
                      price={`$${planItem.priceUsd.toFixed(2)}`}
                      features={[
                        limitText,
                        "Store profile & catalog",
                        "Live chat & messaging support",
                        "Featured marketplace visibility",
                      ]}
                      icon={getPlanIcon(planItem.plan)}
                      iconBgColor={getPlanBg(planItem.plan)}
                      isActive={planItem.plan === "STANDARD"}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Table Section */}
          <SubscriptionTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
