import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const defaultData = [
  { name: 'Students', value: 850, color: 'var(--primary)' },
  { name: 'Teachers', value: 45, color: '#f59e0b' },
  { name: 'Parents', value: 600, color: '#6366f1' },
  { name: 'Staff', value: 20, color: 'var(--secondary)' },
];

const UserOverviewChart = ({ data = defaultData, onItemClick }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                style={{ cursor: onItemClick ? 'pointer' : 'default' }}
                onClick={() => onItemClick && onItemClick(entry)}
              />
            ))}
          </Pie>
          <Tooltip 
            cursor={{ fill: 'var(--primary-light)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--bg-card)',
              fontWeight: 600
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: onItemClick ? 'pointer' : 'default' }}
            onClick={(props) => onItemClick && onItemClick(props.payload)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserOverviewChart;
