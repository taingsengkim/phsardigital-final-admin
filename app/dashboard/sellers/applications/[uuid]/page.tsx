import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ApplicationDetails } from "@/components/seller-applications/application-details"

export default async function SellerApplicationDetailsPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <ApplicationDetails applicationId={uuid} />
      </SidebarInset>
    </SidebarProvider>
  )
}
