"use client"

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const userGrowthData = [
  { name: 'May 12', newUsers: 800, totalUsers: 25000 },
  { name: 'May 13', newUsers: 950, totalUsers: 25950 },
  { name: 'May 14', newUsers: 850, totalUsers: 26800 },
  { name: 'May 15', newUsers: 1245, totalUsers: 28045 },
  { name: 'May 16', newUsers: 1100, totalUsers: 29145 },
  { name: 'May 17', newUsers: 900, totalUsers: 30045 },
  { name: 'May 18', newUsers: 1000, totalUsers: 31045 },
];

const listingsData = [
  { name: 'May 12', newListings: 1500 },
  { name: 'May 13', newListings: 2200 },
  { name: 'May 14', newListings: 2800 },
  { name: 'May 15', newListings: 3247 },
  { name: 'May 16', newListings: 2900 },
  { name: 'May 17', newListings: 2100 },
  { name: 'May 18', newListings: 2500 },
];

const revenueData = [
  { name: 'May 12', revenue: 5000 },
  { name: 'May 13', revenue: 6200 },
  { name: 'May 14', revenue: 5800 },
  { name: 'May 15', revenue: 7500 },
  { name: 'May 16', revenue: 6800 },
  { name: 'May 17', revenue: 6000 },
  { name: 'May 18', revenue: 8842.50 },
];

const topCategoriesData = [
  { name: 'Electronics', value: 35, color: '#6338f6' },
  { name: 'Property', value: 15, color: '#ff70d2' },
  { name: 'Services', value: 8, color: '#5ec2ff' },
  { name: 'Vehicles', value: 25, color: '#5356ff' },
  { name: 'Fashion', value: 12, color: '#ffb340' },
  { name: 'Others', value: 5, color: '#cbd5e1' },
];

export function UserGrowthChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={userGrowthData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Line type="monotone" dataKey="newUsers" stroke="#6338f6" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="totalUsers" stroke="#cbd5e1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ListingsOverviewChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={listingsData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="newListings" fill="#dcfce7" radius={[4, 4, 0, 0]} barSize={30}>
            {listingsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 3 ? '#6338f6' : '#dcfce7'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RevenueOverviewChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6338f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6338f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6338f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TopCategoriesChart() {
  return (
    <div className="h-[200px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={topCategoriesData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {topCategoriesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold">16,842</span>
        <span className="text-[10px] text-gray-400">Total Listings</span>
      </div>
    </div>
  )
}
