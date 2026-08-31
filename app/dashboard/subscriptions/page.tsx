"use client";

import { useMemo, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardHeader } from "@/components/dashboard/header";
import { PlanCard } from "@/components/subscriptions/plan-card";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { EditPlanModal } from "@/components/subscriptions/edit-plan-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { showToast } from "@/components/ui/toast-popup";
import {
  UsersIcon,
  LayersIcon,
  TagIcon,
  PlusIcon,
  ZapIcon,
  CrownIcon,
  BriefcaseIcon,
  DiamondIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetSubscriptionPlansQuery,
  useActivateSubscriptionPlanMutation,
  useDeactivateSubscriptionPlanMutation,
} from "@/lib/redux/service/subscriptionApi";
import { useGetAdminDashboardSummaryQuery } from "@/lib/redux/service/dashboardApi";
import { getApiErrorMessage } from "@/lib/redux/service/api-utils";
import type { SubscriptionPlan } from "@/lib/types/subscription";

function formatLimit(limit: number | null | undefined) {
  return limit === null || limit === undefined || limit < 0
    ? "Unlimited active listings"
    : `Up to ${limit.toLocaleString()} active listings`;
}

export default function SubscriptionsPage() {
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SubscriptionPlan | null>(null);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [planToToggle, setPlanToToggle] = useState<SubscriptionPlan | null>(null);

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useGetSubscriptionPlansQuery();

  const { data: summary, isLoading: isSummaryLoading } =
    useGetAdminDashboardSummaryQuery();

  const [activatePlan, { isLoading: isActivating }] = useActivateSubscriptionPlanMutation();
  const [deactivatePlan, { isLoading: isDeactivating }] = useDeactivateSubscriptionPlanMutation();

  const isTogglingStatus = isActivating || isDeactivating;

  // The catalogue is ordered by sortOrder, the same order sellers see.
  const orderedPlans = useMemo(
    () => [...plans].sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0)),
    [plans],
  );

  const activeSubscribers = summary?.activeSubscriptions ?? 0;
  const livePlans = orderedPlans.filter((plan) => plan.active !== false).length;
  const retiredPlans = orderedPlans.length - livePlans;

  const handleCreatePlan = () => {
    setSelectedPlanForEdit(null);
    setIsEditPlanOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForEdit(plan);
    setIsEditPlanOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!planToToggle) return;

    const code = planToToggle.code || planToToggle.plan || "";
    const retiring = planToToggle.active !== false;

    try {
      if (retiring) {
        await deactivatePlan(code).unwrap();
      } else {
        await activatePlan(code).unwrap();
      }

      showToast({
        type: "success",
        title: retiring ? "Plan Retired" : "Plan Restored",
        message: retiring
          ? `"${planToToggle.displayName}" is off the public pricing page. Current subscribers keep it until their period ends.`
          : `"${planToToggle.displayName}" is back on the public pricing page.`,
      });
      setPlanToToggle(null);
    } catch (err: unknown) {
      showToast({
        type: "error",
        title: retiring ? "Could Not Retire Plan" : "Could Not Restore Plan",
        message: getApiErrorMessage(
          err,
          retiring ? "Failed to retire plan." : "Failed to restore plan.",
        ),
      });
      setPlanToToggle(null);
    }
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
        <DashboardHeader
          title="Manage Subscriptions"
          description="Set the plan catalogue and see which sellers are on what."
        >
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
              subtext="Sellers on a running plan"
              trendType="neutral"
              icon={UsersIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="PLANS ON SALE"
              value={isPlansLoading ? "..." : livePlans.toLocaleString()}
              subtext="Listed on the public pricing page"
              trendType="neutral"
              icon={TagIcon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard
              title="RETIRED PLANS"
              value={isPlansLoading ? "..." : retiredPlans.toLocaleString()}
              subtext="Kept for existing subscribers"
              trendType="neutral"
              icon={LayersIcon}
              iconBgColor="bg-amber-50"
              iconColor="text-amber-500"
            />
          </div>

          {/* Subscription Plans Section */}
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Subscription Plans ({orderedPlans.length})
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
              {isPlansLoading && orderedPlans.length === 0 ? (
                <div className="col-span-full p-8 text-center text-sm text-gray-400">
                  Loading subscription plans from API...
                </div>
              ) : (
                orderedPlans.map((planItem, index) => {
                  const planCode = planItem?.code || planItem?.plan || `PLAN_${index}`;
                  const displayName = planItem?.displayName || planCode || "Subscription";
                  const durationDays = planItem?.durationDays ?? 30;
                  const priceUsd = typeof planItem?.priceUsd === "number" ? planItem.priceUsd : 0;
                  const isPlanActive = planItem.active !== false;

                  return (
                    <PlanCard
                      key={planCode || index}
                      title={displayName}
                      description={
                        priceUsd === 0
                          ? `Free · activates instantly for ${durationDays} days`
                          : `Valid for ${durationDays} days`
                      }
                      price={`$${priceUsd.toFixed(2)}`}
                      // Only what the API actually defines for a plan.
                      features={[
                        formatLimit(planItem?.listingLimit),
                        `Runs for ${durationDays} days per purchase`,
                        `Plan code ${planCode}`,
                      ]}
                      icon={getPlanIcon(planCode)}
                      iconBgColor={getPlanBg(planCode)}
                      isPlanActive={isPlanActive}
                      isTogglingStatus={isTogglingStatus && planToToggle?.code === planItem.code}
                      onEdit={() => handleEditPlan(planItem)}
                      onToggleStatus={() => setPlanToToggle(planItem)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Table Section */}
          <SubscriptionTable plans={orderedPlans} />
        </div>

        {/* Modal for Creating / Editing Plan */}
        <EditPlanModal
          plan={selectedPlanForEdit}
          open={isEditPlanOpen}
          onOpenChange={setIsEditPlanOpen}
        />

        {/* Retire / restore confirmation - there is no delete for plans. */}
        <ConfirmModal
          open={Boolean(planToToggle)}
          onOpenChange={(open) => {
            if (!open) setPlanToToggle(null);
          }}
          title={
            planToToggle?.active !== false
              ? `Retire "${planToToggle?.displayName}"?`
              : `Restore "${planToToggle?.displayName}"?`
          }
          description={
            planToToggle?.active !== false
              ? "The plan comes off the public pricing page so no new seller can buy it. Sellers already on it keep it until their period ends, and the plan is never deleted because past subscriptions name it."
              : "The plan goes back on the public pricing page and sellers can buy it again."
          }
          confirmText={planToToggle?.active !== false ? "Retire Plan" : "Restore Plan"}
          variant={planToToggle?.active !== false ? "danger" : "default"}
          isLoading={isTogglingStatus}
          onConfirm={handleConfirmToggle}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
