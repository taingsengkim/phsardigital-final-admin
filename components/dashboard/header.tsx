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
    <header className="flex min-h-16 sm:h-20 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-white gap-2 sm:gap-4 py-2 sm:py-0">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <SidebarTrigger className="md:hidden text-gray-500 hover:text-gray-900 shrink-0" />
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {children}

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 ml-2 sm:ml-4 border-l border-gray-100 pl-2 sm:pl-4 md:pl-6">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <BellIcon className="size-5 sm:size-6 text-gray-500" />
            <span className="absolute top-2 right-2 size-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-900 leading-tight">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.email || "Super Admin"}
              </p>
            </div>
            <Avatar className="size-8 sm:size-10 border-2 border-white shadow-sm shrink-0">
              <AvatarImage src={session?.user?.image || "/avatars/admin.jpg"} />
              <AvatarFallback className="bg-[#6338f6] text-white text-xs sm:text-sm">
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <LogOutIcon className="size-4 sm:size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
