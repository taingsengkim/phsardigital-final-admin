import { CheckIcon, MoreHorizontalIcon } from "lucide-react"
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
}

export function PlanCard({ 
  title, 
  description, 
  price, 
  features, 
  icon, 
  iconBgColor,
  isDefault,
  isActive
}: PlanCardProps) {
  return (
    <div className={cn(
      "bg-white p-8 rounded-3xl border transition-all relative",
      isActive ? "border-[#6338f6] ring-1 ring-[#6338f6]" : "border-gray-100 shadow-sm"
    )}>
      <div className={cn("size-12 rounded-xl flex items-center justify-center mb-6", iconBgColor)}>
        {icon}
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        <span className="text-sm text-gray-400">/ month</span>
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
      
      <div className="flex items-center gap-3">
        <Button 
          className={cn(
            "flex-1 rounded-xl h-11 font-semibold",
            isDefault ? "bg-[#6338f6] hover:bg-[#532edb]" : "bg-white border-gray-200 text-gray-900 border hover:bg-gray-50 shadow-none"
          )}
        >
          {isDefault ? "Default Plan" : "Edit Plan"}
        </Button>
        <button className="size-11 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50">
          <MoreHorizontalIcon size={18} />
        </button>
      </div>
    </div>
  )
}
