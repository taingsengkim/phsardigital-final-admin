import { 
  UserPlusIcon, 
  FileTextIcon, 
  ShieldAlertIcon, 
  ShoppingBagIcon, 
  ZapIcon 
} from "lucide-react"
import { cn } from "@/lib/utils"

const activities = [
  {
    id: 1,
    title: "New seller application from \"Tech Store Cambodia\"",
    time: "10 mins ago",
    icon: UserPlusIcon,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    id: 2,
    title: "Document verification submitted by \"Sokchea Electronics\"",
    time: "25 mins ago",
    icon: FileTextIcon,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    id: 3,
    title: "New listing reported: iPhone 15 Pro Max: 1TB",
    time: "1 hour ago",
    icon: ShieldAlertIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    id: 4,
    title: "New purchase completed by user: Dara Kim",
    time: "2 hours ago",
    icon: ShoppingBagIcon,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
  {
    id: 5,
    title: "Subscription renewed by seller: Luxury Watch Co.",
    time: "3 hours ago",
    icon: ZapIcon,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
]

export function RecentActivities() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">Recent Activities</h4>
        <button className="text-sm font-semibold text-[#6338f6] hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", activity.iconBg)}>
              <activity.icon className={cn("size-5", activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                {activity.title}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
