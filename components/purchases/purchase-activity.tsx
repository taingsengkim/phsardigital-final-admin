export function PurchaseActivityLog() {
  const activities = [
    { date: "May 18, 2025 10:30 AM", event: "Order-2025-1030 processed by system" },
    { date: "May 18, 2025 10:35 AM", event: "Status changed from processing to shipped" },
  ]

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <h4 className="text-sm font-bold text-gray-900 mb-8">Purchase Activity Log</h4>
      <div className="space-y-8 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
        {activities.map((activity, i) => (
          <div key={i} className="relative pl-8">
            <div className="absolute left-0 top-1.5 size-2 rounded-full bg-gray-200" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{activity.date}</p>
            <p className="text-xs text-gray-700">{activity.event}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
