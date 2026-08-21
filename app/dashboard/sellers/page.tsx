import { Suspense } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SellersWorkspace } from "@/components/sellers/sellers-workspace"

export default function SellersPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        {/* SellersWorkspace reads the active tab from the query string. */}
        <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading sellers...</div>}>
          <SellersWorkspace />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
