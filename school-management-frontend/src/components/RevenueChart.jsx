import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer 
} from 'recharts';

const defaultData = [
  { month: 'Jan', totalFee: 5000, collectedFee: 4000 },
  { month: 'Feb', totalFee: 4500, collectedFee: 3000 },
  { month: 'Mar', totalFee: 6000, collectedFee: 5000 },
  { month: 'Apr', totalFee: 5500, collectedFee: 4500 },
  { month: 'May', totalFee: 7000, collectedFee: 6000 },
  { month: 'Jun', totalFee: 6500, collectedFee: 5500 },
];

const RevenueChart = ({ data = defaultData }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--bg-card)'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', paddingTop: '10px' }} 
            iconType="circle"
          />
          <Area 
            type="monotone" 
            dataKey="totalFee" 
            name="Total Fee"
            stroke="var(--primary)" 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            strokeWidth={3}
          />
          <Area 
            type="monotone" 
            dataKey="collectedFee" 
            name="Collected Fee"
            stroke="var(--success)" 
            fillOpacity={1} 
            fill="url(#colorCollected)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
