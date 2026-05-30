import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const defaultData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const IncomeVsExpenseChart = ({ data = defaultData }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20, right: 10, left: -20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
          />
          <Tooltip 
            cursor={{ fill: 'var(--bg-body)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: 'var(--bg-card)',
              fontWeight: 600
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', paddingTop: '10px' }} 
            iconType="circle"
          />
          <Bar dataKey="income" name="Income" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="expense" name="Expense" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeVsExpenseChart;
