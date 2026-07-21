import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  XIcon, 
  FileTextIcon, 
  ImageIcon, 
  FileIcon,
  BanIcon,
  AlertTriangleIcon
} from "lucide-react"

export function ReportInvestigationSidebar() {
  return (
    <div className="bg-[#6338f6] text-white rounded-3xl p-8 shadow-xl h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Badge className="bg-white/20 text-white border-none text-[8px] font-bold py-0.5 h-5 px-3">
            INVESTIGATION IN PROGRESS
          </Badge>
          <button className="text-white/50 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>

        <h3 className="text-2xl font-bold mb-1">#REP-9204</h3>
        <p className="text-xs text-white/70 mb-8">Flagged for Fraudulent Payment Request</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-4">
            <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mb-2">Reporter</p>
            <p className="text-sm font-bold truncate">Sok Chamroeun</p>
            <p className="text-[8px] text-white/50">Member since 2021</p>
          </div>
          <div className="bg-rose-400/20 border border-rose-400/30 rounded-2xl p-4">
            <p className="text-[8px] font-bold text-rose-200 uppercase tracking-widest mb-2">Target (Seller)</p>
            <p className="text-sm font-bold truncate">Serey Electronics</p>
            <p className="text-[8px] text-rose-200 font-bold">Trust Score: 1.4/5</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileTextIcon size={14} className="text-white/70" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Report Details</p>
            </div>
            <p className="text-xs text-white/80 leading-relaxed italic">
              "The seller sent me a message outside of the Phsar Digital app asking for a direct bank transfer instead of using the platform's secure payment gateway. When I refused, they threatened to cancel my order for the high-end gaming laptop."
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={14} className="text-white/70" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Evidence (3)</p>
            </div>
            <div className="flex gap-3">
              <div className="size-16 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                <div className="size-10 bg-white/20 rounded-md" />
              </div>
              <div className="size-16 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                <div className="w-12 h-8 bg-white/20 rounded-sm" />
              </div>
              <div className="size-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 border-dashed">
                <FileIcon size={16} className="text-white/30" />
                <span className="absolute text-[8px] text-white/30 mt-8">PDF LOG</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangleIcon size={14} className="text-white/70" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Activity Timeline</p>
            </div>
            <div className="space-y-4 pl-3 border-l border-white/20">
              <div className="relative">
                <div className="absolute -left-[16px] top-1 size-2 rounded-full bg-white" />
                <p className="text-[9px] font-bold">Report Submitted</p>
                <p className="text-[8px] text-white/50">Oct 24, 09:12 AM</p>
              </div>
              <div className="relative opacity-60">
                <div className="absolute -left-[16px] top-1 size-2 rounded-full bg-white/50" />
                <p className="text-[9px] font-bold">Automated Risk Analysis</p>
                <p className="text-[8px] text-white/50">Oct 24, 09:15 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[16px] top-1 size-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                <p className="text-[9px] font-bold">Investigation Started</p>
                <p className="text-[8px] text-white/50">Oct 24, 10:00 AM by Admin_Dara</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none font-bold text-[10px] h-11">
              Request More Info
            </Button>
            <Button className="flex-1 bg-white text-[#6338f6] hover:bg-white/90 font-bold text-[10px] h-11">
              Dismiss Report
            </Button>
          </div>
          <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] h-11 flex items-center justify-center gap-2">
            <BanIcon size={16} />
            Ban Seller Account
          </Button>
        </div>
      </div>
    </div>
  )
}
