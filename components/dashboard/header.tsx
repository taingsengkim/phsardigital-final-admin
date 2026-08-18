"use client"

import { BellIcon, LogOutIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "@/lib/auth-client"

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
  const { data: session } = useSession()

  const handleSignOut = () => {
    window.location.assign("/logout");
  };

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
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.email || "Super Admin"}
              </p>
            </div>
            <Avatar className="size-10 border-2 border-white shadow-sm">
              <AvatarImage src={session?.user?.image || "/avatars/admin.jpg"} />
              <AvatarFallback className="bg-[#6338f6] text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleSignOut}
              title="Sign Out"
              className="ml-2 p-2 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <LogOutIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
