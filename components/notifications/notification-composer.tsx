"use client"

import { BellIcon, SendIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function NotificationComposer() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6338f6]">
          <BellIcon size={16} />
        </div>
        <h4 className="text-lg font-bold text-gray-900">Notification Composer</h4>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Audience</p>
            <Select defaultValue="all">
              <SelectTrigger className="bg-gray-50 border-none rounded-2xl h-12 text-sm font-medium focus:ring-1 focus:ring-[#6338f6]">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100">
                <SelectItem value="all">All Active Users</SelectItem>
                <SelectItem value="buyers">All Buyers</SelectItem>
                <SelectItem value="sellers">All Sellers</SelectItem>
                <SelectItem value="pro">Pro Subscribers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Delivery Channels</p>
            <div className="flex items-center gap-6 h-12">
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox defaultChecked className="size-5 rounded-md border-gray-200 data-[state=checked]:bg-[#6338f6] data-[state=checked]:border-[#6338f6]" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Push</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox className="size-5 rounded-md border-gray-200 data-[state=checked]:bg-[#6338f6] data-[state=checked]:border-[#6338f6]" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Email</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Notification Title</p>
          <Input 
            placeholder="e.g. Flash Sale Alert: Up to 50% Off!" 
            className="bg-gray-50 border-none rounded-2xl h-12 text-sm font-medium placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#6338f6]"
          />
        </div>

        <div className="space-y-3 relative">
          <div className="flex justify-between items-center px-1">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Body</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">84 / 160</p>
          </div>
          <Textarea 
            placeholder="Don't miss out on our biggest sale of the season. Shop trending electronics and fashion items at half the price. Valid today only!" 
            className="bg-gray-50 border-none rounded-3xl min-h-[140px] text-sm font-medium leading-relaxed placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-[#6338f6] p-6"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
           <button className="flex items-center gap-2 text-[#6338f6] font-bold text-sm hover:underline group">
              <CalendarIcon size={16} className="text-[#6338f6]" />
              Schedule for later
           </button>
           <Button className="bg-[#6338f6] hover:bg-[#532edb] text-white px-10 h-14 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-100">
              <SendIcon size={18} />
              Send Notification
           </Button>
        </div>
      </div>
    </div>
  )
}
