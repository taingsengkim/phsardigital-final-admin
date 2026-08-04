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
  ShieldIcon
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="none" className="border-none bg-[#6338f6] text-white h-full" {...props}>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white overflow-hidden">
            <Image
              src="/Phsar Digital purple-light.png"
              alt="Phsar Digital Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-lg">Phsar Digital</span>
            <span className="truncate text-xs text-white/70">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
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
                    "flex items-center gap-3 px-3 py-6 rounded-xl transition-colors",
                    isActive 
                      ? "bg-white/20 text-white hover:bg-white/30" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-white/10 p-4 relative overflow-hidden group cursor-pointer">
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
      </SidebarFooter>
    </Sidebar>
  )
}
