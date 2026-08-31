import { CheckIcon, Edit2Icon, ArchiveIcon, ArchiveRestoreIcon, Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PlanCardProps {
  title: string
  description: string
  price: string
  features: string[]
  icon: React.ReactNode
  iconBgColor: string
  isDefault?: boolean
  isActive?: boolean
  planCode?: string
  isPlanActive?: boolean
  isTogglingStatus?: boolean
  onEdit?: () => void
  onToggleStatus?: () => void
}

export function PlanCard({
  title,
  description,
  price,
  features,
  icon,
  iconBgColor,
  isDefault,
  isActive,
  isPlanActive = true,
  isTogglingStatus,
  onEdit,
  onToggleStatus,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "bg-white p-6 sm:p-8 rounded-3xl border transition-all relative flex flex-col justify-between",
        isActive ? "border-[#6338f6] ring-1 ring-[#6338f6]" : "border-gray-100 shadow-sm",
        // Retired plans stay visible but read as inactive - past subscriptions
        // still name them, so they are never removed from the catalogue.
        !isPlanActive && "border-dashed bg-gray-50/60",
      )}
    >
      <div className={cn(!isPlanActive && "opacity-60")}>
        <div className="flex items-center justify-between mb-6">
          <div className={cn("size-12 rounded-xl flex items-center justify-center", iconBgColor)}>
            {icon}
          </div>
          {!isPlanActive && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700 border border-gray-300">
              Retired
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>

        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          <span className="text-sm text-gray-400">/ period</span>
        </div>

        <ul className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckIcon className="size-3 text-emerald-500" />
              </div>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {!isPlanActive && (
          <p className="text-[11px] leading-relaxed text-gray-500">
            Hidden from the public pricing page. Existing subscribers stay on this plan until
            their period ends.
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onEdit}
            className={cn(
              "flex-1 rounded-xl h-11 font-semibold flex items-center justify-center gap-2",
              isDefault
                ? "bg-[#6338f6] hover:bg-[#532edb] text-white"
                : "bg-white border-gray-200 text-gray-900 border hover:bg-gray-50 shadow-none",
            )}
          >
            <Edit2Icon size={16} />
            Edit Plan
          </Button>

          {onToggleStatus && (
            <Button
              type="button"
              variant="outline"
              disabled={isTogglingStatus}
              onClick={onToggleStatus}
              title={
                isPlanActive
                  ? "Take this plan off the public pricing page"
                  : "Put this plan back on the public pricing page"
              }
              className={cn(
                "rounded-xl h-11 px-4 font-semibold flex items-center justify-center gap-2 shadow-none",
                isPlanActive
                  ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
              )}
            >
              {isTogglingStatus ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : isPlanActive ? (
                <ArchiveIcon size={16} />
              ) : (
                <ArchiveRestoreIcon size={16} />
              )}
              {isPlanActive ? "Retire" : "Restore"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
