import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { dataApi } from "../api/dataApi";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { DollarSign, TrendingUp, Briefcase, BarChart2 } from "lucide-react";
import TopCompanyInvestmentsChart from "../components/overview/TopCompanyInvestmentsChart";
import TopFundInvestmentsChart from "../components/overview/TopFundInvestmentsChart";
import TopThemeInvestmentsChart from "../components/overview/TopThemeInvestmentsChart";
import DropdownFilter from "../components/common/DropdownFilter";

const OverviewPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data in OverviewPage...');
        const result = await dataApi.getData();
        console.log('Data fetched successfully:', result);
        setData(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      (selectedCompany === 'All' || item.companyName === selectedCompany) &&
      (selectedTheme === 'All' || item.theme === selectedTheme) &&
      (selectedCountry === 'All' || item.country === selectedCountry)
    );
  }, [data, selectedCompany, selectedTheme, selectedCountry]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const totalInvestment = filteredData.reduce((sum, item) => sum + (item.investment || 0), 0);
    const totalFundSize = filteredData.reduce((sum, item) => sum + (item.fundSize || 0), 0);
    const totalCapitalCommitted = filteredData.reduce((sum, item) => sum + (item.totalCapitalCommitted || 0), 0);
    const totalFundInvestments = filteredData.reduce((sum, item) => sum + (item.fundInvestments || 0), 0);

    return {
      totalInvestment: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalInvestment),
      totalFundSize: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalFundSize),
      totalCapitalCommitted: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalCapitalCommitted),
      totalFundInvestments
    };
  }, [filteredData]);

  const uniqueCompanies = useMemo(() => ['All', ...new Set(data.map(item => item.companyName))], [data]);
  const uniqueThemes = useMemo(() => ['All', ...new Set(data.map(item => item.theme))], [data]);
  const uniqueCountries = useMemo(() => ['All', ...new Set(data.map(item => item.country))], [data]);

  if (loading) return <div className="text-white text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className='flex-1 overflow-auto relative z-10 bg-gradient-to-br from-black via-purple-950/30 to-black'>
      <Header title='Overview' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* FILTERS */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <DropdownFilter
            options={uniqueCompanies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            label="Company Name"
            className="bg-black/50 border border-purple-900/20 text-purple-300/60"
          />
          <DropdownFilter
            options={uniqueThemes}
            value={selectedTheme}
            onChange={setSelectedTheme}
            label="Theme"
            className="bg-black/50 border border-purple-900/20 text-purple-300/60"
          />
          <DropdownFilter
            options={uniqueCountries}
            value={selectedCountry}
            onChange={setSelectedCountry}
            label="Country"
            className="bg-black/50 border border-purple-900/20 text-purple-300/60"
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="text-purple-300/60 text-center py-10 bg-black/50 rounded-xl border border-purple-900/20">
            No data available for the selected filters
          </div>
        ) : (
          <>
            {/* STATS */}
            {stats && (
              <motion.div
                className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StatCard 
                  name='Total Investment' 
                  icon={DollarSign} 
                  value={`${stats.totalInvestment}M`} 
                  color='rgb(139, 92, 246)' // Purple-500
                  className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
                />
                <StatCard 
                  name='Fund Size' 
                  icon={Briefcase} 
                  value={`${stats.totalFundSize}M`} 
                  color='rgb(139, 92, 246)' 
                  className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
                />
                <StatCard 
                  name='Capital Committed' 
                  icon={TrendingUp} 
                  value={`${stats.totalCapitalCommitted}M`} 
                  color='rgb(139, 92, 246)' 
                  className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
                />
                <StatCard 
                  name='Fund Investments' 
                  icon={BarChart2} 
                  value={stats.totalFundInvestments} 
                  color='rgb(139, 92, 246)' 
                  className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
                />
              </motion.div>
            )}

            {/* CHARTS */}
            <div className='space-y-8'>
              <div className="bg-black/50 p-6 rounded-xl border border-purple-900/20">
                <TopCompanyInvestmentsChart 
                  data={filteredData} 
                  className="text-purple-300/60"
                  chartColors={['rgb(139, 92, 246)', 'rgb(91, 33, 182)']} // Purple gradient
                />
              </div>
              <div className="bg-black/50 p-6 rounded-xl border border-purple-900/20">
                <TopFundInvestmentsChart 
                  data={filteredData} 
                  className="text-purple-300/60"
                  chartColors={['rgb(139, 92, 246)', 'rgb(91, 33, 182)']}
                />
              </div>
              <div className="bg-black/50 p-6 rounded-xl border border-purple-900/20">
                <TopThemeInvestmentsChart 
                  data={filteredData} 
                  className="text-purple-300/60"
                  chartColors={['rgb(139, 92, 246)', 'rgb(91, 33, 182)']}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OverviewPage;
