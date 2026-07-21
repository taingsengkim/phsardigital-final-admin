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
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold mb-2">{value}</h3>
        <div className="flex items-center gap-1">
          {trend && (
            <span className={cn(
              "text-xs font-semibold flex items-center",
              trendType === "up" ? "text-emerald-500" : trendType === "down" ? "text-rose-500" : "text-amber-500"
            )}>
              {trendType === "up" && "↑"}
              {trendType === "down" && "↓"}
              {trend}
            </span>
          )}
          {subtext && <span className="text-xs text-gray-400">{subtext}</span>}
        </div>
      </div>
      <div className={cn("p-3 rounded-2xl", iconBgColor)}>
        <Icon className={cn("size-6", iconColor)} />
      </div>
    </div>
  )
}
