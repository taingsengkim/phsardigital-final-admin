import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { NotificationComposer } from "@/components/notifications/notification-composer"
import { NotificationHistory } from "@/components/notifications/notification-history"

export default function NotificationsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Notifications Management" 
          description="Compose campaigns, schedule automated alerts, and monitor global notification open rates across all delivery channels."
        />
        
        <div className="p-8 space-y-8 max-w-6xl mx-auto w-full">
           <NotificationComposer />
           <NotificationHistory />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
