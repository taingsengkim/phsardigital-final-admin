"use client";

import { BellIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth-client";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title = "Dashboard",
  description = "",
  children,
}: DashboardHeaderProps) {
  const { data: session } = useSession();

  const handleSignOut = () => {
    window.location.assign("/logout");
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-16 sm:h-20 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200/60 bg-white/85 backdrop-blur-xl gap-2 sm:gap-4 py-2 sm:py-0 shadow-xs transition-all">
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="md:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-xl transition-all shrink-0" />
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate hidden sm:block">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {children}

        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 ml-2 sm:ml-4 border-l border-gray-200/80 pl-2 sm:pl-4 md:pl-5">
          <button 
            type="button"
            className="relative p-2.5 rounded-2xl text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 active:scale-95 transition-all"
            title="Notifications"
          >
            <BellIcon className="size-5 sm:size-5" />
            <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          <div className="flex items-center gap-3 bg-gray-50/80 hover:bg-gray-100/70 p-1.5 pl-3 rounded-2xl border border-gray-100 transition-all">
            <div className="text-right hidden md:block">
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-[10px] font-semibold text-[#6338f6] uppercase tracking-wider">
                Super Admin
              </p>
            </div>
            <Avatar className="size-8 sm:size-9 border-2 border-white shadow-sm shrink-0 ring-2 ring-[#6338f6]/10">
              <AvatarImage src={session?.user?.image || "/avatars/admin.jpg"} />
              <AvatarFallback className="bg-gradient-to-br from-[#6338f6] to-[#4f28d9] text-white text-xs font-bold">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
            >
              <LogOutIcon className="size-4 sm:size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
