import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  trend?: string
  trendType?: "up" | "down" | "neutral"
  subtext?: string
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
}

export function StatsCard({
  title,
  value,
  trend,
  trendType = "up",
  subtext,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100 flex justify-between items-start">
      <div className="min-w-0 flex-1 pr-2">
        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 truncate">{title}</p>
        <h3 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2 truncate">{value}</h3>
        <div className="flex flex-wrap items-center gap-1">
          {trend && (
            <span className={cn(
              "text-[10px] sm:text-xs font-semibold flex items-center shrink-0",
              trendType === "up" ? "text-emerald-500" : trendType === "down" ? "text-rose-500" : "text-amber-500"
            )}>
              {trendType === "up" && "↑ "}
              {trendType === "down" && "↓ "}
              {trend}
            </span>
          )}
          {subtext && <span className="text-[10px] sm:text-xs text-gray-400 truncate">{subtext}</span>}
        </div>
      </div>
      <div className={cn("p-2.5 sm:p-3 rounded-2xl shrink-0", iconBgColor)}>
        <Icon className={cn("size-5 sm:size-6", iconColor)} />
      </div>
    </div>
  )
}
