import { Badge } from "@/components/ui/badge"

const history = [
  {
    date: "May 18, 2025 10:30 AM",
    type: "National ID (Front)",
    fileName: "national_id_front.jpg",
    reviewedBy: "—",
    status: "Pending",
    remarks: "First submission",
  },
  {
    date: "May 18, 2025 10:30 AM",
    type: "Business License",
    fileName: "business_license.jpg",
    reviewedBy: "—",
    status: "Pending",
    remarks: "First submission",
  },
]

export function DocumentHistory() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50">
        <h4 className="font-bold text-gray-900 text-sm">Document History</h4>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Type</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">File Name</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reviewed By</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="p-6 text-xs text-gray-500">{item.date}</td>
                <td className="p-6 text-xs font-bold text-gray-900">{item.type}</td>
                <td className="p-6 text-xs text-[#6338f6] font-medium">{item.fileName}</td>
                <td className="p-6 text-xs text-gray-500">{item.reviewedBy}</td>
                <td className="p-6">
                  <Badge variant="warning" className="font-bold text-[8px] py-0 h-4 bg-amber-50 text-amber-500 border-none">
                    {item.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-6 text-xs text-gray-400">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ReviewActivityLog() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <h4 className="font-bold text-gray-900 text-sm mb-6">Review Activity Log</h4>
      
      <div className="relative pl-6 space-y-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
        <div className="relative">
          <div className="absolute -left-[27px] top-1.5 size-2 rounded-full bg-[#6338f6] border-2 border-white shadow-sm" />
          <p className="text-[10px] text-gray-400 mb-1">May 18, 2025 10:30 AM</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-900">Application submitted by Dara Kim</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 font-bold uppercase">System</span>
          </div>
        </div>
      </div>
    </div>
  )
}
