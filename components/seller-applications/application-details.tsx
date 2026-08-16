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
import type { SellerApplication } from "@/lib/types/seller-application"
import {
  useApproveSellerApplicationMutation,
  useGetSellerApplicationQuery,
  useRejectSellerApplicationMutation,
} from "@/lib/redux/service/sellerApplicationApi"

interface ApplicationDetailsProps {
  application: SellerApplication
  onClose: () => void
}

export function ApplicationDetails({ application, onClose }: ApplicationDetailsProps) {
  const { data: applicationDetails, isFetching } = useGetSellerApplicationQuery(application.id)
  const [approveApplication, { isLoading: isApproving }] = useApproveSellerApplicationMutation()
  const [rejectApplication, { isLoading: isRejecting }] = useRejectSellerApplicationMutation()
  const details = applicationDetails ?? application

  const handleApprove = async () => {
    await approveApplication(application.id).unwrap()
    onClose()
  }

  const handleReject = async () => {
    await rejectApplication(application.id).unwrap()
    onClose()
  }

  return (
    <div className="w-[400px] bg-white border-l border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
        <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600">
          <XIcon size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Applicant Header */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="size-24 mb-4">
            <AvatarImage src={details.avatar ?? undefined} />
            <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl font-bold">
              {details.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h4 className="text-xl font-bold text-gray-900">{details.name}</h4>
          <p className="text-sm text-gray-500 mb-3">{details.email}</p>
          <Badge variant="warning" className="font-bold py-1 px-3">
            • {details.status}
          </Badge>
          <p className="text-[10px] text-gray-400 mt-3">
            {isFetching ? "Loading details..." : `Applied on ${details.appliedOn} at ${details.appliedAt}`}
          </p>
        </div>
        
        {/* Business Information */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Information</h5>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Business Name</p>
              <p className="text-sm font-semibold text-gray-900">{details.businessName}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Business Type</p>
              <p className="text-sm font-semibold text-gray-900">{details.businessType}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Phone Number</p>
              <p className="text-sm font-semibold text-gray-900">{details.phone}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Business Email</p>
              <p className="text-sm font-semibold text-gray-900">{details.businessEmail}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Location</p>
              <p className="text-sm font-semibold text-gray-900">{details.location}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">Website / Social</p>
              <a href={details.website || "#"} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                {details.website || "Not provided"}
                <ExternalLinkIcon size={12} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Plan Requested */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan Requested</h5>
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
            <span className={`px-2 py-1 rounded text-[10px] font-bold ${details.planColor}`}>
              {details.plan}
            </span>
            <p className="text-sm font-bold text-gray-900">$9.99 <span className="text-[10px] text-gray-400 font-normal">/ month</span></p>
          </div>
        </div>
        
        {/* About Business */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">About Business</h5>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            {details.description}
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
        <Button disabled={isApproving || isRejecting} onClick={handleApprove} className="w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none rounded-xl h-11 font-bold flex items-center gap-2 shadow-none">
          <CheckCircle2Icon size={18} />
          {isApproving ? "Approving..." : "Approve Application"}
        </Button>
        <Button disabled={isApproving || isRejecting} onClick={handleReject} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 border-none rounded-xl h-11 font-bold flex items-center gap-2 shadow-none">
          <XCircleIcon size={18} />
          {isRejecting ? "Rejecting..." : "Reject Application"}
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
