import React, { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp, Search, Globe } from "lucide-react";
import TopCompaniesTable from "../components/companies/TopCompaniesTable";
import { dataApi } from "../api/dataApi";

const TopCompaniesPage = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterCriteria, setFilterCriteria] = useState('all');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await dataApi.getData();
				setData(result);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError(err.message || 'An error occurred while fetching data');
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredData = useMemo(() => {
		return data.filter(company => 
			company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(filterCriteria === 'all' || company.country === filterCriteria)
		);
	}, [data, searchTerm, filterCriteria]);

	const countries = useMemo(() => [...new Set(data.map(company => company.country))], [data]);

	const aggregateAndSortCompanies = (key, n = 5) => {
		return Object.values(filteredData.reduce((acc, item) => {
			if (!acc[item.companyName]) {
				acc[item.companyName] = { ...item };
			} else {
				acc[item.companyName][key] += item[key];
			}
			return acc;
		}, {}))
			.sort((a, b) => b[key] - a[key])
			.slice(0, n);
	};

	const topCompaniesByFundSize = useMemo(() => aggregateAndSortCompanies('fundSize'), [filteredData]);
	const topCompaniesByCapitalCommitted = useMemo(() => aggregateAndSortCompanies('totalCapitalCommitted'), [filteredData]);
	const topCompaniesByInvestment = useMemo(() => aggregateAndSortCompanies('investment'), [filteredData]);
	const topCompaniesByFundInvestments = useMemo(() => aggregateAndSortCompanies('fundInvestments'), [filteredData]);

	if (loading) return <div className="text-white text-center py-10">Loading...</div>;
	if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

	const totalCompanies = new Set(filteredData.map(item => item.companyName)).size;
	const totalFundSize = filteredData.reduce((sum, company) => sum + company.fundSize, 0);
	const avgFundSize = totalCompanies > 0 ? totalFundSize / totalCompanies : 0;
	const totalCapitalCommitted = filteredData.reduce((sum, company) => sum + company.totalCapitalCommitted, 0);
	const totalInvestment = filteredData.reduce((sum, company) => sum + company.investment, 0);

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gradient-to-br from-black via-purple-950/30 to-black'>
			<Header title='Companies' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
					<div className="relative flex-grow mb-4 md:mb-0">
						<input
							type="text"
							placeholder="Search companies..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full p-3 pl-10 pr-4 bg-black/50 border border-purple-900/20 
									 rounded-xl focus:outline-none focus:border-purple-900/50 
									 text-white placeholder-purple-300/60 transition-all duration-200"
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300/60" size={20} />
					</div>
					<div className="relative">
						<select
							value={filterCriteria}
							onChange={(e) => setFilterCriteria(e.target.value)}
							className="w-full md:w-auto appearance-none bg-black/50 
									 border border-purple-900/20 rounded-xl py-3 px-4 pr-10
									 focus:outline-none focus:border-purple-900/50
									 text-purple-300/60 transition-all duration-200"
						>
							<option value="all">All Countries</option>
							{countries.map(country => (
									<option key={country} value={country}>{country}</option>
							))}
						</select>
						<Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/60 pointer-events-none" size={20} />
					</div>
				</div>

				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
				>
					<StatCard 
						name='Total Companies' 
						icon={Package} 
						value={totalCompanies} 
						color='rgb(139, 92, 246)'
						className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all" 
					/>
					<StatCard 
						name='Avg Fund Size' 
						icon={TrendingUp} 
						value={`$${avgFundSize.toFixed(2)}M`} 
						color='rgb(139, 92, 246)'
						className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all" 
					/>
					<StatCard 
						name='Total Capital Committed' 
						icon={AlertTriangle} 
						value={`$${totalCapitalCommitted.toFixed(2)}B`} 
						color='rgb(139, 92, 246)'
						className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all" 
					/>
					<StatCard 
						name='Total Investment' 
						icon={DollarSign} 
						value={`$${totalInvestment.toFixed(2)}M`} 
						color='rgb(139, 92, 246)'
						className="bg-black/50 border border-purple-900/20 hover:border-purple-900/50 transition-all" 
					/>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
					<TopCompaniesTable 
						title="Top 5 Companies by Fund Size" 
						data={topCompaniesByFundSize} 
						valueKey="fundSize" 
						valueName="Fund Size ($M)"
					/>
					<TopCompaniesTable 
						title="Top 5 Companies by Total Capital Committed" 
						data={topCompaniesByCapitalCommitted} 
						valueKey="totalCapitalCommitted" 
						valueName="Capital Committed ($B)"
					/>
					<TopCompaniesTable 
						title="Top 5 Companies by Investment" 
						data={topCompaniesByInvestment} 
						valueKey="investment" 
						valueName="Investment ($M)"
					/>
					<TopCompaniesTable 
						title="Top 5 Companies by Fund Investments" 
						data={topCompaniesByFundInvestments} 
						valueKey="fundInvestments" 
						valueName="Fund Investments"
					/>
				</div>
			</main>
		</div>
	);
};

export default TopCompaniesPage;
