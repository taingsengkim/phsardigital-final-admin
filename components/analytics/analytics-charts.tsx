"use client"

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area
} from 'recharts';

const userGrowthData = [
  { name: 'Mon', active: 15000, new: 2000 },
  { name: 'Tue', active: 17000, new: 2500 },
  { name: 'Wed', active: 16000, new: 1800 },
  { name: 'Thu', active: 22000, new: 2800 },
  { name: 'Fri', active: 18000, new: 2200 },
  { name: 'Sat', active: 14000, new: 1500 },
  { name: 'Sun', active: 12000, new: 1200 },
];

export function UserGrowthBarChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={userGrowthData} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            dy={10} 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="active" stackId="a" fill="#e2e8f0" radius={[0, 0, 0, 0]} />
          <Bar dataKey="new" stackId="a" fill="#cbd5e1" radius={[10, 10, 0, 0]}>
            {userGrowthData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 3 ? '#6338f6' : '#f1f5f9'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const buyerSellerData = [
  { name: 'Active Buyers', value: 20400, color: '#6338f6' },
  { name: 'Active Sellers', value: 4400, color: '#f1f5f9' },
];

export function BuyerSellerDonutChart() {
  return (
    <div className="h-[200px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={buyerSellerData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            {buyerSellerData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold">82%</span>
        <span className="text-[10px] text-gray-400">Buyers</span>
      </div>
    </div>
  )
}

const revenueTrendData = [
  { name: '1', value: 100000 },
  { name: '5', value: 120000 },
  { name: '10', value: 110000 },
  { name: '15', value: 130000 },
  { name: '20', value: 125000 },
  { name: '25', value: 148290 },
  { name: '30', value: 140000 },
];

export function RevenueTrendChart() {
  return (
    <div className="h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueTrendData}>
          <defs>
            <linearGradient id="colorRevenueWhite" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#6338f6', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#ffffff" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorRevenueWhite)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AnalyticsListingsBar({ label, value, percentage, color }: { label: string, value: string, percentage: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px]">
        <span className="font-medium text-gray-500 uppercase">{label}</span>
        <span className="font-bold text-gray-900">{value} ({percentage}%)</span>
      </div>
      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
