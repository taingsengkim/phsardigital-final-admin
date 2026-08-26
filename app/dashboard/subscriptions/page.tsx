"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { PlanCard } from "@/components/subscriptions/plan-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { EditPlanModal } from "@/components/subscriptions/edit-plan-modal";
import {
  UsersIcon,
  DollarSignIcon,
  TrendingDownIcon,
  PlusIcon,
  ZapIcon,
  CrownIcon,
  BriefcaseIcon,
  DiamondIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSubscriptionPlansQuery } from "@/lib/redux/service/subscriptionApi";
import { useGetAdminDashboardSummaryQuery } from "@/lib/redux/service/dashboardApi";
import type { SubscriptionPlan } from "@/lib/types/subscription";

export default function SubscriptionsPage() {
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SubscriptionPlan | null>(null);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useGetSubscriptionPlansQuery();

  const { data: summary, isLoading: isSummaryLoading } =
    useGetAdminDashboardSummaryQuery();

  const activeSubscribers = summary?.activeSubscriptions ?? 0;
  const monthlyRevenue =
    summary?.completedSalesValue ?? summary?.totalRevenue ?? 0;

  const handleCreatePlan = () => {
    setSelectedPlanForEdit(null);
    setIsEditPlanOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForEdit(plan);
    setIsEditPlanOpen(true);
  };

  const getPlanIcon = (planName?: string) => {
    const name = (planName || "").toUpperCase();
    if (name.includes("BASIC"))
      return <ZapIcon className="size-6 text-blue-600" />;
    if (name.includes("STANDARD") || name.includes("PRO"))
      return <CrownIcon className="size-6 text-purple-600" />;
    if (name.includes("PREMIUM") || name.includes("BUSINESS"))
      return <BriefcaseIcon className="size-6 text-indigo-600" />;
    return <DiamondIcon className="size-6 text-amber-600" />;
  };

  const getPlanBg = (planName?: string) => {
    const name = (planName || "").toUpperCase();
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
              onClick={handleCreatePlan}
              className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-10 sm:h-11 px-4 sm:px-6 font-semibold flex items-center gap-2 shadow-sm shadow-purple-500/20 text-xs sm:text-sm"
            >
              <PlusIcon size={16} />
              Create New Plan
            </Button>
          </div>
        </DashboardHeader>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Subscription Plans ({plans.length})
              </h4>
              {isPlansError && (
                <button
                  onClick={() => refetchPlans()}
                  className="text-xs text-rose-500 underline font-semibold"
                >
                  Retry loading plans
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {isPlansLoading && plans.length === 0 ? (
                <div className="col-span-full p-8 text-center text-sm text-gray-400">
                  Loading subscription plans from API...
                </div>
              ) : (
                plans.map((planItem, index) => {
                  const planCode = planItem?.code || planItem?.plan || `PLAN_${index}`;
                  const displayName = planItem?.displayName || planCode || "Subscription";
                  const durationDays = planItem?.durationDays ?? 30;
                  const priceUsd = typeof planItem?.priceUsd === "number" ? planItem.priceUsd : 0;

                  const limitText =
                    planItem?.listingLimit === null || planItem?.listingLimit === undefined || planItem?.listingLimit === -1
                      ? "Unlimited active listings"
                      : `Up to ${planItem.listingLimit} active listings`;

                  return (
                    <PlanCard
                      key={planCode || index}
                      title={`${displayName} Plan`}
                      description={`Valid for ${durationDays} days`}
                      price={`$${priceUsd.toFixed(2)}`}
                      features={[
                        limitText,
                        "Store profile & catalog",
                        "Live chat & messaging support",
                        "Featured marketplace visibility",
                      ]}
                      icon={getPlanIcon(planCode)}
                      iconBgColor={getPlanBg(planCode)}
                      isActive={planCode.toUpperCase() === "STANDARD"}
                      isPlanActive={planItem.active !== false}
                      onEdit={() => handleEditPlan(planItem)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Table Section */}
          <SubscriptionTable plans={plans} />
        </div>

        {/* Modal for Creating / Editing Plan */}
        <EditPlanModal
          plan={selectedPlanForEdit}
          open={isEditPlanOpen}
          onOpenChange={setIsEditPlanOpen}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
