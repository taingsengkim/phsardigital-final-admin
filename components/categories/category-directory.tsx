import { Badge } from "@/components/ui/badge"
import { 
  MoreHorizontalIcon, 
  PencilIcon, 
  Trash2Icon, 
  SmartphoneIcon, 
  CarIcon, 
  HomeIcon 
} from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: <SmartphoneIcon className="size-4 text-purple-600" />,
    iconBg: "bg-purple-50",
    count: "5,894",
    status: "Active",
  },
  {
    id: 2,
    name: "Vehicles",
    icon: <CarIcon className="size-4 text-blue-600" />,
    iconBg: "bg-blue-50",
    count: "2,412",
    status: "Active",
  },
  {
    id: 3,
    name: "Property",
    icon: <HomeIcon className="size-4 text-indigo-600" />,
    iconBg: "bg-indigo-50",
    count: "1,890",
    status: "Inactive",
  },
]

export function CategoryDirectory() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50">
        <h4 className="font-bold text-gray-900">Category Directory</h4>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Icon</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category Name</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Listings Count</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <div className={`size-10 rounded-xl ${cat.iconBg} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-sm font-bold text-gray-900">{cat.name}</span>
                </td>
                <td className="p-6 text-sm text-gray-500 font-medium">{cat.count}</td>
                <td className="p-6">
                  <Badge 
                    variant={cat.status === "Active" ? "success" : "secondary"}
                    className="font-bold text-[10px] py-0 h-5"
                  >
                    {cat.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <PencilIcon size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
