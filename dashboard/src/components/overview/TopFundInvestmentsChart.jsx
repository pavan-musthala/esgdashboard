import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopFundInvestmentsChart = ({ data }) => {
	const [activeIndex, setActiveIndex] = useState(null);

	const topFunds = useMemo(() => {
		return data
			.reduce((acc, item) => {
				const fund = item.fund;
				const investment = parseFloat(item.investment) || 0;
				if (!fund) return acc;
				const existing = acc.find((f) => f.fund === fund);
				if (existing) existing.investment += investment;
				else acc.push({ fund, investment });
				return acc;
			}, [])
			.sort((a, b) => b.investment - a.investment)
			.slice(0, 5);
	}, [data]);

	const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

	const handleMouseEnter = (_, index) => setActiveIndex(index);
	const handleMouseLeave = () => setActiveIndex(null);

	if (topFunds.length === 0) {
		return <div className="text-white/70">No data available</div>;
	}

	return (
		<div className="bg-black/50 p-6 rounded-xl shadow-lg border border-purple-900/20">
			<h2 className="text-2xl font-bold mb-2 text-white">Top 5 Funds by Investment</h2>
			<p className="text-sm text-purple-300/60 mb-6">
				Displaying the highest investment amounts across funds
			</p>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={topFunds} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<XAxis 
						dataKey="fund" 
						axisLine={false} 
						tickLine={false} 
						tick={{ fill: 'white', fontSize: 12 }} 
					/>
					<YAxis 
						axisLine={false} 
						tickLine={false} 
						tick={{ fill: 'white', fontSize: 12 }} 
					/>
					<Tooltip
						contentStyle={{ backgroundColor: 'black', border: '1px solid rgba(124, 58, 237, 0.2)' }}
						labelStyle={{ color: 'white' }}
						itemStyle={{ color: '#d8b4fe' }}
						formatter={(value) => [`$${value.toFixed(2)}M`, 'Investment']}
					/>
					<Bar 
						dataKey="investment" 
						radius={[4, 4, 0, 0]}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						{topFunds.map((entry, index) => (
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

export default TopFundInvestmentsChart;
