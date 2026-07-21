import { BellIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  title?: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({ 
  title = "Dashboard", 
  description = "Welcome back! Here's what's happening on your marketplace.",
  children
}: DashboardHeaderProps) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between px-8 border-b border-gray-100 bg-white">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <div className="flex items-center gap-4">
        {children}
        
        <div className="flex items-center gap-6 ml-4 border-l border-gray-100 pl-6">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <BellIcon className="size-6 text-gray-500" />
            <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <Avatar className="size-10 border-2 border-white shadow-sm">
              <AvatarImage src="/avatars/admin.jpg" />
              <AvatarFallback className="bg-[#6338f6] text-white">AU</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
