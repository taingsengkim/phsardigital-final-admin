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
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <div className={cn("size-8 rounded-xl flex items-center justify-center", iconBgColor)}>
          <Icon className={cn("size-4", iconColor)} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-1">{value}</h3>
        <p className={cn("text-[10px] font-bold", subtextColor)}>{subtext}</p>
      </div>
    </div>
  )
}
