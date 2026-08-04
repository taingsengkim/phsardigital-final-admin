"use client"

import { ClipboardListIcon, BanIcon, UserXIcon, FlagIcon, KeyboardIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ListingRecord } from "@/lib/features/marketplace/marketplaceApi"

interface ListingAuditSidebarProps {
  listing: ListingRecord | null
}

export function ListingAuditSidebar({ listing }: ListingAuditSidebarProps) {
  return (
    <div className="w-100 flex flex-col gap-6 sticky top-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6338f6]">
            <ClipboardListIcon size={16} />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Listing Audit Panel</h4>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="aspect-4/3 bg-gray-100 rounded-2xl overflow-hidden relative">
            {listing?.imageUrl ? (
              <img src={listing.imageUrl} alt={listing.name} className="size-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product Name</p>
              <p className="text-xs font-bold text-gray-900">{listing?.name ?? "Select a listing"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
              <p className="text-xs font-bold text-gray-900">{listing?.category ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seller</p>
              <p className="text-xs font-bold text-[#6338f6] underline">{listing?.seller ?? "-"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
              <p className="text-xs font-bold text-[#6338f6]">{listing?.price ?? "$0.00"}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {listing?.description ?? "Select a listing to review its moderation details."}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Notes (Internal)</p>
            <Textarea 
              placeholder="Explain rejection reason or leave internal notes..." 
              className="bg-gray-50 border-none rounded-2xl min-h-25 text-xs font-medium placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#6338f6]"
            />
            <p className="text-right text-[10px] text-gray-400 font-medium">0 / 250 CHARACTERS</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <Button className="bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl h-11 font-bold flex items-center gap-2">
                <BanIcon size={16} />
                Ban Product
             </Button>
             <Button variant="outline" className="border-rose-200 text-[#e11d48] hover:bg-rose-50 rounded-xl h-11 font-bold flex items-center gap-2">
                <UserXIcon size={16} />
                Ban Seller
             </Button>
          </div>
          
          <Button variant="outline" className="w-full border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl h-11 font-bold flex items-center justify-center gap-2">
             <FlagIcon size={16} />
             Flag for Review
          </Button>
        </div>
      </div>

      <div className="bg-[#f1f5f9] p-6 rounded-3xl flex items-center gap-4 border border-gray-100">
        <div className="size-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
          <KeyboardIcon size={20} />
        </div>
        <div>
           <p className="text-xs font-bold text-gray-900">Pro Tip: Keyboard Shortcuts</p>
           <p className="text-[10px] text-gray-500 font-medium">Shift + R to Reject / Ban Product</p>
        </div>
      </div>
    </div>
  )
}
