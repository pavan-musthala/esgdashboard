import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EmissionsByFundChart = ({ data }) => {
  // Define colors array
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  // Calculate total for percentages
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  // Prepare data with percentages
  const chartData = Object.entries(data).map(([fund, value]) => ({
    name: fund,
    value: value,
    percentage: ((value / total) * 100).toFixed(1)  // Calculate percentage
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({name, percentage}) => `${name} (${percentage}%)`}  // Show name and percentage
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => `${value.toLocaleString()} tons CO2e (${((value/total)*100).toFixed(1)}%)`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EmissionsByFundChart;