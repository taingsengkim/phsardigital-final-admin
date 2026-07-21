"use client"

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const growthData = [
  { name: 'JAN', value: 400 },
  { name: 'FEB', value: 300 },
  { name: 'MAR', value: 600 },
  { name: 'APR', value: 500 },
  { name: 'MAY', value: 800 },
  { name: 'JUN', value: 750 },
];

export function CategoryGrowthChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={growthData}>
          <defs>
            <linearGradient id="categoryGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6338f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6338f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            dy={10} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6338f6" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#categoryGrowth)" 
            dot={{ r: 4, fill: '#6338f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#6338f6', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryListingsBar({ label, value, percentage, color }: { label: string, value: string, percentage: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">{value}</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
