import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EmissionsByThemeChart = ({ data }) => {
  // Define colors array (matching EmissionsByFundChart)
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  // Calculate total emissions for percentages
  const values = Object.values(data).map(theme => theme.scope1 + theme.scope2 + theme.scope3);
  const total = values.reduce((sum, value) => sum + value, 0);

  // Prepare data with percentages (matching EmissionsByFundChart format)
  const chartData = Object.entries(data).map(([theme, themeData]) => ({
    name: theme,
    value: themeData.scope1 + themeData.scope2 + themeData.scope3,
    percentage: (((themeData.scope1 + themeData.scope2 + themeData.scope3) / total) * 100).toFixed(1)
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
          label={({name, percentage}) => `${name} (${percentage}%)`}
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

export default EmissionsByThemeChart;
