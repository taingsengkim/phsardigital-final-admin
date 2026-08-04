import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardHeader } from "@/components/dashboard/header"
import { ReportTable, MostReportedSellers } from "@/components/reports/report-table"
import { ReportInvestigationSidebar } from "@/components/reports/report-sidebar"
import { 
  AlertCircleIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  FlagIcon,
  SearchIcon,
  PlusIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  MoreVerticalIcon,
  ChevronDownIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f8f9fc]">
        <DashboardHeader 
          title="Reports Manager" 
          description="Track and investigate user reports and platform incidents."
        >
          <div className="flex items-center gap-4">
             <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <Input 
                  placeholder="Search Report ID, User..." 
                  className="pl-10 bg-white border-gray-100 rounded-xl h-11 w-64 shadow-sm"
                />
             </div>
             <Button className="rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-11 px-6 font-bold">
               Create Alert
             </Button>
          </div>
        </DashboardHeader>
        
        <div className="p-8 space-y-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <StatsCard 
              title="Total Reports" 
              value="1,284" 
              trend="+ 12%"
              trendType="up"
              icon={AlertCircleIcon}
              iconBgColor="bg-white"
              iconColor="text-gray-400"
            />
            <StatsCard 
              title="Pending" 
              value="42" 
              subtext="Critical"
              trendType="neutral"
              icon={ClockIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            />
            {/* <StatsCard 
              title="Resolved" 
              value="1,150" 
              trend="+ 85%"
              trendType="up"
              icon={CheckCircle2Icon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            /> */}
            <StatsCard 
              title="Fraud Flags" 
              value="18" 
              icon={FlagIcon}
              iconBgColor="bg-white"
              iconColor="text-rose-500"
            />
            <StatsCard 
              title="Suspended" 
              value="24" 
              trend="+ 3%"
              trendType="up"
              icon={AlertCircleIcon}
              iconBgColor="bg-white"
              iconColor="text-gray-400"
            />
            {/* <StatsCard 
              title="Avg. Resolution" 
              value="4.2h" 
              trend="- 15%"
              trendType="down"
              icon={ClockIcon}
              iconBgColor="bg-white"
              iconColor="text-[#6338f6]"
            /> */}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button className="bg-[#6338f6] text-white rounded-xl h-10 px-6 font-bold text-xs">All Time</Button>
              <Button variant="ghost" className="text-gray-500 rounded-xl h-10 px-6 font-bold text-xs">Today</Button>
              <Button variant="ghost" className="text-gray-500 rounded-xl h-10 px-6 font-bold text-xs">Week</Button>
              <div className="w-[1px] h-6 bg-gray-200 mx-2" />
              <Button variant="outline" className="border-gray-200 text-gray-700 rounded-xl h-10 px-4 font-bold text-xs flex items-center gap-2 bg-white">
                Report Type <ChevronDownIcon size={14} />
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 rounded-xl h-10 px-4 font-bold text-xs flex items-center gap-2 bg-white">
                Priority <ChevronDownIcon size={14} />
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-400 rounded-xl h-10 px-4 font-bold text-xs flex items-center gap-2 bg-white">
                <PlusIcon size={14} /> More Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-200 text-gray-700 rounded-xl h-10 px-4 font-bold text-xs flex items-center gap-2 bg-white">
                <DownloadIcon size={14} /> Export
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 rounded-xl h-10 px-4 font-bold text-xs flex items-center gap-2 bg-white">
                <FileTextIcon size={14} /> Generate Summary
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ReportTable />
              <MostReportedSellers />
            </div>
            
            <div>
              <ReportInvestigationSidebar />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
