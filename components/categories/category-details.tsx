import { SmartphoneIcon, MoreHorizontalIcon, PlusIcon, UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CategoryDetails() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
        <div className="size-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <SmartphoneIcon size={40} className="text-[#6338f6]" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-1">Electronics</h4>
        <p className="text-[10px] font-bold text-[#6338f6] uppercase tracking-widest mb-8">Main Category</p>
        
        <div className="space-y-4 mb-8 text-left">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total Listings</span>
            <span className="font-bold text-gray-900">5,894</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Created Date</span>
            <span className="font-bold text-gray-900">May 12, 2023</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Last Updated</span>
            <span className="text-[#6338f6] font-bold">Just now</span>
          </div>
        </div>
        
        <div className="text-left mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            "Encompasses all electronic devices, consumer hardware, and digital accessories including mobile devices, computers, and home entertainment systems."
          </p>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full rounded-xl bg-[#6338f6] hover:bg-[#532edb] h-12 font-bold flex items-center justify-center gap-2">
            <PlusIcon size={18} />
            Add New Category
          </Button>
          <Button variant="outline" className="w-full rounded-xl border-gray-200 h-12 font-bold flex items-center justify-center gap-2">
            <PlusIcon size={18} />
            Add Subcategory
          </Button>
        </div>
      </div>
      
      <div className="bg-[#f8f7ff] rounded-3xl border border-purple-100 p-8 text-center cursor-pointer hover:bg-[#f1efff] transition-colors border-dashed">
        <div className="size-10 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadIcon size={18} className="text-[#6338f6]" />
        </div>
        <h5 className="text-sm font-bold text-gray-900 mb-1">Bulk Import Categories</h5>
        <p className="text-[10px] text-gray-400">Upload CSV or XLSX file</p>
      </div>
    </div>
  )
}
