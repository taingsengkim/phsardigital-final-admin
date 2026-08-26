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
    <div className="group rounded-3xl bg-white p-5 sm:p-6 shadow-xs border border-gray-100/90 hover:border-gray-200/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-start relative overflow-hidden">
      {/* Subtle background glow on hover */}
      <div className="absolute -right-8 -bottom-8 size-28 bg-gradient-to-br from-[#6338f6]/5 to-transparent rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      
      <div className="min-w-0 flex-1 pr-3 z-10">
        <p className="text-xs sm:text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 truncate">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight truncate">
          {value}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {trend && (
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold inline-flex items-center gap-0.5 shrink-0",
              trendType === "up" 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                : trendType === "down" 
                ? "bg-rose-50 text-rose-700 border border-rose-100" 
                : "bg-amber-50 text-amber-700 border border-amber-100"
            )}>
              {trendType === "up" && "↑"}
              {trendType === "down" && "↓"}
              <span>{trend}</span>
            </span>
          )}
          {subtext && (
            <span className="text-[11px] font-medium text-gray-400 truncate">
              {subtext}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-3 sm:p-3.5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-2xs z-10", iconBgColor)}>
        <Icon className={cn("size-5 sm:size-6", iconColor)} />
      </div>
    </div>
  )
}
