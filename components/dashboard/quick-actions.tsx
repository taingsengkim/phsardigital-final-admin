import { 
  UsersIcon, 
  FileTextIcon, 
  ShoppingBagIcon, 
  StarIcon, 
  BellIcon, 
  PieChartIcon 
} from "lucide-react"

const actions = [
  { title: "Review Applications", icon: UsersIcon, color: "text-[#6338f6]" },
  { title: "Review Documents", icon: FileTextIcon, color: "text-blue-500" },
  { title: "Moderate Listings", icon: ShoppingBagIcon, color: "text-purple-500" },
  { title: "Moderate Reviews", icon: StarIcon, color: "text-amber-500" },
  { title: "Send Notification", icon: BellIcon, color: "text-rose-500" },
  { title: "View Reports", icon: PieChartIcon, color: "text-emerald-500" },
]

export function QuickActions() {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold">Quick Actions</h4>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button 
            key={action.title}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors gap-3 group"
          >
            <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
              <action.icon className={action.color} size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">
              {action.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
