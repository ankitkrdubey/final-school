import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';

const defaultData = [
  { name: 'Mon', present: 850 },
  { name: 'Tue', present: 820 },
  { name: 'Wed', present: 910 },
  { name: 'Thu', present: 880 },
  { name: 'Fri', present: 840 },
  { name: 'Sat', present: 450 },
];

const AttendanceChart = ({ data = defaultData }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis 
            dataKey="name" 
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
            cursor={{ fill: 'var(--primary-light)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--bg-card)'
            }}
          />
          <Bar dataKey="present" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.present > 800 ? 'var(--primary)' : 'var(--secondary)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
