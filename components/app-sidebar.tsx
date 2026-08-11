"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  UsersIcon,
  StoreIcon,
  ClipboardListIcon,
  FileCheckIcon,
  CreditCardIcon,
  ListIcon,
  ShieldCheckIcon,
  StarIcon,
  ShoppingBagIcon,
  BellIcon,
  BarChart3Icon,
  PieChartIcon,
  SettingsIcon,
  ArrowRightIcon,
  ShieldIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

// This is sample data.
const data = {
  user: {
    name: "Admin User",
    email: "Super Admin",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Buyers",
      url: "/dashboard/buyers",
      icon: <UsersIcon />,
    },
    {
      title: "Sellers",
      url: "/dashboard/sellers",
      icon: <StoreIcon />,
    },
    {
      title: "Seller Applications",
      url: "/dashboard/seller-applications",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Documents Review",
      url: "/dashboard/documents-review",
      icon: <FileCheckIcon />,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: <CreditCardIcon />,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: <ListIcon />,
    },
    {
      title: "Listings Moderation",
      url: "/dashboard/listings-moderation",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Reviews Moderation",
      url: "/dashboard/reviews-moderation",
      icon: <StarIcon />,
    },
    {
      title: "Purchases",
      url: "/dashboard/purchases",
      icon: <ShoppingBagIcon />,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: <BellIcon />,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: <BarChart3Icon />,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: <PieChartIcon />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <SettingsIcon />,
    },
  ],
}

function SidebarCollapseToggle() {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <button
      onClick={toggleSidebar}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "absolute -right-3.5 top-1/2 -translate-y-1/2 z-50",
        "size-7 rounded-full bg-white shadow-md border border-gray-100",
        "flex items-center justify-center",
        "text-[#6338f6] hover:bg-[#6338f6] hover:text-white hover:border-[#6338f6]",
        "transition-all duration-200 cursor-pointer"
      )}
    >
      {isCollapsed ? (
        <ChevronRightIcon size={14} strokeWidth={2.5} />
      ) : (
        <ChevronLeftIcon size={14} strokeWidth={2.5} />
      )}
    </button>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-none h-full transition-all duration-300 relative" {...props}>
      {/* Floating collapse toggle on the right edge */}
      <SidebarCollapseToggle />

      <SidebarHeader className="p-4 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Expanded state: white rounded box with logo */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white overflow-hidden group-data-[collapsible=icon]:hidden">
            <Image
              src="/Phsar Digital purple-light.png"
              alt="Phsar Digital Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          {/* Collapsed state: full logo image shown freely */}
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center">
            <Image
              src="/Phsar Digital purple-light.png"
              alt="Phsar Digital Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-bold text-lg">Phsar Digital</span>
            <span className="truncate text-xs text-white/70">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {data.navMain.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                    isActive 
                      ? "bg-white/20 text-white hover:bg-white/30" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="group-data-[collapsible=icon]:hidden rounded-2xl bg-white/10 p-4 relative overflow-hidden cursor-pointer">
          <div className="absolute -right-4 -bottom-4 size-24 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <ShieldIcon className="size-4 text-white" />
            </div>
            <p className="font-semibold text-white leading-tight mb-1">
              Secure Marketplace, Trusted by All.
            </p>
            <p className="text-[10px] text-white/50 mb-3">
              Phsar Digital Admin Panel
            </p>
            <div className="size-6 rounded-full bg-white/20 flex items-center justify-center ml-auto">
              <ArrowRightIcon className="size-3 text-white" />
            </div>
          </div>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2">
          <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
            <ShieldIcon className="size-4 text-white" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
