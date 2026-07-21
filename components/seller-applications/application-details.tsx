import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  XIcon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  RotateCcwIcon, 
  FileTextIcon,
  ExternalLinkIcon
} from "lucide-react"

export function ApplicationDetails() {
  return (
    <div className="w-[400px] bg-white border-l border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <XIcon size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Applicant Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="size-24 mb-4">
            <AvatarImage src="/avatars/dara.jpg" />
            <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-bold">DK</AvatarFallback>
          </Avatar>
          <h4 className="text-xl font-bold text-gray-900">Dara Kim</h4>
          <p className="text-sm text-gray-500 mb-3">dara.kim@gmail.com</p>
          <Badge variant="warning" className="font-bold py-1 px-3">
            • Pending Review
          </Badge>
          <p className="text-[10px] text-gray-400 mt-3">Applied on May 18, 2025 at 10:30 AM</p>
        </div>
        
        {/* Business Information */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Information</h5>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Business Name</p>
              <p className="text-sm font-semibold text-gray-900">Tech Store Cambodia</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Business Type</p>
              <p className="text-sm font-semibold text-gray-900">Electronics Retailer</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Phone Number</p>
              <p className="text-sm font-semibold text-gray-900">+855 12 345 678</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Business Email</p>
              <p className="text-sm font-semibold text-gray-900">info@techstore.com</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Location</p>
              <p className="text-sm font-semibold text-gray-900">Phnom Penh, Cambodia</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Website / Social</p>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                facebook.com/techstore
                <ExternalLinkIcon size={12} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Plan Requested */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Requested</h5>
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">Pro Plan</span>
            <p className="text-sm font-bold text-gray-900">$9.99 <span className="text-[10px] text-gray-400 font-normal">/ month</span></p>
          </div>
        </div>
        
        {/* About Business */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Business</h5>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            We are an electronics store offering smartphones, laptops, accessories and smart gadgets. Our mission is to provide quality products with trusted service.
          </p>
        </div>
        
        {/* Notes */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notes (Admin Only)</h5>
          <Textarea 
            placeholder="Add notes about this application..." 
            className="rounded-2xl border-gray-200 resize-none min-h-[100px] text-sm focus-visible:ring-[#6338f6]"
          />
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-50 space-y-3">
        <Button className="w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none rounded-xl h-11 font-bold flex items-center gap-2 shadow-none">
          <CheckCircle2Icon size={18} />
          Approve Application
        </Button>
        <Button className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border-none rounded-xl h-11 font-bold flex items-center gap-2 shadow-none">
          <XCircleIcon size={18} />
          Reject Application
        </Button>
        <Button variant="outline" className="w-full border-gray-200 text-gray-600 rounded-xl h-11 font-bold flex items-center gap-2">
          <RotateCcwIcon size={18} />
          Request More Information
        </Button>
        <Button className="w-full bg-[#6338f6]/10 text-[#6338f6] hover:bg-[#6338f6]/20 border-none rounded-xl h-11 font-bold flex items-center gap-2 shadow-none mt-2">
          <FileTextIcon size={18} />
          View Document
        </Button>
      </div>
    </div>
  )
}
