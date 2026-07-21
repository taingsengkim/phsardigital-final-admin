import { SearchIcon, ChevronDownIcon, FilterIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BuyerFilters() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-100 mb-6">
      <div className="relative w-full md:w-96">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        <Input 
          placeholder="Search by name, email or phone..." 
          className="pl-10 bg-gray-50 border-none rounded-xl h-11"
        />
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="bg-gray-50 px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-sm font-medium text-gray-600">All Status</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </div>
        
        <div className="bg-gray-50 px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="text-sm font-medium text-gray-600">All Join Dates</span>
          <ChevronDownIcon size={14} className="text-gray-400" />
        </div>
        
        <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 font-semibold flex items-center gap-2">
          <FilterIcon size={16} />
          Filters
        </Button>
      </div>
    </div>
  )
}
