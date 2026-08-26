import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModerationStatsCardProps {
  title: string
  value: string
  subtext: string
  subtextColor: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
}

export function ModerationStatsCard({
  title,
  value,
  subtext,
  subtextColor,
  icon: Icon,
  iconColor,
  iconBgColor
}: ModerationStatsCardProps) {
  return (
    <div className="group bg-white p-5 sm:p-6 rounded-3xl border border-gray-100/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div className="flex justify-between items-start mb-3 z-10">
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{title}</p>
        <div className={cn("size-9 sm:size-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xs", iconBgColor)}>
          <Icon className={cn("size-4 sm:size-5", iconColor)} />
        </div>
      </div>
      <div className="z-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{value}</h3>
        <p className={cn("text-[11px] font-bold tracking-wide", subtextColor)}>{subtext}</p>
      </div>
    </div>
  )
}
