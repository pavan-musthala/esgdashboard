import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const InvestmentsByCountryChart = ({ data }) => {
  const chartData = useMemo(() => {
    const countryInvestments = data.reduce((acc, item) => {
      if (!acc[item.country]) {
        acc[item.country] = 0;
      }
      acc[item.country] += item.investment || 0; // Handle potential undefined investments
      return acc;
    }, {});

    return Object.entries(countryInvestments)
      .map(([country, investment]) => ({ country, investment }))
      .sort((a, b) => b.investment - a.investment)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-2 text-white">Top 10 Countries by Investment</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="country" tick={{ fill: 'white' }} />
            <YAxis tick={{ fill: 'white' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: 'white' }}
            />
            <Bar dataKey="investment" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-white text-center">No investment data available</p>
      )}
    </div>
  );
};

export default InvestmentsByCountryChart;