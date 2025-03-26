import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { dataApi } from '../../api/dataApi';
import { useData } from './DataContext';

const AddDataForm = ({ onDataAdded }) => {
    const { refreshData } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.companyId.trim()) newErrors.companyId = 'Company ID is required';
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.fund.trim()) newErrors.fund = 'Fund is required'; // Added fund validation since it's required in API
        if (!formData.investment) newErrors.investment = 'Investment is required';

        // Numeric validation
        [
            'investment', 'fundSize', 'totalCapitalCommitted', 'fundInvestments', 
            'globalSouthDeals', 'globalSouthCountries', 'countryCapitalCatalyzed', 
            'themeCapitalCatalyzed', 'totalEmissions', 'scope1Emissions', 
            'scope2Emissions', 'scope3Emissions'
        ].forEach((field) => {
            if (formData[field] && isNaN(parseFloat(formData[field]))) {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} must be a number`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Convert numeric fields to numbers
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
                // Refresh data immediately using DataContext
                await refreshData();
                
                // Show success message
                alert('Data added successfully!');

                // Reset form
                setFormData({
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
                
                // Call onDataAdded callback if provided
                if (onDataAdded) onDataAdded();
            } else {
                throw new Error('Failed to add data');
            }
        } catch (error) {
            setSubmitError(error.message || 'Error adding data. Please try again later.');
            console.error('Error adding data:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-black via-purple-950/30 to-black rounded-2xl border border-purple-900">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Company Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Company ID', name: 'companyId', type: 'text', placeholder: 'Enter company ID' },
                        { label: 'Company Name', name: 'companyName', type: 'text', placeholder: 'Enter company name' },
                        { label: 'Fund', name: 'fund', type: 'text', placeholder: 'Enter fund name' },
                        { label: 'Investment ($M)', name: 'investment', type: 'number', placeholder: 'Enter investment' },
                        { label: 'Fund Size ($M)', name: 'fundSize', type: 'number', placeholder: 'Enter fund size' },
                        { label: 'Total Capital Committed ($B)', name: 'totalCapitalCommitted', type: 'number', placeholder: 'Enter total capital' },
                        { label: 'Fund Investments', name: 'fundInvestments', type: 'number', placeholder: 'Enter number of fund investments' },
                        { label: 'Global South Deals Funded', name: 'globalSouthDeals', type: 'number', placeholder: 'Enter deals count' },
                        { label: 'Global South Countries Supported', name: 'globalSouthCountries', type: 'number', placeholder: 'Enter country count' },
                        { label: 'Country', name: 'country', type: 'text', placeholder: 'Enter country' },
                        { label: 'Country Capital Catalyzed ($M)', name: 'countryCapitalCatalyzed', type: 'number', placeholder: 'Enter country capital' },
                        { label: 'Theme', name: 'theme', type: 'text', placeholder: 'Enter theme' },
                        { label: 'Theme Capital Catalyzed ($M)', name: 'themeCapitalCatalyzed', type: 'number', placeholder: 'Enter theme capital' },
                        { label: 'Total Emissions by Fund (tons of CO2e)', name: 'totalEmissions', type: 'number', placeholder: 'Enter total emissions' },
                        { label: 'Scope 1 Emissions (tons of CO2e)', name: 'scope1Emissions', type: 'number', placeholder: 'Enter Scope 1 emissions' },
                        { label: 'Scope 2 Emissions (tons of CO2e)', name: 'scope2Emissions', type: 'number', placeholder: 'Enter Scope 2 emissions' },
                        { label: 'Scope 3 Emissions (tons of CO2e)', name: 'scope3Emissions', type: 'number', placeholder: 'Enter Scope 3 emissions' },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-purple-300 mb-1">
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className={`w-full bg-black rounded-lg px-4 py-2 text-white border ${
                                    errors[name] ? 'border-red-500' : 'border-purple-900'
                                } focus:outline-none focus:border-purple-300 placeholder-purple-300/50`}
                            />
                            {errors[name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                            )}
                        </div>
                    ))}
                </div>

                {submitError && (
                    <p className="text-red-500 text-sm mt-4">{submitError}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg border ${
                        isSubmitting 
                            ? 'bg-black border-purple-900 cursor-not-allowed' 
                            : 'bg-black border-purple-900 hover:bg-purple-950 hover:border-purple-300'
                    } text-purple-300 font-medium transition-all duration-200`}
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin mx-auto" size={20} />
                    ) : (
                        'Add Company Data'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddDataForm;