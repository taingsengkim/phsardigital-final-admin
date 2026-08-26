"use client"

import Link from "next/link"
import { 
  UserPlusIcon, 
  FileTextIcon, 
  ShieldAlertIcon, 
  ShoppingBagIcon, 
  ZapIcon 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetSellerApplicationsQuery } from "@/lib/redux/service/sellerApplicationApi"
import { useGetPurchasesQuery } from "@/lib/redux/service/purchaseApi"

const fallbackActivities = [
  {
    id: "fb-1",
    title: "New seller application from \"Tech Store Cambodia\"",
    time: "10 mins ago",
    icon: UserPlusIcon,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    id: "fb-2",
    title: "Document verification submitted by \"Sokchea Electronics\"",
    time: "25 mins ago",
    icon: FileTextIcon,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    id: "fb-3",
    title: "New listing reported: iPhone 15 Pro Max: 1TB",
    time: "1 hour ago",
    icon: ShieldAlertIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    id: "fb-4",
    title: "New purchase completed by user: Dara Kim",
    time: "2 hours ago",
    icon: ShoppingBagIcon,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
  },
  {
    id: "fb-5",
    title: "Subscription renewed by seller: Luxury Watch Co.",
    time: "3 hours ago",
    icon: ZapIcon,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
]

export function RecentActivities() {
  const { data: applications = [] } = useGetSellerApplicationsQuery({ page: 0, size: 5 })
  const { data: purchases = [] } = useGetPurchasesQuery({ page: 0, size: 5 })

  // Build live activities array
  const liveActivities: Array<{
    id: string
    title: string
    time: string
    icon: any
    iconColor: string
    iconBg: string
  }> = []

  // Add application activities
  applications.slice(0, 3).forEach((app) => {
    const hasDocs = app.documents && app.documents.length > 0
    liveActivities.push({
      id: `app-${app.id}`,
      title: hasDocs 
        ? `Document submitted by "${app.businessName || app.name}"`
        : `New seller application from "${app.businessName || app.name}"`,
      time: app.appliedOn || "Recently",
      icon: hasDocs ? FileTextIcon : UserPlusIcon,
      iconColor: hasDocs ? "text-amber-500" : "text-emerald-500",
      iconBg: hasDocs ? "bg-amber-50" : "bg-emerald-50",
    })
  })

  // Add purchase activities
  purchases.slice(0, 3).forEach((p) => {
    liveActivities.push({
      id: `pur-${p.id}`,
      title: `New purchase of ${p.item} by ${p.buyer}`,
      time: p.date || "Recently",
      icon: ShoppingBagIcon,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
    })
  })

  const activities = liveActivities.length > 0 ? liveActivities : fallbackActivities

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">Recent Activities</h4>
        <Link href="/dashboard/seller-applications" className="text-sm font-semibold text-[#6338f6] hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex gap-4 items-center">
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
