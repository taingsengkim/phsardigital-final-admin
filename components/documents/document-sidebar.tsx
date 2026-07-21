import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckIcon, 
  XIcon, 
  RotateCcwIcon, 
  ExternalLinkIcon,
  XCircleIcon
} from "lucide-react"

export function DocumentReviewSidebar() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full relative">
      <button className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
        <XCircleIcon size={20} />
      </button>

      <div className="text-center mb-8">
        <h4 className="font-bold text-gray-900 mb-6">Application Details</h4>
        <div className="relative inline-block mb-4">
          <Avatar className="size-24 rounded-3xl border-4 border-white shadow-xl">
            <AvatarImage src="/avatars/dara-kim.jpg" />
            <AvatarFallback className="bg-purple-100 text-purple-700 rounded-3xl text-2xl font-bold">DK</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>
        <h5 className="text-lg font-bold text-gray-900 mb-1">Dara Kim</h5>
        <p className="text-sm text-gray-500 mb-2">dara.kim@gmail.com</p>
        <Badge variant="warning" className="font-bold text-[10px] py-0 h-5 bg-amber-50 text-amber-500 border-none">
          • PENDING REVIEW
        </Badge>
        <p className="text-[10px] text-gray-400 mt-2">Applied on May 18, 2025 at 10:30 AM</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Business Information</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Business Name</span>
              <span className="font-bold text-gray-900">Tech Store Cambodia</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Business Type</span>
              <span className="font-bold text-gray-900">Electronics Retailer</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Phone Number</span>
              <span className="font-bold text-gray-900">+855 12 345 678</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Business Email</span>
              <span className="font-bold text-gray-900">info@techstore.com</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Location</span>
              <span className="font-bold text-gray-900">Phnom Penh, Cambodia</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Website / Social</span>
              <a href="#" className="text-blue-600 font-bold flex items-center gap-1">
                facebook.com/techstore <ExternalLinkIcon size={10} />
              </a>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Plan Requested</p>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
            <Badge className="bg-blue-500 hover:bg-blue-600 font-bold text-[10px]">Pro Plan</Badge>
            <span className="text-sm font-bold text-gray-900">$9.99 <span className="text-xs text-gray-400 font-normal">/ month</span></span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">About Business</p>
          <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
            We are an electronics store offering smartphones, laptops, accessories and smart gadgets. Our mission is to provide quality products with trusted service.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Notes (Admin Only)</p>
          <Textarea 
            placeholder="Add notes about this application..." 
            className="min-h-[100px] rounded-xl border-gray-100 resize-none text-xs"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-bold flex items-center justify-center gap-2 h-11">
          <CheckIcon size={18} />
          Approve Application
        </Button>
        <Button className="w-full rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border-none font-bold flex items-center justify-center gap-2 h-11">
          <XIcon size={18} />
          Reject Application
        </Button>
        <Button variant="ghost" className="w-full rounded-xl text-gray-500 hover:text-gray-700 font-bold flex items-center justify-center gap-2 h-11">
          <RotateCcwIcon size={18} />
          Request More Information
        </Button>
      </div>
    </div>
  )
}
