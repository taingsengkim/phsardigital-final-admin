import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { DocumentViewer } from "@/components/documents/document-viewer"
import { DocumentHistory, ReviewActivityLog } from "@/components/documents/document-history"
import { DocumentReviewSidebar } from "@/components/documents/document-sidebar"
import { 
  FileCheckIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  XCircleIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DocumentsReviewPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Review Documents" 
          description="Review and verify seller submitted documents."
        >
          <div className="flex items-center gap-4">
             <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <Input 
                  placeholder="Search anything here..." 
                  className="pl-10 bg-white border-gray-100 rounded-xl h-11 w-80 shadow-sm"
                />
             </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl border-gray-200 h-11 font-semibold flex items-center gap-2 bg-white">
                  <ChevronLeftIcon size={16} />
                  Back to List
                </Button>
                <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
                  <button className="size-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                    <ChevronLeftIcon size={16} />
                  </button>
                  <span className="text-xs font-bold text-gray-900 px-2">3 of 78</span>
                  <button className="size-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
             </div>
          </div>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Pending Review" 
              value="34" 
              subtext="Documents"
              icon={ClockIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard 
              title="Approved Today" 
              value="18" 
              subtext="Documents"
              icon={CheckCircle2Icon}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <StatsCard 
              title="Rejected Today" 
              value="6" 
              subtext="Documents"
              icon={XCircleIcon}
              iconBgColor="bg-rose-50"
              iconColor="text-rose-500"
            />
            <StatsCard 
              title="Average Review Time" 
              value="2h 45m" 
              subtext="This Month"
              icon={ClockIcon}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DocumentViewer />
              <DocumentHistory />
              <ReviewActivityLog />
            </div>
            
            <div>
              <DocumentReviewSidebar />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
