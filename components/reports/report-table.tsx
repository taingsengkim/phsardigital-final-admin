import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const reports = [
  {
    id: "#REP-9204",
    time: "2m ago",
    reporter: "Sok Chamroeun",
    reporterAvatar: "/avatars/sok.jpg",
    reporterColor: "bg-purple-100 text-purple-700",
    product: "IPHONE",
    reason: "scam",
    target: "Premium Electronic",
  },
  {
    id: "#REP-9198",
    time: "15m ago",
    reporter: "Ly Na",
    reporterAvatar: "/avatars/lyna.jpg",
    reporterColor: "bg-pink-100 text-pink-700",
    product: "HEADPHONE",
    reason: "scam",
    target: "Premium Electronic",
  },
  {
    id: "#REP-9182",
    time: "1h ago",
    reporter: "Keo Virak",
    reporterAvatar: "/avatars/virak.jpg",
    reporterColor: "bg-blue-100 text-blue-700",
    product: "LAPTOP",
    reason: "scam",
    target: "Lux Vengroth",
  },
]

export function ReportTable() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <h4 className="font-bold text-gray-900">Recent Incident Reports</h4>
        <button className="text-xs font-semibold text-[#6338f6] hover:underline">View Archived</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Report ID</th>
              <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reporter</th>
              <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
              <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Reason</th>
              <th className="p-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                <td className="p-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{report.id}</span>
                    <span className="text-[10px] text-gray-400">{report.time}</span>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-full">
                      <AvatarImage src={report.reporterAvatar} />
                      <AvatarFallback className={`${report.reporterColor} text-[10px] font-bold`}>
                        {report.reporter.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-gray-900">{report.reporter}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.product}</span>
                </td>
                <td className="p-8">
                  <span className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1">
                    ! {report.reason}
                  </span>
                </td>
                <td className="p-8">
                  <span className="text-sm font-bold text-[#6338f6]">{report.target}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function MostReportedSellers() {
  const sellers = [
    { name: "Premium Electronics KH", reports: 6, score: "3.2 / 5.0" },
    { name: "Vogue Fashion Shop", reports: 3, score: "4.1 / 5.0" },
  ]

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <h4 className="font-bold text-gray-900 text-sm mb-6">Most Reported Sellers</h4>
      <div className="space-y-6">
        {sellers.map((seller, index) => (
          <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="size-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
               {index === 0 ? "🏢" : "👜"}
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-gray-900">{seller.name}</h5>
              <p className="text-[10px] text-rose-500 font-bold">{seller.reports} Pending Reports</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{seller.score}</p>
              <p className="text-[10px] text-gray-400">Trust Score</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-8 text-xs font-bold text-[#6338f6] hover:underline">
        View Full Risk Analysis →
      </button>
    </div>
  )
}
