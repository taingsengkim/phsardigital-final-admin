import { XIcon, PrinterIcon, PhoneIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Purchase } from "@/lib/types/purchase"
import { useGetPurchaseQuery } from "@/lib/redux/service/purchaseApi"

interface OrderQuickViewProps {
  purchase: Purchase
  onClose: () => void
}

export function OrderQuickView({ purchase, onClose }: OrderQuickViewProps) {
  const { data } = useGetPurchaseQuery(purchase.id)
  const details = data ?? purchase

  return (
    <div className="bg-white h-full border-l border-gray-100 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-sm font-bold text-gray-900">Order Quick View</h4>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon size={18} /></button>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Buyer Details</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Name</span>
              <span className="font-bold text-gray-900">{details.buyer}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Email</span>
              <span className="font-bold text-gray-900 text-[#6338f6]">{details.buyerEmail}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Number</span>
              <span className="font-bold text-gray-900">{details.buyerPhone}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Item Breakdown</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Quantity</span>
              <span className="font-bold text-gray-900">{details.quantity} quantity</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Price</span>
              <span className="font-bold text-gray-900">{details.price}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-bold text-gray-900">{details.deliveryFee}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</p>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-900">{details.seller}</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {details.shippingAddress}
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
