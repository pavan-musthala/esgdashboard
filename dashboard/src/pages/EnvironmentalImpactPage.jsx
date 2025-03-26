import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { dataApi } from "../api/dataApi";
import TopCompaniesTable from "../components/companies/TopCompaniesTable";
import EmissionsByFundChart from "../components/environmental/EmissionsByFundChart";
import EmissionsByThemeChart from "../components/environmental/EmissionsByThemeChart";
import EmissionsChart from "../components/overview/EmissionsChart";
import DropdownFilter from "../components/common/DropdownFilter";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500">Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

const EnvironmentalImpactPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedFund, setSelectedFund] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dataApi.getData();
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

  const companies = useMemo(() => {
    return ['All', ...new Set(data.map(item => item.companyName))];
  }, [data]);

  const funds = useMemo(() => {
    return ['All', ...new Set(data.map(item => item.fund))];
  }, [data]);

  const countries = useMemo(() => {
    return ['All', ...new Set(data.map(item => item.country))];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      (selectedCompany === 'All' || item.companyName === selectedCompany) &&
      (selectedFund === 'All' || item.fund === selectedFund) &&
      (selectedCountry === 'All' || item.country === selectedCountry)
    );
  }, [data, selectedCompany, selectedFund, selectedCountry]);

  const aggregatedData = useMemo(() => {
    if (!filteredData.length) return null;

    const totalEmissions = filteredData.reduce((sum, item) => sum + (item.totalEmissions || 0), 0);
    const averageEmissionsPerTheme = totalEmissions / filteredData.length;

    const totalScope1 = filteredData.reduce((sum, item) => sum + (item.scope1Emissions || 0), 0);
    const totalScope2 = filteredData.reduce((sum, item) => sum + (item.scope2Emissions || 0), 0);
    const totalScope3 = filteredData.reduce((sum, item) => sum + (item.scope3Emissions || 0), 0);

    const companyEmissions = filteredData.reduce((acc, item) => {
      if (!acc[item.companyName]) {
        acc[item.companyName] = {
          companyName: item.companyName,
          totalEmissions: 0,
          fund: item.fund,
          theme: item.theme,
          country: item.country,
        };
      }
      acc[item.companyName].totalEmissions += item.totalEmissions || 0;
      return acc;
    }, {});

    const topLowEmissionCompanies = Object.values(companyEmissions)
      .sort((a, b) => a.totalEmissions - b.totalEmissions)
      .slice(0, 5);

    const emissionsByTheme = filteredData.reduce((acc, item) => {
      if (!acc[item.theme]) {
        acc[item.theme] = { scope1: 0, scope2: 0, scope3: 0 };
      }
      acc[item.theme].scope1 += item.scope1Emissions || 0;
      acc[item.theme].scope2 += item.scope2Emissions || 0;
      acc[item.theme].scope3 += item.scope3Emissions || 0;
      return acc;
    }, {});

    const emissionsByFund = filteredData.reduce((acc, item) => {
      if (!acc[item.fund]) {
        acc[item.fund] = 0;
      }
      acc[item.fund] += item.totalEmissions || 0;
      return acc;
    }, {});

    // Calculate percentages for funds
    const emissionsByFundWithPercentages = Object.entries(emissionsByFund).reduce((acc, [fund, value]) => {
      acc[fund] = value; // Remove percentage from label since it will be shown in tooltip
      return acc;
    }, {});

    // Calculate percentages for themes
    const emissionsByThemeWithPercentages = Object.entries(emissionsByTheme).reduce((acc, [theme, values]) => {
      acc[theme] = values; // Remove percentage from label since it will be shown in tooltip
      return acc;
    }, {});

    return { 
      totalEmissions, 
      averageEmissionsPerTheme, 
      topLowEmissionCompanies, 
      emissionsByTheme: emissionsByThemeWithPercentages, 
      emissionsByFund: emissionsByFundWithPercentages,
      totalScope1,
      totalScope2,
      totalScope3
    };
  }, [filteredData]);

  if (loading) return <div className="text-white text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!data || data.length === 0) return <div className="text-white text-center py-10">No data available</div>;

  return (
    <div className='flex-1 overflow-auto relative z-10 bg-gradient-to-br from-black via-purple-950/30 to-black'>
      <Header title='Environmental Impact Analysis' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DropdownFilter
            options={companies}
            value={selectedCompany}
            onChange={setSelectedCompany}
            label="Filter by Company"
            className="bg-black/50 border border-purple-900/20 text-purple-300/60"
          />
          <DropdownFilter
            options={funds}
            value={selectedFund}
            onChange={setSelectedFund}
            label="Filter by Fund"
            className="bg-black/50 border border-purple-900/20 text-purple-300/60"
          />
          <DropdownFilter
            options={countries}
            value={selectedCountry}
            onChange={setSelectedCountry}
            label="Filter by Country"
            className="bg-black/50 border border-purple-900/20 text-purple-300/60"
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="text-purple-300/60 text-center py-10 bg-black/50 rounded-xl border border-purple-900/20">
            No data matches the selected filters. Please adjust your selection.
          </div>
        ) : (
          <>
            <motion.div
              className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StatCard
                name='Total Emissions by Fund (tons of CO2e)'
                icon={Leaf}
                value={aggregatedData.totalEmissions.toLocaleString()}
                color='rgb(139, 92, 246)'
                className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
              />
              <StatCard
                name='Scope 1 Emissions (tons of CO2e)'
                icon={BarChart2}
                value={aggregatedData.totalScope1.toLocaleString()}
                color='rgb(139, 92, 246)'
                className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
              />
              <StatCard
                name='Scope 2 Emissions (tons of CO2e)'
                icon={BarChart2}
                value={aggregatedData.totalScope2.toLocaleString()}
                color='rgb(139, 92, 246)'
                className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
              />
              <StatCard
                name='Scope 3 Emissions (tons of CO2e)'
                icon={BarChart2}
                value={aggregatedData.totalScope3.toLocaleString()}
                color='rgb(139, 92, 246)'
                className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all"
              />
            </motion.div>
            <div className="mb-8 bg-black/50 rounded-xl border border-purple-900/20 p-6">
              <TopCompaniesTable 
                title="Top 5 Companies by Lowest Emissions" 
                data={aggregatedData.topLowEmissionCompanies}
                valueKey="totalEmissions"
                valueName="Total Emissions (tons of CO2e)"
                className="text-purple-300/60"
              />
            </div>
            <div className='flex flex-col gap-6 mt-8'>
              <div className="bg-black/50 p-6 rounded-xl border border-purple-900/20" style={{ height: '400px' }}>
                <h3 className="text-white mb-4 font-medium">Emissions By Fund Chart</h3>
                <ErrorBoundary>
                  <EmissionsByFundChart 
                    data={aggregatedData.emissionsByFund}
                    chartColors={['rgb(139, 92, 246)', 'rgb(91, 33, 182)']}
                    className="text-purple-300/60"
                  />
                </ErrorBoundary>
              </div>
              <div className="bg-black/50 p-6 rounded-xl border border-purple-900/20" style={{ height: '400px' }}>
                <h3 className="text-white mb-4 font-medium">Emissions By Theme Chart</h3>
                <ErrorBoundary>
                  <EmissionsByThemeChart 
                    data={aggregatedData.emissionsByTheme}
                    chartColors={['rgb(139, 92, 246)', 'rgb(91, 33, 182)']}
                    className="text-purple-300/60"
                  />
                </ErrorBoundary>
              </div>
            </div>
            <div className="mt-8 bg-black/50 p-6 rounded-xl border border-purple-900/20">
              <ErrorBoundary>
                <EmissionsChart 
                  data={filteredData}
                  chartColors={['rgb(139, 92, 246)', 'rgb(91, 33, 182)']}
                  className="text-purple-300/60"
                />
              </ErrorBoundary>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EnvironmentalImpactPage;
