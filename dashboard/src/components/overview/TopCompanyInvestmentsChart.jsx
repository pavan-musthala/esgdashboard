import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopCompanyInvestmentsChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const topCompanies = useMemo(() => {
    return data
      .reduce((acc, item) => {
        const companyName = item.companyName;
        const investment = parseFloat(item.investment) || 0;
        if (!companyName) return acc;
        const existing = acc.find((c) => c.name === companyName);
        if (existing) existing.investment += investment;
        else acc.push({ name: companyName, investment });
        return acc;
      }, [])
      .sort((a, b) => b.investment - a.investment)
      .slice(0, 10);
  }, [data]);

  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  const handleMouseEnter = (_, index) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  if (topCompanies.length === 0) {
    return <div className="text-white/70">No company investment data available.</div>;
  }

  return (
    <div className="bg-black/50 p-6 rounded-xl shadow-lg border border-purple-900/20">
      <h2 className="text-2xl font-bold mb-2 text-white">Top 10 Companies by Investment</h2>
      <p className="text-sm text-purple-300/60 mb-6">
        Displaying the highest investment amounts across companies
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topCompanies} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: '#6366F1' }}
            formatter={(value) => [`$${value.toFixed(2)}M`, 'Investment']}
          />
          <Bar 
            dataKey="investment" 
            radius={[4, 4, 0, 0]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {topCompanies.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCompanyInvestmentsChart;
