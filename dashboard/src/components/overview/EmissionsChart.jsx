import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const EmissionsChart = ({ data }) => {
  // Prepare grouped data
  const groupedData = useMemo(() => {
    // Group by companies
    const byCompanies = data.reduce((acc, item) => {
      const key = item.companyName;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          scope1: 0,
          scope2: 0,
          scope3: 0
        };
      }
      acc[key].scope1 += item.scope1Emissions || 0;
      acc[key].scope2 += item.scope2Emissions || 0;
      acc[key].scope3 += item.scope3Emissions || 0;
      return acc;
    }, {});

    // Group by countries
    const byCountries = data.reduce((acc, item) => {
      const key = item.country;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          scope1: 0,
          scope2: 0,
          scope3: 0
        };
      }
      acc[key].scope1 += item.scope1Emissions || 0;
      acc[key].scope2 += item.scope2Emissions || 0;
      acc[key].scope3 += item.scope3Emissions || 0;
      return acc;
    }, {});

    // Group by funds
    const byFunds = data.reduce((acc, item) => {
      const key = item.fund;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          scope1: 0,
          scope2: 0,
          scope3: 0
        };
      }
      acc[key].scope1 += item.scope1Emissions || 0;
      acc[key].scope2 += item.scope2Emissions || 0;
      acc[key].scope3 += item.scope3Emissions || 0;
      return acc;
    }, {});

    return {
      companies: Object.values(byCompanies),
      countries: Object.values(byCountries),
      funds: Object.values(byFunds)
    };
  }, [data]);

  const COLORS = {
    scope1: '#6366F1',
    scope2: '#10B981',
    scope3: '#F59E0B'
  };

  const renderGroupedBarChart = (data, title) => (
    <motion.div
      className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg border border-gray-700 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#9CA3AF' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => value.toLocaleString()}
          />
          <Legend />
          <Bar dataKey="scope1" name="Scope 1" fill={COLORS.scope1} radius={[4, 4, 0, 0]} />
          <Bar dataKey="scope2" name="Scope 2" fill={COLORS.scope2} radius={[4, 4, 0, 0]} />
          <Bar dataKey="scope3" name="Scope 3" fill={COLORS.scope3} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );

  return (
    <div>
      {renderGroupedBarChart(groupedData.companies, 'Emissions by Company')}
      {renderGroupedBarChart(groupedData.countries, 'Emissions by Country')}
      {renderGroupedBarChart(groupedData.funds, 'Emissions by Fund')}
    </div>
  );
};

export default EmissionsChart;
