import { XIcon, PrinterIcon, PhoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrderQuickView() {
  return (
    <div className="bg-white h-full border-l border-gray-100 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-sm font-bold text-gray-900">Order Quick View</h4>
        <button className="text-gray-400 hover:text-gray-600"><XIcon size={18} /></button>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Buyer Details</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Name</span>
              <span className="font-bold text-gray-900">Dara Kim</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Email</span>
              <span className="font-bold text-gray-900 text-[#6338f6]">dara.kim@gmail.com</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Number</span>
              <span className="font-bold text-gray-900">+855 112 345 678</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Item Breakdown</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Quantity</span>
              <span className="font-bold text-gray-900">1 quantity</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Price</span>
              <span className="font-bold text-gray-900">$999.00</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-bold text-gray-900">$0.00</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</p>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-900">Tech Store Cambodia</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              23E040, Tech Store Cambodia<br />
              Halwa, TZ 56033
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Actions</p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full rounded-xl border-gray-100 h-12 text-xs font-bold flex items-center justify-center gap-2">
              <PrinterIcon size={14} />
              Print Packing Slip
            </Button>
            <Button className="w-full rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 h-12 text-xs font-bold border-none flex items-center justify-center gap-2">
              <PhoneIcon size={14} />
              Contact Buyer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
