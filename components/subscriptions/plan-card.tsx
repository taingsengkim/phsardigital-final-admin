import { CheckIcon, Edit2Icon } from "lucide-react"
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
  onEdit?: () => void
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
  onEdit
}: PlanCardProps) {
  return (
    <div className={cn(
      "bg-white p-6 sm:p-8 rounded-3xl border transition-all relative flex flex-col justify-between",
      isActive ? "border-[#6338f6] ring-1 ring-[#6338f6]" : "border-gray-100 shadow-sm"
    )}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className={cn("size-12 rounded-xl flex items-center justify-center", iconBgColor)}>
            {icon}
          </div>
          {!isPlanActive && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Inactive
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          <span className="text-sm text-gray-400">/ plan</span>
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
      
      <div className="flex items-center gap-3">
        <Button 
          type="button"
          onClick={onEdit}
          className={cn(
            "flex-1 rounded-xl h-11 font-semibold flex items-center justify-center gap-2",
            isDefault ? "bg-[#6338f6] hover:bg-[#532edb] text-white" : "bg-white border-gray-200 text-gray-900 border hover:bg-gray-50 shadow-none"
          )}
        >
          <Edit2Icon size={16} />
          Edit Plan
        </Button>
      </div>
    </div>
  )
}
