import React, { useState, useEffect, useMemo } from 'react';
import Header from "../components/common/Header";
import WorldMap from "../components/map/WorldMap";
import { dataApi } from "../api/dataApi";
import CompanyFilter from "../components/CompanyFilter";

const MapsPage = () => {
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState('');

	useEffect(() => {
		const fetchCompanies = async () => {
			const data = await dataApi.getData();
			setCompanies(data);
		};
		fetchCompanies();
	}, []);

	const uniqueCompanies = useMemo(() => {
		const uniqueNames = [...new Set(companies.map(company => company.companyName))];
		return uniqueNames.map(name => ({
			companyName: name
		}));
	}, [companies]);

	const handleCompanyChange = (companyName) => {
		setSelectedCompany(companyName);
	};

	return (
		<div className='flex-1 relative z-10 overflow-auto bg-gradient-to-br from-black via-purple-950/30 to-black'>
			<Header title="Map the Companies" />
			<div className="max-w-7xl mx-auto p-6">
				<h1 className="text-2xl font-semibold text-white mb-6">Company Map</h1>
				
				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6 mb-6">
					<CompanyFilter
						companies={uniqueCompanies}
						selectedCompany={selectedCompany}
						onCompanyChange={handleCompanyChange}
						className="text-purple-300/60"
					/>
				</div>

				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6">
					<WorldMap 
						selectedCompany={selectedCompany}
						className="text-purple-300/60" 
					/>
				</div>
			</div>
		</div>
	);
};

export default MapsPage;
