import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataApi } from '../api/dataApi';
import Header from '../components/common/Header';

const AddDataPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyId: '',
        companyName: '',
        fund: '',
        investment: '',
        fundSize: '',
        totalCapitalCommitted: '',
        fundInvestments: '',
        globalSouthDeals: '',
        globalSouthCountries: '',
        country: '',
        countryCapitalCatalyzed: '',
        theme: '',
        themeCapitalCatalyzed: '',
        totalEmissions: '',
        scope1Emissions: '',
        scope2Emissions: '',
        scope3Emissions: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const processedData = {
                ...formData,
                investment: parseFloat(formData.investment) || 0,
                fundSize: parseFloat(formData.fundSize) || 0,
                totalCapitalCommitted: parseFloat(formData.totalCapitalCommitted) || 0,
                fundInvestments: parseInt(formData.fundInvestments) || 0,
                globalSouthDeals: parseInt(formData.globalSouthDeals) || 0,
                globalSouthCountries: parseInt(formData.globalSouthCountries) || 0,
                countryCapitalCatalyzed: parseFloat(formData.countryCapitalCatalyzed) || 0,
                themeCapitalCatalyzed: parseFloat(formData.themeCapitalCatalyzed) || 0,
                totalEmissions: parseFloat(formData.totalEmissions) || 0,
                scope1Emissions: parseFloat(formData.scope1Emissions) || 0,
                scope2Emissions: parseFloat(formData.scope2Emissions) || 0,
                scope3Emissions: parseFloat(formData.scope3Emissions) || 0
            };

            const response = await dataApi.addData(processedData);
            
            if (response.success) {
                alert('Data added successfully!');
                navigate('/');
            }
        } catch (error) {
            console.error('Error adding data:', error);
            alert('Error adding data. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className='flex-1 overflow-auto'>
            <Header title='Add New Data' />
            <main className='max-w-3xl mx-auto py-6 px-4'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                        {[
                            { label: 'Company ID', name: 'companyId', type: 'text' },
                            { label: 'Company Name', name: 'companyName', type: 'text' },
                            { label: 'Fund', name: 'fund', type: 'text' },
                            { label: 'Investment ($M)', name: 'investment', type: 'number' },
                            { label: 'Fund Size ($M)', name: 'fundSize', type: 'number' },
                            { label: 'Total Capital Committed ($B)', name: 'totalCapitalCommitted', type: 'number' },
                            { label: 'Fund Investments', name: 'fundInvestments', type: 'number' },
                            { label: 'Global South Deals', name: 'globalSouthDeals', type: 'number' },
                            { label: 'Global South Countries', name: 'globalSouthCountries', type: 'number' },
                            { label: 'Country', name: 'country', type: 'text' },
                            { label: 'Country Capital Catalyzed ($M)', name: 'countryCapitalCatalyzed', type: 'number' },
                            { label: 'Theme', name: 'theme', type: 'text' },
                            { label: 'Theme Capital Catalyzed ($M)', name: 'themeCapitalCatalyzed', type: 'number' },
                            { label: 'Total Emissions (tons of CO2e)', name: 'totalEmissions', type: 'number' },
                            { label: 'Scope 1 Emissions (tons of CO2e)', name: 'scope1Emissions', type: 'number' },
                            { label: 'Scope 2 Emissions (tons of CO2e)', name: 'scope2Emissions', type: 'number' },
                            { label: 'Scope 3 Emissions (tons of CO2e)', name: 'scope3Emissions', type: 'number' }
                        ].map(({ label, name, type }) => (
                            <div key={name}>
                                <label className='block text-sm font-medium text-gray-300'>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white'
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type='submit'
                        className='w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                    >
                        Add Data
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddDataPage;