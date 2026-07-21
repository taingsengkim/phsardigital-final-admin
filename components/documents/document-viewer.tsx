import { ZoomInIcon, ZoomOutIcon, RotateCcwIcon, DownloadIcon } from "lucide-react"

export function DocumentViewer() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Submitted Documents</h4>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600">
            <ZoomInIcon size={14} /> Zoom In
          </button>
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600">
            <ZoomOutIcon size={14} /> Zoom Out
          </button>
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600">
            <RotateCcwIcon size={14} /> Reset
          </button>
        </div>
      </div>
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase">National ID Card (Front)</p>
          <div className="aspect-[4/3] bg-blue-500 rounded-2xl relative overflow-hidden flex items-center justify-center p-8 border border-blue-600/20">
             {/* Mock ID Card UI */}
             <div className="bg-white/90 backdrop-blur w-full h-full rounded-xl p-6 relative">
                <div className="flex gap-4">
                  <div className="size-16 bg-gray-200 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 size-12 border-2 border-gray-100 rounded" />
             </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>national_id_front.jpg</span>
            <button className="text-[#6338f6] font-bold hover:underline">View Full Size</button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Business License</p>
          <div className="aspect-[4/3] bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center p-8">
             {/* Mock Certificate UI */}
             <div className="size-48 rounded-full border-[12px] border-blue-100 flex items-center justify-center relative opacity-60">
                <div className="size-36 rounded-full border-[1px] border-blue-200" />
                <div className="absolute flex flex-col items-center gap-1">
                  <div className="w-12 h-1 bg-blue-100 rounded" />
                  <div className="w-8 h-1 bg-blue-50 rounded" />
                </div>
             </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span>business_license.jpg</span>
            <button className="text-[#6338f6] font-bold hover:underline">View Full Size</button>
          </div>
        </div>
      </div>
    </div>
  )
}
